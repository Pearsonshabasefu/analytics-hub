import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Check, CheckCircle2, Zap, Shield, Brain, TrendingUp,
  TrendingDown, Terminal, Database, Sparkles, UploadCloud, FileSpreadsheet,
  Play, Code2, Info, Lock, Server, Clock, Quote, Layers, ChevronRight,
  ChevronDown, Activity, Star, SlidersHorizontal, Calendar, Search, Plus,
  Bell, Settings, ExternalLink, ArrowUpRight, Filter, RefreshCw, X, Loader2,
  Download, Monitor
} from 'lucide-react'
import Logo from '../components/common/Logo'
import { useAuthStore } from '../store/authStore'
import { usePwaInstall } from '../hooks/usePwaInstall'

// ═════════════════════════════════════════════════════════════════════════════
// 1. FULLY INTERACTIVE FINNOVA-STYLE PRODUCT UI SANDBOX (Image 2)
// ═════════════════════════════════════════════════════════════════════════════
// ═════════════════════════════════════════════════════════════════════════════
// 1. FULLY INTERACTIVE FINNOVA-STYLE PRODUCT UI SANDBOX (Image 2)
// ═════════════════════════════════════════════════════════════════════════════
function FinnovaProductUI() {
  const { user } = useAuthStore()
  const [filterMode, setFilterMode] = useState('all') // 'all' | 'live' | 'draft'
  const [selectedModelId, setSelectedModelId] = useState('1003')
  const [activeNavPill, setActiveNavPill] = useState('models') // 'overview' | 'pipelines' | 'models' | 'endpoints' | 'watchtower' | 'billing'
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployedSuccess, setDeployedSuccess] = useState(false)
  const [showTrainModal, setShowTrainModal] = useState(false)
  const [showShapModal, setShowShapModal] = useState(false)
  const [isTournamentRunning, setIsTournamentRunning] = useState(false)
  const [tournamentWinner, setTournamentWinner] = useState(null)
  const [testResult, setTestResult] = useState(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const [selectedDagStage, setSelectedDagStage] = useState('refinery')
  const [activeEndpointLang, setActiveEndpointLang] = useState('curl')
  const [watchtowerLogs, setWatchtowerLogs] = useState([
    { id: 'tx_981', time: 'Just now', inputs: 'tenure=14, spend=65, tickets=1', prediction: 'Retained', confidence: '94.8%', latency: '8.2ms', status: 'normal' },
    { id: 'tx_980', time: '18s ago', inputs: 'tenure=2, spend=18, tickets=4', prediction: 'Churn Risk', confidence: '89.4%', latency: '11.1ms', status: 'warning' },
    { id: 'tx_979', time: '42s ago', inputs: 'tenure=24, spend=120, tickets=0', prediction: 'Retained', confidence: '98.2%', latency: '7.8ms', status: 'normal' },
    { id: 'tx_978', time: '2m ago', inputs: 'tenure=6, spend=45, tickets=2', prediction: 'Retained', confidence: '91.0%', latency: '9.4ms', status: 'normal' },
  ])

  // Interactive Test Inputs
  const [inputTenure, setInputTenure] = useState(14)
  const [inputSpend, setInputSpend] = useState(65.0)
  const [inputTickets, setInputTickets] = useState(1)

  // Dynamic models state
  const [modelsList, setModelsList] = useState([
    {
      id: '1001',
      code: '#MOD-1001',
      name: 'Customer Churn Risk',
      status: 'Live',
      dataset: 'Telco Global Churn v4',
      statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      accuracy: '94.8%',
      metricLabel: 'ROC-AUC',
      latency: '18 ms',
      f1: '0.924',
      algo: 'XGBoost',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
      analyst: 'Sarah Jenkins',
      role: 'Growth Operations',
      endpoint: 'https://api.refineiq.ai/v1/predict/churn-1001',
      predictionType: 'Churn Risk',
      defaultRisk: 'Low (8.4%)'
    },
    {
      id: '1002',
      code: '#MOD-1002',
      name: 'B2B Lead Scoring',
      status: 'Live',
      dataset: 'HubSpot Inbound Pipeline',
      statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      accuracy: '91.2%',
      metricLabel: 'Precision',
      latency: '12 ms',
      f1: '0.896',
      algo: 'LightGBM',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
      analyst: 'Marcus Vance',
      role: 'Demand Gen Lead',
      endpoint: 'https://api.refineiq.ai/v1/predict/leads-1002',
      predictionType: 'Conversion Likelihood',
      defaultRisk: 'High (84.2%)'
    },
    {
      id: '1003',
      code: '#MOD-1003',
      name: 'Revenue Forecast',
      status: 'Live',
      dataset: 'BrightWave Enterprise Dataset',
      statusColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
      accuracy: '96.1%',
      metricLabel: 'Accuracy',
      latency: '14 ms',
      f1: '0.942',
      algo: 'Ensemble Stack',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
      analyst: 'James Carter',
      role: 'Lead Data Scientist',
      endpoint: 'https://api.refineiq.ai/v1/predict/rev-1003',
      predictionType: 'Expansion Likelihood',
      defaultRisk: 'Strong Expansion (92.1%)'
    },
    {
      id: '1004',
      code: '#MOD-1004',
      name: 'Stripe Fraud Detection',
      status: 'Live',
      dataset: 'Checkout Transactions Q3',
      statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      accuracy: '98.4%',
      metricLabel: 'ROC-AUC',
      latency: '8 ms',
      f1: '0.978',
      algo: 'CatBoost',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
      analyst: 'Elena Rostova',
      role: 'Security & ML Eng',
      endpoint: 'https://api.refineiq.ai/v1/predict/fraud-1004',
      predictionType: 'Fraud Risk Flag',
      defaultRisk: 'Legitimate (0.2% Risk)'
    },
    {
      id: '1005',
      code: '#MOD-1005',
      name: 'LTV Cohort Predictor',
      status: 'Draft',
      dataset: 'Shopify Cohort Retention',
      statusColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      accuracy: '89.5%',
      metricLabel: 'R2-Score',
      latency: '22 ms',
      f1: '0.881',
      algo: 'Random Forest',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face',
      analyst: 'Kabwe Mumba',
      role: 'E-Commerce Analyst',
      endpoint: 'https://api.refineiq.ai/v1/predict/ltv-1005',
      predictionType: 'Predicted 12M LTV',
      defaultRisk: '$1,420 Expected'
    }
  ])

  // Current active model
  const activeModel = modelsList.find(m => m.id === selectedModelId) || modelsList[0]

  // Filtered model list
  const filteredModels = modelsList.filter(m => {
    if (filterMode === 'live') return m.status === 'Live'
    if (filterMode === 'draft') return m.status === 'Draft'
    return true
  })

  // Handlers
  const handleDeploy = () => {
    setIsDeploying(true)
    setTimeout(() => {
      setIsDeploying(false)
      setDeployedSuccess(true)
      setTimeout(() => setDeployedSuccess(false), 3000)
    }, 1200)
  }

  const handleRunPrediction = () => {
    setIsPredicting(true)
    setTimeout(() => {
      setIsPredicting(false)
      const isHighRisk = inputTenure < 4 || inputSpend < 30 || inputTickets > 2
      setTestResult({
        probability: isHighRisk ? '0.842' : '0.114',
        outcome: isHighRisk ? 'High Churn Hazard' : 'Retained & Active',
        latency: `${(7.4 + Math.random() * 3).toFixed(1)} ms`
      })
    }, 450)
  }

  const handleSimulateWatchtowerPing = () => {
    const randomAge = Math.floor(20 + Math.random() * 50)
    const randomSpend = Math.floor(25 + Math.random() * 150)
    const randomTenure = Math.floor(1 + Math.random() * 30)
    const isChurn = randomTenure < 3 || randomSpend < 35
    const newTx = {
      id: `tx_${Math.floor(1000 + Math.random() * 9000)}`,
      time: 'Just now',
      inputs: `tenure=${randomTenure}, spend=${randomSpend}, age=${randomAge}`,
      prediction: isChurn ? 'Churn Risk' : 'Retained',
      confidence: `${(89 + Math.random() * 10).toFixed(1)}%`,
      latency: `${(6.8 + Math.random() * 4).toFixed(1)}ms`,
      status: isChurn ? 'warning' : 'normal',
    }
    setWatchtowerLogs(prev => [newTx, ...prev.slice(0, 5)])
  }

  const handleStartTournament = () => {
    setIsTournamentRunning(true)
    setTournamentWinner(null)
    setTimeout(() => {
      setIsTournamentRunning(false)
      const newWinner = {
        code: '#MOD-1006',
        name: 'E-Commerce Conversion',
        accuracy: '95.4%',
        algo: 'CatBoost Tuned'
      }
      setTournamentWinner(newWinner)
      setModelsList(prev => [
        {
          id: '1006',
          code: '#MOD-1006',
          name: 'E-Commerce Conversion',
          status: 'Live',
          dataset: 'Shopify Black Friday Ingestion',
          statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          accuracy: '95.4%',
          metricLabel: 'ROC-AUC',
          latency: '11 ms',
          f1: '0.948',
          algo: 'CatBoost',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
          analyst: 'Pearson Shabasefu',
          role: 'Platform Founder',
          endpoint: 'https://api.refineiq.ai/v1/predict/conv-1006',
          predictionType: 'Purchase Probability',
          defaultRisk: 'High (88.7%)'
        },
        ...prev
      ])
      setSelectedModelId('1006')
    }, 2200)
  }

  return (
    <div className="w-full bg-[#F4F5FB] text-[#1E1E2F] rounded-[28px] p-4 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.5)] border border-white/20 font-sans select-none overflow-hidden transition-all relative">
      
      {/* ── Top Pill Navigation Bar (Finnova style) ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Refined 2D Logo next to RefineIQ — no crude RIQ square */}
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group cursor-pointer hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00F2FE]/15 via-[#007AFF]/20 to-transparent border border-[#00F2FE]/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,242,254,0.25)] group-hover:scale-105 transition-transform">
            <img src="/assets/logo.svg" alt="RefineIQ" className="w-5 h-5 drop-shadow-[0_0_8px_rgba(0,242,254,0.7)]" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-[#111827] flex items-center">
              Refine<span className="text-[#4F46E5]">IQ</span>
            </div>
            <div className="text-[10px] text-gray-500 font-medium">AutoML & Inference OS</div>
          </div>
        </Link>

        {/* Center Pill Menu with Fully Reactive Tab Switching */}
        <div className="hidden lg:flex items-center bg-[#1E1E2F] text-gray-300 rounded-full p-1 text-xs font-medium shadow-inner">
          <span className="px-3 py-1 text-gray-400 font-mono text-[11px] font-bold">80</span>
          {['overview', 'pipelines', 'models', 'endpoints', 'watchtower', 'billing'].map((pill) => (
            <button
              key={pill}
              onClick={() => setActiveNavPill(pill)}
              className={`capitalize px-3 py-1 rounded-full transition-all ${
                activeNavPill === pill
                  ? 'bg-[#4F46E5] text-white font-semibold shadow-[0_0_12px_rgba(79,70,229,0.5)]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {pill === 'models' ? '+ Models' : pill}
            </button>
          ))}
        </div>

        {/* Right Icon Badges */}
        <div className="flex items-center gap-1.5">
          <button onClick={() => setActiveNavPill('pipelines')} title="Database Connections" className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
            <Database size={13} />
          </button>
          <button onClick={() => setActiveNavPill('watchtower')} title="Alerts & Drift" className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
            <Bell size={13} />
          </button>
          <button onClick={() => setActiveNavPill('billing')} title="Workspace Settings" className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
            <Settings size={13} />
          </button>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
            alt="User"
            className="w-7 h-7 rounded-full border border-gray-200 object-cover ml-1 shadow-sm"
          />
        </div>
      </div>

      {/* ── Sub-header: Title & Primary Action (Unified Color Styling) ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveNavPill(activeNavPill === 'models' ? 'overview' : 'models')}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            title="Toggle between Models and Overview"
          >
            <ArrowRight size={14} className="rotate-180" />
          </button>
          <div>
            <h3 className="font-extrabold text-xl text-[#111827] tracking-tight">
              {activeNavPill === 'models' && 'Models & Inference'}
              {activeNavPill === 'overview' && 'Workspace Overview'}
              {activeNavPill === 'pipelines' && 'Data Pipelines (DAG)'}
              {activeNavPill === 'endpoints' && 'Production Endpoints'}
              {activeNavPill === 'watchtower' && 'Watchtower Drift Telemetry'}
              {activeNavPill === 'billing' && 'OCU Credits & Billing'}
            </h3>
            <p className="text-xs text-gray-500">
              {activeNavPill === 'models' && 'Manage, evaluate, and test your predictive ML models in real time.'}
              {activeNavPill === 'overview' && 'Real-time telemetry, model fleet health, and automated pipeline throughput.'}
              {activeNavPill === 'pipelines' && 'End-to-end visual workflow from raw CSV ingest to live serverless deployment.'}
              {activeNavPill === 'endpoints' && 'Autoscaling serverless REST endpoints ready for curl, Python, and JavaScript.'}
              {activeNavPill === 'watchtower' && 'Surveillance for distribution drift, accuracy degradation, and data anomalies.'}
              {activeNavPill === 'billing' && 'Usage-based Operations Compute Units (OCUs) with instant top-ups.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeNavPill === 'models' && (
            <button 
              onClick={() => setShowTrainModal(true)}
              className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={13} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          )}

          {/* Primary Action Button (Unified #4F46E5 purple/indigo styling across all tabs) */}
          {activeNavPill === 'models' && (
            <button
              onClick={() => setShowTrainModal(true)}
              className="h-9 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition-all active:scale-95"
            >
              <Plus size={14} />
              <span>Train New Model</span>
            </button>
          )}
          {activeNavPill === 'overview' && (
            <button
              onClick={() => setActiveNavPill('models')}
              className="h-9 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition-all active:scale-95"
            >
              <Plus size={14} />
              <span>Launch New Project</span>
            </button>
          )}
          {activeNavPill === 'pipelines' && (
            <button
              onClick={() => setShowTrainModal(true)}
              className="h-9 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition-all active:scale-95"
            >
              <Play size={13} />
              <span>Run Pipeline</span>
            </button>
          )}
          {activeNavPill === 'endpoints' && (
            <button
              onClick={() => setActiveNavPill('models')}
              className="h-9 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition-all active:scale-95"
            >
              <Plus size={14} />
              <span>Deploy Endpoint</span>
            </button>
          )}
          {activeNavPill === 'watchtower' && (
            <button
              onClick={handleSimulateWatchtowerPing}
              className="h-9 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition-all active:scale-95"
            >
              <Zap size={13} />
              <span>Simulate Traffic Ping</span>
            </button>
          )}
          {activeNavPill === 'billing' && (
            <Link
              to="/settings"
              className="h-9 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition-all active:scale-95"
            >
              <Zap size={13} />
              <span>Top Up OCUs</span>
            </Link>
          )}
        </div>
      </div>

      {/* ── Top 4 Metric Cards Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        
        {/* Card 1: Dynamic per Tab */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-gray-500">
                {activeNavPill === 'models' && 'Active Deployed Models'}
                {activeNavPill === 'overview' && 'Active Pipeline Fleet'}
                {activeNavPill === 'pipelines' && 'Pipeline DAG Stages'}
                {activeNavPill === 'endpoints' && 'Production Endpoints'}
                {activeNavPill === 'watchtower' && 'Population Drift Index'}
                {activeNavPill === 'billing' && 'Active Metering Plan'}
              </span>
              <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">!</span>
            </div>
            <div className="font-extrabold text-2xl text-[#111827] tracking-tight">
              {activeNavPill === 'models' && `${modelsList.filter(m => m.status === 'Live').length} Models Live`}
              {activeNavPill === 'overview' && '4 Pipelines Active'}
              {activeNavPill === 'pipelines' && '5 Automated Nodes'}
              {activeNavPill === 'endpoints' && '4 Live Endpoints'}
              {activeNavPill === 'watchtower' && '0.038 PSI'}
              {activeNavPill === 'billing' && 'Pay-As-You-Train'}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <TrendingUp size={12} />
              <span>
                {activeNavPill === 'watchtower' ? 'Stable (Threshold: 0.15)' : '96.1% Peak Accuracy'}
              </span>
            </div>
          </div>
          <div className="mt-3 h-14 rounded-xl bg-gradient-to-r from-gray-50 to-indigo-50/40 border border-gray-100 flex items-center justify-center overflow-hidden relative">
            <div className="flex items-center gap-2 text-[10px] text-indigo-700 font-mono font-semibold">
              <Sparkles size={13} className="text-indigo-600" />
              <span>Polars + Presidio Active</span>
            </div>
          </div>
        </div>

        {/* Card 2: Predictions Served (Interactive Bar Chart Card) */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-gray-500">Predictions Served</span>
              <Calendar size={13} className="text-indigo-500" />
            </div>
            <div className="font-extrabold text-2xl text-[#111827] tracking-tight">142,560</div>
            <div className="flex items-center gap-1 text-[11px] text-indigo-600 font-semibold mt-1">
              <TrendingUp size={12} />
              <span>↑ 8.2% from last month</span>
            </div>
          </div>
          <div className="mt-3 h-14 flex items-end justify-between gap-1.5 px-2 pt-2">
            {[25, 40, 35, 60, 50, 75, 95].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar cursor-pointer" title={`Day ${i+1}: ${h * 200} predictions`}>
                <div 
                  className={`w-full rounded-t-sm transition-all ${
                    i === 6 ? 'bg-[#4F46E5]' : 'bg-indigo-200/80 group-hover/bar:bg-indigo-400'
                  }`}
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Average Latency (Interactive Line Sparkline Card) */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-gray-500">Average Inference Latency</span>
              <Clock size={13} className="text-cyan-500" />
            </div>
            <div className="font-extrabold text-2xl text-[#111827] tracking-tight">{activeModel.latency}</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <TrendingDown size={12} />
              <span>↓ Sub-20ms SLA Enforced</span>
            </div>
          </div>
          <div className="mt-3 h-14 relative flex items-center">
            <svg viewBox="0 0 160 50" className="w-full h-full overflow-visible">
              <path
                d="M 0,35 Q 25,32 45,28 T 85,20 T 120,15 T 160,8"
                fill="none"
                stroke="#6366F1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="45" cy="28" r="3" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="85" cy="20" r="3" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="120" cy="15" r="3" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="160" cy="8" r="4" fill="#00F2FE" stroke="#4F46E5" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Card 4: OCU Compute Balance (With Context Line & Unified Primary Button Color) */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-gray-500">Available OCU Balance</span>
              <ArrowUpRight size={13} className="text-gray-400" />
            </div>
            <div className="font-extrabold text-2xl text-[#111827] tracking-tight">186 OCUs</div>
            {/* Context line directly addressing user feedback */}
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
              <span>~18 hours of training left</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              Gateway: <span className="font-semibold text-indigo-600">Secure Checkout (Active)</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="px-2.5 py-1.5 rounded-lg bg-gray-100 text-[10px] font-mono font-semibold text-gray-700 flex items-center gap-1">
              <span>CARD •••• 4242</span>
            </div>
            {/* Primary button styled with cohesive #4F46E5 color, matching Train New Model */}
            <Link
              to="/settings"
              className="px-3.5 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[11px] font-semibold transition-all shadow-[0_2px_10px_rgba(79,70,229,0.3)]"
            >
              Top Up
            </Link>
          </div>
        </div>

      </div>

      {/* ── Active Filters Bar with Search & Date (Models & Registry view) ── */}
      {activeNavPill === 'models' && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 font-semibold text-gray-800 shadow-sm">
              <span>Active filters</span>
              <span className="w-4 h-4 rounded-full bg-[#4F46E5] text-white text-[10px] flex items-center justify-center font-bold">
                {filterMode === 'all' ? '2' : '3'}
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-700 shadow-sm flex items-center gap-2">
              <span>Algorithm: {activeModel.algo}</span>
            </div>
            <div className="hidden md:flex px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-700 shadow-sm items-center gap-2">
              <span>Dataset: {activeModel.dataset}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-700 shadow-sm">
              <Calendar size={12} className="text-gray-400" />
              <span>Q3 2026 Batch</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-400 shadow-sm">
              <Search size={12} />
              <input
                type="text"
                placeholder={`Search ${modelsList.length} models...`}
                className="w-28 sm:w-36 text-xs text-gray-700 outline-none bg-transparent placeholder-gray-400"
                readOnly
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 1: MODELS VIEW (Deep Slate Navy Workspace) ── */}
      {activeNavPill === 'models' && (
        <div className="bg-[#121324] text-white rounded-2xl p-4 sm:p-5 shadow-2xl">
          {/* Inner Tab Control Bar with REAL FILTERING */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
              <span>Model Registry</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {filteredModels.length} Showing
              </span>
            </div>

            <div className="flex items-center gap-1 bg-[#1A1B30] p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterMode === 'all' ? 'bg-[#4F46E5] text-white font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                All ({modelsList.length})
              </button>
              <button
                onClick={() => setFilterMode('live')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterMode === 'live' ? 'bg-[#4F46E5] text-white font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Live ({modelsList.filter(m => m.status === 'Live').length})
              </button>
              <button
                onClick={() => setFilterMode('draft')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterMode === 'draft' ? 'bg-[#4F46E5] text-white font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Draft ({modelsList.filter(m => m.status === 'Draft').length})
              </button>
            </div>
          </div>

          {/* Master / Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left Model Queue List (5 columns) */}
            <div className="lg:col-span-5 space-y-2">
              {filteredModels.map((m) => {
                const isSelected = selectedModelId === m.id
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedModelId(m.id)
                      setTestResult(null)
                    }}
                    className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#4F46E5] to-[#4338CA] text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-[#181A32] hover:bg-[#1F213E] text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover border border-white/20" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs">{m.code}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-white/20 text-white' : m.statusColor}`}>
                            {m.algo}
                          </span>
                        </div>
                        <div className={`text-[11px] font-medium truncate max-w-[120px] ${isSelected ? 'text-indigo-100' : 'text-gray-400'}`}>
                          {m.name}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-xs">{m.accuracy}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-gray-500'}`}>
                        {m.metricLabel}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right Model Detail Showcase (7 columns - DYNAMIC INDIGO CARD) */}
            <div className="lg:col-span-7 bg-gradient-to-br from-[#2D2A82] via-[#242168] to-[#1A184E] rounded-2xl p-5 border border-indigo-400/30 shadow-xl space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-base tracking-tight text-white">{activeModel.code} {activeModel.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${activeModel.statusColor}`}>
                      {activeModel.status}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200 mt-0.5">Trained on: <strong className="text-white">{activeModel.dataset}</strong></p>
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src={activeModel.avatar}
                    alt={activeModel.analyst}
                    className="w-8 h-8 rounded-full border border-indigo-300/40 object-cover"
                  />
                  <div className="text-right text-[10px] text-indigo-200 hidden sm:block">
                    <div className="font-bold text-white">{activeModel.analyst}</div>
                    <div>{activeModel.role}</div>
                  </div>
                </div>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-white/[0.08] border border-white/10 backdrop-blur-sm">
                  <div className="text-[10px] font-mono text-indigo-200 uppercase">{activeModel.metricLabel}</div>
                  <div className="text-base font-extrabold text-white mt-0.5 font-mono">{activeModel.accuracy}</div>
                  <div className="text-[9px] text-emerald-300 font-medium">AutoML Verified</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.08] border border-white/10 backdrop-blur-sm">
                  <div className="text-[10px] font-mono text-indigo-200 uppercase">Latency</div>
                  <div className="text-base font-extrabold text-white mt-0.5 font-mono">{activeModel.latency}</div>
                  <div className="text-[9px] text-cyan-300 font-medium">Dedicated Micro-VM</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.08] border border-white/10 backdrop-blur-sm">
                  <div className="text-[10px] font-mono text-indigo-200 uppercase">F1-Score</div>
                  <div className="text-base font-extrabold text-white mt-0.5 font-mono">{activeModel.f1}</div>
                  <div className="text-[9px] text-indigo-200 font-medium">Balanced Split</div>
                </div>
              </div>

              {/* Endpoint / Live Prediction Sandbox */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="truncate max-w-[280px]">
                    <span className="text-indigo-300 text-[10px] font-mono">POST </span>
                    <span className="font-mono text-white text-[11px] font-semibold">{activeModel.endpoint}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                    READY (200 OK)
                  </span>
                </div>

                {/* Interactive Live Input Bar */}
                <div className="pt-2 border-t border-white/[0.06]">
                  <p className="text-[10px] font-mono uppercase text-indigo-200 mb-2 font-semibold flex items-center justify-between">
                    <span>Interactive Inference Test Bench</span>
                    <span className="text-cyan-300">Live Client Playground</span>
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div>
                      <label className="text-[9px] text-gray-400 block mb-1">Tenure (Months)</label>
                      <input
                        type="number"
                        value={inputTenure}
                        onChange={(e) => setInputTenure(Number(e.target.value))}
                        className="w-full bg-[#181A32] border border-white/10 rounded px-2 py-1 text-white text-xs outline-none focus:border-indigo-400"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-400 block mb-1">Monthly Spend ($)</label>
                      <input
                        type="number"
                        value={inputSpend}
                        onChange={(e) => setInputSpend(Number(e.target.value))}
                        className="w-full bg-[#181A32] border border-white/10 rounded px-2 py-1 text-white text-xs outline-none focus:border-indigo-400"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-400 block mb-1">Support Tickets</label>
                      <input
                        type="number"
                        value={inputTickets}
                        onChange={(e) => setInputTickets(Number(e.target.value))}
                        className="w-full bg-[#181A32] border border-white/10 rounded px-2 py-1 text-white text-xs outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  {/* Prediction Output Display */}
                  {testResult && (
                    <div className="mt-3 p-2.5 rounded-lg bg-indigo-950/80 border border-cyan-500/30 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-cyan-300 font-bold">{activeModel.predictionType}:</span>
                        <span className="font-mono text-emerald-400 font-bold">{testResult.outcome}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono mt-1 flex justify-between">
                        <span>Latency: {testResult.latency}</span>
                        <span>Confidence: {(1 - Number(testResult.probability)).toFixed(3)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => setShowShapModal(true)}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Brain size={13} className="text-cyan-300" />
                  <span>Inspect SHAP</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunPrediction}
                    disabled={isPredicting}
                    className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    {isPredicting ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
                    <span>Test Inference</span>
                  </button>

                  <button
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    className="px-4 py-2 rounded-xl bg-white text-[#121324] font-bold text-xs hover:bg-gray-100 shadow-[0_4px_16px_rgba(255,255,255,0.25)] transition-all flex items-center gap-1.5"
                  >
                    {isDeploying ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Deploying Micro-VM...</span>
                      </>
                    ) : deployedSuccess ? (
                      <>
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        <span>Live in Production!</span>
                      </>
                    ) : (
                      <span>Deploy to Production</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: OVERVIEW VIEW ── */}
      {activeNavPill === 'overview' && (
        <div className="bg-[#121324] text-white rounded-2xl p-5 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-[#00F2FE]" />
              <h4 className="font-extrabold text-sm tracking-tight text-white">Live Pipeline Operations & Telemetry</h4>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ● All Systems Operational
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Activity Stream */}
            <div className="lg:col-span-7 bg-[#181A32] rounded-xl p-4 border border-white/10 space-y-3">
              <p className="text-xs font-mono uppercase text-gray-400 font-semibold">Automated Activity Stream</p>
              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-start justify-between">
                  <div>
                    <div className="text-white font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      CatBoost Conversion Model Deployed
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">Trained on 24,500 rows with 95.4% ROC-AUC. Autoscaling 2 instances.</p>
                  </div>
                  <span className="text-[10px] text-gray-500">12m ago</span>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-start justify-between">
                  <div>
                    <div className="text-white font-semibold flex items-center gap-2">
                      <Shield size={12} className="text-cyan-300" />
                      Presidio PII Masking Scrubbed 14 Emails
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">Automated pseudonymization applied to customer contact column.</p>
                  </div>
                  <span className="text-[10px] text-gray-500">28m ago</span>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-start justify-between">
                  <div>
                    <div className="text-white font-semibold flex items-center gap-2">
                      <Zap size={12} className="text-amber-400" />
                      Revenue Forecast Batch Completed
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">Served 1,420 predictions in 340ms with 0 errors.</p>
                  </div>
                  <span className="text-[10px] text-gray-500">1h ago</span>
                </div>
              </div>
            </div>

            {/* Right System Health */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#2D2A82] via-[#242168] to-[#1A184E] rounded-xl p-4 border border-indigo-400/30 space-y-3.5">
              <p className="text-xs font-mono uppercase text-indigo-200 font-semibold">Engine Core Architecture</p>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-indigo-100">Polars Rust Engine</span>
                  <span className="text-emerald-400 font-semibold">2.4M rows/sec</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-indigo-100">Microsoft Presidio</span>
                  <span className="text-emerald-400 font-semibold">Active Shield</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-indigo-100">FastAPI Serverless</span>
                  <span className="text-cyan-300 font-semibold">8.4ms Latency</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-indigo-100">Watchtower Drift Guard</span>
                  <span className="text-emerald-400 font-semibold">0.038 PSI (Stable)</span>
                </div>
              </div>
              <button
                onClick={() => setActiveNavPill('models')}
                className="w-full py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold transition-colors shadow-md text-center block"
              >
                Inspect AutoML Models →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: PIPELINES VIEW (Visual DAG) ── */}
      {activeNavPill === 'pipelines' && (
        <div className="bg-[#121324] text-white rounded-2xl p-5 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h4 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
                <Layers size={16} className="text-[#00F2FE]" />
                Automated ML Pipeline DAG
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Click any stage node below to view transformation status and logs.</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              5 Nodes Passing
            </span>
          </div>

          {/* Flowchart Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-center">
            {[
              { id: 'ingest', step: '01', title: 'Data Ingestion', sub: 'CSV / Postgres', time: '120ms' },
              { id: 'refinery', step: '02', title: 'Data Refinery', sub: 'Polars Impute', time: '180ms' },
              { id: 'shield', step: '03', title: 'Privacy Shield', sub: 'Presidio PII', time: '95ms' },
              { id: 'automl', step: '04', title: 'AutoML Studio', sub: '5 Model Race', time: '1.4s' },
              { id: 'deploy', step: '05', title: 'Production Deploy', sub: 'FastAPI Rest', time: '14ms' },
            ].map((node) => {
              const isActive = selectedDagStage === node.id
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedDagStage(node.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all text-center relative ${
                    isActive
                      ? 'bg-gradient-to-b from-[#4F46E5] to-[#3730A3] border-indigo-400 shadow-lg shadow-indigo-500/30 text-white'
                      : 'bg-[#181A32] hover:bg-[#202342] border-white/10 text-gray-300'
                  }`}
                >
                  <div className="text-[10px] font-mono text-cyan-300 font-bold mb-0.5">{node.step}</div>
                  <div className="font-bold text-xs">{node.title}</div>
                  <div className="text-[10px] opacity-75 mt-0.5">{node.sub}</div>
                  <div className="mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 inline-block">
                    ✓ {node.time}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Node Detail Box */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-indigo-200">
              <span className="font-bold text-white uppercase">Selected Node: {selectedDagStage.toUpperCase()}</span>
              <span className="text-emerald-400">Status: PASSING (Zero Errors)</span>
            </div>
            <p className="text-[11px] text-gray-400">
              {selectedDagStage === 'ingest' && 'Connected to source dataset (1,000 records). Schema inferred automatically with Polars zero-copy scanner.'}
              {selectedDagStage === 'refinery' && 'Scanned 7 columns. Found 14 null values in monthly_charges and age. Imputed with column median.'}
              {selectedDagStage === 'shield' && 'Scanned customer contact columns for PII. Detected 1,000 email addresses. Anonymized to s***@domain format.'}
              {selectedDagStage === 'automl' && 'Ran 5-fold cross validation across XGBoost, LightGBM, Random Forest, and CatBoost. XGBoost won with 94.8% accuracy.'}
              {selectedDagStage === 'deploy' && 'Exported champion model to serialized ONNX runtime. Serverless REST endpoint live at /v1/predict.'}
            </p>
          </div>
        </div>
      )}

      {/* ── TAB 4: ENDPOINTS VIEW ── */}
      {activeNavPill === 'endpoints' && (
        <div className="bg-[#121324] text-white rounded-2xl p-5 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h4 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
                <Terminal size={16} className="text-[#00F2FE]" />
                Live Production Endpoints
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Autoscaling micro-instances serving low-latency REST inference.</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              HTTP 200 Live
            </span>
          </div>

          {/* Endpoints Table */}
          <div className="space-y-2 font-mono text-xs">
            {[
              { path: '/v1/predict/churn-1001', model: 'XGBoost Classifier', calls: '84,210', latency: '8.2ms' },
              { path: '/v1/predict/leads-1002', model: 'LightGBM Lead Scorer', calls: '31,450', latency: '12.0ms' },
              { path: '/v1/predict/rev-1003', model: 'Ensemble Stack Forecaster', calls: '16,200', latency: '14.0ms' },
              { path: '/v1/predict/fraud-1004', model: 'CatBoost Fraud Guard', calls: '26,900', latency: '8.0ms' },
            ].map((ep) => (
              <div key={ep.path} className="p-3 rounded-xl bg-[#181A32] border border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">POST</span>
                  <span className="text-white font-semibold">{ep.path}</span>
                  <span className="text-gray-400 text-[11px]">({ep.model})</span>
                </div>
                <div className="flex items-center gap-4 text-gray-400 text-[11px]">
                  <span>Calls: <strong className="text-white">{ep.calls}</strong></span>
                  <span>Latency: <strong className="text-cyan-300">{ep.latency}</strong></span>
                  <button
                    onClick={(e) => {
                      navigator.clipboard.writeText(`curl -X POST https://api.refineiq.ai${ep.path} -H "Authorization: Bearer riq_live_9b4e8"`)
                      const btn = e.currentTarget
                      btn.textContent = 'Copied!'
                      setTimeout(() => { btn.textContent = 'Copy cURL' }, 1500)
                    }}
                    className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] transition-colors"
                  >
                    Copy cURL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: WATCHTOWER VIEW ── */}
      {activeNavPill === 'watchtower' && (
        <div className="bg-[#121324] text-white rounded-2xl p-5 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h4 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
                <Activity size={16} className="text-[#00F2FE]" />
                Watchtower Telemetry & Live Inference Stream
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Real-time surveillance for feature distribution drift and inference latency.</p>
            </div>
            <button
              onClick={handleSimulateWatchtowerPing}
              className="px-3 py-1.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md"
            >
              <Zap size={12} />
              <span>+ Inject Live Ping</span>
            </button>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead className="bg-[#181A32] text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-3 py-2">Event ID</th>
                  <th className="px-3 py-2">Timestamp</th>
                  <th className="px-3 py-2">Inputs</th>
                  <th className="px-3 py-2">Prediction</th>
                  <th className="px-3 py-2">Confidence</th>
                  <th className="px-3 py-2">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {watchtowerLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-3 py-2 text-gray-400">{log.id}</td>
                    <td className="px-3 py-2 text-gray-500">{log.time}</td>
                    <td className="px-3 py-2 text-white truncate max-w-xs">{log.inputs}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.prediction === 'Churn Risk' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {log.prediction}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-white font-semibold">{log.confidence}</td>
                    <td className="px-3 py-2 text-cyan-300">{log.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 6: BILLING VIEW ── */}
      {activeNavPill === 'billing' && (
        <div className="bg-[#121324] text-white rounded-2xl p-5 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h4 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
                <Zap size={16} className="text-[#00F2FE]" />
                Operations Compute Units (OCUs) & Billing
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Pay only for the compute consumed during training and inference.</p>
            </div>
            <Link
              to="/settings"
              className="px-3 py-1.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold transition-all shadow-md"
            >
              Manage in Settings →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#181A32] border border-white/10 space-y-2">
              <span className="text-[11px] font-mono text-gray-400 uppercase">Current Balance</span>
              <div className="font-extrabold text-2xl text-white font-mono">186 OCUs</div>
              <p className="text-xs text-emerald-400 font-semibold font-mono">~18 hours of training left</p>
              <p className="text-[10px] text-gray-500">Auto-replenish enabled at 10 OCUs.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#181A32] border border-white/10 space-y-2">
              <span className="text-[11px] font-mono text-gray-400 uppercase">Usage This Cycle</span>
              <div className="font-extrabold text-2xl text-cyan-300 font-mono">14.2 OCUs</div>
              <p className="text-xs text-gray-300">AutoML: 65% • Serving: 25% • Clean: 10%</p>
              <p className="text-[10px] text-gray-500">Cost: $1.42 billed on compute usage.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#181A32] border border-white/10 space-y-2">
              <span className="text-[11px] font-mono text-gray-400 uppercase">Payment Method</span>
              <div className="font-extrabold text-base text-white">Secure Gateway</div>
              <p className="text-xs text-gray-300 font-mono">CARD •••• 4242</p>
              <p className="text-[10px] text-emerald-400">PCI-DSS Level 1 Encrypted</p>
            </div>
          </div>
        </div>
      )}

      {/* ── INTERACTIVE MODAL 1: AUTOML TOURNAMENT SIMULATOR ── */}
      {showTrainModal && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md rounded-[28px] p-6 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-[#151522] border border-white/15 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sparkles size={16} className="text-cyan-400" />
                <span>AutoML Benchmark Race</span>
              </div>
              <button
                onClick={() => setShowTrainModal(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-300">
              <p>Simulate training an AutoML pipeline across 5 benchmarked algorithms.</p>
              
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] space-y-1">
                <div className="text-gray-400">Dataset: <strong className="text-white">ecommerce_conversion_2026.csv</strong></div>
                <div className="text-gray-400">Rows: <strong className="text-cyan-300">24,500 tabular rows</strong></div>
                <div className="text-gray-400">PII Shield: <strong className="text-emerald-400">100% Masked (SHA-256)</strong></div>
              </div>

              {isTournamentRunning ? (
                <div className="space-y-2.5 py-3">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-cyan-300 animate-pulse">Running 5-Fold Cross Validation...</span>
                    <Loader2 size={13} className="animate-spin text-cyan-400" />
                  </div>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    <div className="flex justify-between"><span>XGBoost (Epoch 120)</span><span className="text-emerald-400">94.2%</span></div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden"><div className="bg-cyan-400 h-full w-[94%]" /></div>
                    
                    <div className="flex justify-between"><span>CatBoost (Deep Trees)</span><span className="text-emerald-400">95.4% WINNER</span></div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden"><div className="bg-emerald-400 h-full w-[95.4%]" /></div>

                    <div className="flex justify-between"><span>LightGBM</span><span>93.1%</span></div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden"><div className="bg-indigo-400 h-full w-[93%]" /></div>
                  </div>
                </div>
              ) : tournamentWinner ? (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={15} />
                    <span>Tournament Winner: {tournamentWinner.algo}</span>
                  </div>
                  <p className="text-[11px] text-emerald-400">Crowned with {tournamentWinner.accuracy} ROC-AUC! Model added to your registry queue.</p>
                </div>
              ) : null}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowTrainModal(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                Close
              </button>
              {!tournamentWinner ? (
                <button
                  onClick={handleStartTournament}
                  disabled={isTournamentRunning}
                  className="flex-1 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/30"
                >
                  {isTournamentRunning ? 'Racing Algorithms...' : 'Start Race'}
                </button>
              ) : (
                <button
                  onClick={() => setShowTrainModal(false)}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                >
                  View Model
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── INTERACTIVE MODAL 2: SHAP EXPLAINABILITY DRAWER ── */}
      {showShapModal && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md rounded-[28px] p-6 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-[#151522] border border-white/15 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Brain size={16} className="text-indigo-400" />
                <span>SHAP Feature Drivers — {activeModel.name}</span>
              </div>
              <button
                onClick={() => setShowShapModal(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-300">
              <p>Top features driving predictions for this model (plain-English weights):</p>
              
              <div className="space-y-2.5 font-mono text-[11px] p-3 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="flex justify-between text-zinc-200">
                    <span>contract_term_2yr</span>
                    <span className="text-emerald-400 font-bold">+0.42 (Reduces Risk)</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-1">
                    <div className="bg-emerald-400 h-1.5 rounded-full w-[84%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-200">
                    <span>support_tickets &gt; 2</span>
                    <span className="text-red-400 font-bold">-0.28 (Increases Risk)</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-1">
                    <div className="bg-red-400 h-1.5 rounded-full w-[56%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-200">
                    <span>monthly_charges</span>
                    <span className="text-amber-400 font-bold">-0.16</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-1">
                    <div className="bg-amber-400 h-1.5 rounded-full w-[32%]" />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowShapModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default function LandingPage() {
  const { user } = useAuthStore()
  const { isInstalled, openInstallModal } = usePwaInstall()
  const [openFaq, setOpenFaq] = useState(0)
  const [showOcuTooltip, setShowOcuTooltip] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const faqs = [
    {
      q: "What is an Operations Compute Unit (OCU) and how is it used?",
      a: "An OCU is our universal compute unit. 1 OCU pays for 1 complete automated dataset audit (null imputation + PII masking), 1 machine learning training pass, or up to 5,000 live REST API predictions. You get 50 free OCUs upon signup with no credit card required."
    },
    {
      q: "How does RefineIQ protect our customer data and PII?",
      a: "RefineIQ enforces a strict local privacy boundary using Microsoft Presidio. When you upload a CSV, all customer names, phone numbers, and emails are hashed and salted locally using SHA-256 before any model training or algorithm benchmarking occurs. Raw PII never leaves your boundary."
    },
    {
      q: "Do I need to know Python, Docker, or data science algorithms?",
      a: "Not at all. RefineIQ was built specifically for data analysts, product managers, and growth engineers. Simply upload your spreadsheet, select your target goal (e.g. churn or lead conversion), and RefineIQ benchmarks 5 algorithms, selects the champion, and gives you a one-click REST API."
    },
    {
      q: "Can I export trained models or run predictions in our own cloud?",
      a: "Yes. In addition to our hosted sub-20ms API endpoints, Pro and Enterprise tiers allow you to export trained weights as standard ONNX or Scikit-Learn/XGBoost artifacts to run locally in your own VPC."
    },
    {
      q: "How does billing and payment work?",
      a: "We offer secure global payments across credit/debit cards, bank transfers, and mobile money. Instant payment confirmation and tax-compliant receipts are provided immediately."
    }
  ]

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (newsletterEmail) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 4000)
      setNewsletterEmail('')
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F4F4F5] font-sans antialiased relative selection:bg-[#4F46E5] selection:text-white">
      
      {/* Subtle architectural background texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Ambient glowing radial lights */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#4F46E5]/15 via-[#00F2FE]/5 to-transparent blur-[140px] pointer-events-none" />

      {/* ─────────────────────────────────────────────────────────────────────
          1. STICKY NAVBAR
          ───────────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0C]/85 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="default" />
          
          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
            <a href="#benefits" className="hover:text-white transition-colors">Benefits</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            {!isInstalled && (
              <button
                onClick={openInstallModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-zinc-300 hover:text-white text-xs font-semibold transition-all"
                title="Install RefineIQ as a standalone desktop app"
              >
                <Download size={13} className="text-cyan-400" />
                <span>Install App</span>
              </button>
            )}

            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold transition-all shadow-[0_0_18px_rgba(79,70,229,0.35)] flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <ArrowRight size={13} />
              </Link>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold transition-all shadow-[0_0_18px_rgba(79,70,229,0.35)] flex items-center gap-1.5"
              >
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────────────
          2. HERO AREA (Problem-focused + Finnova Interactive Sandbox)
          ───────────────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        
        {/* Top Centered Header with Social Proof */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-5">
          
          {/* Social Proof Pill (From Image 1 Guide) */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
            <div className="flex -space-x-1.5">
              <img className="w-5 h-5 rounded-full border border-black object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face" alt="User" />
              <img className="w-5 h-5 rounded-full border border-black object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" alt="User" />
              <img className="w-5 h-5 rounded-full border border-black object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face" alt="User" />
            </div>
            <span>1,420+ active data analysts and engineers</span>
          </div>

          {/* Title / Heading */}
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Deploy predictive machine learning{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FE] via-[#818CF8] to-[#C084FC]">
              straight from your spreadsheets.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Upload any raw CSV or database export. RefineIQ cleans corrupted records, hashes sensitive PII, benchmarks top algorithms, and deploys a sub-20ms prediction API.
          </p>

          {/* Primary + Secondary CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              to="/auth"
              className="px-8 py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] active:scale-98 text-white font-semibold text-sm transition-all shadow-[0_0_28px_rgba(79,70,229,0.45)] flex items-center gap-2"
            >
              <span>Train Your First Model Free</span>
              <ArrowRight size={16} />
            </Link>

            <a
              href="#how-it-works"
              className="px-6 py-3.5 rounded-xl bg-[#151518] hover:bg-[#1A1A1E] text-zinc-300 hover:text-white font-semibold text-sm transition-all border border-white/[0.08]"
            >
              How It Works (3 Steps)
            </a>
          </div>

          {/* OCU Explainer Footnote */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-500 pt-1">
            <span>✓ 50 Free Compute Units (OCUs) on signup</span>
            <span>&bull;</span>
            <span>✓ No credit card required</span>
            <span>&bull;</span>
            <div className="relative inline-block">
              <button
                onMouseEnter={() => setShowOcuTooltip(true)}
                onMouseLeave={() => setShowOcuTooltip(false)}
                onClick={() => setShowOcuTooltip(!showOcuTooltip)}
                className="inline-flex items-center gap-1 text-cyan-400 hover:underline cursor-pointer"
              >
                <Info size={13} />
                <span>What is an OCU?</span>
              </button>

              {showOcuTooltip && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-3 rounded-xl bg-[#18181C] border border-white/[0.15] text-[11px] text-zinc-300 shadow-2xl z-50 text-left">
                  <p className="font-bold text-white mb-1">Operations Compute Unit (OCU)</p>
                  <p className="text-zinc-400 leading-normal">
                    1 OCU pays for 1 complete automated dataset audit, 1 AutoML model evaluation, or up to 5,000 live REST API predictions. 50 OCUs give you plenty of compute to test and deploy.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* The Fully Interactive Finnova-Style UI Showcase */}
        <div className="mt-8 max-w-6xl mx-auto">
          <FinnovaProductUI />
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          3. PARTNERS SECTION
          ───────────────────────────────────────────────────────────────────── */}
      <div className="border-y border-white/[0.07] bg-white/[0.015] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-mono uppercase tracking-widest text-zinc-500 mb-8">
            Trusted by data teams and analysts at fast-growing companies
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-8 items-center justify-items-center opacity-60 hover:opacity-100 transition-opacity">
            <span className="font-mono text-xs tracking-[0.25em] font-semibold text-zinc-400 hover:text-zinc-200 transition-colors uppercase">PAYPULSE</span>
            <span className="font-mono text-xs tracking-[0.25em] font-semibold text-zinc-400 hover:text-zinc-200 transition-colors uppercase">LUMINA LABS</span>
            <span className="font-mono text-xs tracking-[0.25em] font-semibold text-zinc-400 hover:text-zinc-200 transition-colors uppercase">APEX LOGISTICS</span>
            <span className="font-mono text-xs tracking-[0.25em] font-semibold text-zinc-400 hover:text-zinc-200 transition-colors uppercase">KINETIK AI</span>
            <span className="col-span-2 sm:col-span-4 md:col-span-1 font-mono text-xs tracking-[0.25em] font-semibold text-zinc-400 hover:text-zinc-200 transition-colors uppercase">ORBIT CLOUD</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          4. BENEFITS (Bento Box Section - How it helps the user)
          ───────────────────────────────────────────────────────────────────── */}
      <section id="benefits" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-[#00F2FE] mb-2 font-bold">
            Customer-First Benefits
          </p>
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white">
            Built to solve your actual data bottlenecks.
          </h2>
          <p className="text-zinc-400 text-sm mt-3">
            Focus on business impact, customer churn, and conversion rates — not fragmented notebooks.
          </p>
        </div>

        {/* Bento Grid Layout (3 top, 2 wide bottom) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento 1: Instant Business Predictions */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-7 flex flex-col justify-between hover:border-indigo-500/40 transition-all group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <Brain size={20} />
              </div>
              <h3 className="font-headline text-lg font-bold text-white">Ship Models in 30 Mins</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Skip the 3-week backlog of waiting on centralized engineering teams. Clean, train, and test your own churn, scoring, or pricing models before lunch.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.05] text-[11px] text-indigo-300 font-mono">
              ⚡ 0 lines of Python required
            </div>
          </div>

          {/* Bento 2: Zero-Compliance Anxiety */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-7 flex flex-col justify-between hover:border-emerald-500/40 transition-all group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Shield size={20} />
              </div>
              <h3 className="font-headline text-lg font-bold text-white">Zero PII Leak Anxiety</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Microsoft Presidio audits datasets locally. Customer names, phones, and emails are hashed with SHA-256 before algorithms ever inspect column features.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.05] text-[11px] text-emerald-300 font-mono">
              🛡️ GDPR & HIPAA compliant boundaries
            </div>
          </div>

          {/* Bento 3: Rust-Speed Polars */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-7 flex flex-col justify-between hover:border-cyan-500/40 transition-all group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                <Zap size={20} />
              </div>
              <h3 className="font-headline text-lg font-bold text-white">Polars Multithread Engine</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Processes 500,000 CSV rows in 0.4 seconds. Missing records and null values are auto-imputed with smart statistical medians without freezing your browser.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.05] text-[11px] text-cyan-300 font-mono">
              🚀 12x faster than Python Pandas
            </div>
          </div>

          {/* Bento 4: Explainable SHAP Drivers (Wide Card) */}
          <div className="md:col-span-2 rounded-2xl border border-white/[0.08] bg-[#111114] p-7 flex flex-col sm:flex-row justify-between gap-6 hover:border-purple-500/40 transition-all">
            <div className="space-y-3 sm:max-w-md">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Layers size={20} />
              </div>
              <h3 className="font-headline text-lg font-bold text-white">Plain-English Explainability</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Business leaders don't trust black boxes. RefineIQ breaks down the exact feature drivers behind every decision (e.g., <em>"Contract term &gt; 12 months reduces churn risk by 42%"</em>).
              </p>
              <div className="text-[11px] text-purple-300 font-mono">
                📊 SHAP-inspired driver weights on every API call
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] text-xs font-mono space-y-2 flex-1">
              <div className="text-zinc-500 text-[10px]">FEATURE WEIGHT EXPLAINER</div>
              <div className="flex justify-between items-center text-zinc-300">
                <span>contract_2yr</span>
                <span className="text-emerald-400 font-bold">+41% Impact</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5">
                <div className="bg-emerald-400 h-1.5 rounded-full w-[82%]" />
              </div>
              <div className="flex justify-between items-center text-zinc-300 pt-1">
                <span>support_tickets &gt; 3</span>
                <span className="text-red-400 font-bold">-28% Churn Risk</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5">
                <div className="bg-red-400 h-1.5 rounded-full w-[56%]" />
              </div>
            </div>
          </div>

          {/* Bento 5: Watchtower Drift Guard */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-7 flex flex-col justify-between hover:border-amber-500/40 transition-all group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <Activity size={20} />
              </div>
              <h3 className="font-headline text-lg font-bold text-white">Watchtower Drift Guard</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Customer behavior changes over time. Watchtower monitors production prediction distributions and alerts you before accuracy degrades.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.05] text-[11px] text-amber-300 font-mono">
              🛡️ Automated model health alerts
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          5. HOW IT WORKS (3 Simple Steps - Image 1 Guide)
          ───────────────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/[0.07] bg-[#0E0E11]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-mono uppercase tracking-widest text-[#00F2FE] mb-2 font-bold">
              3 Simple Steps
            </p>
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white">
              How to get started in 3 simple steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#131317] border border-white/[0.08] space-y-4 hover:border-indigo-500/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono font-bold text-lg">
                01
              </div>
              <h3 className="font-headline text-lg font-bold text-white">Upload Your Spreadsheet</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Drop your CSV or Excel export into RefineIQ. The system auto-identifies data types, imputes missing values, and scrubs PII without manual python data-cleaning scripts.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#131317] border border-white/[0.08] space-y-4 hover:border-cyan-500/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-lg">
                02
              </div>
              <h3 className="font-headline text-lg font-bold text-white">AutoML Algorithm Race</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Select your target column (e.g. churn or conversion). 5 state-of-the-art algorithms train and benchmark in parallel with 5-fold cross-validation. The highest-accuracy champion is crowned.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#131317] border border-white/[0.08] space-y-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg">
                03
              </div>
              <h3 className="font-headline text-lg font-bold text-white">Deploy One-Click API</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Copy your dedicated REST endpoint URL and Bearer token. Send real-time JSON requests from your app, Zapier, or CRM and receive predictions in under 20 milliseconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          6. PRICING SECTION (Highlight Middle Plan - Image 1 Guide)
          ───────────────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-[#00F2FE] mb-2 font-bold">
            Transparent Economics
          </p>
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white">
            Simple pay-as-you-go compute units.
          </h2>
          <p className="text-zinc-400 text-sm mt-3">
            No monthly lock-ins. Top up Operations Compute Units (OCUs) whenever you need to train or deploy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Tier 1: Starter */}
          <div className="rounded-3xl bg-[#121216] border border-white/[0.08] p-8 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="font-bold text-sm text-zinc-300">Starter Pack</div>
              <div className="flex items-baseline gap-1">
                <span className="font-headline text-4xl font-extrabold text-white font-mono">$5</span>
                <span className="text-xs text-zinc-500">/ 50 OCUs</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ideal for trying out RefineIQ on a single dataset and launching your first prediction endpoint.
              </p>
              <ul className="space-y-2.5 text-xs text-zinc-300 pt-2">
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> 50 Compute Units (OCUs)</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Polars data cleaning engine</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Microsoft Presidio PII masking</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> 1 concurrent model endpoint</li>
              </ul>
            </div>

            <Link
              to="/auth"
              className="w-full py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-semibold text-center transition-all border border-white/[0.08]"
            >
              Get Started Free
            </Link>
          </div>

          {/* Tier 2: Standard Pro (MOST POPULAR - Highlighted) */}
          <div className="rounded-3xl bg-gradient-to-b from-[#1E1B4B] to-[#12121A] border-2 border-[#4F46E5] p-8 flex flex-col justify-between space-y-8 relative shadow-[0_0_40px_rgba(79,70,229,0.3)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#4F46E5] text-white text-[10px] font-bold font-mono uppercase tracking-wider shadow-md">
              Most Popular
            </div>

            <div className="space-y-4">
              <div className="font-bold text-sm text-indigo-300">Standard Pack</div>
              <div className="flex items-baseline gap-1">
                <span className="font-headline text-4xl font-extrabold text-white font-mono">$12</span>
                <span className="text-xs text-indigo-200">/ 150 OCUs</span>
              </div>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Best for fast-moving startups and product teams deploying active customer scoring models.
              </p>
              <ul className="space-y-2.5 text-xs text-zinc-100 pt-2">
                <li className="flex items-center gap-2"><Check size={14} className="text-[#00F2FE]" /> <strong>150 Compute Units (OCUs)</strong></li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#00F2FE]" /> Full AutoML race (5 algorithms)</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#00F2FE]" /> Sub-20ms low-latency endpoints</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#00F2FE]" /> SHAP explainability weights</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#00F2FE]" /> Watchtower drift detection</li>
              </ul>
            </div>

            <Link
              to="/auth"
              className="w-full py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold text-center transition-all shadow-[0_0_20px_rgba(79,70,229,0.5)]"
            >
              Start with Standard Pack
            </Link>
          </div>

          {/* Tier 3: Pro Scale */}
          <div className="rounded-3xl bg-[#121216] border border-white/[0.08] p-8 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="font-bold text-sm text-zinc-300">Pro Scale</div>
              <div className="flex items-baseline gap-1">
                <span className="font-headline text-4xl font-extrabold text-white font-mono">$35</span>
                <span className="text-xs text-zinc-500">/ 500 OCUs</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                For scale-ups running continuous predictions across millions of customer requests per month.
              </p>
              <ul className="space-y-2.5 text-xs text-zinc-300 pt-2">
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> 500 Compute Units (OCUs)</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Unlimited concurrent endpoints</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> ONNX / Scikit model weight exports</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Multi-region latency replication</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Priority technical support</li>
              </ul>
            </div>

            <Link
              to="/auth"
              className="w-full py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-semibold text-center transition-all border border-white/[0.08]"
            >
              Get Pro Scale
            </Link>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          7. TESTIMONIALS ("Loved by people worldwide" - Image 1 Guide)
          ───────────────────────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 px-6 border-t border-white/[0.07] bg-[#0B0B0E]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-mono uppercase tracking-widest text-[#00F2FE] mb-2 font-bold">
              Customer Stories
            </p>
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white">
              Loved by data people worldwide.
            </h2>
            <p className="text-zinc-400 text-sm mt-3">
              See how operations and analytics teams ship predictive intelligence in record time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl bg-[#131317] border border-white/[0.08] flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#FBBF24" />
                  ))}
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  "We used to wait 3 weeks for data engineering just to train a basic lead-scoring model. With RefineIQ, our growth ops team uploaded the CSV and had a live prediction webhook running in our CRM before lunch."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" alt="Kabwe Mumba" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                <div>
                  <div className="font-bold text-xs text-white">Kabwe Mumba</div>
                  <div className="text-[11px] text-zinc-500">Head of Growth &bull; PayPulse</div>
                </div>
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-[#131317] border border-white/[0.08] flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#FBBF24" />
                  ))}
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  "The automatic PII redaction alone saved us months of legal and compliance back-and-forth. It audits messy customer files and drops clean models straight into our microservice endpoints with zero DevOps maintenance."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" alt="Elena Rostova" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                <div>
                  <div className="font-bold text-xs text-white">Elena Rostova</div>
                  <div className="text-[11px] text-zinc-500">Lead ML Engineer &bull; Lumina Labs</div>
                </div>
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-[#131317] border border-white/[0.08] flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#FBBF24" />
                  ))}
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  "The explainability feature (SHAP feature weights) gave our executives the confidence to actually rely on the predictions. Being able to explain why a customer is high-risk in plain English changed everything."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" alt="Marcus Vance" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                <div>
                  <div className="font-bold text-xs text-white">Marcus Vance</div>
                  <div className="text-[11px] text-zinc-500">VP Operations &bull; Apex Logistics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          8. FAQ SECTION (Accordion - Image 1 Guide)
          ───────────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-[#00F2FE] mb-2 font-bold">
            Got Questions?
          </p>
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => {
            const isOpen = openFaq === i
            return (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.08] bg-[#121216] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : i)}
                  className="w-full p-5 text-left font-bold text-sm text-white flex items-center justify-between gap-4"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          9. STANDOUT CTA CONTAINER (Image 1 Guide)
          ───────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 text-center max-w-5xl mx-auto">
        <div className="p-10 sm:p-16 rounded-[32px] bg-gradient-to-b from-[#1F1B4B] via-[#14142B] to-[#0D0D15] border-2 border-[#4F46E5]/60 shadow-[0_0_60px_rgba(79,70,229,0.3)] relative overflow-hidden">
          
          <div className="relative z-10 space-y-6">
            <h2 className="font-headline text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to deploy your first model today?
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Drop your spreadsheet, run a benchmark tournament, and get a production prediction endpoint in under 30 minutes. 50 free compute units included.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/auth"
                className="px-8 py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] active:scale-98 text-white font-semibold text-sm transition-all shadow-[0_0_24px_rgba(79,70,229,0.5)] flex items-center gap-2"
              >
                <span>Start Free with 50 OCUs</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/pricing"
                className="px-6 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-medium text-sm transition-all border border-white/[0.1]"
              >
                Explore OCU Packages
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-xs text-indigo-200 pt-3">
              <span>✓ No credit card required</span>
              <span>&bull;</span>
              <span>✓ Instant API key</span>
              <span>&bull;</span>
              <span>✓ Privacy Shield active</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          10. HUMAN FOOTER (With Newsletter - Image 1 Guide)
          ───────────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.08] bg-[#070709] py-16 px-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10">
          
          <div className="col-span-2 space-y-4">
            <Logo size="default" />
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              The automated machine learning and tabular intelligence platform. Clean data, benchmark models, and deploy production endpoints in minutes.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>All prediction gateways operational (99.98%)</span>
            </div>
            
            {/* Newsletter Input */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-zinc-300 mb-1.5">Subscribe to AutoML Engineering Updates</p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-xs">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-[#111114] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg bg-[#4F46E5] text-white font-semibold text-xs hover:bg-[#4338CA] transition-colors flex-shrink-0"
                >
                  Join
                </button>
              </form>
              {subscribed && (
                <p className="text-[10px] text-emerald-400 mt-1">✓ You're subscribed to RefineIQ briefings!</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-bold font-mono uppercase text-zinc-300 text-[11px]">Product</p>
            <ul className="space-y-2">
              <li><Link to="/auth" className="hover:text-zinc-300 transition-colors">Data Ingestion</Link></li>
              <li><Link to="/auth" className="hover:text-zinc-300 transition-colors">Refinery PII Shield</Link></li>
              <li><Link to="/auth" className="hover:text-zinc-300 transition-colors">AutoML Studio</Link></li>
              <li><Link to="/auth" className="hover:text-zinc-300 transition-colors">Prediction Endpoints</Link></li>
              <li><Link to="/auth" className="hover:text-zinc-300 transition-colors">Watchtower Drift</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-bold font-mono uppercase text-zinc-300 text-[11px]">Billing & Docs</p>
            <ul className="space-y-2">
              <li><Link to="/pricing" className="hover:text-zinc-300 transition-colors">Pricing & OCU Tiers</Link></li>
              <li><Link to="/settings" className="hover:text-zinc-300 transition-colors">OCU Top-Up</Link></li>
              <li><a href="#how-it-works" className="hover:text-zinc-300 transition-colors">Architecture Guide</a></li>
              <li><a href="mailto:support@refineiq.ai" className="hover:text-zinc-300 transition-colors">Technical Support</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-bold font-mono uppercase text-zinc-300 text-[11px]">Trust & Legal</p>
            <ul className="space-y-2">
              <li><Link to="/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</Link></li>
              <li><Link to="/terms" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-zinc-300 transition-colors">Security Architecture</Link></li>
              <li><a href="mailto:legal@refineiq.ai" className="hover:text-zinc-300 transition-colors">Compliance Inquiries</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-600">
          <span>&copy; {new Date().getFullYear()} RefineIQ Platform Inc. &bull; Lusaka & Global Remote</span>
          <span>Crafted for high-performing data science & business analytics teams.</span>
        </div>
      </footer>

    </div>
  )
}
