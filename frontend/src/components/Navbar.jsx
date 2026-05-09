import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColors = {
    admin: 'bg-red-100 text-red-700',
    doctor: 'bg-green-100 text-green-700',
    patient: 'bg-blue-100 text-blue-700',
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.5 12.5l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="font-bold text-gray-900 text-lg">HealthCare HMS</span>
      </div>

      {/* User info + Logout */}
      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-gray-800">{user.name}</span>
            <span className="text-xs text-gray-500">{user.email}</span>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${roleColors[user.role] || 'bg-gray-100 text-gray-700'}`}>
            {user.role}
          </span>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
