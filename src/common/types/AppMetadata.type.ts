import type { Character } from "./Character.type";
import type { Config } from "./Config.type";

export interface AppMetadata {
  characters: Character[];
  config: Config;
}
