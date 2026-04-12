import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateScore } from "@/lib/scoring";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerName, character, mode, score, timeMs, databrusCount } = body;

    // Validate
    if (
      typeof playerName !== "string" ||
      playerName.trim().length === 0 ||
      playerName.trim().length > 20
    ) {
      return NextResponse.json({ error: "Invalid player name" }, { status: 400 });
    }

    if (!["abakule", "tihldev"].includes(character)) {
      return NextResponse.json({ error: "Invalid character" }, { status: 400 });
    }

    if (!["single", "versus"].includes(mode)) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    if (typeof timeMs !== "number" || timeMs < 5000 || timeMs > 300000) {
      return NextResponse.json({ error: "Invalid time" }, { status: 400 });
    }

    if (typeof databrusCount !== "number" || databrusCount < 0 || databrusCount > 3) {
      return NextResponse.json({ error: "Invalid databrus count" }, { status: 400 });
    }

    // Server-side score verification
    const expectedScore = calculateScore(Math.round(timeMs), databrusCount);
    if (score !== expectedScore) {
      return NextResponse.json({ error: "Score mismatch" }, { status: 400 });
    }

    // Save to database
    const entry = await prisma.score.create({
      data: {
        playerName: playerName.trim().slice(0, 20),
        character,
        mode,
        score: expectedScore,
        timeMs: Math.round(timeMs),
        databrusCount,
      },
    });

    // Calculate rank
    const rank = await prisma.score.count({
      where: { score: { gt: expectedScore } },
    });

    return NextResponse.json({ ...entry, rank: rank + 1 }, { status: 201 });
  } catch (error) {
    console.error("Score submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
