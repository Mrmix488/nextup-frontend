// frontend/src/components/Navbar.jsx (วางทับทั้งหมด)
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import logo from '/FFS.png';

function Navbar() {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) { console.error("Error signing out: ", error); }
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
          {(!currentUser || userRole === 'freelancer' || isAdmin) && (
            <Link to="/find-jobs" className="navbar-link">ค้นหางาน</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="navbar-link admin-link">แผงควบคุมแอดมิน</Link>
          )}
        </div>
        <div className="navbar-menu">
          {currentUser ? (
            <div className="profile-menu">
              {userRole === 'client' && <Link to="/post-job" className="navbar-button post-job">ประกาศงาน</Link>}
              {userRole === 'freelancer' && <Link to="/post-service" className="navbar-button post-service">สร้างบริการ</Link>}
              <div className="profile-menu-separator"></div>
              <div className="dropdown">
                <div className="profile-menu-trigger">
                  <img src={userData?.photoURL || `...`} alt="avatar" className="profile-avatar"/>
                  <span>{userData?.displayName || '...'}</span>
                </div>
                <div className="dropdown-content">
                  <Link to={`/profile/${currentUser.uid}`}>โปรไฟล์</Link>
                  <Link to="/dashboard">แดชบอร์ด</Link>
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