import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/appointments/my')
      .then(({ data }) => setAppointments(data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load appointments'))
      .finally(() => setLoading(false));
  }, []);

  const pending = appointments.filter(a => a.status === 'pending').length;
  const confirmed = appointments.filter(a => a.status === 'confirmed').length;
  const today = appointments.filter(a => {
    const d = new Date(a.date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

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
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, Dr. {user?.name}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-2xl">⏳</div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : pending}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">✅</div>
              <div>
                <p className="text-sm text-gray-500">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : confirmed}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">📅</div>
              <div>
                <p className="text-sm text-gray-500">Today</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : today}</p>
              </div>
            </div>
          </div>

          {/* My Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">My Profile</h2>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">Dr. {user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Doctor
                </span>
              </div>
            </div>
          </div>

          {/* Appointments list */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">My Appointments</h2>
            </div>
            {error ? (
              <div className="p-6 text-red-600 text-sm">{error}</div>
            ) : loading ? (
              <div className="p-6 text-gray-500 text-sm animate-pulse">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-sm">No appointments yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {appointments.map(appt => (
                  <div key={appt._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Patient: {appt.patient?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(appt.date).toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${statusColors[appt.status] || 'bg-gray-100 text-gray-600'}`}>
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
