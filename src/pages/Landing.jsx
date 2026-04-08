import { createElement } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageSquare, Megaphone, ShieldCheck, Users } from 'lucide-react'

const FEATURES = [
  { icon: MessageSquare, label: 'Report Issues', desc: 'Directly submit concerns about infrastructure, services, or community needs.' },
  { icon: Megaphone, label: 'Get Updates', desc: 'Receive real-time updates and announcements from your elected representatives.' },
  { icon: MessageSquare, label: 'Join Discussions', desc: 'Participate in civic conversations and influence local policy decisions.' },
  { icon: ShieldCheck, label: 'Safe & Moderated', desc: 'All interactions are monitored to ensure respectful, productive dialogue.' },
]

const ROLES = [
  { role: 'Citizen', color: 'bg-blue-50 border-blue-100', dot: 'bg-blue-500', desc: 'Report issues, track progress, and stay informed.' },
  { role: 'Politician', color: 'bg-purple-50 border-purple-100', dot: 'bg-purple-500', desc: 'Respond to constituents and share policy updates.' },
  { role: 'Moderator', color: 'bg-amber-50 border-amber-100', dot: 'bg-amber-500', desc: 'Maintain respectful and constructive dialogue.' },
  { role: 'Admin', color: 'bg-red-50 border-red-100', dot: 'bg-red-500', desc: 'Oversee platform integrity and user management.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200/80">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="font-semibold text-gray-900 tracking-tight">Poli</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Sign in</Link>
            <Link to="/signup" className="text-sm bg-gray-900 text-white px-4 py-1.5 rounded-full hover:bg-gray-700 transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Civic technology for everyone
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 tracking-tight leading-[1.08] mb-6">
            Bridging citizens<br />and government.
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
            Poli makes it effortless to report issues, engage with representatives, and stay informed — all in one place.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/signup" className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
              Get started free <ArrowRight size={15} />
            </Link>
            <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 px-6 py-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
              Try a demo account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ icon, label, desc }) => (
              <div key={label} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
                  {createElement(icon, { size: 20, className: 'text-gray-700' })}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Built for every stakeholder</h2>
            <p className="text-sm text-gray-500 mt-2">Four distinct roles, one unified platform.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ROLES.map(({ role, color, dot, desc }) => (
              <div key={role} className={`rounded-2xl p-5 border ${color}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${dot}`}></span>
                  <span className="text-sm font-semibold text-gray-900">{role}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo credentials */}
      <section className="pb-20 px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 p-8">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Try the demo</h3>
          <p className="text-sm text-gray-500 mb-5">Use any of these credentials to explore the platform.</p>
          <div className="space-y-2">
            {[
              { role: 'Citizen', email: 'citizen@demo.com' },
              { role: 'Politician', email: 'politician@demo.com' },
              { role: 'Moderator', email: 'moderator@demo.com' },
              { role: 'Admin', email: 'admin@demo.com' },
            ].map(({ role, email }) => (
              <div key={role} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700">{role}</p>
                  <p className="text-xs text-gray-400 font-mono">{email}</p>
                </div>
                <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded-lg">demo123</span>
              </div>
            ))}
          </div>
          <Link to="/login" className="mt-5 inline-flex items-center gap-2 text-sm text-gray-900 font-medium hover:underline">
            Go to login <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <footer className="text-center pb-10 text-xs text-gray-400">
        © 2026 Poli — Civic Engagement Platform
      </footer>
    </div>
  )
}
