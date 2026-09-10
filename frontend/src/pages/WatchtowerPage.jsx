import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Activity, ShieldAlert, Bell, CheckCircle2,
  Clock, ArrowUpRight, ChevronLeft, RefreshCw, Radio
} from 'lucide-react'

export default function WatchtowerPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [alertsEnabled, setAlertsEnabled] = useState(true)

  // Real-time log stream mockup
  const [logs] = useState([
    { id: 'tx_981', time: 'Just now', inputs: 'age=34, spend=89.5, tenure=12', prediction: 'Not Churned', confidence: '94.8%', latency: '8ms', status: 'normal' },
    { id: 'tx_980', time: '14s ago', inputs: 'age=61, spend=240.0, tenure=2', prediction: 'Churned', confidence: '88.2%', latency: '11ms', status: 'warning' },
    { id: 'tx_979', time: '32s ago', inputs: 'age=22, spend=45.0, tenure=24', prediction: 'Not Churned', confidence: '97.1%', latency: '7ms', status: 'normal' },
    { id: 'tx_978', time: '1m ago', inputs: 'age=45, spend=110.5, tenure=6', prediction: 'Not Churned', confidence: '91.4%', latency: '9ms', status: 'normal' },
    { id: 'tx_977', time: '2m ago', inputs: 'age=53, spend=195.0, tenure=1', prediction: 'Churned', confidence: '84.6%', latency: '12ms', status: 'normal' },
  ])

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
            <span>Project</span>
            <span className="text-ah-subtle">/</span>
            <span className="text-ah-primary font-semibold flex items-center gap-1.5">
              <Radio size={14} className="text-green-400 animate-pulse" />
              Watchtower Pulse
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAlertsEnabled(!alertsEnabled)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
              alertsEnabled
                ? 'bg-ah-primary/15 border-ah-primary/40 text-ah-primary'
                : 'bg-ah-surface2 border-ah text-ah-subtle'
            }`}
          >
            <Bell size={13} />
            {alertsEnabled ? 'Alerts Armed (Resend)' : 'Alerts Paused'}
          </button>
          <button
            onClick={() => navigate(`/project/${projectId}/deploy`)}
            className="text-xs text-ah-muted hover:text-ah-text px-3 py-1.5 rounded-xl bg-ah-surface2 border border-ah"
          >
            API Docs
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-ah-primary font-mono text-xs uppercase tracking-widest mb-1">Watchtower Monitoring</p>
            <h1 className="font-headline text-3xl font-bold flex items-center gap-3">
              Model Health Pulse
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 font-semibold">
                ● Live Production
              </span>
            </h1>
            <p className="text-ah-muted text-sm mt-1">Real-time latency metrics, data drift surveillance, and inference telemetry.</p>
          </div>
        </div>

        {/* 4 Metric Pulse Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Uptime */}
          <div className="bg-ah-surface border border-ah rounded-2xl p-5 shadow-ah-card">
            <p className="text-xs font-mono uppercase text-ah-subtle mb-1">Service Uptime</p>
            <div className="flex items-baseline justify-between">
              <span className="font-headline text-3xl font-extrabold text-green-400">99.98%</span>
              <span className="text-[11px] font-mono text-green-400/80 bg-green-500/10 px-1.5 py-0.5 rounded">
                SLA Met
              </span>
            </div>
            <p className="text-[11px] text-ah-subtle mt-3">Zero downtime in last 30 days</p>
          </div>

          {/* Average Latency */}
          <div className="bg-ah-surface border border-ah rounded-2xl p-5 shadow-ah-card">
            <p className="text-xs font-mono uppercase text-ah-subtle mb-1">Inference Latency</p>
            <div className="flex items-baseline justify-between">
              <span className="font-headline text-3xl font-extrabold text-ah-primary">8.4 ms</span>
              <span className="text-[11px] font-mono text-ah-subtle">p95: 14ms</span>
            </div>
            <p className="text-[11px] text-ah-subtle mt-3">Global edge serverless warm cache</p>
          </div>

          {/* Inferences */}
          <div className="bg-ah-surface border border-ah rounded-2xl p-5 shadow-ah-card">
            <p className="text-xs font-mono uppercase text-ah-subtle mb-1">Predictions (24h)</p>
            <div className="flex items-baseline justify-between">
              <span className="font-headline text-3xl font-extrabold text-ah-text">14,820</span>
              <span className="text-[11px] font-mono text-green-400 flex items-center">
                +12% <ArrowUpRight size={12} />
              </span>
            </div>
            <p className="text-[11px] text-ah-subtle mt-3">Peak: 38 req/sec at 14:00 UTC</p>
          </div>

          {/* Drift Score */}
          <div className="bg-ah-surface border border-ah rounded-2xl p-5 shadow-ah-card">
            <p className="text-xs font-mono uppercase text-ah-subtle mb-1">Drift Index (PSI)</p>
            <div className="flex items-baseline justify-between">
              <span className="font-headline text-3xl font-extrabold text-green-400">0.04</span>
              <span className="text-[11px] font-mono text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">
                Stable
              </span>
            </div>
            <p className="text-[11px] text-ah-subtle mt-3">Threshold 0.15 for auto-retrain</p>
          </div>
        </div>

        {/* Live Stream Table */}
        <div className="bg-ah-surface border border-ah rounded-2xl overflow-hidden shadow-ah-card">
          <div className="p-4 border-b border-ah flex items-center justify-between bg-ah-surface2/40">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-ah-primary" />
              <h3 className="font-headline font-bold text-sm">Live Inference Activity</h3>
            </div>
            <span className="text-xs font-mono text-ah-subtle">Streaming real-time events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead className="bg-ah-surface2 text-ah-muted border-b border-ah">
                <tr>
                  <th className="px-4 py-3 font-semibold">Event ID</th>
                  <th className="px-4 py-3 font-semibold">Timestamp</th>
                  <th className="px-4 py-3 font-semibold">Inputs Sample</th>
                  <th className="px-4 py-3 font-semibold">Prediction</th>
                  <th className="px-4 py-3 font-semibold">Confidence</th>
                  <th className="px-4 py-3 font-semibold">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ah">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-ah-surface2/50 transition-colors">
                    <td className="px-4 py-3 text-ah-subtle">{log.id}</td>
                    <td className="px-4 py-3 text-ah-muted">{log.time}</td>
                    <td className="px-4 py-3 text-ah-text font-mono truncate max-w-xs">{log.inputs}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        log.prediction === 'Churned'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : 'bg-green-500/15 text-green-400 border border-green-500/30'
                      }`}>
                        {log.prediction}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ah-text font-semibold">{log.confidence}</td>
                    <td className="px-4 py-3 text-ah-muted">{log.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
