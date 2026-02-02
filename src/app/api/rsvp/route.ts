import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { rsvpSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const json = await req.json();

    const parsed = rsvpSchema.safeParse({
      ...json,
      additionalQty:
        typeof json?.additionalQty === "string"
          ? Number(json.additionalQty)
          : json?.additionalQty,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Dados inválidos", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const created = await prisma.guest.create({
      data: {
        name: data.name,
        phone: data.phone?.trim() ? data.phone.trim() : null,
        status: data.status,
        additionalQty: data.additionalQty,
        message: data.message?.trim() ? data.message.trim() : null,
      },
      select: { id: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, guest: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro ao salvar RSVP" },
      { status: 500 },
    );
  }
}
