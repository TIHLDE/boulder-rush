/** Abandoned in-progress rows older than this can be replaced on next reserve. */
export const STALE_RESERVATION_MS = 30 * 60 * 1000;

export function normalizePlayerNameKey(playerName: string): string {
  return playerName.trim().slice(0, 20).toLowerCase();
}

export function isStaleReservation(createdAt: Date): boolean {
  return Date.now() - createdAt.getTime() > STALE_RESERVATION_MS;
}
