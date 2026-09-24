"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowUpRight, KeyRound } from "lucide-react";

const PASSWORD = "210906";
const HINT = "Una fecha muy especial🌻";

export function AccessGate({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const inputId = useId();
  const errorId = useId();
  const hintId = useId();
  const [value, setValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (value === PASSWORD) {
      onSuccess();
    } else {
      setHasError(true);
    }
  }

  return (
    <section className="relative flex min-h-[min(820px,100svh)] items-center overflow-hidden px-5 py-10 sm:px-8 lg:px-14" aria-labelledby="gate-title">
      <div className="mx-auto w-full max-w-[520px]">
        <div className="relative">
          <div className="absolute -left-6 -top-8 h-24 w-24 rounded-full border border-[var(--line)] opacity-70 sm:-left-10 sm:-top-10 sm:h-32 sm:w-32" />
          <form className="animate-entrance relative rounded-[2rem] border border-[var(--line)] bg-[#efe6da]/70 p-6 shadow-[0_30px_90px_rgba(61,45,41,0.12)] sm:p-9" onSubmit={submit} noValidate>
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] text-[var(--accent)]">
                  <KeyRound aria-hidden="true" size={14} strokeWidth={1.5} />
                </span>
                <span className="eyebrow">Antes de abrir</span>
              </span>
              <span className="serif text-xl italic text-[var(--accent)]">para ti</span>
            </div>

            <h1 id="gate-title" className="serif mt-8 text-[clamp(2.6rem,7vw,3.6rem)] leading-[0.9] tracking-[-0.045em] text-[var(--ink)]">
              Una clave para abrir la carta.
            </h1>

            <label htmlFor={inputId} className="eyebrow mt-8 block">Seis dígitos</label>
            <input
              id={inputId}
              className="serif mt-3 w-full rounded-[1.1rem] border border-[var(--line)] bg-white/40 px-5 py-4 text-center text-[2rem] tracking-[0.5em] text-[var(--ink)] placeholder:text-[var(--muted)]/50 focus:border-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              enterKeyHint="go"
              placeholder="······"
              value={value}
              aria-invalid={hasError}
              aria-describedby={hasError ? errorId : undefined}
              onChange={(event) => {
                setValue(event.target.value.replace(/\D/g, "").slice(0, 6));
                setHasError(false);
              }}
            />

            <div id={errorId} role="alert" className="min-h-[1.75rem] pt-2 text-[0.85rem] leading-6 text-[var(--accent)]">
              {hasError ? "Esa no es la clave, pero puedes intentarlo otra vez." : null}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
              <button className="button-ink" type="submit">
                Entrar <ArrowUpRight aria-hidden="true" size={16} />
              </button>
              <button className="button-quiet" type="button" aria-expanded={showHint} aria-controls={hintId} onClick={() => setShowHint((current) => !current)}>
                Revelar pista
              </button>
            </div>

            <p id={hintId} className="serif mt-6 text-[1.5rem] italic leading-tight text-[var(--accent)]" hidden={!showHint}>
              {showHint ? HINT : null}
            </p>

            <div className="mt-8 border-t border-[var(--line)] pt-5">
              <button className="button-quiet" type="button" onClick={onBack}>
                <ArrowLeft aria-hidden="true" size={15} /> volver a la portada
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
