import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import Layout from './components/Layout'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'

import CitizenDashboard from './pages/citizen/CitizenDashboard'
import ReportIssue from './pages/citizen/ReportIssue'
import MyIssues from './pages/citizen/MyIssues'
import Updates from './pages/citizen/Updates'

import PoliticianDashboard from './pages/politician/PoliticianDashboard'
import IssueInbox from './pages/politician/IssueInbox'
import PostUpdate from './pages/politician/PostUpdate'
import PoliticianDiscussions from './pages/politician/PoliticianDiscussions'

import ModeratorDashboard from './pages/moderator/ModeratorDashboard'
import ReviewContent from './pages/moderator/ReviewContent'

import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import Analytics from './pages/admin/Analytics'

import Discussions from './pages/shared/Discussions'
import AllIssues from './pages/shared/AllIssues'

const ROLE_HOME = {
  citizen: '/citizen/dashboard',
  politician: '/politician/dashboard',
  moderator: '/moderator/dashboard',
  admin: '/admin/dashboard',
}

function RedirectToDashboard() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={ROLE_HOME[user.role] || '/'} replace />
}

function Protected({ roles, children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (roles && !roles.includes(user.role)) return <Navigate to={ROLE_HOME[user.role] || '/'} replace />
  return <Layout>{children}</Layout>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/redirect" element={<RedirectToDashboard />} />

      <Route path="/citizen/dashboard" element={<Protected roles={['citizen']}><CitizenDashboard /></Protected>} />
      <Route path="/citizen/report" element={<Protected roles={['citizen']}><ReportIssue /></Protected>} />
      <Route path="/citizen/issues" element={<Protected roles={['citizen']}><MyIssues /></Protected>} />
      <Route path="/citizen/updates" element={<Protected roles={['citizen']}><Updates /></Protected>} />
      <Route path="/citizen/discussions" element={<Protected roles={['citizen']}><Discussions /></Protected>} />

      <Route path="/politician/dashboard" element={<Protected roles={['politician']}><PoliticianDashboard /></Protected>} />
      <Route path="/politician/inbox" element={<Protected roles={['politician']}><IssueInbox /></Protected>} />
      <Route path="/politician/post-update" element={<Protected roles={['politician']}><PostUpdate /></Protected>} />
      <Route path="/politician/discussions" element={<Protected roles={['politician']}><PoliticianDiscussions /></Protected>} />

      <Route path="/moderator/dashboard" element={<Protected roles={['moderator']}><ModeratorDashboard /></Protected>} />
      <Route path="/moderator/review" element={<Protected roles={['moderator']}><ReviewContent /></Protected>} />
      <Route path="/moderator/issues" element={<Protected roles={['moderator', 'admin']}><AllIssues /></Protected>} />
      <Route path="/moderator/discussions" element={<Protected roles={['moderator']}><Discussions /></Protected>} />

      <Route path="/admin/dashboard" element={<Protected roles={['admin']}><AdminDashboard /></Protected>} />
      <Route path="/admin/users" element={<Protected roles={['admin']}><ManageUsers /></Protected>} />
      <Route path="/admin/issues" element={<Protected roles={['admin']}><AllIssues /></Protected>} />
      <Route path="/admin/analytics" element={<Protected roles={['admin']}><Analytics /></Protected>} />
      <Route path="/admin/settings" element={<Protected roles={['admin']}><div className="py-10 text-sm text-gray-500">Settings coming soon.</div></Protected>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
