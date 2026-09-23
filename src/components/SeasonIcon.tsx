import { Flower2, Leaf, Snowflake, SunMedium } from "lucide-react";
import type { SeasonKey } from "@/data/seasons";

const icons = {
  spring: Flower2,
  summer: SunMedium,
  autumn: Leaf,
  winter: Snowflake,
};

export function SeasonIcon({ season, size = 18 }: { season: SeasonKey; size?: number }) {
  const Icon = icons[season];
  return <Icon aria-hidden="true" size={size} strokeWidth={1.45} />;
}
