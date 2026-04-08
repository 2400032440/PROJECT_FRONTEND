import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { PageHeader, Card, EmptyState } from '../../components/UI'
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../components/Badge'
import { AlertCircle, ChevronDown, ChevronUp, Flag } from 'lucide-react'

function IssueRow({ issue }) {
  const { flagItem, unflagItem } = useData()
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-gray-100 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <StatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} />
            <CategoryBadge category={issue.category} />
            {issue.flagged && <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">Flagged</span>}
          </div>
          <h3 className="text-sm font-semibold text-gray-900">{issue.title}</h3>
          <p className="text-xs text-gray-400 mt-1">
            {issue.authorName} · {issue.createdAt} · {issue.votes} votes · {issue.responses.length} responses
          </p>
        </div>
        <button onClick={() => setExpanded(p => !p)} className="text-gray-400 hover:text-gray-600 shrink-0">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed">{issue.description}</p>
          <div className="flex gap-2 pt-1">
            {!issue.flagged ? (
              <button
                onClick={() => flagItem('issue', issue.id)}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 bg-gray-50 px-3 py-1.5 rounded-full transition-colors"
              >
                <Flag size={12} /> Flag this issue
              </button>
            ) : (
              <button
                onClick={() => unflagItem('issue', issue.id)}
                className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full transition-colors"
              >
                Unflag
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AllIssues() {
  const { issues } = useData()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  let filtered = filter === 'all' ? [...issues] : issues.filter(i => i.status === filter)
  if (search.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter(i => i.title.toLowerCase().includes(q) || i.authorName.toLowerCase().includes(q))
  }

  return (
    <div>
      <PageHeader title="All Issues" subtitle="Complete view of all reported issues on the platform." />

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <input
          type="text"
          placeholder="Search issues…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 transition-colors"
        />
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {['all', 'open', 'in-progress', 'resolved'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors capitalize ${filter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {s.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-2">
          <EmptyState icon={AlertCircle} title="No issues found" />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(issue => <IssueRow key={issue.id} issue={issue} />)}
        </div>
      )}
    </div>
  )
}
