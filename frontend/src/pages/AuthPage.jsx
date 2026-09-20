import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'
import {
  Loader2, Mail, ArrowRight, Lock, Sparkles,
  AlertCircle, Eye, EyeOff, ChevronRight, X, ExternalLink, ShieldCheck, Zap
} from 'lucide-react'
import Logo from '../components/common/Logo'

// ── Social Brand Icons ──────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"/>
      <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"/>
    </svg>
  )
}
function GithubIcon() {
  return (
    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )
}
function AppleIcon() {
  return (
    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8.93-2.85-.9.04-1.98.6-2.61 1.34-.56.64-.99 1.72-.86 2.74 1 .08 1.92-.48 2.54-1.23"/>
    </svg>
  )
}
function MicrosoftIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path fill="#F25022" d="M1 1h10v10H1z"/>
      <path fill="#7FBA00" d="M13 1h10v10H13z"/>
      <path fill="#00A4EF" d="M1 13h10v10H1z"/>
      <path fill="#FFB900" d="M13 13h10v10H13z"/>
    </svg>
  )
}

// ── Social Button ────────────────────────────────────────────────────
function SocialBtn({ icon, label, onClick, disabled, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        relative flex items-center justify-center gap-2
        bg-[#18181B] hover:bg-[#1F1F23] active:bg-[#27272A] active:scale-95
        border border-[#27272A] hover:border-[#007AFF] focus:border-[#007AFF]
        text-[#F4F4F5] py-2.5 px-3 rounded-xl text-xs font-semibold
        transition-all duration-150 outline-none
        focus:ring-2 focus:ring-[#007AFF]/40
        disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
        shadow-sm hover:shadow-[0_0_12px_rgba(0,122,255,0.18)]
      "
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
          {badge}
        </span>
      )}
    </button>
  )
}

// ── Main Component ───────────────────────────────────────────────────
export default function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuthStore()

  const searchParams = new URLSearchParams(location.search)
  const initialMode = searchParams.get('mode') // 'signin' | 'signup'

  const [authMode, setAuthMode] = useState('password')
  // Default to Sign Up (Create Account) unless explicitly navigating to ?mode=signin
  const [isSignUp, setIsSignUp] = useState(initialMode !== 'signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const [error, setError] = useState('')
  const [providerError, setProviderError] = useState('')

  // Live provider status queried from Supabase
  const [enabledProviders, setEnabledProviders] = useState({
    email: true,
    google: false,
    github: false,
    apple: false,
    azure: false,
  })

  // Modal state when clicking unconfigured OAuth provider
  const [oauthModalProvider, setOauthModalProvider] = useState(null)
  const [showDevSetup, setShowDevSetup] = useState(false)

  // Production URL for redirects
  const redirectBase = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://refineiq.vercel.app'

  const label = (p) => ({ google: 'Google', github: 'GitHub', apple: 'Apple', azure: 'Microsoft' }[p] || p)

  // Discover enabled providers and catch URL errors on mount
  useEffect(() => {
    // 1. Query Supabase auth settings
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ianfedrnvinptcnjnxgq.supabase.co'
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_2-awLWVz6r3EFvuH3p2a8A__ZiGWkwk'

    fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: { apikey: supabaseKey },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.external) {
          setEnabledProviders(data.external)
        }
      })
      .catch(() => {
        // Fallback: email true, external false
      })

    // 2. Parse any Supabase callback error in URL hash or query string
    const hash = window.location.hash
    const search = window.location.search
    const combined = (hash ? hash.replace('#', '&') : '') + search
    if (combined) {
      const params = new URLSearchParams(combined)
      const errorMsg = params.get('error_description') || params.get('msg') || params.get('error')
      if (errorMsg) {
        if (
          errorMsg.toLowerCase().includes('not enabled') ||
          errorMsg.toLowerCase().includes('validation_failed') ||
          errorMsg.toLowerCase().includes('unsupported provider')
        ) {
          setProviderError(
            'The selected social login provider is not enabled in the Supabase project dashboard. Please sign in below using Email + Password or click Instant Demo Access.'
          )
        } else {
          setError(decodeURIComponent(errorMsg))
        }
      }
    }
  }, [location])

  // OAuth Handler — intercepts unenabled providers safely
  const handleOAuthLogin = async (provider) => {
    setError('')
    setProviderError('')

    // Intercept unconfigured providers in-app to prevent raw Supabase HTTP 400 error page
    if (!enabledProviders[provider]) {
      setOauthModalProvider(provider)
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${redirectBase}/dashboard` },
      })
      if (error) {
        if (
          error.message?.toLowerCase().includes('not enabled') ||
          error.message?.toLowerCase().includes('validation_failed') ||
          error.message?.toLowerCase().includes('unsupported provider')
        ) {
          setOauthModalProvider(provider)
        } else {
          setError(error.message)
        }
      }
    } catch (err) {
      setError(err.message || 'OAuth sign-in failed.')
    } finally {
      setLoading(false)
    }
  }

  // Password Auth
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
          options: { emailRedirectTo: `${redirectBase}/dashboard` },
        })
        if (error) throw error
        if (data.user && !data.session) {
          setMagicSent(true) // email confirmation required
        } else {
          setUser(data.user)
          navigate('/dashboard')
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
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
        options: {
          emailRedirectTo: `${redirectBase}/dashboard`,
          shouldCreateUser: true,
        },
      })
      if (error) throw error
      setMagicSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Demo Mode — instant authentication with full pre-loaded sample data
  const handleDemoLogin = () => {
    setUser({
      id: 'demo-user-2026',
      email: 'demo.analyst@refineiq.ai',
      user_metadata: { full_name: 'Demo Analyst' },
      isDemo: true,
    })
    navigate('/dashboard')
  }

  const handlePrefillDemo = () => {
    setEmail('demo.analyst@refineiq.ai')
    setPassword('DemoPassword2026!')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo size="lg" />
          <p className="text-[#71717A] mt-2 text-xs font-mono">The Intelligence in Your Data, Unleashed</p>
        </div>

        {/* Card */}
        <div className="bg-[#111113] border border-[#27272A] rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          {!magicSent ? (
            <>
              {/* Title */}
              <div className="mb-5">
                <h1 className="text-2xl font-bold text-[#F4F4F5]" style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}>
                  {isSignUp ? 'Create Free Account' : 'Welcome Back'}
                </h1>
                <p className="text-[#A1A1AA] text-xs mt-1">
                  {isSignUp ? 'Get started with 50 free OCUs — no credit card needed' : 'Sign in to your models & pipelines'}
                </p>
              </div>

              {/* Instant Demo Access Hero Banner */}
              <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/25 to-blue-900/30 border border-[#007AFF]/40 flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#007AFF]/20 flex items-center justify-center text-yellow-400 shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Evaluating RefineIQ?</span>
                    <span className="text-[11px] text-[#A1A1AA] block">1-click demo access with zero setup.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="px-3 py-1.5 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-semibold whitespace-nowrap shadow-sm transition-all"
                >
                  Launch Demo ⚡
                </button>
              </div>

              {/* Segmented Create Account / Sign In Tabs */}
              <div className="flex bg-[#18181B] p-1.5 rounded-2xl border border-[#27272A] mb-6 shadow-inner">
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); setError(''); setProviderError('') }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 ${
                    isSignUp
                      ? 'bg-[#4F46E5] text-white shadow-[0_0_16px_rgba(79,70,229,0.4)]'
                      : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
                  }`}
                >
                  <Sparkles size={13} className={isSignUp ? 'text-yellow-300' : 'text-[#A1A1AA]'} />
                  <span>Create Account (Free)</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); setError(''); setProviderError('') }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 ${
                    !isSignUp
                      ? 'bg-[#4F46E5] text-white shadow-[0_0_16px_rgba(79,70,229,0.4)]'
                      : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
                  }`}
                >
                  <span>Sign In</span>
                </button>
              </div>

              {/* Provider Notice */}
              {providerError && (
                <div className="mb-5 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/25 text-xs text-yellow-200 flex items-start gap-2.5">
                  <AlertCircle size={15} className="text-yellow-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <p className="font-semibold text-yellow-300 mb-0.5">Social Provider Setup Pending</p>
                    <p>{providerError}</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email / Password Mode Toggle */}
              <div className="flex bg-[#18181B] p-1 rounded-xl border border-[#27272A] mb-5">
                {['password', 'magic'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAuthMode(mode)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 outline-none
                      focus:ring-2 focus:ring-[#007AFF]/40
                      ${authMode === mode
                        ? 'bg-[#111113] text-[#F4F4F5] shadow-sm ring-1 ring-[#27272A]'
                        : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
                      }`}
                  >
                    {mode === 'password' ? 'Email & Password (Active)' : 'Magic Link 🪄'}
                  </button>
                ))}
              </div>

              {/* Password Form */}
              {authMode === 'password' ? (
                <form onSubmit={handlePasswordAuth} className="space-y-4">
                  {/* Email */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[#52525B] text-[11px] font-mono uppercase tracking-wider">
                        Email address
                      </label>
                      <button
                        type="button"
                        onClick={handlePrefillDemo}
                        className="text-[10px] text-[#007AFF] hover:underline font-mono"
                      >
                        Auto-fill demo user
                      </button>
                    </div>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52525B]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                        className="
                          w-full bg-[#18181B] border border-[#27272A] rounded-xl
                          pl-10 pr-4 py-2.5 text-[#F4F4F5] placeholder:text-[#52525B]
                          text-xs outline-none transition-all duration-150
                          focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20
                          hover:border-[#3F3F46]
                        "
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[#52525B] text-[11px] font-mono uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52525B]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        minLength={6}
                        className="
                          w-full bg-[#18181B] border border-[#27272A] rounded-xl
                          pl-10 pr-10 py-2.5 text-[#F4F4F5] placeholder:text-[#52525B]
                          text-xs font-mono outline-none transition-all duration-150
                          focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20
                          hover:border-[#3F3F46]
                        "
                      />
                      {/* 👁 Eye Toggle */}
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#A1A1AA] active:scale-90 transition-all outline-none"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="
                      w-full flex items-center justify-center gap-2
                      bg-[#007AFF] hover:bg-[#0062CC] active:bg-[#0051A8] active:scale-[0.98]
                      text-white py-3 rounded-xl font-semibold text-xs
                      transition-all duration-150 outline-none
                      focus:ring-2 focus:ring-[#007AFF]/50
                      disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                      shadow-[0_0_20px_rgba(0,122,255,0.25)] hover:shadow-[0_0_28px_rgba(0,122,255,0.4)]
                    "
                  >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={15} />}
                    {loading ? 'Processing…' : isSignUp ? 'Create Free Account (50 OCUs)' : 'Sign In with Email'}
                  </button>
                </form>
              ) : (
                /* Magic Link Form */
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div>
                    <label className="block text-[#52525B] text-[11px] font-mono uppercase tracking-wider mb-1.5">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52525B]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                        className="
                          w-full bg-[#18181B] border border-[#27272A] rounded-xl
                          pl-10 pr-4 py-2.5 text-[#F4F4F5] placeholder:text-[#52525B]
                          text-xs outline-none transition-all duration-150
                          focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20
                          hover:border-[#3F3F46]
                        "
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="
                      w-full flex items-center justify-center gap-2
                      bg-[#007AFF] hover:bg-[#0062CC] active:bg-[#0051A8] active:scale-[0.98]
                      text-white py-3 rounded-xl font-semibold text-xs
                      transition-all duration-150 outline-none
                      focus:ring-2 focus:ring-[#007AFF]/50
                      disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                      shadow-[0_0_20px_rgba(0,122,255,0.25)] hover:shadow-[0_0_28px_rgba(0,122,255,0.4)]
                    "
                  >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={15} />}
                    {loading ? 'Dispatching link…' : 'Send Magic Link 🪄'}
                  </button>
                </form>
              )}

              {/* Social Logins Section */}
              <div className="mt-6 pt-5 border-t border-[#27272A]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#71717A] text-[11px] font-mono uppercase tracking-wider">
                    Or continue with social
                  </span>
                  <span className="text-[10px] text-[#A1A1AA]">
                    {enabledProviders.google ? 'Active' : 'OAuth setup pending'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <SocialBtn
                    icon={<GoogleIcon />}
                    label="Google"
                    onClick={() => handleOAuthLogin('google')}
                    disabled={loading}
                    badge={!enabledProviders.google ? 'Setup' : null}
                  />
                  <SocialBtn
                    icon={<GithubIcon />}
                    label="GitHub"
                    onClick={() => handleOAuthLogin('github')}
                    disabled={loading}
                    badge={!enabledProviders.github ? 'Setup' : null}
                  />
                  <SocialBtn
                    icon={<AppleIcon />}
                    label="Apple"
                    onClick={() => handleOAuthLogin('apple')}
                    disabled={loading}
                    badge={!enabledProviders.apple ? 'Setup' : null}
                  />
                  <SocialBtn
                    icon={<MicrosoftIcon />}
                    label="Microsoft"
                    onClick={() => handleOAuthLogin('azure')}
                    disabled={loading}
                    badge={!enabledProviders.azure ? 'Setup' : null}
                  />
                </div>
              </div>

              {/* Terms */}
              <p className="text-[#52525B] text-[11px] text-center mt-6 leading-relaxed">
                By continuing, you agree to our{' '}
                <Link to="/terms" className="text-[#007AFF] hover:underline">Terms of Service</Link>
                {' '}and acknowledge the{' '}
                <Link to="/terms" className="text-[#A1A1AA] hover:underline">AI Output Disclaimer</Link>.
              </p>
            </>
          ) : (
            /* ✉️ Email Sent State */
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-[#007AFF]/15 border border-[#007AFF]/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(0,122,255,0.2)]">
                <Mail size={28} className="text-[#007AFF]" />
              </div>
              <h2 className="text-xl font-bold text-[#F4F4F5] mb-2" style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}>
                Check your inbox
              </h2>
              <p className="text-[#A1A1AA] text-xs mb-2 leading-relaxed">
                We sent a secure link to <strong className="text-[#F4F4F5]">{email}</strong>.
              </p>
              <p className="text-[#52525B] text-[11px] mb-6 leading-relaxed">
                Click the link in your email to access your dashboard instantly.
                The link expires in 60 minutes.
              </p>
              <button
                onClick={() => setMagicSent(false)}
                className="text-xs text-[#007AFF] hover:underline active:opacity-70 font-semibold transition-opacity outline-none"
              >
                ← Use a different login method
              </button>
            </div>
          )}
        </div>

        {/* Back link */}
        <p className="text-center text-[#52525B] text-xs mt-6">
          <Link to="/" className="hover:text-[#A1A1AA] transition-colors">← Back to home</Link>
        </p>
      </div>

      {/* ── OAuth Provider Setup Guidance Modal ────────────────────── */}
      {oauthModalProvider && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111113] border border-[#27272A] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {label(oauthModalProvider)} Sign-In Setup Pending
                  </h3>
                  <p className="text-xs text-[#A1A1AA]">Supabase Provider Configuration</p>
                </div>
              </div>
              <button
                onClick={() => setOauthModalProvider(null)}
                className="text-[#71717A] hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Third-party OAuth for <strong className="text-white">{label(oauthModalProvider)}</strong> has not yet been configured with Client ID & Secret credentials in this project's Supabase dashboard.
            </p>

            {/* Quick Action Options */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setOauthModalProvider(null)
                  handleDemoLogin()
                }}
                className="w-full p-3 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-semibold flex items-center justify-between transition-all shadow-md"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-yellow-300" />
                  <span>Launch Instant Demo (Zero Setup Required)</span>
                </div>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setOauthModalProvider(null)
                  setAuthMode('password')
                }}
                className="w-full p-3 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs font-semibold text-zinc-200 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-indigo-400" />
                  <span>Sign In with Email & Password (Active)</span>
                </div>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Developer Setup Instructions Accordion */}
            <div className="pt-2 border-t border-[#27272A]">
              <button
                type="button"
                onClick={() => setShowDevSetup(!showDevSetup)}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors"
              >
                <span>{showDevSetup ? '▼ Hide' : '▶ Show'} Supabase Provider Setup Steps</span>
              </button>

              {showDevSetup && (
                <div className="mt-3 p-3.5 rounded-xl bg-[#18181B] border border-[#27272A] text-[11px] font-mono text-zinc-300 space-y-2">
                  <p className="text-[#007AFF] font-bold">To activate {label(oauthModalProvider)} in Supabase:</p>
                  <ol className="list-decimal list-inside space-y-1.5 text-[#A1A1AA]">
                    <li>Go to <strong className="text-zinc-200">Supabase Dashboard &gt; Auth &gt; Providers</strong>.</li>
                    <li>Toggle <strong className="text-zinc-200">{label(oauthModalProvider)}</strong> to Enabled.</li>
                    <li>Enter your OAuth <strong className="text-zinc-200">Client ID</strong> and <strong className="text-zinc-200">Client Secret</strong>.</li>
                    <li>Set Redirect Callback URL to:</li>
                  </ol>
                  <div className="p-2 rounded bg-black/50 border border-zinc-800 text-[10px] break-all text-amber-300">
                    https://ianfedrnvinptcnjnxgq.supabase.co/auth/v1/callback
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
