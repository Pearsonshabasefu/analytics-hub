import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useEffect, useState, useCallback } from 'react'
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
import MagicEarWidget from './components/features/feedback/MagicEarWidget'

// Session security
import { useIdleTimeout } from './hooks/useIdleTimeout'
import SessionWarningModal from './components/common/SessionWarningModal'

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return (
    <div className="min-h-screen bg-ah-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-ah-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/auth" replace />
  return children
}

// Inner component — must be inside <Router> to use useNavigate / useIdleTimeout
function AppInner() {
  const { setUser, setLoading } = useAuthStore()
  const [warnSeconds, setWarnSeconds] = useState(null)

  // Supabase auth state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
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

        {/* Protected app routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/project/:projectId/ingest"     element={<ProtectedRoute><IngestPage /></ProtectedRoute>} />
        <Route path="/project/:projectId/refinery"   element={<ProtectedRoute><RefineryPage /></ProtectedRoute>} />
        <Route path="/project/:projectId/studio"     element={<ProtectedRoute><StudioPage /></ProtectedRoute>} />
        <Route path="/project/:projectId/deploy"     element={<ProtectedRoute><DeployPage /></ProtectedRoute>} />
        <Route path="/project/:projectId/watchtower" element={<ProtectedRoute><WatchtowerPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global: Magic Ear feedback widget */}
      <MagicEarWidget />

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
