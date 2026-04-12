import {
  Player,
  Obstacle,
  Databrus,
  Particle,
  PLAYER_SIZE,
  BOUNCE_FACTOR,
  FINISH_Y,
  databrusFlavorBit,
} from "../types";
import { getDatabrusDrawStyle } from "../data/databrusPalette";

export class CollisionSystem {
  private onDatabrusCollected?: (playerIndex: number) => void;
  private onFinish?: (playerIndex: number, timeMs: number) => void;
  private spawnParticles?: (x: number, y: number, color: string) => void;
  private startTime: number = 0;

  setCallbacks(callbacks: {
    onDatabrusCollected?: (playerIndex: number) => void;
    onFinish?: (playerIndex: number, timeMs: number) => void;
    spawnParticles?: (x: number, y: number, color: string) => void;
  }) {
    this.onDatabrusCollected = callbacks.onDatabrusCollected;
    this.onFinish = callbacks.onFinish;
    this.spawnParticles = callbacks.spawnParticles;
  }

  setStartTime(time: number) {
    this.startTime = time;
  }

  update(
    players: Player[],
    obstacles: Obstacle[],
    databrus: Databrus[],
    _particles: Particle[]
  ): void {
    for (const player of players) {
      if (player.finishTime !== null) continue;

      const pLeft = player.x - PLAYER_SIZE / 2;
      const pRight = player.x + PLAYER_SIZE / 2;
      const pTop = player.y - PLAYER_SIZE / 2;
      const pBottom = player.y + PLAYER_SIZE / 2;

      // Player vs Obstacles
      for (const obs of obstacles) {
        // Skip if not near
        if (
          Math.abs(player.y - (obs.y + obs.height / 2)) >
          PLAYER_SIZE / 2 + obs.height / 2 + 50
        )
          continue;

        const oLeft = obs.x;
        const oRight = obs.x + obs.width;
        const oTop = obs.y;
        const oBottom = obs.y + obs.height;

        // AABB overlap test
        if (pRight > oLeft && pLeft < oRight && pBottom > oTop && pTop < oBottom) {
          // Calculate penetration on each axis
          const overlapLeft = pRight - oLeft;
          const overlapRight = oRight - pLeft;
          const overlapTop = pBottom - oTop;
          const overlapBottom = oBottom - pTop;

          const minOverlapX = Math.min(overlapLeft, overlapRight);
          const minOverlapY = Math.min(overlapTop, overlapBottom);

          if (minOverlapX < minOverlapY) {
            // Resolve on X axis
            if (overlapLeft < overlapRight) {
              player.x -= overlapLeft;
            } else {
              player.x += overlapRight;
            }
            player.vx *= BOUNCE_FACTOR;
          } else {
            // Resolve on Y axis
            if (overlapTop < overlapBottom) {
              player.y -= overlapTop;
            } else {
              player.y += overlapBottom;
            }
            player.vy *= BOUNCE_FACTOR;
          }
        }
      }

      // Player vs Databrus
      for (const db of databrus) {
        if (db.collected) continue;
        const dx = player.x - db.x;
        const dy = player.y - db.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < PLAYER_SIZE / 2 + db.radius) {
          db.collected = true;
          db.collectTime = performance.now();
          player.databrusCollected++;
          player.databrusMask |= databrusFlavorBit(db.flavor);
          this.onDatabrusCollected?.(player.id);
          this.spawnParticles?.(db.x, db.y, getDatabrusDrawStyle(db.flavor).particle);
        }
      }

      // Finish line check
      if (player.y - PLAYER_SIZE / 2 <= FINISH_Y) {
        const timeMs = performance.now() - this.startTime;
        player.finishTime = timeMs;
        this.onFinish?.(player.id, timeMs);
        this.spawnParticles?.(player.x, player.y, "#f1c40f");
      }
    }
  }
}
