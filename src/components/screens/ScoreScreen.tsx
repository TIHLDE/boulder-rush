"use client";
import { useEffect, useState } from "react";
import { GameResult, GameMode } from "@/game/types";
import { CHARACTERS } from "@/game/data/characters";
import { calculateTimeScore, calculateDatabrusBonus } from "@/lib/scoring";
import { CharacterFace } from "@/components/arcade/CharacterFace";
import { DatabrusIcon } from "@/components/arcade/ArcadeIcons";

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
    <div className="relative z-[1] flex flex-col items-center justify-center min-h-screen gap-10 px-4 py-8">
      <h2 className="arcade-title text-lg sm:text-2xl text-center text-neon">
        {mode === "versus" ? "MATCH RESULTS" : "RUN COMPLETE"}
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {results.map((result, i) => {
          const char = CHARACTERS[result.character];
          const timeScore = calculateTimeScore(result.timeMs);
          const databrusBonus = calculateDatabrusBonus(result.databrusCount);

          return (
            <div
              key={i}
              className="arcade-panel flex flex-col items-center gap-4 p-8 min-w-[280px]"
              style={{ borderColor: `${char.color}aa`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 0 #030308, 0 0 20px ${char.color}22` }}
            >
              <div className="p-1 border-[3px] rounded-sm" style={{ borderColor: char.color }}>
                <CharacterFace id={result.character} size={56} />
              </div>
              <span className="font-display text-[0.55rem]" style={{ color: char.color }}>
                {result.playerName}
              </span>

              {showBreakdown && (
                <div className="flex flex-col gap-2 w-full text-base">
                  <div className="flex justify-between text-foreground/55">
                    <span>Time</span>
                    <span className="font-mono">{(result.timeMs / 1000).toFixed(2)}s</span>
                  </div>
                  <div className="flex justify-between text-foreground/55">
                    <span>Time score</span>
                    <span className="font-mono">{timeScore.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-databrus items-center gap-2">
                    <span className="flex items-center gap-1">
                      <DatabrusIcon size={18} />
                      <span>x{result.databrusCount}</span>
                    </span>
                    <span className="font-mono">+{databrusBonus.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-neon/25 my-1" />
                  <div className="flex justify-between font-display text-[0.65rem] text-foreground">
                    <span>TOTAL</span>
                    <span className="font-mono tracking-tight">{animatedScores[i].toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitted}
          className={
            submitted
              ? "arcade-btn-secondary border-green-databrus text-green-databrus cursor-default"
              : "arcade-btn-secondary border-green-databrus text-green-databrus hover:text-white"
          }
        >
          {submitted ? "SAVED" : "SUBMIT SCORE"}
        </button>
        <button type="button" onClick={onPlayAgain} className="arcade-btn-secondary uppercase">
          Again
        </button>
        <button type="button" onClick={onMainMenu} className="arcade-btn-ghost text-lg">
          Main menu
        </button>
      </div>
    </div>
  );
}
