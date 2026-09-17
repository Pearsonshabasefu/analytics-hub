import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, Folder, Clock, ChevronRight, Zap, BarChart2, TrendingUp,
  LogOut, Settings, Moon, Sun, Sparkles, Activity, ShieldCheck, Play, Database
} from 'lucide-react'
import apiClient from '../lib/apiClient'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
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

// Fetch projects with robust fallback
const fetchProjects = async () => {
  try {
    const res = await apiClient.get('/api/projects/')
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data
    }
  } catch (err) {
    // Backend offline / demo mode fallback
  }

  const saved = localStorage.getItem('refineiq_user_projects')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
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
    const updated = [newProj, ...(current.length ? current : DEFAULT_DEMO_PROJECTS)]
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
  { id: 'churn_prediction',  icon: '🔮', label: 'Churn Prediction',   desc: 'Predict which customers will leave' },
  { id: 'sales_forecasting', icon: '📈', label: 'Sales Forecasting',   desc: 'Forecast revenue & demand trends' },
  { id: null,                icon: '⚡', label: 'Blank Project',        desc: 'Start from scratch with your data' },
]

function ProjectCard({ project, onClick, onStageJump }) {
  const badge = STATUS_BADGE[project.status] || STATUS_BADGE.created
  const date = new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div className="group bg-ah-surface border border-ah hover:border-ah-primary/70 rounded-2xl p-5 text-left transition-all shadow-ah-card hover:shadow-ah-glow flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 bg-ah-primary-glow rounded-xl flex items-center justify-center">
            <BarChart2 size={18} className="text-ah-primary" />
          </div>
          <span className={`text-xs font-mono px-2 py-1 rounded-md ${badge.class}`}>{badge.label}</span>
        </div>

        <button onClick={onClick} className="text-left w-full">
          <h3 className="font-headline font-bold text-base mb-1 group-hover:text-ah-primary transition-colors">
            {project.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            {project.algo && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-ah-surface2 border border-ah text-ah-primary">
                {project.algo}
              </span>
            )}
            {project.accuracy && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-green-500/10 text-green-400">
                {project.accuracy}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Quick Stage Jump Links */}
      <div className="pt-3 border-t border-ah/60 mt-3">
        <p className="text-[10px] uppercase font-mono text-ah-subtle mb-2">Jump to pipeline stage:</p>
        <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono">
          <button
            onClick={() => onStageJump(project, 'ingest')}
            className="px-2 py-1 rounded bg-ah-surface2 hover:bg-ah-primary hover:text-white border border-ah transition-colors"
            title="Data Ingestion"
          >
            01 Ingest
          </button>
          <button
            onClick={() => onStageJump(project, 'refinery')}
            className="px-2 py-1 rounded bg-ah-surface2 hover:bg-ah-primary hover:text-white border border-ah transition-colors"
            title="Data Refinery (Cleaning & PII)"
          >
            02 Refinery
          </button>
          <button
            onClick={() => onStageJump(project, 'studio')}
            className="px-2 py-1 rounded bg-ah-surface2 hover:bg-ah-primary hover:text-white border border-ah transition-colors"
            title="AutoML Model Studio"
          >
            03 Studio
          </button>
          <button
            onClick={() => onStageJump(project, 'deploy')}
            className="px-2 py-1 rounded bg-ah-surface2 hover:bg-ah-primary hover:text-white border border-ah transition-colors"
            title="Live API & Playground"
          >
            04 Deploy
          </button>
          <button
            onClick={() => onStageJump(project, 'watchtower')}
            className="px-2 py-1 rounded bg-ah-surface2 hover:bg-ah-primary hover:text-white border border-ah transition-colors"
            title="Live Watchtower Monitoring"
          >
            05 Watchtower
          </button>
        </div>

        <div className="flex items-center gap-1 text-ah-subtle text-xs mt-3 pt-2 border-t border-ah/40">
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
  const [showNaming, setShowNaming] = useState(false)

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
      <header className="sticky top-0 z-40 glass border-b border-ah">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="default" />
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg bg-ah-surface border border-ah hover:border-ah-primary flex items-center justify-center transition-all text-ah-muted hover:text-ah-primary"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="w-9 h-9 rounded-lg bg-ah-surface border border-ah hover:border-ah-primary flex items-center justify-center transition-all text-ah-muted hover:text-ah-primary"
            >
              <Settings size={15} />
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-ah-muted hover:text-ah-error text-sm transition-colors px-2"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Demo Mode Interactive Banner */}
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-blue-900/30 border border-ah-primary/40 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ah-primary/20 flex items-center justify-center text-yellow-400">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-ah-text">Interactive Demo Environment Active</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-ah-primary/20 text-ah-primary border border-ah-primary/30">ZERO BACKEND REQUIRED</span>
              </div>
              <p className="text-xs text-ah-muted mt-0.5">Explore the full RefineIQ pipeline: clean raw data, train AutoML models, test real-time predictions, and monitor drift.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/project/demo-proj-churn/watchtower')}
              className="text-xs px-3.5 py-2 rounded-xl bg-ah-surface border border-ah hover:border-ah-primary text-ah-text font-semibold transition-all flex items-center gap-1.5"
            >
              <Activity size={14} className="text-green-400" />
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

        {/* Welcome header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-headline text-3xl font-bold mb-1">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! 👋
            </h1>
            <p className="text-ah-muted text-sm">Your enterprise models and pipelines are ready. What are we building today?</p>
          </div>
          <button
            onClick={() => setShowNaming(true)}
            className="inline-flex items-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-ah-glow"
          >
            <Plus size={16} /> New Project
          </button>
        </div>

        {/* Quick-start templates row */}
        <div className="mb-10">
          <p className="text-ah-subtle text-xs font-mono uppercase tracking-widest mb-4">Quick-Start Templates</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEMPLATES.map((t) => (
              <button
                key={t.id ?? 'blank'}
                onClick={() => {
                  mutation.mutate({
                    name: t.label,
                    template: t.id,
                  })
                }}
                className="bg-ah-surface border border-ah hover:border-ah-primary rounded-xl px-4 py-3.5 text-left flex items-center gap-3 transition-all group shadow-sm hover:shadow-md"
              >
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <p className="font-semibold text-sm group-hover:text-ah-primary transition-colors">{t.label}</p>
                  <p className="text-ah-subtle text-xs">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Projects grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-ah-subtle text-xs font-mono uppercase tracking-widest">
              Your Projects ({projects.length})
            </p>
            <span className="text-xs text-ah-muted font-mono">Click any card to open the active stage</span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-ah-surface border border-ah rounded-2xl p-5 h-48 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map(p => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onClick={() => handleProjectClick(p)}
                  onStageJump={handleStageJump}
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
