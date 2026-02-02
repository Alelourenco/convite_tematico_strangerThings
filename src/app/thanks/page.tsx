import Link from "next/link";

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <div className="min-h-screen bg-hawkins text-zinc-50">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-12 sm:px-8">
        <div className="rounded-2xl border border-red-500/25 bg-black/40 p-8 shadow-[0_0_90px_rgba(255,0,0,0.18)]">
          <h1 className="st-title text-4xl font-extrabold sm:text-5xl">
            Presença registrada
          </h1>
          <p className="mt-4 text-zinc-200">
            Perfeito. Seu nome já está na lista de convidados da Brenda.
          </p>
          {id ? (
            <p className="mt-4 text-xs text-zinc-400">
              Protocolo Hawkins: <span className="font-mono">{id}</span>
            </p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-700/60 bg-black/30 px-5 py-3 text-sm font-semibold text-zinc-100 hover:border-red-500/40"
            >
              Voltar ao convite
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
