// frontend/src/components/AdminRoute.jsx (วางทับทั้งหมด)
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute({ children }) {
  const { userData, loading } = useAuth();

  if (loading) {
    return <div className="container"><p>กำลังตรวจสอบสิทธิ์...</p></div>;
  }

  if (userData?.role === 'admin') {
    return children;
  }
  
  return <Navigate to="/" replace />;
}
export default AdminRoute;