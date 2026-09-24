"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { stations } from "@/data/seasons";

const PROGRESS_KEY = "cuatro-estaciones-progress";
const STARTED_KEY = "cuatro-estaciones-started";

export function useGiftProgress() {
  const [started, setStarted] = useState(false);
  const [openedCount, setOpenedCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedCount = Number.parseInt(window.localStorage.getItem(PROGRESS_KEY) ?? "0", 10);
    const safeCount = Number.isFinite(savedCount) ? Math.min(Math.max(savedCount, 0), stations.length) : 0;
    setOpenedCount(safeCount);
    setStarted(window.localStorage.getItem(STARTED_KEY) === "true" || safeCount > 0);
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

  function openStation(index: number) {
    if (index > openedCount) return;
    if (index === openedCount && openedCount < stations.length) {
      const nextCount = openedCount + 1;
      setOpenedCount(nextCount);
    }
    setSelectedIndex(index);
    if (stations[index].key === "spring" || stations[index].key === "summer") return;
    window.setTimeout(() => document.getElementById("reveal")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
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

  return { started, openedCount, selectedStation, startExperience, openStation, clearSelection, resetExperience };
}
