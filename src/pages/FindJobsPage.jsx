

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import JobCard from '../components/JobCard'; 

function FindJobsPage() {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  
  useEffect(() => {
    setLoading(true); 
    const jobsRef = collection(db, "jobs");
    const q = query(
      jobsRef, 
      where("status", "==", "open"), 
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllJobs(jobsData);
        setLoading(false); 
      },
      (error) => {
        console.error("Error fetching jobs:", error);
        setLoading(false); 
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredJobs = useMemo(() => {
    if (!searchTerm) {
      return allJobs;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return allJobs.filter(job => {
      const titleMatch = job.title.toLowerCase().includes(lowercasedTerm);
      const descriptionMatch = job.description.toLowerCase().includes(lowercasedTerm);
      return titleMatch || descriptionMatch;
    });
  }, [allJobs, searchTerm]);


  return (
    <>
      <div className="search-hero">
        <div className="container">
          <h1>ค้นหางานที่ใช่สำหรับคุณ</h1>
          <p>จากโปรเจกต์ทั้งหมดที่กำลังมองหาฟรีแลนซ์ฝีมือดี</p>
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="text" 
              className="search-input"
              placeholder="ลองค้นหา 'ออกแบบโลโก้', 'ติวคณิต'..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
      </div>
      
      <div className="container">
        <div className="job-list-container">
          <h2>
            {searchTerm ? `ผลการค้นหาสำหรับ "${searchTerm}"` : 'ประกาศล่าสุด'}
          </h2>
          {/* --- นี่คือส่วนที่แก้ไข! --- */}
          {loading ? (
            <p>กำลังโหลดรายการงาน...</p>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map(job => <JobCard key={job.id} job={job} />)
          ) : (
            <p>ไม่พบงานที่ตรงกับคำค้นหาของคุณ</p>
          )}
        </div>
      </div>
    </>
  );
}

export default FindJobsPage;