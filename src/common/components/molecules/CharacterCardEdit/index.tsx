import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMemo, useRef, useState } from "react";
import { DeleteConfirmation } from "../DeleteConfirmation";
import { ValueBarEdit } from "./components/ValueBarEdit";
import type { Character } from "@common/types/Character.type";
import { CharacterSheet } from "@common/components/sheets/CharacterSheet";
import { useCharacter } from "@common/context/character/useCharacter";
import { useConfig } from "@common/context/config/useConfig";

export function CharacterCardEdit({
  id,
  playerId,
  name,
  avatarImage,
  barValues,
}: Character) {
  const { deleteCharacter } = useCharacter();
  const [isCharacterSheetOpen, setIsCharacterSheetOpen] = useState(false);
  const [isDeleteSheetOpen, setIsDeleteSheetOpen] = useState(false);
  const [isCharacterActionsOpen, setIsCharacterActionsOpen] = useState(false);
  const avatarEl = useRef<HTMLDivElement>();

  const { bars: barsConfig } = useConfig();
  const bars = useMemo(
    () =>
      barsConfig.map((barConfig, index) => {
        if (barValues[index]) {
          return { ...barConfig, values: barValues[index] };
        } else {
          return { ...barConfig, values: { current: 1, total: 1 } };
        }
      }),
    [barValues, barsConfig]
  );

  return (
    <Box>
      <Stack direction="row" spacing={3} m={2} alignItems="stretch">
        <Stack direction="column" alignItems="center" justifyContent="center">
          <Box id="teste" ref={avatarEl}>
            <Avatar
              alt="avatar"
              src={avatarImage}
              onClick={() => setIsCharacterActionsOpen(!isCharacterActionsOpen)}
              sx={{ height: 70, width: 70 }}
            />
          </Box>
          <Typography variant="body1">{name}</Typography>
        </Stack>
        <Stack
          pt={1}
          spacing={1}
          direction="column"
          justifyContent="start"
          sx={{ width: "100%" }}
        >
          <Grid container spacing={1} rowSpacing={1} alignItems="center">
            {bars.map((bar, index) => (
              <ValueBarEdit
                key={index}
                barIndexId={index}
                characterId={id}
                {...bar}
              />
            ))}
          </Grid>
        </Stack>
      </Stack>
      <Popover
        // id={barId}
        open={isCharacterActionsOpen}
        onClose={() => setIsCharacterActionsOpen(false)}
        anchorEl={avatarEl.current}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        sx={{ borderRadius: 2 }}
      >
        <Stack
          direction="column"
          bgcolor="background.paper"
          justifyContent="center"
          p={0.5}
        >
          <IconButton onClick={() => setIsCharacterSheetOpen(true)}>
            <EditSharpIcon sx={{ width: 17, height: 17 }} />
          </IconButton>
          <IconButton onClick={() => setIsDeleteSheetOpen(true)}>
            <DeleteSharpIcon sx={{ width: 17, height: 17 }} />
          </IconButton>
        </Stack>
      </Popover>
      <DeleteConfirmation
        open={isDeleteSheetOpen}
        onClose={() => setIsDeleteSheetOpen(false)}
        title="Excluir Personagem"
        message={`Tem certeza que quer excluir "${name}"?`}
        handleDelete={() => deleteCharacter(id)}
      />
      <CharacterSheet
        open={isCharacterSheetOpen}
        onClose={() => setIsCharacterSheetOpen(false)}
        valuesForEdition={{
          id,
          playerId,
          name,
          avatarImage,
          barValues,
        }}
      />
    </Box>
  );
}
