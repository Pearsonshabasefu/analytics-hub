import { Link } from 'react-router-dom'
import { ArrowLeft, FileCheck, Shield, Lock, Server, CheckCircle2, AlertCircle } from 'lucide-react'
import Logo from '../components/common/Logo'

export default function DpaPage() {
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
            <FileCheck size={13} className="text-ah-primary" />
            <span className="text-ah-primary text-xs font-semibold font-mono uppercase tracking-widest">
              Enterprise Governance
            </span>
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Data Processing Agreement (DPA)
          </h1>
          <p className="text-sm text-ah-muted font-mono">
            Effective Date: September 22, 2026 • Governing Controller-Processor Relationships
          </p>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-ah-surface border border-ah rounded-2xl p-4.5">
            <Shield size={20} className="text-ah-primary mb-2" />
            <h4 className="font-headline font-bold text-sm mb-1">Controller-Processor Scope</h4>
            <p className="text-xs text-ah-muted">You are the Data Controller; RefineIQ acts solely as a secure Data Processor on your instructions.</p>
          </div>
          <div className="bg-ah-surface border border-ah rounded-2xl p-4.5">
            <Lock size={20} className="text-emerald-400 mb-2" />
            <h4 className="font-headline font-bold text-sm mb-1">72-Hour Breach SLA</h4>
            <p className="text-xs text-ah-muted">Immediate statutory notification within 72 hours of any confirmed security incident.</p>
          </div>
          <div className="bg-ah-surface border border-ah rounded-2xl p-4.5">
            <Server size={20} className="text-purple-400 mb-2" />
            <h4 className="font-headline font-bold text-sm mb-1">Standard Contractual Clauses</h4>
            <p className="text-xs text-ah-muted">Pre-signed EU SCCs & UK IDTA covering cross-border data transfers and storage.</p>
          </div>
        </div>

        {/* Legal Text Content */}
        <div className="space-y-10 text-sm leading-relaxed text-ah-text">
          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white border-b border-ah pb-2">
              1. Purpose & Application
            </h2>
            <p className="text-ah-muted">
              This Data Processing Agreement (&quot;<strong>DPA</strong>&quot;) governs the processing of Personal Data by RefineIQ on behalf of Customer in connection with the RefineIQ machine learning platform. This DPA supplements the RefineIQ <Link to="/terms" className="text-ah-primary hover:underline">Terms of Service</Link> and applies to all Customer Data processed within the Services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white border-b border-ah pb-2">
              2. Technical & Organizational Measures (TOMs)
            </h2>
            <p className="text-ah-muted">
              RefineIQ enforces defense-in-depth security measures to protect Customer Data from unauthorized destruction, loss, alteration, or access:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-ah-surface border border-ah p-3.5 rounded-xl space-y-1">
                <span className="font-semibold text-white flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> AES-256 Encryption at Rest</span>
                <p className="text-ah-muted">All database clusters, object storage buckets, and backups are encrypted using industry-standard AES-256 keys.</p>
              </div>
              <div className="bg-ah-surface border border-ah p-3.5 rounded-xl space-y-1">
                <span className="font-semibold text-white flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> TLS 1.3 in Transit</span>
                <p className="text-ah-muted">All web, API, and webhook traffic is strictly mandated over TLS 1.3 / 256-bit SSL encryption.</p>
              </div>
              <div className="bg-ah-surface border border-ah p-3.5 rounded-xl space-y-1">
                <span className="font-semibold text-white flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> Row-Level Security (RLS)</span>
                <p className="text-ah-muted">Logical multi-tenant isolation enforced directly in the database layer. No cross-tenant data leakage is physically possible.</p>
              </div>
              <div className="bg-ah-surface border border-ah p-3.5 rounded-xl space-y-1">
                <span className="font-semibold text-white flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> Automated PII Masking</span>
                <p className="text-ah-muted">Integrated Microsoft Presidio engine redacts personally identifiable records prior to algorithmic model dispatch.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white border-b border-ah pb-2">
              3. Authorized Subprocessor Directory
            </h2>
            <p className="text-ah-muted">
              Customer grants general written authorization for RefineIQ to engage the following vetted subprocessors:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-ah rounded-xl overflow-hidden">
                <thead className="bg-ah-surface2 text-ah-muted uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Subprocessor</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Jurisdiction</th>
                    <th className="p-3">Transfer Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ah font-mono text-zinc-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Supabase Inc.</td>
                    <td className="p-3">PostgreSQL Database, Auth, Storage</td>
                    <td className="p-3">USA / EU</td>
                    <td className="p-3 text-emerald-400">EU SCCs, ZDPA Compliance</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Vercel Inc.</td>
                    <td className="p-3">Edge Delivery, CDN Routing</td>
                    <td className="p-3">Global</td>
                    <td className="p-3 text-emerald-400">EU SCCs, ISO 27001</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Render Services Inc.</td>
                    <td className="p-3">FastAPI ML Inference & Training</td>
                    <td className="p-3">USA</td>
                    <td className="p-3 text-emerald-400">SOC 2 Type II, DPA</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Google LLC (AI Studio)</td>
                    <td className="p-3">Explainability summaries (schema metadata only)</td>
                    <td className="p-3">USA</td>
                    <td className="p-3 text-emerald-400">Google Cloud DPA</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Authorized Payment Gateways</td>
                    <td className="p-3">PCI-DSS Tokenized Payments (Cards & Mobile Money)</td>
                    <td className="p-3">Global / Regional</td>
                    <td className="p-3 text-emerald-400">PCI-DSS Level 1</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-ah-muted mt-2">
              RefineIQ will notify Customer at least thirty (30) days prior to adding or replacing any subprocessor.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white border-b border-ah pb-2">
              4. Security Incident & 72-Hour Breach Notification
            </h2>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1.5">
              <p className="font-bold flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-400" />
                Prompt Incident Response Protocol
              </p>
              <p className="text-xs text-zinc-300 leading-relaxed">
                In the event of a confirmed security incident impacting Customer Personal Data, RefineIQ will notify Customer without undue delay and in any event within <strong>72 hours</strong>. The notice will describe the nature of the breach, affected records, estimated consequences, and immediate remedial steps undertaken.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-xl font-bold text-white border-b border-ah pb-2">
              5. Deletion & Return of Data
            </h2>
            <p className="text-ah-muted">
              Customer maintains full control over data retention. Datasets and trained models can be permanently deleted at any time via the web application. 
              Upon account termination, all remaining Customer Data will be permanently wiped from production volumes within thirty (30) days.
            </p>
          </section>
        </div>

        {/* Footer Nav */}
        <div className="mt-16 pt-8 border-t border-ah flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ah-muted">
          <p>© 2026 RefineIQ Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-ah-text transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-ah-text transition-colors">Terms of Service</Link>
            <Link to="/pricing" className="hover:text-ah-text transition-colors">Pricing</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
