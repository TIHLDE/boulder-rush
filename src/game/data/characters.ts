import { CharacterId } from "../types";

export interface CharacterDef {
  id: CharacterId;
  name: string;
  tagline: string;
  color: string;
  colorLight: string;
}

export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  abakule: {
    id: "abakule",
    name: "Abakule",
    tagline: "Hacker nerd with glasses",
    color: "#e63946",
    colorLight: "#ff6b6b",
  },
  tihldev: {
    id: "tihldev",
    name: "TIHLDEV",
    tagline: "Sharp IT-consultant",
    color: "#1d8cf8",
    colorLight: "#4da8ff",
  },
};
