import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") || "all";
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

    const completed = { completedAt: { not: null } } as const;

    const where =
      mode === "all"
        ? completed
        : { ...completed, mode: mode as "single" | "versus" };

    const scores = await prisma.score.findMany({
      where,
      orderBy: { score: "desc" },
      take: limit,
    });

    const ranked = scores.map((s, i) => ({
      ...s,
      rank: i + 1,
    }));

    return NextResponse.json({ scores: ranked });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ scores: [] });
  }
}
