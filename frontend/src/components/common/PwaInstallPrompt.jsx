import { useState, useEffect } from 'react'
import { Download, Monitor, Smartphone, X, Check, Sparkles, Share2, PlusSquare } from 'lucide-react'
import { usePwaInstall } from '../../hooks/usePwaInstall'

export default function PwaInstallPrompt() {
  const { isInstallable, isInstalled, isIos, hasDeferredPrompt, promptInstall } = usePwaInstall()
  const [isOpen, setIsOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    // If not running standalone and not dismissed, show toast after 3 seconds
    const wasDismissed = sessionStorage.getItem('refineiq_pwa_dismissed')
    if (!isInstalled && !wasDismissed) {
      const timer = setTimeout(() => {
        setShowToast(true)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [isInstalled])

  const handleInstallClick = async () => {
    if (hasDeferredPrompt) {
      await promptInstall()
      setShowToast(false)
      setIsOpen(false)
    } else {
      // Open guided modal for browsers where prompt isn't directly triggerable
      setIsOpen(true)
    }
  }

  const handleDismiss = () => {
    setShowToast(false)
    setDismissed(true)
    sessionStorage.setItem('refineiq_pwa_dismissed', 'true')
  }

  if (isInstalled) return null

  return (
    <>
      {/* ── 1. Floating Bottom-Left Install Toast ──────────────────── */}
      {showToast && !dismissed && (
        <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#111114]/95 backdrop-blur-xl border border-indigo-500/40 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] max-w-sm flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 shrink-0 shadow-md">
              <div className="w-full h-full bg-[#0A0A0B] rounded-[10px] flex items-center justify-center">
                <Monitor size={18} className="text-cyan-400" />
              </div>
            </div>

            <div className="flex-1 pr-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">Install RefineIQ</span>
                <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[9px]">APP</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                Run RefineIQ as a standalone desktop app — separate from browser tabs.
              </p>
              
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleInstallClick}
                  className="px-3 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Download size={13} />
                  <span>Install App</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white text-xs transition-colors"
                >
                  Later
                </button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="text-zinc-500 hover:text-white p-1 transition-colors"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── 2. Detailed Guided Install Modal ──────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Monitor size={16} />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-white">Install RefineIQ Desktop App</h3>
                  <p className="text-[11px] text-zinc-400">Launch directly from your taskbar or applications</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Feature list */}
            <div className="space-y-2.5 text-xs text-zinc-300 bg-white/[0.03] p-4 rounded-2xl border border-white/[0.05]">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span>Runs in an isolated, distraction-free desktop window</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span>Quick-launch from Windows Taskbar, macOS Dock, or Phone</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span>Instant loading with local service-worker caching</span>
              </div>
            </div>

            {/* Platform Instructions */}
            {hasDeferredPrompt ? (
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    await promptInstall()
                    setIsOpen(false)
                  }}
                  className="w-full py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all"
                >
                  <Download size={16} />
                  <span>Click to Install RefineIQ Now</span>
                </button>
              </div>
            ) : isIos ? (
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 space-y-2">
                <p className="font-semibold text-white">How to install on iOS / Safari:</p>
                <ol className="list-decimal list-inside space-y-1 text-zinc-300">
                  <li>Tap the <Share2 size={13} className="inline mx-1 text-indigo-400" /> <strong>Share</strong> button at the bottom of Safari.</li>
                  <li>Scroll down and tap <PlusSquare size={13} className="inline mx-1 text-indigo-400" /> <strong>Add to Home Screen</strong>.</li>
                  <li>Tap <strong>Add</strong> in the top right corner.</li>
                </ol>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 space-y-2">
                <p className="font-semibold text-white">How to install on Chrome / Edge desktop:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-zinc-300">
                  <li>Look at the right side of your browser URL address bar.</li>
                  <li>Click the <strong>Install icon</strong> (<Download size={12} className="inline mx-0.5 text-cyan-400" /> or desktop screen icon).</li>
                  <li>Click <strong>Install</strong> to add RefineIQ to your desktop apps.</li>
                </ol>
              </div>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
