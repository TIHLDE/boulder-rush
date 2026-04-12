import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateScore } from "@/lib/scoring";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { timeMs, databrusCount } = body as {
      timeMs?: unknown;
      databrusCount?: unknown;
    };

    if (typeof timeMs !== "number" || timeMs < 5000 || timeMs > 300000) {
      return NextResponse.json({ error: "Invalid time" }, { status: 400 });
    }

    if (typeof databrusCount !== "number" || databrusCount < 0 || databrusCount > 3) {
      return NextResponse.json({ error: "Invalid databrus count" }, { status: 400 });
    }

    const roundedTime = Math.round(timeMs);
    const expectedScore = calculateScore(roundedTime, databrusCount);

    const row = await prisma.score.findUnique({ where: { id } });

    if (!row) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    if (row.completedAt !== null) {
      return NextResponse.json({ error: "Score already submitted" }, { status: 409 });
    }

    const updated = await prisma.score.update({
      where: { id },
      data: {
        score: expectedScore,
        timeMs: roundedTime,
        databrusCount,
        completedAt: new Date(),
      },
    });

    const rank = await prisma.score.count({
      where: { score: { gt: expectedScore }, completedAt: { not: null } },
    });

    return NextResponse.json({ ...updated, rank: rank + 1 }, { status: 200 });
  } catch (error) {
    console.error("Score PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
