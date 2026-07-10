"use client";

import { useEffect, useRef } from "react";

export type BurstType = "success" | "mastery" | "streak";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const COUNT = 40;
const DURATION_MS = 800;
const STEP_MS = 16;
const GRAVITY = 0.06;

function makeParticles(type: BurstType, w: number, h: number): Particle[] {
  const cx = w / 2;
  const cy = h / 2;
  const out: Particle[] = [];

  for (let i = 0; i < COUNT; i++) {
    const t = i / COUNT;
    let vx = 0;
    let vy = 0;
    let color = "#34d399";

    if (type === "success") {
      // Green upward burst (normal success).
      const angle = -Math.PI / 2 + (t - 0.5) * 1.3;
      const speed = 2 + Math.random() * 3.5;
      vx = Math.cos(angle) * speed;
      vy = Math.sin(angle) * speed - 1.5;
      color = `hsl(${135 + Math.random() * 35}, 75%, 55%)`;
    } else if (type === "mastery") {
      // Golden radial burst (mastery / high accuracy).
      const angle = t * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      vx = Math.cos(angle) * speed;
      vy = Math.sin(angle) * speed;
      color = `hsl(${42 + Math.random() * 16}, 92%, ${58 + Math.random() * 14}%)`;
    } else {
      // Flame / spark trail (streak extension, warm upward).
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.9;
      const speed = 3 + Math.random() * 4;
      vx = Math.cos(angle) * speed;
      vy = Math.sin(angle) * speed;
      color =
        Math.random() > 0.5
          ? `hsl(${14 + Math.random() * 28}, 100%, 56%)`
          : `hsl(${40 + Math.random() * 14}, 100%, 62%)`;
    }

    out.push({
      x: cx + (type === "streak" ? (Math.random() - 0.5) * 24 : 0),
      y: cy,
      vx,
      vy,
      life: 0,
      maxLife: DURATION_MS,
      color,
      size: 2 + Math.random() * 3,
    });
  }

  return out;
}

/**
 * Lightweight celebration overlay. Renders up to 40 canvas particles for
 * ~800ms then calls `onDone`. No dependencies; auto-cleans its rAF loop.
 */
export default function ParticleBurst({
  type,
  onDone,
}: {
  type: BurstType;
  onDone?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || canvas.parentElement?.clientWidth || 320;
    const h = canvas.clientHeight || canvas.parentElement?.clientHeight || 480;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.scale(dpr, dpr);

    const particles = makeParticles(type, w, h);
    let raf = 0;
    let elapsed = 0;

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (type !== "mastery") p.vy += GRAVITY;
        p.life += STEP_MS;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      elapsed += STEP_MS;
      if (elapsed >= DURATION_MS) {
        onDone?.();
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [type, onDone]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
