import { createTheme, alpha } from '@mui/material/styles'
import { tokens } from './tokens'

const baseTheme = {
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    h1: { fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
}

export const darkMuiTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: tokens.colors.primary,
      light: tokens.colors.primaryLight,
      dark: tokens.colors.primaryDark,
    },
    secondary: {
      main: tokens.colors.accent,
      light: tokens.colors.accentLight,
    },
    background: {
      default: tokens.colors.bgPrimary,
      paper: tokens.colors.bgCard,
    },
    text: {
      primary: tokens.colors.textPrimary,
      secondary: tokens.colors.textSecondary,
    },
    success: { main: tokens.colors.success },
    warning: { main: tokens.colors.warning },
    error: { main: tokens.colors.error },
    divider: tokens.colors.border,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
        containedPrimary: {
          background: tokens.gradients.primary,
          '&:hover': {
            boxShadow: tokens.shadows.glowStrong,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: tokens.colors.bgCard,
          border: `1px solid ${tokens.colors.border}`,
          '&:hover': {
            borderColor: tokens.colors.primary,
            boxShadow: tokens.shadows.glow,
          },
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: tokens.colors.primary,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: tokens.colors.primary,
            },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: tokens.colors.bgCard,
          border: `1px solid ${tokens.colors.border}`,
          color: tokens.colors.textPrimary,
          borderRadius: 8,
          fontSize: '0.8rem',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: alpha(tokens.colors.primary, 0.15),
        },
        bar: {
          background: tokens.gradients.primary,
          borderRadius: 4,
        },
      },
    },
  },
})

export const lightMuiTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#0096B7',
      light: tokens.colors.primary,
      dark: '#007494',
    },
    secondary: {
      main: tokens.colors.accent,
      light: tokens.colors.accentLight,
    },
    background: {
      default: tokens.colors.lightBg,
      paper: tokens.colors.lightBgCard,
    },
    text: {
      primary: tokens.colors.lightTextPrimary,
      secondary: tokens.colors.lightTextSecondary,
    },
    success: { main: tokens.colors.success },
    warning: { main: tokens.colors.warning },
    error: { main: tokens.colors.error },
    divider: 'rgba(0, 150, 183, 0.12)',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,150,183,0.12)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0,150,183,0.2)',
            borderColor: 'rgba(0,150,183,0.4)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#0096B7',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#0096B7',
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: alpha('#0096B7', 0.12),
        },
        bar: {
          background: 'linear-gradient(90deg, #0096B7, #7C3AED)',
          borderRadius: 4,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
})
