"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  tw: number;
  hue: number;
  streak: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function HawkinsParticles({
  className = "",
  intensity = 1,
}: {
  className?: string;
  intensity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const canvas: HTMLCanvasElement = canvasEl;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const context: CanvasRenderingContext2D = ctx;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let lastT = 0;
    let nextFlashAt = 0;

    const particles: Particle[] = [];

    function resize() {
      const parent = canvas.parentElement;
      const rect = (parent ?? canvas).getBoundingClientRect();
      dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function targetCount() {
      // Density that scales with area, tuned to remain light on mobile.
      const base = (w * h) / 18000;
      return Math.floor(clamp(base * intensity, 18, 120));
    }

    function seed() {
      particles.length = 0;
      const n = targetCount();
      for (let i = 0; i < n; i++) {
        const isCold = Math.random() < 0.18;
        const hue = isCold ? 205 : Math.random() < 0.1 ? 285 : 355;
        const r = 0.6 + Math.random() * 1.7;

        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18,
          vy: 0.35 + Math.random() * 1.2,
          r,
          a: 0.06 + Math.random() * 0.16,
          tw: Math.random() * Math.PI * 2,
          hue,
          streak: Math.random() < 0.5 ? 0 : 4 + Math.random() * 12,
        });
      }

      lastT = 0;
      nextFlashAt = 1200 + Math.random() * 3500;
    }

    function step(t: number) {
      context.clearRect(0, 0, w, h);

      const dt = lastT ? clamp((t - lastT) / 16.67, 0.5, 2) : 1;
      lastT = t;

      // Tenebrous fog + vignette (kept subtle to avoid washing UI)
      const fog = context.createRadialGradient(
        w * 0.45,
        h * 0.25,
        0,
        w * 0.45,
        h * 0.25,
        Math.max(w, h) * 1.05,
      );
      fog.addColorStop(0, "rgba(255, 30, 70, 0.05)");
      fog.addColorStop(0.55, "rgba(120, 40, 190, 0.035)");
      fog.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = fog;
      context.fillRect(0, 0, w, h);

      const vignette = context.createRadialGradient(
        w * 0.5,
        h * 0.55,
        Math.min(w, h) * 0.15,
        w * 0.5,
        h * 0.55,
        Math.max(w, h) * 0.78,
      );
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.28)");
      context.fillStyle = vignette;
      context.fillRect(0, 0, w, h);

      // Occasional subtle "lightning" flash
      if (t > nextFlashAt) {
        const flashA = 0.08 + Math.random() * 0.08;
        context.fillStyle = `rgba(120, 200, 255, ${flashA})`;
        context.fillRect(0, 0, w, h);
        nextFlashAt = t + 1800 + Math.random() * 5000;
      }

      for (const p of particles) {
        p.tw += 0.02 * dt;
        const twinkle = 0.5 + 0.5 * Math.sin(p.tw + t * 0.001);
        const alpha = p.a * (0.6 + 0.4 * twinkle);

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Wrap around edges for continuous fall
        if (p.y > h + 12) {
          p.y = -12;
          p.x = Math.random() * w;
          p.vy = 0.35 + Math.random() * 1.2;
          p.vx = (Math.random() - 0.5) * 0.18;
        }
        if (p.x < -12) p.x = w + 12;
        if (p.x > w + 12) p.x = -12;

        // Streaky fall (spores/ash) + core dot
        if (p.streak > 0) {
          context.beginPath();
          context.moveTo(p.x, p.y - p.streak);
          context.lineTo(p.x, p.y + p.streak);
          context.strokeStyle = `hsla(${p.hue}, 90%, 58%, ${alpha * 0.28})`;
          context.lineWidth = Math.max(0.7, p.r * 0.55);
          context.stroke();
        }

        context.beginPath();
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        context.fillStyle = `hsla(${p.hue}, 92%, 60%, ${alpha})`;
        context.fill();

        // Tiny glow halo
        context.beginPath();
        context.arc(p.x, p.y, p.r * 3.0, 0, Math.PI * 2);
        context.fillStyle = `hsla(${p.hue}, 95%, 58%, ${alpha * 0.14})`;
        context.fill();
      }

      raf = window.requestAnimationFrame(step);
    }

    const ro = new ResizeObserver(() => {
      resize();
      seed();
    });

    resize();
    seed();
    ro.observe(canvas.parentElement ?? canvas);
    raf = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={
        "pointer-events-none absolute inset-0 z-0 opacity-70 mix-blend-soft-light " +
        className
      }
    />
  );
}
