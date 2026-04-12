"use client";
import { useState } from "react";
import { GameConfig, RoundResult, GameResult } from "@/game/types";
import { CHARACTERS } from "@/game/data/characters";

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
  const winnerIdx = wins[0] >= 2 ? 0 : 1;
  const winnerChar = CHARACTERS[config.players[winnerIdx].character];

  // Get best score per player across all rounds
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
    setSubmitted(true);
    for (const result of bestResults) {
      await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: result.playerName,
          character: result.character,
          mode: "versus",
          score: result.score,
          timeMs: result.timeMs,
          databrusCount: result.databrusCount,
        }),
      });
    }
    onSubmitScores();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h2 className="text-5xl font-black" style={{ color: winnerChar.color }}>
        {config.players[winnerIdx].name} WINS!
      </h2>

      <div className="text-6xl">🏆</div>

      {/* Final series score */}
      <div className="flex items-center gap-8 text-4xl font-black">
        <div className="text-center">
          <div style={{ color: CHARACTERS[config.players[0].character].color }}>
            {config.players[0].name}
          </div>
          <div className="text-white">{wins[0]}</div>
        </div>
        <span className="text-white/30 text-2xl">vs</span>
        <div className="text-center">
          <div style={{ color: CHARACTERS[config.players[1].character].color }}>
            {config.players[1].name}
          </div>
          <div className="text-white">{wins[1]}</div>
        </div>
      </div>

      {/* Round-by-round summary */}
      <div className="flex flex-col gap-2 bg-white/5 p-6 rounded-xl">
        {allRoundResults.map((round) => (
          <div key={round.round} className="flex items-center gap-4 text-sm">
            <span className="text-white/50 w-20">Round {round.round}</span>
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

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSubmit}
          disabled={submitted}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            submitted
              ? "bg-green-500/20 text-green-400"
              : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:scale-105"
          }`}
        >
          {submitted ? "✓ Submitted!" : "Submit Best Scores"}
        </button>
        <button
          onClick={onPlayAgain}
          className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors"
        >
          Rematch
        </button>
        <button
          onClick={onMainMenu}
          className="px-6 py-3 text-white/50 hover:text-white transition-colors"
        >
          Main Menu
        </button>
      </div>
    </div>
  );
}
