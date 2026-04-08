import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user } = useAuth()
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />
      {user && <Sidebar />}
      <main className={`pt-14 ${user ? 'md:ml-56' : ''} min-h-screen`}>
        <div className="p-6 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
