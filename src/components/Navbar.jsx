// frontend/src/components/Navbar.jsx (เวอร์ชันแก้ไข Path รูป)

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './Navbar.css';
import logo from '/NextUp.png'; // <-- 1. Import รูปเข้ามาเป็นตัวแปร

const ADMIN_UID = "fYtDKu8UZhVTGAjRDyyb79NJwlf2"; // <-- อย่าลืมใส่ UID แอดมินของน้อง

function Navbar({ currentUser }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserData(null); setLoading(true);
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) setUserData(docSnap.data());
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth); navigate('/');
    } catch (error) { console.error("Error signing out: ", error); }
  };

  const userRole = userData?.role;
  const isAdmin = currentUser && currentUser.uid === ADMIN_UID;

   return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          {/* --- 2. ใช้ตัวแปร logo ที่ import มา --- */}
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
  );
}
export default Navbar;