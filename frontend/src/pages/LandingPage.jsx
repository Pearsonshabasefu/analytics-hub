import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Brain, TrendingUp, CheckCircle } from 'lucide-react'

const STEPS = [
  { icon: '📁', step: '01', title: 'Connect', desc: 'Upload CSV, Excel, or connect Snowflake, BigQuery, S3' },
  { icon: '🧹', step: '02', title: 'Clean', desc: 'AI audits your data. One-click fixes. Privacy Shield masks PII.' },
  { icon: '🤖', step: '03', title: 'Model', desc: 'AutoML trains XGBoost, Random Forest, and more. Gemini explains the winner.' },
  { icon: '🚀', step: '04', title: 'Deploy', desc: 'One-click REST API. Copy your endpoint. Drift alerts keep you safe.' },
]

const FEATURES = [
  { icon: <Brain size={20} />, title: 'Gemini AI Guide', desc: 'Natural language data cleaning & model explanations built in.' },
  { icon: <Shield size={20} />, title: 'Privacy Shield', desc: 'Auto-detects and masks PII before data touches the model.' },
  { icon: <Zap size={20} />, title: 'AutoML Race', desc: 'Multiple models train in parallel. Best one wins, automatically.' },
  { icon: <TrendingUp size={20} />, title: 'Drift Watchtower', desc: 'Real-time alerts when your production model starts degrading.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ah-bg text-ah-text font-body">
      {/* ---- Navbar ---- */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-ah">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Analytics Hub" className="w-8 h-8" />
            <span className="font-headline text-lg font-bold text-ah-text">Analytics Hub</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/pricing" className="text-ah-muted hover:text-ah-text text-sm transition-colors">Pricing</Link>
            <Link to="/auth" className="text-ah-muted hover:text-ah-text text-sm transition-colors">Login</Link>
            <Link
              to="/auth"
              className="bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ---- Hero ---- */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-ah-primary-glow border border-[rgba(0,122,255,0.3)] rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-ah-primary rounded-full animate-pulse" />
            <span className="text-ah-primary text-xs font-semibold font-mono uppercase tracking-widest">MVP 2026 — Now Live</span>
          </div>

          {/* Headline */}
          <h1 className="font-headline text-5xl md:text-7xl font-bold leading-tight mb-6">
            The Intelligence in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007AFF] to-[#34D399]">
              Your Data
            </span>
            , Unleashed
          </h1>

          <p className="text-ah-muted text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed">
            From raw CSV to deployed ML model in 30 minutes — not 3 weeks.
            No code. No infrastructure headaches. Just intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-ah-glow hover:shadow-ah-float"
            >
              Start for Free <ArrowRight size={20} />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 bg-ah-surface border border-ah hover:border-ah-primary text-ah-text px-8 py-4 rounded-xl text-lg font-semibold transition-all"
            >
              View Pricing
            </Link>
          </div>

          {/* Trust line */}
          <p className="mt-6 text-ah-subtle text-sm">
            50 free OCUs on signup · No credit card required · Privacy Shield ON by default
          </p>
        </div>
      </section>

      {/* ---- How It Works ---- */}
      <section className="py-24 px-6 bg-ah-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-ah-primary font-mono text-sm uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="font-headline text-4xl font-bold">4 Steps. Real Insights.</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={i} className="relative">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%-12px)] w-6 h-0.5 bg-gradient-to-r from-ah-primary to-transparent z-10" />
                )}
                <div className="bg-ah-surface2 border border-ah rounded-2xl p-6 hover:border-ah-primary transition-colors shadow-ah-card">
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <div className="font-mono text-ah-primary text-xs mb-1">{s.step}</div>
                  <h3 className="font-headline text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-ah-muted text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Key Features ---- */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-ah-primary font-mono text-sm uppercase tracking-widest mb-3">Key Features</p>
            <h2 className="font-headline text-4xl font-bold">Built for the Serious Analyst</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-ah-surface border border-ah rounded-2xl p-6 hover:border-ah-primary hover:shadow-ah-glow transition-all">
                <div className="text-ah-primary mb-4">{f.icon}</div>
                <h3 className="font-headline font-bold mb-2">{f.title}</h3>
                <p className="text-ah-muted text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="py-24 px-6 bg-ah-surface">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-headline text-4xl font-bold mb-6">
            Your data has something to say.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007AFF] to-[#34D399]">
              Let's listen.
            </span>
          </h2>
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {['Automated PII Masking', 'AutoML Leaderboard', 'Explainable AI', 'Drift Alerts', 'One-Click Deploy'].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-ah-muted text-sm">
                <CheckCircle size={14} className="text-ah-success" /> {t}
              </span>
            ))}
          </div>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all shadow-ah-glow"
          >
            Start Building Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="py-8 px-6 border-t border-ah text-center text-ah-subtle text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/assets/logo.png" alt="" className="w-5 h-5 opacity-50" />
          <span>Analytics Hub © 2026</span>
        </div>
        <p>
          Built with ❤️ for the data science community ·{' '}
          <Link to="/auth" className="hover:text-ah-text transition-colors">Login</Link> ·{' '}
          <Link to="/pricing" className="hover:text-ah-text transition-colors">Pricing</Link> ·{' '}
          <Link to="/terms" className="hover:text-ah-text transition-colors">Terms of Service</Link>
        </p>
      </footer>
    </div>
  )
}
