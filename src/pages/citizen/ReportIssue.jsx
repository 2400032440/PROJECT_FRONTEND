import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageHeader, Card } from '../../components/UI'
import { CheckCircle2 } from 'lucide-react'

const CATEGORIES = ['Infrastructure', 'Education', 'Roads', 'Environment', 'Transport', 'Community', 'Health', 'Safety', 'Other']

export default function ReportIssue() {
  const { user } = useAuth()
  const { addIssue } = useData()
  const navigate = useNavigate()

  const [form, setForm] = useState({ title: '', category: 'Infrastructure', priority: 'medium', description: '' })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required.'
    if (form.title.trim().length < 5) e.title = 'Title must be at least 5 characters.'
    if (!form.description.trim()) e.description = 'Description is required.'
    if (form.description.trim().length < 20) e.description = 'Please provide more detail (min. 20 characters).'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const issue = {
      id: 'i' + Date.now(),
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      status: 'open',
      priority: form.priority,
      authorId: user.id,
      authorName: user.name,
      createdAt: new Date().toISOString().slice(0, 10),
      responses: [],
      votes: 0,
      flagged: false,
    }
    addIssue(issue)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
          <CheckCircle2 size={28} className="text-green-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Issue submitted</h2>
        <p className="text-sm text-gray-500 mb-6 max-w-xs">Your issue has been reported and is now visible to your representatives.</p>
        <div className="flex gap-3">
          <button
            onClick={() => { setForm({ title: '', category: 'Infrastructure', priority: 'medium', description: '' }); setSubmitted(false) }}
            className="text-sm px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
          >
            Report another
          </button>
          <button
            onClick={() => navigate('/citizen/issues')}
            className="text-sm px-4 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors font-medium"
          >
            View my issues
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <PageHeader title="Report an Issue" subtitle="Let your representatives know about a problem in your community." />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Issue title</label>
            <input
              type="text"
              placeholder="e.g. Broken streetlight on Oak Street"
              value={form.title}
              onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setErrors(ev => ({ ...ev, title: '' })) }}
              className={`w-full px-3 py-2.5 rounded-xl border bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:bg-white transition-colors ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
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
              <label className="text-sm font-medium text-gray-700">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:border-gray-400 focus:bg-white transition-colors"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={5}
              placeholder="Describe the issue in detail. Include location, how long it has been occurring, and its impact."
              value={form.description}
              onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setErrors(ev => ({ ...ev, description: '' })) }}
              className={`w-full px-3 py-2.5 rounded-xl border bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:bg-white transition-colors resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            <p className="text-xs text-gray-400 text-right">{form.description.length} chars</p>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Submit issue
          </button>
        </form>
      </Card>
    </div>
  )
}
