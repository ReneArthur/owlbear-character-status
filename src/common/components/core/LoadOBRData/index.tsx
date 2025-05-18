import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";
import { ThemeProvider } from "../ThemeProvider.tsx";
import type { AppMetadata } from "@common/types/AppMetadata.type.ts";
import type { Character as CharacterType } from "@common/types/Character.type";
import type { Config as ConfigType } from "@common/types/Config.type";
import type { Player as PlayerType } from "@common/types/Player.type";
import type { Theme as OBRThemeType } from "@owlbear-rodeo/sdk";
import type { ReactNode } from "react";
import { OBRMetadataId } from "@common/assets/OBRMetadataId";
import { AppContextProvider } from "@common/context/AppContextProvider";

interface LoadOBRDataProps {
  children: ReactNode;
}

interface OBRData {
  theme: OBRThemeType;
  config: Partial<ConfigType>;
  characters: CharacterType[];
  player: PlayerType;
}

export function LoadOBRData({ children }: LoadOBRDataProps) {
  const [OBRData, setOBRData] = useState<OBRData>();
  const [isOBRError, setIsOBRError] = useState<boolean>();

  useEffect(() => {
    OBR.onReady(() => {
      Promise.all([
        OBR.theme.getTheme(),
        OBR.room.getMetadata(),
        OBR.player.getConnectionId(),
        OBR.player.getName(),
        OBR.player.getRole(),
      ])
        .then(
          ([
            theme,
            roomMetadata,
            playerConnectionId,
            playerName,
            playerRole,
          ]) => {
            const appMetadata = roomMetadata[
              OBRMetadataId
            ] as Partial<AppMetadata>;

            setOBRData({
              theme,
              config: appMetadata?.config ?? {},
              characters: appMetadata?.characters ?? [],
              player: {
                id: OBR.player.id,
                connectionId: playerConnectionId,
                name: playerName,
                role: playerRole,
              },
            });
          }
        )
        .catch((err) => {
          console.log(err);
          setIsOBRError(true);
        });
    });
  }, []);

  if (isOBRError) {
    return <Typography>Owlbear Rodeo Error</Typography>;
  }
  if (!OBRData) {
    return <CircularProgress />;
  }

  return (
    <ThemeProvider initialData={OBRData.theme}>
      <AppContextProvider
        initialData={{
          player: OBRData.player,
          config: OBRData.config,
          characters: OBRData.characters,
        }}
      >
        {children}
      </AppContextProvider>
    </ThemeProvider>
  );
}
