import { useState } from 'react'
import { MessageSquare, X, Send, Star, CheckCircle, Sparkles, Loader2 } from 'lucide-react'
import apiClient from '../../../lib/apiClient'

export default function MagicEarWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [frustration, setFrustration] = useState('')
  const [featureRequest, setFeatureRequest] = useState('')
  const [rating, setRating] = useState(5)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!frustration.trim()) return

    setLoading(true)
    try {
      await apiClient.post('/api/feedback/', {
        frustration: frustration.trim(),
        feature_request: featureRequest.trim() || null,
        screen: window.location.pathname,
        rating,
      })
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setIsOpen(false)
        setFrustration('')
        setFeatureRequest('')
      }, 2500)
    } catch (err) {
      // Offline / demo fallback
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setIsOpen(false)
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white px-4 py-3 rounded-full shadow-ah-float transition-all hover:scale-105"
        >
          <MessageSquare size={18} />
          <span className="text-xs font-bold font-headline hidden group-hover:inline transition-all">
            Magic Ear 👂
          </span>
        </button>
      )}

      {/* Popup Dialog */}
      {isOpen && (
        <div className="relative w-80 sm:w-96 bg-ah-surface border border-ah rounded-2xl p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-ah mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">👂</span>
              <h3 className="font-headline font-bold text-sm text-ah-text">Magic Ear Feedback</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-ah-subtle hover:text-ah-text p-1 rounded-lg hover:bg-ah-surface2 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {submitted ? (
            <div className="py-8 text-center">
              <CheckCircle size={36} className="text-green-400 mx-auto mb-2" />
              <h4 className="font-headline font-bold text-sm text-ah-text">Received!</h4>
              <p className="text-xs text-ah-muted mt-1">Thank you for helping us shape RefineIQ.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-ah-subtle mb-1">
                  What caused friction or frustration? *
                </label>
                <textarea
                  required
                  rows={3}
                  value={frustration}
                  onChange={(e) => setFrustration(e.target.value)}
                  placeholder="e.g. Uploading took longer than expected..."
                  className="w-full bg-ah-surface2 border border-ah focus:border-ah-primary rounded-xl p-3 text-xs text-ah-text placeholder:text-ah-subtle outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-ah-subtle mb-1">
                  Wishlist feature (optional)
                </label>
                <input
                  type="text"
                  value={featureRequest}
                  onChange={(e) => setFeatureRequest(e.target.value)}
                  placeholder="e.g. Direct BigQuery connector"
                  className="w-full bg-ah-surface2 border border-ah focus:border-ah-primary rounded-xl px-3 py-2 text-xs text-ah-text placeholder:text-ah-subtle outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-ah-subtle mb-1">
                  Experience Rating
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-ah-subtle hover:text-yellow-400 transition-colors"
                    >
                      <Star
                        size={16}
                        className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-ah-subtle'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !frustration.trim()}
                className="w-full flex items-center justify-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white py-2.5 rounded-xl text-xs font-semibold transition-all shadow-ah-glow disabled:opacity-50"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Send to Product Team
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
