import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, FileText, Scale, Lock, Cpu, AlertTriangle } from 'lucide-react'
import Logo from '../components/common/Logo'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ah-bg text-ah-text font-body">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-ah">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="default" to="/" />
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs text-ah-muted hover:text-ah-text transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <Link
              to="/auth"
              className="bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-ah-glow"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <div className="border-b border-ah pb-8 mb-10">
          <div className="inline-flex items-center gap-2 bg-ah-primary-glow border border-[rgba(0,122,255,0.3)] rounded-full px-3.5 py-1 mb-4">
            <Scale size={13} className="text-ah-primary" />
            <span className="text-ah-primary text-xs font-semibold font-mono uppercase tracking-widest">
              Legal Agreement
            </span>
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Terms and Conditions of Service
          </h1>
          <p className="text-sm text-ah-muted font-mono">
            Last Updated: September 10, 2026 • Effective Date: September 10, 2026
          </p>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-ah-surface border border-ah rounded-2xl p-4.5">
            <Shield size={20} className="text-ah-primary mb-2" />
            <h4 className="font-headline font-bold text-sm mb-1">100% Data Ownership</h4>
            <p className="text-xs text-ah-muted">You own your raw datasets, models, and trained weight artifacts.</p>
          </div>
          <div className="bg-ah-surface border border-ah rounded-2xl p-4.5">
            <Lock size={20} className="text-purple-400 mb-2" />
            <h4 className="font-headline font-bold text-sm mb-1">Privacy Shield</h4>
            <p className="text-xs text-ah-muted">Microsoft Presidio automatically redacts PII before model training.</p>
          </div>
          <div className="bg-ah-surface border border-ah rounded-2xl p-4.5">
            <Cpu size={20} className="text-green-400 mb-2" />
            <h4 className="font-headline font-bold text-sm mb-1">OCU Metering</h4>
            <p className="text-xs text-ah-muted">Pay-as-you-go compute units processed via secure Flutterwave gateways.</p>
          </div>
        </div>

        {/* Agreement Body */}
        <div className="space-y-10 text-sm leading-relaxed text-ah-muted">
          <section>
            <h2 className="font-headline text-xl font-bold text-ah-text mb-3">1. Description of Service & Business Model</h2>
            <p>
              RefineIQ provides a B2B automated machine learning (AutoML) and data science workspace. The Service enables authorized customers to connect tabular data (CSV, Excel, SQL, Cloud Warehouses), automate data hygiene, strip personally identifiable information, train parallel algorithms (including XGBoost and Random Forest), deploy low-latency prediction endpoints, and track inference drift.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-xl font-bold text-ah-text mb-3">2. Accounts, Authentication & Access</h2>
            <p className="mb-2">
              Access is provisioned through secure passwordless magic link email or single sign-on (SSO). You are strictly responsible for maintaining control of your authentication tokens and API secret keys (<code className="text-xs text-ah-primary bg-ah-surface2 px-1.5 py-0.5 rounded font-mono">ah_live_*</code>).
            </p>
            <p>
              You agree to notify RefineIQ immediately if you suspect any unauthorized access or compromise of your credentials.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-xl font-bold text-ah-text mb-3">3. Subscriptions, Operations Compute Units (OCUs) & Billing</h2>
            <p className="mb-2">
              The Service operates on seat subscriptions and usage-based <strong>Operations Compute Units (OCUs)</strong>. OCUs quantify computing resources consumed during data profiling, distributed cloud training, and micro-instance hosting.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-ah-text">
              <li><strong>Payment Gateway:</strong> All credit top-ups and recurring subscriptions are processed via <strong>Flutterwave</strong> in your designated currency.</li>
              <li><strong>Spend Guardrails:</strong> Users may specify maximum spend caps per training run in their workspace settings.</li>
              <li><strong>Auto Top-Up:</strong> If toggled active, the platform will automatically charge your saved Flutterwave payment method for 50 OCUs when your balance falls below 10 OCUs.</li>
              <li><strong>No Refunds:</strong> Except where required by mandatory consumer statutes, all purchased compute units and subscription fees are non-refundable.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline text-xl font-bold text-ah-text mb-3">4. Customer Data Ownership & Intellectual Property</h2>
            <div className="bg-ah-surface2 border border-ah rounded-xl p-4 text-xs mb-3 text-ah-text">
              <strong>Core Guarantee:</strong> You retain 100% exclusive intellectual property ownership of all customer datasets, uploaded files, and derivative trained model weights. RefineIQ claims zero ownership over your data.
            </div>
            <p>
              You grant RefineIQ only the limited, revocable license necessary to ingest, compute, and host your models on your behalf. RefineIQ retains all proprietary rights to its platform code, algorithms, visual components, and system software.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-xl font-bold text-ah-text mb-3">5. Privacy Shield & Automated PII Redaction</h2>
            <p className="mb-2">
              Our automated Privacy Shield integrates Microsoft Presidio algorithms to identify, flag, and hash customer personal data (such as emails, telephone numbers, and residential addresses).
            </p>
            <p>
              You certify that your collection of input data satisfies applicable privacy statutes (GDPR, CCPA, NDPR). RefineIQ enforces architectural guardrails preventing raw user rows from being transmitted to third-party public foundation model APIs.
            </p>
          </section>

          <section>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 mb-4">
              <div className="flex items-center gap-2 text-yellow-400 font-bold mb-2">
                <AlertTriangle size={18} />
                <h3 className="font-headline text-sm uppercase tracking-wide">6. AI Output & Model Accuracy Disclaimer</h3>
              </div>
              <p className="text-xs text-yellow-200/90 leading-relaxed">
                Machine learning models and statistical recommendations generated by the platform are probabilistic in nature. RefineIQ does not warrant that model forecasts or classifications will achieve specific financial, operational, or business outcomes. You are solely responsible for verifying and testing models prior to deployment in high-consequence environments.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-xl font-bold text-ah-text mb-3">7. Acceptable Use Policy</h2>
            <p>
              You agree not to upload non-consensual biometric data, train discriminatory credit screening algorithms, tamper with compute meters, execute denial-of-service tests, or reverse-engineer the proprietary platform backend.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-xl font-bold text-ah-text mb-3">8. Limitation of Liability</h2>
            <p className="uppercase text-xs text-ah-subtle font-mono leading-normal">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, REFINEIQ SHALL NOT BE LIABLE FOR INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS OR DEFECTIVE PREDICTIONS. OUR AGGREGATE LIABILITY FOR ANY CLAIM SHALL NOT EXCEED THE TOTAL FEES PAID BY YOU DURING THE PRIOR TWELVE (12) MONTHS.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-xl font-bold text-ah-text mb-3">9. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms are governed by and construed under the laws of the State of Delaware, United States. Any dispute arising out of or relating to these Terms shall be resolved exclusively through binding confidential arbitration administered by the American Arbitration Association (AAA).
            </p>
          </section>

          <section className="border-t border-ah pt-6">
            <h2 className="font-headline text-base font-bold text-ah-text mb-2">10. Contact & Inquiries</h2>
            <p className="text-xs">
              For questions regarding these Terms, contact our legal desk at{' '}
              <a href="mailto:legal@refineiq.ai" className="text-ah-primary hover:underline">
                legal@refineiq.ai
              </a>{' '}
              or report directly through the in-app Magic Ear 👂 feedback tool.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-ah text-center text-ah-subtle text-xs">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/assets/logo.png" alt="" className="w-4 h-4 opacity-50" />
          <span>RefineIQ © 2026. All rights reserved.</span>
        </div>
        <p>
          <Link to="/" className="hover:text-ah-text transition-colors">Home</Link> •{' '}
          <Link to="/pricing" className="hover:text-ah-text transition-colors">Pricing</Link> •{' '}
          <Link to="/terms" className="text-ah-primary">Terms of Service</Link>
        </p>
      </footer>
    </div>
  )
}
