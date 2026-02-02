import RsvpForm from "@/components/RsvpForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-hawkins text-zinc-50">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-10 sm:px-8">
        <header className="mb-10">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.28em] text-zinc-200">
            Convite • Stranger Things
          </p>

          <h1 className="st-title text-5xl font-extrabold tracking-tight sm:text-6xl">
            Brenda
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg">
            Você está sendo convocado para uma noite estranha (e incrível).
            Confirme sua presença abaixo.
          </p>

          <div className="mt-6 grid gap-3 text-sm text-zinc-200 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-700/40 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                Data
              </p>
              <p className="mt-1 font-semibold">07/03</p>
            </div>
            <div className="rounded-2xl border border-zinc-700/40 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                Horário
              </p>
              <p className="mt-1 font-semibold">07:00</p>
            </div>
            <div className="rounded-2xl border border-zinc-700/40 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                Local
              </p>
              <p className="mt-1 font-semibold">(definir)</p>
            </div>
          </div>
        </header>

        <main className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <RsvpForm />

          <aside className="space-y-6">
            <div className="rounded-2xl border border-zinc-700/40 bg-black/30 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-200">
                Regras de sobrevivência
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-zinc-200">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_18px_rgba(255,0,0,0.7)]" />
                  Chegue com fome (e curiosidade).
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_18px_rgba(255,0,0,0.7)]" />
                  Se ouvir um relógio… finja que não ouviu.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_18px_rgba(255,0,0,0.7)]" />
                  Traga sua melhor energia.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-700/40 bg-black/30 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-200">
                Contato
              </h2>
              <p className="mt-3 text-sm text-zinc-200">
                Se precisar de infos do local/data, fale com o anfitrião.
              </p>
            </div>
          </aside>
        </main>

        <footer className="mt-12 border-t border-zinc-800/60 py-8 text-xs text-zinc-400">
          <p>
            Hawkins aprova este convite. Salvo no banco para gerar lista e
            imprimir.
          </p>
        </footer>
      </div>
    </div>
  );
}
