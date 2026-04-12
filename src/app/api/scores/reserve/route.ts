import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isStaleReservation, normalizePlayerNameKey } from "@/lib/scoreNames";

function validatePlayerName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const t = raw.trim();
  if (t.length === 0 || t.length > 20) return null;
  return t.slice(0, 20);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, players } = body as {
      mode?: unknown;
      players?: unknown;
    };

    if (mode !== "single" && mode !== "versus") {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    if (!Array.isArray(players)) {
      return NextResponse.json({ error: "Invalid players" }, { status: 400 });
    }

    const expectedLen = mode === "single" ? 1 : 2;
    if (players.length !== expectedLen) {
      return NextResponse.json({ error: "Invalid player count" }, { status: 400 });
    }

    type ValidPlayer = { playerName: string; character: string; playerNameKey: string };
    const validated: ValidPlayer[] = [];

    const keysInBatch = new Set<string>();
    for (const p of players) {
      if (typeof p !== "object" || p === null) {
        return NextResponse.json({ error: "Invalid player" }, { status: 400 });
      }
      const rec = p as Record<string, unknown>;
      const name = validatePlayerName(rec.playerName);
      if (!name) {
        return NextResponse.json({ error: "Invalid player name" }, { status: 400 });
      }
      const character = rec.character;
      if (character !== "abakule" && character !== "tihldev") {
        return NextResponse.json({ error: "Invalid character" }, { status: 400 });
      }
      const key = normalizePlayerNameKey(name);
      if (keysInBatch.has(key)) {
        return NextResponse.json({ error: "Player names must be different" }, { status: 400 });
      }
      keysInBatch.add(key);
      validated.push({ playerName: name, character, playerNameKey: key });
    }

    const entries = await prisma.$transaction(async (tx) => {
      const out: { id: string; playerName: string; character: string }[] = [];

      for (const p of validated) {
        const existing = await tx.score.findUnique({
          where: { playerNameKey: p.playerNameKey },
        });

        if (existing) {
          if (existing.completedAt !== null) {
            throw new Error("NAME_TAKEN");
          }
          if (!isStaleReservation(existing.createdAt)) {
            throw new Error("NAME_IN_USE");
          }
          await tx.score.delete({ where: { id: existing.id } });
        }

        const row = await tx.score.create({
          data: {
            playerName: p.playerName,
            playerNameKey: p.playerNameKey,
            character: p.character,
            mode,
            score: 0,
            timeMs: 0,
            databrusCount: 0,
            completedAt: null,
          },
          select: { id: true, playerName: true, character: true },
        });
        out.push(row);
      }

      return out;
    });

    return NextResponse.json({ entries }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NAME_TAKEN") {
        return NextResponse.json({ error: "That name is already taken" }, { status: 409 });
      }
      if (error.message === "NAME_IN_USE") {
        return NextResponse.json({ error: "That name is in use by another game" }, { status: 409 });
      }
    }
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "That name is already taken" }, { status: 409 });
    }
    console.error("Reserve error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
