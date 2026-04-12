"use client";
import { GameConfig, RoundResult } from "@/game/types";
import { CHARACTERS } from "@/game/data/characters";

interface Props {
  config: GameConfig;
  allRoundResults: RoundResult[];
  round: number;
  wins: number[];
  onNextRound: () => void;
}

export default function RoundScore({ config, allRoundResults, round, wins, onNextRound }: Props) {
  const lastRound = allRoundResults[allRoundResults.length - 1];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h2 className="text-4xl font-bold text-white">Round {round} Complete!</h2>

      {/* Round result */}
      <div className="flex gap-8">
        {lastRound.results.map((result, i) => {
          const char = CHARACTERS[result.character];
          const isWinner =
            lastRound.results.length === 2 &&
            result.timeMs ===
              Math.min(lastRound.results[0].timeMs, lastRound.results[1].timeMs);

          return (
            <div
              key={i}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 ${
                isWinner ? "bg-white/10" : "bg-white/5"
              }`}
              style={{ borderColor: isWinner ? char.color : "rgba(255,255,255,0.1)" }}
            >
              <span className="font-bold text-lg" style={{ color: char.color }}>
                {result.playerName}
              </span>
              <span className="text-white/60 font-mono">
                {(result.timeMs / 1000).toFixed(2)}s
              </span>
              <span className="text-white font-bold text-xl">{result.score.toLocaleString()}</span>
              {isWinner && <span className="text-yellow-400 font-bold">🏆 Round Winner!</span>}
            </div>
          );
        })}
      </div>

      {/* Series score */}
      <div className="flex items-center gap-6 text-3xl font-black">
        <span style={{ color: CHARACTERS[config.players[0].character].color }}>
          {wins[0]}
        </span>
        <span className="text-white/30">-</span>
        <span style={{ color: CHARACTERS[config.players[1].character].color }}>
          {wins[1]}
        </span>
      </div>

      <button
        onClick={onNextRound}
        className="px-8 py-4 bg-gradient-to-r from-red-game to-blue-game text-white font-bold text-xl rounded-xl hover:scale-105 transition-transform"
      >
        Next Round →
      </button>
    </div>
  );
}
