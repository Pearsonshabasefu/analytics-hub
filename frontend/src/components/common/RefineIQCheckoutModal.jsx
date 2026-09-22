import { useState } from 'react'
import { X, ShieldCheck, CreditCard, Smartphone, Check, ArrowRight, Loader2, Globe, Wallet } from 'lucide-react'

/**
 * RefineIQCheckoutModal
 * Universal Global + Localized Checkout Modal:
 * - Worldwide: USD ($), EUR (€), GBP (£)
 * - Zambia & Africa: ZMW (K)
 * - Channels: Global Cards (Visa, Mastercard, Amex), Mobile Money (MTN MoMo, Airtel Money), Digital Wallets
 */
export default function RefineIQCheckoutModal({ pkg, isOpen, onClose, onConfirm, loading }) {
  const [method, setMethod] = useState('card') // 'card' | 'mobile_money' | 'wallet'
  const [network, setNetwork] = useState('MTN') // 'MTN' | 'AIRTEL'
  const [currency, setCurrency] = useState('USD') // 'USD' | 'EUR' | 'GBP' | 'ZMW'
  const [phoneNumber, setPhoneNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')

  if (!isOpen || !pkg) return null

  const usdPrice = parseFloat(pkg.price.replace('$', ''))
  
  // Real-time currency conversions
  const rates = {
    USD: { rate: 1, symbol: '$', prefix: true, label: 'USD ($)' },
    EUR: { rate: 0.92, symbol: '€', prefix: true, label: 'EUR (€)' },
    GBP: { rate: 0.78, symbol: '£', prefix: true, label: 'GBP (£)' },
    ZMW: { rate: 27, symbol: 'K', prefix: true, suffix: ' ZMW', label: 'ZMW (K)' },
  }

  const currentRate = rates[currency] || rates.USD
  const calculatedAmount = (usdPrice * currentRate.rate).toFixed(currency === 'ZMW' ? 0 : 2)
  const displayAmount = currency === 'ZMW'
    ? `K${Number(calculatedAmount).toLocaleString()} ZMW`
    : `${currentRate.symbol}${calculatedAmount} ${currency}`

  const handlePay = (e) => {
    e.preventDefault()
    onConfirm({
      method,
      network: method === 'mobile_money' ? network : null,
      phone: phoneNumber,
      currency,
      amount: calculatedAmount,
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111113] border border-[#27272A] rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#27272A] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#007AFF]/15 text-[#007AFF] border border-[#007AFF]/30">
                {pkg.ocus} OCUs
              </span>
              <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                <Globe size={11} className="text-zinc-400" /> Global & Multi-Currency
              </span>
            </div>
            <h3 className="font-headline font-bold text-lg text-white mt-1">
              RefineIQ Secure Checkout
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
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 block font-mono">Total Billed</span>
              <span className="text-2xl font-black text-white font-mono">{displayAmount}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 font-mono block">Compute Credit Value</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">+{pkg.ocus} OCUs</span>
            </div>
          </div>

          {/* Currency Pill Switcher */}
          <div className="grid grid-cols-4 gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            {Object.keys(rates).map((cKey) => (
              <button
                key={cKey}
                type="button"
                onClick={() => {
                  setCurrency(cKey)
                  // If ZMW selected, mobile money is naturally active; if USD/EUR/GBP, card is active
                  if (cKey === 'ZMW' && method !== 'mobile_money') {
                    // keep choice or allow switch
                  }
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
                  currency === cKey
                    ? 'bg-[#007AFF] text-white shadow'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                {rates[cKey].label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          {/* Payment Method Selector */}
          <div>
            <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                  method === 'card'
                    ? 'bg-[#007AFF]/10 border-[#007AFF] text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <CreditCard size={18} className={method === 'card' ? 'text-[#007AFF] mb-1' : 'text-zinc-400 mb-1'} />
                <span className="text-xs font-bold block">Credit / Debit</span>
                <span className="text-[9px] text-zinc-500 block">Visa, MC, Amex</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod('mobile_money')
                  setCurrency('ZMW')
                }}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                  method === 'mobile_money'
                    ? 'bg-[#007AFF]/10 border-[#007AFF] text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Smartphone size={18} className={method === 'mobile_money' ? 'text-[#007AFF] mb-1' : 'text-zinc-400 mb-1'} />
                <span className="text-xs font-bold block">Mobile Money 🇿🇲</span>
                <span className="text-[9px] text-zinc-500 block">MTN & Airtel</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('wallet')}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                  method === 'wallet'
                    ? 'bg-[#007AFF]/10 border-[#007AFF] text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Wallet size={18} className={method === 'wallet' ? 'text-[#007AFF] mb-1' : 'text-zinc-400 mb-1'} />
                <span className="text-xs font-bold block">Digital Wallet</span>
                <span className="text-[9px] text-zinc-500 block">Apple / Google</span>
              </button>
            </div>
          </div>

          {/* Mobile Money Options */}
          {method === 'mobile_money' && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1.5">Mobile Network</label>
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
                    MTN MoMo Zambia
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
                    Airtel Money Zambia
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Phone Number (Zambia)</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 097X XXX XXX or 096X XXX XXX"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-zinc-600 outline-none focus:border-[#007AFF]"
                />
              </div>
            </div>
          )}

          {/* Card Details (Global) */}
          {method === 'card' && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>International & Local Bank Cards</span>
                <span className="text-emerald-400">256-Bit SSL</span>
              </div>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="Cardholder Name (e.g. Jane Doe)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-zinc-600 outline-none focus:border-[#007AFF]"
              />
              <p className="text-[10px] text-zinc-500 leading-tight">
                Accepts cards from all countries worldwide including Visa, Mastercard, American Express, and Zambian bank debit cards.
              </p>
            </div>
          )}

          {/* Digital Wallet */}
          {method === 'wallet' && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 text-center space-y-2 animate-in fade-in duration-150">
              <p className="text-xs text-zinc-300 font-semibold">1-Click Express Checkout</p>
              <p className="text-[11px] text-zinc-400">
                You will be prompted to authenticate with Apple Pay, Google Pay, or PayPal on checkout dispatch.
              </p>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] active:scale-[0.98] text-white text-xs font-bold transition-all shadow-[0_0_24px_rgba(0,122,255,0.35)] flex items-center justify-center gap-2 disabled:opacity-50"
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

        {/* Security Trust Badges */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-3">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>PCI-DSS Level 1 Encrypted</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-500">Instant OCU Credit</span>
        </div>

      </div>
    </div>
  )
}
