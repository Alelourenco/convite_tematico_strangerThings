import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { rsvpSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const json = await req.json();

    const parsed = rsvpSchema.safeParse({
      ...json,
      bringCompanion:
        typeof json?.bringCompanion === "string"
          ? json.bringCompanion === "true"
          : Boolean(json?.bringCompanion),
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
        phone: null,
        status: data.status,
        additionalQty: data.bringCompanion ? 1 : 0,
        companionName:
          data.bringCompanion && data.companionName?.trim()
            ? data.companionName.trim()
            : null,
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
