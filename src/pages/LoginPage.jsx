// frontend/src/pages/LoginPage.jsx (เวอร์ชัน Remember Me)

import React, { useState } from 'react';
// --- 1. Import เครื่องมือใหม่เข้ามา ---
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // --- 2. ตั้งค่าให้ Firebase "จำ" สถานะการล็อกอินไว้ในเครื่องนี้ ---
      await setPersistence(auth, browserLocalPersistence);
      
      // --- 3. ทำการล็อกอินตามปกติ ---
      await signInWithEmailAndPassword(auth, email, password);
      
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/invalid-credential') {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else {
        setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-page">
      <div className="auth-form-container">
        <h1>เข้าสู่ระบบ</h1>
        <form onSubmit={handleLogin}>
          {/* ...ฟอร์มเหมือนเดิม... */}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        <p className="auth-switch">
          ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิกที่นี่</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;