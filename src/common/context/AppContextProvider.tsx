import { CharacterProvider } from "./character/CharacterProvider";
import { ConfigProvider } from "./config/ConfigProvider";
import { PlayerProvider } from "./player/PlayerProvider";
import type { Character as CharacterType } from "@common/types/Character.type";
import type { Config as ConfigType } from "@common/types/Config.type";
import type { Player as PlayerType } from "@common/types/Player.type";
import type { ReactNode } from "react";

interface AppContextProviderProps {
  children: ReactNode;
  initialData: {
    config: Partial<ConfigType>;
    player: PlayerType;
    characters: CharacterType[];
  };
}

export function AppContextProvider({
  children,
  initialData,
}: AppContextProviderProps) {
  return (
    <ConfigProvider initialData={initialData.config}>
      <PlayerProvider initialData={initialData.player}>
        <CharacterProvider initialData={initialData.characters}>
          {children}
        </CharacterProvider>
      </PlayerProvider>
    </ConfigProvider>
  );
}
