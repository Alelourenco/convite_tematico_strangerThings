import AutoPrint from "@/components/AutoPrint";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function statusLabel(status: string) {
  if (status === "YES") return "Confirmado";
  if (status === "MAYBE") return "Talvez";
  return "Não";
}

export default async function AdminPrintPage() {
  const guests = await prisma.guest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <AutoPrint />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="no-print mb-6 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
          Vai abrir o diálogo de impressão. Selecione “Salvar como PDF”.
        </div>

        <header className="mb-6">
          <h1 className="text-2xl font-bold">Lista de convidados — Brenda</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Gerado em {new Date().toLocaleString("pt-BR")}
          </p>
        </header>

        <div className="overflow-hidden rounded-xl border border-zinc-200">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-zinc-100">
              <tr className="text-xs uppercase tracking-wide text-zinc-600">
                <th className="px-3 py-2">Nome</th>
                <th className="px-3 py-2">Presença</th>
                <th className="px-3 py-2">Acompanhante</th>
                <th className="px-3 py-2">Recado</th>
                <th className="px-3 py-2">Criado</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((g) => (
                <tr key={g.id} className="border-t border-zinc-200 align-top">
                  <td className="px-3 py-2 font-semibold">{g.name}</td>
                  <td className="px-3 py-2">{statusLabel(g.status)}</td>
                  <td className="px-3 py-2">
                    {g.companionName
                      ? g.companionName
                      : g.additionalQty > 0
                        ? `(+${g.additionalQty})`
                        : "—"}
                  </td>
                  <td className="px-3 py-2">{g.message ?? "—"}</td>
                  <td className="px-3 py-2 font-mono text-xs text-zinc-600">
                    {new Date(g.createdAt).toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
              {guests.length === 0 ? (
                <tr>
                  <td className="px-3 py-10 text-center text-zinc-500" colSpan={5}>
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
