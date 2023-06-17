import OBR from "@owlbear-rodeo/sdk";
import { createContext, useEffect, useState } from "react";
import type { Player as PlayerType } from "@common/types/Player.type";
import type { ReactNode } from "react";

interface PlayerProviderProps {
  children: ReactNode;
  initialData: PlayerType;
}

interface PlayerContextValue {
  player: PlayerType;
}

export const PlayerContext = createContext<PlayerContextValue>(
  {} as PlayerContextValue
);

export function PlayerProvider({ children, initialData }: PlayerProviderProps) {
  const [player, setPlayer] = useState<PlayerType>(initialData);

  useEffect(() => {
    OBR.player.onChange(({ id, name, role, connectionId }) => {
      setPlayer({
        id,
        connectionId,
        name,
        role,
      });
    });
  }, []);

  return (
    <PlayerContext.Provider value={{ player }}>
      {children}
    </PlayerContext.Provider>
  );
}
