import { createElement } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, AlertCircle, MessageSquare, Megaphone,
  Users, ShieldCheck, FileText, Settings, MessagesSquare,
  ClipboardList, BarChart2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = {
  citizen: [
    { label: 'Dashboard', to: '/citizen/dashboard', icon: LayoutDashboard },
    { label: 'Report Issue', to: '/citizen/report', icon: AlertCircle },
    { label: 'My Issues', to: '/citizen/issues', icon: ClipboardList },
    { label: 'Updates', to: '/citizen/updates', icon: Megaphone },
    { label: 'Discussions', to: '/citizen/discussions', icon: MessagesSquare },
  ],
  politician: [
    { label: 'Dashboard', to: '/politician/dashboard', icon: LayoutDashboard },
    { label: 'Issue Inbox', to: '/politician/inbox', icon: MessageSquare },
    { label: 'Post Update', to: '/politician/post-update', icon: Megaphone },
    { label: 'Discussions', to: '/politician/discussions', icon: MessagesSquare },
  ],
  moderator: [
    { label: 'Dashboard', to: '/moderator/dashboard', icon: LayoutDashboard },
    { label: 'Review Content', to: '/moderator/review', icon: ShieldCheck },
    { label: 'All Issues', to: '/moderator/issues', icon: FileText },
    { label: 'Discussions', to: '/moderator/discussions', icon: MessagesSquare },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Users', to: '/admin/users', icon: Users },
    { label: 'All Issues', to: '/admin/issues', icon: FileText },
    { label: 'Analytics', to: '/admin/analytics', icon: BarChart2 },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ],
}

export default function Sidebar() {
  const { user } = useAuth()
  if (!user) return null
  const items = NAV_ITEMS[user.role] || []

  return (
    <aside className="fixed top-14 left-0 bottom-0 w-56 bg-white border-r border-gray-200/80 flex flex-col py-4 z-40 hidden md:flex">
      <nav className="flex-1 px-3 space-y-0.5">
        {items.map(({ label, to, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            {createElement(icon, { size: 16 })}
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-2">
        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">{user.avatar}</span>
            </div>
            <p className="text-xs font-medium text-gray-900 truncate">{user.name}</p>
          </div>
          <p className="text-xs text-gray-400 capitalize">{user.role}</p>
        </div>
      </div>
    </aside>
  )
}
