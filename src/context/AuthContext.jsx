import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('poli_user')) } catch { return null }
  })
  const [users, setUsers] = useState([])

  useEffect(() => {
    localStorage.setItem('poli_user', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    let ignore = false
    async function hydrateFromApi() {
      if (!localStorage.getItem('poli_token')) return
      try {
        const data = await api.auth.bootstrap()
        if (ignore) return
        setUsers(data.users || [])

        const meData = await api.auth.me()
        if (ignore) return
        setUser(meData.user || null)
      } catch {
        api.clearToken()
        if (!ignore) {
          setUser(null)
          setUsers([])
        }
      }
    }

    hydrateFromApi()
    return () => { ignore = true }
  }, [])

  async function login(email, password) {
    try {
      const data = await api.auth.login({ email, password })
      api.setToken(data.token)
      setUser(data.user)

      const usersData = await api.users.list()
      setUsers(usersData.users || [])

      return { success: true, user: data.user }
    } catch (error) {
      return { error: error.message || 'Invalid email or password.' }
    }
  }

  async function signup(payload) {
    try {
      const data = await api.auth.signup(payload)
      api.setToken(data.token)
      setUser(data.user)

      const usersData = await api.users.list()
      setUsers(usersData.users || [])

      return { success: true, user: data.user }
    } catch (error) {
      return { error: error.message || 'Signup failed.' }
    }
  }

  function logout() {
    api.clearToken()
    setUser(null)
  }

  async function updateUsers(updater) {
    const nextUsers = updater(users)
    setUsers(nextUsers)

    const prevMap = new Map(users.map(u => [u.id, u]))
    const nextMap = new Map(nextUsers.map(u => [u.id, u]))

    const deletions = users.filter(u => !nextMap.has(u.id)).map(u => u.id)
    const roleChanges = nextUsers
      .filter(u => prevMap.has(u.id) && prevMap.get(u.id).role !== u.role)
      .map(u => ({ id: u.id, role: u.role }))

    try {
      await Promise.all([
        ...deletions.map(id => api.users.remove(id)),
        ...roleChanges.map(({ id, role }) => api.users.updateRole(id, role)),
      ])

      const usersData = await api.users.list()
      setUsers(usersData.users || [])
    } catch {
      const usersData = await api.users.list().catch(() => ({ users }))
      setUsers(usersData.users || users)
    }
  }

  return (
    <AuthContext.Provider value={{ user, users, login, signup, logout, updateUsers }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
