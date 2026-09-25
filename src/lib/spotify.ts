// Spotify Authorization Code flow with PKCE for a browser-only app. There is no client secret anywhere in this project.
// Tokens live in localStorage and are never written to the console.

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ?? "";
export const spotifyConfigured = CLIENT_ID !== "";

export const PLAYLIST_URI = "spotify:playlist:5eMK6UuauVRB4VB7EoeGXz";

const SCOPES = ["streaming", "user-read-email", "user-read-private", "user-modify-playback-state", "user-read-playback-state"].join(" ");
const AUTH_KEY = "cuatro-estaciones-spotify-auth";
const PKCE_KEY = "cuatro-estaciones-spotify-pkce";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

export type SpotifyErrorKind = "denied" | "unauthorized" | "no-premium" | "token-expired" | "playback" | "sdk" | "autoplay";

export class SpotifyError extends Error {
  kind: SpotifyErrorKind;
  constructor(kind: SpotifyErrorKind) {
    super(kind);
    this.kind = kind;
  }
}

type Tokens = { access: string; refresh: string; expiresAt: number };
type TokenResponse = { access_token: string; refresh_token?: string; expires_in: number };

// The redirect URI is the site root, so no extra route is needed. Register this exact value in the Spotify dashboard.
export function redirectUri() {
  return `${window.location.origin}/`;
}

function readTokens(): Tokens | null {
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as Tokens) : null;
  } catch {
    return null;
  }
}

function writeTokens(tokens: Tokens) {
  try {
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(tokens));
  } catch {}
}

export function clearTokens() {
  try {
    window.localStorage.removeItem(AUTH_KEY);
  } catch {}
}

export function hasTokens() {
  return readTokens() !== null;
}

function saveTokenResponse(json: TokenResponse, previousRefresh = "") {
  const tokens = { access: json.access_token, refresh: json.refresh_token ?? previousRefresh, expiresAt: Date.now() + json.expires_in * 1000 };
  writeTokens(tokens);
  return tokens;
}

function randomString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(length)), (value) => chars[value % chars.length]).join("");
}

async function challengeFor(verifier: string) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));
  return btoa(String.fromCharCode(...digest)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function startLogin() {
  const verifier = randomString(64);
  const state = randomString(16);
  window.sessionStorage.setItem(PKCE_KEY, JSON.stringify({ verifier, state }));
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri(),
    scope: SCOPES,
    state,
    code_challenge_method: "S256",
    code_challenge: await challengeFor(verifier),
  });
  window.location.assign(`https://accounts.spotify.com/authorize?${params}`);
}

async function processRedirect(): Promise<"none" | "connected"> {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const state = url.searchParams.get("state");
  if (!code && !error) return "none";

  for (const key of ["code", "error", "state"]) url.searchParams.delete(key);
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);

  let pkce: { verifier: string; state: string } | null = null;
  try {
    pkce = JSON.parse(window.sessionStorage.getItem(PKCE_KEY) ?? "null");
    window.sessionStorage.removeItem(PKCE_KEY);
  } catch {}

  if (error || !code || !pkce || pkce.state !== state) throw new SpotifyError("denied");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: CLIENT_ID, grant_type: "authorization_code", code, redirect_uri: redirectUri(), code_verifier: pkce.verifier }),
  });
  if (!response.ok) throw new SpotifyError("denied");
  saveTokenResponse((await response.json()) as TokenResponse);
  return "connected";
}

// Cached so a double effect run (React Strict Mode) never redeems the one-time code twice.
let redirectResult: Promise<"none" | "connected"> | null = null;
export function handleAuthRedirect() {
  if (!redirectResult) redirectResult = processRedirect();
  return redirectResult;
}

let refreshing: Promise<Tokens> | null = null;
function refreshTokens(current: Tokens): Promise<Tokens> {
  if (!refreshing) {
    refreshing = (async () => {
      if (!current.refresh) throw new SpotifyError("token-expired");
      const response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ client_id: CLIENT_ID, grant_type: "refresh_token", refresh_token: current.refresh }),
      });
      if (!response.ok) {
        clearTokens();
        throw new SpotifyError("token-expired");
      }
      return saveTokenResponse((await response.json()) as TokenResponse, current.refresh);
    })().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

export async function getAccessToken(force = false) {
  let tokens = readTokens();
  if (!tokens) throw new SpotifyError("token-expired");
  if (force || tokens.expiresAt - Date.now() < 60_000) tokens = await refreshTokens(tokens);
  return tokens.access;
}

export async function spotifyApi(path: string, init: RequestInit = {}, retry = true): Promise<Response> {
  const token = await getAccessToken();
  const response = await fetch(`https://api.spotify.com/v1${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init.headers },
  });
  if (response.status === 401) {
    if (!retry) throw new SpotifyError("token-expired");
    await getAccessToken(true);
    return spotifyApi(path, init, false);
  }
  if (response.status === 403) {
    let reason = "";
    try {
      reason = (await response.clone().json())?.error?.reason ?? "";
    } catch {}
    throw new SpotifyError(reason === "PREMIUM_REQUIRED" ? "no-premium" : "unauthorized");
  }
  if (!response.ok) throw new SpotifyError("playback");
  return response;
}

type SdkPlayer = {
  connect(): Promise<boolean>;
  disconnect(): void;
  addListener(event: string, callback: (payload: never) => void): boolean;
  pause(): Promise<void>;
  resume(): Promise<void>;
  activateElement(): Promise<void>;
};

export type SdkPlayerOptions = { name: string; getOAuthToken: (callback: (token: string) => void) => void; volume?: number };

declare global {
  interface Window {
    Spotify?: { Player: new (options: SdkPlayerOptions) => SdkPlayer };
    onSpotifyWebPlaybackSDKReady?: () => void;
  }
}

export type { SdkPlayer };

let sdkPromise: Promise<void> | null = null;
export function loadSpotifySdk() {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise<void>((resolve, reject) => {
    if (window.Spotify) {
      resolve();
      return;
    }
    window.onSpotifyWebPlaybackSDKReady = () => resolve();
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.onerror = () => {
      sdkPromise = null;
      reject(new SpotifyError("sdk"));
    };
    document.body.appendChild(script);
  });
  return sdkPromise;
}
