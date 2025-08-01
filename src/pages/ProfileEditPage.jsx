

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import { db, auth } from '../firebase';

function ProfileEditPage() {
  const [profile, setProfile] = useState({ displayName: '', bio: '', skills: [] });
  const [imageFile, setImageFile] = useState(null); 
  const [imageUrl, setImageUrl] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const docRef = doc(db, 'users', currentUser.uid);
      getDoc(docRef).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            displayName: data.displayName || '',
            bio: data.bio || '',
            skills: data.skills || []
          });
          setImageUrl(data.photoURL || ''); 
        }
        setLoading(false);
      });
    }
  }, [currentUser]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0])); 
    }
  };
  
  const handleChange = (e) => { /* ...เหมือนเดิม... */ };
  const handleSkillsChange = (e) => { /* ...เหมือนเดิม... */ };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    let newPhotoURL = profile.photoURL; 

    try {
      
      if (imageFile) {
        const storage = getStorage();
        
        const storageRef = ref(storage, `profile-images/${currentUser.uid}/${imageFile.name}`);
        
        
        const snapshot = await uploadBytes(storageRef, imageFile);
        
        newPhotoURL = await getDownloadURL(snapshot.ref);
      }

      
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        displayName: profile.displayName,
        bio: profile.bio,
        skills: profile.skills.filter(skill => skill !== ""),
        photoURL: newPhotoURL 
      });
      
      navigate(`/profile/${currentUser.uid}`);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container"><p>กำลังโหลด...</p></div>;
  if (!currentUser) return <div className="container"><p>กรุณาเข้าสู่ระบบ</p></div>;

  return (
    <div className="container">
      <div className="static-page-container">
        <h1>แก้ไขโปรไฟล์</h1>
        <form onSubmit={handleSave}>
          {/* --- 5. ฟอร์มอัปโหลดรูป --- */}
          <div className="form-group">
            <label>รูปโปรไฟล์</label>
            <div className="image-uploader">
              <img src={imageUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${profile.displayName}`} alt="Profile Preview" className="profile-preview" />
              <input type="file" onChange={handleImageChange} accept="image/*" />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="displayName">ชื่อที่แสดง</label>
            <input type="text" name="displayName" value={profile.displayName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="bio">เกี่ยวกับฉัน (Bio)</label>
            <textarea name="bio" rows="4" value={profile.bio} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="skills">ทักษะ (คั่นด้วย ,)</label>
            <input type="text" name="skills" value={profile.skills.join(', ')} onChange={handleSkillsChange} />
          </div>

          <button type="submit" className="auth-button" disabled={saving}>
            {saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileEditPage;