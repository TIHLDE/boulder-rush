import { Particle } from "../types";

export class ParticleSystem {
  spawn(
    particles: Particle[],
    x: number,
    y: number,
    color: string,
    count: number = 20
  ): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 80 + Math.random() * 160;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 0.6 + Math.random() * 0.4,
        color,
        size: 3 + Math.random() * 4,
      });
    }
  }

  update(particles: Particle[], dt: number): void {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 200 * dt; // gravity
      p.life -= dt / p.maxLife;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }
}
