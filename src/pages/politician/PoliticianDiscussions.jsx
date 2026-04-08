import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageHeader, Card } from '../../components/UI'
import Discussions from '../shared/Discussions'
import { CheckCircle2, PlusCircle } from 'lucide-react'

const CATEGORIES = ['Infrastructure', 'Education', 'Roads', 'Environment', 'Transport', 'Community', 'Health', 'Safety', 'Other']

export default function PoliticianDiscussions() {
  const { user } = useAuth()
  const { addDiscussion } = useData()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'Community', body: '' })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required.'
    if (!form.body.trim() || form.body.length < 10) errs.body = 'Please provide more detail.'
    if (Object.keys(errs).length) { setErrors(errs); return }

    addDiscussion({
      id: 'd' + Date.now(),
      title: form.title.trim(),
      body: form.body.trim(),
      category: form.category,
      authorId: user.id,
      authorName: user.name,
      createdAt: new Date().toISOString().slice(0, 10),
      replies: [],
      flagged: false,
    })
    setForm({ title: '', category: 'Community', body: '' })
    setSubmitted(true)
    setShowForm(false)
  }

  return (
    <div>
      <PageHeader
        title="Discussions"
        subtitle="Start and participate in civic conversations."
        action={
          <button
            onClick={() => { setShowForm(p => !p); setSubmitted(false) }}
            className="flex items-center gap-2 text-sm bg-gray-900 text-white px-4 py-2.5 rounded-xl hover:bg-gray-700 transition-colors font-medium"
          >
            <PlusCircle size={15} /> Start discussion
          </button>
        }
      />

      {submitted && !showForm && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-4">
          <CheckCircle2 size={15} className="text-green-500 shrink-0" />
          <p className="text-sm text-green-700 font-medium">Discussion started successfully.</p>
        </div>
      )}

      {showForm && (
        <Card className="p-6 mb-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">New Discussion</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                placeholder="Discussion topic"
                value={form.title}
                onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setErrors(ev => ({ ...ev, title: '' })) }}
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
              <label className="text-sm font-medium text-gray-700">Body</label>
              <textarea
                rows={4}
                placeholder="Describe the topic for community discussion…"
                value={form.body}
                onChange={e => { setForm(f => ({ ...f, body: e.target.value })); setErrors(ev => ({ ...ev, body: '' })) }}
                className={`w-full px-3 py-2.5 rounded-xl border bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:bg-white transition-colors resize-none ${errors.body ? 'border-red-300' : 'border-gray-200'}`}
              />
              {errors.body && <p className="text-xs text-red-500">{errors.body}</p>}
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors font-medium">
                Publish
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm rounded-xl hover:bg-gray-200 transition-colors font-medium">
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      <Discussions hideHeader />
    </div>
  )
}
