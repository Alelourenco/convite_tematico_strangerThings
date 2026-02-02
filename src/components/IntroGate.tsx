"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Phase = "idle" | "playing" | "exiting" | "done";

export default function IntroGate({
  children,
  videoSrc = "/intro.mp4",
  storageKey = "introPlayed",
}: {
  children: React.ReactNode;
  videoSrc?: string;
  storageKey?: string;
}) {
  const [phase, setPhase] = useState<Phase>(() => {
    try {
      return sessionStorage.getItem(storageKey) === "1" ? "done" : "idle";
    } catch {
      return "idle";
    }
  });
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
    return "opacity-0 translate-y-2 blur-[2px] pointer-events-none select-none";
  }, [isDone]);

  function finish() {
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // ignore
    }

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
      setError(
        "Não foi possível reproduzir o vídeo automaticamente. Toque em play.",
      );
    }
  }

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
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${
            phase === "exiting" ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="relative h-full w-full">
            {/* Fundo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.18),rgba(0,0,0,0.92)_55%,rgba(0,0,0,1)_100%)]" />

            {/* Conteúdo */}
            <div className="relative mx-auto flex h-full max-w-5xl flex-col items-center justify-center gap-6 px-5 py-10 text-zinc-50">
              <div className="w-full max-w-3xl">
                <div className="overflow-hidden rounded-2xl border border-red-500/25 bg-black/60 shadow-[0_0_120px_rgba(255,0,0,0.25)]">
                  <div className="relative aspect-video w-full bg-black">
                    <video
                      ref={videoRef}
                      src={videoSrc}
                      playsInline
                      preload="auto"
                      onEnded={finish}
                      onError={() =>
                        setError(
                          "Não encontrei o vídeo em /public/intro.mp4 (adicione o arquivo).",
                        )
                      }
                      className={`h-full w-full object-cover ${
                        phase === "idle" ? "opacity-0" : "opacity-100"
                      } transition-opacity duration-300`}
                    />

                    {phase === "idle" ? (
                      <button
                        type="button"
                        onClick={start}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 px-6 text-center"
                      >
                        <p className="st-title text-4xl font-extrabold tracking-tight sm:text-5xl">
                          Clique para entrar
                        </p>
                        <p className="max-w-xl text-sm text-zinc-200 sm:text-base">
                          A intro dura ~8 segundos. No final, você já cai direto
                          no formulário de confirmação.
                        </p>
                        <span className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_40px_rgba(255,0,0,0.30)] hover:bg-red-500">
                          Iniciar
                        </span>
                      </button>
                    ) : null}

                    {phase !== "idle" ? (
                      <div className="absolute right-3 top-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={finish}
                          className="rounded-lg border border-zinc-600/60 bg-black/50 px-3 py-2 text-xs font-semibold text-zinc-100 hover:border-red-500/40"
                        >
                          Pular
                        </button>
                      </div>
                    ) : null}
                  </div>

                  {error ? (
                    <div className="border-t border-red-500/20 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  ) : null}
                </div>

                <p className="mt-4 text-center text-xs text-zinc-400">
                  Dica: coloque seu vídeo em <span className="font-mono">public/intro.mp4</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
