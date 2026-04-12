"use client";
import { GameMode } from "@/game/types";
import { IconSoloMode, IconVersusMode } from "@/components/arcade/ArcadeIcons";

interface Props {
  onSelect: (mode: GameMode) => void;
  onBack: () => void;
}

export default function ModeSelect({ onSelect, onBack }: Props) {
  return (
    <div className="relative z-[1] flex flex-col items-center justify-center min-h-screen gap-10 px-4">
      <h2 className="arcade-title text-xl sm:text-2xl text-neon text-center">SELECT MODE</h2>

      <div className="flex flex-col sm:flex-row gap-6">
        <button
          type="button"
          onClick={() => onSelect("single")}
          className="arcade-panel flex flex-col items-center gap-4 p-8 w-64 hover:border-neon-dim transition-colors cursor-pointer text-left"
        >
          <IconSoloMode size={56} />
          <span className="font-display text-[0.6rem] text-foreground">SINGLE</span>
          <span className="text-foreground/55 text-center text-base leading-snug">
            Chase your best score
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelect("versus")}
          className="arcade-panel flex flex-col items-center gap-4 p-8 w-64 hover:border-blue-game transition-colors cursor-pointer text-left"
        >
          <IconVersusMode size={56} />
          <span className="font-display text-[0.6rem] text-blue-game-light">1v1 LOCAL</span>
          <span className="text-foreground/55 text-center text-base leading-snug">
            Best of 3 rounds
          </span>
        </button>
      </div>

      <button type="button" onClick={onBack} className="arcade-btn-ghost text-lg">
        Back
      </button>
    </div>
  );
}
