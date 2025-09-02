// frontend/src/components/Navbar.jsx (เวอร์ชันมอบอำนาจแอดมิน)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import logo from '/FFS.png';

function Navbar() {
  const navigate = useNavigate();
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

  const userRole = userData?.role;
  const isAdmin = userRole === 'admin';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="NextUp Logo" className="navbar-logo-img" />
          <span>NextUp</span>
        </Link>

        <div className="navbar-links">
          {/* --- แก้ไขเงื่อนไข! --- */}
          {/* แสดง "ค้นหางาน" ถ้ายังไม่ล็อกอิน, เป็นฟรีแลนซ์, "หรือเป็นแอดมิน" */}
          {(!currentUser || userRole === 'freelancer' || isAdmin) && (
            <Link to="/find-jobs" className="navbar-link">ค้นหางาน</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="navbar-link admin-link">แผงควบคุม</Link>
          )}
        </div>

        <div className="navbar-menu">
          {currentUser && !loading ? (
            <div className="profile-menu">
              {/* --- แก้ไขเงื่อนไข! --- */}
              {/* แอดมินสามารถเห็นปุ่มได้ทั้งหมดเพื่อทดสอบ */}
              {(userRole === 'client' || isAdmin) && <Link to="/post-job" className="navbar-button post-job">ประกาศงาน</Link>}
              {(userRole === 'freelancer' || isAdmin) && <Link to="/post-service" className="navbar-button post-service">สร้างบริการ</Link>}
              
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
          ) : !currentUser && !loading ? (
            <>
              <Link to="/login" className="navbar-button login">เข้าสู่ระบบ</Link>
              <Link to="/register" className="navbar-button register">สมัครสมาชิก</Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;