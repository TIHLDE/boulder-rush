"use client";
import { useEffect, useRef, useState } from "react";
import {
  GameConfig,
  GameResult,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  VERSUS_CANVAS_WIDTH,
  DATABRUS_FLAVOR_ORDER,
  databrusFlavorBit,
} from "@/game/types";
import { GameEngine } from "@/game/engine/GameEngine";
import { DatabrusIcon } from "@/components/arcade/ArcadeIcons";

interface Props {
  config: GameConfig;
  onFinish: (results: GameResult[]) => void;
}

export default function GameCanvas({ config, onFinish }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [databrusMasks, setDatabrusMasks] = useState<number[]>(() =>
    config.players.map(() => 0)
  );
  const [countdown, setCountdown] = useState<number | null>(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(canvas, config);
    engineRef.current = engine;
    setDatabrusMasks(config.players.map(() => 0));

    engine.onHudUpdate = (ms, masks) => {
      setElapsed(ms);
      setDatabrusMasks(masks);
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
    <div className="relative z-[1] flex flex-col items-center gap-4 px-2">
      <div
        className="flex justify-between items-stretch gap-2 px-3 py-2 arcade-panel-muted border-neon/40"
        style={{ width }}
      >
        {config.players.map((p, i) => (
          <div key={i} className="flex flex-1 flex-wrap items-center gap-3 min-w-0">
            <span
              className="font-display text-[0.45rem] truncate shrink-0"
              style={{ color: p.character === "abakule" ? "#e63946" : "#1d8cf8" }}
            >
              {p.name}
            </span>
            <span className="text-foreground/70 font-mono text-sm shrink-0">
              {(elapsed / 1000).toFixed(1)}s
            </span>
            <span className="flex flex-wrap items-center gap-0.5">
              {DATABRUS_FLAVOR_ORDER.map((flavor) => (
                <DatabrusIcon
                  key={flavor}
                  variant={flavor}
                  dimmed={((databrusMasks[i] ?? 0) & databrusFlavorBit(flavor)) === 0}
                  size={16}
                />
              ))}
            </span>
          </div>
        ))}
      </div>

      <div className="arcade-cabinet-bezel">
        <div className="arcade-screen-inner" style={{ width }}>
          <canvas
            ref={canvasRef}
            className="block w-full bg-black"
            style={{ width, height: CANVAS_HEIGHT, imageRendering: "pixelated" }}
          />
        </div>
        <p className="font-display text-[0.35rem] text-center text-foreground/35 mt-2 tracking-[0.3em]">
          CRT-01
        </p>
      </div>

      {countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Countdown is drawn on canvas */}
        </div>
      )}
    </div>
  );
}
