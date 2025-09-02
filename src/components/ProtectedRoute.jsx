// frontend/src/components/ProtectedRoute.jsx (วางทับทั้งหมด)
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) { 
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>กำลังตรวจสอบผู้ใช้งาน...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
export default ProtectedRoute;