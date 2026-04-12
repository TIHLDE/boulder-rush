"use client";
import { useState, useCallback } from "react";
import {
  GameMode,
  GameConfig,
  GameResult,
  PlayerSetup,
  RoundResult,
  CharacterId,
} from "@/game/types";

export type Screen =
  | { type: "main_menu" }
  | { type: "mode_select" }
  | { type: "character_select"; mode: GameMode }
  | { type: "name_entry"; mode: GameMode; players: PlayerSetup[] }
  | { type: "playing"; config: GameConfig }
  | { type: "score_screen"; results: GameResult[]; mode: GameMode }
  | {
      type: "round_score";
      config: GameConfig;
      allRoundResults: RoundResult[];
      round: number;
      wins: number[];
    }
  | { type: "match_result"; config: GameConfig; allRoundResults: RoundResult[]; wins: number[] }
  | { type: "leaderboard" };

export function useGameState(initialScreen: Screen = { type: "main_menu" }) {
  const [screen, setScreen] = useState<Screen>(initialScreen);

  const goToMainMenu = useCallback(() => setScreen({ type: "main_menu" }), []);
  const goToModeSelect = useCallback(() => setScreen({ type: "mode_select" }), []);
  const goToLeaderboard = useCallback(() => setScreen({ type: "leaderboard" }), []);

  const selectMode = useCallback((mode: GameMode) => {
    setScreen({ type: "character_select", mode });
  }, []);

  const selectCharacters = useCallback(
    (mode: GameMode, characters: CharacterId[]) => {
      const players: PlayerSetup[] = characters.map((c) => ({
        name: "",
        character: c,
        scoreId: "",
      }));
      setScreen({ type: "name_entry", mode, players });
    },
    []
  );

  const startGame = useCallback((mode: GameMode, players: PlayerSetup[]) => {
    setScreen({ type: "playing", config: { mode, players } });
  }, []);

  const finishSinglePlayer = useCallback(
    (results: GameResult[]) => {
      setScreen({ type: "score_screen", results, mode: "single" });
    },
    []
  );

  const finishVersusRound = useCallback(
    (
      config: GameConfig,
      roundResults: GameResult[],
      prevRounds: RoundResult[],
      prevWins: number[]
    ) => {
      const round = prevRounds.length + 1;
      const allRounds = [...prevRounds, { round, results: roundResults }];

      // Determine round winner (lowest time wins the round)
      const wins = [...prevWins];
      if (roundResults.length === 2) {
        if (roundResults[0].timeMs < roundResults[1].timeMs) {
          wins[0]++;
        } else {
          wins[1]++;
        }
      }

      // Check if match is over (best of 3)
      if (wins[0] >= 2 || wins[1] >= 2 || allRounds.length >= 3) {
        setScreen({ type: "match_result", config, allRoundResults: allRounds, wins });
      } else {
        setScreen({ type: "round_score", config, allRoundResults: allRounds, round, wins });
      }
    },
    []
  );

  return {
    screen,
    goToMainMenu,
    goToModeSelect,
    goToLeaderboard,
    selectMode,
    selectCharacters,
    startGame,
    finishSinglePlayer,
    finishVersusRound,
    setScreen,
  };
}
