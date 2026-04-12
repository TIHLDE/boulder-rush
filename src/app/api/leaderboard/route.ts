import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_LIMIT = 500;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") || "all";
    const limitRaw = searchParams.get("limit");
    const parsed =
      limitRaw !== null && limitRaw !== "" ? parseInt(limitRaw, 10) : NaN;
    const take =
      Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, MAX_LIMIT) : undefined;

    const completed = { completedAt: { not: null } } as const;

    const where =
      mode === "all"
        ? completed
        : { ...completed, mode: mode as "single" | "versus" };

    const scores = await prisma.score.findMany({
      where,
      orderBy: { score: "desc" },
      ...(take !== undefined ? { take } : {}),
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
