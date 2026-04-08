import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { StatCard, PageHeader, Card } from '../../components/UI'
import { Flag, ShieldCheck, MessageSquare, AlertCircle } from 'lucide-react'

export default function ModeratorDashboard() {
  const { issues, discussions } = useData()
  const { user } = useAuth()

  const flaggedIssues = issues.filter(i => i.flagged)
  const flaggedDiscussions = discussions.filter(d => d.flagged)
  const totalFlagged = flaggedIssues.length + flaggedDiscussions.length
  const recentIssues = [...issues].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  return (
    <div>
      <PageHeader
        title={`Hello, ${user.name.split(' ')[0]}.`}
        subtitle="Monitor and maintain community standards."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Issues" value={issues.length} icon={AlertCircle} color="bg-white border border-gray-100" />
        <StatCard label="Discussions" value={discussions.length} icon={MessageSquare} color="bg-blue-50" />
        <StatCard label="Flagged Items" value={totalFlagged} icon={Flag} color={totalFlagged > 0 ? 'bg-red-50' : 'bg-gray-50'} />
        <StatCard label="Resolved" value={issues.filter(i => i.status === 'resolved').length} icon={ShieldCheck} color="bg-green-50" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Flagged Issues ({flaggedIssues.length})</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {flaggedIssues.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No flagged issues.</p>
            ) : flaggedIssues.map(issue => (
              <div key={issue.id} className="px-5 py-3.5">
                <p className="text-sm font-medium text-gray-900">{issue.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{issue.authorName} · {issue.createdAt}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {recentIssues.map(issue => (
              <div key={issue.id} className="px-5 py-3.5">
                <p className="text-sm font-medium text-gray-900 truncate">{issue.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{issue.authorName} · {issue.createdAt}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
