import { isPlainObject } from "./isPlainObject";
import type { Character } from "@common/types/Character.type";
import type { Config } from "@common/types/Config.type";

export function isRoomMetadata(
  metadata: unknown
): metadata is { characters: Character[]; config: Config } {
  return (
    isPlainObject(metadata) &&
    (metadata?.characters ? Array.isArray(metadata?.characters) : true) &&
    (metadata?.config ? !!isPlainObject(metadata.config) : true)
  );
}
