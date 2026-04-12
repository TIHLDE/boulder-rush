"use client";
import { useEffect, useState } from "react";
import { GameResult, GameMode } from "@/game/types";
import { CHARACTERS } from "@/game/data/characters";
import { calculateTimeScore, calculateDatabrusBonus } from "@/lib/scoring";

interface Props {
  results: GameResult[];
  mode: GameMode;
  onSubmitScores: () => void;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export default function ScoreScreen({
  results,
  mode,
  onSubmitScores,
  onPlayAgain,
  onMainMenu,
}: Props) {
  const [animatedScores, setAnimatedScores] = useState<number[]>(results.map(() => 0));
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBreakdown(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showBreakdown) return;
    const duration = 1500;
    const start = performance.now();

    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedScores(results.map((r) => Math.round(r.score * eased)));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [showBreakdown, results]);

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);
    for (const result of results) {
      await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: result.playerName,
          character: result.character,
          mode,
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
      <h2 className="text-5xl font-black text-white">
        {mode === "versus" ? "Match Results" : "Run Complete!"}
      </h2>

      <div className="flex gap-8">
        {results.map((result, i) => {
          const char = CHARACTERS[result.character];
          const timeScore = calculateTimeScore(result.timeMs);
          const databrusBonus = calculateDatabrusBonus(result.databrusCount);

          return (
            <div
              key={i}
              className="flex flex-col items-center gap-4 p-8 bg-white/5 rounded-2xl border-2 min-w-[280px]"
              style={{ borderColor: `${char.color}50` }}
            >
              {/* Character info */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${char.color}30`, border: `2px solid ${char.color}` }}
              >
                {result.character === "abakule" ? "🤓" : "💼"}
              </div>
              <span className="font-bold text-xl" style={{ color: char.color }}>
                {result.playerName}
              </span>

              {/* Score breakdown */}
              {showBreakdown && (
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex justify-between text-white/60">
                    <span>Time</span>
                    <span className="font-mono">{(result.timeMs / 1000).toFixed(2)}s</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Time Score</span>
                    <span className="font-mono">{timeScore.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span>Databrus x{result.databrusCount}</span>
                    <span className="font-mono">+{databrusBonus.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/20 my-1" />
                  <div className="flex justify-between text-2xl font-black text-white">
                    <span>Total</span>
                    <span className="font-mono">{animatedScores[i].toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
          {submitted ? "✓ Submitted!" : "Submit to Leaderboard"}
        </button>
        <button
          onClick={onPlayAgain}
          className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors"
        >
          Play Again
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
