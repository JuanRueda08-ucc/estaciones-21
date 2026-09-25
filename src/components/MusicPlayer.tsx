"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Music2, X } from "lucide-react";
import { PLAYLIST_EMBED_URL, PLAYLIST_URL } from "@/data/music";

const LOAD_TIMEOUT_MS = 12000;

type MusicPlayerProps = {
  mode: "picker" | "dock";
  showToggle: boolean;
  entering: boolean;
  leaving: boolean;
  onContinue: () => void;
  onSkip: () => void;
};

// One Spotify Embed for the whole experience. The iframe lives in the same DOM node whether the player is the
// full-screen picker, an open dock panel or a collapsed (off-screen) dock panel, so it is never reloaded.
export function MusicPlayer({ mode, showToggle, entering, leaving, onContinue, onSkip }: MusicPlayerProps) {
  const picker = mode === "picker";
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");
  const panelShown = picker || open;

  useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setTimeout(() => setStatus("failed"), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (!picker) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [picker]);

  useEffect(() => {
    if (picker || !open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [picker, open]);

  const rootClass = picker
    ? `fixed inset-0 z-[60] overflow-y-auto bg-[var(--paper)] ${leaving ? "overlay-leave" : entering ? "overlay-enter" : ""}`
    : "pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3";

  const panelClass = picker
    ? "relative mx-auto w-full max-w-[520px] rounded-[2rem] border border-[var(--line)] bg-[#efe6da]/70 p-6 shadow-[0_30px_90px_rgba(61,45,41,0.12)] sm:p-9"
    : open
      ? "pointer-events-auto w-[min(380px,calc(100vw-2rem))] rounded-[1.5rem] border border-[var(--line)] bg-[var(--paper)] p-4 shadow-[0_18px_50px_rgba(61,45,41,0.16)]"
      : "pointer-events-none fixed -left-[9999px] top-0 w-[380px]";

  return (
    <div className={rootClass} role={picker ? "dialog" : "region"} aria-modal={picker ? true : undefined} aria-labelledby={picker ? "music-title" : undefined} aria-label={picker ? undefined : "Música"}>
      <div className={picker ? "paper-grain flex min-h-dvh items-center px-5 py-10 sm:px-8" : ""}>
        <div id="music-panel" className={panelClass} inert={!panelShown}>
          {picker ? (
            <div>
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] text-[var(--accent)]">
                    <Music2 aria-hidden="true" size={14} strokeWidth={1.5} />
                  </span>
                  <span className="eyebrow">Un poco de música</span>
                </span>
                <span className="serif text-xl italic text-[var(--accent)]">para ti</span>
              </div>
              <h1 id="music-title" className="serif mt-8 text-[clamp(2.6rem,7vw,3.6rem)] leading-[0.9] tracking-[-0.045em] text-[var(--ink)]">
                Escoge una canción.
              </h1>
              <p className="mt-5 max-w-[400px] text-[0.92rem] leading-7 text-[var(--muted)]">
                Elige una de las cinco canciones y pulsa Play. Después podrás pausarla o cambiarla desde el botón de música.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between pb-3">
              <span className="eyebrow">Música</span>
              <button className="button-quiet" type="button" onClick={() => setOpen(false)} aria-label="Cerrar reproductor">
                <X aria-hidden="true" size={15} />
              </button>
            </div>
          )}

          <div className={picker ? "-mx-3 mt-6 sm:mx-0" : ""}>
            <iframe
              className="block w-full rounded-[12px]"
              style={{ height: 352, border: 0 }}
              src={PLAYLIST_EMBED_URL}
              title="Reproductor de Spotify con la playlist"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              onLoad={() => setStatus("loaded")}
            />
          </div>

          {status === "failed" ? (
            <p role="status" className="mt-4 text-[0.85rem] leading-6 text-[var(--accent)]">
              El reproductor no ha cargado. Puedes abrir la playlist directamente en Spotify o continuar sin música.
            </p>
          ) : null}

          {picker ? (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
              <button className="button-ink" type="button" onClick={onContinue}>
                Continuar <ArrowUpRight aria-hidden="true" size={16} />
              </button>
              <button className="button-quiet" type="button" onClick={onSkip}>
                Continuar sin música
              </button>
            </div>
          ) : null}
          <div className={picker ? "mt-6 border-t border-[var(--line)] pt-5" : "pt-3"}>
            <a className="button-quiet" href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer">
              Abrir en Spotify <ArrowUpRight aria-hidden="true" size={14} />
            </a>
          </div>
        </div>
      </div>

      {!picker && showToggle ? (
        <button
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] shadow-[0_10px_30px_rgba(61,45,41,0.16)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
          type="button"
          aria-expanded={open}
          aria-controls="music-panel"
          aria-label={open ? "Ocultar reproductor de música" : "Mostrar reproductor de música"}
          onClick={() => setOpen((current) => !current)}
        >
          <Music2 aria-hidden="true" size={18} strokeWidth={1.6} />
        </button>
      ) : null}
    </div>
  );
}
