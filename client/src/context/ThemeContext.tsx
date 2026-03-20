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
    // Set solid base colours so GlobalBackground's fixed layer has a canvas behind it
    const bg = mode === 'dark' ? '#060A14' : '#EBF5FF'
    document.documentElement.style.backgroundColor = bg
    document.body.style.backgroundColor = bg
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
