
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import JobCard from '../components/JobCard'; 

function MyJobsPage() {
  
  const [userRole, setUserRole] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => { /* ... */ }, [auth.currentUser]);

  if (loading) return <div className="container"> ... </div>;
  
  return (
    <div className="container">
      <h1>งานของฉัน</h1>
      <div className="job-list-container">
        {jobs.length > 0 ? (
          jobs.map(job => <JobCard key={job.id} job={job} />) 
        ) : ( <p>ยังไม่มีรายการงาน</p> )}
      </div>
    </div>
  );
}
export default MyJobsPage;