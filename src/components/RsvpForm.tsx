"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Status = "YES" | "NO" | "MAYBE";

export default function RsvpForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status>("YES");
  const [bringCompanion, setBringCompanion] = useState(false);
  const [companionName, setCompanionName] = useState("");
  const [message, setMessage] = useState("");

  const [statusOpen, setStatusOpen] = useState(false);
  const statusWrapRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusLabel = useMemo(() => {
    switch (status) {
      case "YES":
        return "Confirmado";
      case "NO":
        return "Não vou conseguir";
      case "MAYBE":
        return "Talvez";
    }
  }, [status]);

  const statusOptions = useMemo(
    () =>
      [
        { value: "YES" as const, label: "Confirmado" },
        { value: "MAYBE" as const, label: "Talvez" },
        { value: "NO" as const, label: "Não vou conseguir" },
      ],
    [],
  );

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!statusOpen) return;
      const target = e.target as Node | null;
      if (!target) return;
      if (statusWrapRef.current && !statusWrapRef.current.contains(target)) {
        setStatusOpen(false);
      }
    }

    function onDocKeyDown(e: KeyboardEvent) {
      if (!statusOpen) return;
      if (e.key === "Escape") setStatusOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, [statusOpen]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          status,
          bringCompanion,
          companionName,
          message,
        }),
      });

      const data = (await res.json()) as
        | { ok: true; guest: { id: string } }
        | { ok: false; error?: string; issues?: unknown };

      if (!res.ok || !data.ok) {
        setError(data.ok ? "Não foi possível salvar seu RSVP." : (data.error ?? "Não foi possível salvar seu RSVP."));
        return;
      }

      router.push(`/thanks?id=${encodeURIComponent(data.guest.id)}`);
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_0_80px_rgba(255,0,0,0.16)] backdrop-blur"
    >
      <div className="grid gap-4">
        <div>
          <label className="text-xs uppercase tracking-[0.22em] text-zinc-300">
            Seu nome
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ex: Lucas Almeida"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-zinc-50 outline-none ring-0 placeholder:text-zinc-400 focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(255,0,0,0.12)]"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.22em] text-zinc-300">
            Presença
          </label>

          <div ref={statusWrapRef} className="relative mt-2">
            <button
              type="button"
              onClick={() => setStatusOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-left text-zinc-50 outline-none focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(255,0,0,0.12)]"
              aria-haspopup="listbox"
              aria-expanded={statusOpen}
            >
              <span className="text-sm font-medium">{statusLabel}</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`shrink-0 opacity-80 transition ${statusOpen ? "rotate-180" : "rotate-0"}`}
                aria-hidden="true"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {statusOpen ? (
              <div
                role="listbox"
                className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950/85 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
              >
                <div className="p-1">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={opt.value === status}
                      onClick={() => {
                        setStatus(opt.value);
                        setStatusOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-red-500/40 ${
                        opt.value === status
                          ? "bg-red-600/30 text-zinc-50"
                          : "text-zinc-200 hover:bg-white/10"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {opt.value === status ? (
                        <span className="text-xs text-zinc-100/90">Selecionado</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.22em] text-zinc-300">
            Vai levar acompanhante?
          </label>
          <div className="mt-2 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
            <span className="text-sm text-zinc-200">{bringCompanion ? "Sim" : "Não"}</span>
            <button
              type="button"
              onClick={() => setBringCompanion((v) => !v)}
              className={`relative h-7 w-12 rounded-full border transition ${
                bringCompanion
                  ? "border-red-500/50 bg-red-600/60"
                  : "border-white/15 bg-white/10"
              }`}
              aria-pressed={bringCompanion}
              aria-label="Alternar acompanhante"
            >
              <span
                className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition ${
                  bringCompanion ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>
          <p className="mt-2 text-xs text-zinc-400">Status: <span className="text-zinc-200">{statusLabel}</span></p>
        </div>

        {bringCompanion ? (
          <div>
            <label className="text-xs uppercase tracking-[0.22em] text-zinc-300">
              Nome do acompanhante
            </label>
            <input
              value={companionName}
              onChange={(e) => setCompanionName(e.target.value)}
              required
              placeholder="Ex: Maria Silva"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-zinc-50 outline-none placeholder:text-zinc-400 focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(255,0,0,0.12)]"
            />
          </div>
        ) : null}

        <div>
          <label className="text-xs uppercase tracking-[0.22em] text-zinc-300">
            Recado pra Brenda
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Ex: Levo o refrigerante!"
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-zinc-50 outline-none placeholder:text-zinc-400 focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(255,0,0,0.12)]"
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 font-semibold tracking-wide text-white shadow-[0_0_40px_rgba(255,0,0,0.30)] transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Salvando…" : "Confirmar presença"}
        </button>

        <p className="text-xs text-zinc-400">
          Ao confirmar, seu nome entra na lista de convidados.
        </p>
      </div>
    </form>
  );
}
