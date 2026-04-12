import { NextResponse } from "next/server";

/** Legacy endpoint — scores are reserved at game start and completed via PATCH. */
export async function POST() {
  return NextResponse.json(
    { error: "Use POST /api/scores/reserve then PATCH /api/scores/:id" },
    { status: 410 }
  );
}
