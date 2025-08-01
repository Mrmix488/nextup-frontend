// frontend/src/pages/CategoryPage.jsx (วางทับทั้งหมด)

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const subCategoryImages = {
  "คณิตศาสตร์": "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&q=80",
  "ภาษาอังกฤษ": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500&q=80",
  "กราฟิกดีไซน์": "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=80",
  "วาดการ์ตูน": "https://artprojectsforkids.org/wp-content/uploads/2024/07/How-to-draw-a-Minion.jpg",
  "3D Model": "https://img.freepik.com/premium-photo/3d-illustration-cartoon-character-artist-working-his-studio_1057-139643.jpg",
  "ดนตรี": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80",
  "ภาษาญี่ปุ่น": "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=500&q=80",
  "พัฒนาเว็บไซต์": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80",
};
const fallbackImage = 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&q=80';


function CategoryPage() {
  const { categoryName } = useParams();
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- แก้ไขตรงนี้ ---
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/services?category=${encodeURIComponent(categoryName)}`;
    
    setLoading(true);
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const uniqueSubCats = [...new Set(data.map(s => s.subcategory).filter(Boolean))];
        setSubCategories(uniqueSubCats);
        setLoading(false);
      });
  }, [categoryName]);

  if (loading) return <div className="container"><p>กำลังโหลดข้อมูล...</p></div>;

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">หน้าแรก</Link> / 
        <span>{categoryName}</span>
      </div>
      <h1>เลือกประเภทในหมวด "{categoryName}"</h1>
      
      {subCategories.length > 0 ? (
        <div className="subcategory-showcase-grid">
          {subCategories.map(subCat => (
            <Link 
              to={`/category/${encodeURIComponent(categoryName)}/${encodeURIComponent(subCat)}`} 
              key={subCat} 
              className="subcategory-showcase-card with-image"
            >
              <img 
                src={subCategoryImages[subCat] || fallbackImage} 
                alt={subCat} 
                className="card-bg-image" 
              />
              <div className="card-overlay"></div>
              <h3>{subCat}</h3>
            </Link>
          ))}
        </div>
      ) : (
        <p>ยังไม่มีหมวดหมู่ย่อยในหมวดนี้</p>
      )}
    </div>
  );
}

export default CategoryPage;