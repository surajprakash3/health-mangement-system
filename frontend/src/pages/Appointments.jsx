import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const endpoint = user?.role === 'admin' ? '/appointments' : '/appointments/my';
    api.get(endpoint)
      .then(({ data }) => setAppointments(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load appointments'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await api.put(`/appointments/${id}/status`, { status: newStatus });
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: data.status } : a));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            <p className="text-sm text-gray-500 mt-1">
              {user?.role === 'admin' ? 'All system appointments' : 'Your scheduled appointments'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            {error ? (
              <div className="p-6 text-red-600 text-sm">{error}</div>
            ) : loading ? (
              <div className="p-6 text-gray-500 text-sm animate-pulse">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-sm font-medium">No appointments found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      {(user?.role === 'admin' || user?.role === 'doctor') && (
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {appointments.map(appt => (
                      <tr key={appt._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 text-sm text-gray-900">{appt.patient?.name || '—'}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">Dr. {appt.doctor?.name || '—'}</td>
                        <td className="px-6 py-3 text-sm text-gray-500">{new Date(appt.date).toLocaleString()}</td>
                        <td className="px-6 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${statusColors[appt.status] || 'bg-gray-100 text-gray-600'}`}>
                            {appt.status}
                          </span>
                        </td>
                        {(user?.role === 'admin' || user?.role === 'doctor') && (
                          <td className="px-6 py-3">
                            <select
                              value={appt.status}
                              onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        )}
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

export default Appointments;
