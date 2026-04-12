import { CharacterId } from "../types";

export interface CharacterDef {
  id: CharacterId;
  name: string;
  tagline: string;
  color: string;
  colorLight: string;
  emoji: string;
}

export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  abakule: {
    id: "abakule",
    name: "Abakule",
    tagline: "Hacker nerd with glasses",
    color: "#e63946",
    colorLight: "#ff6b6b",
    emoji: "\u{1F534}",
  },
  tihldev: {
    id: "tihldev",
    name: "TIHLDEV",
    tagline: "Sharp IT-consultant",
    color: "#1d8cf8",
    colorLight: "#4da8ff",
    emoji: "\u{1F535}",
  },
};
