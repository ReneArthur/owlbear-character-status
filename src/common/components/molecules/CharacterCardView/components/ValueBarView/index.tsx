import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { BarConfig } from "@common/types/BarConfig.type";
import type { Values } from "@common/types/ValueBarProps.type";

type ValueBarViewProps = { values: Values } & BarConfig;

export function ValueBarView({
  values,
  name,
  statusColor,
  backgroundColor,
}: ValueBarViewProps) {
  // const { name, backgroundColor, statusColor } = useMemo(() => {
  //   let name = "";
  //   let backgroundColor: Color = "#878787";
  //   let statusColor: Color = "#E2FF00";
  //   let damagedColor: Color = "#FF3202";
  //   if (bars) {
  //     const barConfig = bars[barIndexId];
  //     name = barConfig.name;
  //     backgroundColor = barConfig.backgroundColor;
  //     statusColor = barConfig.statusColor;
  //     damagedColor = barConfig.damagedColor;
  //   }
  //   return {
  //     name,
  //     backgroundColor,
  //     statusColor,
  //     damagedColor,
  //   };
  // }, [barIndexId, bars]);

  return (
    <>
      <Grid item xs={2}>
        <Typography variant="body2">{name}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Box display="flex" height={15} bgcolor={backgroundColor} width="100%">
          <Box
            width={`${(values.current / values.total) * 100}%`}
            bgcolor={statusColor}
          />
        </Box>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body2">
          {values.current}/{values.total}
        </Typography>
      </Grid>
    </>
  );
}
