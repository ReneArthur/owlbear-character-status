import { useContext } from "react";
import { PlayerContext } from "./PlayerProvider";

export function usePlayer() {
  return useContext(PlayerContext);
}
