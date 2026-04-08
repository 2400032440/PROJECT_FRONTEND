import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [issues, setIssues] = useState([])
  const [updates, setUpdates] = useState([])
  const [discussions, setDiscussions] = useState([])

  useEffect(() => {
    let ignore = false

    async function hydrate() {
      if (!localStorage.getItem('poli_token')) return
      try {
        const data = await api.auth.bootstrap()
        if (ignore) return
        setIssues(data.issues || [])
        setUpdates(data.updates || [])
        setDiscussions(data.discussions || [])
      } catch {
        if (!ignore) {
          setIssues([])
          setUpdates([])
          setDiscussions([])
        }
      }
    }

    hydrate()
    window.addEventListener('poli-auth-changed', hydrate)
    return () => {
      ignore = true
      window.removeEventListener('poli-auth-changed', hydrate)
    }
  }, [])

  function addIssue(issue) {
    setIssues(prev => [issue, ...prev])
    api.issues.create(issue).catch(() => {})
  }
  function updateIssue(id, changes) {
    setIssues(prev => prev.map(i => i.id === id ? { ...i, ...changes } : i))
    api.issues.update(id, changes).catch(() => {})
  }
  function deleteIssue(id) {
    setIssues(prev => prev.filter(i => i.id !== id))
    api.issues.remove(id).catch(() => {})
  }
  function respondToIssue(issueId, response) {
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, responses: [...i.responses, response] } : i))
    api.issues.respond(issueId, response).catch(() => {})
  }
  function voteIssue(issueId) {
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, votes: i.votes + 1 } : i))
    api.issues.vote(issueId).catch(() => {})
  }

  function addUpdate(update) {
    setUpdates(prev => [update, ...prev])
    api.updates.create(update).catch(() => {})
  }
  function likeUpdate(id) {
    setUpdates(prev => prev.map(u => u.id === id ? { ...u, likes: u.likes + 1 } : u))
    api.updates.like(id).catch(() => {})
  }
  function commentOnUpdate(updateId, comment) {
    setUpdates(prev => prev.map(u => u.id === updateId ? { ...u, comments: [...u.comments, comment] } : u))
    api.updates.comment(updateId, comment).catch(() => {})
  }

  function addDiscussion(discussion) {
    setDiscussions(prev => [discussion, ...prev])
    api.discussions.create(discussion).catch(() => {})
  }
  function replyToDiscussion(discussionId, reply) {
    setDiscussions(prev => prev.map(d => d.id === discussionId ? { ...d, replies: [...d.replies, reply] } : d))
    api.discussions.reply(discussionId, reply).catch(() => {})
  }
  function flagItem(type, id) {
    if (type === 'issue') setIssues(prev => prev.map(i => i.id === id ? { ...i, flagged: true } : i))
    if (type === 'discussion') setDiscussions(prev => prev.map(d => d.id === id ? { ...d, flagged: true } : d))
    api.moderation.flag(type, id, true).catch(() => {})
  }
  function unflagItem(type, id) {
    if (type === 'issue') setIssues(prev => prev.map(i => i.id === id ? { ...i, flagged: false } : i))
    if (type === 'discussion') setDiscussions(prev => prev.map(d => d.id === id ? { ...d, flagged: false } : d))
    api.moderation.flag(type, id, false).catch(() => {})
  }

  return (
    <DataContext.Provider value={{
      issues, updates, discussions,
      addIssue, updateIssue, deleteIssue, respondToIssue, voteIssue,
      addUpdate, likeUpdate, commentOnUpdate,
      addDiscussion, replyToDiscussion,
      flagItem, unflagItem,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}
