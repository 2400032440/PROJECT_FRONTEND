const STATUS_STYLES = {
  open: 'bg-blue-50 text-blue-700',
  'in-progress': 'bg-amber-50 text-amber-700',
  resolved: 'bg-green-50 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
  flagged: 'bg-red-50 text-red-700',
}

const PRIORITY_STYLES = {
  high: 'bg-red-50 text-red-600',
  medium: 'bg-amber-50 text-amber-600',
  low: 'bg-gray-100 text-gray-500',
}

const CATEGORY_STYLES = {
  Infrastructure: 'bg-slate-100 text-slate-600',
  Education: 'bg-indigo-50 text-indigo-600',
  Roads: 'bg-orange-50 text-orange-600',
  Environment: 'bg-green-50 text-green-700',
  Transport: 'bg-cyan-50 text-cyan-600',
  Community: 'bg-purple-50 text-purple-600',
  Health: 'bg-pink-50 text-pink-600',
  Safety: 'bg-red-50 text-red-600',
  Other: 'bg-gray-100 text-gray-500',
}

export function StatusBadge({ status }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-600'}`}>
      {status.replace('-', ' ')}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${PRIORITY_STYLES[priority] || 'bg-gray-100 text-gray-500'}`}>
      {priority}
    </span>
  )
}

export function CategoryBadge({ category }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_STYLES[category] || 'bg-gray-100 text-gray-500'}`}>
      {category}
    </span>
  )
}

export function RoleBadge({ role }) {
  const styles = {
    citizen: 'bg-blue-100 text-blue-700',
    politician: 'bg-purple-100 text-purple-700',
    moderator: 'bg-amber-100 text-amber-700',
    admin: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${styles[role] || 'bg-gray-100 text-gray-500'}`}>
      {role}
    </span>
  )
}
