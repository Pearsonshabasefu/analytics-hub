import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Rocket, Copy, Check, Terminal, ExternalLink,
  ChevronLeft, ArrowRight, ShieldCheck, Zap, Activity,
  Play, Sparkles, Loader2, RefreshCw
} from 'lucide-react'

export default function DeployPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedEndpoint, setCopiedEndpoint] = useState(false)
  const [copiedPayload, setCopiedPayload] = useState(false)
  const [activeLang, setActiveLang] = useState('curl') // 'curl' | 'python' | 'js'

  // Playground state
  const [playgroundAge, setPlaygroundAge] = useState(34)
  const [playgroundSpend, setPlaygroundSpend] = useState(89.5)
  const [playgroundTenure, setPlaygroundTenure] = useState(12)
  const [playgroundPlan, setPlaygroundPlan] = useState('Enterprise')
  const [isPredicting, setIsPredicting] = useState(false)
  const [predictionResult, setPredictionResult] = useState({
    prediction: 'Retained (Active Customer)',
    churn_probability: 0.114,
    risk_level: 'Low Risk',
    latency: '8.4 ms',
    model_version: 'xgb_churn_v2.4_production',
    confidence_score: '96.2%',
    key_drivers: [
      'Account tenure > 6 months reduces churn likelihood (-42% hazard rate)',
      'Monthly spend > $75 indicates high product stickiness (+18% retention)',
      'Enterprise SLA support provides direct account manager contact',
    ],
  })

  const endpoint = 'https://api.analyticshub.ai/v1/predict/xgb_churn_ah9f2k'
  const apiKey = 'ah_live_9b4e82f1c0d57a3e8'

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text)
    if (type === 'key') {
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    } else if (type === 'payload') {
      setCopiedPayload(true)
      setTimeout(() => setCopiedPayload(false), 2000)
    } else {
      setCopiedEndpoint(true)
      setTimeout(() => setCopiedEndpoint(false), 2000)
    }
  }

  const handleRunPlayground = () => {
    setIsPredicting(true)
    setTimeout(() => {
      // Calculate realistic simulated prediction based on inputs
      const isHighRisk = playgroundTenure < 3 || playgroundSpend < 30 || playgroundAge > 65
      const churnProb = isHighRisk
        ? Math.min(0.92, Math.max(0.65, 0.75 + (3 - playgroundTenure) * 0.05))
        : Math.min(0.35, Math.max(0.04, 0.20 - (playgroundTenure * 0.01)))

      setPredictionResult({
        prediction: isHighRisk ? 'Churn Warning (High Probability)' : 'Retained (Active Customer)',
        churn_probability: Number(churnProb.toFixed(3)),
        risk_level: isHighRisk ? 'High Risk' : 'Low Risk',
        latency: `${(7.2 + Math.random() * 2.5).toFixed(1)} ms`,
        model_version: 'xgb_churn_v2.4_production',
        confidence_score: `${(92 + Math.random() * 6).toFixed(1)}%`,
        key_drivers: isHighRisk
          ? [
              'Short account tenure (< 3 months) represents highest hazard window (+54% risk)',
              'Low product utilization / spend below median baseline',
              'Recommended intervention: Send automated onboarding check-in & 20% discount offer',
            ]
          : [
              'Account tenure > 6 months reduces churn likelihood (-42% hazard rate)',
              'Monthly spend > $75 indicates high product stickiness (+18% retention)',
              'Enterprise tier active engagement reduces voluntary cancellation risk',
            ],
      })
      setIsPredicting(false)
    }, 450)
  }

  const codeSnippets = {
    curl: `curl -X POST "${endpoint}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{"age": ${playgroundAge}, "monthly_spend": ${playgroundSpend}, "tenure_months": ${playgroundTenure}, "plan_tier": "${playgroundPlan}"}'`,
    python: `import requests

url = "${endpoint}"
headers = {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
}
payload = {
    "age": ${playgroundAge},
    "monthly_spend": ${playgroundSpend},
    "tenure_months": ${playgroundTenure},
    "plan_tier": "${playgroundPlan}"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
# Output: {"prediction": "${predictionResult.prediction}", "churn_probability": ${predictionResult.churn_probability}, "risk": "${predictionResult.risk_level}"}`,
    js: `const response = await fetch("${endpoint}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    age: ${playgroundAge},
    monthly_spend: ${playgroundSpend},
    tenure_months: ${playgroundTenure},
    plan_tier: "${playgroundPlan}"
  })
});

const data = await response.json();
console.log(data);`
  }

  return (
    <div className="min-h-screen bg-ah-bg text-ah-text">
      {/* Top Navbar */}
      <header className="glass border-b border-ah px-6 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/project/${projectId}/studio`)}
            className="text-ah-muted hover:text-ah-text flex items-center gap-1.5 text-sm transition-colors"
          >
            <ChevronLeft size={16} /> Studio
          </button>
          <div className="h-4 w-px bg-ah-border" />
          <div className="flex items-center gap-2 text-sm text-ah-muted">
            <button onClick={() => navigate(`/project/${projectId}/ingest`)} className="hover:text-ah-text transition-colors">01 Connect</button>
            <ArrowRight size={12} />
            <button onClick={() => navigate(`/project/${projectId}/refinery`)} className="hover:text-ah-text transition-colors">02 Clean</button>
            <ArrowRight size={12} />
            <button onClick={() => navigate(`/project/${projectId}/studio`)} className="hover:text-ah-text transition-colors">03 Model</button>
            <ArrowRight size={12} />
            <span className="text-ah-primary font-semibold">04 Deploy</span>
            <ArrowRight size={12} />
            <button onClick={() => navigate(`/project/${projectId}/watchtower`)} className="hover:text-ah-text transition-colors">05 Watchtower</button>
          </div>
        </div>

        <button
          onClick={() => navigate(`/project/${projectId}/watchtower`)}
          className="flex items-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-ah-glow"
        >
          Open Watchtower 👁️ <ArrowRight size={16} />
        </button>
      </header>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-ah-primary font-mono text-xs uppercase tracking-widest mb-1">Step 04 — One-Click Deploy</p>
            <h1 className="font-headline text-3xl font-bold">Production API Live</h1>
            <p className="text-ah-muted text-sm mt-1">Your champion XGBoost model is hosted on serverless micro-instances with instant autoscaling.</p>
          </div>

          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-xl text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Status: Live & Autoscaling</span>
          </div>
        </div>

        {/* Credentials & Endpoint Card */}
        <div className="bg-ah-surface border border-ah rounded-2xl p-6 mb-8 shadow-ah-card space-y-5">
          {/* Endpoint */}
          <div>
            <label className="block text-xs font-mono uppercase text-ah-subtle mb-2">Live REST Endpoint</label>
            <div className="flex items-center gap-2 bg-ah-surface2 border border-ah rounded-xl px-4 py-3 font-mono text-xs text-ah-text">
              <span className="text-green-400 font-bold">POST</span>
              <span className="flex-1 truncate text-ah-muted">{endpoint}</span>
              <button
                onClick={() => handleCopy(endpoint, 'endpoint')}
                className="text-ah-subtle hover:text-ah-text p-1 transition-colors"
                title="Copy endpoint"
              >
                {copiedEndpoint ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-xs font-mono uppercase text-ah-subtle mb-2">Secret API Key</label>
            <div className="flex items-center gap-2 bg-ah-surface2 border border-ah rounded-xl px-4 py-3 font-mono text-xs text-ah-text">
              <span className="flex-1 text-ah-muted">{apiKey}</span>
              <button
                onClick={() => handleCopy(apiKey, 'key')}
                className="text-ah-subtle hover:text-ah-text p-1 transition-colors"
                title="Copy API key"
              >
                {copiedKey ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Live Prediction Playground */}
        <div className="bg-ah-surface border border-ah hover:border-ah-primary/50 rounded-2xl p-6 mb-8 shadow-ah-card transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-ah-primary/20 flex items-center justify-center text-ah-primary">
                <Zap size={18} />
              </div>
              <div>
                <h3 className="font-headline font-bold text-base text-ah-text">Interactive Live Inference Playground</h3>
                <p className="text-xs text-ah-muted">Change parameters below and test real-time model scoring without writing code.</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-ah-primary/10 border border-ah-primary/30 text-ah-primary font-mono text-xs">
              ⚡ Live Simulator
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-xs font-mono text-ah-subtle uppercase mb-1.5">Age</label>
              <input
                type="number"
                value={playgroundAge}
                onChange={(e) => setPlaygroundAge(Number(e.target.value))}
                className="w-full bg-ah-surface2 border border-ah rounded-xl px-3 py-2 text-sm font-mono text-ah-text outline-none focus:border-ah-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-ah-subtle uppercase mb-1.5">Monthly Spend ($)</label>
              <input
                type="number"
                value={playgroundSpend}
                onChange={(e) => setPlaygroundSpend(Number(e.target.value))}
                className="w-full bg-ah-surface2 border border-ah rounded-xl px-3 py-2 text-sm font-mono text-ah-text outline-none focus:border-ah-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-ah-subtle uppercase mb-1.5">Tenure (Months)</label>
              <input
                type="number"
                value={playgroundTenure}
                onChange={(e) => setPlaygroundTenure(Number(e.target.value))}
                className="w-full bg-ah-surface2 border border-ah rounded-xl px-3 py-2 text-sm font-mono text-ah-text outline-none focus:border-ah-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-ah-subtle uppercase mb-1.5">Plan Tier</label>
              <select
                value={playgroundPlan}
                onChange={(e) => setPlaygroundPlan(e.target.value)}
                className="w-full bg-ah-surface2 border border-ah rounded-xl px-3 py-2 text-sm font-mono text-ah-text outline-none focus:border-ah-primary"
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Pro">Pro</option>
                <option value="Starter">Starter</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleRunPlayground}
              disabled={isPredicting}
              className="inline-flex items-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-ah-glow disabled:opacity-50"
            >
              {isPredicting ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              {isPredicting ? 'Executing Inference...' : 'Run Live Prediction ⚡'}
            </button>
            <span className="text-xs font-mono text-ah-muted">Simulated Latency: {predictionResult.latency}</span>
          </div>

          {/* Verdict Box */}
          <div className="p-5 rounded-xl bg-ah-surface2 border border-ah space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-ah-subtle font-mono uppercase">Verdict:</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
                  predictionResult.risk_level === 'High Risk'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}>
                  {predictionResult.prediction}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-ah-muted">
                <span>Confidence: <strong className="text-ah-text">{predictionResult.confidence_score}</strong></span>
                <span>Latency: <strong className="text-green-400">{predictionResult.latency}</strong></span>
              </div>
            </div>

            {/* Probability bar */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-ah-subtle">
                <span>Churn Probability Meter</span>
                <span className="text-ah-text font-bold">{(predictionResult.churn_probability * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-ah-surface3 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    predictionResult.risk_level === 'High Risk' ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${predictionResult.churn_probability * 100}%` }}
                />
              </div>
            </div>

            {/* Explainability key drivers */}
            <div className="space-y-1.5 pt-2 border-t border-ah/60">
              <p className="text-[11px] font-mono text-ah-subtle uppercase">Top Explainability Signals (SHAP):</p>
              {predictionResult.key_drivers.map((driver, i) => (
                <p key={i} className="text-xs text-ah-muted flex items-start gap-2">
                  <span className="text-ah-primary mt-0.5">•</span>
                  <span>{driver}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Integration Code Snippets */}
        <div className="bg-ah-surface border border-ah rounded-2xl overflow-hidden shadow-ah-card mb-8">
          <div className="p-4 border-b border-ah flex items-center justify-between bg-ah-surface2/50">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-ah-primary" />
              <h3 className="font-headline font-bold text-sm">Implementation Examples</h3>
            </div>

            <div className="flex bg-ah-surface3 p-1 rounded-xl border border-ah gap-1">
              {['curl', 'python', 'js'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg transition-all ${
                    activeLang === lang
                      ? 'bg-ah-primary text-white shadow-sm'
                      : 'text-ah-muted hover:text-ah-text'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 bg-ah-surface2/80 font-mono text-xs overflow-x-auto text-ah-muted leading-relaxed">
            <pre className="text-green-300/90">{codeSnippets[activeLang]}</pre>
          </div>
        </div>

        {/* Watchtower CTA Footer */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-ah-primary/30 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-headline font-bold text-base text-ah-text">Automate Production Drift Monitoring</h3>
            <p className="text-xs text-ah-muted mt-1">Watchtower tracks live inference confidence, feature distribution drift, and error spikes.</p>
          </div>
          <button
            onClick={() => navigate(`/project/${projectId}/watchtower`)}
            className="flex items-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-ah-glow"
          >
            Launch Watchtower <Activity size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
