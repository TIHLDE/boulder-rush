import { Player, CANVAS_HEIGHT } from "../types";

export class Camera {
  x: number = 0;
  y: number = 0;

  update(player: Player, viewportHeight: number = CANVAS_HEIGHT): void {
    const targetY = player.y - viewportHeight * 0.75;
    this.y += (targetY - this.y) * 0.1;
  }
}
