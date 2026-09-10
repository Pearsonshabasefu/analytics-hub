import { useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

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

  const simulateUpload = useCallback((file) => {
    setUploading(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setUploading(false)
          setSchema(DEMO_SCHEMA)
          return 100
        }
        return p + Math.random() * 18
      })
    }, 120)
  }, [])

  const handleFile = useCallback((file) => {
    if (!file) return
    setUploadedFile(file)
    setSchema(null)
    simulateUpload(file)
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
      {/* Top bar */}
      <header className="border-b border-white/10 px-8 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-ah-muted hover:text-ah-text transition-colors text-sm flex items-center gap-2"
        >
          ← Dashboard
        </button>
        <span className="text-white/20">|</span>
        <h1 className="font-semibold text-lg">Data Ingest</h1>
        <span className="ml-2 px-2 py-0.5 rounded text-xs bg-ah-primary/20 text-ah-primary border border-ah-primary/30">
          {projectId}
        </span>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-10">

        {/* Source gallery */}
        <section>
          <p className="text-ah-muted text-sm mb-4 uppercase tracking-widest">Choose a data source</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
            {SOURCE_GALLERY.map((src) => (
              <button
                key={src.id}
                onClick={() => setActiveSource(src.id)}
                title={src.desc}
                style={{ borderColor: activeSource === src.id ? src.color : 'transparent' }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all
                  ${activeSource === src.id
                    ? 'bg-white/10 scale-105 shadow-lg'
                    : 'bg-white/5 hover:bg-white/8'
                  }`}
              >
                <span className="text-2xl">{src.icon}</span>
                <span className="text-[10px] text-ah-muted leading-tight text-center">{src.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Upload zone (shown for CSV; connector form for others) */}
        {activeSource === 'csv' ? (
          <section>
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all py-16
                ${dragActive
                  ? 'border-ah-primary bg-ah-primary/10 scale-[1.01]'
                  : 'border-white/20 hover:border-ah-primary/50 bg-white/3'
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.json,.parquet"
                className="hidden"
                onChange={onFileInput}
              />
              {uploading ? (
                <div className="w-full max-w-xs space-y-3 text-center px-4">
                  <p className="text-ah-primary font-medium">Analysing schema…</p>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ah-primary rounded-full transition-all duration-100"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-ah-muted text-xs">{Math.min(Math.floor(progress), 100)}%</p>
                </div>
              ) : uploadedFile && schema ? (
                <div className="text-center space-y-1">
                  <div className="text-4xl">✅</div>
                  <p className="font-semibold">{uploadedFile.name}</p>
                  <p className="text-ah-muted text-sm">{(uploadedFile.size / 1024).toFixed(1)} KB • {schema.length} columns detected</p>
                  <p className="text-xs text-ah-muted mt-2">Click to replace file</p>
                </div>
              ) : (
                <>
                  <div className="text-5xl">📂</div>
                  <div className="text-center space-y-1">
                    <p className="font-semibold">Drop your file here</p>
                    <p className="text-ah-muted text-sm">CSV, Excel, JSON, Parquet supported</p>
                  </div>
                  <div className="px-5 py-2 rounded-xl bg-ah-primary/20 border border-ah-primary/40 text-ah-primary text-sm font-medium hover:bg-ah-primary/30 transition-colors">
                    Browse files
                  </div>
                </>
              )}
            </div>
          </section>
        ) : (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5">
            <h3 className="font-semibold text-lg">
              {SOURCE_GALLERY.find(s => s.id === activeSource)?.icon}{' '}
              Connect {SOURCE_GALLERY.find(s => s.id === activeSource)?.label}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {['Host / URL', 'Port', 'Database', 'Username'].map((lbl) => (
                <div key={lbl} className="space-y-1.5">
                  <label className="text-xs text-ah-muted uppercase tracking-wider">{lbl}</label>
                  <input
                    type={lbl === 'Port' ? 'number' : 'text'}
                    placeholder={lbl === 'Host / URL' ? 'db.example.com' : lbl === 'Port' ? '5432' : ''}
                    className="w-full bg-white/8 border border-white/15 rounded-lg px-3 py-2 text-sm placeholder-ah-muted/50 focus:outline-none focus:border-ah-primary/60 transition-colors"
                  />
                </div>
              ))}
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs text-ah-muted uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/8 border border-white/15 rounded-lg px-3 py-2 text-sm placeholder-ah-muted/50 focus:outline-none focus:border-ah-primary/60 transition-colors"
                />
              </div>
            </div>
            <button className="px-5 py-2.5 rounded-xl bg-ah-primary text-white font-medium text-sm hover:bg-ah-primary/80 transition-colors">
              Test connection
            </button>
            <p className="text-xs text-ah-muted">🔒 Credentials are never stored — only used during this session.</p>
          </section>
        )}

        {/* Schema preview */}
        {schema && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Schema Preview</h2>
              <span className="text-ah-muted text-sm">{schema.length} columns • Polars engine</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    {['Column', 'Type', 'Nulls', 'Unique values'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-ah-muted font-medium uppercase text-xs tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schema.map((col, i) => (
                    <tr key={col.name} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/3'} hover:bg-white/6 transition-colors`}>
                      <td className="px-4 py-3 font-mono font-medium">{col.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-ah-primary/15 text-ah-primary text-xs font-mono">
                          {col.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: nullBadgeColor(col.nulls) + '20',
                            color: nullBadgeColor(col.nulls),
                          }}
                        >
                          {col.nulls} null{col.nulls !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ah-muted">{col.uniq.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-ah-muted text-sm">Ready to clean and validate this dataset?</p>
              <button
                onClick={() => navigate(`/project/${projectId}/refinery`)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-ah-primary text-white font-semibold text-sm hover:bg-ah-primary/80 transition-all hover:scale-105 shadow-lg shadow-ah-primary/30"
              >
                Continue to Refinery →
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
