import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Lock, Globe2, Eye, Server, FileCheck, CheckCircle2 } from 'lucide-react'
import Logo from '../components/common/Logo'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ah-bg text-ah-text font-body">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-ah">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="default" />
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
            <Shield size={13} className="text-ah-primary" />
            <span className="text-ah-primary text-xs font-semibold font-mono uppercase tracking-widest">
              Data Privacy & Governance
            </span>
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Global Privacy Policy
          </h1>
          <p className="text-sm text-ah-muted font-mono">
            Last Updated: September 22, 2026 • Effective Date: September 22, 2026
          </p>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-ah-surface border border-ah rounded-2xl p-4.5">
            <Lock size={20} className="text-emerald-400 mb-2" />
            <h4 className="font-headline font-bold text-sm mb-1">Zero Training on Your Data</h4>
            <p className="text-xs text-ah-muted">We never use your uploaded datasets or proprietary models to train foundation AI models.</p>
          </div>
          <div className="bg-ah-surface border border-ah rounded-2xl p-4.5">
            <Eye size={20} className="text-purple-400 mb-2" />
            <h4 className="font-headline font-bold text-sm mb-1">Automated PII Shield</h4>
            <p className="text-xs text-ah-muted">Microsoft Presidio automatically detects and redacts personal identifiers before training.</p>
          </div>
          <div className="bg-ah-surface border border-ah rounded-2xl p-4.5">
            <Globe2 size={20} className="text-cyan-400 mb-2" />
            <h4 className="font-headline font-bold text-sm mb-1">Multi-Jurisdiction Compliance</h4>
            <p className="text-xs text-ah-muted">Built for Zambia DPA 2021, EU GDPR, UK GDPR, and California CCPA/CPRA standards.</p>
          </div>
        </div>

        {/* Legal Text Content */}
        <div className="space-y-10 text-sm leading-relaxed text-ah-text">
          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white border-b border-ah pb-2">
              1. Scope & Legal Roles (Controller vs. Processor)
            </h2>
            <p className="text-ah-muted">
              RefineIQ (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to transparent, lawful data processing. 
              Under global data protection legislation including the <strong>Zambia Data Protection Act No. 3 of 2021 (ZDPA)</strong>, 
              the <strong>EU General Data Protection Regulation (GDPR)</strong>, and the <strong>UK Data Protection Act 2018</strong>:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-ah-muted ml-2">
              <li><strong>RefineIQ as Data Controller:</strong> We control user account registration credentials, billing records, transaction logs, and platform telemetry.</li>
              <li><strong>RefineIQ as Data Processor:</strong> For any tabular datasets, files, or customer spreadsheets uploaded by you into Refinery, Ingest, or Studio, <strong>you act as the Data Controller</strong> and RefineIQ acts solely as a Data Processor pursuant to our <Link to="/dpa" className="text-ah-primary hover:underline">Data Processing Agreement (DPA)</Link>.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white border-b border-ah pb-2">
              2. Personal Data We Collect
            </h2>
            <p className="text-ah-muted">We process the following categories of information:</p>
            <div className="bg-ah-surface border border-ah rounded-2xl p-4 space-y-2 font-mono text-xs">
              <p><span className="text-ah-primary font-semibold">Identity Data:</span> Full name, email address, OAuth provider IDs (Google, GitHub).</p>
              <p><span className="text-ah-primary font-semibold">Billing Data:</span> Currency preference (USD, EUR, GBP, ZMW), transaction reference IDs, tokenized payment references, and mobile money phone numbers (for MTN MoMo and Airtel Money). <em>No raw credit card PAN or CVV is stored on our servers.</em></p>
              <p><span className="text-ah-primary font-semibold">Customer Upload Data:</span> Tabular CSV and spreadsheet files uploaded for data cleaning, profiling, and model training.</p>
              <p><span className="text-ah-primary font-semibold">Technical Telemetry:</span> IP address, browser user-agent, session duration, and API inference latencies.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white border-b border-ah pb-2">
              3. Absolute Commitment on Machine Learning Data
            </h2>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 space-y-1.5">
              <p className="font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                Customer Data Isolation & No Foundation Model Training
              </p>
              <p className="text-xs text-zinc-300 leading-relaxed">
                RefineIQ will never sell, lease, or monetize your uploaded datasets or trained model weight artifacts. 
                Your customer datasets and trained machine learning models are strictly partitioned via PostgreSQL Row-Level Security (RLS) 
                and are never used to train public foundation models or shared across customer organizations.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white border-b border-ah pb-2">
              4. Third-Party Subprocessors
            </h2>
            <p className="text-ah-muted">
              To deliver high-availability cloud infrastructure and payment settlement, RefineIQ shares data with vetted subprocessors bound by Standard Contractual Clauses (SCCs):
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-ah rounded-xl overflow-hidden">
                <thead className="bg-ah-surface2 text-ah-muted uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Subprocessor</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Safeguard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ah font-mono text-zinc-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Supabase Inc.</td>
                    <td className="p-3">PostgreSQL Database, Auth, Encrypted Storage</td>
                    <td className="p-3">USA / EU (AWS)</td>
                    <td className="p-3 text-emerald-400">SCCs, DPA</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Vercel Inc.</td>
                    <td className="p-3">Edge CDN & Web Routing</td>
                    <td className="p-3">Global Edge</td>
                    <td className="p-3 text-emerald-400">SCCs, DPA</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Render Services Inc.</td>
                    <td className="p-3">FastAPI Machine Learning Compute Engine</td>
                    <td className="p-3">USA</td>
                    <td className="p-3 text-emerald-400">SCCs, DPA</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Google LLC (AI Studio)</td>
                    <td className="p-3">Model explainability summaries (schema only, no raw PII)</td>
                    <td className="p-3">USA</td>
                    <td className="p-3 text-emerald-400">Google Cloud DPA</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Authorized Payment Gateways</td>
                    <td className="p-3">Credit Card Settlement & Zambian Mobile Money</td>
                    <td className="p-3">Global / Regional</td>
                    <td className="p-3 text-emerald-400">PCI-DSS Level 1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white border-b border-ah pb-2">
              5. Global Privacy Rights (ZDPA, GDPR, CCPA)
            </h2>
            <p className="text-ah-muted">
              Regardless of where you reside, RefineIQ guarantees the following statutory data privacy rights:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-ah-muted ml-2">
              <li><strong>Right of Access & Portability:</strong> Request an export copy of all datasets, models, and personal data linked to your account.</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate profile data.</li>
              <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request the permanent deletion of your account and associated storage volumes within thirty (30) days.</li>
              <li><strong>Right to Object or Restrict Processing:</strong> Opt out of optional analytics and non-essential telemetry.</li>
            </ul>
            <p className="text-xs text-ah-muted mt-2">
              To exercise any statutory privacy rights, email our Data Privacy Officer at <span className="text-ah-primary font-mono">privacy@refineiq.ai</span>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white border-b border-ah pb-2">
              6. Supervisory Authorities
            </h2>
            <p className="text-ah-muted">
              If you have unresolved concerns regarding how your data is handled, you may lodge a complaint with:
            </p>
            <ul className="list-disc list-inside space-y-1 text-ah-muted ml-2 text-xs">
              <li><strong>Zambia:</strong> Office of the Data Protection Commissioner (ODPC) / INICTA, Lusaka, Zambia.</li>
              <li><strong>European Union:</strong> Your local EU member-state Data Protection Authority under the EDPB.</li>
              <li><strong>United Kingdom:</strong> Information Commissioner&apos;s Office (ICO) (<a href="https://ico.org.uk" target="_blank" rel="noreferrer" className="text-ah-primary underline">ico.org.uk</a>).</li>
              <li><strong>United States:</strong> California Privacy Protection Agency (CPPA) or your state Attorney General.</li>
            </ul>
          </section>
        </div>

        {/* Footer Nav */}
        <div className="mt-16 pt-8 border-t border-ah flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ah-muted">
          <p>© 2026 RefineIQ Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-ah-text transition-colors">Terms of Service</Link>
            <Link to="/dpa" className="hover:text-ah-text transition-colors">Data Processing Agreement</Link>
            <Link to="/pricing" className="hover:text-ah-text transition-colors">Pricing</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
