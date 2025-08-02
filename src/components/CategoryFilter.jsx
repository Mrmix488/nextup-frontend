// frontend/src/components/CategoryFilter.jsx (วางทับทั้งหมด)

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CategoryFilter.css';

function CategoryFilter() {
   const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- นี่คือบรรทัดที่แก้ไขให้ถูกต้อง 100% ---
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/categories`;
    console.log("Fetching categories from:", apiUrl); // เพิ่ม console.log เพื่อตรวจสอบ

    fetch(apiUrl)
      .then(res => {
        if (!res.ok) { 
          // ถ้า Server ตอบกลับมาไม่สำเร็จ (เช่น 404, 500)
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Could not fetch categories:", err);
        setLoading(false);
      });
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