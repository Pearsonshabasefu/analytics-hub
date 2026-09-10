import { useState } from 'react'
import { Shield, X, Check, Lock, AlertTriangle, Loader2 } from 'lucide-react'

export default function PIIMaskingModal({ isOpen, onClose, onApply, piiReport, isApplying }) {
  if (!isOpen) return null

  const detectedEntities = piiReport?.entities || [
    { type: 'EMAIL_ADDRESS', count: 142, column: 'customer_email', sample: 'j***@example.com' },
    { type: 'PHONE_NUMBER', count: 89, column: 'contact_number', sample: '+1 (555) ***-****' },
    { type: 'PERSON', count: 210, column: 'full_name', sample: 'J*** D***' },
  ]

  const [selectedTypes, setSelectedTypes] = useState(
    detectedEntities.map(e => e.type)
  )

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const handleApply = () => {
    onApply(selectedTypes)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-ah-surface border border-ah rounded-2xl p-6 shadow-ah-float animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-ah mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/15 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="font-headline font-bold text-lg text-ah-text">Privacy Shield — PII Masking</h2>
              <p className="text-ah-muted text-xs">Anonymize sensitive customer information before modeling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ah-subtle hover:text-ah-text p-1.5 rounded-lg hover:bg-ah-surface2 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Notice */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3.5 flex items-start gap-3 mb-5">
          <Lock size={16} className="text-purple-400 shrink-0 mt-0.5" />
          <p className="text-xs text-purple-200/90 leading-relaxed">
            Privacy Shield utilizes Microsoft Presidio to detect and hash identifiers. Sensitive values will never be passed into training sets or external LLMs.
          </p>
        </div>

        {/* Detected List */}
        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
          <p className="text-ah-subtle text-xs font-mono uppercase tracking-wider">Detected Sensitive Columns</p>
          {detectedEntities.map((entity) => {
            const isSelected = selectedTypes.includes(entity.type)
            return (
              <div
                key={entity.type}
                onClick={() => toggleType(entity.type)}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-purple-500/40 bg-purple-500/10'
                    : 'border-ah bg-ah-surface2 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      isSelected ? 'bg-purple-500 border-purple-400 text-white' : 'border-ah-border bg-ah-surface3'
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-ah-text">{entity.column}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                        {entity.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-ah-subtle mt-0.5">
                      Sample masked: <span className="font-mono text-ah-muted">{entity.sample}</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-ah-muted">{entity.count} values</span>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isApplying}
            className="flex-1 py-2.5 rounded-xl border border-ah hover:border-ah-border text-ah-muted hover:text-ah-text text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={isApplying || selectedTypes.length === 0}
            className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
          >
            {isApplying ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
            {isApplying ? 'Anonymizing...' : `Mask Selected (${selectedTypes.length})`}
          </button>
        </div>
      </div>
    </div>
  )
}
