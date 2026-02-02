"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Phase = "idle" | "playing" | "exiting" | "done";

export default function IntroGate({
  children,
  videoSrc = "/intro.mp4",
}: {
  children: React.ReactNode;
  videoSrc?: string;
}) {
  const [phase, setPhase] = useState<Phase>("playing");
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isDone = phase === "done";
  const isOverlayVisible = phase !== "done";

  useEffect(() => {
    // Evita scroll enquanto a intro estiver ativa.
    const prevOverflow = document.documentElement.style.overflow;
    if (!isDone) {
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [isDone]);

  const contentClassName = useMemo(() => {
    if (isDone) {
      return "opacity-100 translate-y-0 blur-0";
    }
    return "opacity-0 translate-y-2 blur-[1px] pointer-events-none select-none";
  }, [isDone]);

  function finish() {
    setPhase("exiting");
    window.setTimeout(() => setPhase("done"), 500);
  }

  async function start() {
    setError(null);
    setPhase("playing");

    // play() precisa de gesto do usuário. Esse handler já é um clique.
    try {
      await videoRef.current?.play();
    } catch {
      setError("Não foi possível iniciar o vídeo.");
    }
  }

  useEffect(() => {
    if (phase !== "playing") return;
    const el = videoRef.current;
    if (!el) return;

    // Autoplay com som é bloqueado; por isso usamos muted.
    el.muted = true;

    const promise = el.play();
    if (promise && typeof (promise as Promise<void>).catch === "function") {
      (promise as Promise<void>).catch(() => {
        // Se o navegador bloquear autoplay, cai pra um estado que pede clique.
        setPhase("idle");
        setError(
          "Seu navegador bloqueou o autoplay. Clique para iniciar o vídeo.",
        );
      });
    }
  }, [phase]);

  return (
    <>
      <div
        className={`transition-all duration-500 ${contentClassName}`}
        aria-hidden={!isDone}
      >
        {children}
      </div>

      {isOverlayVisible ? (
        <div
          className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-500 ${
            phase === "exiting" ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="relative h-full w-full">
            <video
              ref={videoRef}
              src={videoSrc}
              playsInline
              preload="auto"
              muted
              autoPlay
              onEnded={finish}
              onError={() =>
                setError(
                  "Não encontrei o vídeo em /public/intro.mp4 (adicione o arquivo).",
                )
              }
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Overlay leve apenas para legibilidade do botão (quando necessário) */}
            {phase === "idle" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 px-6">
                <button
                  type="button"
                  onClick={start}
                  className="rounded-2xl border border-red-500/25 bg-black/50 px-6 py-4 text-center text-zinc-50 shadow-[0_0_80px_rgba(255,0,0,0.18)] backdrop-blur"
                >
                  <p className="st-title text-4xl font-extrabold tracking-tight sm:text-5xl">
                    Iniciar
                  </p>
                  <p className="mt-2 max-w-xl text-sm text-zinc-200 sm:text-base">
                    {error ?? "Clique para reproduzir o vídeo."}
                  </p>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
