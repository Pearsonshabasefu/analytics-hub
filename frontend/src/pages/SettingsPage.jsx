import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Moon, Sun, CreditCard, Shield, Key,
  ChevronLeft, Check, Sparkles, ExternalLink, Zap, CheckCircle2,
  Receipt, FileText, Download
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { useFlutterwaveCheckout } from '../hooks/useFlutterwaveCheckout'
import PaymentReceiptModal from '../components/common/PaymentReceiptModal'

// ── Per-package top-up button (hook must be called at component level) ────────
function TopUpButton({ pkg, onSuccess }) {
  const [loading, setLoading] = useState(false)

  const openCheckout = useFlutterwaveCheckout(
    { id: pkg.id, label: pkg.label, ocus: pkg.ocus, amount: parseFloat(pkg.price.replace('$', '')) },
    (data) => { setLoading(false); onSuccess?.(pkg, data) },
    () => setLoading(false)
  )

  return (
    <button
      onClick={() => { setLoading(true); openCheckout() }}
      disabled={loading}
      className="w-full py-2 rounded-xl bg-ah-surface2 hover:bg-ah-primary hover:text-white border border-ah hover:border-ah-primary text-xs font-semibold transition-all mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? 'Opening checkout…' : 'Top-Up Now'}
    </button>
  )
}
// ─────────────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

  const [activeTab, setActiveTab]         = useState('billing')
  const [ocuBalance, setOcuBalance]       = useState(50)
  const [autoTopUp, setAutoTopUp]         = useState(false)
  const [maxModelSpend, setMaxModelSpend] = useState(20)
  const [successMsg, setSuccessMsg]       = useState(null)
  const [activeReceipt, setActiveReceipt] = useState(null)

  const [transactions, setTransactions]   = useState(() => {
    try {
      const saved = localStorage.getItem('refineiq_billing_txs')
      if (saved) return JSON.parse(saved)
    } catch (_) {}
    return [
      {
        tx_ref: 'RIQ-INIT-FREE-TIER',
        transaction_id: 'FLW-ONBOARDING',
        amount: 0.00,
        currency: 'USD',
        ocus: 50,
        packageLabel: 'Free Starter Allocation',
        date: new Date().toLocaleDateString(),
        customerEmail: user?.email || 'customer@refineiq.ai',
        customerName: user?.user_metadata?.full_name || 'RefineIQ Member',
        paymentMethod: 'Platform Onboarding Grant',
        status: 'successful'
      }
    ]
  })

  useEffect(() => {
    try {
      localStorage.setItem('refineiq_billing_txs', JSON.stringify(transactions))
    } catch (_) {}
  }, [transactions])

  const packages = [
    { id: 'starter',  ocus: 50,  price: '$5',  label: 'Starter Pack',  popular: false },
    { id: 'standard', ocus: 150, price: '$12', label: 'Standard Pack', popular: true  },
    { id: 'pro',      ocus: 500, price: '$35', label: 'Pro Scale',     popular: false },
  ]

  const handlePaymentSuccess = (pkg, data) => {
    setOcuBalance(prev => prev + pkg.ocus)
    setSuccessMsg(`Payment successful! ${pkg.ocus} OCUs added to your balance.`)
    setTimeout(() => setSuccessMsg(null), 6000)

    const receiptObj = {
      tx_ref: data?.tx_ref || `RIQ-TX-${Date.now()}`,
      transaction_id: data?.transaction_id || `FLW-${Math.floor(100000000 + Math.random() * 900000000)}`,
      amount: parseFloat(pkg.price.replace('$', '')),
      currency: data?.currency || 'USD',
      ocus: pkg.ocus,
      packageLabel: pkg.label,
      date: new Date().toLocaleString(),
      customerEmail: user?.email || 'customer@refineiq.ai',
      customerName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'RefineIQ Member',
      paymentMethod: data?.payment_type ? `Flutterwave (${data.payment_type.toUpperCase()})` : 'Flutterwave Checkout',
      status: 'successful'
    }

    setTransactions(prev => [receiptObj, ...prev])
    setActiveReceipt(receiptObj)
  }


  return (
    <div className="min-h-screen bg-ah-bg text-ah-text">
      {/* Top Navbar */}
      <header className="glass border-b border-ah px-6 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-ah-muted hover:text-ah-text flex items-center gap-1.5 text-sm transition-colors"
          >
            <ChevronLeft size={16} /> Dashboard
          </button>
          <div className="h-4 w-px bg-ah-border" />
          <h2 className="font-headline font-bold text-sm">Settings & Workspace Control</h2>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="space-y-1">
            {[
              { id: 'billing', label: 'Billing & OCUs', icon: CreditCard },
              { id: 'profile', label: 'Account Profile', icon: User },
              { id: 'appearance', label: 'Appearance & Theme', icon: Moon },
              { id: 'privacy', label: 'Privacy Shield', icon: Shield },
              { id: 'api', label: 'API Keys', icon: Key },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left ${
                    activeTab === tab.id
                      ? 'bg-ah-primary text-white shadow-ah-glow'
                      : 'text-ah-muted hover:bg-ah-surface hover:text-ah-text'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content Panel */}
          <div className="md:col-span-3">
            {/* BILLING TAB */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                {/* Balance Card */}
                <div className="bg-ah-surface border border-ah rounded-2xl p-6 shadow-ah-card">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-mono uppercase text-ah-subtle">Current OCU Balance</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-headline text-4xl font-extrabold text-ah-primary font-mono">
                          {ocuBalance}
                        </span>
                        <span className="text-xs text-ah-muted">Operations Compute Units</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1.5 rounded-xl text-xs font-mono">
                      <span>Gateway: Flutterwave</span>
                    </div>
                  </div>
                </div>

                {/* Success Toast */}
                {successMsg && (
                  <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm font-semibold animate-pulse">
                    <CheckCircle2 size={16} />
                    {successMsg}
                  </div>
                )}

                {/* Top-up Packages */}
                <div>
                  <h3 className="font-headline font-bold text-base mb-3">Top-Up OCUs via Flutterwave</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`bg-ah-surface border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                          pkg.popular ? 'border-ah-primary shadow-ah-glow' : 'border-ah'
                        }`}
                      >
                        <div>
                          {pkg.popular && (
                            <span className="text-[10px] font-mono uppercase bg-ah-primary/20 text-ah-primary px-2 py-0.5 rounded-full font-bold">
                              Most Popular
                            </span>
                          )}
                          <h4 className="font-headline font-bold text-sm mt-2">{pkg.label}</h4>
                          <div className="flex items-baseline gap-1 my-3">
                            <span className="text-2xl font-bold font-headline">{pkg.price}</span>
                            <span className="text-xs text-ah-subtle font-mono">/ {pkg.ocus} OCUs</span>
                          </div>
                        </div>

                        <TopUpButton pkg={pkg} onSuccess={handlePaymentSuccess} />
                      </div>
                    ))}
                  </div>
                </div>


                {/* Spend Guardrails */}
                <div className="bg-ah-surface border border-ah rounded-2xl p-6 shadow-ah-card space-y-4">
                  <h3 className="font-headline font-bold text-base">Cost Guardrails</h3>
                  <div className="flex items-center justify-between py-2 border-b border-ah">
                    <div>
                      <p className="text-xs font-semibold text-ah-text">Auto Top-Up</p>
                      <p className="text-[11px] text-ah-muted">Automatically add 50 OCUs when balance drops below 10</p>
                    </div>
                    <button
                      onClick={() => setAutoTopUp(!autoTopUp)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        autoTopUp ? 'bg-ah-primary' : 'bg-ah-surface3'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                          autoTopUp ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="py-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-ah-text">Max Spend Per Model Run</p>
                      <span className="text-xs font-mono text-ah-primary font-bold">{maxModelSpend} OCUs</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={maxModelSpend}
                      onChange={(e) => setMaxModelSpend(Number(e.target.value))}
                      className="w-full h-2 bg-ah-surface3 rounded-lg appearance-none cursor-pointer accent-ah-primary"
                    />
                  </div>
                </div>

                {/* Transaction & Receipt History */}
                <div className="bg-ah-surface border border-ah rounded-2xl p-6 shadow-ah-card space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-headline font-bold text-base">Invoices & Payment Receipts</h3>
                      <p className="text-xs text-ah-muted">View or print receipts for your compute top-ups and subscription payments.</p>
                    </div>
                    <Receipt size={20} className="text-ah-muted" />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-ah text-ah-muted font-mono uppercase text-[10px] text-left">
                          <th className="py-2.5">Date</th>
                          <th className="py-2.5">Package</th>
                          <th className="py-2.5 text-center">Compute</th>
                          <th className="py-2.5 text-right">Amount</th>
                          <th className="py-2.5 text-right">Invoice</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ah/60 font-mono">
                        {transactions.map((tx, idx) => (
                          <tr key={idx} className="hover:bg-ah-surface2/50 transition-colors">
                            <td className="py-3 text-ah-muted text-[11px] whitespace-nowrap">{tx.date}</td>
                            <td className="py-3 text-ah-text font-sans font-medium">{tx.packageLabel}</td>
                            <td className="py-3 text-center text-cyan-400 font-bold">+{tx.ocus} OCUs</td>
                            <td className="py-3 text-right text-ah-text font-bold">
                              ${parseFloat(tx.amount).toFixed(2)} {tx.currency}
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => setActiveReceipt(tx)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-ah-surface3 hover:bg-ah-primary hover:text-white text-ah-text text-[11px] font-sans font-semibold transition-all shadow-sm"
                              >
                                <FileText size={12} />
                                View Receipt
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === 'appearance' && (
              <div className="bg-ah-surface border border-ah rounded-2xl p-6 shadow-ah-card space-y-5">
                <h3 className="font-headline font-bold text-base">Interface Theme</h3>
                <p className="text-xs text-ah-muted">RefineIQ supports Dark Mode by default to reduce visual fatigue, with Light Mode available.</p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={() => theme !== 'dark' && toggleTheme()}
                    className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      theme === 'dark' ? 'border-ah-primary bg-ah-primary/10' : 'border-ah bg-ah-surface2'
                    }`}
                  >
                    <Moon size={20} className="text-ah-primary" />
                    <div>
                      <p className="font-headline font-bold text-sm text-ah-text">Dark Canvas (Default)</p>
                      <p className="text-[11px] text-ah-subtle">Deep black `#0A0A0B`</p>
                    </div>
                  </button>

                  <button
                    onClick={() => theme !== 'light' && toggleTheme()}
                    className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      theme === 'light' ? 'border-ah-primary bg-ah-primary/10' : 'border-ah bg-ah-surface2'
                    }`}
                  >
                    <Sun size={20} className="text-yellow-400" />
                    <div>
                      <p className="font-headline font-bold text-sm text-ah-text">Light Mode</p>
                      <p className="text-[11px] text-ah-subtle">Clean daylight `#F8F9FB`</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-ah-surface border border-ah rounded-2xl p-6 shadow-ah-card space-y-4">
                <h3 className="font-headline font-bold text-base">Account Information</h3>
                <div>
                  <label className="block text-xs font-mono uppercase text-ah-subtle mb-1">Email</label>
                  <input
                    type="text"
                    disabled
                    value={user?.email || 'user@example.com'}
                    className="w-full bg-ah-surface2 border border-ah rounded-xl px-4 py-2.5 text-xs text-ah-muted font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-ah-subtle mb-1">User ID</label>
                  <input
                    type="text"
                    disabled
                    value={user?.id || 'usr_dev_demo_account'}
                    className="w-full bg-ah-surface2 border border-ah rounded-xl px-4 py-2.5 text-xs text-ah-subtle font-mono"
                  />
                </div>
              </div>
            )}

            {/* PRIVACY TAB */}
            {activeTab === 'privacy' && (
              <div className="bg-ah-surface border border-ah rounded-2xl p-6 shadow-ah-card space-y-4">
                <div className="flex items-center gap-2 text-purple-400">
                  <Shield size={20} />
                  <h3 className="font-headline font-bold text-base text-ah-text">Privacy Shield Policy</h3>
                </div>
                <p className="text-xs text-ah-muted leading-relaxed">
                  RefineIQ runs a strict privacy architecture. Microsoft Presidio inspects ingested data locally before it leaves your workspace. PII tokens are salted and hashed.
                </p>
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                  ✓ Presidio Analyzer engine active<br />
                  ✓ Gemini metadata-only guardrails enforced<br />
                  ✓ Zero persistent raw data sent to third-party LLMs
                </div>
              </div>
            )}

            {/* API KEYS TAB */}
            {activeTab === 'api' && (
              <div className="bg-ah-surface border border-ah rounded-2xl p-6 shadow-ah-card space-y-4">
                <h3 className="font-headline font-bold text-base">Developer API Access</h3>
                <p className="text-xs text-ah-muted">Use API keys to trigger AutoML pipelines and inference calls programmatically.</p>
                <div className="flex items-center gap-2 font-mono text-xs bg-ah-surface2 border border-ah rounded-xl px-4 py-3">
                  <span className="flex-1 text-ah-muted">ah_live_9b4e82f1c0d57a3e8</span>
                  <span className="text-[10px] bg-green-500/15 text-green-400 px-2 py-0.5 rounded">Active</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Confirmation & Tax Receipt Modal */}
      <PaymentReceiptModal
        receipt={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  )
}

