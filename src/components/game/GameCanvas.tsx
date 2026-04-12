"use client";
import { useEffect, useRef, useState } from "react";
import { GameConfig, GameResult, CANVAS_WIDTH, CANVAS_HEIGHT, VERSUS_CANVAS_WIDTH } from "@/game/types";
import { GameEngine } from "@/game/engine/GameEngine";

interface Props {
  config: GameConfig;
  onFinish: (results: GameResult[]) => void;
}

export default function GameCanvas({ config, onFinish }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [databrus, setDatabrus] = useState<number[]>([0]);
  const [countdown, setCountdown] = useState<number | null>(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(canvas, config);
    engineRef.current = engine;

    engine.onHudUpdate = (ms, db) => {
      setElapsed(ms);
      setDatabrus(db);
    };

    engine.onCountdownTick = (val) => {
      setCountdown(val <= 0 ? null : val);
    };

    engine.onStateChange = (state) => {
      if (state === "playing") {
        setCountdown(null);
      }
    };

    engine.onFinish = (results) => {
      onFinish(results);
    };

    engine.start();

    return () => {
      engine.stop();
    };
  }, [config, onFinish]);

  const isVersus = config.mode === "versus";
  const width = isVersus ? VERSUS_CANVAS_WIDTH : CANVAS_WIDTH;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* HUD */}
      <div
        className="flex justify-between items-center px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm"
        style={{ width }}
      >
        {config.players.map((p, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="font-bold text-sm" style={{ color: p.character === "abakule" ? "#e63946" : "#1d8cf8" }}>
              {p.name}
            </span>
            <span className="text-white/70 text-sm font-mono">
              {(elapsed / 1000).toFixed(1)}s
            </span>
            <span className="text-green-400 text-sm">
              {"🥤".repeat(databrus[i] || 0)}
            </span>
          </div>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-2xl"
        style={{ width, height: CANVAS_HEIGHT }}
      />

      {countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Countdown is drawn on canvas */}
        </div>
      )}
    </div>
  );
}
