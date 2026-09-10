import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Rocket, Copy, Check, Terminal, ExternalLink,
  ChevronLeft, ArrowRight, ShieldCheck, Zap, Activity
} from 'lucide-react'

export default function DeployPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedEndpoint, setCopiedEndpoint] = useState(false)
  const [activeLang, setActiveLang] = useState('curl') // 'curl' | 'python' | 'js'

  const endpoint = 'https://api.analyticshub.ai/v1/predict/xgb_churn_ah9f2k'
  const apiKey = 'ah_live_9b4e82f1c0d57a3e8'

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text)
    if (type === 'key') {
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    } else {
      setCopiedEndpoint(true)
      setTimeout(() => setCopiedEndpoint(false), 2000)
    }
  }

  const codeSnippets = {
    curl: `curl -X POST "${endpoint}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{"age": 34, "monthly_spend": 89.5, "tenure_months": 12}'`,
    python: `import requests

url = "${endpoint}"
headers = {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
}
payload = {
    "age": 34,
    "monthly_spend": 89.5,
    "tenure_months": 12
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
# Output: {"prediction": 0, "churn_probability": 0.12, "risk": "Low"}`,
    js: `const response = await fetch("${endpoint}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    age: 34,
    monthly_spend: 89.5,
    tenure_months: 12
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
            <span>01 Connect</span>
            <ArrowRight size={12} />
            <span>02 Clean</span>
            <ArrowRight size={12} />
            <span>03 Model</span>
            <ArrowRight size={12} />
            <span className="text-ah-primary font-semibold">04 Deploy</span>
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
            <h1 className="font-headline text-3xl font-bold">Production API Ready</h1>
            <p className="text-ah-muted text-sm mt-1">Your champion XGBoost model is hosted on serverless micro-instances with instant autoscaling.</p>
          </div>

          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-xl text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Status: Live & Scaled</span>
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
