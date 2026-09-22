import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck, Calendar, Globe, Database, Award, CheckCircle2,
  ChevronLeft, Download, ExternalLink, Sliders, Server, Lock, Clock
} from 'lucide-react'
import Logo from '../components/common/Logo'

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState('matrix') // 'matrix' | 'calendar' | 'subprocessors' | 'vanta'

  const handleOpenCookiePreferences = () => {
    window.dispatchEvent(new CustomEvent('refineiq-open-cookie-preferences'))
  }

  const handleDownloadManifesto = () => {
    const markdownContent = `# RefineIQ Enterprise Compliance Guide & Governance Manifesto
Generated: ${new Date().toISOString()}

## 1. Multi-Jurisdiction Regulatory Matrix
- Zambia: Data Protection Act, 2021 (ZDPA) — Office of the Data Protection Commissioner (ODPC)
- European Union: General Data Protection Regulation (EU GDPR) 2016/679 & ePrivacy Directive
- United Kingdom: UK GDPR & Data Protection Act 2018 — Information Commissioner's Office (ICO)
- United States: California Consumer Privacy Act / CPRA (CCPA/CPRA)
- South Africa: Protection of Personal Information Act (POPIA)
- Kenya: Data Protection Act 2019 — Office of the Data Protection Commissioner (ODPC Kenya)

## 2. 90-Day Compliance Calendar
- Phase 1 (Days 1–30): Foundation, PII Masking, Cookie Preference Center & DPA Execution
- Phase 2 (Days 31–60): Cross-Border Data Transfer Assessments & Subprocessor Hardening
- Phase 3 (Days 61–90): Third-Party SOC 2 Type I Readiness & Automated Auditor Telemetry

## 3. Subprocessor Transparency & Data Residency
- Supabase: PostgreSQL & Vault (AWS us-east-1 / eu-central-1)
- Modal Labs: Serverless GPU Compute (US East, encrypted in transit & at rest)
- Vercel: Global Anycast CDN Edge with strict CSP and anti-clickjacking
- Google Cloud: Gemini Explainer via ephemeral stateless API
- Payment Gateway: PCI-DSS Level 1 compliant gateway (USD, EUR, GBP, ZMW)

RefineIQ Platform Compliance Office — legal@refineiq.ai
`
    const blob = new Blob([markdownContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `RefineIQ_Compliance_Manifesto_${new Date().toISOString().slice(0, 10)}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const jurisdictions = [
    {
      country: 'Zambia',
      flag: '🇿🇲',
      law: 'Data Protection Act No. 3 of 2021',
      authority: 'Office of the Data Protection Commissioner (ODPC)',
      residency: 'Cross-border transfer permitted under Section 43 with user consent or adequate safeguards',
      reviewDate: 'Oct 15, 2026',
      status: 'Compliant',
    },
    {
      country: 'European Union',
      flag: '🇪🇺',
      law: 'General Data Protection Regulation (EU GDPR 2016/679)',
      authority: 'European Data Protection Board (EDPB) & National DPAs',
      residency: 'Standard Contractual Clauses (SCCs 2021/914) & PII scrubbing prior to inference',
      reviewDate: 'Nov 01, 2026',
      status: 'Compliant',
    },
    {
      country: 'United Kingdom',
      flag: '🇬🇧',
      law: 'UK GDPR & Data Protection Act 2018',
      authority: "Information Commissioner's Office (ICO)",
      residency: 'UK International Data Transfer Agreement (IDTA) / UK Addendum',
      reviewDate: 'Nov 15, 2026',
      status: 'Compliant',
    },
    {
      country: 'United States',
      flag: '🇺🇸',
      law: 'California Consumer Privacy Act (CCPA / CPRA)',
      authority: 'California Privacy Protection Agency (CPPA)',
      residency: 'Right to delete, know, and strict "Do Not Sell/Share My Data" opt-out guarantee',
      reviewDate: 'Dec 01, 2026',
      status: 'Compliant',
    },
    {
      country: 'South Africa',
      flag: '🇿🇦',
      law: 'Protection of Personal Information Act (POPIA No. 4 of 2013)',
      authority: 'Information Regulator South Africa',
      residency: 'Section 72 Cross-border flow binding contracts and opt-in direct marketing rules',
      reviewDate: 'Dec 15, 2026',
      status: 'Compliant',
    },
    {
      country: 'Kenya',
      flag: '🇰🇪',
      law: 'Data Protection Act No. 24 of 2019',
      authority: 'Office of the Data Protection Commissioner (ODPC Kenya)',
      residency: 'Statutory registration for commercial data processors handling sensitive attributes',
      reviewDate: 'Jan 05, 2027',
      status: 'Compliant',
    },
  ]

  const calendarPhases = [
    {
      phase: 'Phase 1: Foundation & Transparency',
      days: 'Days 1 – 30',
      badge: 'Active & Enforced',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      milestones: [
        'Enforce Microsoft Presidio real-time PII anonymization in Data Refinery.',
        'Implement ePrivacy & GDPR Cookie Preference Center with granular consent.',
        'Publish formal Data Processing Agreement (DPA) with pre-signed SCCs.',
        'Deploy HTTP Content-Security-Policy & X-Frame-Options clickjacking barriers.',
      ],
    },
    {
      phase: 'Phase 2: Subprocessor & Cross-Border Auditing',
      days: 'Days 31 – 60',
      badge: 'In Progress',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      milestones: [
        'Complete Data Transfer Impact Assessments (DTIAs) for AWS and Modal workloads.',
        'Formalize statutory registration with the Zambian Data Protection Commissioner (ODPC).',
        'Configure least-privilege IAM roles and deployment IP subnet whitelisting.',
        'Conduct automated quarterly vulnerability scans across edge API endpoints.',
      ],
    },
    {
      phase: 'Phase 3: SOC 2 Readiness & Continuous Telemetry',
      days: 'Days 61 – 90',
      badge: 'Scheduled',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      milestones: [
        'Connect cloud infrastructure (Supabase, Vercel, GitHub) to Vanta compliance agent.',
        'Undergo independent CPA audit for AICPA SOC 2 Type I certification.',
        'Publish public Real-Time Trust Report and SLA Watchtower telemetry dashboard.',
        'Issue annual compliance certificate to enterprise procurement partners.',
      ],
    },
  ]

  const subprocessors = [
    {
      name: 'Supabase Inc.',
      purpose: 'Managed PostgreSQL, User Auth, and Encrypted Row Storage',
      location: 'AWS us-east-1 (N. Virginia) / eu-central-1 (Frankfurt)',
      certifications: 'SOC 2 Type II, ISO 27001, HIPAA compliant',
      transferMechanism: 'EU Standard Contractual Clauses (SCCs)',
    },
    {
      name: 'Modal Labs Inc.',
      purpose: 'Stateless Serverless GPU Compute & AutoML Tournament Execution',
      location: 'US East (N. Virginia), Ephemeral runtime storage',
      certifications: 'SOC 2 Type II compliant infrastructure',
      transferMechanism: 'Direct Processing Addendum with Zero Data Retention',
    },
    {
      name: 'Vercel Inc.',
      purpose: 'Global Anycast Edge CDN, Route Firewall & Anti-DDoS Filtering',
      location: 'Global Anycast Edge (Closest POP to client)',
      certifications: 'SOC 2 Type II, ISO 27001',
      transferMechanism: 'EU SCCs & UK Addendum',
    },
    {
      name: 'Google Cloud Platform',
      purpose: 'Gemini AI Model Guidance & Explanation Synthesis',
      location: 'Stateless API (No customer data used for model training)',
      certifications: 'SOC 2 Type II, ISO 27001, FedRAMP High',
      transferMechanism: 'Google Cloud Enterprise DPA',
    },
    {
      name: 'Tier-1 Payment Gateways',
      purpose: 'PCI-DSS Level 1 Multi-Currency Card & Mobile Money Processing',
      location: 'Global PCI-DSS Secure Enclaves (USD, EUR, GBP, ZMW)',
      certifications: 'PCI-DSS Level 1 Service Provider',
      transferMechanism: 'Direct Merchant Settlement Agreements',
    },
  ]

  return (
    <div className="min-h-screen bg-ah-bg text-ah-text">
      {/* Top Navbar */}
      <nav className="glass border-b border-ah sticky top-0 z-30 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="w-8 h-8 rounded-xl bg-ah-surface border border-ah flex items-center justify-center text-ah-muted hover:text-ah-text hover:border-ah-primary transition-all"
          >
            <ChevronLeft size={16} />
          </Link>
          <Logo size="default" />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadManifesto}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ah-surface border border-ah text-xs font-semibold hover:border-ah-primary transition-all text-ah-text"
          >
            <Download size={13} />
            <span>Download Manifesto</span>
          </button>
          <button
            onClick={handleOpenCookiePreferences}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ah-surface2 border border-ah text-xs font-semibold hover:border-ah-primary transition-all text-ah-text"
          >
            <Sliders size={13} />
            <span>Cookie Choices</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-4">
            <ShieldCheck size={14} /> Global Trust & Compliance Center
          </div>
          <h1 className="font-headline text-3xl sm:text-5xl font-extrabold mb-4 text-white">
            Enterprise Governance, Privacy & Security
          </h1>
          <p className="text-ah-muted text-sm sm:text-base leading-relaxed">
            RefineIQ adheres to strict statutory privacy frameworks worldwide — including Zambia (ZDPA 2021), the European Union (GDPR), United Kingdom (UK GDPR), and the United States (CCPA/CPRA). Customer datasets remain strictly isolated, encrypted, and non-trainable by external models.
          </p>
        </div>

        {/* Quick Compliance Navigation Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {[
            { id: 'matrix', label: '🌍 Regulatory Matrix', icon: Globe },
            { id: 'calendar', label: '📅 90-Day Calendar', icon: Calendar },
            { id: 'subprocessors', label: '🏢 Subprocessors & Residency', icon: Server },
            { id: 'vanta', label: '🛡️ Compliance Automation (Vanta)', icon: Award },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-ah-primary text-white shadow-ah-glow'
                  : 'bg-ah-surface border border-ah text-ah-muted hover:text-ah-text hover:border-ah-primary/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Multi-Jurisdiction Regulatory Matrix */}
        {activeTab === 'matrix' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-ah-surface border border-ah rounded-2xl p-5 shadow-ah-card">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="font-headline font-bold text-lg text-white">Global Jurisdiction Matrix & Review Dates</h3>
                  <p className="text-xs text-ah-muted mt-0.5">Live statutory references, regulatory authorities, and scheduled audit cadences.</p>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20 font-bold">
                  All Jurisdictions Active
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-ah-surface2 text-ah-muted border-b border-ah">
                    <tr>
                      <th className="py-3 px-4">Jurisdiction</th>
                      <th className="py-3 px-4">Statutory Act</th>
                      <th className="py-3 px-4">Supervisory Authority</th>
                      <th className="py-3 px-4">Data Residency & Safeguards</th>
                      <th className="py-3 px-4">Next Review</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ah">
                    {jurisdictions.map((j) => (
                      <tr key={j.country} className="hover:bg-ah-surface2/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                          <span className="mr-2 text-base">{j.flag}</span>
                          {j.country}
                        </td>
                        <td className="py-3.5 px-4 text-ah-text">{j.law}</td>
                        <td className="py-3.5 px-4 text-ah-muted">{j.authority}</td>
                        <td className="py-3.5 px-4 text-ah-muted max-w-xs">{j.residency}</td>
                        <td className="py-3.5 px-4 text-ah-primary font-bold whitespace-nowrap">{j.reviewDate}</td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                            {j.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 90-Day Compliance Calendar */}
        {activeTab === 'calendar' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-ah-surface border border-ah rounded-2xl p-6 shadow-ah-card">
              <h3 className="font-headline font-bold text-lg text-white mb-1">90-Day Compliance Roadmap</h3>
              <p className="text-xs text-ah-muted mb-6">Structured phased milestones ensuring enterprise audit readiness across Africa, Europe, and the Americas.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {calendarPhases.map((phase) => (
                  <div key={phase.phase} className="bg-ah-surface2 border border-ah rounded-2xl p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono font-bold text-ah-primary">{phase.days}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${phase.badgeColor} font-semibold`}>
                          {phase.badge}
                        </span>
                      </div>
                      <h4 className="font-headline font-bold text-sm text-white mb-4">{phase.phase}</h4>
                      <ul className="space-y-2.5">
                        {phase.milestones.map((m, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-ah-muted leading-relaxed">
                            <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Subprocessors & Data Residency */}
        {activeTab === 'subprocessors' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-ah-surface border border-ah rounded-2xl p-6 shadow-ah-card">
              <h3 className="font-headline font-bold text-lg text-white mb-1">Authorized Subprocessor Transparency</h3>
              <p className="text-xs text-ah-muted mb-6">Every third party touching any telemetry or metadata operates under rigorous contractual DPA and SCC safeguards.</p>

              <div className="space-y-4">
                {subprocessors.map((sub) => (
                  <div key={sub.name} className="p-4 rounded-xl bg-ah-surface2 border border-ah flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{sub.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ah-primary/10 text-ah-primary border border-ah-primary/20">
                          {sub.certifications}
                        </span>
                      </div>
                      <p className="text-xs text-ah-text">{sub.purpose}</p>
                      <p className="text-[11px] text-ah-muted font-mono flex items-center gap-1">
                        <Server size={11} className="text-zinc-400" />
                        Region: {sub.location}
                      </p>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] font-mono text-zinc-400 block uppercase">Transfer Safeguard</span>
                      <span className="text-xs font-semibold text-emerald-400">{sub.transferMechanism}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Compliance Automation Evaluation */}
        {activeTab === 'vanta' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-ah-surface border border-ah rounded-2xl p-6 shadow-ah-card space-y-6">
              <div>
                <h3 className="font-headline font-bold text-lg text-white mb-1">Compliance Automation Assessment</h3>
                <p className="text-xs text-ah-muted">Evaluation of leading compliance platforms against RefineIQ's modern cloud-native stack.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Vanta */}
                <div className="p-5 rounded-2xl bg-ah-surface2 border-2 border-ah-primary shadow-ah-glow space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base text-white">Vanta</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                      RECOMMENDED (#1)
                    </span>
                  </div>
                  <p className="text-xs text-ah-text leading-relaxed">
                    Highest global enterprise procurement recognition. Out-of-the-box integrations for AWS, Supabase, Vercel, and GitHub.
                  </p>
                  <ul className="text-xs text-ah-muted space-y-1.5 pt-2 border-t border-ah font-mono">
                    <li>✓ Live Trust Center page</li>
                    <li>✓ Automated hourly security checks</li>
                    <li>✓ Fast SOC 2 Type I audit readiness</li>
                  </ul>
                </div>

                {/* Drata */}
                <div className="p-5 rounded-2xl bg-ah-surface2 border border-ah space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base text-white">Drata</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700 font-mono">
                      Alternative
                    </span>
                  </div>
                  <p className="text-xs text-ah-text leading-relaxed">
                    Excellent automated testing but heavier on enterprise pricing minimums ($15k/yr). Best suited for Series A+ scale.
                  </p>
                  <ul className="text-xs text-ah-muted space-y-1.5 pt-2 border-t border-ah font-mono">
                    <li>✓ Deep AWS & Datadog sync</li>
                    <li>✓ Strong continuous evidence collection</li>
                  </ul>
                </div>

                {/* Secureframe */}
                <div className="p-5 rounded-2xl bg-ah-surface2 border border-ah space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base text-white">Secureframe</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700 font-mono">
                      Alternative
                    </span>
                  </div>
                  <p className="text-xs text-ah-text leading-relaxed">
                    Good initial pricing for early-stage companies, but has fewer specialized ML and data residency connectors than Vanta.
                  </p>
                  <ul className="text-xs text-ah-muted space-y-1.5 pt-2 border-t border-ah font-mono">
                    <li>✓ Built-in policy templates</li>
                    <li>✓ Dedicated compliance manager</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Legal & Privacy Links */}
        <div className="mt-12 pt-8 border-t border-ah flex flex-wrap items-center justify-between gap-4 text-xs text-ah-muted">
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors underline">Terms of Service</Link>
            <Link to="/dpa" className="hover:text-white transition-colors underline">Data Processing Agreement (DPA)</Link>
          </div>
          <p>© 2026 RefineIQ Technologies Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
