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
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -0.08 - Math.random() * 0.22,
          r: 0.7 + Math.random() * 1.8,
          a: 0.12 + Math.random() * 0.25,
          tw: Math.random() * Math.PI * 2,
          hue: Math.random() < 0.75 ? 0 : 195, // red + cold-cyan accents
        });
      }
    }

    function step(t: number) {
      context.clearRect(0, 0, w, h);

      // Subtle foggy glow layer
      const fog = context.createRadialGradient(w * 0.5, h * 0.15, 0, w * 0.5, h * 0.15, Math.max(w, h) * 0.9);
      fog.addColorStop(0, "rgba(255, 60, 60, 0.06)");
      fog.addColorStop(0.55, "rgba(170, 90, 255, 0.04)");
      fog.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = fog;
      context.fillRect(0, 0, w, h);

      for (const p of particles) {
        p.tw += 0.02;
        const twinkle = 0.55 + 0.45 * Math.sin(p.tw + t * 0.001);
        const alpha = p.a * twinkle;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges for continuous drift
        if (p.y < -8) {
          p.y = h + 8;
          p.x = Math.random() * w;
        }
        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;

        context.beginPath();
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        context.fillStyle = `hsla(${p.hue}, 95%, 62%, ${alpha})`;
        context.fill();

        // Tiny glow halo
        context.beginPath();
        context.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
        context.fillStyle = `hsla(${p.hue}, 95%, 60%, ${alpha * 0.18})`;
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
        "pointer-events-none absolute inset-0 z-0 opacity-80 mix-blend-screen " +
        className
      }
    />
  );
}
