"use client";

import type { SpotifyPlayback, SpotifyStatus } from "@/hooks/useSpotifyPlayback";

const LABELS: Record<SpotifyStatus, string> = {
  unconfigured: "Sin configurar",
  disconnected: "Sin conectar",
  connecting: "Conectando…",
  ready: "Listo",
  playing: "Reproduciendo",
  paused: "Pausado",
  error: "Error",
};

// Temporary test controls for the Web Playback SDK. The Embed below stays until this path is confirmed on a phone.
export function SpotifyControls({ spotify }: { spotify: SpotifyPlayback }) {
  const { status, error, notice, starting, deviceReady, track, connect, play, pause, resume, disconnect } = spotify;
  const showConnect = status === "disconnected" || (status === "error" && !deviceReady);
  const canPlay = deviceReady && !starting && status !== "playing";

  return (
    <div className="mb-4 rounded-[1rem] border border-dashed border-[var(--line)] p-3" data-testid="spotify-controls">
      <p className="eyebrow">Prueba · Reproductor en la web</p>
      <p className="mt-2 text-[0.85rem] text-[var(--ink)]" aria-live="polite">
        {LABELS[status]}
        {starting ? " · esperando confirmación de Spotify…" : ""}
      </p>
      {status === "unconfigured" ? (
        <p className="mt-1 text-[0.8rem] leading-5 text-[var(--muted)]">Falta la variable NEXT_PUBLIC_SPOTIFY_CLIENT_ID. El Embed de abajo sigue disponible.</p>
      ) : null}
      {track && (status === "playing" || status === "paused") ? (
        <p className="mt-1 text-[0.8rem] leading-5 text-[var(--muted)]">
          {track.name} · {track.artists}
        </p>
      ) : null}
      {notice ? <p className="mt-1 text-[0.8rem] leading-5 text-[var(--accent)]">{notice}</p> : null}
      {error ? (
        <p role="alert" className="mt-1 text-[0.8rem] leading-5 text-[var(--accent)]">
          {error.message}
        </p>
      ) : null}

      {status !== "unconfigured" ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          {showConnect ? (
            <button className="button-ink !min-h-10 !px-4 !py-2" type="button" onClick={connect}>
              Conectar Spotify
            </button>
          ) : null}
          <button className="button-ink !min-h-10 !px-4 !py-2 disabled:cursor-not-allowed disabled:opacity-40" type="button" onClick={play} disabled={!canPlay}>
            Reproducir en esta web
          </button>
          {status === "playing" ? (
            <button className="button-quiet" type="button" onClick={pause}>
              Pausar
            </button>
          ) : null}
          {status === "paused" ? (
            <button className="button-quiet" type="button" onClick={resume}>
              Reanudar
            </button>
          ) : null}
          {status !== "disconnected" ? (
            <button className="button-quiet" type="button" onClick={disconnect}>
              Desconectar
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
