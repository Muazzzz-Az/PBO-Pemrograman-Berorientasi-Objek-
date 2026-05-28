import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, user }) {
  // Ambil data user dari localStorage jika state prop-nya kosong saat di-refresh
  const savedUser = user || JSON.parse(localStorage.getItem('user'));

  // Validasi: Jika tidak ada user atau role-nya bukan 'admin', kunci aksesnya!
  if (!savedUser || savedUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;