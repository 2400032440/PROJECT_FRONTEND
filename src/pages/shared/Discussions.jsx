import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { PageHeader, Card, EmptyState } from '../../components/UI'
import { CategoryBadge } from '../../components/Badge'
import { MessagesSquare, ChevronDown, ChevronUp, Flag } from 'lucide-react'

function DiscussionCard({ discussion }) {
  const { replyToDiscussion, flagItem } = useData()
  const { user } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const [reply, setReply] = useState('')

  function submitReply(e) {
    e.preventDefault()
    if (!reply.trim()) return
    replyToDiscussion(discussion.id, {
      id: 'dr' + Date.now(),
      authorId: user.id,
      authorName: user.name,
      text: reply.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    })
    setReply('')
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <CategoryBadge category={discussion.category} />
            {discussion.flagged && (
              <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">Flagged</span>
            )}
          </div>
          <h3 className="text-base font-semibold text-gray-900">{discussion.title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            <span className="font-medium">{discussion.authorName}</span> · {discussion.createdAt}
          </p>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{discussion.body}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
        <button
          onClick={() => setExpanded(p => !p)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <MessagesSquare size={14} /> {discussion.replies.length} replies
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        {!discussion.flagged && (
          <button
            onClick={() => flagItem('discussion', discussion.id)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors ml-auto"
          >
            <Flag size={12} /> Flag
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-3 space-y-3">
          {discussion.replies.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-3">No replies yet. Be the first!</p>
          )}
          {discussion.replies.map(r => (
            <div key={r.id} className="bg-gray-50 rounded-xl px-3 py-2.5">
              <p className="text-xs font-semibold text-gray-700">{r.authorName} <span className="text-gray-400 font-normal">· {r.createdAt}</span></p>
              <p className="text-sm text-gray-600 mt-0.5">{r.text}</p>
            </div>
          ))}
          <form onSubmit={submitReply} className="flex gap-2">
            <input
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Join the discussion…"
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-gray-400 focus:bg-white transition-colors"
            />
            <button type="submit" disabled={!reply.trim()} className="px-4 py-2 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 disabled:opacity-40 transition-colors">
              Reply
            </button>
          </form>
        </div>
      )}
    </Card>
  )
}

export default function Discussions({ hideHeader = false }) {
  const { discussions } = useData()

  return (
    <div>
      {!hideHeader && (
        <PageHeader title="Discussions" subtitle="Join civic conversations and share your perspective." />
      )}
      {discussions.length === 0 ? (
        <EmptyState icon={MessagesSquare} title="No discussions yet" description="Discussions started by politicians will appear here." />
      ) : (
        <div className="space-y-4">
          {discussions.map(d => <DiscussionCard key={d.id} discussion={d} />)}
        </div>
      )}
    </div>
  )
}
