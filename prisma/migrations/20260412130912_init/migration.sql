-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "playerName" VARCHAR(20) NOT NULL,
    "character" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "timeMs" INTEGER NOT NULL,
    "databrusCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Score_mode_score_idx" ON "Score"("mode", "score" DESC);
