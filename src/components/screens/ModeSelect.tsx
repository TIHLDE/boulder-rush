"use client";
import { GameMode } from "@/game/types";

interface Props {
  onSelect: (mode: GameMode) => void;
  onBack: () => void;
}

export default function ModeSelect({ onSelect, onBack }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h2 className="text-4xl font-bold text-white">Select Mode</h2>

      <div className="flex gap-6">
        <button
          onClick={() => onSelect("single")}
          className="flex flex-col items-center gap-4 p-8 bg-white/5 border-2 border-white/10 rounded-2xl hover:border-red-game/50 hover:bg-white/10 transition-all w-64"
        >
          <div className="text-5xl">🎮</div>
          <span className="text-xl font-bold text-white">Single Player</span>
          <span className="text-white/50 text-sm">Chase your best score</span>
        </button>

        <button
          onClick={() => onSelect("versus")}
          className="flex flex-col items-center gap-4 p-8 bg-white/5 border-2 border-white/10 rounded-2xl hover:border-blue-game/50 hover:bg-white/10 transition-all w-64"
        >
          <div className="text-5xl">🆚</div>
          <span className="text-xl font-bold text-white">1v1 Local</span>
          <span className="text-white/50 text-sm">Best of 3 rounds</span>
        </button>
      </div>

      <button onClick={onBack} className="text-white/50 hover:text-white transition-colors">
        ← Back
      </button>
    </div>
  );
}
