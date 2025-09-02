// frontend/src/components/Navbar.jsx (เวอร์ชันสมบูรณ์สุดท้ายจริงๆ)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth
import './Navbar.css';
import logo from '/FFS.png';

// --- ย้าย ADMIN_UID มาไว้ข้างนอก และตรวจสอบให้แน่ใจว่าเป็น UID ของน้อง ---
const ADMIN_UID = "QiP4ghf9ktT79LOH0FUy6lDCchk1";

function Navbar() {
  const navigate = useNavigate();
  // --- ดึงข้อมูลทั้งหมดที่จำเป็นมาจากศูนย์กลางข้อมูล (AuthContext) ---
  const { currentUser, userData, loading } = useAuth(); 

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // --- Logic การตัดสินใจทั้งหมดจะอยู่ที่นี่ ---
  const userRole = userData?.role;
  // เราจะใช้การเช็ค 2 ชั้นเพื่อความปลอดภัยสูงสุด
  const isAdmin = currentUser && currentUser.uid === ADMIN_UID && userRole === 'admin';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="NextUp Logo" className="navbar-logo-img" />
          <span>NextUp</span>
        </Link>

        <div className="navbar-links">
          {(!currentUser || userRole === 'freelancer') && (
            <Link to="/find-jobs" className="navbar-link">ค้นหางาน</Link>
          )}
          
          {/* --- นี่คือเมนูแอดมินที่ต้องกลับมา! --- */}
          {isAdmin && (
            <Link to="/admin" className="navbar-link admin-link">แผงควบคุมแอดมิน</Link>
          )}
        </div>

        <div className="navbar-menu">
          {/* --- เราจะใช้ loading จาก useAuth แทน --- */}
          {loading ? (
            <p style={{ fontSize: '0.9rem' }}>...</p>
          ) : currentUser ? (
            <div className="profile-menu">
              {userRole === 'client' && <Link to="/post-job" className="navbar-button post-job">ประกาศงาน</Link>}
              {userRole === 'freelancer' && <Link to="/post-service" className="navbar-button post-service">สร้างบริการ</Link>}
              
              <div className="profile-menu-separator"></div>
              
              <div className="dropdown">
                <div className="profile-menu-trigger">
                  <img 
                    src={userData?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${userData?.displayName || currentUser.email}`} 
                    alt="avatar" 
                    className="profile-avatar"
                  />
                  <span>{userData?.displayName || currentUser.email.split('@')[0]}</span>
                </div>
                <div className="dropdown-content">
                  <Link to={`/profile/${currentUser.uid}`}>โปรไฟล์ของฉัน</Link>
                  <Link to="/dashboard">แดชบอร์ด</Link>
                  <Link to="/my-jobs">งานของฉัน</Link>
                  <Link to="/inbox">กล่องข้อความ</Link>
                  <a href="#" onClick={handleLogout} className="logout-link">ออกจากระบบ</a>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-button login">เข้าสู่ระบบ</Link>
              <Link to="/register" className="navbar-button register">สมัครสมาชิก</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;