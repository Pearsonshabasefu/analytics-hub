import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Sparkles, Shield, AlertTriangle, ArrowRight, CheckCircle2,
  Trash2, Sliders, ChevronLeft, Layers, Play,
  Download, Info, FileText, HelpCircle
} from 'lucide-react'
import SplitViewPreview from '../components/features/refinery/SplitViewPreview'
import PIIMaskingModal from '../components/features/refinery/PIIMaskingModal'
import apiClient from '../lib/apiClient'

// ── Tooltip helper ──────────────────────────────────────────
function Tooltip({ text, children }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 rounded-lg bg-ah-surface3 border border-ah text-ah-text text-[11px] leading-relaxed shadow-ah-float z-50 pointer-events-none">
          {text}
        </span>
      )}
    </span>
  )
}

export default function RefineryPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  // Filename — pulled from location state or a demo default
  const filename = window.history.state?.filename || 'customer_churn_dataset.csv'

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

  // Download the cleaning recipe as a Python script
  const handleDownloadRecipe = () => {
    const lines = [
      '# RefineIQ — Cleaning Recipe',
      `# File: ${filename}`,
      `# Generated: ${new Date().toLocaleString()}`,
      '',
      'import polars as pl',
      '',
      `df = pl.read_csv("${filename}")`,
      '',
    ]
    recipe.forEach((step, idx) => {
      lines.push(`# Step ${idx + 1}: ${step.action}`)
      if (step.action.includes('schema')) {
        lines.push('df = df.with_columns([pl.col(c).cast(pl.Utf8) for c in df.columns])')
      } else if (step.action.includes('Impute')) {
        lines.push('for col in df.select(pl.col(pl.Float64, pl.Int64)).columns:')
        lines.push('    df = df.with_columns(pl.col(col).fill_null(pl.col(col).median()))')
      } else if (step.action.includes('duplicate')) {
        lines.push('df = df.unique()')
      } else if (step.action.includes('Privacy')) {
        lines.push('import hashlib')
        lines.push('def mask_pii(val): return val[:1] + "***@" + val.split("@")[-1] if "@" in str(val) else "***"')
        lines.push('df = df.with_columns(pl.col("customer_email").map_elements(mask_pii, return_dtype=pl.Utf8))')
      }
      lines.push('')
    })
    lines.push('print(df)')
    lines.push('df.write_csv("cleaned_output.csv")')

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'refinery_recipe.py'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Pipeline steps config
  const pipelineSteps = [
    { label: '01 Connect', path: 'ingest' },
    { label: '02 Refinery (Clean)', path: 'refinery', active: true },
    { label: '03 Model', path: 'studio' },
    { label: '04 Deploy', path: 'deploy' },
    { label: '05 Watchtower', path: 'watchtower' },
  ]

  return (
    <div className="min-h-screen bg-ah-bg text-ah-text">
      {/* Top Navbar */}
      <header className="glass border-b border-ah px-6 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => navigate(`/project/${projectId}/ingest`)}
            className="text-ah-muted hover:text-ah-text flex items-center gap-1.5 text-sm transition-colors"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <div className="h-4 w-px bg-ah-border hidden sm:block" />
          {/* Clickable pipeline step nav */}
          <nav className="hidden sm:flex items-center gap-1 text-xs text-ah-muted flex-wrap">
            {pipelineSteps.map((step, idx) => (
              <span key={step.path} className="flex items-center gap-1">
                {idx > 0 && <ArrowRight size={10} className="text-ah-border" />}
                {step.active ? (
                  <span className="text-ah-primary font-semibold px-2 py-0.5 rounded-lg bg-ah-primary/10">
                    {step.label}
                  </span>
                ) : (
                  <button
                    onClick={() => navigate(`/project/${projectId}/${step.path}`)}
                    className="px-2 py-0.5 rounded-lg hover:bg-ah-surface2 hover:text-ah-text transition-colors"
                  >
                    {step.label}
                  </button>
                )}
              </span>
            ))}
          </nav>
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
            <p className="text-ah-muted text-sm mt-1">
              Audit, correct nulls, eliminate duplicates, and shield privacy with zero code.
            </p>
            {/* Plain-English tooltip block */}
            <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-ah-surface2 border border-ah text-xs text-ah-muted max-w-xl">
              <Info size={14} className="text-ah-primary shrink-0 mt-0.5" />
              <span>
                <strong className="text-ah-text">What happens here?</strong> Your raw data is scanned for problems — missing values (gaps in data), duplicate rows, and personal information (emails, names). Fix each issue by clicking the action buttons below, then proceed to train your model.
              </span>
            </div>
          </div>

          {/* Health Score Gauge */}
          <div className="bg-ah-surface border border-ah rounded-2xl px-6 py-4 flex items-center gap-5 shadow-ah-card">
            <div>
              <p className="text-[11px] font-mono uppercase text-ah-subtle tracking-wider mb-1 flex items-center gap-1">
                Health Score
                <Tooltip text="How clean is your dataset? 100 = perfect, no issues. Below 70 means your model predictions could be unreliable.">
                  <HelpCircle size={11} className="cursor-help text-ah-subtle ml-0.5" />
                </Tooltip>
              </p>
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
            <p className="text-xs text-ah-muted mb-1">Columns: <span className="font-mono text-ah-text">age, monthly_spend</span></p>
            <p className="text-[11px] text-ah-subtle mb-4 leading-relaxed">
              💡 <em>Blank cells in these columns. We'll fill them in using the average value of that column.</em>
            </p>
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
            <p className="text-xs text-ah-muted mb-1">Exact identical rows detected across all features</p>
            <p className="text-[11px] text-ah-subtle mb-4 leading-relaxed">
              💡 <em>Same customer appears twice. Keeping duplicates makes the model learn the wrong patterns.</em>
            </p>
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
            <p className="text-xs text-ah-muted mb-1">Presidio automated anonymization ready</p>
            <p className="text-[11px] text-ah-subtle mb-4 leading-relaxed">
              💡 <em>Personal info (emails, names) will be hidden before your data is used for training — GDPR/POPIA compliant.</em>
            </p>
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
          {/* Main Table Preview with filename header */}
          <div className="lg:col-span-3">
            {/* File name badge above table */}
            <div className="flex items-center gap-2 mb-3">
              <FileText size={15} className="text-ah-primary" />
              <span className="font-mono text-xs text-ah-text font-semibold">{filename}</span>
              <span className="text-[11px] text-ah-subtle">— {rawRows.length} rows • {columns.length} columns</span>
            </div>
            <SplitViewPreview
              originalRows={rawRows}
              cleanedRows={cleanedRows}
              columns={columns}
            />
          </div>

          {/* Cleaning Pipeline Recipe — NO second proceed button here */}
          <div className="bg-ah-surface border border-ah rounded-2xl p-5 shadow-ah-card h-fit">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-ah">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-ah-primary" />
                <h3 className="font-headline font-bold text-sm">Refinery Recipe</h3>
                <Tooltip text="Every cleaning action you apply is recorded here as a re-runnable script. Download it to apply the same cleaning to future datasets automatically.">
                  <HelpCircle size={12} className="cursor-help text-ah-subtle" />
                </Tooltip>
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

            {/* Download Recipe Button */}
            <div className="mt-5 pt-4 border-t border-ah">
              <button
                onClick={handleDownloadRecipe}
                className="w-full flex items-center justify-center gap-2 bg-ah-surface2 hover:bg-ah-surface3 border border-ah text-ah-text py-2.5 rounded-xl text-xs font-semibold transition-all"
              >
                <Download size={14} className="text-ah-primary" />
                Download Recipe (.py)
              </button>
              <p className="text-[10px] text-ah-subtle text-center mt-1.5 leading-relaxed">
                Save your cleaning steps as a reusable Python script.
              </p>
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
