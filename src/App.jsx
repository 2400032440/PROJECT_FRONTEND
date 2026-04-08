import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, HeartHandshake, MessageSquareText, ShieldCheck } from 'lucide-react'

const TOKEN_KEY = 'citizen_connect_token'
const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '')
const ASSET_BASE_URL = import.meta.env.BASE_URL || '/'

function heroImagePath(fileName) {
  return `${ASSET_BASE_URL}images/${encodeURIComponent(fileName)}`
}

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function formatDate(dateValue) {
  if (!dateValue) return 'Date unavailable'
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return String(dateValue)
  return dateFormatter.format(parsed)
}

function buildApiUrl(path) {
  if (!API_BASE_URL) return path
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const normalizedBase = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`
  const mergedPath = normalizedPath.startsWith('/api/')
    ? normalizedPath.slice('/api'.length)
    : normalizedPath
  return `${normalizedBase}${mergedPath}`
}

async function apiRequest(path, { method = 'GET', token = '', body } = {}) {
  const response = await fetch(buildApiUrl(path), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  let payload = {}
  try {
    payload = await response.json()
  } catch {
    payload = {}
  }

  if (!response.ok) {
    throw new Error(payload.error || `Request failed with status ${response.status}.`)
  }

  return payload
}

function StatCard({ icon, label, value }) {
  return (
    <article className="stat-card">
      <div className="stat-icon" aria-hidden="true">
        {icon}
      </div>
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </article>
  )
}

export default function App() {
  const [mode, setMode] = useState('login')
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(null)
  const [googleEnabled, setGoogleEnabled] = useState(false)
  const [googleDevFallback, setGoogleDevFallback] = useState(false)
  const [health, setHealth] = useState('checking')
  const [healthTimestamp, setHealthTimestamp] = useState('')
  const [data, setData] = useState({ users: [], issues: [], updates: [], discussions: [] })
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen' })
  const [googleRole, setGoogleRole] = useState('citizen')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const [issueForm, setIssueForm] = useState({
    title: '',
    category: 'Infrastructure',
    description: '',
    priority: 'medium',
  })
  const [updateForm, setUpdateForm] = useState({
    title: '',
    category: 'Community',
    content: '',
  })
  const [discussionForm, setDiscussionForm] = useState({
    title: '',
    category: 'Community',
    body: '',
  })
  const [updateCommentDrafts, setUpdateCommentDrafts] = useState({})
  const [discussionReplyDrafts, setDiscussionReplyDrafts] = useState({})

  function hasAnyRole(...roles) {
    return user ? roles.includes(user.role) : false
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const callbackToken = params.get('token')
    const authError = params.get('authError')

    if (callbackToken) {
      localStorage.setItem(TOKEN_KEY, callbackToken)
      setToken(callbackToken)
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    if (authError) {
      setError(authError.replaceAll('_', ' '))
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  useEffect(() => {
    if (!successMessage) return
    const timer = setTimeout(() => setSuccessMessage(''), 2500)
    return () => clearTimeout(timer)
  }, [successMessage])

  useEffect(() => {
    let isMounted = true

    async function loadGoogleConfig() {
      try {
        const configJson = await apiRequest('/api/auth/google/config')
        if (!isMounted) return
        setGoogleEnabled(Boolean(configJson.enabled))
        setGoogleDevFallback(Boolean(configJson.devFallback))
      } catch {
        if (!isMounted) return
        setGoogleEnabled(false)
        setGoogleDevFallback(false)
      }
    }

    loadGoogleConfig()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadHealth() {
      try {
        const healthJson = await apiRequest('/api/health')
        if (!isMounted) return
        setHealth(healthJson.ok ? 'online' : 'offline')
        setHealthTimestamp(healthJson.date || '')
      } catch {
        if (!isMounted) return
        setHealth('offline')
      }
    }

    loadHealth()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadProtected() {
      try {
        if (!token) {
          if (!isMounted) return
          setUser(null)
          setData({ users: [], issues: [], updates: [], discussions: [] })
          setError('')
          return
        }

        const [meJson, bootstrapJson] = await Promise.all([
          apiRequest('/api/auth/me', { token }),
          apiRequest('/api/bootstrap', { token }),
        ])

        if (!isMounted) return
        setUser(meJson.user)
        setData({
          users: bootstrapJson.users || [],
          issues: bootstrapJson.issues || [],
          updates: bootstrapJson.updates || [],
          discussions: bootstrapJson.discussions || [],
        })
        setError('')
      } catch (err) {
        if (!isMounted) return
        localStorage.removeItem(TOKEN_KEY)
        setToken('')
        setUser(null)
        setData({ users: [], issues: [], updates: [], discussions: [] })
        setError(err instanceof Error ? err.message : 'Please log in to continue.')
      }
    }

    loadProtected()
    return () => {
      isMounted = false
    }
  }, [token])

  async function refreshBootstrapData(authToken = token) {
    const [meJson, bootstrapJson] = await Promise.all([
      apiRequest('/api/auth/me', { token: authToken }),
      apiRequest('/api/bootstrap', { token: authToken }),
    ])

    setUser(meJson.user)
    setData({
      users: bootstrapJson.users || [],
      issues: bootstrapJson.issues || [],
      updates: bootstrapJson.updates || [],
      discussions: bootstrapJson.discussions || [],
    })
  }

  async function onSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const payload =
        mode === 'login'
          ? { email: form.email, password: form.password }
          : {
              name: form.name,
              email: form.email,
              password: form.password,
              role: form.role,
            }

      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const authJson = await apiRequest(endpoint, { method: 'POST', body: payload })
      localStorage.setItem(TOKEN_KEY, authJson.token)
      setToken(authJson.token)
      setUser(authJson.user)
      setForm((prev) => ({ ...prev, password: '' }))
      setSuccessMessage('Welcome! Login successful.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function onLogout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
    setUser(null)
    setError('')
    setSuccessMessage('')
  }

  function fillDemoLogin(role) {
    const map = {
      citizen: 'citizen@demo.com',
      politician: 'politician@demo.com',
      moderator: 'moderator@demo.com',
      admin: 'admin@demo.com',
    }

    setMode('login')
    setForm((prev) => ({
      ...prev,
      email: map[role] || map.citizen,
      password: 'demo123',
    }))
    setError('')
  }

  async function createIssue(event) {
    event.preventDefault()
    if (!user) return
    setError('')

    try {
      const issue = {
        id: `i${Date.now()}`,
        title: issueForm.title.trim(),
        category: issueForm.category,
        description: issueForm.description.trim(),
        status: 'open',
        priority: issueForm.priority,
        authorId: user.id,
        authorName: user.name,
        createdAt: new Date().toISOString().slice(0, 10),
        responses: [],
        votes: 0,
        flagged: false,
      }

      await apiRequest('/api/issues', { method: 'POST', token, body: issue })
      await refreshBootstrapData()
      setIssueForm({
        title: '',
        category: 'Infrastructure',
        description: '',
        priority: 'medium',
      })
      setSuccessMessage('Issue reported successfully.')
      setActiveTab('issues')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to report issue.')
    }
  }

  async function createUpdate(event) {
    event.preventDefault()
    if (!user || !hasAnyRole('politician', 'admin')) {
      setError('Only politician or admin can publish updates.')
      return
    }
    setError('')

    try {
      const update = {
        id: `up${Date.now()}`,
        title: updateForm.title.trim(),
        content: updateForm.content.trim(),
        authorId: user.id,
        authorName: user.name,
        createdAt: new Date().toISOString().slice(0, 10),
        category: updateForm.category,
        likes: 0,
        comments: [],
      }

      await apiRequest('/api/updates', { method: 'POST', token, body: update })
      await refreshBootstrapData()
      setUpdateForm({ title: '', category: 'Community', content: '' })
      setSuccessMessage('Update published successfully.')
      setActiveTab('updates')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish update.')
    }
  }

  async function createDiscussion(event) {
    event.preventDefault()
    if (!user || !hasAnyRole('politician', 'moderator', 'admin')) {
      setError('Only politician, moderator, or admin can start discussions.')
      return
    }
    setError('')

    try {
      const discussion = {
        id: `d${Date.now()}`,
        title: discussionForm.title.trim(),
        body: discussionForm.body.trim(),
        authorId: user.id,
        authorName: user.name,
        createdAt: new Date().toISOString().slice(0, 10),
        category: discussionForm.category,
        replies: [],
        flagged: false,
      }

      await apiRequest('/api/discussions', { method: 'POST', token, body: discussion })
      await refreshBootstrapData()
      setDiscussionForm({ title: '', category: 'Community', body: '' })
      setSuccessMessage('Discussion started successfully.')
      setActiveTab('discussions')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create discussion.')
    }
  }

  async function voteIssue(issueId) {
    if (!user) return
    setError('')
    try {
      await apiRequest(`/api/issues/${issueId}/vote`, { method: 'POST', token })
      await refreshBootstrapData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote issue.')
    }
  }

  async function toggleFlag(type, itemId, currentFlagged) {
    if (!user || !hasAnyRole('moderator', 'admin')) {
      setError('Only moderator or admin can moderate content.')
      return
    }

    setError('')
    try {
      await apiRequest('/api/moderation/flag', {
        method: 'POST',
        token,
        body: { type, id: itemId, flagged: !currentFlagged },
      })
      await refreshBootstrapData()
      setSuccessMessage(`Content ${currentFlagged ? 'unflagged' : 'flagged'} successfully.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to moderate content.')
    }
  }

  async function likeUpdate(updateId) {
    if (!user) return
    setError('')
    try {
      await apiRequest(`/api/updates/${updateId}/like`, { method: 'POST', token })
      await refreshBootstrapData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like update.')
    }
  }

  async function addComment(updateId) {
    const draft = String(updateCommentDrafts[updateId] || '').trim()
    if (!draft || !user) return
    setError('')
    try {
      const comment = {
        id: `uc${Date.now()}`,
        authorId: user.id,
        authorName: user.name,
        text: draft,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      await apiRequest(`/api/updates/${updateId}/comments`, {
        method: 'POST',
        token,
        body: { comment },
      })
      setUpdateCommentDrafts((prev) => ({ ...prev, [updateId]: '' }))
      await refreshBootstrapData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment.')
    }
  }

  async function addReply(discussionId) {
    const draft = String(discussionReplyDrafts[discussionId] || '').trim()
    if (!draft || !user) return
    setError('')
    try {
      const reply = {
        id: `dr${Date.now()}`,
        authorId: user.id,
        authorName: user.name,
        text: draft,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      await apiRequest(`/api/discussions/${discussionId}/replies`, {
        method: 'POST',
        token,
        body: { reply },
      })
      setDiscussionReplyDrafts((prev) => ({ ...prev, [discussionId]: '' }))
      await refreshBootstrapData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add reply.')
    }
  }

  const stats = useMemo(
    () => [
      { label: 'Registered Users', value: data.users.length, icon: <ShieldCheck size={18} /> },
      { label: 'Open Issues', value: data.issues.length, icon: <AlertTriangle size={18} /> },
      { label: 'Policy Updates', value: data.updates.length, icon: <HeartHandshake size={18} /> },
      { label: 'Discussions', value: data.discussions.length, icon: <MessageSquareText size={18} /> },
    ],
    [data],
  )

  const googleAvailable = googleEnabled || googleDevFallback

  const canCreateIssue = hasAnyRole('citizen', 'politician', 'moderator', 'admin')
  const canCreateUpdate = hasAnyRole('politician', 'admin')
  const canCreateDiscussion = hasAnyRole('politician', 'moderator', 'admin')
  const canModerate = hasAnyRole('moderator', 'admin')

  const tabs = [
    { id: 'overview', label: 'Command Center', show: true },
    { id: 'issues', label: 'Case Queue', show: true },
    { id: 'updates', label: 'Public Updates', show: true },
    { id: 'discussions', label: 'Town Hall', show: true },
    {
      id: 'report',
      label: 'Create Record',
      show: canCreateIssue || canCreateUpdate || canCreateDiscussion,
    },
    { id: 'moderation', label: 'Review Queue', show: canModerate },
  ].filter((tab) => tab.show)

  const roleLabelMap = {
    citizen: 'Citizen Reporter',
    politician: 'Elected Official',
    moderator: 'Civic Moderator',
    admin: 'System Administrator',
  }

  const roleLabel = user ? roleLabelMap[user.role] || user.role : ''

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab('overview')
    }
  }, [activeTab, tabs])

  return (
    <div className={`page-shell ${user ? 'logged-in' : 'logged-out'}`}>
      <div className="grain" aria-hidden="true" />
      <main className="content-wrap">
        <header className="hero">
          <h1>Citizen Connect Civic Operations</h1>
          {user ? (
            <p>
              Signed in as <strong>{user.name}</strong> ({roleLabel}). Monitor service requests,
              public bulletins, and community conversations from one workspace.
            </p>
          ) : (
            <p>
              Secure civic portal for complaints, constituency updates, and moderated public
              discussions.
            </p>
          )}
          {healthTimestamp ? <p className="meta-line">Last synced: {formatDate(healthTimestamp)}</p> : null}
          <div className="hero-gallery" aria-hidden="true">
            <img
              className="hero-side-image"
              src={heroImagePath('WhatsApp Image 2026-04-08 at 1.53.39 PM.jpeg')}
              alt=""
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = heroImagePath('pspk.jpg')
              }}
            />
            <img
              className="hero-main-image"
              src={heroImagePath('pspk.jpg')}
              alt=""
            />
            <img
              className="hero-side-image"
              src={heroImagePath('WhatsApp Image 2026-04-08 at 2.32.32 PM.jpeg')}
              alt=""
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = heroImagePath('pspk.jpg')
              }}
            />
          </div>
        </header>

        {error ? <p className="error-banner">{error}</p> : null}
        {successMessage ? <p className="success-banner">{successMessage}</p> : null}

        {!user ? (
          <section className="auth-card">
            <div className="auth-toggle" role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                className={mode === 'login' ? 'active' : ''}
                onClick={() => setMode('login')}
              >
                Login
              </button>
              <button
                type="button"
                className={mode === 'signup' ? 'active' : ''}
                onClick={() => setMode('signup')}
              >
                Signup
              </button>
            </div>

            <form className="auth-form" onSubmit={onSubmit}>
              {mode === 'signup' ? (
                <label>
                  Full Name
                  <input
                    required
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Your full name"
                  />
                </label>
              ) : null}

              <label>
                Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="citizen@demo.com"
                />
              </label>

              <label>
                Password
                <input
                  required
                  minLength={6}
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder="demo123"
                />
              </label>

              {mode === 'signup' ? (
                <label>
                  Role
                  <select
                    value={form.role}
                    onChange={(event) => setForm({ ...form, role: event.target.value })}
                  >
                    <option value="citizen">Citizen</option>
                    <option value="politician">Politician</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </label>
              ) : null}

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
              </button>
            </form>

            <div className="oauth-divider">
              <span>or</span>
            </div>

            <button
              type="button"
              className="google-button"
              disabled={!googleAvailable}
              onClick={() => {
                const params = new URLSearchParams({ role: googleRole })
                window.location.href = `/api/auth/google?${params.toString()}`
              }}
            >
              Continue with Google
            </button>

            <label className="google-role-label">
              Google signup role
              <select
                value={googleRole}
                onChange={(event) => setGoogleRole(event.target.value)}
              >
                <option value="citizen">Citizen</option>
                <option value="politician">Politician</option>
                <option value="moderator">Moderator</option>
              </select>
            </label>

            {!googleAvailable ? (
              <p className="demo-note">Google login is not configured yet. Add backend OAuth env keys.</p>
            ) : null}

            {googleDevFallback ? (
              <p className="demo-note">Development mode: Google flow is simulated locally.</p>
            ) : null}

            <p className="demo-note">
              Demo logins: citizen@demo.com, politician@demo.com, moderator@demo.com,
              admin@demo.com (password for all: demo123)
            </p>

            <div className="demo-role-grid">
              <button type="button" onClick={() => fillDemoLogin('citizen')}>
                Use Citizen Demo
              </button>
              <button type="button" onClick={() => fillDemoLogin('politician')}>
                Use Politician Demo
              </button>
              <button type="button" onClick={() => fillDemoLogin('moderator')}>
                Use Moderator Demo
              </button>
              <button type="button" onClick={() => fillDemoLogin('admin')}>
                Use Admin Demo
              </button>
            </div>
          </section>
        ) : null}

        {user ? (
          <div className="toolbar">
            <div className="tab-strip" role="tablist" aria-label="Dashboard tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={activeTab === tab.id ? 'active' : ''}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : null}

        {user && (activeTab === 'overview' || activeTab === 'issues') ? (
          <>
            <section className="stats-grid">
              {stats.map((item) => (
                <StatCard key={item.label} icon={item.icon} label={item.label} value={item.value} />
              ))}
            </section>

            {(activeTab === 'overview' || activeTab === 'issues') && (
              <section className="panel-grid">
                {data.issues.map((issue) => (
                  <article className="panel card" key={issue.id}>
                    <h2>{issue.title || 'Untitled issue'}</h2>
                    <p>{issue.description}</p>
                    <p className="meta-row">
                      <span>{issue.category}</span>
                      <span>{issue.status}</span>
                      <span>{issue.priority}</span>
                      <span>Votes: {issue.votes || 0}</span>
                      <span>Filed: {formatDate(issue.createdAt)}</span>
                    </p>
                    <p className="meta-line">Reported by {issue.authorName || 'Citizen'}</p>
                    <button type="button" onClick={() => voteIssue(issue.id)}>
                      Support Case
                    </button>
                    {canModerate ? (
                      <button type="button" onClick={() => toggleFlag('issue', issue.id, issue.flagged)}>
                        {issue.flagged ? 'Mark Safe' : 'Flag for Review'}
                      </button>
                    ) : null}
                  </article>
                ))}
                {data.issues.length === 0 ? <p>No issues available.</p> : null}
              </section>
            )}
          </>
        ) : null}

        {user && activeTab === 'updates' ? (
          <section className="panel-grid">
            {data.updates.map((update) => (
              <article className="panel card" key={update.id}>
                <h2>{update.title}</h2>
                <p>{update.content}</p>
                <p className="meta-row">
                  <span>{update.category}</span>
                  <span>Likes: {update.likes || 0}</span>
                  <span>Published: {formatDate(update.createdAt)}</span>
                </p>
                <p className="meta-line">Issued by {update.authorName || 'Office'}</p>
                <div className="action-row">
                  <button type="button" onClick={() => likeUpdate(update.id)}>
                    Acknowledge
                  </button>
                  <input
                    value={updateCommentDrafts[update.id] || ''}
                    onChange={(event) =>
                      setUpdateCommentDrafts((prev) => ({ ...prev, [update.id]: event.target.value }))
                    }
                    placeholder="Write a comment"
                  />
                  <button type="button" onClick={() => addComment(update.id)}>
                    Add Note
                  </button>
                </div>
                <ul>
                  {(update.comments || []).map((comment) => (
                    <li key={comment.id || `${update.id}-${comment.text}`}>{comment.text}</li>
                  ))}
                </ul>
              </article>
            ))}
            {data.updates.length === 0 ? <p>No updates available.</p> : null}
          </section>
        ) : null}

        {user && activeTab === 'discussions' ? (
          <section className="panel-grid">
            {data.discussions.map((discussion) => (
              <article className="panel card" key={discussion.id}>
                <h2>{discussion.title}</h2>
                <p>{discussion.body}</p>
                <p className="meta-row">
                  <span>{discussion.category}</span>
                  <span>Replies: {(discussion.replies || []).length}</span>
                  <span>Opened: {formatDate(discussion.createdAt)}</span>
                </p>
                <p className="meta-line">Started by {discussion.authorName || 'Community Member'}</p>
                <div className="action-row">
                  <input
                    value={discussionReplyDrafts[discussion.id] || ''}
                    onChange={(event) =>
                      setDiscussionReplyDrafts((prev) => ({
                        ...prev,
                        [discussion.id]: event.target.value,
                      }))
                    }
                    placeholder="Write a reply"
                  />
                  <button type="button" onClick={() => addReply(discussion.id)}>
                    Post Reply
                  </button>
                  {canModerate ? (
                    <button
                      type="button"
                      onClick={() => toggleFlag('discussion', discussion.id, discussion.flagged)}
                    >
                      {discussion.flagged ? 'Mark Safe' : 'Flag'}
                    </button>
                  ) : null}
                </div>
                <ul>
                  {(discussion.replies || []).map((reply) => (
                    <li key={reply.id || `${discussion.id}-${reply.text}`}>{reply.text}</li>
                  ))}
                </ul>
              </article>
            ))}
            {data.discussions.length === 0 ? <p>No discussions available.</p> : null}
          </section>
        ) : null}

        {user && activeTab === 'report' ? (
          <section className="panel-grid">
            {canCreateIssue ? (
              <article className="panel">
                <h2>Register Service Issue</h2>
                <form className="auth-form" onSubmit={createIssue}>
                  <label>
                    Title
                    <input
                      required
                      value={issueForm.title}
                      onChange={(event) => setIssueForm({ ...issueForm, title: event.target.value })}
                    />
                  </label>
                  <label>
                    Category
                    <select
                      value={issueForm.category}
                      onChange={(event) => setIssueForm({ ...issueForm, category: event.target.value })}
                    >
                      <option>Infrastructure</option>
                      <option>Education</option>
                      <option>Environment</option>
                      <option>Transport</option>
                      <option>Community</option>
                    </select>
                  </label>
                  <label>
                    Priority
                    <select
                      value={issueForm.priority}
                      onChange={(event) => setIssueForm({ ...issueForm, priority: event.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </label>
                  <label>
                    Description
                    <textarea
                      required
                      rows={4}
                      value={issueForm.description}
                      onChange={(event) =>
                        setIssueForm({ ...issueForm, description: event.target.value })
                      }
                    />
                  </label>
                  <button type="submit">Register Case</button>
                </form>
              </article>
            ) : null}

            {canCreateUpdate ? (
              <article className="panel">
                <h2>Publish Public Bulletin</h2>
                <form className="auth-form" onSubmit={createUpdate}>
                  <label>
                    Title
                    <input
                      required
                      value={updateForm.title}
                      onChange={(event) =>
                        setUpdateForm({ ...updateForm, title: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Category
                    <select
                      value={updateForm.category}
                      onChange={(event) =>
                        setUpdateForm({ ...updateForm, category: event.target.value })
                      }
                    >
                      <option>Community</option>
                      <option>Infrastructure</option>
                      <option>Environment</option>
                      <option>Education</option>
                    </select>
                  </label>
                  <label>
                    Content
                    <textarea
                      required
                      rows={4}
                      value={updateForm.content}
                      onChange={(event) =>
                        setUpdateForm({ ...updateForm, content: event.target.value })
                      }
                    />
                  </label>
                  <button type="submit">Publish Bulletin</button>
                </form>
              </article>
            ) : null}

            {canCreateDiscussion ? (
              <article className="panel">
                <h2>Open Community Discussion</h2>
                <form className="auth-form" onSubmit={createDiscussion}>
                  <label>
                    Title
                    <input
                      required
                      value={discussionForm.title}
                      onChange={(event) =>
                        setDiscussionForm({ ...discussionForm, title: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Category
                    <select
                      value={discussionForm.category}
                      onChange={(event) =>
                        setDiscussionForm({ ...discussionForm, category: event.target.value })
                      }
                    >
                      <option>Community</option>
                      <option>Transport</option>
                      <option>Environment</option>
                      <option>Education</option>
                    </select>
                  </label>
                  <label>
                    Description
                    <textarea
                      required
                      rows={4}
                      value={discussionForm.body}
                      onChange={(event) =>
                        setDiscussionForm({ ...discussionForm, body: event.target.value })
                      }
                    />
                  </label>
                  <button type="submit">Open Discussion</button>
                </form>
              </article>
            ) : null}

            {!canCreateIssue && !canCreateUpdate && !canCreateDiscussion ? (
              <article className="panel">
                <h2>No Create Permissions</h2>
                <p>Your current role does not have content creation permissions.</p>
              </article>
            ) : null}
          </section>
        ) : null}

        {user && activeTab === 'moderation' ? (
          <section className="panel-grid">
            <article className="panel">
              <h2>Flagged Service Cases</h2>
              <ul>
                {data.issues.filter((item) => item.flagged).map((issue) => (
                  <li key={issue.id}>
                    {issue.title}
                    <button type="button" onClick={() => toggleFlag('issue', issue.id, issue.flagged)}>
                      Clear Flag
                    </button>
                  </li>
                ))}
                {data.issues.every((item) => !item.flagged) ? <li>No flagged issues.</li> : null}
              </ul>
            </article>

            <article className="panel">
              <h2>Flagged Community Threads</h2>
              <ul>
                {data.discussions.filter((item) => item.flagged).map((discussion) => (
                  <li key={discussion.id}>
                    {discussion.title}
                    <button
                      type="button"
                      onClick={() => toggleFlag('discussion', discussion.id, discussion.flagged)}
                    >
                      Clear Flag
                    </button>
                  </li>
                ))}
                {data.discussions.every((item) => !item.flagged) ? <li>No flagged discussions.</li> : null}
              </ul>
            </article>
          </section>
        ) : null}
      </main>
    </div>
  )
}
