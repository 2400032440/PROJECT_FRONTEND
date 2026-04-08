import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { StatCard, PageHeader, Card } from '../../components/UI'
import { RoleBadge, StatusBadge } from '../../components/Badge'
import { Users, AlertCircle, Megaphone, MessagesSquare, Flag, CheckCircle2 } from 'lucide-react'

export default function AdminDashboard() {
  const { users } = useAuth()
  const { issues, updates, discussions } = useData()

  const flaggedCount = issues.filter(i => i.flagged).length + discussions.filter(d => d.flagged).length
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length

  const roleBreakdown = ['citizen', 'politician', 'moderator', 'admin'].map(r => ({
    role: r,
    count: users.filter(u => u.role === r).length,
  }))

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform overview and management console."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <StatCard label="Total Users" value={users.length} icon={Users} color="bg-white border border-gray-100" />
        <StatCard label="Total Issues" value={issues.length} icon={AlertCircle} color="bg-blue-50" />
        <StatCard label="Resolved Issues" value={resolvedIssues} icon={CheckCircle2} color="bg-green-50" />
        <StatCard label="Updates Published" value={updates.length} icon={Megaphone} color="bg-purple-50" />
        <StatCard label="Discussions" value={discussions.length} icon={MessagesSquare} color="bg-amber-50" />
        <StatCard label="Flagged Items" value={flaggedCount} icon={Flag} color={flaggedCount > 0 ? 'bg-red-50' : 'bg-gray-50'} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* User breakdown */}
        <Card>
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">User Roles</h2>
          </div>
          <div className="px-5 py-4 space-y-3">
            {roleBreakdown.map(({ role, count }) => (
              <div key={role} className="flex items-center justify-between">
                <RoleBadge role={role} />
                <div className="flex items-center gap-3">
                  <div className="flex-1 w-24 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-gray-400 h-1.5 rounded-full"
                      style={{ width: `${(count / users.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Issue status breakdown */}
        <Card>
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Issue Status Overview</h2>
          </div>
          <div className="px-5 py-4 space-y-3">
            {[
              { status: 'open', count: issues.filter(i => i.status === 'open').length },
              { status: 'in-progress', count: issues.filter(i => i.status === 'in-progress').length },
              { status: 'resolved', count: issues.filter(i => i.status === 'resolved').length },
              { status: 'closed', count: issues.filter(i => i.status === 'closed').length },
            ].map(({ status, count }) => (
              <div key={status} className="flex items-center justify-between">
                <StatusBadge status={status} />
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-gray-400 h-1.5 rounded-full"
                      style={{ width: issues.length ? `${(count / issues.length) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
