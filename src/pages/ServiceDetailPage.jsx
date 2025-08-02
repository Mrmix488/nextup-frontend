// frontend/src/pages/ServiceDetailPage.jsx (วางทับทั้งหมด)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';

function ServiceDetailPage() {
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

  const handleStartChat = async () => {
    // ... (โค้ดส่วนนี้จะเหมือนกับใน JobDetailPage ซึ่งตอนนี้ยังไม่มี)
    // เราสามารถยกโค้ดจาก JobDetailPage มาปรับใช้ได้ในอนาคต
    alert("ฟังก์ชันเริ่มแชทจากหน้านี้กำลังอยู่ในระหว่างการพัฒนา");
  };

  if (loading) return <div className="container"><p>กำลังโหลด...</p></div>;
  if (!service) return <div className="container"><p>ไม่พบบริการนี้</p></div>;

  return (
    <div className="container detail-page">
      <img src={service.coverImage} alt={service.title} className="detail-image" />
      <h1>{service.title}</h1>
      {/* ... โค้ด JSX อื่นๆ สำหรับแสดงรายละเอียดบริการ ... */}
      <p>โดย: {service.authorName}</p>
      <button onClick={handleStartChat} className="chat-button">สนใจบริการนี้และเริ่มแชท</button>
    </div>
  );
}

export default ServiceDetailPage;