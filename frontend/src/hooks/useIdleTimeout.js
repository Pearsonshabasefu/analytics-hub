import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'

const IDLE_TIMEOUT_MS = 60 * 60 * 1000  // 60 minutes
const WARN_BEFORE_MS  = 5  * 60 * 1000  // Warn 5 minutes before

const ACTIVITY_EVENTS = [
  'mousemove', 'mousedown', 'keydown',
  'scroll', 'touchstart', 'click', 'pointermove',
]

export function useIdleTimeout({ onWarn, onExpired }) {
  const { user }  = useAuthStore()
  const navigate  = useNavigate()

  const warnTimer    = useRef(null)
  const expireTimer  = useRef(null)
  const warnInterval = useRef(null)

  const clearAll = useCallback(() => {
    clearTimeout(warnTimer.current)
    clearTimeout(expireTimer.current)
    clearInterval(warnInterval.current)
  }, [])

  const handleExpire = useCallback(async () => {
    clearAll()
    await supabase.auth.signOut()
    useAuthStore.getState().setUser(null)
    onExpired?.()
    navigate('/auth', { replace: true })
  }, [clearAll, navigate, onExpired])

  const resetTimer = useCallback(() => {
    if (!user) return
    clearAll()

    warnTimer.current = setTimeout(() => {
      let secondsLeft = Math.round(WARN_BEFORE_MS / 1000)
      onWarn?.(secondsLeft)
      warnInterval.current = setInterval(() => {
        secondsLeft -= 1
        onWarn?.(secondsLeft)
        if (secondsLeft <= 0) clearInterval(warnInterval.current)
      }, 1000)
    }, IDLE_TIMEOUT_MS - WARN_BEFORE_MS)

    expireTimer.current = setTimeout(handleExpire, IDLE_TIMEOUT_MS)
  }, [user, clearAll, onWarn, handleExpire])

  useEffect(() => {
    if (!user) { clearAll(); return }
    resetTimer()
    const handleActivity = () => resetTimer()
    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, handleActivity, { passive: true }))
    return () => {
      clearAll()
      ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, handleActivity))
    }
  }, [user, resetTimer, clearAll])

  return { resetTimer }
}
