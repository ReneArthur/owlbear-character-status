import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useMemo } from "react";
import { ValueBarView } from "./components/ValueBarView";
import type { Character } from "@common/types/Character.type";
import { useConfig } from "@common/context/config/useConfig";

export function CharacterCardView({ name, avatarImage, barValues }: Character) {
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
        <Stack direction="row">
          <Stack direction="column" alignItems="center" justifyContent="center">
            <Avatar
              alt="avatar"
              src={avatarImage}
              sx={{ height: 70, width: 70 }}
            />
            <Typography variant="body1">{name}</Typography>
          </Stack>
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
              <React.Fragment key={index}>
                {bar.isPublic && <ValueBarView {...bar} />}
              </React.Fragment>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </Box>
  );
}
