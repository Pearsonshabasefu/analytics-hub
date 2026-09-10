import { useState } from 'react'
import { X, Sparkles, Loader2 } from 'lucide-react'

const TEMPLATES = [
  { id: null,                emoji: '⚡', label: 'Blank Project' },
  { id: 'churn_prediction',  emoji: '🔮', label: 'Churn Prediction' },
  { id: 'sales_forecasting', emoji: '📈', label: 'Sales Forecasting' },
]

export default function NamingModal({ onConfirm, onClose, loading }) {
  const [name, setName] = useState('')
  const [template, setTemplate] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onConfirm({ name: name.trim(), template })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-ah-surface border border-ah rounded-2xl p-6 shadow-ah-float z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-ah-primary" />
            <h2 className="font-headline text-lg font-bold">Name Your Project</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-ah-surface2 flex items-center justify-center text-ah-muted hover:text-ah-text transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name input */}
          <div>
            <label className="block text-ah-muted text-xs font-mono uppercase tracking-wider mb-2">
              Project name
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q4 Customer Churn Analysis"
              maxLength={60}
              className="w-full bg-ah-surface2 border border-ah focus:border-ah-primary rounded-xl px-4 py-3 text-ah-text placeholder:text-ah-subtle outline-none transition-colors text-sm"
            />
            <p className="text-ah-subtle text-xs mt-1 text-right">{name.length}/60</p>
          </div>

          {/* Template picker */}
          <div>
            <label className="block text-ah-muted text-xs font-mono uppercase tracking-wider mb-2">
              Start from template (optional)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id ?? 'blank'}
                  type="button"
                  onClick={() => setTemplate(t.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    template === t.id
                      ? 'border-ah-primary bg-ah-primary-glow text-ah-primary'
                      : 'border-ah bg-ah-surface2 text-ah-muted hover:border-ah-primary'
                  }`}
                >
                  <div className="text-xl mb-1">{t.emoji}</div>
                  <div className="text-xs font-semibold leading-tight">{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-ah text-ah-muted hover:text-ah-text hover:border-ah-primary transition-all text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="flex-1 flex items-center justify-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 shadow-ah-glow"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
