import React, { useRef } from 'react'
import { CheckCircle2, Download, Printer, X, ShieldCheck, Zap } from 'lucide-react'
import Logo from './Logo'

/**
 * PaymentReceiptModal
 * Shows a professional, printable invoice/receipt upon payment confirmation.
 */
export default function PaymentReceiptModal({ receipt, onClose }) {
  const printRef = useRef(null)

  if (!receipt) return null

  const handlePrint = () => {
    window.print()
  }

  const {
    tx_ref = `RIQ-TX-${Date.now()}`,
    transaction_id = 'FLW-' + Math.floor(100000000 + Math.random() * 900000000),
    amount = 5.0,
    currency = 'USD',
    ocus = 50,
    packageLabel = 'Starter Pack',
    date = new Date().toLocaleString(),
    customerEmail = 'customer@refineiq.ai',
    customerName = 'Valued Customer',
    paymentMethod = 'Credit / Debit Card or Mobile Money',
  } = receipt

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      {/* Print-specific style overrides */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible !important;
          }
          #printable-receipt {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: #ffffff !important;
            color: #111111 !important;
            padding: 40px !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-lg bg-[#111113] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top bar modal control */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-[#27272A] bg-[#161618]">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <CheckCircle2 size={15} />
            <span>PAYMENT VERIFIED & CONFIRMED</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Receipt Container */}
        <div id="printable-receipt" ref={printRef} className="p-8 space-y-6 text-zinc-200">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-zinc-800 pb-6">
            <div>
              <Logo size="default" />
              <p className="text-xs text-zinc-500 mt-2 font-mono">RefineIQ Platform Inc.</p>
              <p className="text-[11px] text-zinc-600 font-mono">billing@refineiq.ai • Lusaka & Global</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PAID IN FULL
              </span>
              <p className="text-xs text-zinc-400 mt-2 font-mono">Invoice Date</p>
              <p className="text-xs font-medium text-zinc-200">{date}</p>
            </div>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80">
            <div>
              <p className="text-zinc-500 font-mono uppercase text-[10px]">Billed To</p>
              <p className="font-semibold text-zinc-200 mt-0.5 truncate">{customerName}</p>
              <p className="text-zinc-400 font-mono text-[11px] truncate">{customerEmail}</p>
            </div>
            <div>
              <p className="text-zinc-500 font-mono uppercase text-[10px]">Payment Method</p>
              <p className="font-semibold text-zinc-200 mt-0.5">{paymentMethod}</p>
              <p className="text-zinc-400 font-mono text-[11px] truncate">Ref: {tx_ref}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase text-left">
                  <th className="py-2 font-medium">Item / Description</th>
                  <th className="py-2 text-center font-medium">Credits</th>
                  <th className="py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                <tr>
                  <td className="py-3">
                    <p className="font-semibold text-zinc-100">{packageLabel}</p>
                    <p className="text-[11px] text-zinc-500 font-mono">Compute units for ML pipeline processing</p>
                  </td>
                  <td className="py-3 text-center font-mono font-semibold text-cyan-400">
                    +{ocus} OCUs
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-zinc-100">
                    ${parseFloat(amount).toFixed(2)} {currency}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Total Row */}
            <div className="border-t border-zinc-800 pt-4 flex justify-between items-baseline">
              <span className="text-xs font-mono uppercase text-zinc-400 font-bold">Total Paid</span>
              <span className="font-headline text-2xl font-extrabold text-white font-mono">
                ${parseFloat(amount).toFixed(2)} <span className="text-xs text-zinc-400">{currency}</span>
              </span>
            </div>
          </div>

          {/* OCU Credit Guarantee Note */}
          <div className="flex items-center gap-3 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-300 text-xs">
            <Zap size={16} className="flex-shrink-0 text-cyan-400" />
            <p>
              <strong className="text-white">Account Credited:</strong> {ocus} OCUs have been added to your balance and are ready for immediate use.
            </p>
          </div>

          {/* Footer Security / Guarantee */}
          <div className="border-t border-zinc-800 pt-4 flex items-center justify-between text-[11px] text-zinc-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Secured with 256-Bit SSL Encryption</span>
            </div>
            <span className="font-mono text-[10px]">ID: {transaction_id}</span>
          </div>

        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="no-print p-6 pt-0 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all border border-zinc-700"
          >
            <Printer size={15} />
            Print or Save PDF
          </button>

          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#007AFF] hover:bg-[#0066D6] text-white text-xs font-semibold transition-all shadow-[0_0_18px_rgba(0,122,255,0.35)]"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  )
}
