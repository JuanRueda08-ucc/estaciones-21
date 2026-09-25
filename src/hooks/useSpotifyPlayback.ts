"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PLAYLIST_URI,
  SpotifyError,
  clearTokens,
  getAccessToken,
  handleAuthRedirect,
  hasTokens,
  loadSpotifySdk,
  spotifyApi,
  spotifyConfigured,
  startLogin,
  type SdkPlayer,
  type SpotifyErrorKind,
} from "@/lib/spotify";

export type SpotifyStatus = "unconfigured" | "disconnected" | "connecting" | "ready" | "playing" | "paused" | "error";

const MESSAGES: Record<SpotifyErrorKind, string> = {
  denied: "No se autorizó el acceso a Spotify. Puedes intentarlo de nuevo o continuar sin música.",
  unauthorized: "Esta cuenta de Spotify no está autorizada para esta prueba. Hay que añadirla en el panel de desarrolladores de Spotify.",
  "no-premium": "Reproducir dentro de la web requiere Spotify Premium.",
  "token-expired": "La sesión de Spotify caducó. Vuelve a conectar.",
  playback: "No se pudo reproducir la canción. Inténtalo de nuevo.",
  sdk: "El reproductor de Spotify no se pudo iniciar en este navegador.",
  autoplay: "El navegador bloqueó el audio. Vuelve a pulsar «Reproducir en esta web».",
};

const START_TIMEOUT_MS = 10000;

type SdkTrack = { name: string; artists: { name: string }[] };
type SdkState = { paused: boolean; track_window: { current_track: SdkTrack } } | null;

const kindOf = (error: unknown): SpotifyErrorKind => (error instanceof SpotifyError ? error.kind : "sdk");

// One Web Playback SDK player for the whole page. This hook lives in the root client component, so the player
// survives every screen change; nothing here starts audio without a tap on "Reproducir en esta web".
export function useSpotifyPlayback() {
  const [status, setStatus] = useState<SpotifyStatus>(spotifyConfigured ? "disconnected" : "unconfigured");
  const [error, setError] = useState<{ kind: SpotifyErrorKind; message: string } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [deviceReady, setDeviceReady] = useState(false);
  const [track, setTrack] = useState<{ name: string; artists: string } | null>(null);
  const playerRef = useRef<SdkPlayer | null>(null);
  const deviceRef = useRef<string | null>(null);
  const startTimer = useRef<number | undefined>(undefined);

  const fail = useCallback((kind: SpotifyErrorKind) => {
    window.clearTimeout(startTimer.current);
    setError({ kind, message: MESSAGES[kind] });
    setStatus("error");
    setStarting(false);
  }, []);

  useEffect(() => {
    if (!spotifyConfigured) return;
    let cancelled = false;

    (async () => {
      try {
        await handleAuthRedirect();
      } catch (caught) {
        if (!cancelled) fail(kindOf(caught));
        return;
      }
      if (cancelled || !hasTokens()) return;

      setStatus("connecting");
      try {
        const me = (await (await spotifyApi("/me")).json()) as { product?: string };
        if (me.product !== "premium") throw new SpotifyError("no-premium");
        await loadSpotifySdk();
        if (cancelled || !window.Spotify) return;

        const player = new window.Spotify.Player({
          name: "Cuatro estaciones contigo",
          getOAuthToken: (callback) => {
            getAccessToken().then(callback).catch(() => fail("token-expired"));
          },
          volume: 0.8,
        });
        playerRef.current = player;

        player.addListener("ready", (({ device_id }: { device_id: string }) => {
          deviceRef.current = device_id;
          setDeviceReady(true);
          setStatus((current) => (current === "playing" || current === "paused" ? current : "ready"));
        }) as (payload: never) => void);
        player.addListener("not_ready", (() => {
          deviceRef.current = null;
          setDeviceReady(false);
          setStatus("connecting");
        }) as (payload: never) => void);
        player.addListener("player_state_changed", ((state: SdkState) => {
          window.clearTimeout(startTimer.current);
          setStarting(false);
          if (!state) {
            setStatus("ready");
            return;
          }
          const current = state.track_window.current_track;
          setError(null);
          setNotice(null);
          setTrack({ name: current.name, artists: current.artists.map((artist) => artist.name).join(", ") });
          setStatus(state.paused ? "paused" : "playing");
        }) as (payload: never) => void);
        player.addListener("initialization_error", (() => fail("sdk")) as (payload: never) => void);
        player.addListener("authentication_error", (() => fail("token-expired")) as (payload: never) => void);
        player.addListener("account_error", (() => fail("no-premium")) as (payload: never) => void);
        player.addListener("playback_error", (() => fail("playback")) as (payload: never) => void);
        player.addListener("autoplay_failed", (() => {
          setStarting(false);
          setNotice(MESSAGES.autoplay);
        }) as (payload: never) => void);

        if (!(await player.connect()) && !cancelled) fail("sdk");
      } catch (caught) {
        if (!cancelled) fail(kindOf(caught));
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(startTimer.current);
      playerRef.current?.disconnect();
      playerRef.current = null;
      deviceRef.current = null;
    };
  }, [fail]);

  const connect = useCallback(() => {
    setError(null);
    startLogin().catch(() => fail("denied"));
  }, [fail]);

  // Must run synchronously inside the tap: activateElement() unlocks audio on mobile browsers.
  const play = useCallback(() => {
    const player = playerRef.current;
    const deviceId = deviceRef.current;
    if (!player || !deviceId) return;
    player.activateElement().catch(() => {});
    setError(null);
    setNotice(null);
    setStarting(true);
    setStatus((current) => (current === "error" ? "ready" : current));
    window.clearTimeout(startTimer.current);
    startTimer.current = window.setTimeout(() => fail("playback"), START_TIMEOUT_MS);
    spotifyApi(`/me/player/play?device_id=${encodeURIComponent(deviceId)}`, { method: "PUT", body: JSON.stringify({ context_uri: PLAYLIST_URI }) }).catch((caught) => fail(kindOf(caught)));
  }, [fail]);

  const pause = useCallback(() => {
    playerRef.current?.pause().catch(() => fail("playback"));
  }, [fail]);

  const resume = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    player.activateElement().catch(() => {});
    player.resume().catch(() => fail("playback"));
  }, [fail]);

  const disconnect = useCallback(() => {
    window.clearTimeout(startTimer.current);
    playerRef.current?.disconnect();
    playerRef.current = null;
    deviceRef.current = null;
    clearTokens();
    setDeviceReady(false);
    setStatus("disconnected");
    setTrack(null);
    setError(null);
    setNotice(null);
    setStarting(false);
  }, []);

  return { status, error, notice, starting, deviceReady, track, connect, play, pause, resume, disconnect };
}

export type SpotifyPlayback = ReturnType<typeof useSpotifyPlayback>;
