import { createTheme } from "@mui/material/styles";
import { colors } from "./colors";
import { typography } from "./typography";

export const appTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: colors.secondary
    },
    success: {
      main: colors.success
    },
    warning: {
      main: colors.warning
    },
    error: {
      main: colors.error
    },
    background: {
      default: colors.background,
      paper: colors.surface
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary
    },
    divider: colors.border
  },
  typography,
  shape: {
    borderRadius: 12
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background,
          color: colors.textPrimary
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 600
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined"
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10
        }
      }
    }
  }
});