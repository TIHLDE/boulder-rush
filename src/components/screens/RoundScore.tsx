"use client";
import { GameConfig, RoundResult } from "@/game/types";
import { CHARACTERS } from "@/game/data/characters";
import { TrophyIcon } from "@/components/arcade/ArcadeIcons";

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
    <div className="relative z-[1] flex flex-col items-center justify-center min-h-screen gap-10 px-4">
      <h2 className="arcade-title text-lg sm:text-2xl text-neon text-center">
        ROUND {round} CLEAR
      </h2>

      <div className="flex flex-col sm:flex-row gap-8">
        {lastRound.results.map((result, i) => {
          const char = CHARACTERS[result.character];
          const isWinner =
            lastRound.results.length === 2 &&
            result.timeMs === Math.min(lastRound.results[0].timeMs, lastRound.results[1].timeMs);

          return (
            <div
              key={i}
              className={isWinner ? "arcade-panel p-8 min-w-[200px]" : "arcade-panel-muted p-8 min-w-[200px]"}
              style={{
                borderColor: isWinner ? char.color : undefined,
                boxShadow: isWinner ? `0 0 24px ${char.color}33` : undefined,
              }}
            >
              <div className="flex flex-col items-center gap-3">
                <span className="font-display text-[0.55rem]" style={{ color: char.color }}>
                  {result.playerName}
                </span>
                <span className="text-foreground/55 font-mono text-lg">
                  {(result.timeMs / 1000).toFixed(2)}s
                </span>
                <span className="font-display text-[0.6rem] text-foreground">{result.score.toLocaleString()}</span>
                {isWinner && (
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <TrophyIcon size={40} />
                    <span className="font-display text-[0.45rem] text-gold-databrus">ROUND WINNER</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-6 font-display text-xl sm:text-2xl">
        <span style={{ color: CHARACTERS[config.players[0].character].color }}>{wins[0]}</span>
        <span className="text-foreground/35">—</span>
        <span style={{ color: CHARACTERS[config.players[1].character].color }}>{wins[1]}</span>
      </div>

      <button type="button" onClick={onNextRound} className="arcade-btn-primary uppercase">
        Next round
      </button>
    </div>
  );
}
