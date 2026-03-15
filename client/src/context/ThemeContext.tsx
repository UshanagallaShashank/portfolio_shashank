import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ConfigProvider, theme as antdTheme } from 'antd'
import { darkMuiTheme, lightMuiTheme } from '../theme/muiTheme'
import { darkAntdTheme, lightAntdTheme } from '../theme/antdTheme'

type ThemeMode = 'dark' | 'light'

interface ThemeContextValue {
  mode: ThemeMode
  toggleTheme: () => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  toggleTheme: () => {},
  isDark: true,
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('theme') as ThemeMode) || 'dark'
  })

  useEffect(() => {
    localStorage.setItem('theme', mode)
    document.documentElement.setAttribute('data-theme', mode)
    if (mode === 'dark') {
      document.body.style.backgroundColor = '#0A0E1A'
    } else {
      document.body.style.backgroundColor = '#F0F7FF'
    }
  }, [mode])

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const isDark = mode === 'dark'
  const muiTheme = isDark ? darkMuiTheme : lightMuiTheme
  const antdConfig = isDark ? darkAntdTheme : lightAntdTheme
  const antdAlgorithm = isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, isDark }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <ConfigProvider theme={{ ...antdConfig, algorithm: antdAlgorithm }}>
          {children}
        </ConfigProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
