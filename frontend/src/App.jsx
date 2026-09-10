import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'
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

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return <div className="min-h-screen bg-ah-bg flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-ah-primary border-t-transparent rounded-full animate-spin" />
  </div>
  if (!user) return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  const { setUser, setLoading } = useAuthStore()

  // Listen for Supabase auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription?.unsubscribe()
  }, [setUser, setLoading])

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
        <Route path="/project/:projectId/ingest"    element={<ProtectedRoute><IngestPage /></ProtectedRoute>} />
        <Route path="/project/:projectId/refinery"  element={<ProtectedRoute><RefineryPage /></ProtectedRoute>} />
        <Route path="/project/:projectId/studio"    element={<ProtectedRoute><StudioPage /></ProtectedRoute>} />
        <Route path="/project/:projectId/deploy"    element={<ProtectedRoute><DeployPage /></ProtectedRoute>} />
        <Route path="/project/:projectId/watchtower" element={<ProtectedRoute><WatchtowerPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Magic Ear floating feedback */}
      <MagicEarWidget />
    </>
  )
}
