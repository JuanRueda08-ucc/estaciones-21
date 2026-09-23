"use client";

import { ArrowLeft, ImageOff } from "lucide-react";
import type { Station } from "@/data/seasons";
import { SeasonIcon } from "@/components/SeasonIcon";

export function SeasonReveal({ station, onBack }: { station: Station; onBack: () => void }) {
  return (
    <article className="overflow-hidden rounded-[1.8rem] border border-[var(--line)] bg-white/45 shadow-[0_24px_80px_rgba(61,45,41,0.10)] animate-entrance" style={{ backgroundColor: `${station.colors.wash}cc` }} aria-labelledby={`reveal-${station.key}`}>
      <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative min-h-[325px] overflow-hidden border-b border-[var(--line)] lg:min-h-[500px] lg:border-b-0 lg:border-r">
          <img className="absolute inset-0 h-full w-full object-cover" src={station.image} alt={`Imagen provisional pendiente para ${station.gift}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(45,36,48,0.48)] via-transparent to-transparent" />
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/50 bg-white/25 px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[var(--ink)] backdrop-blur-sm">
            <ImageOff aria-hidden="true" size={13} /> imagen provisional
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 text-white">
            <div>
              <p className="eyebrow !text-white/75">{station.number} / {station.name}</p>
              <p className="serif mt-2 text-3xl italic leading-none">{station.label}</p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/10 backdrop-blur-sm" style={{ color: station.colors.accent }}>
              <SeasonIcon season={station.key} size={20} />
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between p-6 sm:p-9 lg:p-11">
          <div>
            <p className="eyebrow" style={{ color: station.colors.accent }}>Para abrir este momento</p>
            <h2 id={`reveal-${station.key}`} className="serif mt-5 max-w-[480px] text-[clamp(3rem,6vw,5.4rem)] leading-[0.86] tracking-[-0.055em]" style={{ color: station.colors.ink }}>
              {station.gift}
            </h2>
            <p className="serif mt-8 max-w-[470px] text-[1.65rem] leading-[1.08] text-[var(--ink)] sm:text-[2rem]">“{station.message}”</p>
            <p className="mt-6 max-w-[410px] text-[0.92rem] leading-7 text-[var(--muted)]">{station.detail}</p>
          </div>
          <div className="mt-10 border-t border-[var(--line)] pt-5">
            <button className="button-quiet" type="button" onClick={onBack}>
              <ArrowLeft aria-hidden="true" size={15} /> volver a las estaciones
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
