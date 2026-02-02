"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Phase = "confirm" | "idle" | "playing" | "exiting" | "done";

export default function IntroGate({
  children,
  videoSrc = "/intro.mp4",
}: {
  children: React.ReactNode;
  videoSrc?: string;
}) {
  const [phase, setPhase] = useState<Phase>("confirm");
  const [error, setError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
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

  async function confirmContinue(enableAudio: boolean) {
    setError(null);
    setSoundEnabled(enableAudio);
    setPhase("playing");

    // Tenta iniciar imediatamente com gesto do usuário.
    try {
      const el = videoRef.current;
      if (!el) return;
      el.muted = !enableAudio;
      await el.play();
    } catch {
      // Se falhar, cai no fluxo padrão que mostra mensagem e permite tentar novamente.
      setPhase("idle");
      setError(
        enableAudio
          ? "Seu navegador bloqueou o áudio. Toque em “Iniciar” para tentar novamente."
          : "Seu navegador bloqueou o autoplay. Toque em “Iniciar”.",
      );
    }
  }

  async function enableSound() {
    const el = videoRef.current;
    if (!el) return;

    try {
      el.muted = false;
      el.volume = 1;
      setSoundEnabled(true);
      await el.play();
    } catch {
      setError(
        "O navegador bloqueou áudio automático. Toque novamente para ativar.",
      );
    }
  }

  useEffect(() => {
    if (phase !== "playing") return;
    const el = videoRef.current;
    if (!el) return;

    // Autoplay com som é bloqueado; por isso usamos muted.
    el.muted = !soundEnabled;

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
  }, [phase, soundEnabled]);

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
          className={`fixed inset-0 z-[9999] transition-opacity duration-500 ${
            phase === "exiting" ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="relative h-full w-full">
            <video
              ref={videoRef}
              src={videoSrc}
              playsInline
              preload="auto"
              muted={!soundEnabled}
              autoPlay={phase === "playing"}
              onEnded={finish}
              onError={() =>
                setError(
                  "Não encontrei o vídeo em /public/intro.mp4 (adicione o arquivo).",
                )
              }
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Controles mínimos */}
            {phase === "playing" ? (
              <div className="absolute right-3 top-3 flex items-center gap-2">
                {!soundEnabled ? (
                  <button
                    type="button"
                    onClick={enableSound}
                    className="rounded-lg border border-white/20 bg-black/35 px-3 py-2 text-xs font-semibold text-zinc-100 backdrop-blur hover:border-red-500/40"
                  >
                    Ativar som
                  </button>
                ) : (
                  <span className="rounded-lg border border-white/15 bg-black/25 px-3 py-2 text-xs font-semibold text-zinc-200 backdrop-blur">
                    Som ativo
                  </span>
                )}
                <button
                  type="button"
                  onClick={finish}
                  className="rounded-lg border border-white/20 bg-black/35 px-3 py-2 text-xs font-semibold text-zinc-100 backdrop-blur hover:border-red-500/40"
                >
                  Pular
                </button>
              </div>
            ) : null}

            {/* Pré-intro */}
            {phase === "confirm" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 px-6">
                <div className="w-[min(760px,100%)] rounded-3xl border border-red-500/25 bg-black/55 p-6 text-center shadow-[0_0_120px_rgba(255,0,0,0.22)] backdrop-blur sm:p-8">
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-300">
                    Hawkins Signal
                  </p>
                  <p className="st-title mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
                    Você deseja continuar?
                  </p>
                  <p className="mt-3 text-sm text-zinc-200 sm:text-base">
                    Para ouvir o áudio, precisamos de um clique.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                      type="button"
                      onClick={() => void confirmContinue(true)}
                      className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_0_60px_rgba(255,0,0,0.30)] transition hover:bg-red-500"
                    >
                      Sim, continuar (com som)
                    </button>
                    <button
                      type="button"
                      onClick={() => void confirmContinue(false)}
                      className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold tracking-wide text-zinc-100 backdrop-blur transition hover:bg-white/15"
                    >
                      Continuar sem som
                    </button>
                  </div>

                  {error ? (
                    <div className="mt-4 rounded-xl border border-red-500/25 bg-black/40 px-4 py-3 text-sm text-red-100">
                      {error}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

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

            {error && phase !== "idle" ? (
              <div className="absolute bottom-4 left-1/2 w-[min(720px,calc(100%-2rem))] -translate-x-1/2 rounded-xl border border-red-500/25 bg-black/45 px-4 py-3 text-sm text-red-100 backdrop-blur">
                {error}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
