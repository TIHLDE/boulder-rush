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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canStart = names.every((n) => n.trim().length > 0);

  const handleStart = async () => {
    if (!canStart || loading) return;

    if (mode === "versus" && names.length === 2) {
      const a = names[0].trim().toLowerCase();
      const b = names[1].trim().toLowerCase();
      if (a === b) {
        setError("Players must use different names.");
        return;
      }
    }

    setError(null);
    setLoading(true);
    try {
      const playersPayload = players.map((p, i) => ({
        playerName: names[i].trim().slice(0, 20),
        character: p.character,
      }));
      const res = await fetch("/api/scores/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, players: playersPayload }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; entries?: { id: string; playerName: string }[] };
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not reserve names.");
        return;
      }
      if (!data.entries || data.entries.length !== players.length) {
        setError("Invalid response from server.");
        return;
      }
      const updated: PlayerSetup[] = players.map((p, i) => ({
        ...p,
        name: data.entries![i].playerName,
        scoreId: data.entries![i].id,
      }));
      onStart(updated);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canStart && !loading) {
      void handleStart();
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
                disabled={loading}
                className="arcade-input w-full"
              />
            </div>
          );
        })}
      </div>

      {error && (
        <p className="text-red-400 text-base text-center max-w-md" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button type="button" onClick={onBack} disabled={loading} className="arcade-btn-ghost text-lg">
          Back
        </button>
        <button
          type="button"
          onClick={() => void handleStart()}
          disabled={!canStart || loading}
          className="arcade-btn-primary uppercase"
        >
          {loading ? "…" : "Start"}
        </button>
      </div>

      {mode === "versus" ? (
        <p className="text-foreground/45 text-base text-center">
          P1: WASD &nbsp;|&nbsp; P2: Arrow Keys
        </p>
      ) : (
        <p className="text-foreground/45 text-base text-center">Arrow keys to move</p>
      )}
    </div>
  );
}
