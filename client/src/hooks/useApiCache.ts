import { useState, useEffect } from 'react'

function getCached<T>(key: string): T | null {
  try {
    const item = sessionStorage.getItem(`api_cache_${key}`)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    sessionStorage.setItem(`api_cache_${key}`, JSON.stringify(data))
  } catch {}
}

export function useApiCache<T>(key: string, fetcher: () => Promise<T>) {
  const cached = getCached<T>(key)
  const [data, setData] = useState<T | null>(cached)
  const [loading, setLoading] = useState(cached === null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (cached !== null) return
    fetcher()
      .then((result) => {
        setData(result)
        setCache(key, result)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error }
}

/** Call this from admin pages after a write to invalidate cached data */
export function invalidateCache(...keys: string[]) {
  keys.forEach((key) => {
    try { sessionStorage.removeItem(`api_cache_${key}`) } catch {}
  })
}
