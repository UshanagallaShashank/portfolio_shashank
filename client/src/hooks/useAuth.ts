import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.exp * 1000 > Date.now()) {
          setUser({ id: payload.sub, email: payload.email })
        } else {
          localStorage.removeItem('admin_token')
        }
      } catch {
        localStorage.removeItem('admin_token')
      }
    }
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('admin_token')
    setUser(null)
  }

  return { user, loading, logout }
}
