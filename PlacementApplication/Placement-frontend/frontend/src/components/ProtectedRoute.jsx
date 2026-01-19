import React from 'react';
import { Navigate } from 'react-router-dom';

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
}

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;

  if (role) {
    const payload = parseJwt(token);
    if (!payload) return <Navigate to="/" replace />;

    const tokenRole = payload.role || payload.roles || payload.authorities;
    if (!tokenRole) return <Navigate to="/" replace />;

    if (typeof tokenRole === 'string') {
      if (tokenRole !== role) return <Navigate to="/" replace />;
    } else if (Array.isArray(tokenRole)) {
      if (!tokenRole.includes(role)) return <Navigate to="/" replace />;
    }
  }

  return children;
}
