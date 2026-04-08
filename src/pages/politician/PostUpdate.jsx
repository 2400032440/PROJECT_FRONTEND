import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageHeader, Card } from '../../components/UI'
import { CategoryBadge } from '../../components/Badge'
import { CheckCircle2 } from 'lucide-react'

const CATEGORIES = ['Infrastructure', 'Education', 'Roads', 'Environment', 'Transport', 'Community', 'Health', 'Safety', 'Other']

export default function PostUpdate() {
  const { user } = useAuth()
  const { addUpdate, updates } = useData()
  const myUpdates = updates.filter(u => u.authorId === user.id)

  const [form, setForm] = useState({ title: '', category: 'Community', content: '' })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required.'
    if (!form.content.trim() || form.content.length < 20) e.content = 'Content must be at least 20 characters.'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    addUpdate({
      id: 'up' + Date.now(),
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category,
      authorId: user.id,
      authorName: user.name,
      createdAt: new Date().toISOString().slice(0, 10),
      likes: 0,
      comments: [],
    })
    setSubmitted(true)
    setForm({ title: '', category: 'Community', content: '' })
  }

  return (
    <div>
      <PageHeader title="Post Update" subtitle="Share news and announcements with your constituents." />

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-6">
          {submitted && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 mb-4">
              <CheckCircle2 size={15} className="text-green-500" />
              <p className="text-xs text-green-700 font-medium">Update published successfully.</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                placeholder="e.g. New road repairs scheduled for Spring"
                value={form.title}
                onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setErrors(ev => ({ ...ev, title: '' })); setSubmitted(false) }}
                className={`w-full px-3 py-2.5 rounded-xl border bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:bg-white transition-colors ${errors.title ? 'border-red-300' : 'border-gray-200'}`}
              />
              {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:border-gray-400 focus:bg-white transition-colors"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Content</label>
              <textarea
                rows={6}
                placeholder="Write your update for constituents…"
                value={form.content}
                onChange={e => { setForm(f => ({ ...f, content: e.target.value })); setErrors(ev => ({ ...ev, content: '' })); setSubmitted(false) }}
                className={`w-full px-3 py-2.5 rounded-xl border bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:bg-white transition-colors resize-none ${errors.content ? 'border-red-300' : 'border-gray-200'}`}
              />
              {errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
              <p className="text-xs text-gray-400 text-right">{form.content.length} chars</p>
            </div>

            <button type="submit" className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">
              Publish update
            </button>
          </form>
        </Card>

        {/* My updates list */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Your published updates ({myUpdates.length})</h2>
          <div className="space-y-3">
            {myUpdates.length === 0 ? (
              <p className="text-sm text-gray-400">No updates published yet.</p>
            ) : myUpdates.map(u => (
              <div key={u.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <CategoryBadge category={u.category} />
                  <span className="text-xs text-gray-400">{u.createdAt}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{u.title}</p>
                <p className="text-xs text-gray-400 mt-1">{u.likes} likes · {u.comments.length} comments</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
