"use client";

import OrganizerContestRow from "@/components/branding/OrganizerContestRow";

interface Props {
  onPlay: () => void;
  onLeaderboard: () => void;
}

function PixelBoulder() {
  return (
    <svg
      width={80}
      height={80}
      viewBox="0 0 20 20"
      shapeRendering="crispEdges"
      className="animate-bounce drop-shadow-[0_4px_0_#000]"
      aria-hidden
    >
      <circle cx="10" cy="10" r="9" fill="#2a2a32" />
      <circle cx="10" cy="10" r="7" fill="#5a5a68" />
      <rect x="6" y="5" width="3" height="2" fill="#888" opacity="0.6" />
      <rect x="11" y="8" width="2" height="2" fill="#aaa" opacity="0.4" />
    </svg>
  );
}

export default function MainMenu({ onPlay, onLeaderboard }: Props) {
  return (
    <div className="relative z-[1] flex flex-col items-center justify-center min-h-screen gap-10 px-4">
      <div className="text-center space-y-4">
        <h1 className="arcade-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight px-1">
          <span className="text-blue-game">BOULDER</span>
          <br />
          <span className="text-red-game">RUSH</span>
        </h1>
        <OrganizerContestRow />
      </div>

      <PixelBoulder />

      <div className="flex flex-col gap-4 w-full max-w-[280px]">
        <button type="button" onClick={onPlay} className="arcade-btn-primary w-full uppercase">
          Play
        </button>
        <button type="button" onClick={onLeaderboard} className="arcade-btn-secondary w-full uppercase">
          Leaderboard
        </button>
      </div>
    </div>
  );
}
