import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Upload, FileText, CheckCircle2, ChevronLeft, ArrowRight,
  Database, RefreshCw, Eye, Sparkles, Layers
} from 'lucide-react'

const SOURCE_GALLERY = [
  { id: 'csv', icon: '📄', label: 'CSV / Excel', desc: 'Upload local files', color: '#6366f1' },
  { id: 'postgres', icon: '🐘', label: 'PostgreSQL', desc: 'Direct DB connection', color: '#336791' },
  { id: 'bigquery', icon: '🔷', label: 'BigQuery', desc: 'Google Cloud tables', color: '#4285f4' },
  { id: 'snowflake', icon: '❄️', label: 'Snowflake', desc: 'Cloud data warehouse', color: '#29b5e8' },
  { id: 'api', icon: '🔌', label: 'REST API', desc: 'JSON / paginated endpoints', color: '#10b981' },
  { id: 'gsheets', icon: '📊', label: 'Google Sheets', desc: 'Live spreadsheet sync', color: '#34a853' },
  { id: 'mysql', icon: '🐬', label: 'MySQL', desc: 'Relational database', color: '#f59e0b' },
  { id: 'mongodb', icon: '🍃', label: 'MongoDB', desc: 'Document collections', color: '#4db33d' },
  { id: 's3', icon: '🪣', label: 'AWS S3', desc: 'Object storage buckets', color: '#ff9900' },
]

const DEMO_SCHEMA = [
  { name: 'customer_id', type: 'Int64', nulls: 0, uniq: 1000 },
  { name: 'signup_date', type: 'Date', nulls: 2, uniq: 847 },
  { name: 'email', type: 'Utf8', nulls: 0, uniq: 1000 },
  { name: 'plan_tier', type: 'Categorical', nulls: 5, uniq: 3 },
  { name: 'monthly_spend', type: 'Float64', nulls: 12, uniq: 892 },
  { name: 'last_login_days', type: 'Int64', nulls: 0, uniq: 180 },
  { name: 'churned', type: 'Boolean', nulls: 0, uniq: 2 },
]

const DEMO_SAMPLE_ROWS = [
  { customer_id: 'CUST-1001', signup_date: '2024-01-15', email: 'sarah.m@gmail.com', plan_tier: 'Enterprise', monthly_spend: 89.50, last_login_days: 2, churned: 'false' },
  { customer_id: 'CUST-1002', signup_date: '2024-02-01', email: 'david.k@yahoo.com', plan_tier: 'Starter', monthly_spend: 120.00, last_login_days: 45, churned: 'true' },
  { customer_id: 'CUST-1003', signup_date: '2023-11-20', email: 'alex.b@corp.com', plan_tier: 'Pro', monthly_spend: 45.20, last_login_days: 5, churned: 'false' },
  { customer_id: 'CUST-1004', signup_date: '2024-03-10', email: 'emily.r@tech.org', plan_tier: 'Enterprise', monthly_spend: null, last_login_days: 8, churned: 'false' },
  { customer_id: 'CUST-1005', signup_date: '2023-08-04', email: 'marcus.v@provider.net', plan_tier: 'Pro', monthly_spend: 210.40, last_login_days: 1, churned: 'false' },
]

export default function IngestPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [schema, setSchema] = useState(null)
  const [activeSource, setActiveSource] = useState('csv')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  // Auto-load sample schema for demo projects
  useEffect(() => {
    if (projectId?.startsWith('demo-proj-')) {
      const fileName = projectId.includes('sales')
        ? 'q4_revenue_historical_2026.csv'
        : projectId.includes('fraud')
        ? 'ecommerce_transactions_2026.csv'
        : 'customer_churn_telecom_2026.csv'
      setUploadedFile({ name: fileName, size: 184520 })
      setSchema(DEMO_SCHEMA)
      setProgress(100)
    }
  }, [projectId])

  const simulateUpload = useCallback((fileName = 'customer_churn_dataset.csv') => {
    setUploading(true)
    setProgress(0)
    setUploadedFile({ name: fileName, size: 184520 })
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setUploading(false)
          setSchema(DEMO_SCHEMA)
          return 100
        }
        return p + Math.random() * 25
      })
    }, 100)
  }, [])

  const handleFile = useCallback((file) => {
    if (!file) return
    setUploadedFile(file)
    setSchema(null)
    simulateUpload(file.name)
  }, [simulateUpload])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const onDragOver = (e) => { e.preventDefault(); setDragActive(true) }
  const onDragLeave = () => setDragActive(false)
  const onFileInput = (e) => handleFile(e.target.files[0])

  const nullBadgeColor = (nulls) => {
    if (nulls === 0) return '#10b981'
    if (nulls <= 5) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="min-h-screen bg-ah-bg text-ah-text">
      {/* Top Navbar */}
      <header className="glass border-b border-ah px-6 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-ah-muted hover:text-ah-text flex items-center gap-1.5 text-sm transition-colors"
          >
            <ChevronLeft size={16} /> Dashboard
          </button>
          <div className="h-4 w-px bg-ah-border" />
          <div className="flex items-center gap-2 text-sm text-ah-muted">
            <span className="text-ah-primary font-semibold">01 Ingest (Connect)</span>
            <ArrowRight size={12} />
            <button onClick={() => navigate(`/project/${projectId}/refinery`)} className="hover:text-ah-text transition-colors">
              02 Refinery
            </button>
            <ArrowRight size={12} />
            <button onClick={() => navigate(`/project/${projectId}/studio`)} className="hover:text-ah-text transition-colors">
              03 Model Studio
            </button>
            <ArrowRight size={12} />
            <button onClick={() => navigate(`/project/${projectId}/deploy`)} className="hover:text-ah-text transition-colors">
              04 Deploy
            </button>
          </div>
        </div>

        {schema && (
          <button
            onClick={() => navigate(`/project/${projectId}/refinery`)}
            className="flex items-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-ah-glow"
          >
            Proceed to Data Refinery <ArrowRight size={16} />
          </button>
        )}
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Header Title */}
        <div>
          <p className="text-ah-primary font-mono text-xs uppercase tracking-widest mb-1">Step 01 — Data Connection</p>
          <h1 className="font-headline text-3xl font-bold">Ingest & Inspect Dataset</h1>
          <p className="text-ah-muted text-sm mt-1">Connect your database, data warehouse, or upload a CSV to automatically infer schema and quality metrics.</p>
        </div>

        {/* Source gallery */}
        <section>
          <p className="text-ah-muted text-xs font-mono mb-3 uppercase tracking-widest">Select Data Source</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
            {SOURCE_GALLERY.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSource(s.id)}
                className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all text-xs ${
                  activeSource === s.id
                    ? 'border-ah-primary bg-ah-primary/10 text-ah-text shadow-sm'
                    : 'border-ah bg-ah-surface hover:border-ah-primary/50 text-ah-muted'
                }`}
              >
                <span className="text-xl">{s.icon}</span>
                <span className="font-medium text-[11px] truncate w-full">{s.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* CSV Dropzone / Source Connector */}
        {activeSource === 'csv' ? (
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-ah-primary bg-ah-primary/10 scale-[0.99]'
                : 'border-ah hover:border-ah-primary/50 bg-ah-surface/60 hover:bg-ah-surface'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.parquet"
              className="hidden"
              onChange={onFileInput}
            />
            <div className="w-14 h-14 bg-ah-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-4 text-ah-primary">
              <Upload size={24} />
            </div>

            {uploadedFile ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <FileText size={18} className="text-ah-primary" />
                  <span className="font-semibold text-sm text-ah-text font-mono">{uploadedFile.name}</span>
                  <CheckCircle2 size={16} className="text-green-400" />
                </div>
                <p className="text-xs text-ah-subtle font-mono">
                  {(uploadedFile.size / 1024).toFixed(1)} KB • Polars Engine Loaded
                </p>

                {uploading && (
                  <div className="max-w-xs mx-auto">
                    <div className="w-full bg-ah-surface3 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-ah-primary h-full transition-all duration-150"
                        style={{ width: `${Math.min(100, progress)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-ah-muted font-mono mt-1">Analyzing column types & null distributions...</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="font-semibold text-sm text-ah-text mb-1">
                  Drag & drop your CSV or Excel file here
                </p>
                <p className="text-xs text-ah-muted mb-4">Supports CSV, TSV, XLSX, Parquet up to 500MB</p>

                {/* Instant 1-Click Demo Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    simulateUpload('sample_churn_data_1000.csv')
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ah-primary/15 border border-ah-primary/30 text-ah-primary hover:bg-ah-primary/25 text-xs font-semibold transition-all shadow-sm"
                >
                  <Sparkles size={14} className="text-yellow-400" />
                  ⚡ Load Sample Customer Churn Dataset (1-Click Demo)
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-ah-surface border border-ah space-y-4">
            <h3 className="font-semibold text-sm text-ah-text flex items-center gap-2">
              <Database size={16} className="text-ah-primary" />
              Direct Database Connection
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Connection URI (postgresql://user:pass@host:5432/db)"
                className="bg-ah-surface2 border border-ah rounded-xl px-4 py-2.5 text-xs font-mono outline-none focus:border-ah-primary"
              />
              <button
                onClick={() => simulateUpload('db_query_export.csv')}
                className="bg-ah-primary text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-ah-primary/80 transition-all shadow-sm"
              >
                Test Connection & Sync
              </button>
            </div>
          </div>
        )}

        {/* Schema & Preview Table */}
        {schema && (
          <section className="space-y-6">
            {/* Schema Summary */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline font-bold text-xl">Schema & Distribution Quality</h2>
                <p className="text-xs text-ah-muted font-mono mt-0.5">Polars Fast-Parser: {schema.length} features detected, 1,000 rows profiled</p>
              </div>
              <button
                onClick={() => navigate(`/project/${projectId}/refinery`)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white text-xs font-semibold transition-all shadow-ah-glow"
              >
                Continue to Refinery (Clean) <ArrowRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-ah bg-ah-surface">
              <table className="w-full text-xs font-mono text-left">
                <thead className="bg-ah-surface2 text-ah-muted border-b border-ah">
                  <tr>
                    {['Feature Name', 'Data Type', 'Missing / Nulls', 'Unique Values', 'Quality Status'].map((h) => (
                      <th key={h} className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ah">
                  {schema.map((col) => (
                    <tr key={col.name} className="hover:bg-ah-surface2/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-ah-text">{col.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-ah-primary/15 text-ah-primary text-[11px]">
                          {col.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-semibold"
                          style={{
                            backgroundColor: nullBadgeColor(col.nulls) + '20',
                            color: nullBadgeColor(col.nulls),
                          }}
                        >
                          {col.nulls} null{col.nulls !== 1 ? 's' : ''} ({((col.nulls / 1000) * 100).toFixed(1)}%)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ah-muted">{col.uniq.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        {col.nulls > 0 ? (
                          <span className="text-yellow-400 text-[11px] font-medium">Needs Imputation</span>
                        ) : (
                          <span className="text-green-400 text-[11px] font-medium">Valid</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sample Records Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-sm text-ah-text flex items-center gap-2">
                  <Eye size={16} className="text-ah-primary" />
                  First 5 Records (Raw Ingest Sample)
                </h3>
                <span className="text-[11px] font-mono text-ah-subtle">Showing sample slice</span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-ah bg-ah-surface">
                <table className="w-full text-xs font-mono text-left">
                  <thead className="bg-ah-surface2 text-ah-muted border-b border-ah">
                    <tr>
                      {schema.map((c) => (
                        <th key={c.name} className="px-4 py-2.5 whitespace-nowrap">{c.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ah">
                    {DEMO_SAMPLE_ROWS.map((row, i) => (
                      <tr key={i} className="hover:bg-ah-surface2/40 transition-colors">
                        <td className="px-4 py-2.5 text-ah-text font-semibold">{row.customer_id}</td>
                        <td className="px-4 py-2.5 text-ah-muted">{row.signup_date}</td>
                        <td className="px-4 py-2.5 text-ah-muted">{row.email}</td>
                        <td className="px-4 py-2.5 text-ah-text">{row.plan_tier}</td>
                        <td className="px-4 py-2.5 text-ah-text">
                          {row.monthly_spend ? `$${row.monthly_spend.toFixed(2)}` : <span className="text-red-400">null</span>}
                        </td>
                        <td className="px-4 py-2.5 text-ah-muted">{row.last_login_days}</td>
                        <td className="px-4 py-2.5">
                          <span className={row.churned === 'true' ? 'text-red-400 font-semibold' : 'text-green-400 font-semibold'}>
                            {row.churned}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Next Step Banner */}
            <div className="p-5 rounded-2xl bg-ah-surface border border-ah flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="font-headline font-bold text-sm text-ah-text">Ready to clean and mask privacy fields?</h4>
                <p className="text-xs text-ah-muted mt-0.5">The autonomous data refinery will impute 14 missing values, remove duplicates, and mask customer email PII.</p>
              </div>
              <button
                onClick={() => navigate(`/project/${projectId}/refinery`)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-ah-primary text-white font-semibold text-xs hover:bg-ah-primary/80 transition-all shadow-ah-glow"
              >
                Launch Data Refinery <ArrowRight size={14} />
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
