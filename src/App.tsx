import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { version } from "../package.json";
import { CharacterCardEdit } from "@common/components/molecules/CharacterCardEdit";
import { CharacterCardView } from "@common/components/molecules/CharacterCardView";
import { CharacterSheet } from "@common/components/sheets/CharacterSheet";
import { Modal } from "@common/components/ui/Modal";
import { useCharacter } from "@common/context/character/useCharacter";
import { usePlayer } from "@common/context/player/usePlayer";

function App() {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [isCharacterSheetOpen, setIsCharacterSheetOpen] =
    useState<boolean>(false);
  const { characters } = useCharacter();
  const { player } = usePlayer();

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" gap={1}>
            {player.role === "GM" && (
              <IconButton onClick={() => setIsConfigModalOpen(true)}>
                <SettingsIcon />
              </IconButton>
            )}
            <IconButton onClick={() => setIsCharacterSheetOpen(true)}>
              <AddIcon />
            </IconButton>
          </Stack>
          <Stack direction="row">
            <Typography>{version}</Typography>
          </Stack>
          {/* <IconButton
            onClick={() =>
              OBR.room.setMetadata({ [OBRMetadataId]: { characters: [] } })
            }
          >
            D
          </IconButton> */}
        </Toolbar>
      </AppBar>
      {characters.map((character) => (
        <Box key={character.id}>
          {player.role === "GM" ||
          (player.role === "PLAYER" && character.playerId === player.id) ? (
            <CharacterCardEdit {...character} />
          ) : (
            <CharacterCardView {...character} />
          )}
        </Box>
      ))}
      <Modal
        open={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        title="CONFIGURAÇÕES EM ANDAMENTO"
      >
        {/* <Stack direction="column" gap={2}>
          <TextField
            value={color1}
            onChange={(e) => setColor1(e.target.value as Color)}
          />
          <TextField
            value={color2}
            onChange={(e) => setColor2(e.target.value as Color)}
          />
          <TextField
            value={color3}
            onChange={(e) => setColor3(e.target.value as Color)}
          />
          <Button
            variant="contained"
            onClick={() => {
              changeBars([
                { statusColor: color1 },
                { statusColor: color2 },
                { statusColor: color3 },
              ]);
            }}
          >
            Salvar cores
          </Button>
        </Stack> */}
      </Modal>
      <CharacterSheet
        open={isCharacterSheetOpen}
        onClose={() => setIsCharacterSheetOpen(false)}
      />
    </Box>
  );
}

export default App;
