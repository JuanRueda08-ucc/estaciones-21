"use client";

import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { stations } from "@/data/estaciones";
import { SeasonIcon } from "@/components/experience/SeasonIcon";

export function Cover({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative flex min-h-[min(820px,100svh)] items-center overflow-hidden px-5 py-10 sm:px-8 lg:px-14" aria-labelledby="cover-title">
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(350px,0.76fr)] lg:gap-20">
        <div className="relative z-10 max-w-[680px]">
          <div className="animate-entrance flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] text-[var(--accent)]">
              <Sparkles aria-hidden="true" size={14} strokeWidth={1.5} />
            </span>
            <p className="eyebrow">Una carta para abrir despacio</p>
          </div>

          <h1 id="cover-title" className="animate-entrance-delay serif mt-8 max-w-[760px] text-[clamp(4rem,10vw,8.7rem)] font-medium leading-[0.82] tracking-[-0.06em] text-[var(--ink)]">
            Cuatro<br /><span className="italic text-[var(--accent)]">estaciones</span><br />contigo.
          </h1>

          <div className="animate-entrance-delay-2 mt-9 flex max-w-[520px] flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-[315px] text-[0.95rem] leading-7 text-[var(--muted)]">
              Cuatro regalos, cuatro momentos. Una pequeña forma de decirte que me gusta compartir contigo cada clima de la vida.
            </p>
            <button className="button-ink shrink-0 self-start sm:self-end" type="button" onClick={onStart}>
              Comenzar <ArrowUpRight aria-hidden="true" size={16} />
            </button>
          </div>
        </div>

        <div className="animate-entrance-delay-2 relative mx-auto w-full max-w-[450px] lg:ml-auto">
          <div className="absolute -left-6 -top-8 h-24 w-24 rounded-full border border-[var(--line)] opacity-70 sm:-left-10 sm:-top-10 sm:h-32 sm:w-32" />
          <div className="relative aspect-[0.83] overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[#efe6da]/70 p-5 shadow-[0_30px_90px_rgba(61,45,41,0.12)] sm:p-7">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <span className="eyebrow">Carta / 2026</span>
              <span className="serif text-xl italic text-[var(--accent)]">para ti</span>
            </div>
            <div className="relative flex h-[calc(100%-62px)] flex-col justify-between pt-7">
              <div>
                <p className="eyebrow">Un año en cuatro gestos</p>
                <p className="serif mt-4 max-w-[270px] text-[clamp(2.5rem,6vw,4.1rem)] leading-[0.9] tracking-[-0.045em] text-[var(--ink)]">
                  Cada estación guarda algo.
                </p>
              </div>
              <div>
                <div className="mb-7 flex items-end justify-between gap-2">
                  {stations.map((station, index) => (
                    <div key={station.key} className="flex flex-1 flex-col gap-3">
                      <div className="h-24 overflow-hidden rounded-full border border-[var(--line)] bg-white/30 sm:h-32" style={{ backgroundColor: `${station.colors.wash}99` }}>
                        <div className="flex h-full items-center justify-center text-[var(--accent)]" style={{ color: station.colors.accent }}>
                          <SeasonIcon season={station.key} size={index === 0 ? 25 : 22} />
                        </div>
                      </div>
                      <span className="text-center text-[0.62rem] font-bold uppercase tracking-[0.13em] text-[var(--muted)]">{station.number}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-[0.7rem] font-medium text-[var(--muted)]">
                  <span className="h-px flex-1 bg-[var(--line)]" />
                  <span>abre la primera cuando estés lista</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -right-2 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--paper)] shadow-xl sm:-right-6">
            <ArrowDown aria-hidden="true" size={17} strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </section>
  );
}
