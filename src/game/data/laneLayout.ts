import { Obstacle, Databrus, DATABRUS_RADIUS } from "../types";

export function createObstacles(): Obstacle[] {
  return [
    // Section 1: Warmup (y=5800→5000)
    { x: 0, y: 5400, width: 160, height: 30 },
    { x: 240, y: 5100, width: 160, height: 30 },

    // Section 2: Chicane (y=5000→4200)
    { x: 180, y: 4800, width: 220, height: 30 },
    { x: 0, y: 4550, width: 220, height: 30 },
    { x: 200, y: 4300, width: 200, height: 30 },

    // Section 3: Narrow corridor (y=4200→3400)
    // Left wall of corridor
    { x: 0, y: 4100, width: 130, height: 600 },
    // Right wall of corridor
    { x: 270, y: 4100, width: 130, height: 600 },
    // Block inside corridor
    { x: 170, y: 3700, width: 60, height: 30 },

    // Section 4: Zigzag maze (y=3400→2400)
    { x: 0, y: 3200, width: 280, height: 30 },
    { x: 120, y: 2950, width: 280, height: 30 },
    { x: 0, y: 2700, width: 300, height: 30 },
    { x: 0, y: 2500, width: 140, height: 30 },
    { x: 260, y: 2500, width: 140, height: 30 },

    // Section 5: Final sprint (y=2400→600)
    // Two pillars
    { x: 100, y: 1800, width: 40, height: 80 },
    { x: 260, y: 1800, width: 40, height: 80 },
    // Narrow gate
    { x: 0, y: 1200, width: 150, height: 30 },
    { x: 250, y: 1200, width: 150, height: 30 },
    // Last dodge
    { x: 0, y: 800, width: 180, height: 30 },
  ];
}

export function createDatabrus(): Databrus[] {
  return [
    {
      x: 80,
      y: 5100,
      radius: DATABRUS_RADIUS,
      collected: false,
      glowPhase: 0,
      collectTime: null,
    },
    {
      x: 250,
      y: 3700,
      radius: DATABRUS_RADIUS,
      collected: false,
      glowPhase: Math.PI * 0.66,
      collectTime: null,
    },
    {
      x: 200,
      y: 1800,
      radius: DATABRUS_RADIUS,
      collected: false,
      glowPhase: Math.PI * 1.33,
      collectTime: null,
    },
  ];
}
