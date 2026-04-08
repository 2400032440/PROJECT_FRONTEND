import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { PageHeader, Card } from '../../components/UI'
import { CategoryBadge, StatusBadge } from '../../components/Badge'

export default function Analytics() {
  const { issues, updates, discussions } = useData()
  const { users } = useAuth()

  const categories = [...new Set(issues.map(i => i.category))]
  const categoryCounts = categories.map(c => ({
    category: c,
    count: issues.filter(i => i.category === c).length,
  })).sort((a, b) => b.count - a.count)

  const topIssues = [...issues].sort((a, b) => b.votes - a.votes).slice(0, 5)

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Platform statistics and engagement metrics." />

      <div className="grid md:grid-cols-2 gap-4">
        {/* Issues by category */}
        <Card>
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Issues by Category</h2>
          </div>
          <div className="px-5 py-4 space-y-3">
            {categoryCounts.length === 0 ? (
              <p className="text-xs text-gray-400">No data.</p>
            ) : categoryCounts.map(({ category, count }) => (
              <div key={category} className="flex items-center justify-between gap-3">
                <CategoryBadge category={category} />
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-gray-400 h-1.5 rounded-full"
                      style={{ width: `${(count / issues.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top voted issues */}
        <Card>
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Top Voted Issues</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {topIssues.map((issue, idx) => (
              <div key={issue.id} className="px-5 py-3 flex items-center gap-3">
                <span className="text-lg font-bold text-gray-200 w-5 text-center">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{issue.title}</p>
                  <StatusBadge status={issue.status} />
                </div>
                <span className="text-sm font-semibold text-gray-500">{issue.votes}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Summary stats */}
        <Card>
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Platform Summary</h2>
          </div>
          <div className="px-5 py-4 space-y-4">
            {[
              { label: 'Total registered users', value: users.length },
              { label: 'Total issues reported', value: issues.length },
              { label: 'Response rate', value: `${issues.length ? Math.round((issues.filter(i => i.responses.length > 0).length / issues.length) * 100) : 0}%` },
              { label: 'Resolution rate', value: `${issues.length ? Math.round((issues.filter(i => i.status === 'resolved').length / issues.length) * 100) : 0}%` },
              { label: 'Updates published', value: updates.length },
              { label: 'Discussions started', value: discussions.length },
              { label: 'Total replies', value: discussions.reduce((acc, d) => acc + d.replies.length, 0) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-semibold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
