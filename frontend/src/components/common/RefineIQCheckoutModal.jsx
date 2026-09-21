import { useState } from 'react'
import { X, ShieldCheck, CreditCard, Smartphone, Check, ArrowRight, Loader2 } from 'lucide-react'

/**
 * RefineIQCheckoutModal
 * Dedicated, professional checkout modal supporting:
 * - Zambia 🇿🇲 (ZMW / USD)
 * - Mobile Money: MTN Mobile Money & Airtel Money
 * - Cards: Visa & Mastercard
 */
export default function RefineIQCheckoutModal({ pkg, isOpen, onClose, onConfirm, loading }) {
  const [method, setMethod] = useState('card') // 'card' | 'mobile_money'
  const [network, setNetwork] = useState('MTN') // 'MTN' | 'AIRTEL'
  const [currency, setCurrency] = useState('USD') // 'USD' | 'ZMW'
  const [phoneNumber, setPhoneNumber] = useState('')

  if (!isOpen || !pkg) return null

  const usdPrice = parseFloat(pkg.price.replace('$', ''))
  const zmwRate = 27 // 1 USD ~ 27 ZMW
  const displayAmount = currency === 'USD' 
    ? `$${usdPrice.toFixed(2)}` 
    : `K${Math.round(usdPrice * zmwRate).toLocaleString()} ZMW`

  const handlePay = (e) => {
    e.preventDefault()
    onConfirm({
      method,
      network: method === 'mobile_money' ? network : null,
      phone: phoneNumber,
      currency,
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111113] border border-[#27272A] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#27272A] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#007AFF]/15 text-[#007AFF] border border-[#007AFF]/30">
                {pkg.ocus} OCUs
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">Zambia & Global</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-white mt-1">
              Top-Up Compute Credits
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Currency & Amount Display */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-zinc-400 block font-mono">Total Amount</span>
            <span className="text-2xl font-black text-white font-mono">{displayAmount}</span>
          </div>
          <div className="flex bg-zinc-800 p-1 rounded-xl border border-zinc-700">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                currency === 'USD' ? 'bg-[#007AFF] text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              USD ($)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('ZMW')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                currency === 'ZMW' ? 'bg-[#007AFF] text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              ZMW (K)
            </button>
          </div>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          {/* Payment Method Selector */}
          <div>
            <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  method === 'card'
                    ? 'bg-[#007AFF]/10 border-[#007AFF] text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <CreditCard size={18} className={method === 'card' ? 'text-[#007AFF]' : 'text-zinc-400'} />
                <div>
                  <span className="text-xs font-bold block">Credit / Debit Card</span>
                  <span className="text-[10px] text-zinc-500 block">Visa, Mastercard</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMethod('mobile_money')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  method === 'mobile_money'
                    ? 'bg-[#007AFF]/10 border-[#007AFF] text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Smartphone size={18} className={method === 'mobile_money' ? 'text-[#007AFF]' : 'text-zinc-400'} />
                <div>
                  <span className="text-xs font-bold block">Mobile Money 🇿🇲</span>
                  <span className="text-[10px] text-zinc-500 block">MTN & Airtel Zambia</span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Money Options */}
          {method === 'mobile_money' && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1.5">Network</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNetwork('MTN')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      network === 'MTN'
                        ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    MTN MoMo
                  </button>
                  <button
                    type="button"
                    onClick={() => setNetwork('AIRTEL')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      network === 'AIRTEL'
                        ? 'bg-red-500/20 border-red-500 text-red-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    Airtel Money
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="097X XXX XXX or 096X XXX XXX"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-zinc-600 outline-none focus:border-[#007AFF]"
                />
              </div>
            </div>
          )}

          {/* Security & Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] active:scale-[0.98] text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(0,122,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Processing Secure Payment…</span>
                </>
              ) : (
                <>
                  <span>Pay {displayAmount} & Credit {pkg.ocus} OCUs</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-3">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>PCI-DSS Compliant • Instant OCU Balance Update</span>
        </div>

      </div>
    </div>
  )
}
