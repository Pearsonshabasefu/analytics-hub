import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, Folder, Clock, ChevronRight, Zap, BarChart2, TrendingUp,
  LogOut, Settings, Moon, Sun, Sparkles, Activity, ShieldCheck, Play, Database,
  Download, Monitor, Trash2
} from 'lucide-react'
import apiClient from '../lib/apiClient'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { usePwaInstall } from '../hooks/usePwaInstall'
import NamingModal from '../components/features/launcher/NamingModal'
import Logo from '../components/common/Logo'

// Sample demo projects for instant exploration and offline fallback
const DEFAULT_DEMO_PROJECTS = [
  {
    id: 'demo-proj-churn',
    name: 'Customer Churn Risk Analyzer',
    template: 'churn_prediction',
    status: 'deployed',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    accuracy: '94.8%',
    algo: 'XGBoost',
    datasetSize: '1,000 records',
  },
  {
    id: 'demo-proj-sales',
    name: 'Q4 Revenue Forecast Model',
    template: 'sales_forecasting',
    status: 'modeling',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    accuracy: '92.4%',
    algo: 'LightGBM',
    datasetSize: '4,500 records',
  },
  {
    id: 'demo-proj-fraud',
    name: 'E-Commerce Fraud Detection',
    template: null,
    status: 'cleaning',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    accuracy: '98.1%',
    algo: 'CatBoost',
    datasetSize: '12,200 records',
  },
]

// Deduplicate projects helper: ensures unique IDs and prevents multiple pending projects with duplicate names
const deduplicateProjects = (list) => {
  if (!Array.isArray(list)) return []
  const seenIds = new Set()
  const seenCreatedNames = new Set()
  const result = []

  for (const p of list) {
    if (!p || !p.id) continue
    if (seenIds.has(p.id)) continue

    const nameKey = p.name ? p.name.trim().toLowerCase() : ''
    // If multiple projects are "created" or "Pending" with the exact same name, keep only one
    if ((p.status === 'created' || p.algo === 'Pending') && seenCreatedNames.has(nameKey)) {
      continue
    }

    seenIds.add(p.id)
    if (p.status === 'created' || p.algo === 'Pending') {
      seenCreatedNames.add(nameKey)
    }
    result.push(p)
  }
  return result
}

// Fetch projects with robust fallback
const fetchProjects = async () => {
  try {
    const res = await apiClient.get('/api/projects/')
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return deduplicateProjects(res.data)
    }
  } catch (err) {
    // Backend offline / demo mode fallback
  }

  const saved = localStorage.getItem('refineiq_user_projects')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const deduped = deduplicateProjects(parsed)
        if (deduped.length !== parsed.length) {
          localStorage.setItem('refineiq_user_projects', JSON.stringify(deduped))
        }
        return deduped
      }
    } catch (_) {}
  }
  return DEFAULT_DEMO_PROJECTS
}

const createProject = async (data) => {
  try {
    const res = await apiClient.post('/api/projects/', data)
    return res.data
  } catch (err) {
    const newProj = {
      id: `proj-${Date.now()}`,
      name: data.name || 'Untitled Project',
      template: data.template || null,
      status: 'created',
      created_at: new Date().toISOString(),
      accuracy: 'New',
      algo: 'Pending',
    }
    const current = JSON.parse(localStorage.getItem('refineiq_user_projects') || '[]')
    const baseList = current.length ? current : DEFAULT_DEMO_PROJECTS
    const updated = deduplicateProjects([newProj, ...baseList])
    localStorage.setItem('refineiq_user_projects', JSON.stringify(updated))
    return newProj
  }
}

const STATUS_BADGE = {
  created:    { label: 'New',        class: 'badge-neutral' },
  ingesting:  { label: 'Ingesting',  class: 'badge-info' },
  cleaning:   { label: 'Cleaning',   class: 'badge-warning' },
  modeling:   { label: 'Modeling',   class: 'badge-warning' },
  deploying:  { label: 'Deploying',  class: 'badge-info' },
  deployed:   { label: 'Live',       class: 'badge-active' },
  error:      { label: 'Error',      class: 'badge-error' },
}

const TEMPLATES = [
  {
    id: 'churn_prediction',
    icon: '🔄',
    label: 'SaaS Churn Prediction',
    desc: 'Predict which customers will leave next 30 days',
    tag: 'Popular',
    accuracy: '94.8%',
    algo: 'XGBoost',
    sampleCols: ['customer_id', 'tenure_months', 'monthly_spend', 'plan_tier', 'churned'],
    sampleRows: [
      ['CUST-1001', '14', '$89.50', 'Enterprise', '❌'],
      ['CUST-1002', '2', '$12.00', 'Starter', '✅'],
      ['CUST-1003', '22', '$210.40', 'Pro', '❌'],
    ],
  },
  {
    id: 'sales_forecasting',
    icon: '📈',
    label: 'E-Commerce LTV',
    desc: 'Predict lifetime customer value & revenue trends',
    tag: 'Time-Series',
    accuracy: '92.4%',
    algo: 'Prophet + LGB',
    sampleCols: ['order_date', 'customer_id', 'order_value', 'category', 'ltv_90d'],
    sampleRows: [
      ['2024-01-15', 'USR-4401', '$142.30', 'Electronics', '$680'],
      ['2024-01-16', 'USR-4402', '$28.50', 'Apparel', '$210'],
      ['2024-01-17', 'USR-4403', '$520.00', 'Furniture', '$1,240'],
    ],
  },
  {
    id: 'fraud_detection',
    icon: '🛡️',
    label: 'Logistics Fraud Detection',
    desc: 'Flag suspicious transactions before they process',
    tag: 'High Accuracy',
    accuracy: '98.1%',
    algo: 'CatBoost',
    sampleCols: ['tx_id', 'amount', 'merchant', 'device_new', 'is_fraud'],
    sampleRows: [
      ['TX-9001', '$4.99', 'Starbucks', 'No', '❌'],
      ['TX-9002', '$1,840', 'Unknown_Vendor', 'Yes', '✅'],
      ['TX-9003', '$23.50', 'Amazon', 'No', '❌'],
    ],
  },
  {
    id: 'lead_scoring',
    icon: '🎯',
    label: 'B2B Lead Scoring',
    desc: 'Rank inbound leads by conversion probability',
    tag: 'Growth Ops',
    accuracy: '89.3%',
    algo: 'LightGBM',
    sampleCols: ['lead_id', 'company_size', 'industry', 'source', 'score'],
    sampleRows: [
      ['LEAD-501', '200-500', 'SaaS', 'LinkedIn', '87%'],
      ['LEAD-502', '1-10', 'Retail', 'Cold Email', '12%'],
      ['LEAD-503', '1000+', 'Finance', 'Webinar', '94%'],
    ],
  },
  {
    id: 'inventory_forecast',
    icon: '📦',
    label: 'Inventory Demand Forecast',
    desc: 'Predict stock demand to avoid overstock & stockouts',
    tag: 'Operations',
    accuracy: '91.7%',
    algo: 'Prophet',
    sampleCols: ['sku_id', 'week', 'units_sold', 'price', 'forecast_units'],
    sampleRows: [
      ['SKU-7701', 'W-42', '1,240', '$14.99', '1,310'],
      ['SKU-7702', 'W-42', '88', '$199.99', '95'],
      ['SKU-7703', 'W-42', '4,200', '$4.50', '4,050'],
    ],
  },
  {
    id: null,
    icon: '⚡',
    label: 'Blank Project',
    desc: 'Start from scratch with your own dataset',
    tag: null,
    accuracy: null,
    algo: null,
    sampleCols: [],
    sampleRows: [],
  },
]

function ProjectCard({ project, onClick, onStageJump, onDelete }) {
  const badge = STATUS_BADGE[project.status] || STATUS_BADGE.created
  const date = new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div className="group bg-white border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-2xl p-5 text-left transition-all shadow-ah-card hover:shadow-ah-glow flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 bg-ah-primary-glow rounded-xl flex items-center justify-center">
            <BarChart2 size={18} className="text-ah-primary" />
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono px-2 py-1 rounded-md ${badge.class}`}>{badge.label}</span>
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(project.id)
                }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-all"
                title="Delete project"
                aria-label={`Delete project ${project.name}`}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        <button onClick={onClick} className="text-left w-full">
          <h3 className="font-headline font-bold text-base mb-1 text-slate-900 dark:text-white group-hover:text-ah-primary transition-colors">
            {project.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            {project.algo && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-ah-primary">
                {project.algo}
              </span>
            )}
            {project.accuracy && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400 font-semibold">
                {project.accuracy}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Quick Stage Jump Links */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 mt-3">
        <p className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 mb-2">Jump to pipeline stage:</p>
        <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono">
          <button
            onClick={() => onStageJump(project, 'ingest')}
            className="px-2 py-1 rounded bg-slate-100 hover:bg-ah-primary hover:text-white dark:bg-slate-700/50 dark:hover:bg-ah-primary dark:hover:text-white border border-slate-200 dark:border-slate-600 transition-colors text-slate-700 dark:text-slate-300"
            title="Data Ingestion"
          >
            01 Ingest
          </button>
          <button
            onClick={() => onStageJump(project, 'refinery')}
            className="px-2 py-1 rounded bg-slate-100 hover:bg-ah-primary hover:text-white dark:bg-slate-700/50 dark:hover:bg-ah-primary dark:hover:text-white border border-slate-200 dark:border-slate-600 transition-colors text-slate-700 dark:text-slate-300"
            title="Data Refinery (Cleaning & PII)"
          >
            02 Refinery
          </button>
          <button
            onClick={() => onStageJump(project, 'studio')}
            className="px-2 py-1 rounded bg-slate-100 hover:bg-ah-primary hover:text-white dark:bg-slate-700/50 dark:hover:bg-ah-primary dark:hover:text-white border border-slate-200 dark:border-slate-600 transition-colors text-slate-700 dark:text-slate-300"
            title="AutoML Model Studio"
          >
            03 Studio
          </button>
          <button
            onClick={() => onStageJump(project, 'deploy')}
            className="px-2 py-1 rounded bg-slate-100 hover:bg-ah-primary hover:text-white dark:bg-slate-700/50 dark:hover:bg-ah-primary dark:hover:text-white border border-slate-200 dark:border-slate-600 transition-colors text-slate-700 dark:text-slate-300"
            title="Live API & Playground"
          >
            04 Deploy
          </button>
          <button
            onClick={() => onStageJump(project, 'watchtower')}
            className="px-2 py-1 rounded bg-slate-100 hover:bg-ah-primary hover:text-white dark:bg-slate-700/50 dark:hover:bg-ah-primary dark:hover:text-white border border-slate-200 dark:border-slate-600 transition-colors text-slate-700 dark:text-slate-300"
            title="Live Watchtower Monitoring"
          >
            05 Watchtower
          </button>
        </div>

        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/40">
          <Clock size={11} />
          <span>{date}</span>
          <button
            onClick={onClick}
            className="ml-auto text-ah-primary hover:underline text-xs font-semibold flex items-center gap-1"
          >
            Open Project <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, setUser } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const { isInstalled, openInstallModal } = usePwaInstall()
  const [showNaming, setShowNaming] = useState(false)
  const [activeBlueprint, setActiveBlueprint] = useState(null)

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: (newProject) => {
      queryClient.invalidateQueries(['projects'])
      navigate(`/project/${newProject.id}/ingest`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (projectId) => {
      try {
        await apiClient.delete(`/api/projects/${projectId}`)
      } catch (_) {
        // Backend offline / demo mode fallback
      }
      const saved = localStorage.getItem('refineiq_user_projects')
      const current = saved ? JSON.parse(saved) : DEFAULT_DEMO_PROJECTS
      const updated = current.filter((p) => p.id !== projectId)
      localStorage.setItem('refineiq_user_projects', JSON.stringify(deduplicateProjects(updated)))
      return projectId
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
    },
  })

  const handleDeleteProject = (projectId) => {
    deleteMutation.mutate(projectId)
  }

  const handleProjectClick = (project) => {
    const routes = {
      created:   'ingest',
      ingesting: 'ingest',
      cleaning:  'refinery',
      modeling:  'studio',
      deploying: 'deploy',
      deployed:  'watchtower',
      error:     'refinery',
    }
    navigate(`/project/${project.id}/${routes[project.status] || 'ingest'}`)
  }

  const handleStageJump = (project, stage) => {
    navigate(`/project/${project.id}/${stage}`)
  }

  const handleCreateProject = ({ name, template }) => {
    mutation.mutate({ name, template })
    setShowNaming(false)
  }

  const handleSignOut = async () => {
    localStorage.removeItem('refineiq_auth_user')
    await supabase.auth.signOut()
    setUser(null)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-ah-bg">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex w-full justify-between items-center px-6 py-4 flex-wrap gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <Logo size="default" />
            <div className="hidden sm:flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => navigate('/project/demo-proj-churn/watchtower')}
                className="text-xs px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white hover:border-ah-primary font-semibold transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap"
              >
                <Activity size={13} className="text-green-500 dark:text-green-400 shrink-0" />
                <span>Watchtower Pulse</span>
              </button>
              <button
                onClick={() => navigate('/project/demo-proj-churn/deploy')}
                className="text-xs px-3 py-1.5 rounded-xl bg-ah-primary text-white font-semibold hover:bg-ah-primary/80 transition-all shadow-ah-glow flex items-center gap-1.5 whitespace-nowrap"
              >
                <Zap size={13} className="shrink-0" />
                <span>Test Live Predictions</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Install Desktop App Button */}
            {!isInstalled && (
              <button
                onClick={openInstallModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white text-xs font-semibold transition-all shadow-sm whitespace-nowrap"
                title="Install RefineIQ as a native desktop application"
              >
                <Download size={13} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Install Desktop App</span>
              </button>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-ah-primary hover:border-ah-primary dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:text-ah-primary flex items-center justify-center transition-all"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-ah-primary hover:border-ah-primary dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:text-ah-primary flex items-center justify-center transition-all"
            >
              <Settings size={15} />
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-red-500 text-sm transition-colors px-2"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Demo Mode Interactive Banner */}
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 text-slate-800 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-blue-900/30 dark:border-ah-primary/40 dark:text-white flex flex-wrap items-center justify-between gap-4 shadow-sm dark:shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-ah-primary/20 flex items-center justify-center text-amber-500 dark:text-yellow-400 shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-slate-800 dark:text-white">Interactive Demo Environment Active</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-100 text-blue-700 border border-blue-200 dark:bg-ah-primary/20 dark:text-ah-primary dark:border-ah-primary/30 font-semibold">ZERO BACKEND REQUIRED</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Explore the full RefineIQ pipeline: clean raw data, train AutoML models, test real-time predictions, and monitor drift.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/project/demo-proj-churn/watchtower')}
              className="text-xs px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white hover:border-ah-primary font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Activity size={14} className="text-green-500 dark:text-green-400" />
              Watchtower Pulse
            </button>
            <button
              onClick={() => navigate('/project/demo-proj-churn/deploy')}
              className="text-xs px-3.5 py-2 rounded-xl bg-ah-primary text-white font-semibold hover:bg-ah-primary/80 transition-all shadow-ah-glow flex items-center gap-1.5"
            >
              <Zap size={14} />
              Test Live Predictions
            </button>
          </div>
        </div>

        {/* ── Analytics Chart Strip ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Chart 1: Model Accuracy Trend */}
          <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-2xl p-4 shadow-ah-card">
            <p className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <TrendingUp size={12} className="text-green-500 dark:text-green-400" />
              Model Accuracy Trend
            </p>
            <p className="font-headline text-2xl font-extrabold text-slate-900 dark:text-white">94.8%</p>
            <p className="text-[11px] text-green-600 dark:text-green-400 font-mono mb-3">↑ +2.1% vs last week</p>
            <svg viewBox="0 0 120 40" className="w-full h-10" preserveAspectRatio="none">
              <polyline
                points="0,38 20,32 40,34 60,28 80,20 100,15 120,10"
                fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
              <polyline
                points="0,38 20,32 40,34 60,28 80,20 100,15 120,10 120,40 0,40"
                fill="url(#greenGrad)" opacity="0.15"
              />
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Chart 2: OCU Usage (bar chart) */}
          <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-2xl p-4 shadow-ah-card">
            <p className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <BarChart2 size={12} className="text-ah-primary" />
              OCU Usage This Week
            </p>
            <p className="font-headline text-2xl font-extrabold text-slate-900 dark:text-white">14.2 OCUs</p>
            <p className="text-[11px] text-ah-primary font-mono mb-3">~$1.42 billed on compute usage</p>
            <svg viewBox="0 0 120 40" className="w-full h-10">
              {[8, 14, 6, 18, 10, 12, 14].map((h, i) => (
                <rect
                  key={i}
                  x={i * 17 + 2}
                  y={40 - h * 1.8}
                  width="12"
                  height={h * 1.8}
                  rx="2"
                  fill={i === 6 ? '#007AFF' : '#007AFF40'}
                />
              ))}
            </svg>
          </div>

          {/* Chart 3: Predictions Volume */}
          <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-2xl p-4 shadow-ah-card">
            <p className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <Activity size={12} className="text-purple-500 dark:text-purple-400" />
              Live Prediction Volume
            </p>
            <p className="font-headline text-2xl font-extrabold text-slate-900 dark:text-white">1,284</p>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-mono mb-3">Inferences served today</p>
            <svg viewBox="0 0 120 40" className="w-full h-10" preserveAspectRatio="none">
              <polyline
                points="0,35 15,30 30,32 45,20 60,25 75,12 90,18 105,8 120,14"
                fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
              <polyline
                points="0,35 15,30 30,32 45,20 60,25 75,12 90,18 105,8 120,14 120,40 0,40"
                fill="url(#purpleGrad)" opacity="0.15"
              />
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Welcome header */}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-headline text-3xl font-bold mb-1 text-slate-900 dark:text-white">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm">Your enterprise models and pipelines are ready. What are we building today?</p>
          </div>
          <button
            onClick={() => setShowNaming(true)}
            className="inline-flex items-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-ah-glow"
          >
            <Plus size={16} /> New Project
          </button>
        </div>

        {/* Blueprint Showcase */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-ah-subtle text-xs font-mono uppercase tracking-widest">Industry Blueprints</p>
              <p className="text-[11px] text-ah-muted mt-0.5">Click any blueprint to preview sample data, then launch with one click</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {TEMPLATES.map((t) => (
              <button
                key={t.id ?? 'blank'}
                onClick={() => setActiveBlueprint(activeBlueprint?.id === t.id ? null : t)}
                className={`bg-ah-surface border rounded-xl px-4 py-3.5 text-left flex items-start gap-3 transition-all group shadow-sm hover:shadow-md ${
                  activeBlueprint?.id === t.id
                    ? 'border-ah-primary bg-ah-primary/5'
                    : 'border-ah hover:border-ah-primary/60'
                }`}
              >
                <span className="text-2xl mt-0.5">{t.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm group-hover:text-ah-primary transition-colors">{t.label}</p>
                    {t.tag && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-ah-primary/15 text-ah-primary border border-ah-primary/20">{t.tag}</span>
                    )}
                  </div>
                  <p className="text-ah-subtle text-xs mt-0.5">{t.desc}</p>
                  {t.accuracy && (
                    <p className="text-[11px] text-green-400 font-mono mt-1">⚡ {t.algo} · {t.accuracy} accuracy</p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Blueprint sample data preview panel */}
          {activeBlueprint && activeBlueprint.sampleCols.length > 0 && (
            <div className="bg-ah-surface border border-ah-primary/40 rounded-2xl overflow-hidden shadow-ah-glow mb-4 animate-in fade-in duration-200">
              <div className="p-4 border-b border-ah bg-ah-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{activeBlueprint.icon}</span>
                  <div>
                    <p className="font-headline font-bold text-sm">{activeBlueprint.label} — Sample Dataset</p>
                    <p className="text-[11px] text-ah-muted">This is what a real dataset looks like for this model type</p>
                  </div>
                </div>
                <button
                  onClick={() => mutation.mutate({ name: activeBlueprint.label, template: activeBlueprint.id })}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white text-xs font-semibold transition-all shadow-ah-glow"
                >
                  <Zap size={13} /> Launch with Sample Data
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead className="bg-ah-surface2 text-ah-muted border-b border-ah">
                    <tr>
                      {activeBlueprint.sampleCols.map(col => (
                        <th key={col} className="px-4 py-2.5 text-left font-semibold uppercase tracking-wider text-[10px] whitespace-nowrap">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ah">
                    {activeBlueprint.sampleRows.map((row, i) => (
                      <tr key={i} className="hover:bg-ah-surface2/40 transition-colors">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2.5 text-ah-text whitespace-nowrap">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 bg-ah-surface2/40 border-t border-ah">
                <p className="text-[11px] text-ah-subtle font-mono">Sample shows 3 of ~1,000 rows. RefineIQ auto-loads the full dataset when you launch this blueprint.</p>
              </div>
            </div>
          )}
        </div>


        {/* Projects grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-ah-subtle text-xs font-mono uppercase tracking-widest">
              Your Projects ({deduplicateProjects(projects).length})
            </p>
            <span className="text-xs text-ah-muted font-mono">Click any card to open the active stage</span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 h-48 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {deduplicateProjects(projects).map(p => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onClick={() => handleProjectClick(p)}
                  onStageJump={handleStageJump}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* New project naming modal */}
      {showNaming && (
        <NamingModal
          onConfirm={handleCreateProject}
          onClose={() => setShowNaming(false)}
          loading={mutation.isPending}
        />
      )}
    </div>
  )
}
