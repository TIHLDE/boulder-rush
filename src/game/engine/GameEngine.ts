import {
  Player,
  Obstacle,
  Databrus,
  Particle,
  GameConfig,
  GameResult,
  LANE_WIDTH,
  PLAYER_SIZE,
  START_Y,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  VERSUS_CANVAS_WIDTH,
} from "../types";
import { InputManager } from "./InputManager";
import { Camera } from "./Camera";
import { PhysicsSystem } from "../systems/PhysicsSystem";
import { CollisionSystem } from "../systems/CollisionSystem";
import { ParticleSystem } from "../systems/ParticleSystem";
import { Renderer } from "../rendering/Renderer";
import { createObstacles, createDatabrus } from "../data/laneLayout";
import { calculateScore } from "@/lib/scoring";

export type EngineState = "countdown" | "playing" | "finished";

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: GameConfig;
  private players: Player[] = [];
  private obstacles: Obstacle[] = [];
  private databrusPerLane: Databrus[][] = [];
  private particles: Particle[] = [];
  private cameras: Camera[] = [];
  private inputManager: InputManager;
  private physicsSystem: PhysicsSystem;
  private collisionSystem: CollisionSystem;
  private particleSystem: ParticleSystem;
  private renderer: Renderer;
  private state: EngineState = "countdown";
  private startTime: number = 0;
  private lastTime: number = 0;
  private animFrameId: number = 0;
  private countdownValue: number = 3;
  private countdownStartTime: number = 0;
  private elapsedMs: number = 0;
  private finishedCount: number = 0;

  onStateChange?: (state: EngineState) => void;
  onFinish?: (results: GameResult[]) => void;
  onHudUpdate?: (elapsed: number, databrusMasks: number[]) => void;
  onCountdownTick?: (value: number) => void;

  constructor(canvas: HTMLCanvasElement, config: GameConfig) {
    this.canvas = canvas;
    this.config = config;

    const isVersus = config.mode === "versus";
    const width = isVersus ? VERSUS_CANVAS_WIDTH : CANVAS_WIDTH;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;

    this.ctx = canvas.getContext("2d")!;
    this.ctx.scale(dpr, dpr);

    this.inputManager = new InputManager(config.mode);
    this.physicsSystem = new PhysicsSystem();
    this.collisionSystem = new CollisionSystem();
    this.particleSystem = new ParticleSystem();
    this.renderer = new Renderer(this.ctx, width, CANVAS_HEIGHT);

    // Create players
    for (let i = 0; i < config.players.length; i++) {
      this.players.push({
        id: i,
        x: LANE_WIDTH / 2,
        y: START_Y,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        vx: 0,
        vy: 0,
        character: config.players[i].character,
        name: config.players[i].name,
        scoreId: config.players[i].scoreId,
        databrusCollected: 0,
        databrusMask: 0,
        finishTime: null,
        inputUp: false,
        inputDown: false,
        inputLeft: false,
        inputRight: false,
      });
      this.cameras.push(new Camera());
      this.cameras[i].y = START_Y - CANVAS_HEIGHT * 0.75;
      this.databrusPerLane.push(createDatabrus());
    }

    this.obstacles = createObstacles();

    this.collisionSystem.setCallbacks({
      onDatabrusCollected: (_playerIndex: number) => {
        // HUD update handled in loop
      },
      onFinish: (_playerIndex: number, _timeMs: number) => {
        this.finishedCount++;
        if (this.finishedCount >= this.players.length) {
          this.state = "finished";
          this.onStateChange?.("finished");
          this.emitResults();
        }
      },
      spawnParticles: (x: number, y: number, color: string) => {
        this.particleSystem.spawn(this.particles, x, y, color);
      },
    });
  }

  start(): void {
    this.state = "countdown";
    this.countdownStartTime = performance.now();
    this.countdownValue = 3;
    this.onCountdownTick?.(3);
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = 0;
    }
    this.inputManager.destroy();
  }

  getState(): EngineState {
    return this.state;
  }

  private loop = (timestamp: number): void => {
    const rawDt = (timestamp - this.lastTime) / 1000;
    const dt = Math.min(rawDt, 0.033);
    this.lastTime = timestamp;

    if (this.state === "countdown") {
      this.updateCountdown(timestamp);
    } else if (this.state === "playing") {
      this.updatePlaying(dt, timestamp);
    }

    // Render regardless of state
    const time = timestamp / 1000;
    const isVersus = this.config.mode === "versus";
    const laneOffsets: number[] = [];
    const laneWidths: number[] = [];

    if (isVersus) {
      const laneW = VERSUS_CANVAS_WIDTH / 2;
      laneOffsets.push(0, laneW);
      laneWidths.push(laneW, laneW);
    } else {
      laneOffsets.push((CANVAS_WIDTH - LANE_WIDTH) / 2 - (CANVAS_WIDTH - LANE_WIDTH) / 2);
      laneWidths.push(CANVAS_WIDTH);
    }

    this.renderer.render(
      this.cameras,
      this.players,
      this.obstacles,
      this.databrusPerLane,
      this.particles,
      laneOffsets,
      laneWidths,
      time
    );

    // Draw countdown overlay
    if (this.state === "countdown") {
      this.drawCountdownOverlay();
    }

    if (this.state !== "finished") {
      this.animFrameId = requestAnimationFrame(this.loop);
    } else {
      // One more frame after finish for particles
      this.animFrameId = requestAnimationFrame(() => {
        // Final render
      });
    }
  };

  private updateCountdown(timestamp: number): void {
    const elapsed = (timestamp - this.countdownStartTime) / 1000;
    const newValue = 3 - Math.floor(elapsed);
    if (newValue !== this.countdownValue && newValue >= 0) {
      this.countdownValue = newValue;
      this.onCountdownTick?.(newValue);
    }
    if (elapsed >= 3.5) {
      this.state = "playing";
      this.startTime = performance.now();
      this.collisionSystem.setStartTime(this.startTime);
      this.onStateChange?.("playing");
    }
  }

  private updatePlaying(dt: number, _timestamp: number): void {
    this.inputManager.update(this.players);
    this.physicsSystem.update(this.players, dt);

    // Update collision per player with their own lane's databrus
    for (let i = 0; i < this.players.length; i++) {
      this.collisionSystem.update(
        [this.players[i]],
        this.obstacles,
        this.databrusPerLane[i],
        this.particles
      );
    }

    this.particleSystem.update(this.particles, dt);

    // Camera follow
    for (let i = 0; i < this.players.length; i++) {
      this.cameras[i].update(this.players[i]);
    }

    this.elapsedMs = performance.now() - this.startTime;

    // HUD update every ~100ms
    if (Math.floor(this.elapsedMs / 100) !== Math.floor((this.elapsedMs - dt * 1000) / 100)) {
      this.onHudUpdate?.(
        this.elapsedMs,
        this.players.map((p) => p.databrusMask)
      );
    }
  }

  private drawCountdownOverlay(): void {
    const ctx = this.ctx;
    const w = this.config.mode === "versus" ? VERSUS_CANVAS_WIDTH : CANVAS_WIDTH;

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, w, CANVAS_HEIGHT);

    const text = this.countdownValue > 0 ? String(this.countdownValue) : "GO!";
    ctx.fillStyle = this.countdownValue > 0 ? "#fff" : "#f1c40f";
    ctx.font = `bold ${this.countdownValue > 0 ? 120 : 80}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Scale animation
    const phase = (performance.now() - this.countdownStartTime) / 1000;
    const beatPhase = phase % 1;
    const scale = beatPhase < 0.15 ? 1 + (0.15 - beatPhase) * 2 : 1;

    ctx.save();
    ctx.translate(w / 2, CANVAS_HEIGHT / 2);
    ctx.scale(scale, scale);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }

  private emitResults(): void {
    const results: GameResult[] = this.players.map((p) => ({
      scoreId: p.scoreId,
      playerName: p.name,
      character: p.character,
      timeMs: Math.round(p.finishTime || this.elapsedMs),
      databrusCount: p.databrusCollected,
      score: calculateScore(
        Math.round(p.finishTime || this.elapsedMs),
        p.databrusCollected
      ),
    }));
    this.onFinish?.(results);
  }
}
