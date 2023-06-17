import { useContext } from "react";
import { CharacterContext } from "./CharacterProvider";

export function useCharacter() {
  return useContext(CharacterContext);
}
