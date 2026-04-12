"use client";
import { useCallback, useRef } from "react";
import { useGameState } from "@/hooks/useGameState";
import { GameMode, PlayerSetup, GameResult, RoundResult } from "@/game/types";
import ModeSelect from "@/components/screens/ModeSelect";
import CharacterSelect from "@/components/screens/CharacterSelect";
import NameEntry from "@/components/screens/NameEntry";
import ScoreScreen from "@/components/screens/ScoreScreen";
import RoundScore from "@/components/screens/RoundScore";
import MatchResult from "@/components/screens/MatchResult";
import LeaderboardScreen from "@/components/screens/LeaderboardScreen";
import GameCanvas from "@/components/game/GameCanvas";

export default function PlayPage() {
  const {
    screen,
    selectMode,
    selectCharacters,
    startGame,
    finishSinglePlayer,
    finishVersusRound,
    setScreen,
  } = useGameState({ type: "mode_select" });

  const goToMainMenu = useCallback(() => {
    window.location.href = "/";
  }, []);

  // Track versus state across rounds
  const versusStateRef = useRef<{
    config: null | { mode: GameMode; players: PlayerSetup[] };
    allRoundResults: RoundResult[];
    totals: number[];
  }>({
    config: null,
    allRoundResults: [],
    totals: [0, 0],
  });

  const handleModeSelect = useCallback(
    (mode: GameMode) => {
      selectMode(mode);
    },
    [selectMode]
  );

  const handleCharacterSelect = useCallback(
    (characters: string[]) => {
      if (screen.type !== "character_select") return;
      selectCharacters(
        screen.mode,
        characters as ("abakule" | "tihldev")[]
      );
    },
    [screen, selectCharacters]
  );

  const handleNameEntry = useCallback(
    (players: PlayerSetup[]) => {
      if (screen.type !== "name_entry") return;
      if (screen.mode === "versus") {
        versusStateRef.current = {
          config: { mode: "versus", players },
          allRoundResults: [],
          totals: [0, 0],
        };
      }
      startGame(screen.mode, players);
    },
    [screen, startGame]
  );

  const handleGameFinish = useCallback(
    (results: GameResult[]) => {
      if (screen.type !== "playing") return;
      if (screen.config.mode === "single") {
        finishSinglePlayer(results);
      } else {
        const vs = versusStateRef.current;
        finishVersusRound(
          screen.config,
          results,
          vs.allRoundResults,
          vs.totals
        );
      }
    },
    [screen, finishSinglePlayer, finishVersusRound]
  );

  const handleNextRound = useCallback(() => {
    if (screen.type !== "round_score") return;
    // Update ref state
    versusStateRef.current.allRoundResults = screen.allRoundResults;
    versusStateRef.current.totals = screen.totals;
    // Start next round with same config
    setScreen({ type: "playing", config: screen.config });
  }, [screen, setScreen]);

  const handlePlayAgain = useCallback(() => {
    setScreen({ type: "mode_select" });
  }, [setScreen]);

  const handleScoreSubmitted = useCallback(() => {
    // Show leaderboard after submission
    setScreen({ type: "leaderboard" });
  }, [setScreen]);

  // Render current screen
  switch (screen.type) {
    case "main_menu":
    case "mode_select":
      return <ModeSelect onSelect={handleModeSelect} onBack={goToMainMenu} />;

    case "character_select":
      return (
        <CharacterSelect
          mode={screen.mode}
          onSelect={handleCharacterSelect}
          onBack={() => setScreen({ type: "mode_select" })}
        />
      );

    case "name_entry":
      return (
        <NameEntry
          mode={screen.mode}
          players={screen.players}
          onStart={handleNameEntry}
          onBack={() => setScreen({ type: "character_select", mode: screen.mode })}
        />
      );

    case "playing":
      return (
        <div className="relative z-[1] flex items-center justify-center min-h-screen py-6">
          <GameCanvas config={screen.config} onFinish={handleGameFinish} />
        </div>
      );

    case "score_screen":
      return (
        <ScoreScreen
          results={screen.results}
          mode={screen.mode}
          onSubmitScores={handleScoreSubmitted}
          onPlayAgain={handlePlayAgain}
          onMainMenu={goToMainMenu}
        />
      );

    case "round_score":
      return (
        <RoundScore
          config={screen.config}
          allRoundResults={screen.allRoundResults}
          round={screen.round}
          totals={screen.totals}
          onNextRound={handleNextRound}
        />
      );

    case "match_result":
      return (
        <MatchResult
          config={screen.config}
          allRoundResults={screen.allRoundResults}
          totals={screen.totals}
          onSubmitScores={handleScoreSubmitted}
          onPlayAgain={handlePlayAgain}
          onMainMenu={goToMainMenu}
        />
      );

    case "leaderboard":
      return (
        <LeaderboardScreen
          onBack={goToMainMenu}
        />
      );

    default:
      return <ModeSelect onSelect={handleModeSelect} onBack={goToMainMenu} />;
  }
}
