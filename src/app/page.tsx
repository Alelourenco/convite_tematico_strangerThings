import RsvpForm from "@/components/RsvpForm";
import IntroGate from "@/components/IntroGate";

export default function Home() {
  return (
    <div className="min-h-screen bg-hawkins text-zinc-50">
      <IntroGate>
        <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-10 sm:px-8">
          <header className="mb-10">
            <h1 className="st-title text-5xl font-extrabold tracking-tight sm:text-6xl">
              Brenda 21 Years
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg">
              Você esta sendo convocado para desbravar os mistérios de Hawkins e adentrar no mundo invertido. Vai ter coragem?
            </p>

            <div className="mt-6 grid gap-3 text-sm text-zinc-200 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                  Data
                </p>
                <p className="mt-1 font-semibold">07/03</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                  Horário
                </p>
                <p className="mt-1 font-semibold">19:00</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                  Local
                </p>
                <p className="mt-1 font-semibold">Rua Mitsuki Shime 300</p>
              </div>
            </div>
          </header>

          <main className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <RsvpForm />

            <aside className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
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

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-200">
                  Contato
                </h2>
                <p className="mt-3 text-sm text-zinc-200">
                  Se precisar de infos do local/data, fale com o anfitrião.
                </p>
                <a
                  className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold tracking-wide text-emerald-950 shadow-[0_0_50px_rgba(16,185,129,0.22)] transition hover:bg-emerald-400 sm:w-auto"
                  href="https://wa.me/5543999027670"
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir WhatsApp
                </a>
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
      </IntroGate>
    </div>
  );
}
