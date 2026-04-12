export type CharacterId = "abakule" | "tihldev";
export type GameMode = "single" | "versus";
export type DatabrusFlavor = "white" | "purple" | "green";

/** HUD / bitmask order: white=1, purple=2, green=4 */
export const DATABRUS_FLAVOR_ORDER: DatabrusFlavor[] = ["white", "purple", "green"];

export function databrusFlavorBit(flavor: DatabrusFlavor): number {
  switch (flavor) {
    case "white":
      return 1;
    case "purple":
      return 2;
    case "green":
      return 4;
  }
}

export interface Player {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  character: CharacterId;
  name: string;
  databrusCollected: number;
  /** Bitmask of collected flavors; see databrusFlavorBit */
  databrusMask: number;
  finishTime: number | null;
  inputUp: boolean;
  inputDown: boolean;
  inputLeft: boolean;
  inputRight: boolean;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Databrus {
  x: number;
  y: number;
  radius: number;
  flavor: DatabrusFlavor;
  collected: boolean;
  glowPhase: number;
  collectTime: number | null;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface GameConfig {
  mode: GameMode;
  players: PlayerSetup[];
}

export interface PlayerSetup {
  name: string;
  character: CharacterId;
}

export interface GameResult {
  playerName: string;
  character: CharacterId;
  timeMs: number;
  databrusCount: number;
  score: number;
}

export interface RoundResult {
  round: number;
  results: GameResult[];
}

export const LANE_WIDTH = 400;
export const LANE_HEIGHT = 6000;
export const PLAYER_SIZE = 36;
export const START_Y = 5800;
export const FINISH_Y = 200;
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const VERSUS_CANVAS_WIDTH = 1200;

export const ACCELERATION = 1800;
export const MAX_SPEED = 420;
export const FRICTION = 0.88;
export const BOUNCE_FACTOR = -0.3;
export const DATABRUS_RADIUS = 16;
