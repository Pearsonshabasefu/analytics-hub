import { create } from 'zustand'

// Apply theme class immediately on module load (before React renders)
const storedTheme = localStorage.getItem('ah-theme') || 'dark'
document.documentElement.classList.remove('dark', 'light')
document.documentElement.classList.add(storedTheme)

export const useThemeStore = create((set) => ({
  theme: storedTheme,
  setTheme: (theme) => {
    localStorage.setItem('ah-theme', theme)
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
    set({ theme })
  },
  toggleTheme: () => {
    const current = localStorage.getItem('ah-theme') || 'dark'
    const next = current === 'dark' ? 'light' : 'dark'
    localStorage.setItem('ah-theme', next)
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(next)
    set({ theme: next })
  },
}))
