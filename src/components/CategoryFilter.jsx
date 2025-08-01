// frontend/src/components/CategoryFilter.jsx (วางทับทั้งหมด)

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CategoryFilter.css';

function CategoryFilter() {
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  // ดึงข้อมูล Category ที่ไม่ซ้ำกันจาก Backend
  useEffect(() => {
    fetch('http://localhost:5000/api/categories') // สมมติว่ามี API นี้ (ต้องไปสร้างที่ backend)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Could not fetch categories", err));
  }, []);

  // หา category ที่ active อยู่จาก URL
  const pathParts = location.pathname.split('/');
  const currentCategory = pathParts[1] === 'category' ? decodeURIComponent(pathParts[2]) : null;

  return (
    <nav className="category-filter">
      <div className="category-container">
        
        {/* ปุ่ม "ทั้งหมด" จะพาไปหน้าแรก */}
        <Link to="/" className={!currentCategory ? 'active' : ''}>
          ทั้งหมด
        </Link>

        {categories.map(category => (
          // เปลี่ยน Link ให้เป็นรูปแบบใหม่
          <Link
            key={category}
            to={`/category/${encodeURIComponent(category)}`} // <-- ส่วนที่แก้ไข
            className={currentCategory === category ? 'active' : ''}
          >
            {category}
          </Link>
        ))}

      </div>
    </nav>
  );
}

export default CategoryFilter;