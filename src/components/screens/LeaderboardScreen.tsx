"use client";
import { useEffect, useState } from "react";
import { CHARACTERS } from "@/game/data/characters";
import { CharacterId } from "@/game/types";
import { CharacterFace } from "@/components/arcade/CharacterFace";
import { DatabrusIcon, RankBadge } from "@/components/arcade/ArcadeIcons";

interface ScoreEntry {
  id: string;
  playerName: string;
  character: string;
  mode: string;
  score: number;
  timeMs: number;
  databrusCount: number;
  createdAt: string;
  rank: number;
}

interface Props {
  onBack: () => void;
  highlightName?: string;
}

export default function LeaderboardScreen({ onBack, highlightName }: Props) {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [filter, setFilter] = useState<"all" | "single" | "versus">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?mode=${filter}&limit=10`)
      .then((r) => r.json())
      .then((data) => {
        setScores(data.scores || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter]);

  return (
    <div className="relative z-[1] flex flex-col items-center justify-center min-h-screen gap-8 px-4 py-10">
      <h2 className="arcade-title text-xl sm:text-2xl text-neon">LEADERBOARD</h2>

      <div className="flex gap-2">
        {(["all", "single", "versus"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setFilter(mode)}
            className={
              filter === mode
                ? "arcade-btn-primary text-[0.45rem] py-2 px-3"
                : "arcade-btn-secondary text-[0.45rem] py-2 px-3 opacity-80"
            }
          >
            {mode === "all" ? "ALL" : mode === "single" ? "SOLO" : "1V1"}
          </button>
        ))}
      </div>

      <div className="w-full max-w-2xl arcade-panel overflow-hidden">
        <table className="w-full text-base">
          <thead>
            <tr className="text-foreground/50 border-b border-neon/25 font-display text-[0.4rem]">
              <th className="py-3 px-3 text-left">#</th>
              <th className="py-3 px-3 text-left">PLAYER</th>
              <th className="py-3 px-3 text-center" title="Character">
                <span className="sr-only">Character</span>
                <span className="text-neon">FIGHTER</span>
              </th>
              <th className="py-3 px-3 text-right">SCORE</th>
              <th className="py-3 px-3 text-right">TIME</th>
              <th className="py-3 px-3 text-center">
                <span className="inline-flex justify-center" title="Databrus">
                  <DatabrusIcon size={18} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-foreground/35">
                  Loading...
                </td>
              </tr>
            ) : scores.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-foreground/35">
                  No scores yet. Be the first!
                </td>
              </tr>
            ) : (
              scores.map((entry) => {
                const char = CHARACTERS[entry.character as CharacterId];
                const isHighlighted = highlightName && entry.playerName === highlightName;
                return (
                  <tr
                    key={entry.id}
                    className={`border-b border-neon/10 ${
                      isHighlighted ? "bg-gold-databrus/10" : "hover:bg-panel-deep/80"
                    }`}
                    style={
                      isHighlighted
                        ? { boxShadow: "inset 0 0 16px rgba(241, 196, 15, 0.08)" }
                        : undefined
                    }
                  >
                    <td className="py-3 px-3">
                      <RankBadge rank={entry.rank} />
                    </td>
                    <td className="py-3 px-3 font-semibold text-foreground">{entry.playerName}</td>
                    <td className="py-3 px-3 text-center">
                      {char && (
                        <div className="inline-flex justify-center p-0.5 border border-neon/30 rounded-sm bg-panel-deep">
                          <CharacterFace id={entry.character as CharacterId} size={28} />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-foreground">
                      {entry.score.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-foreground/60">
                      {(entry.timeMs / 1000).toFixed(2)}s
                    </td>
                    <td className="py-3 px-3 text-center text-foreground/60 font-mono">
                      {entry.databrusCount}/3
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <button type="button" onClick={onBack} className="arcade-btn-ghost text-lg">
        Back
      </button>
    </div>
  );
}
