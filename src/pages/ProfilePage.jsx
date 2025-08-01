

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import ReviewCard from '../components/ReviewCard';
import ServiceCardMini from '../components/ServiceCardMini';
import './ProfilePage.css';

function ProfilePage() {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchAllData = async () => {
      
      if (!userId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        const profileRef = doc(db, "users", userId);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const data = profileSnap.data();
          setProfileData(data);

          
          if (data.role === 'freelancer') {
            
            const reviewsRef = collection(db, "users", userId, "reviews");
            const qReviews = query(reviewsRef, orderBy("createdAt", "desc"));
            const reviewsSnap = await getDocs(qReviews);
            setReviews(reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            
            const servicesRef = collection(db, "services");
            const qServices = query(
              servicesRef, 
              where("authorId", "==", userId), 
              where("status", "==", "approved")
            );
            const servicesSnap = await getDocs(qServices);
            setServices(servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          }
        } else {
          console.log("No such profile document!");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchAllData();
  }, [userId]);

  

  if (loading) {
    return <div className="container"><p>กำลังโหลดโปรไฟล์...</p></div>;
  }
  
  if (!profileData) {
    return <div className="container"><p>ไม่พบโปรไฟล์ผู้ใช้งาน</p></div>;
  }

  const isOwnProfile = currentUser && currentUser.uid === userId;

  return (
    <div className="container">
      <div className="profile-container">
        
        {/* --- ส่วน Header ของโปรไฟล์ --- */}
        <div className="profile-header">
          <img src={profileData.photoURL} alt="avatar" className="profile-avatar-large" />
          <h1>{profileData.displayName}</h1>
          <p className="profile-role">{profileData.role === 'freelancer' ? 'ฟรีแลนซ์' : profileData.role === 'admin' ? 'แอดมิน' : 'ผู้ว่าจ้าง'}</p>
          {isOwnProfile && <Link to="/profile/edit" className="edit-profile-btn">แก้ไขโปรไฟล์</Link>}
        </div>

        {/* --- ส่วนนี้จะแสดงก็ต่อเมื่อเป็นฟรีแลนซ์เท่านั้น --- */}
        {profileData.role === 'freelancer' && (
          <div className="profile-freelancer-details">
            
            {/* ส่วนแสดงบริการ */}
            <div className="profile-section">
              <h2>บริการของ {profileData.displayName}</h2>
              {services.length > 0 ? (
                <div className="services-grid">
                  {services.map(service => <ServiceCardMini key={service.id} service={service} />)}
                </div>
              ) : (
                <p>ยังไม่มีบริการที่เปิดให้บริการในขณะนี้</p>
              )}
            </div>
            
            {/* ส่วน Bio */}
            <div className="profile-section">
              <h2>เกี่ยวกับฉัน</h2>
              <p>{profileData.bio || 'ยังไม่มีข้อมูลแนะนำตัว'}</p>
            </div>
            
            {/* ส่วน Skills */}
            <div className="profile-section">
              <h2>ทักษะ (Skills)</h2>
              <div className="skills-container">
                {profileData.skills?.length > 0 
                  ? profileData.skills.map(skill => <span key={skill} className="skill-tag">{skill}</span>)
                  : <p>ยังไม่มีการระบุทักษะ</p>
                }
              </div>
            </div>
            
            {/* ส่วน Reviews */}
            <div className="profile-section">
              <div className="review-section-header">
                <h2>รีวิว ({profileData.reviewCount || 0})</h2>
              </div>
              <div className="reviews-list">
                {reviews.length > 0 
                  ? reviews.map(review => <ReviewCard key={review.id} review={review} />)
                  : <p>ยังไม่มีรีวิว</p>
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;