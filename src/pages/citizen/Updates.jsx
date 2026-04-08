import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { PageHeader, Card, EmptyState } from '../../components/UI'
import { CategoryBadge } from '../../components/Badge'
import { Heart, MessageCircle, ChevronDown, ChevronUp, Megaphone } from 'lucide-react'

function UpdateCard({ update }) {
  const { likeUpdate, commentOnUpdate } = useData()
  const { user } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const [comment, setComment] = useState('')

  function submitComment(e) {
    e.preventDefault()
    if (!comment.trim()) return
    commentOnUpdate(update.id, {
      id: 'c' + Date.now(),
      authorId: user.id,
      authorName: user.name,
      text: comment.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    })
    setComment('')
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CategoryBadge category={update.category} />
            <span className="text-xs text-gray-400">{update.createdAt}</span>
          </div>
          <h3 className="text-base font-semibold text-gray-900">{update.title}</h3>
          <p className="text-xs text-gray-500 mt-1">Posted by <span className="font-medium">{update.authorName}</span></p>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{update.content}</p>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
        <button
          onClick={() => likeUpdate(update.id)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors"
        >
          <Heart size={14} /> {update.likes}
        </button>
        <button
          onClick={() => setExpanded(p => !p)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <MessageCircle size={14} /> {update.comments.length} comments
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 space-y-3">
          {update.comments.map(c => (
            <div key={c.id} className="bg-gray-50 rounded-xl px-3 py-2.5">
              <p className="text-xs font-semibold text-gray-700">{c.authorName} <span className="text-gray-400 font-normal">· {c.createdAt}</span></p>
              <p className="text-sm text-gray-600 mt-0.5">{c.text}</p>
            </div>
          ))}
          <form onSubmit={submitComment} className="flex gap-2">
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:bg-white transition-colors"
            />
            <button type="submit" disabled={!comment.trim()} className="px-4 py-2 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 disabled:opacity-40 transition-colors">
              Post
            </button>
          </form>
        </div>
      )}
    </Card>
  )
}

export default function Updates() {
  const { updates } = useData()

  return (
    <div>
      <PageHeader title="Updates" subtitle="Stay informed with the latest from your representatives." />

      {updates.length === 0 ? (
        <EmptyState icon={Megaphone} title="No updates yet" description="Check back later for news from your representatives." />
      ) : (
        <div className="space-y-4">
          {updates.map(update => <UpdateCard key={update.id} update={update} />)}
        </div>
      )}
    </div>
  )
}
