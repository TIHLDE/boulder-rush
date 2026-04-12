import { Player, Obstacle, Databrus, Particle, LANE_WIDTH, FINISH_Y } from "../types";
import { Camera } from "../engine/Camera";
import { CHARACTERS } from "../data/characters";

const BG_COLOR = "#0a0a1a";
const GRID_COLOR = "rgba(255,255,255,0.03)";
const OBSTACLE_COLOR = "#2a2a4a";
const OBSTACLE_BORDER = "#4a4a6a";
const FINISH_COLOR_1 = "#ffffff";
const FINISH_COLOR_2 = "#222222";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  render(
    cameras: Camera[],
    players: Player[],
    obstacles: Obstacle[],
    databrusPerLane: Databrus[][],
    particles: Particle[],
    laneOffsets: number[],
    laneWidths: number[],
    time: number
  ): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    for (let i = 0; i < players.length; i++) {
      const camera = cameras[i];
      const offsetX = laneOffsets[i];
      const laneW = laneWidths[i];

      ctx.save();
      // Clip to lane area
      ctx.beginPath();
      ctx.rect(offsetX, 0, laneW, this.canvasHeight);
      ctx.clip();

      // Translate for camera
      const lanePadding = (laneW - LANE_WIDTH) / 2;
      ctx.translate(offsetX + lanePadding, -camera.y);

      // Draw grid
      this.drawGrid(camera.y);

      // Draw obstacles
      this.drawObstacles(obstacles, camera.y);

      // Draw finish line
      this.drawFinishLine();

      // Draw databrus for this lane
      this.drawDatabrus(databrusPerLane[i], time, camera.y);

      // Draw player
      this.drawPlayer(players[i]);

      // Draw particles
      this.drawParticles(particles, camera.y);

      ctx.restore();

      // Draw lane border
      if (players.length > 1) {
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(offsetX + laneW, 0);
        ctx.lineTo(offsetX + laneW, this.canvasHeight);
        ctx.stroke();
      }
    }
  }

  private drawGrid(cameraY: number): void {
    const ctx = this.ctx;
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;
    const gridSize = 80;
    const startY = Math.floor(cameraY / gridSize) * gridSize;
    for (let y = startY; y < cameraY + this.canvasHeight + gridSize; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(LANE_WIDTH, y);
      ctx.stroke();
    }
  }

  private drawObstacles(obstacles: Obstacle[], cameraY: number): void {
    const ctx = this.ctx;
    for (const obs of obstacles) {
      if (obs.y + obs.height < cameraY - 50 || obs.y > cameraY + this.canvasHeight + 50)
        continue;

      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(obs.x + 3, obs.y + 3, obs.width, obs.height);

      // Main body
      ctx.fillStyle = OBSTACLE_COLOR;
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

      // Border
      ctx.strokeStyle = OBSTACLE_BORDER;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

      // Top highlight
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(obs.x, obs.y, obs.width, 2);
    }
  }

  private drawFinishLine(): void {
    const ctx = this.ctx;
    const squareSize = 20;
    const rows = 2;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < LANE_WIDTH / squareSize; col++) {
        ctx.fillStyle = (row + col) % 2 === 0 ? FINISH_COLOR_1 : FINISH_COLOR_2;
        ctx.fillRect(col * squareSize, FINISH_Y + row * squareSize, squareSize, squareSize);
      }
    }
    // Glow effect
    const gradient = ctx.createLinearGradient(0, FINISH_Y - 30, 0, FINISH_Y);
    gradient.addColorStop(0, "rgba(241, 196, 15, 0)");
    gradient.addColorStop(1, "rgba(241, 196, 15, 0.15)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, FINISH_Y - 30, LANE_WIDTH, 30);
  }

  private drawDatabrus(databrus: Databrus[], time: number, cameraY: number): void {
    const ctx = this.ctx;
    for (const db of databrus) {
      if (db.collected) continue;
      if (db.y < cameraY - 50 || db.y > cameraY + this.canvasHeight + 50) continue;

      const glow = 0.4 + Math.sin(time * 3 + db.glowPhase) * 0.3;

      // Outer glow
      const gradient = ctx.createRadialGradient(db.x, db.y, 0, db.x, db.y, db.radius * 2.5);
      gradient.addColorStop(0, `rgba(46, 204, 113, ${glow * 0.4})`);
      gradient.addColorStop(1, "rgba(46, 204, 113, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(db.x, db.y, db.radius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Can body
      ctx.fillStyle = "#2ecc71";
      ctx.beginPath();
      ctx.roundRect(db.x - 8, db.y - 12, 16, 24, 3);
      ctx.fill();

      // Can highlight
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(db.x - 5, db.y - 10, 3, 18);

      // "D" label
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("D", db.x, db.y);

      // Sparkle dots
      for (let i = 0; i < 3; i++) {
        const angle = time * 2 + db.glowPhase + (i * Math.PI * 2) / 3;
        const dist = db.radius * 1.5 + Math.sin(time * 4 + i) * 3;
        const sx = db.x + Math.cos(angle) * dist;
        const sy = db.y + Math.sin(angle) * dist;
        const sparkleAlpha = 0.5 + Math.sin(time * 5 + i * 2) * 0.5;
        ctx.fillStyle = `rgba(241, 196, 15, ${sparkleAlpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  drawPlayer(player: Player): void {
    const ctx = this.ctx;
    const charDef = CHARACTERS[player.character];

    // Boulder shadow
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(player.x + 3, player.y + 5, player.width / 2, player.width / 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Boulder body
    const boulderGrad = ctx.createRadialGradient(
      player.x - 5, player.y - 5, 2,
      player.x, player.y, player.width / 2
    );
    boulderGrad.addColorStop(0, "#888");
    boulderGrad.addColorStop(0.5, "#666");
    boulderGrad.addColorStop(1, "#444");
    ctx.fillStyle = boulderGrad;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.width / 2, 0, Math.PI * 2);
    ctx.fill();

    // Character color ring
    ctx.strokeStyle = charDef.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.width / 2 + 2, 0, Math.PI * 2);
    ctx.stroke();

    // Character face on top of boulder
    // Face circle
    ctx.fillStyle = charDef.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y - 2, 10, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(player.x - 4, player.y - 4, 3, 0, Math.PI * 2);
    ctx.arc(player.x + 4, player.y - 4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(player.x - 4, player.y - 4, 1.5, 0, Math.PI * 2);
    ctx.arc(player.x + 4, player.y - 4, 1.5, 0, Math.PI * 2);
    ctx.fill();

    if (player.character === "abakule") {
      // Glasses
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(player.x - 8, player.y - 7, 7, 5);
      ctx.strokeRect(player.x + 1, player.y - 7, 7, 5);
      ctx.beginPath();
      ctx.moveTo(player.x - 1, player.y - 5);
      ctx.lineTo(player.x + 1, player.y - 5);
      ctx.stroke();
    } else {
      // TIHLDEV: sleek eyebrows
      ctx.strokeStyle = charDef.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(player.x - 7, player.y - 8);
      ctx.lineTo(player.x - 2, player.y - 7);
      ctx.moveTo(player.x + 2, player.y - 7);
      ctx.lineTo(player.x + 7, player.y - 8);
      ctx.stroke();
    }

    // Mouth
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(player.x, player.y + 1, 3, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // Name tag
    ctx.fillStyle = charDef.color;
    ctx.font = "bold 10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(player.name, player.x, player.y - player.height / 2 - 8);
  }

  private drawParticles(particles: Particle[], cameraY: number): void {
    const ctx = this.ctx;
    for (const p of particles) {
      if (p.y < cameraY - 50 || p.y > cameraY + this.canvasHeight + 50) continue;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}
