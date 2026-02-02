import { prisma } from "@/lib/prisma";
import PrintButton from "@/components/PrintButton";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function statusLabel(status: string) {
  if (status === "YES") return "Confirmado";
  if (status === "MAYBE") return "Talvez";
  return "Não";
}

export default async function AdminPage() {
  const guests = await prisma.guest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const counts = guests.reduce(
    (acc, g) => {
      acc.total += 1;
      acc.totalPeople += 1 + (g.additionalQty ?? 0);
      if (g.status === "YES") acc.yes += 1;
      else if (g.status === "MAYBE") acc.maybe += 1;
      else acc.no += 1;
      return acc;
    },
    { total: 0, yes: 0, maybe: 0, no: 0, totalPeople: 0 },
  );

  return (
    <div className="min-h-screen bg-hawkins text-zinc-50">
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="no-print mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="st-title text-3xl font-extrabold sm:text-4xl">
              Lista de convidados — Brenda
            </h1>
            <p className="mt-2 text-sm text-zinc-200">
              Protegido por Basic Auth (ADMIN_USER/ADMIN_PASSWORD).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <PrintButton />
          </div>
        </div>

        <section className="mb-6 grid gap-3 sm:grid-cols-5">
          <div className="rounded-2xl border border-zinc-700/40 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
              Total nomes
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-50">
              {counts.total}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-700/40 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
              Confirmados
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-50">
              {counts.yes}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-700/40 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
              Talvez
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-50">
              {counts.maybe}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-700/40 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
              Não
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-50">{counts.no}</p>
          </div>
          <div className="rounded-2xl border border-zinc-700/40 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
              Pessoas (c/ acomp.)
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-50">
              {counts.totalPeople}
            </p>
          </div>
        </section>

        <div className="overflow-hidden rounded-2xl border border-zinc-700/40 bg-black/30">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-black/40">
              <tr className="text-xs uppercase tracking-[0.18em] text-zinc-300">
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Presença</th>
                <th className="px-4 py-3">Acomp.</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Recado</th>
                <th className="px-4 py-3">Criado</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((g) => (
                <tr
                  key={g.id}
                  className="border-t border-zinc-800/70 align-top"
                >
                  <td className="px-4 py-3 font-semibold text-zinc-50">
                    {g.name}
                  </td>
                  <td className="px-4 py-3 text-zinc-200">
                    {statusLabel(g.status)}
                  </td>
                  <td className="px-4 py-3 font-mono text-zinc-200">
                    {g.additionalQty}
                  </td>
                  <td className="px-4 py-3 text-zinc-200">{g.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-200">{g.message ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-400">
                    {new Date(g.createdAt).toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
              {guests.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-zinc-300" colSpan={6}>
                    Nenhum RSVP ainda.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
