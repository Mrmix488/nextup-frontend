// frontend/src/pages/ServiceDetailPage.jsx (วางทับทั้งหมด)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';

function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // --- แก้ไขตรงนี้ ---
    fetch(`${import.meta.env.VITE_API_URL}/api/services/${id}`)
      .then(res => res.json())
      .then(data => {
        setService(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching service details:", err);
        setLoading(false);
      });
  }, [id]);

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