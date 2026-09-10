import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Folder, Clock, ChevronRight, Zap, BarChart2, TrendingUp, LogOut, Settings, Moon, Sun } from 'lucide-react'
import apiClient from '../lib/apiClient'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import NamingModal from '../components/features/launcher/NamingModal'

// Fetch projects from backend
const fetchProjects = () => apiClient.get('/api/projects/').then(r => r.data)
const createProject = (data) => apiClient.post('/api/projects/', data).then(r => r.data)

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

function EmptyState({ onNew }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-ah-primary-glow border border-[rgba(0,122,255,0.2)] rounded-2xl flex items-center justify-center mb-6">
        <Folder size={32} className="text-ah-primary" />
      </div>
      <h2 className="font-headline text-2xl font-bold mb-2">No projects yet</h2>
      <p className="text-ah-muted text-sm mb-8 max-w-xs">
        Create your first project to start turning raw data into deployed ML models.
      </p>
      <button
        onClick={onNew}
        className="inline-flex items-center gap-2 bg-ah-primary hover:bg-[var(--color-primary-dim)] text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-ah-glow"
      >
        <Plus size={18} /> New Project
      </button>
    </div>
  )
}

function ProjectCard({ project, onClick }) {
  const badge = STATUS_BADGE[project.status] || STATUS_BADGE.created
  const date = new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <button
      onClick={onClick}
      className="group bg-ah-surface border border-ah hover:border-ah-primary rounded-2xl p-5 text-left transition-all shadow-ah-card hover:shadow-ah-glow w-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-ah-primary-glow rounded-xl flex items-center justify-center">
          <BarChart2 size={18} className="text-ah-primary" />
        </div>
        <span className={`text-xs font-mono px-2 py-1 rounded-md ${badge.class}`}>{badge.label}</span>
      </div>

      <h3 className="font-headline font-bold text-base mb-1 group-hover:text-ah-primary transition-colors">
        {project.name}
      </h3>
      {project.template && (
        <p className="text-ah-subtle text-xs mb-3 font-mono">
          {project.template.replace('_', ' ')}
        </p>
      )}
      <div className="flex items-center gap-1 text-ah-subtle text-xs">
        <Clock size={11} />
        <span>{date}</span>
        <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 text-ah-primary transition-opacity" />
      </div>
    </button>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
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

  const handleCreateProject = ({ name, template }) => {
    mutation.mutate({ name, template })
    setShowNaming(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-ah-bg">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass border-b border-ah">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Analytics Hub" className="w-7 h-7" />
            <span className="font-headline font-bold text-ah-text">Analytics Hub</span>
          </div>
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

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-headline text-3xl font-bold mb-1">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! 👋
            </h1>
            <p className="text-ah-muted text-sm">Your projects are ready. What are we building today?</p>
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
          <div className="grid grid-cols-3 gap-4">
            {TEMPLATES.map((t) => (
              <button
                key={t.id ?? 'blank'}
                onClick={() => setShowNaming(true)}
                className="bg-ah-surface border border-ah hover:border-ah-primary rounded-xl px-4 py-3 text-left flex items-center gap-3 transition-all group"
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
          <p className="text-ah-subtle text-xs font-mono uppercase tracking-widest mb-4">
            Your Projects ({projects.length})
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-ah-surface border border-ah rounded-2xl p-5 h-36 animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <EmptyState onNew={() => setShowNaming(true)} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(p => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onClick={() => handleProjectClick(p)}
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
