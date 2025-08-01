

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        {/* --- นี่คือส่วนที่แก้ไข --- */}
        <div className="footer-column about-section">
          <div className="footer-logo">
            <img src="/NextUp.png" alt="Logo" />
            <span>NextUp</span>
          </div>
          <p>
            แพลตฟอร์ม "เพื่อนช่วยเพื่อน" ที่รวบรวมบริการและความสามารถพิเศษ
            จากนักเรียนนักศึกษาทั่วประเทศ
          </p>
        </div>
        {/* ------------------------- */}

        <div className="footer-column links-section">
          <h4>ลิงก์ด่วน</h4>
          <ul>
            <li><Link to="/">หน้าแรก</Link></li>
            <li><Link to="/how-to-use">วิธีการใช้งาน</Link></li> 
            <li><Link to="/faq">คำถามที่พบบ่อย (FAQ)</Link></li>
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
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
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