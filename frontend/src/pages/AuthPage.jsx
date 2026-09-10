import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'
import {
  Loader2, Mail, ArrowRight, Lock, Sparkles,
  AlertCircle, CheckCircle2, ChevronRight
} from 'lucide-react'

// Custom SVGs for official social branding
function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"/>
      <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"/>
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.98.6-2.61 1.34-.56.64-.99 1.72-.86 2.74 1 .08 1.92-.48 2.54-1.23"/>
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#F25022" d="M1 1h10v10H1z"/>
      <path fill="#7FBA00" d="M13 1h10v10H13z"/>
      <path fill="#00A4EF" d="M1 13h10v10H1z"/>
      <path fill="#FFB900" d="M13 13h10v10H13z"/>
    </svg>
  )
}

export default function AuthPage() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()

  // Form states
  const [authMode, setAuthMode] = useState('password') // 'password' | 'magic'
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const [error, setError] = useState('')
  const [providerError, setProviderError] = useState('')

  // OAuth Handler
  const handleOAuthLogin = async (provider) => {
    setLoading(true)
    setError('')
    setProviderError('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/dashboard` },
      })

      if (error) {
        if (error.message.includes('not enabled') || error.message.includes('validation_failed')) {
          setProviderError(
            `${provider.toUpperCase()} provider is not toggled ON in your Supabase project yet. You can sign in using Email or the Instant Demo button below!`
          )
        } else {
          setError(error.message)
        }
      }
    } catch (err) {
      setError(err.message || 'OAuth initialization failed.')
    } finally {
      setLoading(false)
    }
  }

  // Password Login / Signup
  const handlePasswordAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setProviderError('')

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        })
        if (error) throw error
        if (data.user && !data.session) {
          setMagicSent(true)
        } else {
          setUser(data.user)
          navigate('/dashboard')
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        setUser(data.user)
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Magic Link
  const handleMagicLink = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setProviderError('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      })
      if (error) throw error
      setMagicSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Instant Demo Access (Bypasses email verification for quick workflow evaluation)
  const handleDemoLogin = () => {
    setUser({
      id: 'demo-user-2026',
      email: 'demo.analyst@analyticshub.ai',
      user_metadata: { full_name: 'Lead Data Scientist' },
    })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-ah-bg flex items-center justify-center px-4 py-12">
      {/* Background radial glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-ah-primary opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <img src="/assets/logo.png" alt="Analytics Hub" className="w-14 h-14" />
            <span className="font-headline text-xl font-bold text-ah-text">Analytics Hub</span>
          </Link>
          <p className="text-ah-muted mt-1.5 text-xs font-mono">The Intelligence in Your Data, Unleashed</p>
        </div>

        {/* Auth Card */}
        <div className="bg-ah-surface border border-ah rounded-3xl p-8 shadow-ah-float">
          {!magicSent ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-headline text-2xl font-bold">
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                  </h1>
                  <p className="text-ah-muted text-xs mt-1">
                    {isSignUp ? 'Start building models with 50 free OCUs' : 'Sign in to access your models & pipelines'}
                  </p>
                </div>
              </div>

              {/* Provider Configuration Warning Alert */}
              {providerError && (
                <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-200 flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <p className="font-semibold text-yellow-300 mb-1">Provider Setup Notice</p>
                    <p>{providerError}</p>
                  </div>
                </div>
              )}

              {/* Standard Error Alert */}
              {error && (
                <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Social Login Providers Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {/* 1. Google */}
                <button
                  onClick={() => handleOAuthLogin('google')}
                  disabled={loading}
                  className="flex items-center justify-center gap-2.5 bg-ah-surface2 hover:bg-ah-surface3 border border-ah hover:border-ah-primary text-ah-text py-2.5 px-4 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </button>

                {/* 2. GitHub */}
                <button
                  onClick={() => handleOAuthLogin('github')}
                  disabled={loading}
                  className="flex items-center justify-center gap-2.5 bg-ah-surface2 hover:bg-ah-surface3 border border-ah hover:border-ah-primary text-ah-text py-2.5 px-4 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <GithubIcon />
                  <span>GitHub</span>
                </button>

                {/* 3. Apple */}
                <button
                  onClick={() => handleOAuthLogin('apple')}
                  disabled={loading}
                  className="flex items-center justify-center gap-2.5 bg-ah-surface2 hover:bg-ah-surface3 border border-ah hover:border-ah-primary text-ah-text py-2.5 px-4 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <AppleIcon />
                  <span>Apple</span>
                </button>

                {/* 4. Microsoft */}
                <button
                  onClick={() => handleOAuthLogin('azure')}
                  disabled={loading}
                  className="flex items-center justify-center gap-2.5 bg-ah-surface2 hover:bg-ah-surface3 border border-ah hover:border-ah-primary text-ah-text py-2.5 px-4 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <MicrosoftIcon />
                  <span>Microsoft</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-ah" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-ah-surface px-3 text-ah-subtle text-[11px] font-mono uppercase">
                    or email credentials
                  </span>
                </div>
              </div>

              {/* Mode Toggle (Password vs Magic Link) */}
              <div className="flex bg-ah-surface2 p-1 rounded-xl border border-ah mb-5">
                <button
                  type="button"
                  onClick={() => setAuthMode('password')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    authMode === 'password'
                      ? 'bg-ah-surface text-ah-text shadow-sm'
                      : 'text-ah-muted hover:text-ah-text'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('magic')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    authMode === 'magic'
                      ? 'bg-ah-surface text-ah-text shadow-sm'
                      : 'text-ah-muted hover:text-ah-text'
                  }`}
                >
                  Magic Link 🪄
                </button>
              </div>

              {/* Password Auth Form */}
              {authMode === 'password' ? (
                <form onSubmit={handlePasswordAuth} className="space-y-4">
                  <div>
                    <label className="block text-ah-subtle text-[11px] font-mono uppercase tracking-wider mb-1.5">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ah-subtle" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                        className="w-full bg-ah-surface2 border border-ah focus:border-ah-primary rounded-xl pl-10 pr-4 py-2.5 text-ah-text placeholder:text-ah-subtle outline-none transition-colors text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-ah-subtle text-[11px] font-mono uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ah-subtle" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        minLength={6}
                        className="w-full bg-ah-surface2 border border-ah focus:border-ah-primary rounded-xl pl-10 pr-4 py-2.5 text-ah-text placeholder:text-ah-subtle outline-none transition-colors text-xs font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="w-full flex items-center justify-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white py-3 rounded-xl font-semibold text-xs transition-all disabled:opacity-50 shadow-ah-glow"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    {loading ? 'Processing...' : isSignUp ? 'Create Free Account' : 'Sign In with Password'}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-xs text-ah-muted hover:text-ah-text transition-colors"
                    >
                      {isSignUp
                        ? 'Already have an account? Sign In'
                        : "Don't have an account? Create one"}
                    </button>
                  </div>
                </form>
              ) : (
                /* Magic Link Form */
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div>
                    <label className="block text-ah-subtle text-[11px] font-mono uppercase tracking-wider mb-1.5">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ah-subtle" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                        className="w-full bg-ah-surface2 border border-ah focus:border-ah-primary rounded-xl pl-10 pr-4 py-2.5 text-ah-text placeholder:text-ah-subtle outline-none transition-colors text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full flex items-center justify-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white py-3 rounded-xl font-semibold text-xs transition-all disabled:opacity-50 shadow-ah-glow"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    {loading ? 'Dispatching Link...' : 'Send Magic Link 🪄'}
                  </button>
                </form>
              )}

              {/* Instant Demo Access Button */}
              <div className="mt-6 pt-5 border-t border-ah">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 px-4 rounded-xl bg-ah-surface2 hover:bg-ah-surface3 border border-dashed border-ah hover:border-ah-primary text-xs font-semibold text-ah-muted hover:text-ah-text flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles size={14} className="text-yellow-400" />
                  <span>Instant Demo Access (Bypass Login)</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Terms disclaimer */}
              <p className="text-ah-subtle text-[11px] text-center mt-6 leading-relaxed">
                By continuing, you agree to our{' '}
                <Link to="/terms" className="text-ah-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and acknowledge the{' '}
                <Link to="/terms" className="text-ah-muted hover:underline">
                  AI Output Disclaimer
                </Link>.
              </p>
            </>
          ) : (
            /* Magic link / Confirmation sent state */
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-ah-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-4 border border-ah-primary/30">
                <Mail size={28} className="text-ah-primary" />
              </div>
              <h2 className="font-headline text-xl font-bold mb-2">Check your inbox</h2>
              <p className="text-ah-muted text-xs mb-4 leading-relaxed">
                We sent a secure link to <strong className="text-ah-text">{email}</strong>. Click the link in your email to instantly enter your dashboard.
              </p>
              <button
                onClick={() => setMagicSent(false)}
                className="text-xs text-ah-primary hover:underline font-semibold"
              >
                ← Use a different login method
              </button>
            </div>
          )}
        </div>

        {/* Back Link */}
        <p className="text-center text-ah-subtle text-xs mt-6">
          <Link to="/" className="hover:text-ah-text transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
