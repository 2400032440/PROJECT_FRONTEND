import { useData } from '../../context/DataContext'
import { PageHeader, Card, EmptyState } from '../../components/UI'
import { StatusBadge, CategoryBadge } from '../../components/Badge'
import { Flag, ShieldCheck, Trash2 } from 'lucide-react'

export default function ReviewContent() {
  const { issues, discussions, unflagItem, deleteIssue } = useData()

  const flaggedIssues = issues.filter(i => i.flagged)
  const flaggedDiscussions = discussions.filter(d => d.flagged)

  return (
    <div>
      <PageHeader
        title="Review Content"
        subtitle="Review flagged items and take action to maintain community standards."
      />

      <div className="space-y-6">
        {/* Flagged Issues */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Flag size={14} className="text-red-500" />
            Flagged Issues ({flaggedIssues.length})
          </h2>
          {flaggedIssues.length === 0 ? (
            <Card className="p-2">
              <EmptyState icon={ShieldCheck} title="No flagged issues" description="All issues are within community guidelines." />
            </Card>
          ) : (
            <div className="space-y-3">
              {flaggedIssues.map(issue => (
                <Card key={issue.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <StatusBadge status={issue.status} />
                        <CategoryBadge category={issue.category} />
                        <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">Flagged</span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">{issue.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">{issue.authorName} · {issue.createdAt}</p>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{issue.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => unflagItem('issue', issue.id)}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                    >
                      <ShieldCheck size={12} /> Approve & unflag
                    </button>
                    <button
                      onClick={() => deleteIssue(issue.id)}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Flagged Discussions */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Flag size={14} className="text-red-500" />
            Flagged Discussions ({flaggedDiscussions.length})
          </h2>
          {flaggedDiscussions.length === 0 ? (
            <Card className="p-2">
              <EmptyState icon={ShieldCheck} title="No flagged discussions" description="All discussions are within community guidelines." />
            </Card>
          ) : (
            <div className="space-y-3">
              {flaggedDiscussions.map(d => (
                <Card key={d.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <CategoryBadge category={d.category} />
                        <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">Flagged</span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">{d.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">{d.authorName} · {d.createdAt}</p>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{d.body}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => unflagItem('discussion', d.id)}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                    >
                      <ShieldCheck size={12} /> Approve & unflag
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
