import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'
import {
  Loader2, Mail, ArrowRight, Lock, Sparkles,
  AlertCircle, Eye, EyeOff, ChevronRight,
} from 'lucide-react'

// ── Social Brand Icons ──────────────────────────────────────────────
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
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8.93-2.85-.9.04-1.98.6-2.61 1.34-.56.64-.99 1.72-.86 2.74 1 .08 1.92-.48 2.54-1.23"/>
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

// ── Social Button ────────────────────────────────────────────────────
function SocialBtn({ icon, label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        flex items-center justify-center gap-2.5
        bg-[#18181B] hover:bg-[#1F1F23] active:bg-[#27272A] active:scale-95
        border border-[#27272A] hover:border-[#007AFF] focus:border-[#007AFF]
        text-[#F4F4F5] py-2.5 px-4 rounded-xl text-xs font-semibold
        transition-all duration-150 outline-none
        focus:ring-2 focus:ring-[#007AFF]/40
        disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
        shadow-sm hover:shadow-[0_0_12px_rgba(0,122,255,0.18)]
      "
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

// ── Main Component ───────────────────────────────────────────────────
export default function AuthPage() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()

  const [authMode, setAuthMode] = useState('password')
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const [error, setError] = useState('')
  const [providerError, setProviderError] = useState('')

  // Production URL for redirects
  const redirectBase = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://analytics-hub-l7jy.vercel.app'

  // OAuth Handler
  const handleOAuthLogin = async (provider) => {
    setLoading(true)
    setError('')
    setProviderError('')
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
          setProviderError(
            `${label(provider)} sign-in is not yet activated. Use Email + Password or the Instant Demo button below while we finish setup.`
          )
        } else {
          setError(error.message)
        }
      }
    } catch (err) {
      setError(err.message || 'OAuth failed.')
    } finally {
      setLoading(false)
    }
  }

  const label = (p) => ({ google: 'Google', github: 'GitHub', apple: 'Apple', azure: 'Microsoft' }[p] || p)

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

  // Demo Mode — sets a full demo user and navigates
  const handleDemoLogin = () => {
    setUser({
      id: 'demo-user-2026',
      email: 'demo.analyst@analyticshub.ai',
      user_metadata: { full_name: 'Demo Analyst' },
      isDemo: true,
    })
    navigate('/dashboard')
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
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-[#007AFF]/15 border border-[#007AFF]/30 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(0,122,255,0.2)]">
              📊
            </div>
            <span className="text-xl font-bold text-[#F4F4F5]" style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}>Analytics Hub</span>
          </Link>
          <p className="text-[#52525B] mt-1.5 text-xs font-mono">The Intelligence in Your Data, Unleashed</p>
        </div>

        {/* Card */}
        <div className="bg-[#111113] border border-[#27272A] rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          {!magicSent ? (
            <>
              {/* Title */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#F4F4F5]" style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}>
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h1>
                <p className="text-[#A1A1AA] text-xs mt-1">
                  {isSignUp ? 'Start with 50 free OCUs — no credit card needed' : 'Sign in to your models & pipelines'}
                </p>
              </div>

              {/* Provider Warning */}
              {providerError && (
                <div className="mb-5 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/25 text-xs text-yellow-200 flex items-start gap-2.5">
                  <AlertCircle size={15} className="text-yellow-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <p className="font-semibold text-yellow-300 mb-0.5">Provider not yet enabled</p>
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

              {/* Social Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <SocialBtn icon={<GoogleIcon />}    label="Google"    onClick={() => handleOAuthLogin('google')}    disabled={loading} />
                <SocialBtn icon={<GithubIcon />}    label="GitHub"    onClick={() => handleOAuthLogin('github')}    disabled={loading} />
                <SocialBtn icon={<AppleIcon />}     label="Apple"     onClick={() => handleOAuthLogin('apple')}     disabled={loading} />
                <SocialBtn icon={<MicrosoftIcon />} label="Microsoft" onClick={() => handleOAuthLogin('azure')}     disabled={loading} />
              </div>

              {/* Divider */}
              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#27272A]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#111113] px-3 text-[#52525B] text-[11px] font-mono uppercase tracking-wider">
                    or email credentials
                  </span>
                </div>
              </div>

              {/* Mode Toggle */}
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
                    {mode === 'password' ? 'Password' : 'Magic Link 🪄'}
                  </button>
                ))}
              </div>

              {/* Password Form */}
              {authMode === 'password' ? (
                <form onSubmit={handlePasswordAuth} className="space-y-4">
                  {/* Email */}
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
                    {loading ? 'Processing…' : isSignUp ? 'Create Free Account' : 'Sign In'}
                  </button>

                  <div className="text-center pt-0.5">
                    <button
                      type="button"
                      onClick={() => { setIsSignUp(!isSignUp); setError('') }}
                      className="text-xs text-[#A1A1AA] hover:text-[#F4F4F5] active:opacity-70 transition-colors outline-none focus:underline"
                    >
                      {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
                    </button>
                  </div>
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

              {/* Instant Demo */}
              <div className="mt-6 pt-5 border-t border-[#27272A]">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="
                    w-full py-2.5 px-4 rounded-xl
                    bg-[#18181B] hover:bg-[#1F1F23] active:bg-[#27272A] active:scale-[0.98]
                    border border-dashed border-[#3F3F46] hover:border-[#007AFF]
                    text-xs font-semibold text-[#A1A1AA] hover:text-[#F4F4F5]
                    flex items-center justify-center gap-2
                    transition-all duration-150 outline-none
                    focus:ring-2 focus:ring-[#007AFF]/30
                    hover:shadow-[0_0_12px_rgba(0,122,255,0.12)]
                  "
                >
                  <Sparkles size={13} className="text-yellow-400" />
                  <span>Instant Demo Access (No Sign-In Required)</span>
                  <ChevronRight size={13} />
                </button>
                <p className="text-center text-[#52525B] text-[10px] mt-2">
                  Explore with pre-loaded sample data. No account needed.
                </p>
              </div>

              {/* Terms */}
              <p className="text-[#52525B] text-[11px] text-center mt-5 leading-relaxed">
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
    </div>
  )
}
