"use client";
import { useState } from "react";
import { GameMode, CharacterId } from "@/game/types";
import { CHARACTERS } from "@/game/data/characters";
import { CharacterFace } from "@/components/arcade/CharacterFace";

interface Props {
  mode: GameMode;
  onSelect: (characters: CharacterId[]) => void;
  onBack: () => void;
}

export default function CharacterSelect({ mode, onSelect, onBack }: Props) {
  const [p1Choice, setP1Choice] = useState<CharacterId | null>(null);
  const [p2Choice, setP2Choice] = useState<CharacterId | null>(null);
  const isVersus = mode === "versus";

  const currentPicking = !isVersus ? 1 : p1Choice === null ? 1 : 2;

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
    <div className="relative z-[1] flex flex-col items-center justify-center min-h-screen gap-10 px-4">
      <h2 className="arcade-title text-lg sm:text-xl text-center text-neon px-2">
        {isVersus ? `P${currentPicking} — PICK FIGHTER` : "PICK FIGHTER"}
      </h2>

      <div className="flex flex-col sm:flex-row gap-8">
        {(Object.values(CHARACTERS) as (typeof CHARACTERS)[CharacterId][]).map((char) => {
          const isDisabled = isVersus && p1Choice === char.id;
          const isSelected =
            (!isVersus && p1Choice === char.id) ||
            (isVersus && (p1Choice === char.id || p2Choice === char.id));

          return (
            <button
              key={char.id}
              type="button"
              onClick={() => !isDisabled && handlePick(char.id)}
              disabled={isDisabled}
              className={`flex flex-col items-center gap-4 p-8 w-64 transition-all text-left rounded-sm
                ${isDisabled ? "opacity-40 cursor-not-allowed arcade-panel-muted" : "cursor-pointer arcade-panel hover:translate-y-[-2px]"}
              `}
              style={{
                borderColor: isSelected ? char.color : undefined,
                boxShadow: isSelected
                  ? `inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 0 #030308, 0 0 28px ${char.color}44`
                  : undefined,
              }}
            >
              <div
                className="p-1 border-[3px] rounded-sm"
                style={{ borderColor: char.color, backgroundColor: `${char.color}18` }}
              >
                <CharacterFace id={char.id} size={72} />
              </div>
              <div className="text-center w-full">
                <div className="font-display text-[0.55rem]" style={{ color: char.color }}>
                  {char.name}
                </div>
                <div className="text-foreground/50 text-base mt-1 leading-snug">{char.tagline}</div>
              </div>
              {isVersus && p1Choice === char.id && (
                <span className="font-display text-[0.45rem] text-foreground/60 border border-foreground/25 px-2 py-1">
                  P1
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button type="button" onClick={onBack} className="arcade-btn-ghost text-lg">
        Back
      </button>
    </div>
  );
}
