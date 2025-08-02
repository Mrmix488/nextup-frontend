// frontend/src/pages/HomePage.jsx (เวอร์ชันแก้ไข Import ที่ผิดพลาด)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PromoBanner from '../components/PromoBanner';


const categoryImages = {
  "ติวหนังสือ": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&q=80",
  "ออกแบบ": "https://images.unsplash.com/photo-1615387000571-bdcfe92eb67c?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "ศิลปะ": "https://i.ytimg.com/vi/kRS05R2pwXk/hq720.jpg?rs=AOn4CLAX0k90xoFhB6UJKIwDkge7_AR4ww&sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD",
  "คอมพิวเตอร์": "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&q=80",
  "ภาษา": "https://mpics.mgronline.com/pics/Images/563000006554702.JPEG",
  "เล่นเกม/บันเทิง": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80",
};
const fallbackImage = 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&q=80';

function HomePage() {
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


  if (loading) return <div className="container"><p>กำลังโหลดหมวดหมู่...</p></div>;

  return (
    <>
      <PromoBanner />
      <div className="container">
        <div className="homepage-showcase">
          <h2>ค้นหาบริการที่คุณต้องการ</h2>
          <div className="category-showcase-grid">
            {categories.map(cat => (
              <Link to={`/category/${encodeURIComponent(cat)}`} key={cat} className="category-showcase-card with-image">
                <img 
                  src={categoryImages[cat] || fallbackImage} 
                  alt={cat} 
                  className="card-bg-image" 
                />
                <div className="card-overlay"></div>
                <h3>{cat}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;