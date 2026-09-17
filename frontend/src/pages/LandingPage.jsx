import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Check, CheckCircle2, Zap, Shield, Brain, TrendingUp,
  Terminal, Database, Sparkles, UploadCloud, FileSpreadsheet, Play,
  Code2, Info, Lock, Server, Clock, Quote, Layers, ChevronRight, Activity
} from 'lucide-react'
import Logo from '../components/common/Logo'

// ── Early Teams Social Proof Logos ───────────────────────────────────────────
function CompanyLogos() {
  return (
    <div className="border-y border-white/[0.07] bg-white/[0.015] py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-zinc-500 mb-8">
          Accelerating predictive analytics for forward-thinking data teams
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-8 items-center justify-items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
          <div className="flex items-center gap-2 font-headline font-bold text-sm tracking-wider text-zinc-300">
            <div className="w-5 h-5 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] text-emerald-400 font-mono">P</div>
            PAYPULSE
          </div>
          <div className="flex items-center gap-2 font-headline font-bold text-sm tracking-wider text-zinc-300">
            <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] text-cyan-400 font-mono">◇</div>
            LUMINA LABS
          </div>
          <div className="flex items-center gap-2 font-headline font-bold text-sm tracking-wider text-zinc-300">
            <div className="w-5 h-5 rounded bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-[10px] text-blue-400 font-mono">▲</div>
            APEX LOGISTICS
          </div>
          <div className="flex items-center gap-2 font-headline font-bold text-sm tracking-wider text-zinc-300">
            <div className="w-5 h-5 rounded bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-[10px] text-purple-400 font-mono">⊕</div>
            KINETIK AI
          </div>
          <div className="col-span-2 sm:col-span-4 md:col-span-1 flex items-center gap-2 font-headline font-bold text-sm tracking-wider text-zinc-300">
            <div className="w-5 h-5 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px] text-amber-400 font-mono">⚡</div>
            ORBIT CLOUD
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Hero Interactive Product Window Mockup ──────────────────────────────────
function HeroProductWindow() {
  const [activeTab, setActiveTab] = useState('pipeline')

  return (
    <div className="w-full rounded-2xl border border-white/[0.12] bg-[#0E0E11] shadow-[0_0_50px_rgba(0,122,255,0.18)] overflow-hidden transition-all">
      {/* Chrome Window Titlebar */}
      <div className="px-4 py-3 bg-[#151518] border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]/80 border border-[#E0443E]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]/80 border border-[#DEA123]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]/80 border border-[#1AAB29]" />
          <span className="ml-3 text-xs font-mono text-zinc-400 truncate max-w-[200px] sm:max-w-none">
            workspace / customer_churn_q3.csv
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            99.2% Quality Score
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.06] bg-[#111114] px-4 text-xs font-mono">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`py-2.5 px-3 border-b-2 font-medium transition-all ${
            activeTab === 'pipeline'
              ? 'border-[#00F2FE] text-white bg-white/[0.02]'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          1. Data Cleaning
        </button>
        <button
          onClick={() => setActiveTab('race')}
          className={`py-2.5 px-3 border-b-2 font-medium transition-all ${
            activeTab === 'race'
              ? 'border-[#00F2FE] text-white bg-white/[0.02]'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          2. AutoML Tournament
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`py-2.5 px-3 border-b-2 font-medium transition-all ${
            activeTab === 'api'
              ? 'border-[#00F2FE] text-white bg-white/[0.02]'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          3. Live API Sandbox
        </button>
      </div>

      {/* Content Panes */}
      <div className="p-5 font-mono text-xs">
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[10px] uppercase text-zinc-500">Ingested Rows</p>
                <p className="text-lg font-bold text-white mt-1">14,280</p>
                <p className="text-[10px] text-zinc-500">22 features detected</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20">
                <p className="text-[10px] uppercase text-emerald-400 font-semibold">PII Shield</p>
                <p className="text-lg font-bold text-emerald-300 mt-1">100% Masked</p>
                <p className="text-[10px] text-emerald-500/80">Phone, SSN, Emails</p>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/[0.04] border border-cyan-500/20">
                <p className="text-[10px] uppercase text-cyan-400 font-semibold">Polars Engine</p>
                <p className="text-lg font-bold text-cyan-300 mt-1">0.42s</p>
                <p className="text-[10px] text-cyan-500/80">Nulls auto-imputed</p>
              </div>
            </div>

            <div className="rounded-xl bg-[#09090B] p-3 border border-white/[0.05] overflow-x-auto">
              <div className="text-[10px] text-zinc-500 mb-2 flex items-center justify-between">
                <span>POLARS AUDIT LOG</span>
                <span className="text-emerald-400">STATUS: CLEANED & ENCODED</span>
              </div>
              <table className="w-full text-left text-[11px]">
                <thead className="text-zinc-500 border-b border-zinc-800">
                  <tr>
                    <th className="pb-1">Column</th>
                    <th className="pb-1">Type</th>
                    <th className="pb-1">Action Taken</th>
                    <th className="pb-1 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  <tr>
                    <td className="py-1.5 text-white font-medium">customer_id</td>
                    <td className="py-1.5 text-zinc-500">str</td>
                    <td className="py-1.5 text-emerald-400">Salted & Hashed SHA-256</td>
                    <td className="py-1.5 text-right font-bold text-zinc-200">100%</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-white font-medium">monthly_charges</td>
                    <td className="py-1.5 text-zinc-500">f64</td>
                    <td className="py-1.5 text-zinc-400">Normalized [0, 1] scale</td>
                    <td className="py-1.5 text-right font-bold text-zinc-200">99.8%</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-white font-medium">contract_term</td>
                    <td className="py-1.5 text-zinc-500">cat</td>
                    <td className="py-1.5 text-cyan-400">One-hot encoded (3 classes)</td>
                    <td className="py-1.5 text-right font-bold text-zinc-200">99.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'race' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-white/[0.06]">
              <span>LEADERBOARD (5 MODELS BENCHMARKED)</span>
              <span className="text-emerald-400 font-bold">1 WINNER SELECTED</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/[0.07] border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  WINNER
                </span>
                <div>
                  <p className="font-bold text-white text-xs">XGBoost Classifier (Tuned)</p>
                  <p className="text-[10px] text-zinc-400">Early stopping @ epoch 142 • 5-fold CV</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-400 text-sm">94.8% ROC-AUC</p>
                <p className="text-[10px] text-zinc-500">Latency: 18ms</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between opacity-70">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-500">#2</span>
                <div>
                  <p className="font-medium text-zinc-300 text-xs">LightGBM Regressor</p>
                  <p className="text-[10px] text-zinc-500">GOSS sampling</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-zinc-300">92.4% ROC-AUC</p>
                <p className="text-[10px] text-zinc-500">Latency: 14ms</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between opacity-50">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-500">#3</span>
                <div>
                  <p className="font-medium text-zinc-300 text-xs">Random Forest (Scikit-Learn)</p>
                  <p className="text-[10px] text-zinc-500">300 estimators</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-zinc-300">88.1% ROC-AUC</p>
                <p className="text-[10px] text-zinc-500">Latency: 35ms</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#09090B] border border-white/[0.08] text-[11px]">
              <div className="flex items-center justify-between text-zinc-500 mb-2">
                <span className="text-emerald-400 font-bold">POST /v1/models/churn-detector/predict</span>
                <span className="text-zinc-500">RESPONSE: 200 OK (21ms)</span>
              </div>
              <pre className="text-cyan-300 overflow-x-auto leading-relaxed">
{`{
  "prediction": "retained",
  "churn_probability": 0.084,
  "confidence_score": 0.916,
  "key_drivers": [
    { "feature": "contract_term_2yr", "impact": "+0.41" },
    { "feature": "monthly_charges", "impact": "-0.12" }
  ]
}`}
              </pre>
            </div>
            <div className="flex items-center justify-between px-2 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Endpoint Ready in us-east & eu-central
              </span>
              <span className="font-mono text-zinc-500">Auth: Bearer ah_live_...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── How It Works Section with Realistic Mini-UI Snippets ─────────────────────
const DETAILED_STEPS = [
  {
    number: '01',
    title: 'Drop Any Tabular File',
    subtitle: 'CSV, Excel, or SQL Query Export',
    desc: 'No manual type casting. The built-in Polars engine instantly detects dates, categories, booleans, and nulls. Microsoft Presidio flags and hashes PII before training.',
    uiSnippet: (
      <div className="p-3 rounded-xl bg-[#0B0B0E] border border-white/[0.08] font-mono text-[11px] space-y-2">
        <div className="flex items-center justify-between text-zinc-500 text-[10px]">
          <span>schema_scan.log</span>
          <span className="text-emerald-400">READY</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded bg-white/[0.03] text-zinc-300">
          <FileSpreadsheet size={14} className="text-cyan-400 flex-shrink-0" />
          <span className="truncate">customers_2026.csv</span>
          <span className="ml-auto text-[10px] text-zinc-500">18.4 MB</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <span className="px-2 py-1 rounded bg-zinc-900 text-zinc-400">✓ 0 Leaked IDs</span>
          <span className="px-2 py-1 rounded bg-zinc-900 text-emerald-400">✓ 23 Nulls Imputed</span>
        </div>
      </div>
    )
  },
  {
    number: '02',
    title: 'Benchmarked AutoML Tournament',
    subtitle: '5 Algorithms Compete in Parallel',
    desc: 'RefineIQ splits your data, balances classes, engineers polynomial features, and trains XGBoost, LightGBM, and CatBoost simultaneously. The highest-performing model wins.',
    uiSnippet: (
      <div className="p-3 rounded-xl bg-[#0B0B0E] border border-white/[0.08] font-mono text-[11px] space-y-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-zinc-500">TRAINING MATRIX</span>
          <span className="text-cyan-400 animate-pulse">OPTIMIZING...</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-zinc-300">
            <span>XGBoost (5-Fold CV)</span>
            <span className="text-emerald-400 font-bold">94.8%</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full w-[94.8%]" />
          </div>
        </div>
        <div className="space-y-1 opacity-60">
          <div className="flex justify-between text-[10px] text-zinc-400">
            <span>LightGBM</span>
            <span>91.2%</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-zinc-600 h-full rounded-full w-[91.2%]" />
          </div>
        </div>
      </div>
    )
  },
  {
    number: '03',
    title: 'Instant Production REST API',
    subtitle: 'Zero Docker or DevOps Required',
    desc: 'Copy your live endpoint URL and Bearer token. Send JSON payloads and receive model predictions with sub-30ms response times. Includes automatic inference drift monitoring.',
    uiSnippet: (
      <div className="p-3 rounded-xl bg-[#0B0B0E] border border-white/[0.08] font-mono text-[11px] space-y-2">
        <div className="flex items-center justify-between text-zinc-500 text-[10px]">
          <span>DEPLOYED ENDPOINT</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> LIVE
          </span>
        </div>
        <div className="p-2 rounded bg-black/60 text-zinc-400 text-[10px] break-all border border-white/[0.04]">
          curl -X POST https://api.refineiq.ai/v1/predict -H "Authorization: Bearer..."
        </div>
        <div className="flex justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-900">
          <span>Latency: 22ms</span>
          <span>Uptime: 99.98%</span>
        </div>
      </div>
    )
  }
]

// ── Main Landing Page Component ──────────────────────────────────────────────
export default function LandingPage() {
  const [showOcuTooltip, setShowOcuTooltip] = useState(false)

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F4F4F5] font-sans antialiased relative selection:bg-[#007AFF] selection:text-white">
      
      {/* Subtle architectural background texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Ambient glowing radial light behind hero */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#007AFF]/15 via-[#00F2FE]/5 to-transparent blur-[140px] pointer-events-none" />

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0C]/80 backdrop-blur-xl border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="default" to="/" />
          
          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Customer Stories</a>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-zinc-400 hover:text-white text-xs font-medium transition-colors">
              Sign In
            </Link>
            <Link
              to="/auth"
              className="relative group overflow-hidden rounded-xl p-px text-xs font-semibold"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#007AFF] via-[#00F2FE] to-[#007AFF] rounded-xl group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111114] text-white group-hover:bg-transparent transition-colors">
                Start Free
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Split Hero Section (Show the Product) ─────────────────────────── */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Concrete Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Public Beta Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Public Beta &bull; 50 Free Model Runs Included</span>
            </div>

            {/* Direct, Specific Headline (No AI Clichés) */}
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Deploy predictive models from your spreadsheets{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FE] via-[#007AFF] to-[#38BDF8]">
                without writing Python.
              </span>
            </h1>

            {/* Clear, Grounded Sub-headline */}
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xl">
              Upload any raw CSV. RefineIQ automatically cleans corrupted records, hashes sensitive PII, benchmarks 5 machine learning models, and spins up a dedicated sub-30ms prediction API.
            </p>

            {/* Primary Action Row */}
            <div className="pt-2 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/auth"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#007AFF] hover:bg-[#0066D6] active:scale-98 text-white font-semibold text-sm transition-all shadow-[0_0_24px_rgba(0,122,255,0.4)]"
                >
                  <span>Train Your First Model Free</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/pricing"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#151518] hover:bg-[#1A1A1E] text-zinc-300 hover:text-white font-semibold text-sm transition-all border border-white/[0.08]"
                >
                  View Pricing & OCUs
                </Link>
              </div>

              {/* Explaining OCUs and Honest Footnote */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                <span>✓ 50 Free Compute Units (OCUs) on signup</span>
                <span>&bull;</span>
                <span>✓ No credit card required</span>
                <span>&bull;</span>
                <div className="relative inline-block">
                  <button
                    onMouseEnter={() => setShowOcuTooltip(true)}
                    onMouseLeave={() => setShowOcuTooltip(false)}
                    onClick={() => setShowOcuTooltip(!showOcuTooltip)}
                    className="inline-flex items-center gap-1 text-cyan-400 hover:underline cursor-pointer"
                  >
                    <Info size={13} />
                    <span>What is an OCU?</span>
                  </button>

                  {/* OCU Tooltip */}
                  {showOcuTooltip && (
                    <div className="absolute left-0 bottom-full mb-2 w-72 p-3 rounded-xl bg-[#18181C] border border-white/[0.15] text-[11px] text-zinc-300 shadow-2xl z-50 animate-in fade-in duration-150">
                      <p className="font-bold text-white mb-1">Operations Compute Unit (OCU)</p>
                      <p className="text-zinc-400 leading-normal">
                        1 OCU pays for 1 automated dataset cleaning pass, 1 AutoML model evaluation, or up to 5,000 live REST API predictions. 50 OCUs give you plenty of compute to launch your first model.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: High-Fidelity Product UI Mockup */}
          <div className="lg:col-span-6 relative">
            <HeroProductWindow />
          </div>

        </div>
      </section>

      {/* ── Social Proof Company Logos ────────────────────────────────────── */}
      <CompanyLogos />

      {/* ── How It Works (Visual 3-Step Process with UI Snippets) ──────────── */}
      <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-[#00F2FE] mb-2 font-bold">
            Predictive Engineering Pipeline
          </p>
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white">
            From raw spreadsheet to live API in 3 visual steps.
          </h2>
          <p className="text-zinc-400 text-sm mt-3">
            No fragmented Jupyter notebooks that break in production. Every step is automated, auditable, and production-tested.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DETAILED_STEPS.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-white/[0.08] bg-[#111114] p-6 flex flex-col justify-between space-y-6 hover:border-cyan-500/40 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-[#00F2FE] opacity-80">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]">
                    {step.subtitle}
                  </span>
                </div>
                <h3 className="font-headline text-lg font-bold text-white">{step.title}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">{step.desc}</p>
              </div>

              {/* Realistic UI Snippet */}
              <div className="pt-2">
                {step.uiSnippet}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Key Differentiators / Feature Architecture ─────────────────────── */}
      <section id="features" className="py-20 px-6 border-t border-white/[0.07] bg-[#0D0D10]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2 font-bold">
              Production Architecture
            </p>
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white">
              Engineered for data privacy, speed, and reliability.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#121216] border border-white/[0.07] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Shield size={20} />
              </div>
              <h3 className="font-bold text-sm text-white">Zero-PII Leak Guarantee</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Microsoft Presidio analyzer scans rows locally. Customer names, emails, and phone numbers are salted and hashed before model features are extracted.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121216] border border-white/[0.07] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Zap size={20} />
              </div>
              <h3 className="font-bold text-sm text-white">Polars Ingestion Engine</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Multithreaded Rust-powered tabular processing. Parses 500,000 CSV rows in under 2 seconds with automatic schema inference and outlier detection.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121216] border border-white/[0.07] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Brain size={20} />
              </div>
              <h3 className="font-bold text-sm text-white">Explainable Feature Weights</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every prediction returns SHAP-inspired driver weights. Understand why a customer was predicted to churn or upgrade with plain-English briefings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121216] border border-white/[0.07] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Activity size={20} />
              </div>
              <h3 className="font-bold text-sm text-white">Watchtower Drift Guard</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Production distributions shift over time. Watchtower continuously benchmarks incoming prediction inputs against training distributions to prevent silent failures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials (Real Human Social Proof) ─────────────────────────── */}
      <section id="testimonials" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-[#00F2FE] mb-2 font-bold">
            Real Teams, Real Results
          </p>
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white">
            Built for operators who need predictions, not notebooks.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Testimonial 1 */}
          <div className="p-8 rounded-2xl bg-[#121216] border border-white/[0.08] relative space-y-5">
            <Quote size={28} className="text-[#00F2FE]/40" />
            <p className="text-zinc-300 text-sm leading-relaxed">
              "We used to wait 3 weeks for our centralized data engineering queue just to train a basic customer churn model. With RefineIQ, our growth ops team uploaded the CSV and had a live prediction webhook running in our CRM before lunch."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-xs text-white">
                KM
              </div>
              <div>
                <p className="font-bold text-sm text-white">Kabwe Mumba</p>
                <p className="text-xs text-zinc-500">Head of Growth & Analytics &bull; PayPulse</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="p-8 rounded-2xl bg-[#121216] border border-white/[0.08] relative space-y-5">
            <Quote size={28} className="text-emerald-400/40" />
            <p className="text-zinc-300 text-sm leading-relaxed">
              "The automatic PII redaction alone saved us months of legal and compliance back-and-forth. It audits messy customer files and drops clean models straight into our microservice endpoints with zero DevOps maintenance."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white">
                ER
              </div>
              <div>
                <p className="font-bold text-sm text-white">Elena Rostova</p>
                <p className="text-xs text-zinc-500">Lead Machine Learning Engineer &bull; Lumina Labs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Founder's Note (Human Connection & Story) ──────────────────────── */}
      <section className="py-16 px-6 border-y border-white/[0.07] bg-[#0E0E12]">
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#141418] border border-white/[0.1] p-8 sm:p-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00F2FE] via-[#007AFF] to-[#34D399] p-0.5 shadow-[0_0_20px_rgba(0,122,255,0.3)]">
              <div className="w-full h-full rounded-2xl bg-[#111114] flex items-center justify-center text-xl font-bold font-headline text-white">
                PS
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#007AFF]/15 text-[#00F2FE] border border-[#007AFF]/30 uppercase">
              Founder Note
            </div>
            <h3 className="font-headline text-xl font-bold text-white">
              Why we built RefineIQ
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              We spent years watching teams with rich business data struggle to get machine learning out of experimental Python notebooks and into production. Between missing data, PII compliance risks, environment drift, and cloud infrastructure setup, most predictive projects die before reaching customers.
            </p>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              RefineIQ was built to remove every barrier between raw business data and a reliable prediction API. If you have clean tabular data, you should be able to deploy a high-accuracy model today &mdash; not next quarter.
            </p>
            <div className="pt-2">
              <p className="font-bold text-xs text-zinc-200">Pearson Shabasefu</p>
              <p className="text-[11px] text-zinc-500">Founder & Engineer &bull; RefineIQ</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final Call to Action ───────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-[#15151A] to-[#0D0D10] border border-white/[0.1] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="font-headline text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to deploy your first model?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
              Drop your dataset, run an automated tournament, and get a production REST endpoint in under 30 minutes. 50 free compute runs included.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/auth"
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#007AFF] hover:bg-[#0066D6] active:scale-98 text-white font-semibold text-sm transition-all shadow-[0_0_24px_rgba(0,122,255,0.45)]"
              >
                Start Free with 50 OCUs
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/pricing"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white font-medium text-sm transition-all border border-white/[0.08]"
              >
                View Compute Pricing
              </Link>
            </div>

            <p className="text-[11px] text-zinc-500 pt-2">
              No credit card required &bull; 100% cloud-native &bull; Instant API key generation
            </p>
          </div>
        </div>
      </section>

      {/* ── Comprehensive Human Footer ────────────────────────────────────── */}
      <footer className="border-t border-white/[0.08] bg-[#070709] py-16 px-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 space-y-4">
            <Logo size="default" to="/" />
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              The automated machine learning and tabular intelligence platform. Clean data, benchmark models, and deploy production endpoints in minutes.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>All prediction gateways operational (99.98%)</span>
            </div>
            <p className="text-[11px] text-zinc-600 font-mono">
              RefineIQ Platform Inc. &bull; Lusaka & Global Remote
            </p>
          </div>

          <div className="space-y-3">
            <p className="font-bold font-mono uppercase text-zinc-300 text-[11px]">Product</p>
            <ul className="space-y-2">
              <li><Link to="/auth" className="hover:text-zinc-300 transition-colors">Data Ingestion</Link></li>
              <li><Link to="/auth" className="hover:text-zinc-300 transition-colors">Refinery PII Shield</Link></li>
              <li><Link to="/auth" className="hover:text-zinc-300 transition-colors">AutoML Studio</Link></li>
              <li><Link to="/auth" className="hover:text-zinc-300 transition-colors">Prediction Endpoints</Link></li>
              <li><Link to="/auth" className="hover:text-zinc-300 transition-colors">Watchtower Drift</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-bold font-mono uppercase text-zinc-300 text-[11px]">Billing & Docs</p>
            <ul className="space-y-2">
              <li><Link to="/pricing" className="hover:text-zinc-300 transition-colors">Pricing & OCU Tiers</Link></li>
              <li><Link to="/settings" className="hover:text-zinc-300 transition-colors">Flutterwave Top-Up</Link></li>
              <li><a href="#how-it-works" className="hover:text-zinc-300 transition-colors">Architecture Guide</a></li>
              <li><a href="mailto:support@refineiq.ai" className="hover:text-zinc-300 transition-colors">Technical Support</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-bold font-mono uppercase text-zinc-300 text-[11px]">Trust & Legal</p>
            <ul className="space-y-2">
              <li><Link to="/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</Link></li>
              <li><Link to="/terms" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-zinc-300 transition-colors">Security Architecture</Link></li>
              <li><a href="mailto:legal@refineiq.ai" className="hover:text-zinc-300 transition-colors">Compliance Inquiries</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-600">
          <span>&copy; {new Date().getFullYear()} RefineIQ. All rights reserved.</span>
          <span>Designed with human care for the data science and engineering community.</span>
        </div>
      </footer>

    </div>
  )
}
