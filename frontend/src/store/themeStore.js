import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('ah-theme') || 'dark',
  setTheme: (theme) => {
    localStorage.setItem('ah-theme', theme)
    // Apply to document root
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme === 'dark' ? 'dark' : 'light')
    set({ theme })
  },
  toggleTheme: () => {
    const current = localStorage.getItem('ah-theme') || 'dark'
    const next = current === 'dark' ? 'light' : 'dark'
    localStorage.setItem('ah-theme', next)
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(next === 'dark' ? 'dark' : 'light')
    set({ theme: next })
  },
}))
