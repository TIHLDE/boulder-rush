import { Player } from "../types";

interface KeyBindings {
  up: string;
  down: string;
  left: string;
  right: string;
}

const PLAYER1_KEYS: KeyBindings = {
  up: "w",
  down: "s",
  left: "a",
  right: "d",
};

const PLAYER2_KEYS: KeyBindings = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
};

export class InputManager {
  private keys: Set<string> = new Set();
  private handleKeyDown: (e: KeyboardEvent) => void;
  private handleKeyUp: (e: KeyboardEvent) => void;

  constructor() {
    this.handleKeyDown = (e: KeyboardEvent) => {
      this.keys.add(e.key.length === 1 ? e.key.toLowerCase() : e.key);
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(
          e.key
        )
      ) {
        e.preventDefault();
      }
    };

    this.handleKeyUp = (e: KeyboardEvent) => {
      this.keys.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key);
    };

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  update(players: Player[]): void {
    for (const player of players) {
      const bindings = player.id === 0 ? PLAYER1_KEYS : PLAYER2_KEYS;
      player.inputUp = this.keys.has(bindings.up);
      player.inputDown = this.keys.has(bindings.down);
      player.inputLeft = this.keys.has(bindings.left);
      player.inputRight = this.keys.has(bindings.right);
    }
  }

  destroy(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }
}
