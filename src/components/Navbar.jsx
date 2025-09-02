// frontend/src/components/Navbar.jsx (เวอร์ชัน Debug)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import logo from '/FFS.png';

const ADMIN_UID = "QiP4ghf9ktT79LOH0FUy6lDCchk1"; // <-- แก้ไข UID ของน้อง

function Navbar() {
  const navigate = useNavigate();
  const { currentUser, userData, loading } = useAuth(); 

  const handleLogout = async (e) => { /* ...เหมือนเดิม... */ };

  const userRole = userData?.role;
  const isAdmin = currentUser && currentUser.uid === ADMIN_UID && userRole === 'admin';

  // --- ส่วน Debug ที่จะแสดงผลบนหน้าจอ ---
  const DebugInfo = () => (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      zIndex: 9999,
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <h4 style={{margin: '0 0 5px 0'}}>DEBUG INFO</h4>
      <div><strong>Loading:</strong> {loading.toString()}</div>
      <div><strong>currentUser UID:</strong> {currentUser ? currentUser.uid : 'null'}</div>
      <div><strong>userData Role:</strong> {userData ? userData.role : 'null'}</div>
      <div><strong>ADMIN_UID:</strong> {ADMIN_UID}</div>
      <hr style={{borderColor: 'rgba(255,255,255,0.2)'}}/>
      <div><strong>isAdmin Check:</strong> {isAdmin.toString()}</div>
    </div>
  );
  // --- จบส่วน Debug ---

  return (
    <>
      {/* --- แสดงแถบ Debug บนหน้าจอ! --- */}
      <DebugInfo />

      <nav className="navbar">
        {/* ... โค้ด Navbar เดิมทั้งหมด ... */}
        {/* ... พี่จะใส่โค้ด JSX ทั้งหมดของ Navbar ไว้ข้างล่างนี้อีกที ... */}
      </nav>
    </>
  );
}

// โค้ด JSX เต็มๆ ของ Navbar
Navbar.prototype.render = function() {
  const { navigate, currentUser, userData, loading } = this.props;
  const userRole = userData?.role;
  const isAdmin = currentUser && currentUser.uid === ADMIN_UID && userRole === 'admin';
  const handleLogout = this.handleLogout;

  return (
    <>
      <this.DebugInfo />
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
            {isAdmin && (
              <Link to="/admin" className="navbar-link admin-link">แผงควบคุมแอดมิน</Link>
            )}
          </div>
          <div className="navbar-menu">
            {currentUser ? (
              loading ? (<p>...</p>) : (
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
                      <Link to={`/profile/${currentUser.uid}`}>โปรไฟล์ของฉัน</Link>
                      <Link to="/my-jobs">งานของฉัน</Link>
                      <Link to="/inbox">กล่องข้อความ</Link>
                      <a href="#" onClick={handleLogout} className="logout-link">ออกจากระบบ</a>
                    </div>
                  </div>
                </div>
              )
            ) : (
              !loading && (
                <>
                  <Link to="/login" className="navbar-button login">เข้าสู่ระบบ</Link>
                  <Link to="/register" className="navbar-button register">สมัครสมาชิก</Link>
                </>
              )
            )}
          </div>
        </div>
      </nav>
    </>
  );
};