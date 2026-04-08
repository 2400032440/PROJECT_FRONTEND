const API_BASE = '/api'

function getToken() {
  return localStorage.getItem('poli_token') || ''
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 204) return null

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed')
  }

  return data
}

export const api = {
  setToken(token) {
    if (!token) {
      localStorage.removeItem('poli_token')
      window.dispatchEvent(new Event('poli-auth-changed'))
      return
    }
    localStorage.setItem('poli_token', token)
    window.dispatchEvent(new Event('poli-auth-changed'))
  },
  clearToken() {
    localStorage.removeItem('poli_token')
    window.dispatchEvent(new Event('poli-auth-changed'))
  },
  auth: {
    login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    signup: (payload) => request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
    me: () => request('/auth/me'),
    bootstrap: () => request('/bootstrap'),
  },
  users: {
    list: () => request('/users'),
    updateRole: (id, role) => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify({ role }) }),
    remove: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  },
  issues: {
    create: (issue) => request('/issues', { method: 'POST', body: JSON.stringify(issue) }),
    update: (id, changes) => request(`/issues/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
    remove: (id) => request(`/issues/${id}`, { method: 'DELETE' }),
    respond: (id, response) => request(`/issues/${id}/responses`, { method: 'POST', body: JSON.stringify({ response }) }),
    vote: (id) => request(`/issues/${id}/vote`, { method: 'POST' }),
  },
  updates: {
    create: (update) => request('/updates', { method: 'POST', body: JSON.stringify(update) }),
    like: (id) => request(`/updates/${id}/like`, { method: 'POST' }),
    comment: (id, comment) => request(`/updates/${id}/comments`, { method: 'POST', body: JSON.stringify({ comment }) }),
  },
  discussions: {
    create: (discussion) => request('/discussions', { method: 'POST', body: JSON.stringify(discussion) }),
    reply: (id, reply) => request(`/discussions/${id}/replies`, { method: 'POST', body: JSON.stringify({ reply }) }),
  },
  moderation: {
    flag: (type, id, flagged) => request('/moderation/flag', { method: 'POST', body: JSON.stringify({ type, id, flagged }) }),
  },
}
