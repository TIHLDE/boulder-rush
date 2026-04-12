"use client";
import { useState } from "react";
import { GameConfig, RoundResult, GameResult } from "@/game/types";
import { CHARACTERS } from "@/game/data/characters";
import { TrophyIcon } from "@/components/arcade/ArcadeIcons";

interface Props {
  config: GameConfig;
  allRoundResults: RoundResult[];
  wins: number[];
  onSubmitScores: () => void;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export default function MatchResult({
  config,
  allRoundResults,
  wins,
  onSubmitScores,
  onPlayAgain,
  onMainMenu,
}: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const winnerIdx = wins[0] >= 2 ? 0 : 1;
  const winnerChar = CHARACTERS[config.players[winnerIdx].character];

  const bestResults: GameResult[] = config.players.map((_, pIdx) => {
    let best: GameResult | null = null;
    for (const round of allRoundResults) {
      const r = round.results[pIdx];
      if (!best || r.score > best.score) best = r;
    }
    return best!;
  });

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitError(null);
    setSubmitted(true);
    try {
      for (const result of bestResults) {
        const res = await fetch(`/api/scores/${result.scoreId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timeMs: result.timeMs,
            databrusCount: result.databrusCount,
          }),
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          setSubmitError(typeof data.error === "string" ? data.error : "Could not save scores.");
          setSubmitted(false);
          return;
        }
      }
      onSubmitScores();
    } catch {
      setSubmitError("Could not save scores.");
      setSubmitted(false);
    }
  };

  return (
    <div className="relative z-[1] flex flex-col items-center justify-center min-h-screen gap-8 px-4 py-8">
      <h2 className="arcade-title text-base sm:text-xl text-center px-2" style={{ color: winnerChar.color }}>
        {config.players[winnerIdx].name.toUpperCase()} WINS
      </h2>

      <TrophyIcon size={72} />

      <div className="flex items-center gap-8 font-display text-lg sm:text-xl">
        <div className="text-center">
          <div style={{ color: CHARACTERS[config.players[0].character].color }}>
            {config.players[0].name}
          </div>
          <div className="text-foreground mt-1">{wins[0]}</div>
        </div>
        <span className="text-foreground/35 text-sm">VS</span>
        <div className="text-center">
          <div style={{ color: CHARACTERS[config.players[1].character].color }}>
            {config.players[1].name}
          </div>
          <div className="text-foreground mt-1">{wins[1]}</div>
        </div>
      </div>

      <div className="arcade-panel-muted w-full max-w-lg p-6">
        {allRoundResults.map((round) => (
          <div key={round.round} className="flex flex-wrap items-center gap-4 text-base border-b border-neon/15 last:border-0 py-2">
            <span className="text-foreground/45 w-24 font-display text-[0.45rem]">R{round.round}</span>
            {round.results.map((r, i) => (
              <span
                key={i}
                className="font-mono"
                style={{ color: CHARACTERS[r.character].color }}
              >
                {(r.timeMs / 1000).toFixed(2)}s ({r.score})
              </span>
            ))}
          </div>
        ))}
      </div>

      {submitError && (
        <p className="text-red-400 text-base text-center px-4" role="alert">
          {submitError}
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-3 mt-2">
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={submitted}
          className={
            submitted
              ? "arcade-btn-secondary border-green-databrus text-green-databrus cursor-default"
              : "arcade-btn-secondary border-green-databrus text-green-databrus"
          }
        >
          {submitted ? "SAVED" : "SUBMIT BEST"}
        </button>
        <button type="button" onClick={onPlayAgain} className="arcade-btn-secondary uppercase">
          Rematch
        </button>
        <button type="button" onClick={onMainMenu} className="arcade-btn-ghost text-lg">
          Main menu
        </button>
      </div>
    </div>
  );
}
