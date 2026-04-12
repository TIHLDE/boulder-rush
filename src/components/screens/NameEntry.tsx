"use client";
import { useState } from "react";
import { GameMode, PlayerSetup } from "@/game/types";
import { CHARACTERS } from "@/game/data/characters";

interface Props {
  mode: GameMode;
  players: PlayerSetup[];
  onStart: (players: PlayerSetup[]) => void;
  onBack: () => void;
}

export default function NameEntry({ mode, players, onStart, onBack }: Props) {
  const [names, setNames] = useState<string[]>(players.map(() => ""));

  const canStart = names.every((n) => n.trim().length > 0);

  const handleStart = () => {
    if (!canStart) return;
    const updated = players.map((p, i) => ({
      ...p,
      name: names[i].trim().slice(0, 20),
    }));
    onStart(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canStart) {
      handleStart();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h2 className="text-4xl font-bold text-white">
        {mode === "versus" ? "Enter Names" : "Enter Your Name"}
      </h2>

      <div className="flex gap-8">
        {players.map((p, i) => {
          const char = CHARACTERS[p.character];
          return (
            <div key={i} className="flex flex-col items-center gap-4">
              {mode === "versus" && (
                <span className="text-white/50 text-sm">Player {i + 1}</span>
              )}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${char.color}30`, border: `2px solid ${char.color}` }}
              >
                {p.character === "abakule" ? "🤓" : "💼"}
              </div>
              <span className="font-bold" style={{ color: char.color }}>
                {char.name}
              </span>
              <input
                type="text"
                maxLength={20}
                value={names[i]}
                onChange={(e) => {
                  const newNames = [...names];
                  newNames[i] = e.target.value;
                  setNames(newNames);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Your name..."
                autoFocus={i === 0}
                className="px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white text-center text-lg focus:border-white/50 focus:outline-none transition-colors w-48"
              />
            </div>
          );
        })}
      </div>

      <div className="flex gap-4">
        <button onClick={onBack} className="text-white/50 hover:text-white transition-colors">
          ← Back
        </button>
        <button
          onClick={handleStart}
          disabled={!canStart}
          className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
            canStart
              ? "bg-gradient-to-r from-red-game to-blue-game text-white hover:scale-105"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }`}
        >
          START
        </button>
      </div>

      {mode === "versus" && (
        <p className="text-white/40 text-sm">
          P1: WASD &nbsp;|&nbsp; P2: Arrow Keys
        </p>
      )}
    </div>
  );
}
