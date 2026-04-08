import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageHeader, Card, EmptyState } from '../../components/UI'
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../components/Badge'
import { ThumbsUp, ChevronDown, ChevronUp, MessageSquare, Send } from 'lucide-react'

function IssueItem({ issue }) {
  const { user } = useAuth()
  const { respondToIssue, updateIssue } = useData()
  const [expanded, setExpanded] = useState(false)
  const [response, setResponse] = useState('')
  const [newStatus, setNewStatus] = useState(issue.status)

  function submitResponse(e) {
    e.preventDefault()
    if (!response.trim()) return
    respondToIssue(issue.id, {
      id: 'r' + Date.now(),
      authorId: user.id,
      authorName: user.name,
      text: response.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    })
    setResponse('')
  }

  function changeStatus(s) {
    setNewStatus(s)
    updateIssue(issue.id, { status: s })
  }

  return (
    <div className={`border rounded-xl p-4 transition-colors ${issue.priority === 'high' ? 'border-red-100 bg-red-50/20' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <StatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} />
            <CategoryBadge category={issue.category} />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">{issue.title}</h3>
          <p className="text-xs text-gray-400 mt-1">
            {issue.authorName} · {issue.createdAt} · <span className="font-medium">{issue.votes} vote{issue.votes !== 1 ? 's' : ''}</span>
          </p>
        </div>
        <button onClick={() => setExpanded(p => !p)} className="text-gray-400 hover:text-gray-600 shrink-0">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">{issue.description}</p>

          {/* Change status */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-medium">Update status:</span>
            {['open', 'in-progress', 'resolved', 'closed'].map(s => (
              <button
                key={s}
                onClick={() => changeStatus(s)}
                className={`text-xs px-2.5 py-1 rounded-full capitalize transition-colors font-medium ${
                  newStatus === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {s.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Existing responses */}
          {issue.responses.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">Your responses</p>
              {issue.responses.map(r => (
                <div key={r.id} className="bg-purple-50 rounded-xl px-3 py-2.5">
                  <p className="text-xs font-medium text-purple-700">{r.authorName} · {r.createdAt}</p>
                  <p className="text-sm text-gray-700 mt-0.5">{r.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add response */}
          <form onSubmit={submitResponse} className="space-y-2">
            <textarea
              value={response}
              onChange={e => setResponse(e.target.value)}
              placeholder="Write a response to this constituent concern…"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:bg-white transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={!response.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 disabled:opacity-40 transition-colors font-medium"
            >
              <Send size={13} /> Send response
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default function IssueInbox() {
  const { issues } = useData()
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('votes')

  let filtered = filter === 'all' ? [...issues] : issues.filter(i => i.status === filter)
  if (sort === 'votes') filtered.sort((a, b) => b.votes - a.votes)
  if (sort === 'date') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  if (sort === 'priority') {
    const order = { high: 0, medium: 1, low: 2 }
    filtered.sort((a, b) => order[a.priority] - order[b.priority])
  }

  const tabs = [
    { key: 'all', label: `All (${issues.length})` },
    { key: 'open', label: `Open (${issues.filter(i => i.status === 'open').length})` },
    { key: 'in-progress', label: `In Progress (${issues.filter(i => i.status === 'in-progress').length})` },
    { key: 'resolved', label: `Resolved (${issues.filter(i => i.status === 'resolved').length})` },
  ]

  return (
    <div>
      <PageHeader title="Issue Inbox" subtitle="Constituent concerns that require your attention." />

      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
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
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="text-xs border border-gray-200 bg-white rounded-xl px-3 py-2 text-gray-600 focus:outline-none"
        >
          <option value="votes">Sort: Most voted</option>
          <option value="date">Sort: Newest</option>
          <option value="priority">Sort: Priority</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-2">
          <EmptyState icon={MessageSquare} title="No issues found" />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(issue => <IssueItem key={issue.id} issue={issue} />)}
        </div>
      )}
    </div>
  )
}
