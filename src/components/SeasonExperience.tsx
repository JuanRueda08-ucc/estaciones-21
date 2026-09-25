"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { AccessGate } from "@/components/AccessGate";
import { Intro } from "@/components/Intro";
import { MusicPlayer } from "@/components/MusicPlayer";
import { FinalLetter } from "@/components/FinalLetter";
import { SeasonCard } from "@/components/SeasonCard";
import { SpringReveal } from "@/components/SpringReveal";
import { SummerReveal } from "@/components/SummerReveal";
import { AutumnReveal } from "@/components/AutumnReveal";
import { WinterReveal } from "@/components/WinterReveal";
import { stations } from "@/data/seasons";
import { useGiftProgress } from "@/hooks/useGiftProgress";
import { useSpotifyPlayback } from "@/hooks/useSpotifyPlayback";

const LEAVE_MS = 200;

type ChangeOptions = { focusId?: string; toTop?: boolean };

export function SeasonExperience() {
  const { unlocked, unlock, music, chooseMusic, started, openedCount, selectedStation, startExperience, openStation, clearSelection, resetExperience } = useGiftProgress();

  const spotify = useSpotifyPlayback();
  const [gateOpen, setGateOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [enterCount, setEnterCount] = useState(0);
  const busy = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const pendingFocus = useRef<string | undefined>(undefined);
  const gatePassed = started && unlocked;
  const showJourney = gatePassed && music !== null;
  const screen = showJourney ? "journey" : gatePassed ? "music" : gateOpen ? "gate" : "intro";
  const afterGateFocus = music === null ? "music-title" : "journey-title";

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Runs the current view's exit animation, then swaps the view. Ignores calls while a change is in flight.
  const change = useCallback((swap: () => void, { focusId, toTop }: ChangeOptions = {}) => {
    if (busy.current) return;
    busy.current = true;
    const finish = () => {
      swap();
      if (toTop) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      pendingFocus.current = focusId;
      setEnterCount((count) => count + 1);
      setLeaving(false);
      busy.current = false;
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    setLeaving(true);
    timer.current = window.setTimeout(finish, LEAVE_MS);
  }, []);

  // After a view change, move focus to a sensible element of the new view.
  useEffect(() => {
    const id = pendingFocus.current;
    pendingFocus.current = undefined;
    if (!id) return;
    const element = document.getElementById(id);
    if (!element) return;
    if (!element.matches("button, a, input")) element.setAttribute("tabindex", "-1");
    element.focus({ preventScroll: true });
  }, [enterCount]);

  const selectedKey = selectedStation?.key;
  const closeStation = useCallback(() => {
    change(clearSelection, { focusId: selectedKey ? `season-card-${selectedKey}` : undefined });
  }, [change, clearSelection, selectedKey]);

  function handleStart() {
    if (unlocked) change(startExperience, { focusId: afterGateFocus, toTop: true });
    else change(() => setGateOpen(true), { focusId: "gate-title", toTop: true });
  }

  function handleAccess() {
    change(
      () => {
        unlock();
        setGateOpen(false);
        startExperience();
      },
      { focusId: afterGateFocus, toTop: true },
    );
  }

  function handleMusic(choice: "on" | "off") {
    change(() => chooseMusic(choice), { focusId: "journey-title", toTop: true });
  }

  const screenLeaving = leaving && !selectedStation;
  const journeyClass = selectedStation ? "screen-hidden" : screenLeaving ? "screen-leave" : enterCount > 0 ? "screen-enter" : "";
  const gateLeaving = screenLeaving && screen !== "journey" ? "screen-leave" : "";

  return (
    <main className="paper-grain overflow-x-hidden">
      {screen === "intro" ? <div key={`intro-${enterCount}`} className={gateLeaving} inert={screenLeaving}><Intro onStart={handleStart} /></div> : null}
      {screen === "gate" ? <div key={`gate-${enterCount}`} className={gateLeaving} inert={screenLeaving}><AccessGate onBack={() => change(() => setGateOpen(false), { focusId: "cover-title", toTop: true })} onSuccess={handleAccess} /></div> : null}

      {music === "on" || screen === "music" ? (
        <MusicPlayer
          spotify={spotify}
          mode={screen === "music" ? "picker" : "dock"}
          showToggle={showJourney}
          entering={enterCount > 0}
          leaving={leaving}
          onContinue={() => handleMusic("on")}
          onSkip={() => handleMusic("off")}
        />
      ) : null}

      {showJourney ? (
        <div key={`journey-${enterCount}`} className={journeyClass} inert={screenLeaving}>
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
                  return <SeasonCard key={station.key} station={station} index={index} state={state} onOpen={() => change(() => openStation(index))} />;
                })}
              </div>
            </div>

            <div id="reveal" className="mt-12 scroll-mt-6 sm:mt-16">
              <div className="flex min-h-[180px] items-center justify-between gap-8 rounded-[1.7rem] border border-dashed border-[var(--line)] px-6 py-7 sm:px-9">
                <div>
                  <p className="eyebrow">Tu siguiente gesto</p>
                  <p className="serif mt-3 text-[2rem] leading-none tracking-[-0.035em] text-[var(--ink)]">Elige una tarjeta para revelar el detalle.</p>
                </div>
                <span className="hidden h-12 w-12 shrink-0 rounded-full border border-[var(--line)] sm:block" />
              </div>
            </div>

            {openedCount === stations.length ? <div className="mt-10"><FinalLetter /></div> : null}

            <div className="mt-12 flex justify-end border-t border-[var(--line)] pt-5">
              <button className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.13em] text-[var(--muted)] transition-colors hover:text-[var(--ink)]" type="button" onClick={() => change(resetExperience, { focusId: "cover-title", toTop: true })}>
                <RotateCcw aria-hidden="true" size={13} /> reiniciar experiencia
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {selectedStation ? (
        <div className={leaving ? "overlay-leave" : "overlay-enter"}>
          {selectedStation.key === "spring" ? <SpringReveal station={selectedStation} onBack={closeStation} /> : null}
          {selectedStation.key === "summer" ? <SummerReveal station={selectedStation} onBack={closeStation} /> : null}
          {selectedStation.key === "autumn" ? <AutumnReveal station={selectedStation} onBack={closeStation} /> : null}
          {selectedStation.key === "winter" ? <WinterReveal station={selectedStation} onBack={closeStation} /> : null}
        </div>
      ) : null}

      <footer className={`mx-auto flex w-full max-w-[1180px] items-center justify-between px-5 ${music === "on" ? "pb-24" : "pb-8"} pt-2 text-[0.62rem] font-bold uppercase tracking-[0.15em] text-[var(--muted)] sm:px-8 lg:px-14`}>
        <span>una carta interactiva</span>
        <span>hecha para abrirse despacio</span>
      </footer>
    </main>
  );
}
