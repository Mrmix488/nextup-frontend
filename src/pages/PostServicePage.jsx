// frontend/src/pages/PostServicePage.jsx (เวอร์ชันสมบูรณ์ล่าสุด)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

function PostServicePage() {
  const [serviceDetails, setServiceDetails] = useState({
    title: '',
    description: '',
    category: 'ติวหนังสือ',
    subcategory: '',
    price: '',
    priceUnit: 'บาท/ชม.',
    coverImage: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  // ดึงข้อมูล User Profile มาเก็บไว้ก่อน เพื่อใช้ authorName, authorPhotoURL
  useEffect(() => {
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      getDoc(userRef).then(docSnap => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePostService = async (e) => {
    e.preventDefault();
    if (!serviceDetails.title || !serviceDetails.description || !serviceDetails.price) {
      setError("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ชื่อ, รายละเอียด, ราคา)");
      return;
    }
    setError('');
    setLoading(true);

    try {
      const servicesCollectionRef = collection(db, 'services');
      
      await addDoc(servicesCollectionRef, {
        ...serviceDetails,
        price: parseFloat(serviceDetails.price),
        authorId: currentUser.uid,
        authorName: userData?.displayName || currentUser.email.split('@')[0],
        authorPhotoURL: userData?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${userData?.displayName || currentUser.email}`,
        createdAt: serverTimestamp(),
        rating: 0,
        reviewCount: 0,
        status: 'pending'
      });

      alert("ส่งบริการของคุณเรียบร้อยแล้ว! ทีมงานจะทำการตรวจสอบและอนุมัติภายใน 24 ชั่วโมง");
      navigate('/dashboard'); 
    } catch (err) {
      console.error("Error posting service:", err);
      setError("เกิดข้อผิดพลาดในการโพสต์บริการ: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const categories = ["ติวหนังสือ", "ออกแบบ", "ศิลปะ", "คอมพิวเตอร์", "ภาษา", "เล่นเกม/บันเทิง"];
  const priceUnits = ["บาท/ชม.", "บาท/โปรเจกต์", "บาท/คลาส", "บาท/รูป"];

  // ป้องกันไม่ให้เข้าหน้านี้ ถ้ายังโหลดข้อมูล user ไม่เสร็จ
  if (!currentUser || !userData) {
    return <div className="container"><p>กำลังโหลดข้อมูลผู้ใช้...</p></div>;
  }

  // ป้องกันไม่ให้ Client เข้ามาหน้านี้
  if (userData.role !== 'freelancer') {
    return <div className="container"><p>ขออภัย เฉพาะฟรีแลนซ์เท่านั้นที่สามารถสร้างบริการได้</p></div>;
  }

  return (
    <div className="container">
      <div className="static-page-container">
        <h1>สร้างบริการใหม่ของคุณ</h1>
        <p>แสดงความสามารถของคุณให้ทุกคนได้เห็น และเริ่มรับงานได้เลย!</p>
        <hr className="section-divider" />
        <form onSubmit={handlePostService}>
          <div className="form-group">
            <label htmlFor="title">ชื่อบริการ</label>
            <input type="text" name="title" value={serviceDetails.title} onChange={handleChange} placeholder="เช่น, รับสอนวาดการ์ตูนสไตล์มังงะ" required />
          </div>
          <div className="form-group">
            <label htmlFor="description">รายละเอียดบริการ</label>
            <textarea name="description" rows="6" value={serviceDetails.description} onChange={handleChange} placeholder="อธิบายรายละเอียดบริการของคุณ..." required></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="category">หมวดหมู่หลัก</label>
            <select name="category" value={serviceDetails.category} onChange={handleChange}>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="subcategory">หมวดหมู่ย่อย / ความเชี่ยวชาญ</label>
            <input type="text" name="subcategory" value={serviceDetails.subcategory} onChange={handleChange} placeholder="เช่น, คณิตศาสตร์, Photoshop, วาดภาพสีน้ำ" required />
          </div>
          <div className="form-group price-group">
            <div>
              <label htmlFor="price">ราคา</label>
              <input type="number" name="price" value={serviceDetails.price} onChange={handleChange} placeholder="เช่น, 300" required />
            </div>
            <div>
              <label htmlFor="priceUnit">หน่วย</label>
              <select name="priceUnit" value={serviceDetails.priceUnit} onChange={handleChange}>
                {priceUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="coverImage">ลิงก์รูปภาพหน้าปก (URL)</label>
            <p className="input-hint">แนะนำ: หาจากเว็บ unsplash.com แล้ว Copy Image Address</p>
            <input type="url" name="coverImage" value={serviceDetails.coverImage} onChange={handleChange} placeholder="https://images.unsplash.com/..." required />
          </div>

          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'กำลังสร้าง...' : 'สร้างบริการ'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostServicePage;