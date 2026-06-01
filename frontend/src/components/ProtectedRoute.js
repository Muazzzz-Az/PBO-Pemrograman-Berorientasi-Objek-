// src/components/ProtectedRoute.js - FIXED support 'admin' dan 'ADMIN'
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, user }) {
  // Ambil data user dari localStorage jika state prop-nya kosong saat di-refresh
  const savedUser = user || JSON.parse(localStorage.getItem('user'));

  // Debug: cek role user
  console.log('ProtectedRoute - savedUser:', savedUser);
  console.log('ProtectedRoute - role:', savedUser?.role);

  // Validasi: Cek apakah user memiliki role admin (case insensitive)
  const isAdmin = savedUser && (
    savedUser.role === 'admin' ||
    savedUser.role === 'ADMIN' ||
    savedUser.role?.toLowerCase() === 'admin'
  );

  if (!isAdmin) {
    console.log('Access denied - not admin');
    return <Navigate to="/" replace />;
  }

  console.log('Access granted - admin');
  return children;
}

export default ProtectedRoute;