import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../services/api';

const StatCard = ({ label, value, icon, color }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users')
      .then(({ data }) => setUsers(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const totalUsers = users.length;
  const doctors = users.filter(u => u.role === 'doctor').length;
  const patients = users.filter(u => u.role === 'patient').length;
  const admins = users.filter(u => u.role === 'admin').length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">System overview and user management</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Users" value={loading ? '...' : totalUsers} icon="👥" color="bg-blue-50" />
            <StatCard label="Doctors" value={loading ? '...' : doctors} icon="👨‍⚕️" color="bg-green-50" />
            <StatCard label="Patients" value={loading ? '...' : patients} icon="🧑‍⚕️" color="bg-purple-50" />
            <StatCard label="Admins" value={loading ? '...' : admins} icon="🛡️" color="bg-red-50" />
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">All Users</h2>
            </div>
            {error ? (
              <div className="p-6 text-red-600 text-sm">{error}</div>
            ) : loading ? (
              <div className="p-6 text-gray-500 text-sm animate-pulse">Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-400 text-sm">No users found.</td></tr>
                    ) : users.map(u => (
                      <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-xs font-bold flex items-center justify-center">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">{u.email}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            u.role === 'admin' ? 'bg-red-100 text-red-700' :
                            u.role === 'doctor' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
