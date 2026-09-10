import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Brain, Trophy, Play, CheckCircle2, Clock, Sparkles,
  ArrowRight, ChevronLeft, ShieldCheck, Zap, BarChart3, Loader2
} from 'lucide-react'
import apiClient from '../lib/apiClient'

export default function StudioPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  // Training configuration state
  const [targetCol, setTargetCol] = useState('churned')
  const [strategy, setStrategy] = useState('fast') // 'fast' | 'high_accuracy'
  const [maxSpend, setMaxSpend] = useState(20)
  const [isTraining, setIsTraining] = useState(false)
  const [hasTrained, setHasTrained] = useState(true)

  // Leaderboard data
  const [models, setModels] = useState([
    {
      id: 'mod_xgb_1',
      name: 'XGBoost Classifier',
      algo: 'xgboost',
      status: 'completed',
      score: '94.2%',
      metricName: 'Accuracy',
      isChampion: true,
      ocuCost: '1.2 OCUs',
      latency: '12ms',
    },
    {
      id: 'mod_rf_2',
      name: 'Random Forest Ensemble',
      algo: 'random_forest',
      status: 'completed',
      score: '91.8%',
      metricName: 'Accuracy',
      isChampion: false,
      ocuCost: '1.4 OCUs',
      latency: '24ms',
    },
    {
      id: 'mod_lr_3',
      name: 'Logistic Regression',
      algo: 'logistic_regression',
      status: 'completed',
      score: '87.3%',
      metricName: 'Accuracy',
      isChampion: false,
      ocuCost: '0.9 OCUs',
      latency: '4ms',
    },
  ])

  const handleStartTraining = () => {
    setIsTraining(true)
    setTimeout(() => {
      setIsTraining(false)
      setHasTrained(true)
    }, 2000)
  }

  const handleDeploy = (modelId) => {
    navigate(`/project/${projectId}/deploy?modelId=${modelId}`)
  }

  return (
    <div className="min-h-screen bg-ah-bg text-ah-text">
      {/* Top Navbar */}
      <header className="glass border-b border-ah px-6 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/project/${projectId}/refinery`)}
            className="text-ah-muted hover:text-ah-text flex items-center gap-1.5 text-sm transition-colors"
          >
            <ChevronLeft size={16} /> Refinery
          </button>
          <div className="h-4 w-px bg-ah-border" />
          <div className="flex items-center gap-2 text-sm text-ah-muted">
            <span>01 Connect</span>
            <ArrowRight size={12} />
            <span>02 Clean</span>
            <ArrowRight size={12} />
            <span className="text-ah-primary font-semibold">03 Model Studio</span>
            <ArrowRight size={12} />
            <span>04 Deploy</span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/project/${projectId}/deploy`)}
          className="flex items-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-ah-glow"
        >
          Proceed to Deploy <ArrowRight size={16} />
        </button>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Title */}
        <div className="mb-8">
          <p className="text-ah-primary font-mono text-xs uppercase tracking-widest mb-1">Step 03 — Model Studio</p>
          <h1 className="font-headline text-3xl font-bold">AutoML Competition</h1>
          <p className="text-ah-muted text-sm mt-1">Train top algorithms in parallel on your cleaned dataset. Winner takes production.</p>
        </div>

        {/* Configuration Bar */}
        <div className="bg-ah-surface border border-ah rounded-2xl p-6 mb-8 shadow-ah-card">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Target Column */}
            <div>
              <label className="block text-xs font-mono uppercase text-ah-subtle mb-2">Target Variable</label>
              <select
                value={targetCol}
                onChange={(e) => setTargetCol(e.target.value)}
                className="w-full bg-ah-surface2 border border-ah focus:border-ah-primary rounded-xl px-3 py-2.5 text-sm text-ah-text outline-none font-mono"
              >
                <option value="churned">churned (Boolean)</option>
                <option value="monthly_spend">monthly_spend (Numerical)</option>
                <option value="tenure_months">tenure_months (Numerical)</option>
              </select>
            </div>

            {/* Strategy Toggle */}
            <div>
              <label className="block text-xs font-mono uppercase text-ah-subtle mb-2">Training Strategy</label>
              <div className="grid grid-cols-2 gap-2 bg-ah-surface2 p-1 rounded-xl border border-ah">
                <button
                  type="button"
                  onClick={() => setStrategy('fast')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    strategy === 'fast' ? 'bg-ah-surface text-ah-text shadow-sm' : 'text-ah-muted hover:text-ah-text'
                  }`}
                >
                  Fast (3 Models)
                </button>
                <button
                  type="button"
                  onClick={() => setStrategy('high_accuracy')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    strategy === 'high_accuracy' ? 'bg-ah-surface text-ah-text shadow-sm' : 'text-ah-muted hover:text-ah-text'
                  }`}
                >
                  Deep Race (5)
                </button>
              </div>
            </div>

            {/* Spend Guardrail */}
            <div>
              <label className="block text-xs font-mono uppercase text-ah-subtle mb-2">
                Spend Cap: <span className="text-ah-primary font-bold">{maxSpend} OCUs</span>
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={maxSpend}
                onChange={(e) => setMaxSpend(Number(e.target.value))}
                className="w-full h-2 bg-ah-surface3 rounded-lg appearance-none cursor-pointer accent-ah-primary mt-3"
              />
            </div>

            {/* Run Button */}
            <div className="flex items-end">
              <button
                onClick={handleStartTraining}
                disabled={isTraining}
                className="w-full flex items-center justify-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-ah-glow disabled:opacity-50"
              >
                {isTraining ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                {isTraining ? 'Training Models...' : 'Start AutoML Race'}
              </button>
            </div>
          </div>
        </div>

        {/* Results & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard Table (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-headline font-bold text-lg flex items-center gap-2">
                <Trophy size={18} className="text-yellow-400" />
                Live Model Leaderboard
              </h2>
              <span className="text-xs font-mono text-ah-muted">3 models evaluated</span>
            </div>

            <div className="space-y-3">
              {models.map((mod, idx) => (
                <div
                  key={mod.id}
                  className={`bg-ah-surface border rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 transition-all ${
                    mod.isChampion
                      ? 'border-yellow-500/40 bg-yellow-500/[0.03] shadow-ah-card'
                      : 'border-ah hover:border-ah-border'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold font-mono">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-headline font-bold text-base text-ah-text">{mod.name}</h3>
                        {mod.isChampion && (
                          <span className="text-[10px] font-mono uppercase bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full font-bold">
                            Champion
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-ah-subtle mt-1 font-mono">
                        <span>Latency: {mod.latency}</span>
                        <span>•</span>
                        <span>Cost: {mod.ocuCost}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="font-headline text-2xl font-extrabold text-green-400 font-mono">
                        {mod.score}
                      </span>
                      <p className="text-[10px] uppercase font-mono text-ah-subtle">{mod.metricName}</p>
                    </div>

                    <button
                      onClick={() => handleDeploy(mod.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        mod.isChampion
                          ? 'bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white shadow-ah-glow'
                          : 'bg-ah-surface2 hover:bg-ah-surface3 text-ah-text border border-ah'
                      }`}
                    >
                      Deploy →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini AI Explanation Panel (1 column) */}
          <div className="bg-ah-surface border border-ah rounded-2xl p-6 shadow-ah-card h-fit">
            <div className="flex items-center gap-2 text-ah-primary mb-3">
              <Sparkles size={18} />
              <h3 className="font-headline font-bold text-base text-ah-text">Gemini Intelligence</h3>
            </div>
            <p className="text-xs font-mono uppercase text-ah-subtle mb-4">Explainable AI Summary</p>

            <div className="bg-ah-surface2/60 border border-ah rounded-xl p-4 mb-5 leading-relaxed text-xs text-ah-muted">
              <p className="mb-2">
                <strong className="text-ah-text">Why XGBoost Won:</strong> The gradient-boosted decision trees effectively captured non-linear interactions between customer tenure and monthly charges without overfitting.
              </p>
              <p>
                <strong className="text-ah-text">Top Decision Factors:</strong>
              </p>
              <ul className="list-disc list-inside mt-1.5 space-y-1 text-ah-text font-mono text-[11px]">
                <li>tenure_months (42% weight)</li>
                <li>monthly_spend (31% weight)</li>
                <li>age (18% weight)</li>
              </ul>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-green-400 shrink-0" />
              <p className="text-[11px] text-green-300">
                Model passed fairness & data leakage audits. Zero PII utilized in training.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
