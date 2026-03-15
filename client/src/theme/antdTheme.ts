import { tokens } from './tokens'

export const darkAntdTheme = {
  token: {
    colorPrimary: tokens.colors.primary,
    colorBgContainer: tokens.colors.bgCard,
    colorBgElevated: tokens.colors.bgSecondary,
    colorBgLayout: tokens.colors.bgPrimary,
    colorText: tokens.colors.textPrimary,
    colorTextSecondary: tokens.colors.textSecondary,
    colorBorder: tokens.colors.border,
    colorBorderSecondary: tokens.colors.border,
    borderRadius: 8,
    fontFamily: "'Inter', system-ui, sans-serif",
    colorError: tokens.colors.error,
    colorSuccess: tokens.colors.success,
    colorWarning: tokens.colors.warning,
  },
  components: {
    Button: {
      borderRadius: 8,
      fontWeight: 600,
    },
    Input: {
      colorBgContainer: tokens.colors.bgCard,
      activeBorderColor: tokens.colors.primary,
      hoverBorderColor: tokens.colors.primaryLight,
    },
    Select: {
      colorBgContainer: tokens.colors.bgCard,
    },
    Table: {
      colorBgContainer: tokens.colors.bgCard,
      headerBg: tokens.colors.bgSecondary,
    },
    Modal: {
      contentBg: tokens.colors.bgCard,
      headerBg: tokens.colors.bgCard,
    },
    Message: {
      contentBg: tokens.colors.bgCard,
    },
  },
}

export const lightAntdTheme = {
  token: {
    colorPrimary: '#0096B7',
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#F8FAFF',
    colorBgLayout: tokens.colors.lightBg,
    colorText: tokens.colors.lightTextPrimary,
    colorTextSecondary: tokens.colors.lightTextSecondary,
    borderRadius: 8,
    fontFamily: "'Inter', system-ui, sans-serif",
  },
}
