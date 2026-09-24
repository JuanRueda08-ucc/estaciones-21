"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, ImageOff } from "lucide-react";
import type { Station } from "@/data/seasons";
import { SeasonIcon } from "@/components/SeasonIcon";

const LEAVES = [
  { left: "12%", size: 26, color: "#98634d", delay: 0, sway: "36px" },
  { left: "34%", size: 20, color: "#b77a3d", delay: 180, sway: "-30px" },
  { left: "58%", size: 30, color: "#7f5340", delay: 90, sway: "40px" },
  { left: "76%", size: 22, color: "#a4703f", delay: 260, sway: "-34px" },
  { left: "90%", size: 18, color: "#98634d", delay: 140, sway: "26px" },
];

export function AutumnReveal({ station, onBack }: { station: Station; onBack: () => void }) {
  const backRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    backRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onBack]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--paper)]" role="dialog" aria-modal="true" aria-labelledby={`reveal-${station.key}`}>
      <div className="paper-grain min-h-dvh" style={{ backgroundColor: `${station.colors.wash}66` }}>
        <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden="true">
          {LEAVES.map((leaf, i) => (
            <svg key={i} className="autumn-leaf absolute top-0" style={{ left: leaf.left, width: leaf.size, height: leaf.size, color: leaf.color, animationDelay: `${leaf.delay}ms`, ["--sway" as string]: leaf.sway }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6 6 4 12 8 17c1.5 1.8 3 2.6 4 5 1-2.4 2.5-3.2 4-5 4-5 2-11-4-15z" />
            </svg>
          ))}
        </div>
        <div className="relative mx-auto grid min-h-dvh w-full max-w-[1180px] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative min-h-[42dvh] overflow-hidden border-b border-[var(--line)] lg:min-h-dvh lg:border-b-0 lg:border-r">
            <img className="absolute inset-0 h-full w-full object-cover" src={station.image} alt={`Imagen provisional pendiente para ${station.gift}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(45,36,48,0.48)] via-transparent to-transparent" />
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/50 bg-white/25 px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[var(--ink)] backdrop-blur-sm">
              <ImageOff aria-hidden="true" size={13} /> imagen provisional
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 text-white">
              <p className="serif text-3xl italic leading-none">{station.label}</p>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/10 backdrop-blur-sm" style={{ color: station.colors.accent }}>
                <SeasonIcon season={station.key} size={20} />
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between px-6 pb-8 pt-8 sm:px-9 lg:px-14 lg:py-12">
            <div>
              <div className="flex items-center gap-4">
                <span className="relative flex h-16 w-16 items-center justify-center" style={{ color: station.colors.accent }} aria-hidden="true">
                  <SeasonIcon season={station.key} size={28} />
                </span>
                <p className="eyebrow autumn-content" style={{ color: station.colors.accent }}>{station.number} / {station.name}</p>
              </div>
              <h1 id={`reveal-${station.key}`} className="serif autumn-content mt-8 text-[clamp(4rem,9vw,7rem)] leading-[0.84] tracking-[-0.055em]" style={{ color: station.colors.ink }}>
                <span className="mr-4 italic" style={{ color: station.colors.accent }}>{station.number}</span>{station.name}
              </h1>
              <p className="eyebrow autumn-content-2 mt-10" style={{ color: station.colors.accent }}>Para abrir este momento</p>
              <h2 className="serif autumn-content-2 mt-4 max-w-[480px] text-[clamp(2.4rem,5vw,4rem)] leading-[0.9] tracking-[-0.045em]" style={{ color: station.colors.ink }}>{station.gift}</h2>
              <p className="serif autumn-content-2 mt-6 max-w-[470px] text-[1.65rem] leading-[1.08] text-[var(--ink)] sm:text-[2rem]">“{station.message}”</p>
              <p className="autumn-content-2 mt-6 max-w-[410px] text-[0.92rem] leading-7 text-[var(--muted)]">{station.detail}</p>
            </div>
            <div className="mt-10 border-t border-[var(--line)] pt-5">
              <button ref={backRef} className="button-ink" type="button" onClick={onBack}>
                <ArrowLeft aria-hidden="true" size={15} /> volver al recorrido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
