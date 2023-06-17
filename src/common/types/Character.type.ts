import type { Values } from "./ValueBarProps.type";

export interface Character {
  id: string;
  playerId: string;
  name: string;
  avatarImage: string;
  barValues: Values[];
}

export type SaveCharacter = Omit<Character, "id" | "playerId">;
