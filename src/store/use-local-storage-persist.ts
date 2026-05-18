import { useEffect } from 'react'

export function useLocalStoragePersist<T>(key: string, value: T): void {
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage may throw on quota exceeded, in private browsing on
      // some browsers, or when serialization fails. Persistence is a
      // best-effort convenience here — swallow and move on.
    }
  }, [key, value])
}

export function loadLocalStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed = JSON.parse(raw) as unknown
    if (parsed === null) return fallback
    return parsed as T
  } catch {
    return fallback
  }
}
