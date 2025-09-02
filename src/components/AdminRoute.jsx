// frontend/src/components/AdminRoute.jsx (วางทับทั้งหมด)
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth

function AdminRoute({ children }) {
  const { userData, loading } = useAuth(); // <-- ดึงข้อมูลจากศูนย์กลาง

  if (loading) {
    return <div>กำลังตรวจสอบสิทธิ์...</div>;
  }

  if (userData?.role === 'admin') {
    return children;
  }

  return <Navigate to="/" replace />;
}
export default AdminRoute;