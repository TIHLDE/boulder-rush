"use client";

interface Props {
  onPlay: () => void;
  onLeaderboard: () => void;
}

export default function MainMenu({ onPlay, onLeaderboard }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-7xl font-black tracking-tight">
          <span className="text-red-game">BOULDER</span>{" "}
          <span className="text-blue-game">RUSH</span>
        </h1>
        <p className="text-white/50 mt-2 text-lg">Push. Dodge. Collect. Win.</p>
      </div>

      {/* Boulder animation */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-700 shadow-2xl animate-bounce" />

      {/* Buttons */}
      <div className="flex flex-col gap-4 w-64">
        <button
          onClick={onPlay}
          className="px-8 py-4 bg-gradient-to-r from-red-game to-blue-game text-white font-bold text-xl rounded-xl hover:scale-105 transition-transform shadow-lg"
        >
          PLAY
        </button>
        <button
          onClick={onLeaderboard}
          className="px-8 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
        >
          Leaderboard
        </button>
      </div>

      <p className="text-white/30 text-sm">Til ENT3R Inspirasjonskveld</p>
    </div>
  );
}
