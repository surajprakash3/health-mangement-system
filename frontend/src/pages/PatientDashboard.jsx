import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState({ doctorId: '', date: '' });
  const [bookingStatus, setBookingStatus] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/appointments/my').then(r => setAppointments(r.data)).catch(() => {}),
      api.get('/doctors').then(r => setDoctors(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingStatus('');
    setBookingError('');
    if (!booking.doctorId || !booking.date) {
      setBookingError('Please select a doctor and a date.');
      return;
    }
    try {
      const { data } = await api.post('/appointments', { doctorId: booking.doctorId, date: booking.date });
      setAppointments(prev => [data, ...prev]);
      setBooking({ doctorId: '', date: '' });
      setBookingStatus('Appointment booked successfully!');
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Booking failed.');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };

  const upcoming = appointments.filter(a => new Date(a.date) >= new Date()).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome, {user?.name}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">📅</div>
              <div>
                <p className="text-sm text-gray-500">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : appointments.length}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">🕐</div>
              <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : upcoming}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl">👨‍⚕️</div>
              <div>
                <p className="text-sm text-gray-500">Available Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : doctors.length}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Book Appointment */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Book Appointment</h2>
              {bookingStatus && (
                <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{bookingStatus}</div>
              )}
              {bookingError && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{bookingError}</div>
              )}
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
                  <select
                    id="doctor-select"
                    value={booking.doctorId}
                    onChange={e => setBooking({ ...booking, doctorId: e.target.value })}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Choose a doctor --</option>
                    {doctors.map(d => (
                      <option key={d._id} value={d._id}>Dr. {d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date & Time</label>
                  <input
                    id="appt-date"
                    type="datetime-local"
                    value={booking.date}
                    onChange={e => setBooking({ ...booking, date: e.target.value })}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  id="book-appt-btn"
                  type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Book Appointment
                </button>
              </form>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">My Profile</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Patient
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Appointment History</h2>
            </div>
            {error ? (
              <div className="p-6 text-red-600 text-sm">{error}</div>
            ) : loading ? (
              <div className="p-6 text-gray-500 text-sm animate-pulse">Loading...</div>
            ) : appointments.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-sm">No appointments yet. Book your first one above!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {appointments.map(appt => (
                  <div key={appt._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Dr. {appt.doctor?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(appt.date).toLocaleString()}</p>
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

export default PatientDashboard;
