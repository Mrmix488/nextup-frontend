

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('client'); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: role, 
        photoURL: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
        createdAt: serverTimestamp(),
        ...(role === 'freelancer' && {
          bio: "",
          skills: [],
          rating: 0,
          reviewCount: 0
        })
      });

      navigate('/');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('อีเมลนี้ถูกใช้งานแล้ว');
      } else {
        setError('เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }
    }
  };

  return (
    <div className="container auth-page">
      <div className="auth-form-container">
        <h1>สร้างบัญชีใหม่</h1>
        <form onSubmit={handleRegister}>
          {/* ...ฟอร์มเหมือนเดิมทุกอย่าง... */}
          <div className="form-group">
            <label htmlFor="displayName">ชื่อที่แสดง</label>
            <input type="text" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">อีเมล</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength="6" />
          </div>
          <div className="form-group">
            <label>คุณต้องการสมัครในฐานะ:</label>
            <div className="role-selector">
              <label><input type="radio" value="client" checked={role === 'client'} onChange={(e) => setRole(e.target.value)} /> ผู้ว่าจ้าง</label>
              <label><input type="radio" value="freelancer" checked={role === 'freelancer'} onChange={(e) => setRole(e.target.value)} /> ฟรีแลนซ์</label>
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button">สมัครสมาชิก</button>
        </form>
        <p className="auth-switch">
          มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบที่นี่</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;