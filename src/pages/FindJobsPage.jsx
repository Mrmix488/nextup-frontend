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
        setLoading(false); // <-- จุดที่ 1: หยุดโหลดเมื่อได้รับข้อมูล
      },
      (error) => {
        console.error("Error fetching jobs:", error);
        setLoading(false); // <-- จุดที่ 2: หยุดโหลดเสมอแม้จะเกิด Error
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredJobs = useMemo(() => { /* ...เหมือนเดิม... */ }, [allJobs, searchTerm]);

  return (
    <>
      <div className="search-hero">
        {/* ... Hero Section เหมือนเดิม ... */}
      </div>
      
      <div className="container">
        <div className="job-list-container">
          <h2>
            {searchTerm ? `ผลการค้นหาสำหรับ "${searchTerm}"` : 'ประกาศล่าสุด'}
          </h2>
          {/* --- แก้ไขส่วนนี้! --- */}
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