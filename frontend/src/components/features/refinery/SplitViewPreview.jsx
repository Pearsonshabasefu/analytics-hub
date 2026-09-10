import { useState } from 'react'
import { Eye, CheckCircle2, Sparkles, Filter } from 'lucide-react'

export default function SplitViewPreview({ originalRows = [], cleanedRows = [], columns = [] }) {
  const [viewMode, setViewMode] = useState('after') // 'before' | 'after' | 'diff'

  const displayRows = viewMode === 'before' ? originalRows : cleanedRows

  return (
    <div className="bg-ah-surface border border-ah rounded-2xl overflow-hidden shadow-ah-card">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-ah flex flex-wrap items-center justify-between gap-4 bg-ah-surface2/50">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-ah-primary" />
          <h3 className="font-headline font-bold text-sm text-ah-text">Dataset Inspection</h3>
          <span className="text-xs text-ah-subtle font-mono">({displayRows.length} rows previewed)</span>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-ah-surface3 p-1 rounded-xl border border-ah">
          <button
            onClick={() => setViewMode('before')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'before' ? 'bg-ah-surface text-ah-text shadow-sm' : 'text-ah-muted hover:text-ah-text'
            }`}
          >
            Raw Data
          </button>
          <button
            onClick={() => setViewMode('after')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'after'
                ? 'bg-ah-primary text-white shadow-sm shadow-ah-primary/30'
                : 'text-ah-muted hover:text-ah-text'
            }`}
          >
            Refined (Cleaned) ✨
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-xs font-mono text-left">
          <thead className="sticky top-0 bg-ah-surface2 text-ah-muted border-b border-ah z-10">
            <tr>
              <th className="px-4 py-3 w-12 text-center text-ah-subtle">#</th>
              {columns.map((col) => (
                <th key={col.name || col} className="px-4 py-3 whitespace-nowrap font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span>{col.name || col}</span>
                    {col.type && (
                      <span className="text-[10px] px-1 rounded bg-ah-surface3 text-ah-subtle font-normal">
                        {col.type}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ah">
            {displayRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-8 text-ah-muted">
                  No preview rows available.
                </td>
              </tr>
            ) : (
              displayRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-ah-surface2/50 transition-colors">
                  <td className="px-4 py-2.5 text-center text-ah-subtle bg-ah-surface2/30">{idx + 1}</td>
                  {columns.map((col) => {
                    const colName = col.name || col
                    const val = row[colName]
                    const isNull = val === null || val === undefined || val === ''
                    const isMasked = typeof val === 'string' && (val.includes('***') || val.includes('[MASKED'))

                    return (
                      <td key={colName} className="px-4 py-2.5 whitespace-nowrap max-w-[200px] truncate text-ah-muted">
                        {isNull ? (
                          <span className="text-ah-error/80 bg-red-500/10 px-1.5 py-0.5 rounded text-[11px]">
                            null
                          </span>
                        ) : isMasked ? (
                          <span className="text-purple-300 bg-purple-500/15 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                            {val}
                          </span>
                        ) : (
                          String(val)
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
