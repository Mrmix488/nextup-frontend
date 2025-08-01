// frontend/src/pages/FindJobsPage.jsx (วางทับทั้งหมด)
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
    if (!searchTerm) return allJobs;
    const lowercasedTerm = searchTerm.toLowerCase();
    return allJobs.filter(job => 
      job.title.toLowerCase().includes(lowercasedTerm) || 
      job.description.toLowerCase().includes(lowercasedTerm)
    );
  }, [allJobs, searchTerm]);

  return (
    <>
      <div className="search-hero">
        <div className="container">
          <h1>ค้นหางานที่ใช่สำหรับคุณ</h1>
          <p> ... </p>
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="text" 
              className="search-input"
              placeholder="ลองค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
      </div>
      <div className="container">
        <div className="job-list-container">
          <h2>{searchTerm ? `ผลการค้นหา...` : 'ประกาศล่าสุด'}</h2>
          {loading ? (
            <p>กำลังโหลด...</p>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map(job => <JobCard key={job.id} job={job} />)
          ) : (
            <p>ไม่พบงานที่ตรงกับคำค้นหา</p>
          )}
        </div>
      </div>
    </>
  );
}
export default FindJobsPage;