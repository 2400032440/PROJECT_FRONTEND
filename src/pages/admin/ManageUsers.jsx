import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { PageHeader, Card } from '../../components/UI'
import { RoleBadge } from '../../components/Badge'
import { Search, Trash2, UserCog } from 'lucide-react'
import Modal from '../../components/Modal'

export default function ManageUsers() {
  const { users, user: currentUser, updateUsers } = useAuth()
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [newRole, setNewRole] = useState('')

  const filtered = search.trim()
    ? users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    : users

  function openEdit(u) {
    setSelectedUser(u)
    setNewRole(u.role)
  }

  function saveRole() {
    updateUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u))
    setSelectedUser(null)
  }

  function deleteUser(id) {
    if (id === currentUser.id) return alert("You can't delete your own account.")
    if (!window.confirm('Are you sure you want to delete this user?')) return
    updateUsers(prev => prev.filter(u => u.id !== id))
  }

  return (
    <div>
      <PageHeader title="Manage Users" subtitle={`${users.length} registered users on the platform.`} />

      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 transition-colors"
        />
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">User</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Role</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">Joined</th>
              <th className="px-5 py-3 text-xs font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-gray-600">{u.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-xs">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <RoleBadge role={u.role} />
                </td>
                <td className="px-5 py-3 text-xs text-gray-400 hidden md:table-cell">{u.joined}</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <button
                      onClick={() => openEdit(u)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit role"
                    >
                      <UserCog size={14} />
                    </button>
                    {u.id !== currentUser.id && (
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No users match your search.</p>
        )}
      </Card>

      {selectedUser && (
        <Modal title="Edit User Role" onClose={() => setSelectedUser(null)} size="sm">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{selectedUser.name}</p>
              <p className="text-xs text-gray-400">{selectedUser.email}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Role</label>
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:border-gray-400 focus:bg-white transition-colors"
              >
                <option value="citizen">Citizen</option>
                <option value="politician">Politician</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={saveRole}
                className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Save changes
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
