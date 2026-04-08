import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ROLE_COLORS = {
  citizen: 'bg-blue-100 text-blue-700',
  politician: 'bg-purple-100 text-purple-700',
  moderator: 'bg-amber-100 text-amber-700',
  admin: 'bg-red-100 text-red-700',
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200/80">
      <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-semibold text-gray-900 tracking-tight">Poli</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${ROLE_COLORS[user.role]}`}>
                {user.role}
              </span>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bell size={16} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">{user.avatar}</span>
                </div>
                <span className="text-sm text-gray-700 hidden sm:block">{user.name.split(' ')[0]}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Logout"
              >
                <LogOut size={16} className="text-gray-500" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Sign in</Link>
              <Link to="/signup" className="text-sm bg-gray-900 text-white px-4 py-1.5 rounded-full hover:bg-gray-700 transition-colors">
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
