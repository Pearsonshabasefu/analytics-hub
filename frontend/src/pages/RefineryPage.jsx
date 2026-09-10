import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Sparkles, Shield, AlertTriangle, ArrowRight, CheckCircle2,
  RefreshCw, Trash2, Sliders, ChevronLeft, Layers, Play
} from 'lucide-react'
import SplitViewPreview from '../components/features/refinery/SplitViewPreview'
import PIIMaskingModal from '../components/features/refinery/PIIMaskingModal'
import apiClient from '../lib/apiClient'

export default function RefineryPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  // State
  const [healthScore, setHealthScore] = useState(72)
  const [isPIIModalOpen, setIsPIIModalOpen] = useState(false)
  const [isApplyingFix, setIsApplyingFix] = useState(false)

  // Cleaning recipe history
  const [recipe, setRecipe] = useState([
    { id: 1, action: 'Auto-detect schema types', status: 'completed' },
  ])

  // Sample data representation
  const [columns] = useState([
    { name: 'customer_id', type: 'Categorical' },
    { name: 'age', type: 'Numerical' },
    { name: 'monthly_spend', type: 'Numerical' },
    { name: 'customer_email', type: 'Categorical' },
    { name: 'tenure_months', type: 'Numerical' },
    { name: 'churned', type: 'Boolean' },
  ])

  const [rawRows] = useState([
    { customer_id: 'CUST-1001', age: 34, monthly_spend: 89.5, customer_email: 'sarah.m@gmail.com', tenure_months: 12, churned: false },
    { customer_id: 'CUST-1002', age: null, monthly_spend: 120.0, customer_email: 'david.k@yahoo.com', tenure_months: 4, churned: true },
    { customer_id: 'CUST-1003', age: 45, monthly_spend: 45.2, customer_email: 'alex.b@corp.com', tenure_months: 28, churned: false },
    { customer_id: 'CUST-1004', age: 29, monthly_spend: null, customer_email: 'emily.r@tech.org', tenure_months: 8, churned: false },
    { customer_id: 'CUST-1005', age: 52, monthly_spend: 210.4, customer_email: 'marcus.v@provider.net', tenure_months: 48, churned: false },
    { customer_id: 'CUST-1005', age: 52, monthly_spend: 210.4, customer_email: 'marcus.v@provider.net', tenure_months: 48, churned: false }, // Duplicate
  ])

  const [cleanedRows, setCleanedRows] = useState([
    { customer_id: 'CUST-1001', age: 34, monthly_spend: 89.5, customer_email: 's***@gmail.com', tenure_months: 12, churned: false },
    { customer_id: 'CUST-1002', age: 38, monthly_spend: 120.0, customer_email: 'd***@yahoo.com', tenure_months: 4, churned: true },
    { customer_id: 'CUST-1003', age: 45, monthly_spend: 45.2, customer_email: 'a***@corp.com', tenure_months: 28, churned: false },
    { customer_id: 'CUST-1004', age: 29, monthly_spend: 92.4, customer_email: 'e***@tech.org', tenure_months: 8, churned: false },
    { customer_id: 'CUST-1005', age: 52, monthly_spend: 210.4, customer_email: 'm***@provider.net', tenure_months: 48, churned: false },
  ])

  // Actions
  const handleFixMissing = () => {
    setIsApplyingFix(true)
    setTimeout(() => {
      setHealthScore(prev => Math.min(100, prev + 12))
      setRecipe(prev => [...prev, { id: Date.now(), action: 'Impute missing values with column median', status: 'completed' }])
      setIsApplyingFix(false)
    }, 600)
  }

  const handleDropDuplicates = () => {
    setIsApplyingFix(true)
    setTimeout(() => {
      setHealthScore(prev => Math.min(100, prev + 8))
      setRecipe(prev => [...prev, { id: Date.now(), action: 'Removed 1 duplicate row', status: 'completed' }])
      setIsApplyingFix(false)
    }, 600)
  }

  const handleApplyPII = (maskedEntities) => {
    setIsApplyingFix(true)
    setTimeout(() => {
      setHealthScore(prev => Math.min(100, prev + 8))
      setRecipe(prev => [...prev, { id: Date.now(), action: `Privacy Shield: masked ${maskedEntities.length} PII fields`, status: 'completed' }])
      setIsApplyingFix(false)
      setIsPIIModalOpen(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-ah-bg text-ah-text">
      {/* Top Navbar */}
      <header className="glass border-b border-ah px-6 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/project/${projectId}/ingest`)}
            className="text-ah-muted hover:text-ah-text flex items-center gap-1.5 text-sm transition-colors"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <div className="h-4 w-px bg-ah-border" />
          <div className="flex items-center gap-2 text-sm text-ah-muted">
            <span>01 Connect</span>
            <ArrowRight size={12} />
            <span className="text-ah-primary font-semibold">02 Refinery (Clean)</span>
            <ArrowRight size={12} />
            <span>03 Model</span>
            <ArrowRight size={12} />
            <span>04 Deploy</span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/project/${projectId}/studio`)}
          className="flex items-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-ah-glow"
        >
          Proceed to Model Studio <ArrowRight size={16} />
        </button>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-ah-primary font-mono text-xs uppercase tracking-widest mb-1">Step 02 — Data Refinery</p>
            <h1 className="font-headline text-3xl font-bold">Autonomous Data Cleaning</h1>
            <p className="text-ah-muted text-sm mt-1">Audit, correct nulls, eliminate duplicates, and shield privacy with zero code.</p>
          </div>

          {/* Health Score Gauge */}
          <div className="bg-ah-surface border border-ah rounded-2xl px-6 py-4 flex items-center gap-5 shadow-ah-card">
            <div>
              <p className="text-[11px] font-mono uppercase text-ah-subtle tracking-wider mb-1">Health Score</p>
              <div className="flex items-baseline gap-1.5">
                <span className={`font-headline text-3xl font-extrabold ${healthScore >= 85 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {healthScore}
                </span>
                <span className="text-xs text-ah-subtle">/ 100</span>
              </div>
            </div>
            <div className="w-24 bg-ah-surface3 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${healthScore >= 85 ? 'bg-green-400' : 'bg-yellow-400'}`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Issue Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Missing Values */}
          <div className="bg-ah-surface border border-ah hover:border-yellow-500/40 rounded-2xl p-5 transition-all shadow-ah-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-yellow-400/90 font-semibold flex items-center gap-1.5">
                <AlertTriangle size={14} /> Missing Values
              </span>
              <span className="text-xs font-mono bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full">
                2 columns affected
              </span>
            </div>
            <p className="text-2xl font-headline font-bold mb-1">2 Nulls Detected</p>
            <p className="text-xs text-ah-muted mb-4">Columns: <span className="font-mono text-ah-text">age, monthly_spend</span></p>
            <button
              onClick={handleFixMissing}
              disabled={isApplyingFix}
              className="w-full py-2.5 rounded-xl bg-ah-surface2 hover:bg-ah-surface3 border border-ah text-xs font-semibold text-ah-text flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles size={14} className="text-ah-primary" />
              Impute with Median
            </button>
          </div>

          {/* Duplicates */}
          <div className="bg-ah-surface border border-ah hover:border-blue-500/40 rounded-2xl p-5 transition-all shadow-ah-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-blue-400 font-semibold flex items-center gap-1.5">
                <Layers size={14} /> Row Redundancy
              </span>
              <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">
                1 duplicate
              </span>
            </div>
            <p className="text-2xl font-headline font-bold mb-1">1 Duplicate Record</p>
            <p className="text-xs text-ah-muted mb-4">Exact identical rows detected across all features</p>
            <button
              onClick={handleDropDuplicates}
              disabled={isApplyingFix}
              className="w-full py-2.5 rounded-xl bg-ah-surface2 hover:bg-ah-surface3 border border-ah text-xs font-semibold text-ah-text flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 size={14} className="text-red-400" />
              Drop Duplicate Rows
            </button>
          </div>

          {/* Privacy Shield */}
          <div className="bg-ah-surface border border-ah hover:border-purple-500/40 rounded-2xl p-5 transition-all shadow-ah-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-purple-400 font-semibold flex items-center gap-1.5">
                <Shield size={14} /> Privacy Shield
              </span>
              <span className="text-xs font-mono bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full">
                PII Protected
              </span>
            </div>
            <p className="text-2xl font-headline font-bold mb-1">Emails & Names</p>
            <p className="text-xs text-ah-muted mb-4">Presidio automated anonymization ready</p>
            <button
              onClick={() => setIsPIIModalOpen(true)}
              disabled={isApplyingFix}
              className="w-full py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-xs font-semibold text-purple-300 flex items-center justify-center gap-2 transition-colors"
            >
              <Shield size={14} />
              Configure Privacy Shield
            </button>
          </div>
        </div>

        {/* Two Column Layout: Data Preview + Cleaning Pipeline Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Table Preview */}
          <div className="lg:col-span-3">
            <SplitViewPreview
              originalRows={rawRows}
              cleanedRows={cleanedRows}
              columns={columns}
            />
          </div>

          {/* Cleaning Pipeline Recipe */}
          <div className="bg-ah-surface border border-ah rounded-2xl p-5 shadow-ah-card h-fit">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-ah">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-ah-primary" />
                <h3 className="font-headline font-bold text-sm">Refinery Recipe</h3>
              </div>
              <span className="text-[11px] font-mono text-ah-subtle">{recipe.length} steps</span>
            </div>

            <div className="space-y-3">
              {recipe.map((step, idx) => (
                <div key={step.id} className="flex items-start gap-2.5 text-xs">
                  <CheckCircle2 size={14} className="text-green-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-ah-text font-medium leading-tight">{step.action}</p>
                    <span className="text-[10px] font-mono text-ah-subtle">Step {idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-ah">
              <button
                onClick={() => navigate(`/project/${projectId}/studio`)}
                className="w-full flex items-center justify-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white py-2.5 rounded-xl text-xs font-semibold transition-all shadow-ah-glow"
              >
                <Play size={14} /> Launch Model Studio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PII Masking Modal */}
      <PIIMaskingModal
        isOpen={isPIIModalOpen}
        onClose={() => setIsPIIModalOpen(false)}
        onApply={handleApplyPII}
        isApplying={isApplyingFix}
      />
    </div>
  )
}
