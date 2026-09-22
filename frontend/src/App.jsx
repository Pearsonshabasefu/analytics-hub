import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { supabase } from './lib/supabaseClient'

// Pages
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import IngestPage from './pages/IngestPage'
import RefineryPage from './pages/RefineryPage'
import StudioPage from './pages/StudioPage'
import DeployPage from './pages/DeployPage'
import WatchtowerPage from './pages/WatchtowerPage'
import SettingsPage from './pages/SettingsPage'
import PricingPage from './pages/PricingPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import DpaPage from './pages/DpaPage'
import CompliancePage from './pages/CompliancePage'
import MagicEarWidget from './components/features/feedback/MagicEarWidget'
import PwaInstallPrompt from './components/common/PwaInstallPrompt'
import CookieConsentBanner from './components/common/CookieConsentBanner'

// Session security
import { useIdleTimeout } from './hooks/useIdleTimeout'
import SessionWarningModal from './components/common/SessionWarningModal'

// Path normalization and route security guard
export function normalizePath(rawPath = '') {
  try {
    const decoded = decodeURIComponent(rawPath)
    const collapsed = decoded.replace(/\/+/g, '/').toLowerCase()
    return (collapsed.length > 1 && collapsed.endsWith('/')) 
      ? collapsed.slice(0, -1) 
      : collapsed
  } catch (_) {
    return rawPath.toLowerCase()
  }
}

export function isProtectedPath(path = '') {
  const norm = normalizePath(path)
  const protectedPrefixes = [
    '/dashboard',
    '/project',
    '/settings',
    '/studio',
    '/deploy',
    '/refinery',
    '/watchtower',
    '/ingest',
  ]
  return protectedPrefixes.some(prefix => norm === prefix || norm.startsWith(`${prefix}/`))
}

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore()
  const location = useLocation()

  if (loading) return (
    <div className="min-h-screen bg-ah-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-ah-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!user) {
    const redirectUrl = `/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`
    return <Navigate to={redirectUrl} replace />
  }
  return children
}

// Inner component — must be inside <Router> to use useNavigate / useIdleTimeout
function AppInner() {
  const { user, setUser, loading, setLoading } = useAuthStore()
  const [warnSeconds, setWarnSeconds] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Proactive Route Interceptor: Catches all protected path variations before rendering
  useEffect(() => {
    if (loading) return
    const norm = normalizePath(location.pathname)
    if (isProtectedPath(norm) && !user) {
      const redirectUrl = `/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`
      navigate(redirectUrl, { replace: true })
    }
  }, [location.pathname, location.search, user, loading, navigate])

  // Supabase auth state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        const saved = localStorage.getItem('refineiq_auth_user')
        try {
          const parsed = saved ? JSON.parse(saved) : null
          if (parsed?.isDemo) {
            setUser(parsed)
          } else {
            setUser(null)
          }
        } catch (_) {
          setUser(null)
        }
      }
      setLoading(false)
    }).catch(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        const saved = localStorage.getItem('refineiq_auth_user')
        try {
          const parsed = saved ? JSON.parse(saved) : null
          if (parsed?.isDemo) {
            setUser(parsed)
          } else {
            setUser(null)
          }
        } catch (_) {
          setUser(null)
        }
      }
    })
    return () => subscription?.unsubscribe()
  }, [setUser, setLoading])

  // Idle timeout: warn at 55 min, expire at 60 min
  const handleWarn = useCallback((secs) => setWarnSeconds(secs), [])
  const handleExpired = useCallback(() => setWarnSeconds(null), [])
  const { resetTimer } = useIdleTimeout({ onWarn: handleWarn, onExpired: handleExpired })

  const handleStayIn = useCallback(() => {
    setWarnSeconds(null)
    resetTimer()
  }, [resetTimer])

  const handleSignOutNow = useCallback(async () => {
    setWarnSeconds(null)
    localStorage.removeItem('refineiq_auth_user')
    await supabase.auth.signOut()
    setUser(null)
  }, [setUser])

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/dpa" element={<DpaPage />} />
        <Route path="/compliance" element={<CompliancePage />} />

        {/* Protected app routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/project/:projectId/ingest"     element={<ProtectedRoute><IngestPage /></ProtectedRoute>} />
        <Route path="/project/:projectId/refinery"   element={<ProtectedRoute><RefineryPage /></ProtectedRoute>} />
        <Route path="/project/:projectId/studio"     element={<ProtectedRoute><StudioPage /></ProtectedRoute>} />
        <Route path="/project/:projectId/deploy"     element={<ProtectedRoute><DeployPage /></ProtectedRoute>} />
        <Route path="/project/:projectId/watchtower" element={<ProtectedRoute><WatchtowerPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Fallback with protected path intercept */}
        <Route path="*" element={
          isProtectedPath(location.pathname) ? (
            <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />
          ) : (
            <Navigate to="/" replace />
          )
        } />
      </Routes>

      {/* Global: Magic Ear feedback widget */}
      <MagicEarWidget />

      {/* Global: PWA Desktop/Mobile Installation Prompt */}
      <PwaInstallPrompt />

      {/* Global: Cookie Consent & Preference Banner */}
      <CookieConsentBanner />

      {/* Global: Session expiry warning modal */}
      <SessionWarningModal
        secondsLeft={warnSeconds}
        onStayIn={handleStayIn}
        onSignOut={handleSignOutNow}
      />
    </>
  )
}

export default function App() {
  return <AppInner />
}
