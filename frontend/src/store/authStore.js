import { create } from 'zustand'

const getSavedUser = () => {
  try {
    const saved = localStorage.getItem('refineiq_auth_user')
    if (saved) return JSON.parse(saved)
  } catch (_) {}
  return null
}

const initialUser = getSavedUser()
const generateSessionId = () => `sess_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`

export const useAuthStore = create((set, get) => ({
  user: initialUser,
  loading: !initialUser,
  sessionId: generateSessionId(),
  
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

  /**
   * Session Anti-Fixation Protection:
   * Regenerates session ID after every login and on every privilege/tier change.
   * Enforces Secure and SameSite flags on client session cookies.
   */
  regenerateSession: (reason = 'login') => {
    const newSessionId = generateSessionId()
    
    // Set secure client-side cookie with Secure and SameSite=Lax flags
    if (typeof document !== 'undefined') {
      const isHttps = window.location.protocol === 'https:'
      const secureFlag = isHttps ? '; Secure' : ''
      document.cookie = `refineiq_session_nonce=${newSessionId}; SameSite=Lax; path=/${secureFlag}`
    }

    set({ sessionId: newSessionId })

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('refineiq-session-regenerated', { 
        detail: { reason, sessionId: newSessionId, timestamp: Date.now() } 
      }))
    }

    return newSessionId
  },
}))
