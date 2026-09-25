"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { stations } from "@/data/seasons";

const PROGRESS_KEY = "cuatro-estaciones-progress";
const STARTED_KEY = "cuatro-estaciones-started";
const ACCESS_KEY = "cuatro-estaciones-access";
const MUSIC_KEY = "cuatro-estaciones-music";

export type MusicChoice = "on" | "off" | null;

export function useGiftProgress() {
  const [started, setStarted] = useState(false);
  const [openedCount, setOpenedCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [music, setMusic] = useState<MusicChoice>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedCount = Number.parseInt(window.localStorage.getItem(PROGRESS_KEY) ?? "0", 10);
    const safeCount = Number.isFinite(savedCount) ? Math.min(Math.max(savedCount, 0), stations.length) : 0;
    setOpenedCount(safeCount);
    setStarted(window.localStorage.getItem(STARTED_KEY) === "true" || safeCount > 0);
    try {
      setUnlocked(window.sessionStorage.getItem(ACCESS_KEY) === "granted");
      const savedMusic = window.sessionStorage.getItem(MUSIC_KEY);
      setMusic(savedMusic === "on" || savedMusic === "off" ? savedMusic : null);
    } catch {
      setUnlocked(false);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(PROGRESS_KEY, String(openedCount));
    window.localStorage.setItem(STARTED_KEY, String(started));
  }, [isReady, openedCount, started]);

  const selectedStation = useMemo(() => (selectedIndex === null ? null : stations[selectedIndex]), [selectedIndex]);

  function startExperience() {
    setStarted(true);
    window.setTimeout(() => document.getElementById("journey")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  function unlock() {
    try {
      window.sessionStorage.setItem(ACCESS_KEY, "granted");
    } catch {}
    setUnlocked(true);
  }

  function chooseMusic(choice: "on" | "off") {
    try {
      window.sessionStorage.setItem(MUSIC_KEY, choice);
    } catch {}
    setMusic(choice);
  }

  function openStation(index: number) {
    if (index > openedCount) return;
    if (index === openedCount && openedCount < stations.length) {
      const nextCount = openedCount + 1;
      setOpenedCount(nextCount);
    }
    setSelectedIndex(index);
  }

  const clearSelection = useCallback(() => setSelectedIndex(null), []);

  function resetExperience() {
    window.localStorage.removeItem(PROGRESS_KEY);
    window.localStorage.removeItem(STARTED_KEY);
    setOpenedCount(0);
    setSelectedIndex(null);
    setStarted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return { unlocked, unlock, music, chooseMusic, started, openedCount, selectedStation, startExperience, openStation, clearSelection, resetExperience };
}
