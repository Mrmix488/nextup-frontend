
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; 
import { auth, db } from '../firebase';
import './DashboardPage.css';

function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      getDoc(userRef).then(docSnap => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
        setLoading(false);
      });
    }
  }, [currentUser]);

  if (loading) return <div className="container"><p>กำลังโหลด...</p></div>;
  if (!currentUser || !userData) return <div className="container"><p>ไม่พบข้อมูลผู้ใช้</p></div>;
  
  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>แดชบอร์ดของคุณ</h1>
        <p>ยินดีต้อนรับ, {userData.displayName}</p>
      </div>

      <div className="dashboard-grid">
        {/* --- การ์ดใหม่สำหรับฟรีแลนซ์เท่านั้น! --- */}
        {userData.role === 'freelancer' && (
          <Link to="/post-service" className="dashboard-card primary">
            <div className="card-icon">✨</div>
            <h3>สร้างบริการใหม่</h3>
            <p>เพิ่มบริการหรือผลงานของคุณ</p>
          </Link>
        )}

        <Link to="/inbox" className="dashboard-card"> ... </Link>
        <Link to="/my-jobs" className="dashboard-card"> ... </Link>
        <Link to="/profile/edit" className="dashboard-card"> ... </Link>
        <div className="dashboard-card disabled"> ... </div>
      </div>
    </div>
  );
}

export default DashboardPage;