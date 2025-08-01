

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    
    fetch(`http://localhost:5000/api/services/${id}`)
      .then(res => res.json())
      .then(data => {
        setService(data);
        setLoading(false);
      });
  }, [id]);

  
  const handleStartChat = async () => {
    
    if (!currentUser) {
      alert("กรุณาเข้าสู่ระบบก่อนเริ่มการสนทนา");
      navigate('/login');
      return;
    }
    if (!service || !service.authorId) { 
      alert("ขออภัย ไม่พบข้อมูลผู้ให้บริการ");
      return;
    }

    
    
    const otherUserId = "test_user_id_002"; 
    
    
    if (currentUser.uid === otherUserId) {
      alert("คุณไม่สามารถสร้างห้องแชทกับตัวเองได้");
      return;
    }

    
    const chatRoomsRef = collection(db, "chatRooms");
    const q = query(chatRoomsRef, where("users", "array-contains", currentUser.uid));
    const querySnapshot = await getDocs(q);
    
    let existingRoom = null;
    querySnapshot.forEach(doc => {
      const roomData = doc.data();
      if (roomData.users.includes(otherUserId)) {
        existingRoom = { id: doc.id, ...roomData };
      }
    });

    
    if (existingRoom) {
      navigate(`/chat/${existingRoom.id}`);
    } else {
      
      try {
        const newRoomRef = await addDoc(chatRoomsRef, {
          users: [currentUser.uid, otherUserId],
          timestamp: serverTimestamp(),
          lastMessage: "" 
        });
        
        navigate(`/chat/${newRoomRef.id}`);
      } catch (error) {
        console.error("Error creating chat room: ", error);
        alert("เกิดข้อผิดพลาดในการสร้างห้องแชท");
      }
    }
  };


  if (loading) return <div className="container"><p>กำลังโหลด...</p></div>;
  if (!service) return <div className="container"><p>ไม่พบข้อมูลบริการ</p></div>;

  return (
    <div className="container detail-page">
      <img src={service.coverImage} alt={service.title} className="detail-image" />
      <h1>{service.title}</h1>
      <span className="category-tag">{service.category}</span>
      <p className="author">โดย: {service.author}</p>
      <p className="price-detail">{service.price.toLocaleString()} {service.priceUnit}</p>
      <div className="description">
        <h3>รายละเอียด</h3>
        <p>{service.description}</p>
      </div>

      {/* --- ปุ่มใหม่ของเรา! --- */}
      <button onClick={handleStartChat} className="chat-button">แชทเพื่อสอบถาม</button>
    </div>
  );
}

export default ServiceDetailPage;