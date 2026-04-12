"use client";
import { useState } from "react";
import { GameMode, CharacterId } from "@/game/types";
import { CHARACTERS } from "@/game/data/characters";

interface Props {
  mode: GameMode;
  onSelect: (characters: CharacterId[]) => void;
  onBack: () => void;
}

export default function CharacterSelect({ mode, onSelect, onBack }: Props) {
  const [p1Choice, setP1Choice] = useState<CharacterId | null>(null);
  const [p2Choice, setP2Choice] = useState<CharacterId | null>(null);
  const isVersus = mode === "versus";

  const currentPicking = !isVersus
    ? 1
    : p1Choice === null
      ? 1
      : 2;

  const handlePick = (id: CharacterId) => {
    if (!isVersus) {
      onSelect([id]);
      return;
    }

    if (p1Choice === null) {
      setP1Choice(id);
    } else if (p2Choice === null && id !== p1Choice) {
      setP2Choice(id);
      onSelect([p1Choice, id]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h2 className="text-4xl font-bold text-white">
        {isVersus ? `Player ${currentPicking} — Choose Character` : "Choose Character"}
      </h2>

      <div className="flex gap-8">
        {(Object.values(CHARACTERS) as typeof CHARACTERS[CharacterId][]).map((char) => {
          const isDisabled = isVersus && p1Choice === char.id;
          const isSelected =
            (!isVersus && p1Choice === char.id) ||
            (isVersus && (p1Choice === char.id || p2Choice === char.id));

          return (
            <button
              key={char.id}
              onClick={() => !isDisabled && handlePick(char.id)}
              disabled={isDisabled}
              className={`flex flex-col items-center gap-4 p-8 rounded-2xl border-3 transition-all w-64
                ${isDisabled ? "opacity-40 cursor-not-allowed border-white/10" : "cursor-pointer hover:scale-105"}
                ${isSelected ? `border-[${char.color}] bg-white/10` : "border-white/10 bg-white/5"}
              `}
              style={{
                borderColor: isSelected ? char.color : undefined,
                boxShadow: isSelected ? `0 0 30px ${char.color}40` : undefined,
              }}
            >
              {/* Character avatar */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
                style={{ backgroundColor: `${char.color}30`, border: `3px solid ${char.color}` }}
              >
                {char.id === "abakule" ? "🤓" : "💼"}
              </div>
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: char.color }}>
                  {char.name}
                </div>
                <div className="text-white/50 text-sm mt-1">{char.tagline}</div>
              </div>
              {isVersus && p1Choice === char.id && (
                <span className="text-xs px-2 py-1 rounded bg-white/10 text-white/70">
                  P1 Selected
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button onClick={onBack} className="text-white/50 hover:text-white transition-colors">
        ← Back
      </button>
    </div>
  );
}
