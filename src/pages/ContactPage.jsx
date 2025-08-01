

import React from 'react';

function ContactPage() {
  return (
    <div className="container">
      <div className="static-page-container">
        <h1>ติดต่อเรา</h1>
        <p>
          เรายินดีรับฟังทุกความคิดเห็น ข้อเสนอแนะ หรือปัญหาการใช้งาน
          เพื่อนำไปพัฒนาแพลตฟอร์ม "เพื่อนช่วยเพื่อน" ของเราให้ดียิ่งขึ้น
        </p>

        <h2>ช่องทางการติดต่อ</h2>

        <h3><i className="fas fa-envelope" style={{ marginRight: '1rem', color: '#3b82f6' }}></i>อีเมล</h3>
        <p>
          สำหรับเรื่องทั่วไป, ข้อเสนอแนะ, หรือปัญหาการใช้งาน: <br />
          <a href="mailto:contact@peertopeer.com" style={{ fontWeight: 'bold' }}>contact@peertopeer.com</a>
        </p>
        <p>
          สำหรับเรื่องธุรกิจ, การเป็นพาร์ทเนอร์: <br />
          <a href="mailto:business@peertopeer.com" style={{ fontWeight: 'bold' }}>business@peertopeer.com</a>
        </p>

        <h3><i className="fas fa-share-alt" style={{ marginRight: '1rem', color: '#3b82f6' }}></i>โซเชียลมีเดีย</h3>
        <p>
          ติดตามข่าวสารและกิจกรรมต่างๆ ของเราได้ที่:
        </p>
        {/* ใช้ Style เหมือนใน Footer ได้เลย */}
        <div className="social-icons-contact">
          <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer">Facebook</a>
          <span style={{ margin: '0 1rem' }}>|</span>
          <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
          <span style={{ margin: '0 1rem' }}>|</span>
          <a href="#" aria-label="Twitter" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>
        
      </div>
    </div>
  );
}

export default ContactPage;