"use client";

import type { CharacterId } from "@/game/types";

interface Props {
  id: CharacterId;
  size?: number;
  className?: string;
}

/** Pixel-style portrait matching in-game boulder faces (no emoji). */
export function CharacterFace({ id, size = 48, className }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    shapeRendering: "crispEdges" as const,
    className,
    "aria-hidden": true,
  };

  if (id === "abakule") {
    return (
      <svg {...common}>
        <rect x="0" y="0" width="24" height="24" fill="#1a0a0c" />
        {/* Face */}
        <rect x="6" y="7" width="12" height="11" fill="#e63946" />
        <rect x="5" y="9" width="2" height="7" fill="#e63946" />
        <rect x="17" y="9" width="2" height="7" fill="#e63946" />
        <rect x="7" y="6" width="10" height="2" fill="#c62d38" />
        {/* Eyes */}
        <rect x="8" y="10" width="3" height="3" fill="#fff" />
        <rect x="13" y="10" width="3" height="3" fill="#fff" />
        <rect x="9" y="11" width="1" height="1" fill="#222" />
        <rect x="14" y="11" width="1" height="1" fill="#222" />
        {/* Glasses (pixel frames) */}
        <rect x="7" y="9" width="5" height="1" fill="#222" />
        <rect x="7" y="13" width="5" height="1" fill="#222" />
        <rect x="7" y="9" width="1" height="5" fill="#222" />
        <rect x="11" y="9" width="1" height="5" fill="#222" />
        <rect x="12" y="9" width="5" height="1" fill="#222" />
        <rect x="12" y="13" width="5" height="1" fill="#222" />
        <rect x="12" y="9" width="1" height="5" fill="#222" />
        <rect x="16" y="9" width="1" height="5" fill="#222" />
        <rect x="11" y="11" width="1" height="1" fill="#222" />
        {/* Mouth */}
        <rect x="10" y="15" width="4" height="1" fill="#fff" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="0" y="0" width="24" height="24" fill="#0a1520" />
      <rect x="6" y="7" width="12" height="11" fill="#1d8cf8" />
      <rect x="5" y="9" width="2" height="7" fill="#1d8cf8" />
      <rect x="17" y="9" width="2" height="7" fill="#1d8cf8" />
      <rect x="7" y="6" width="10" height="2" fill="#156bb8" />
      <rect x="8" y="10" width="3" height="3" fill="#fff" />
      <rect x="13" y="10" width="3" height="3" fill="#fff" />
      <rect x="9" y="11" width="1" height="1" fill="#222" />
      <rect x="14" y="11" width="1" height="1" fill="#222" />
      {/* Brows */}
      <rect x="7" y="8" width="5" height="1" fill="#0d4a7a" />
      <rect x="12" y="8" width="5" height="1" fill="#0d4a7a" />
      <rect x="10" y="15" width="4" height="1" fill="#fff" />
    </svg>
  );
}
