import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const guests = await prisma.guest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ok: true, guests });
}
