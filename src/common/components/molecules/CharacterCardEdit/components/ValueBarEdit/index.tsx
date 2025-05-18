import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useRef, useState } from "react";
import { useImmerReducer } from "use-immer";
import { v4 as uuidv4 } from "uuid";
import type { BarConfig } from "@common/types/BarConfig.type";
import type { Values } from "@common/types/ValueBarProps.type";
import { useCharacter } from "@common/context/character/useCharacter";
import { useDebounce } from "@common/hooks/useDebounce";

type ValueBarEditProps = {
  values: Values;
  characterId: string;
  barIndexId: number;
} & BarConfig;

interface ValueBarState {
  values: Values;
  isEditBarOpen: boolean;
}

enum ValueBarActionType {
  CHANGE_CURRENT = "CHANGE_CURRENT",
  CHANGE_TOTAL = "CHANGE_TOTAL",
  TOGGLE_EDIT_BAR = "TOGGLE_EDIT_BAR",
  UPDATE_VALUES = "UPDATE_VALUES",
}

const changeCurrent = (num: number) => ({
  type: ValueBarActionType.CHANGE_CURRENT as const,
  payload: num,
});
const changeTotal = (num: number) => ({
  type: ValueBarActionType.CHANGE_TOTAL as const,
  payload: num,
});
const toggleBarEdit = (isOpen: boolean) => ({
  type: ValueBarActionType.TOGGLE_EDIT_BAR as const,
  payload: isOpen,
});
const updateValues = (values: Values) => ({
  type: ValueBarActionType.UPDATE_VALUES as const,
  payload: values,
});

type ValueBarAction =
  | ReturnType<typeof changeCurrent>
  | ReturnType<typeof changeTotal>
  | ReturnType<typeof toggleBarEdit>
  | ReturnType<typeof updateValues>;

const barId = uuidv4();
export function ValueBarEdit({
  characterId,
  name,
  backgroundColor,
  statusColor,
  barIndexId,
  // damagedColor,
  values,
}: ValueBarEditProps) {
  const { editBarValue } = useCharacter();
  const barEl = useRef();

  const [currentInput, setCurrentInput] = useState(String(values.current));
  const [totalInput, setTotalInput] = useState(String(values.total));

  const updateValuesDebounced = useDebounce(() => {
    dispatch(
      updateValues({ current: Number(currentInput), total: Number(totalInput) })
    );
  }, 500);

  const reducer = useCallback(
    (state: ValueBarState, action: ValueBarAction) => {
      switch (action.type) {
        case ValueBarActionType.CHANGE_CURRENT: {
          if (isNaN(action.payload)) return;
          if (action.payload < 0) return;

          editBarValue(characterId, barIndexId, { current: action.payload });

          state.values.current = action.payload;
          return;
        }
        case ValueBarActionType.CHANGE_TOTAL: {
          if (isNaN(action.payload)) return;
          if (action.payload < 0) return;

          editBarValue(characterId, barIndexId, { total: action.payload });

          state.values.total = action.payload;
          return;
        }
        case ValueBarActionType.TOGGLE_EDIT_BAR: {
          state.isEditBarOpen = action.payload;
          return;
        }
        case ValueBarActionType.UPDATE_VALUES: {
          if (action.payload.current < 0) {
            action.payload.current = 0;
          }
          state.values = action.payload;

          editBarValue(characterId, barIndexId, state.values);
        }
      }
    },
    [barIndexId, characterId, editBarValue]
  );

  const [state, dispatch] = useImmerReducer(reducer, {
    values,
    isEditBarOpen: false,
  });

  useEffect(() => {
    dispatch(updateValues(values));
  }, [dispatch, values]);

  useEffect(() => {
    updateValuesDebounced();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInput, totalInput]);

  useEffect(() => {
    setCurrentInput(String(state.values.current));
    setTotalInput(String(state.values.total));
  }, [state.values]);

  return (
    <>
      <Grid item xs={2}>
        <Typography variant="body2">{name}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Box
          onClick={() => dispatch(toggleBarEdit(true))}
          ref={barEl}
          aria-describedby={barId}
          display="flex"
          height={15}
          bgcolor={backgroundColor}
          width="100%"
        >
          <Box
            width={`${(state.values.current / state.values.total) * 100}%`}
            bgcolor={statusColor}
          />
        </Box>
        <Popover
          id={barId}
          open={state.isEditBarOpen}
          onClose={() => {
            const currentInputNum = Number(currentInput);
            if (currentInputNum !== state.values.current) {
              dispatch(changeCurrent(currentInputNum));
            }
            const totalInputNum = Number(totalInput);
            if (totalInputNum !== state.values.total) {
              dispatch(changeCurrent(totalInputNum));
            }
            dispatch(toggleBarEdit(false));
          }}
          anchorEl={barEl.current}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Stack p={1} bgcolor="background.paper" spacing={2}>
            <Stack direction="row" spacing={0.5}>
              <IconButton
                onClick={() =>
                  dispatch(changeCurrent(state.values.current - 5))
                }
                size="small"
                sx={{
                  color: "white",
                  backgroundColor: "red",
                  ":hover": {
                    backgroundColor: "#FF1E1E",
                  },
                }}
              >
                <Box height={20} width={20}>
                  -5
                </Box>
              </IconButton>
              <IconButton
                onClick={() =>
                  dispatch(changeCurrent(state.values.current - 1))
                }
                size="small"
                sx={{
                  color: "white",
                  backgroundColor: "red",
                  ":hover": {
                    backgroundColor: "#FF1E1E",
                  },
                }}
              >
                <Box height={20} width={20}>
                  -1
                </Box>
              </IconButton>
              <IconButton
                onClick={() =>
                  dispatch(changeCurrent(state.values.current + 1))
                }
                size="small"
                sx={{
                  color: "white",
                  backgroundColor: "green",
                  ":hover": {
                    backgroundColor: "#1E801E",
                  },
                }}
              >
                <Box height={20} width={20}>
                  +1
                </Box>
              </IconButton>
              <IconButton
                onClick={() =>
                  dispatch(changeCurrent(state.values.current + 5))
                }
                size="small"
                sx={{
                  color: "white",
                  backgroundColor: "green",
                  ":hover": {
                    backgroundColor: "#1E801E",
                  },
                }}
              >
                <Box height={20} width={20}>
                  +5
                </Box>
              </IconButton>
            </Stack>
            <Grid container gap={1}>
              <Grid item xs={5}>
                <TextField
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  type="number"
                  label="Atual"
                  size="small"
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  sx={{ width: 70 }}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  value={totalInput}
                  onChange={(e) => setTotalInput(e.target.value)}
                  type="number"
                  label="Total"
                  size="small"
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  sx={{ width: 70 }}
                />
              </Grid>
            </Grid>
          </Stack>
        </Popover>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body2">
          {state.values.current}/{state.values.total}
        </Typography>
      </Grid>
    </>
  );
}
