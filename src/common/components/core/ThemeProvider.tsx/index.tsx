import MuiThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useMemo, useState } from "react";
import type { Theme as OBRThemeType } from "@owlbear-rodeo/sdk";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
  initialData: OBRThemeType;
}

// {
//   "mode": "DARK",
//   "primary": {
//       "main": "#bb99ff",
//       "light": "rgb(200, 173, 255)",
//       "dark": "rgb(130, 107, 178)",
//       "contrastText": "rgba(0, 0, 0, 0.87)"
//   },
//   "secondary": {
//       "main": "#ee99ff",
//       "light": "rgb(241, 173, 255)",
//       "dark": "rgb(166, 107, 178)",
//       "contrastText": "rgba(0, 0, 0, 0.87)"
//   },
//   "background": {
//       "paper": "#222639",
//       "default": "#1e2231"
//   },
//   "text": {
//       "disabled": "rgba(255, 255, 255, 0.5)",
//       "primary": "#fff",
//       "secondary": "rgba(255, 255, 255, 0.7)"
//   }
// }

export function ThemeProvider({ children, initialData }: ThemeProviderProps) {
  const [OBRTheme, setOBRTheme] = useState<OBRThemeType>(initialData);

  useEffect(() => {
    OBR.theme.onChange(setOBRTheme);
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: OBRTheme.primary,
          secondary: OBRTheme.secondary,
          background: OBRTheme.background,
          text: OBRTheme.text,
          mode: OBRTheme.mode === "DARK" ? "dark" : "light",
        },
        components: {
          MuiTypography: {
            defaultProps: {
              color: "text.primary",
            },
          },
        },
      }),
    [OBRTheme]
  );

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
