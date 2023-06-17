import type { Player as OBRPlayerType } from "@owlbear-rodeo/sdk";

export type Player = Omit<
  OBRPlayerType,
  "selection" | "syncView" | "metadata" | "color"
>;
