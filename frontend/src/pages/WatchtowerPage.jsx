import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Activity, ShieldAlert, Bell, CheckCircle2,
  Clock, ArrowUpRight, ChevronLeft, RefreshCw, Radio, Zap, ArrowRight, Play
} from 'lucide-react'

export default function WatchtowerPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [totalInferences, setTotalInferences] = useState(14820)
  const [lastPingTime, setLastPingTime] = useState('Just now')

  // Real-time log stream
  const [logs, setLogs] = useState([
    { id: 'tx_981', time: 'Just now', inputs: 'age=34, spend=89.5, tenure=12', prediction: 'Not Churned', confidence: '94.8%', latency: '8.2ms', status: 'normal' },
    { id: 'tx_980', time: '14s ago', inputs: 'age=61, spend=240.0, tenure=2', prediction: 'Churned', confidence: '88.2%', latency: '11.4ms', status: 'warning' },
    { id: 'tx_979', time: '32s ago', inputs: 'age=22, spend=45.0, tenure=24', prediction: 'Not Churned', confidence: '97.1%', latency: '7.8ms', status: 'normal' },
    { id: 'tx_978', time: '1m ago', inputs: 'age=45, spend=110.5, tenure=6', prediction: 'Not Churned', confidence: '91.4%', latency: '9.0ms', status: 'normal' },
    { id: 'tx_977', time: '2m ago', inputs: 'age=53, spend=195.0, tenure=1', prediction: 'Churned', confidence: '84.6%', latency: '12.1ms', status: 'normal' },
  ])

  const handleSimulatePing = () => {
    const randomAge = Math.floor(20 + Math.random() * 50)
    const randomSpend = (20 + Math.random() * 200).toFixed(1)
    const randomTenure = Math.floor(1 + Math.random() * 36)
    const isChurn = randomTenure < 3 || randomSpend < 40
    const randomLatency = (6.5 + Math.random() * 5.5).toFixed(1)
    const randomConfidence = (88 + Math.random() * 11).toFixed(1)

    const newTx = {
      id: `tx_${Math.floor(1000 + Math.random() * 9000)}`,
      time: 'Just now',
      inputs: `age=${randomAge}, spend=${randomSpend}, tenure=${randomTenure}`,
      prediction: isChurn ? 'Churned' : 'Not Churned',
      confidence: `${randomConfidence}%`,
      latency: `${randomLatency}ms`,
      status: isChurn ? 'warning' : 'normal',
    }

    setLogs((prev) => [newTx, ...prev.slice(0, 9)])
    setTotalInferences((prev) => prev + 1)
    setLastPingTime('Just now')
  }

  return (
    <div className="min-h-screen bg-ah-bg text-ah-text">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 text-sm transition-colors"
          >
            <ChevronLeft size={16} /> Dashboard
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <button onClick={() => navigate(`/project/${projectId}/ingest`)} className="hover:text-slate-900 dark:hover:text-white transition-colors">01 Connect</button>
            <ArrowRight size={12} />
            <button onClick={() => navigate(`/project/${projectId}/refinery`)} className="hover:text-slate-900 dark:hover:text-white transition-colors">02 Clean</button>
            <ArrowRight size={12} />
            <button onClick={() => navigate(`/project/${projectId}/studio`)} className="hover:text-slate-900 dark:hover:text-white transition-colors">03 Model</button>
            <ArrowRight size={12} />
            <button onClick={() => navigate(`/project/${projectId}/deploy`)} className="hover:text-slate-900 dark:hover:text-white transition-colors">04 Deploy</button>
            <ArrowRight size={12} />
            <span className="text-ah-primary font-semibold flex items-center gap-1.5">
              <Radio size={14} className="text-green-500 dark:text-green-400 animate-pulse" />
              05 Watchtower
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulatePing}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white shadow-ah-glow transition-all"
          >
            <Zap size={13} />
            Simulate Traffic Ping
          </button>
          <button
            onClick={() => setAlertsEnabled(!alertsEnabled)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all ${
              alertsEnabled
                ? 'bg-ah-primary/15 border-ah-primary/40 text-ah-primary'
                : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
            }`}
          >
            <Bell size={13} />
            {alertsEnabled ? 'Alerts Armed (Resend)' : 'Alerts Paused'}
          </button>
          <button
            onClick={() => navigate(`/project/${projectId}/deploy`)}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3.5 py-2 rounded-xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 transition-colors"
          >
            API Docs
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-12 md:pt-16 pb-32">
        {/* Header Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-ah-primary font-mono text-xs uppercase tracking-widest mb-1">Step 05 — Production Telemetry</p>
            <h1 className="font-headline text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              Watchtower Pulse Monitor
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/30 text-green-600 dark:text-green-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 animate-ping" />
                ● Live Production
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">Real-time latency metrics, automated data drift surveillance, and inference telemetry streams.</p>
          </div>

          <button
            onClick={handleSimulatePing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 hover:border-ah-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white font-mono text-xs transition-all shadow-sm"
          >
            <RefreshCw size={14} className="text-ah-primary" />
            Inject Live Request Event
          </button>
        </div>

        {/* 4 Metric Pulse Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Uptime */}
          <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-2xl p-5 shadow-ah-card">
            <p className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1">Service SLA Uptime</p>
            <div className="flex items-baseline justify-between">
              <span className="font-headline text-3xl font-extrabold text-green-500 dark:text-green-400">99.98%</span>
              <span className="text-[11px] font-mono text-green-600 dark:text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded font-semibold">
                SLA Met
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3">Zero downtime in last 30 days</p>
          </div>

          {/* Average Latency */}
          <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-2xl p-5 shadow-ah-card">
            <p className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1">Inference Latency</p>
            <div className="flex items-baseline justify-between">
              <span className="font-headline text-3xl font-extrabold text-ah-primary">8.4 ms</span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">p95: 12.1ms</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3">Global edge serverless warm cache</p>
          </div>

          {/* Inferences */}
          <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-2xl p-5 shadow-ah-card">
            <p className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1">Total Inferences</p>
            <div className="flex items-baseline justify-between">
              <span className="font-headline text-3xl font-extrabold text-slate-900 dark:text-white">{totalInferences.toLocaleString()}</span>
              <span className="text-[11px] font-mono text-green-600 dark:text-green-400 flex items-center font-semibold">
                +14% <ArrowUpRight size={12} />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3">Peak: 42 req/sec across 8 regions</p>
          </div>

          {/* Drift Score */}
          <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-2xl p-5 shadow-ah-card">
            <p className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1">Population Drift Index (PSI)</p>
            <div className="flex items-baseline justify-between">
              <span className="font-headline text-3xl font-extrabold text-green-500 dark:text-green-400">0.038</span>
              <span className="text-[11px] font-mono text-green-600 dark:text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded font-semibold">
                Stable
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3">Automated threshold: 0.15 PSI</p>
          </div>
        </div>

        {/* Live Stream Table */}
        <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-2xl overflow-hidden shadow-ah-card">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-ah-primary" />
              <h3 className="font-headline font-bold text-sm text-slate-900 dark:text-white">Live Inference Activity Stream</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 animate-ping" />
                Live socket connected
              </span>
              <button
                onClick={handleSimulatePing}
                className="text-xs px-2.5 py-1 rounded-lg bg-ah-primary/15 border border-ah-primary/30 text-ah-primary hover:bg-ah-primary/25 font-semibold"
              >
                + Inject Ping
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Event ID</th>
                  <th className="px-4 py-3 font-semibold">Timestamp</th>
                  <th className="px-4 py-3 font-semibold">Inputs Sample</th>
                  <th className="px-4 py-3 font-semibold">Prediction</th>
                  <th className="px-4 py-3 font-semibold">Confidence</th>
                  <th className="px-4 py-3 font-semibold">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{log.id}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{log.time}</td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-mono truncate max-w-xs">{log.inputs}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        log.prediction === 'Churned'
                          ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                          : 'bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/30'
                      }`}>
                        {log.prediction}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white font-semibold">{log.confidence}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-bold">{log.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
