"use client";
import { useState } from "react";
import { GameMode, PlayerSetup } from "@/game/types";
import { CHARACTERS } from "@/game/data/characters";
import { CharacterFace } from "@/components/arcade/CharacterFace";

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
    <div className="relative z-[1] flex flex-col items-center justify-center min-h-screen gap-10 px-4">
      <h2 className="arcade-title text-lg sm:text-xl text-neon text-center">
        {mode === "versus" ? "ENTER NAMES" : "ENTER NAME"}
      </h2>

      <div className="flex flex-col sm:flex-row gap-10">
        {players.map((p, i) => {
          const char = CHARACTERS[p.character];
          return (
            <div key={i} className="flex flex-col items-center gap-4 arcade-panel-muted p-6 w-56">
              {mode === "versus" && (
                <span className="font-display text-[0.45rem] text-foreground/50">P{i + 1}</span>
              )}
              <div className="p-1 border-2 rounded-sm" style={{ borderColor: char.color }}>
                <CharacterFace id={p.character} size={56} />
              </div>
              <span className="font-display text-[0.45rem]" style={{ color: char.color }}>
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
                placeholder="Name..."
                autoFocus={i === 0}
                className="arcade-input w-full"
              />
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button type="button" onClick={onBack} className="arcade-btn-ghost text-lg">
          Back
        </button>
        <button
          type="button"
          onClick={handleStart}
          disabled={!canStart}
          className="arcade-btn-primary uppercase"
        >
          Start
        </button>
      </div>

      {mode === "versus" && (
        <p className="text-foreground/45 text-base text-center">
          P1: WASD &nbsp;|&nbsp; P2: Arrow Keys
        </p>
      )}
    </div>
  );
}
