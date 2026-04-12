export function calculateScore(timeMs: number, databrusCount: number): number {
  const timeScore = Math.floor(127_500_000 / timeMs);
  const databrusBonus = databrusCount * 500;
  return timeScore + databrusBonus;
}

export function calculateTimeScore(timeMs: number): number {
  return Math.floor(127_500_000 / timeMs);
}

export function calculateDatabrusBonus(databrusCount: number): number {
  return databrusCount * 500;
}
