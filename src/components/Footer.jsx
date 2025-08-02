// frontend/src/components/Footer.jsx (เวอร์ชันแก้ไข Path รูป)

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '/NexTUp.png'; // <-- 1. Import รูปเข้ามาเป็นตัวแปร

function Footer() {
  const currentYear = new Date().getFullYear();

   return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-column about-section">
          <div className="footer-logo">
            {/* --- 2. ใช้ตัวแปร logo ที่ import มา --- */}
            <img src={logo} alt="NextUp Logo" />
            <span>NextUp</span>
          </div>
          <p>
            แพลตฟอร์ม "NextUp" ที่รวบรวมบริการและความสามารถพิเศษ
            จากนักเรียนนักศึกษาทั่วประเทศ
          </p>
        </div>
        
        <div className="footer-column links-section">
          <h4>ลิงก์ด่วน</h4>
          <ul>
            <li><Link to="/">หน้าแรก</Link></li>
            <li><Link to="/how-to-use">วิธีการใช้งาน</Link></li> 
            <li><Link to="/faq">คำถามที่พบบ่อย</Link></li>
            <li><Link to="/contact">ติดต่อเรา</Link></li>
          </ul>
        </div>

        <div className="footer-column links-section">
          <h4>ข้อมูล</h4>
          <ul>
            <li><Link to="/terms">ข้อตกลงการใช้งาน</Link></li>
            <li><Link to="/privacy">นโยบายความเป็นส่วนตัว</Link></li>
          </ul>
        </div>

        <div className="footer-column social-section">
          <h4>ติดตามเรา</h4>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} NextUp. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;