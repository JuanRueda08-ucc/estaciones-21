"use client";

import { Check, LockKeyhole } from "lucide-react";
import type { Station } from "@/data/seasons";
import { SeasonIcon } from "@/components/SeasonIcon";

export function SeasonCard({ station, index, state, onOpen }: { station: Station; index: number; state: "locked" | "available" | "opened"; onOpen: () => void }) {
  const isLocked = state === "locked";
  const isOpened = state === "opened";

  return (
    <button
      className={`group relative flex min-h-[154px] w-full flex-col justify-between overflow-hidden rounded-[1.35rem] border p-5 text-left transition-all duration-300 sm:min-h-[176px] sm:p-6 ${isLocked ? "cursor-not-allowed border-[rgba(45,36,48,0.08)] bg-[rgba(45,36,48,0.035)] text-[var(--muted)]" : "border-[var(--line)] bg-white/25 hover:-translate-y-1 hover:border-[var(--ink)] hover:bg-white/55 hover:shadow-[0_18px_50px_rgba(61,45,41,0.10)]"}`}
      type="button"
      onClick={onOpen}
      disabled={isLocked}
      aria-label={isLocked ? `${station.name}, bloqueada` : `${station.name}, ${isOpened ? "volver a abrir" : "abrir"}`}
    >
      <span className="absolute -right-5 -top-7 h-24 w-24 rounded-full border border-current opacity-10 transition-transform duration-500 group-hover:scale-125" />
      <span className="relative flex items-start justify-between gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-current opacity-80" style={!isLocked ? { color: station.colors.accent } : undefined}>
          {isLocked ? <LockKeyhole aria-hidden="true" size={15} strokeWidth={1.5} /> : isOpened ? <Check aria-hidden="true" size={16} strokeWidth={1.8} /> : <SeasonIcon season={station.key} size={18} />}
        </span>
        <span className="eyebrow opacity-80">{station.number}</span>
      </span>
      <span className="relative block">
        <span className="serif block text-[1.85rem] leading-none tracking-[-0.035em] text-[var(--ink)]">{station.name}</span>
        <span className="mt-2 block text-[0.68rem] font-medium uppercase tracking-[0.11em] opacity-70">{isLocked ? "se abre después" : isOpened ? "descubierta" : "lista para abrir"}</span>
      </span>
    </button>
  );
}
