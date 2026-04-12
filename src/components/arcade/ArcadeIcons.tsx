"use client";

import type { DatabrusFlavor } from "@/game/types";
import { getDatabrusDrawStyle } from "@/game/data/databrusPalette";

interface IconProps {
  size?: number;
  className?: string;
}

interface DatabrusIconProps extends IconProps {
  variant?: DatabrusFlavor;
  dimmed?: boolean;
}

const pixel = {
  shapeRendering: "crispEdges" as const,
  "aria-hidden": true as const,
};

/** Monster-inspired databrus can — matches canvas pickups; default green for aggregate UI. */
export function DatabrusIcon({
  size = 20,
  className,
  variant = "green",
  dimmed = false,
}: DatabrusIconProps) {
  const s = getDatabrusDrawStyle(variant);
  return (
    <svg
      {...pixel}
      width={size}
      height={size}
      viewBox="0 0 12 16"
      className={className}
      style={{ opacity: dimmed ? 0.3 : 1 }}
    >
      <rect x="0" y="0" width="12" height="16" fill={s.rim} />
      <rect x="1" y="2" width="10" height="2" fill={s.rim} />
      <rect x="1" y="3" width="10" height="5" fill={s.bodyTop} />
      <rect x="1" y="8" width="10" height="5" fill={s.bodyBottom} />
      <rect x="1" y="13" width="10" height="2" fill={s.rim} />
      <rect x="2" y="4" width="2" height="8" fill="#ffffff" opacity="0.18" />
      <line x1="3.5" y1="5" x2="5" y2="11" stroke={s.claw} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="5" y1="4.5" x2="6.5" y2="11.5" stroke={s.claw} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="6.5" y1="5" x2="8.2" y2="11" stroke={s.claw} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Single-player mode — pixel controller. */
export function IconSoloMode({ size = 56, className }: IconProps) {
  return (
    <svg
      {...pixel}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <rect x="0" y="0" width="24" height="24" fill="#12121a" />
      <rect x="4" y="8" width="16" height="10" fill="#3a3a55" />
      <rect x="5" y="9" width="14" height="8" fill="#2a2a40" />
      <rect x="6" y="11" width="3" height="2" fill="#e63946" />
      <rect x="15" y="11" width="3" height="2" fill="#1d8cf8" />
      <rect x="10" y="14" width="4" height="1" fill="#888" />
    </svg>
  );
}

/** Local versus — two lanes / two players. */
export function IconVersusMode({ size = 56, className }: IconProps) {
  return (
    <svg
      {...pixel}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <rect x="0" y="0" width="24" height="24" fill="#12121a" />
      <rect x="3" y="4" width="8" height="16" fill="#2a1520" />
      <rect x="13" y="4" width="8" height="16" fill="#15202a" />
      <rect x="5" y="8" width="4" height="4" fill="#e63946" />
      <rect x="15" y="8" width="4" height="4" fill="#1d8cf8" />
      <rect x="11" y="10" width="2" height="4" fill="#666" />
    </svg>
  );
}

export function TrophyIcon({ size = 64, className }: IconProps) {
  return (
    <svg
      {...pixel}
      width={size}
      height={size}
      viewBox="0 0 24 28"
      className={className}
    >
      <rect x="0" y="0" width="24" height="28" fill="#1a1408" />
      <rect x="6" y="4" width="12" height="10" fill="#f1c40f" />
      <rect x="5" y="6" width="2" height="6" fill="#d4a00a" />
      <rect x="17" y="6" width="2" height="6" fill="#d4a00a" />
      <rect x="8" y="6" width="8" height="6" fill="#f9e076" />
      <rect x="9" y="14" width="6" height="2" fill="#c9a227" />
      <rect x="7" y="16" width="10" height="3" fill="#f1c40f" />
      <rect x="4" y="19" width="16" height="2" fill="#8b6914" />
    </svg>
  );
}

export function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="font-display text-gold-databrus text-sm tracking-tight">1ST</span>
    );
  }
  if (rank === 2) {
    return (
      <span className="font-display text-[#c0c0c0] text-sm tracking-tight">2ND</span>
    );
  }
  if (rank === 3) {
    return (
      <span className="font-display text-[#cd7f32] text-sm tracking-tight">3RD</span>
    );
  }
  return <span className="font-mono text-foreground/80">{rank}</span>;
}
