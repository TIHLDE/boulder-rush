-- Unique player names (reserve-then-complete flow).
-- Existing rows: backfill playerNameKey, dedupe by key (keep highest score, then oldest createdAt),
-- mark all as completed. New in-progress rows use completedAt NULL and score 0.

-- AlterTable
ALTER TABLE "Score" ADD COLUMN "playerNameKey" VARCHAR(20),
ADD COLUMN "completedAt" TIMESTAMP(3);

-- Backfill keys from display name (case-insensitive identity)
UPDATE "Score" SET "playerNameKey" = lower(trim("playerName"));

-- Dedupe: one row per playerNameKey (drops lower-scoring duplicate names)
DELETE FROM "Score" s
WHERE s.id IN (
  SELECT id FROM (
    SELECT id,
      ROW_NUMBER() OVER (
        PARTITION BY "playerNameKey"
        ORDER BY score DESC, "createdAt" ASC
      ) AS rn
    FROM "Score"
  ) sub WHERE sub.rn > 1
);

-- Historical scores are completed
UPDATE "Score" SET "completedAt" = "createdAt" WHERE "completedAt" IS NULL;

ALTER TABLE "Score" ALTER COLUMN "playerNameKey" SET NOT NULL;
ALTER TABLE "Score" ALTER COLUMN "score" SET DEFAULT 0;

CREATE UNIQUE INDEX "Score_playerNameKey_key" ON "Score"("playerNameKey");
