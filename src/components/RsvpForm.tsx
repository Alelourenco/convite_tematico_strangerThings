"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Status = "YES" | "NO" | "MAYBE";

export default function RsvpForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("YES");
  const [additionalQty, setAdditionalQty] = useState(0);
  const [message, setMessage] = useState("");

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
          phone,
          status,
          additionalQty,
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-[0.22em] text-zinc-300">
              WhatsApp (opcional)
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-zinc-50 outline-none placeholder:text-zinc-400 focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(255,0,0,0.12)]"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.22em] text-zinc-300">
              Presença
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-zinc-50 outline-none focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(255,0,0,0.12)]"
            >
              <option value="YES">Confirmado</option>
              <option value="MAYBE">Talvez</option>
              <option value="NO">Não vou conseguir</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.22em] text-zinc-300">
            Vou levar acompanhantes (0 a 10)
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={10}
              value={additionalQty}
              onChange={(e) => setAdditionalQty(Number(e.target.value))}
              className="w-full accent-red-500"
            />
            <span className="w-10 text-right font-mono text-sm text-zinc-200">
              {additionalQty}
            </span>
          </div>
          <p className="mt-2 text-xs text-zinc-400">
            Status: <span className="text-zinc-200">{statusLabel}</span>
          </p>
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.22em] text-zinc-300">
            Recado pra Brenda (opcional)
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
