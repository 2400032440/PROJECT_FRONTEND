import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { StatCard, PageHeader, Card } from '../../components/UI'
import { StatusBadge } from '../../components/Badge'
import { Link } from 'react-router-dom'
import { MessageSquare, Megaphone, Users, CheckCircle2, ArrowRight, Clock } from 'lucide-react'

export default function PoliticianDashboard() {
  const { user } = useAuth()
  const { issues, updates, discussions } = useData()

  const openIssues = issues.filter(i => i.status === 'open')
  const inProgress = issues.filter(i => i.status === 'in-progress')
  const resolved = issues.filter(i => i.status === 'resolved')
  const myUpdates = updates.filter(u => u.authorId === user.id)
  const myDiscussions = discussions.filter(d => d.authorId === user.id)

  const urgent = issues.filter(i => i.priority === 'high' && i.status === 'open')
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5)

  return (
    <div>
      <PageHeader
        title={`Hello, ${user.name.split(' ')[0]}.`}
        subtitle="Here's a summary of constituent activity."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Open Issues" value={openIssues.length} icon={Clock} color="bg-blue-50" />
        <StatCard label="In Progress" value={inProgress.length} icon={MessageSquare} color="bg-amber-50" />
        <StatCard label="Resolved" value={resolved.length} icon={CheckCircle2} color="bg-green-50" />
        <StatCard label="My Updates" value={myUpdates.length} icon={Megaphone} color="bg-purple-50" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* High-priority issues */}
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Urgent — Needs Response</h2>
            <Link to="/politician/inbox" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {urgent.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No urgent issues.</p>
            ) : urgent.map(issue => (
              <div key={issue.id} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{issue.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{issue.authorName} · {issue.votes} votes</p>
                  </div>
                  <StatusBadge status={issue.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick stats */}
        <Card>
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Activity Overview</h2>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total issues reported</span>
              <span className="text-sm font-semibold text-gray-900">{issues.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Issues awaiting response</span>
              <span className="text-sm font-semibold text-gray-900">{issues.filter(i => i.responses.length === 0).length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Active discussions</span>
              <span className="text-sm font-semibold text-gray-900">{myDiscussions.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Updates published</span>
              <span className="text-sm font-semibold text-gray-900">{myUpdates.length}</span>
            </div>
          </div>
          <div className="px-5 py-3 border-t border-gray-50 flex gap-3">
            <Link to="/politician/inbox" className="text-sm text-gray-900 font-medium hover:underline flex items-center gap-1">
              Go to inbox <ArrowRight size={13} />
            </Link>
            <Link to="/politician/post-update" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
              Post update <ArrowRight size={13} />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
