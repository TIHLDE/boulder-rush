import type { DatabrusFlavor } from "../types";

export interface DatabrusDrawStyle {
  /** For rgba(..., a) glow */
  glowRgb: string;
  bodyTop: string;
  bodyBottom: string;
  rim: string;
  claw: string;
  particle: string;
}

export function getDatabrusDrawStyle(flavor: DatabrusFlavor): DatabrusDrawStyle {
  switch (flavor) {
    case "white":
      return {
        glowRgb: "210, 220, 245",
        bodyTop: "#f4f4f8",
        bodyBottom: "#c5c5d2",
        rim: "#12121a",
        claw: "#16a34a",
        particle: "#86efac",
      };
    case "purple":
      return {
        glowRgb: "167, 139, 250",
        bodyTop: "#7c3aed",
        bodyBottom: "#4c1d95",
        rim: "#0c0c10",
        claw: "#bef264",
        particle: "#c084fc",
      };
    case "green":
      return {
        glowRgb: "52, 211, 153",
        bodyTop: "#166534",
        bodyBottom: "#052e16",
        rim: "#0a0a0c",
        claw: "#4ade80",
        particle: "#4ade80",
      };
  }
}
