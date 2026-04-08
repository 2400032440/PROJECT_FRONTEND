import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { StatCard, PageHeader, Card } from '../../components/UI'
import { StatusBadge, CategoryBadge } from '../../components/Badge'
import { Link } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Clock, ThumbsUp, ArrowRight } from 'lucide-react'

export default function CitizenDashboard() {
  const { user } = useAuth()
  const { issues, updates } = useData()

  const myIssues = issues.filter(i => i.authorId === user.id)
  const openCount = myIssues.filter(i => i.status === 'open').length
  const inProgressCount = myIssues.filter(i => i.status === 'in-progress').length
  const resolvedCount = myIssues.filter(i => i.status === 'resolved').length

  const recentIssues = [...issues].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)
  const latestUpdates = updates.slice(0, 3)

  return (
    <div>
      <PageHeader
        title={`Good day, ${user.name.split(' ')[0]}.`}
        subtitle="Here's what's happening in your community."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="My Issues" value={myIssues.length} icon={AlertCircle} color="bg-white border border-gray-100" />
        <StatCard label="Open" value={openCount} icon={Clock} color="bg-blue-50" />
        <StatCard label="In Progress" value={inProgressCount} icon={ThumbsUp} color="bg-amber-50" />
        <StatCard label="Resolved" value={resolvedCount} icon={CheckCircle2} color="bg-green-50" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent Issues */}
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Recent Issues</h2>
            <Link to="/citizen/issues" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentIssues.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No issues yet.</p>
            ) : recentIssues.map(issue => (
              <div key={issue.id} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{issue.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{issue.authorName} · {issue.createdAt}</p>
                  </div>
                  <StatusBadge status={issue.status} />
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-50">
            <Link to="/citizen/report" className="text-sm text-gray-900 font-medium hover:underline flex items-center gap-1">
              Report a new issue <ArrowRight size={13} />
            </Link>
          </div>
        </Card>

        {/* Latest Updates */}
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Latest Updates</h2>
            <Link to="/citizen/updates" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {latestUpdates.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No updates yet.</p>
            ) : latestUpdates.map(update => (
              <div key={update.id} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{update.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{update.authorName} · {update.createdAt}</p>
                  </div>
                  <CategoryBadge category={update.category} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
