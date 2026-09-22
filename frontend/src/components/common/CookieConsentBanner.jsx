import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Cookie, Settings, Check, X } from 'lucide-react'

const STORAGE_KEY = 'refineiq_cookie_consent'

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [consent, setConsent] = useState({
    essential: true,
    analytics: false,
    functional: false,
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) {
        // Show banner after brief delay
        const timer = setTimeout(() => setIsVisible(true), 800)
        return () => clearTimeout(timer)
      } else {
        const parsed = JSON.parse(saved)
        setConsent(parsed)
      }
    } catch (_) {
      setIsVisible(true)
    }

    // Allow re-opening preferences from footer link
    const handleReopen = () => {
      setShowPreferences(true)
      setIsVisible(true)
    }
    window.addEventListener('refineiq-open-cookie-preferences', handleReopen)
    return () => window.removeEventListener('refineiq-open-cookie-preferences', handleReopen)
  }, [])

  const saveConsent = (updatedConsent) => {
    try {
      const payload = {
        ...updatedConsent,
        essential: true, // always required
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      setConsent(payload)
      setIsVisible(false)
      setShowPreferences(false)
    } catch (_) {
      setIsVisible(false)
    }
  }

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, functional: true })
  }

  const handleRejectNonEssential = () => {
    saveConsent({ essential: true, analytics: false, functional: false })
  }

  const handleSaveCustom = () => {
    saveConsent(consent)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-[#F4F4F5] space-y-4">
        {/* Banner Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007AFF]/15 text-[#007AFF] flex items-center justify-center shrink-0 border border-[#007AFF]/30">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-white">Privacy & Cookie Choices</h4>
              <p className="text-[11px] text-[#A1A1AA]">GDPR, CCPA & ZDPA 2021 Compliant</p>
            </div>
          </div>
          <button
            onClick={handleRejectNonEssential}
            className="text-zinc-500 hover:text-zinc-300 p-1 transition-colors"
            title="Close banner (Reject non-essential)"
          >
            <X size={15} />
          </button>
        </div>

        {/* Banner Body */}
        {!showPreferences ? (
          <>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              We use strictly necessary cookies to ensure secure session authentication, prevent CSRF, and enforce role-based access. With your consent, we also use privacy-first analytics to monitor reliability. Your data is never sold or used to train external models.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-[#A1A1AA] pt-1">
              <Link to="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms" className="underline hover:text-white transition-colors">Terms</Link>
              <span>•</span>
              <Link to="/dpa" className="underline hover:text-white transition-colors">DPA</Link>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 py-2 px-3 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-semibold shadow-sm transition-all text-center"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all text-center border border-zinc-700"
              >
                Essential Only
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-800"
                title="Customize cookie preferences"
              >
                <Settings size={15} />
              </button>
            </div>
          </>
        ) : (
          /* Granular Preferences Center */
          <div className="space-y-3 pt-1">
            <div className="space-y-2 text-xs">
              {/* Essential */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <div>
                  <span className="font-semibold text-white block">Strictly Necessary</span>
                  <span className="text-[10px] text-zinc-400 block">Session auth, anti-tamper nonces, CSRF protection.</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  Always Active
                </span>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <div>
                  <span className="font-semibold text-white block">Performance & Telemetry</span>
                  <span className="text-[10px] text-zinc-400 block">API latency metrics and error telemetry.</span>
                </div>
                <input
                  type="checkbox"
                  checked={consent.analytics}
                  onChange={(e) => setConsent((prev) => ({ ...prev, analytics: e.target.checked }))}
                  className="w-4 h-4 accent-[#007AFF] rounded cursor-pointer"
                />
              </div>

              {/* Functional */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <div>
                  <span className="font-semibold text-white block">Preferences & Features</span>
                  <span className="text-[10px] text-zinc-400 block">Dark mode theme state and local project caches.</span>
                </div>
                <input
                  type="checkbox"
                  checked={consent.functional}
                  onChange={(e) => setConsent((prev) => ({ ...prev, functional: e.target.checked }))}
                  className="w-4 h-4 accent-[#007AFF] rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveCustom}
                className="flex-1 py-2 px-3 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-semibold transition-all text-center"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-all text-center border border-zinc-700"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
