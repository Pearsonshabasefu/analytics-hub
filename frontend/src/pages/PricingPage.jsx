import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ArrowRight, Zap, Shield, Sparkles, ChevronLeft } from 'lucide-react'
import Logo from '../components/common/Logo'
import { useAuthStore } from '../store/authStore'

export default function PricingPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const tiers = [
    {
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      description: 'Ideal for trying out AutoML with your sample CSV or Excel files.',
      features: [
        '50 Free OCUs upon signup',
        'AutoML Fast Race (3 models)',
        'Microsoft Presidio Privacy Shield',
        '1 Production Deployed REST API',
        'Standard Community Support',
      ],
      cta: 'Start Free Now',
      highlighted: false,
    },
    {
      name: 'Pro Analyst',
      price: '$19',
      period: 'per month',
      description: 'For data scientists and analysts deploying models to production.',
      features: [
        '250 OCUs included every month',
        'Deep AutoML (XGBoost, LightGBM, Ensembles)',
        'Full Watchtower Drift Surveillance',
        'Unlimited Deployed REST APIs',
        'Priority Modal GPU Cloud Compute',
        'Resend Email & Webhook Drift Alerts',
      ],
      cta: 'Upgrade to Pro',
      highlighted: true,
    },
    {
      name: 'Team / Enterprise',
      price: 'Custom',
      period: 'tailored',
      description: 'For organizations with stringent VPC and compliance needs.',
      features: [
        'Dedicated isolated Modal & Supabase instances',
        'Private Snowflake, BigQuery & AWS S3 links',
        'Custom PII entity recognition models',
        'Enterprise SLA & Dedicated Support',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen bg-ah-bg text-ah-text">
      {/* Top Navbar */}
      <nav className="glass border-b border-ah sticky top-0 z-30 px-6 h-16 flex items-center justify-between">
        <Logo size="default" />
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-ah-glow flex items-center gap-1.5"
            >
              <span>Dashboard</span>
            </Link>
          ) : (
            <>
              <Link to="/auth" className="text-sm text-ah-muted hover:text-ah-text">Sign In</Link>
              <Link
                to="/auth"
                className="bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-ah-glow"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-ah-primary font-mono text-xs uppercase tracking-widest mb-3">Transparent Economics</p>
          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold mb-4">
            Pay Only for the Compute You Use
          </h1>
          <p className="text-ah-muted text-base">
            No monthly lock-ins. Top up Operations Compute Units (OCUs) whenever you need to train or deploy.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-ah-surface border rounded-3xl p-8 flex flex-col justify-between transition-all ${
                tier.highlighted
                  ? 'border-ah-primary shadow-ah-glow relative'
                  : 'border-ah hover:border-ah-border'
              }`}
            >
              <div>
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-ah-primary text-white text-[10px] font-mono uppercase px-3 py-1 rounded-full font-bold shadow-md">
                    Most Popular
                  </div>
                )}
                <h3 className="font-headline font-bold text-xl mb-1">{tier.name}</h3>
                <p className="text-xs text-ah-muted mb-6 leading-relaxed">{tier.description}</p>

                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="font-headline text-4xl font-extrabold">{tier.price}</span>
                  <span className="text-xs text-ah-subtle font-mono">/ {tier.period}</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-ah mb-8">
                  {tier.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs text-ah-muted">
                      <Check size={15} className="text-green-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/auth')}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                  tier.highlighted
                    ? 'bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white shadow-ah-glow'
                    : 'bg-ah-surface2 hover:bg-ah-surface3 text-ah-text border border-ah'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Trust banner */}
        <div className="bg-ah-surface border border-ah rounded-2xl p-6 text-center text-xs text-ah-subtle">
          Payments processed securely with instant confirmation. Supported in 30+ currencies (USD, EUR, GBP, NGN, KES, ZAR).
        </div>
      </div>
    </div>
  )
}
