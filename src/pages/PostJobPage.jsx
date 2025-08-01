

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function PostJobPage() {
  const [jobDetails, setJobDetails] = useState({
    title: '',
    description: '',
    category: 'ติวหนังสือ', 
    budget: '',
    deadline: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!jobDetails.title || !jobDetails.description || !jobDetails.budget) {
      setError("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (หัวข้องาน, รายละเอียด, งบประมาณ)");
      return;
    }
    setError('');
    setLoading(true);

    try {
      const jobsCollectionRef = collection(db, 'jobs');
      await addDoc(jobsCollectionRef, {
        ...jobDetails,
        budget: parseFloat(jobDetails.budget), 
        clientId: currentUser.uid,
        clientName: currentUser.displayName || currentUser.email.split('@')[0],
        createdAt: serverTimestamp(),
        status: 'open' 
      });

      
      navigate('/find-jobs'); 
    } catch (err) {
      console.error("Error posting job:", err);
      setError("เกิดข้อผิดพลาดในการโพสต์งาน");
    } finally {
      setLoading(false);
    }
  };
  
  
  const categories = ["ติวหนังสือ", "ออกแบบ", "ศิลปะ", "คอมพิวเตอร์", "ภาษา", "เล่นเกม/บันเทิง"];

  return (
    <div className="container">
      <div className="static-page-container">
        <h1>ประกาศหางาน</h1>
        <p>บอกความต้องการของคุณ แล้วรอฟรีแลนซ์ฝีมือดีมายื่นข้อเสนอ</p>
        <hr className="section-divider" />
        <form onSubmit={handlePostJob}>
          <div className="form-group">
            <label htmlFor="title">ชื่องาน / หัวข้องาน</label>
            <input type="text" name="title" value={jobDetails.title} onChange={handleChange} placeholder="เช่น, ต้องการคนติวคณิตศาสตร์ ม.5" />
          </div>
          <div className="form-group">
            <label htmlFor="description">รายละเอียดงาน</label>
            <textarea name="description" rows="6" value={jobDetails.description} onChange={handleChange} placeholder="อธิบายรายละเอียดของงานที่ต้องการ..."></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="category">หมวดหมู่งาน</label>
            <select name="category" value={jobDetails.category} onChange={handleChange}>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="budget">งบประมาณ (บาท)</label>
            <input type="number" name="budget" value={jobDetails.budget} onChange={handleChange} placeholder="เช่น, 1000" />
          </div>
          <div className="form-group">
            <label htmlFor="deadline">ต้องการงานเสร็จภายในวันที่ (ไม่บังคับ)</label>
            <input type="date" name="deadline" value={jobDetails.deadline} onChange={handleChange} />
          </div>

          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'กำลังโพสต์...' : 'โพสต์ประกาศงาน'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJobPage;