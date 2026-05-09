import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to correct dashboard based on role
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor" replace />;
    return <Navigate to="/patient" replace />;
  }

  return children;
};

export default ProtectedRoute;
