import {
  Player,
  ACCELERATION,
  MAX_SPEED,
  FRICTION,
  LANE_WIDTH,
  LANE_HEIGHT,
  PLAYER_SIZE,
} from "../types";

export class PhysicsSystem {
  update(players: Player[], dt: number): void {
    for (const player of players) {
      if (player.finishTime !== null) continue;

      // Apply acceleration from input
      if (player.inputUp) {
        player.vy -= ACCELERATION * dt;
      }
      if (player.inputDown) {
        player.vy += ACCELERATION * dt;
      }
      if (player.inputLeft) {
        player.vx -= ACCELERATION * dt;
      }
      if (player.inputRight) {
        player.vx += ACCELERATION * dt;
      }

      // Apply friction when no input on axis
      if (!player.inputLeft && !player.inputRight) {
        player.vx *= FRICTION;
      }
      if (!player.inputUp && !player.inputDown) {
        player.vy *= FRICTION;
      }

      // Clamp speed
      player.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, player.vx));
      player.vy = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, player.vy));

      // Stop tiny velocities
      if (Math.abs(player.vx) < 1) player.vx = 0;
      if (Math.abs(player.vy) < 1) player.vy = 0;

      // Update position
      player.x += player.vx * dt;
      player.y += player.vy * dt;

      // Clamp to lane boundaries
      const halfW = PLAYER_SIZE / 2;
      if (player.x < halfW) {
        player.x = halfW;
        player.vx = 0;
      }
      if (player.x > LANE_WIDTH - halfW) {
        player.x = LANE_WIDTH - halfW;
        player.vx = 0;
      }
      if (player.y < 0) {
        player.y = 0;
        player.vy = 0;
      }
      if (player.y > LANE_HEIGHT) {
        player.y = LANE_HEIGHT;
        player.vy = 0;
      }
    }
  }
}
