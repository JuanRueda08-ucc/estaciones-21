"use client";

import { RotateCcw } from "lucide-react";
import { Intro } from "@/components/Intro";
import { FinalLetter } from "@/components/FinalLetter";
import { SeasonCard } from "@/components/SeasonCard";
import { SpringReveal } from "@/components/SpringReveal";
import { SummerReveal } from "@/components/SummerReveal";
import { SeasonReveal } from "@/components/SeasonReveal";
import { stations } from "@/data/seasons";
import { useGiftProgress } from "@/hooks/useGiftProgress";

export function SeasonExperience() {
  const { started, openedCount, selectedStation, startExperience, openStation, clearSelection, resetExperience } = useGiftProgress();

  return (
    <main className="paper-grain overflow-x-hidden">
      {!started ? <Intro onStart={startExperience} /> : null}

      {started ? (
        <>
          <header className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-5 pb-5 pt-7 sm:px-8 lg:px-14 lg:pt-10">
            <a className="serif text-xl italic text-[var(--ink)]" href="#journey" aria-label="Volver al inicio de la experiencia">para ti</a>
            <div className="flex items-center gap-4">
              <span className="eyebrow hidden sm:inline">cuatro estaciones contigo</span>
              <span className="h-px w-8 bg-[var(--line)] sm:w-14" />
              <span className="eyebrow">{String(openedCount).padStart(2, "0")} / 04</span>
            </div>
          </header>

          <section id="journey" className="mx-auto w-full max-w-[1180px] scroll-mt-5 px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:px-14 lg:pb-24 lg:pt-20" aria-labelledby="journey-title">
            <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
              <div>
                <p className="eyebrow">El recorrido</p>
                <h1 id="journey-title" className="serif mt-6 max-w-[350px] text-[clamp(3.4rem,6vw,5.6rem)] leading-[0.86] tracking-[-0.055em] text-[var(--ink)]">Una estación a la vez.</h1>
                <p className="mt-7 max-w-[320px] text-[0.92rem] leading-7 text-[var(--muted)]">Cada regalo tiene su propio momento. Cuando abras uno, el siguiente encontrará la forma de aparecer.</p>
                <div className="mt-9 flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  <span className="h-px w-12 bg-[var(--line)]" />
                  {openedCount === 0 ? "empieza por primavera" : openedCount === stations.length ? "todo descubierto" : `${stations.length - openedCount} por descubrir`}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {stations.map((station, index) => {
                  const state = index < openedCount ? "opened" : index === openedCount ? "available" : "locked";
                  return <SeasonCard key={station.key} station={station} index={index} state={state} onOpen={() => openStation(index)} />;
                })}
              </div>
            </div>

            <div id="reveal" className="mt-12 scroll-mt-6 sm:mt-16">
              {selectedStation && selectedStation.key !== "spring" && selectedStation.key !== "summer" ? (
                <SeasonReveal station={selectedStation} onBack={() => clearSelection()} />
              ) : (
                <div className="flex min-h-[180px] items-center justify-between gap-8 rounded-[1.7rem] border border-dashed border-[var(--line)] px-6 py-7 sm:px-9">
                  <div>
                    <p className="eyebrow">Tu siguiente gesto</p>
                    <p className="serif mt-3 text-[2rem] leading-none tracking-[-0.035em] text-[var(--ink)]">Elige una tarjeta para revelar el detalle.</p>
                  </div>
                  <span className="hidden h-12 w-12 shrink-0 rounded-full border border-[var(--line)] sm:block" />
                </div>
              )}
            </div>

            {openedCount === stations.length ? <div className="mt-10"><FinalLetter /></div> : null}

            <div className="mt-12 flex justify-end border-t border-[var(--line)] pt-5">
              <button className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.13em] text-[var(--muted)] transition-colors hover:text-[var(--ink)]" type="button" onClick={resetExperience}>
                <RotateCcw aria-hidden="true" size={13} /> reiniciar experiencia
              </button>
            </div>
          </section>
        </>
      ) : null}

      {selectedStation?.key === "spring" ? <SpringReveal station={selectedStation} onBack={clearSelection} /> : null}
      {selectedStation?.key === "summer" ? <SummerReveal station={selectedStation} onBack={clearSelection} /> : null}

      <footer className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-5 pb-8 pt-2 text-[0.62rem] font-bold uppercase tracking-[0.15em] text-[var(--muted)] sm:px-8 lg:px-14">
        <span>una carta interactiva</span>
        <span>hecha para abrirse despacio</span>
      </footer>
    </main>
  );
}
