"use client";

import { ArrowDownRight, Heart } from "lucide-react";

export function FinalLetter() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--ink)] px-6 py-12 text-[var(--paper)] shadow-[0_24px_80px_rgba(45,36,48,0.18)] sm:px-12 sm:py-16" aria-labelledby="final-letter-title">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
      <div className="absolute -right-7 -top-7 h-28 w-28 rounded-full border border-white/10" />
      <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="eyebrow !text-white/55">Carta final / sin prisa</p>
          <div className="mt-7 flex items-center gap-3 text-[var(--paper)]/60">
            <span className="h-px w-16 bg-white/25" />
            <Heart aria-hidden="true" size={15} fill="currentColor" strokeWidth={1.1} />
          </div>
        </div>
        <div>
          <h2 id="final-letter-title" className="serif max-w-[620px] text-[clamp(3.2rem,7vw,6.4rem)] leading-[0.85] tracking-[-0.06em]">
            Gracias por ser mi lugar favorito en cualquier estación.
          </h2>
          <p className="mt-8 max-w-[500px] text-[0.95rem] leading-7 text-white/65">
            Esto es solo una forma pequeña de celebrar todo lo bonito que todavía nos queda por descubrir. Guarda cada detalle, igual que yo guardo la suerte de coincidir contigo.
          </p>
          <div className="mt-10 flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.13em] text-white/45">
            <span>con cariño</span>
            <ArrowDownRight aria-hidden="true" size={15} />
          </div>
        </div>
      </div>
    </section>
  );
}
