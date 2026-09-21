import { create } from 'zustand'

const getSavedUser = () => {
  try {
    const saved = localStorage.getItem('refineiq_auth_user')
    if (saved) return JSON.parse(saved)
  } catch (_) {}
  return null
}

const initialUser = getSavedUser()

export const useAuthStore = create((set) => ({
  user: initialUser,
  loading: !initialUser,
  setUser: (user) => {
    try {
      if (user) {
        localStorage.setItem('refineiq_auth_user', JSON.stringify(user))
      } else {
        localStorage.removeItem('refineiq_auth_user')
      }
    } catch (_) {}
    set({ user, loading: false })
  },
  setLoading: (loading) => set({ loading }),
}))


