// frontend/src/components/AdminRoute.jsx (เวอร์ชันสมบูรณ์ที่สุด)

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- ใส่ User ID ของแอดมิน (ตัวน้องเอง) ตรงนี้อีกครั้งเพื่อความชัวร์ ---
const ADMIN_UID = "QiP4ghf9ktT79LOH0FUy6lDCchk1"; // <--- แก้ไข UID ของน้อง

function AdminRoute({ children }) { 
  // ดึงข้อมูลทั้งหมดที่จำเป็นจากศูนย์กลาง
  const { currentUser, userData, loading } = useAuth();

  // 1. ระหว่างที่ AuthContext กำลังทำงาน ให้แสดงหน้า Loading ก่อน
  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <p>กำลังตรวจสอบสิทธิ์การเข้าถึง...</p>
      </div>
    );
  }
  
  // 2. เมื่อโหลดเสร็จแล้ว ให้ทำการตรวจสอบ
  // เงื่อนไข: ต้องมี currentUser, uid ของเขาต้องตรงกับ ADMIN_UID, และ role ใน Firestore ต้องเป็น 'admin'
  if (currentUser && currentUser.uid === ADMIN_UID && userData?.role === 'admin') {
    // ถ้าเงื่อนไขเป็นจริงทั้งหมด ให้แสดงหน้าที่ต้องการ
    return children;
  } else {
    // ถ้าเงื่อนไขไม่เป็นจริง แม้แต่ข้อเดียว ให้ดีดกลับไปหน้าแรก
    console.log("Access Denied: Not an admin or data mismatch. Redirecting...");
    return <Navigate to="/" replace />;
  }
}

export default AdminRoute;