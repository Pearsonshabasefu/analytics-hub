import { useEffect, useState } from 'react'
import { ShieldAlert, LogOut, RefreshCw } from 'lucide-react'

export default function SessionWarningModal({ secondsLeft, onStayIn, onSignOut }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (secondsLeft !== null && secondsLeft > 0) setVisible(true)
    if (secondsLeft === null) setVisible(false)
  }, [secondsLeft])

  if (!visible) return null

  const mins    = Math.floor(secondsLeft / 60)
  const secs    = secondsLeft % 60
  const timeStr = mins > 0
    ? `${mins}m ${secs.toString().padStart(2, '0')}s`
    : `${secondsLeft}s`
  const urgent  = secondsLeft <= 60

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-sm rounded-2xl border p-6 shadow-2xl"
        style={{
          background: '#111113',
          borderColor: urgent ? 'rgba(239,68,68,0.5)' : 'rgba(251,191,36,0.4)',
          boxShadow: urgent ? '0 0 48px rgba(239,68,68,0.2)' : '0 0 48px rgba(251,191,36,0.12)',
        }}>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: urgent ? 'rgba(239,68,68,0.12)' : 'rgba(251,191,36,0.1)' }}>
            <ShieldAlert size={20} color={urgent ? '#EF4444' : '#FBBF24'} />
          </div>
          <div>
            <h3 className="font-headline font-bold text-base text-white leading-tight">
              Session Expiring Soon
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#71717A' }}>
              RefineIQ will sign you out for security.
            </p>
          </div>
        </div>

        {/* Countdown */}
        <div className="rounded-xl p-4 mb-5 text-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-xs font-mono mb-1" style={{ color: '#71717A' }}>Auto sign-out in</p>
          <p className="font-headline text-3xl font-extrabold tabular-nums"
            style={{ color: urgent ? '#EF4444' : '#FBBF24', letterSpacing: '-0.03em' }}>
            {timeStr}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          <button onClick={onStayIn}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
            style={{ background: '#007AFF', boxShadow: '0 0 18px rgba(0,122,255,0.35)' }}>
            <RefreshCw size={15} />
            Stay Logged In
          </button>
          <button onClick={onSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all active:scale-95"
            style={{ color: '#71717A', border: '1px solid rgba(255,255,255,0.08)' }}>
            <LogOut size={14} />
            Sign Out Now
          </button>
        </div>

        <p className="text-center text-xs mt-3" style={{ color: '#3F3F46' }}>
          Any activity in the app resets this timer automatically.
        </p>
      </div>
    </div>
  )
}
