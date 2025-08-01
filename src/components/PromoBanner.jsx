

import React from 'react';
import { Link } from 'react-router-dom';
import './PromoBanner.css'; 

function PromoBanner() {
  return (
    <div className="promo-banner">
      <div className="promo-overlay"></div>
      <div className="promo-content">
        <h1 className="promo-title">ค้นพบความสามารถ<br />ปลดล็อกโอกาสใหม่ๆ</h1>
        <p className="promo-subtitle">
          แพลตฟอร์มสำหรับนักเรียนนักศึกษาในการเปลี่ยนทักษะและความสามารถพิเศษให้กลายเป็นรายได้
        </p>
        <div className="promo-actions">
          <Link to="/find-jobs" className="promo-button primary">ค้นหางานที่น่าสนใจ</Link>
          <Link to="/how-to-use" className="promo-button secondary">ดูวิธีการใช้งาน</Link>
        </div>
      </div>
    </div>
  );
}

export default PromoBanner;