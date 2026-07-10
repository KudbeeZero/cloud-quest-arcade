"use client";

import { useMemo } from "react";

const COLORS = ["#22d3ee", "#a78bfa", "#f472b6", "#fbbf24", "#34d399"];
const COUNT = 16;

interface Spark {
  key: number;
  angle: number;
  distance: number;
  color: string;
  delay: number;
}

/** Tiny deterministic PRNG so a given burst looks the same on every render. */
function rand(seed: number): number {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Celebratory particle burst. Pass a monotonically increasing `fireKey`; each
 * new value launches a fresh burst. Particles are derived from `fireKey` (no
 * effect/state), and the container is keyed so the previous burst unmounts.
 */
export default function ParticleBurst({ fireKey }: { fireKey: number }) {
  const sparks = useMemo<Spark[]>(() => {
    if (fireKey <= 0) return [];
    return Array.from({ length: COUNT }, (_, i) => ({
      key: i,
      angle: (360 / COUNT) * i + rand(fireKey * 97 + i) * 14,
      distance: 64 + rand(fireKey * 131 + i) * 56,
      color: COLORS[i % COLORS.length],
      delay: rand(fireKey * 197 + i) * 70,
    }));
  }, [fireKey]);

  if (sparks.length === 0) return null;

  return (
    <div
      key={fireKey}
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"
      aria-hidden
    >
      {sparks.map((s) => (
        <span
          key={s.key}
          className="absolute h-2 w-2 rounded-full"
          style={{
            backgroundColor: s.color,
            animation: "particle-burst 820ms ease-out forwards",
            animationDelay: `${s.delay}ms`,
            ["--tx" as string]: `${
              Math.cos((s.angle * Math.PI) / 180) * s.distance
            }px`,
            ["--ty" as string]: `${
              Math.sin((s.angle * Math.PI) / 180) * s.distance
            }px`,
          }}
        />
      ))}
    </div>
  );
}
