import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
      light: "#c3fdff",
      dark: "#5d99c6",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#0f1218",
      paper: "#1a1f2a",
    },
    text: {
      primary: "#e2e8f0",
      secondary: "#94a3b8",
      disabled: "#64748b",
    },
    divider: "rgba(255, 255, 255, 0.08)",
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a1f2a",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a1f2a",
          borderRadius: 16,
        },
      },
    },
  },
});
