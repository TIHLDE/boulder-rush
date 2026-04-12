"use client";
import { useEffect, useState } from "react";
import { CHARACTERS } from "@/game/data/characters";
import { CharacterId } from "@/game/types";

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
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h2 className="text-4xl font-bold text-white">Leaderboard</h2>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "single", "versus"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setFilter(mode)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              filter === mode
                ? "bg-white/20 text-white"
                : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            {mode === "all" ? "All" : mode === "single" ? "Solo" : "1v1"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="w-full max-w-2xl bg-white/5 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-white/50 text-sm border-b border-white/10">
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Player</th>
              <th className="py-3 px-4 text-center">Char</th>
              <th className="py-3 px-4 text-right">Score</th>
              <th className="py-3 px-4 text-right">Time</th>
              <th className="py-3 px-4 text-center">🥤</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-white/30">
                  Loading...
                </td>
              </tr>
            ) : scores.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-white/30">
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
                    className={`border-b border-white/5 ${
                      isHighlighted ? "bg-yellow-500/10" : "hover:bg-white/5"
                    }`}
                    style={
                      isHighlighted
                        ? { boxShadow: "inset 0 0 20px rgba(241, 196, 15, 0.1)" }
                        : undefined
                    }
                  >
                    <td className="py-3 px-4 font-bold text-white/80">
                      {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : entry.rank}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{entry.playerName}</td>
                    <td className="py-3 px-4 text-center">
                      {char && (
                        <span
                          className="inline-block w-6 h-6 rounded-full text-xs leading-6 text-center"
                          style={{ backgroundColor: `${char.color}40`, color: char.color }}
                        >
                          {entry.character === "abakule" ? "A" : "T"}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      {entry.score.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-white/60">
                      {(entry.timeMs / 1000).toFixed(2)}s
                    </td>
                    <td className="py-3 px-4 text-center text-white/60">
                      {entry.databrusCount}/3
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <button onClick={onBack} className="text-white/50 hover:text-white transition-colors">
        ← Back
      </button>
    </div>
  );
}
