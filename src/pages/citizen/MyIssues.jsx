import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageHeader, Card, EmptyState } from '../../components/UI'
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../components/Badge'
import { ThumbsUp, MessageSquare, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

function IssueCard({ issue }) {
  const [expanded, setExpanded] = useState(false)
  const { voteIssue } = useData()

  return (
    <div className="border border-gray-100 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <StatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} />
            <CategoryBadge category={issue.category} />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mt-2">{issue.title}</h3>
          <p className="text-xs text-gray-400 mt-1">{issue.createdAt}</p>
        </div>
        <button onClick={() => setExpanded(p => !p)} className="text-gray-400 hover:text-gray-600 shrink-0 mt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed">{issue.description}</p>

          {issue.responses.length > 0 && (
            <div className="bg-purple-50 rounded-xl p-3 space-y-2">
              <p className="text-xs font-semibold text-purple-700 flex items-center gap-1.5">
                <MessageSquare size={12} /> Response from representative
              </p>
              {issue.responses.map(r => (
                <div key={r.id}>
                  <p className="text-xs text-purple-600 font-medium">{r.authorName}</p>
                  <p className="text-sm text-gray-700 mt-0.5">{r.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.createdAt}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => voteIssue(issue.id)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full transition-colors"
            >
              <ThumbsUp size={12} /> {issue.votes} votes
            </button>
            <span className="text-xs text-gray-400">{issue.responses.length} response{issue.responses.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MyIssues() {
  const { user } = useAuth()
  const { issues } = useData()
  const [filter, setFilter] = useState('all')

  const myIssues = issues.filter(i => i.authorId === user.id)
  const filtered = filter === 'all' ? myIssues : myIssues.filter(i => i.status === filter)

  const tabs = [
    { key: 'all', label: `All (${myIssues.length})` },
    { key: 'open', label: `Open (${myIssues.filter(i => i.status === 'open').length})` },
    { key: 'in-progress', label: `In Progress (${myIssues.filter(i => i.status === 'in-progress').length})` },
    { key: 'resolved', label: `Resolved (${myIssues.filter(i => i.status === 'resolved').length})` },
  ]

  return (
    <div>
      <PageHeader
        title="My Issues"
        subtitle="Track the status of issues you've reported."
        action={
          <Link to="/citizen/report" className="text-sm bg-gray-900 text-white px-4 py-2.5 rounded-xl hover:bg-gray-700 transition-colors font-medium">
            + New issue
          </Link>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${filter === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-2">
          <EmptyState icon={AlertCircle} title="No issues found" description="Report an issue to get started." />
        </Card>
      ) : (
        <Card className="p-4 space-y-3">
          {filtered.map(issue => <IssueCard key={issue.id} issue={issue} />)}
        </Card>
      )}
    </div>
  )
}
