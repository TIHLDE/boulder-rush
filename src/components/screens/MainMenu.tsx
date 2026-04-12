"use client";

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
      <div className="text-center space-y-3">
        <h1 className="arcade-title text-2xl sm:text-3xl md:text-4xl leading-tight">
          <span className="text-red-game">BOULDER</span>
          <br />
          <span className="text-blue-game">RUSH</span>
        </h1>
        <p className="text-foreground/55 max-w-md mx-auto text-lg">
          Push. Dodge. Collect. Win.
        </p>
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

      <p className="text-foreground/35 text-base">Til ENT3R Inspirasjonskveld</p>
    </div>
  );
}
