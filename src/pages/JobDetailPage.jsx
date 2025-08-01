

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { 
  doc, 
  getDoc, 
  onSnapshot, 
  collection, 
  addDoc, 
  serverTimestamp,
  query,
  where,
  getDocs, 
  updateDoc
} from 'firebase/firestore';


function ProposalForm({ job, clientId }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (message.trim() === '') {
      alert("กรุณาเขียนข้อความแนะนำตัวสั้นๆ");
      return;
    }
    setLoading(true);
    try {
      
      const chatRoomsRef = collection(db, "chatRooms");
      const q1 = query(chatRoomsRef, where("users", "==", [currentUser.uid, clientId]));
      const q2 = query(chatRoomsRef, where("users", "==", [clientId, currentUser.uid]));
      
      const querySnapshot1 = await getDocs(q1);
      const querySnapshot2 = await getDocs(q2);

      let existingRoomId = null;
      if (!querySnapshot1.empty) {
        existingRoomId = querySnapshot1.docs[0].id;
      } else if (!querySnapshot2.empty) {
        existingRoomId = querySnapshot2.docs[0].id;
      }

      let roomId = existingRoomId;

      
      if (!roomId) {
        const newRoomRef = await addDoc(chatRoomsRef, {
          users: [currentUser.uid, clientId],
          createdAt: serverTimestamp(),
          timestamp: serverTimestamp(),
          lastMessage: ""
        });
        roomId = newRoomRef.id;
      }

      
      const messagesRef = collection(db, 'chatRooms', roomId, 'messages');
      const firstMessage = `สวัสดีครับ/ค่ะ สนใจงาน "${job.title}"\n\n${message}`;
      await addDoc(messagesRef, {
        text: firstMessage,
        senderId: currentUser.uid,
        timestamp: serverTimestamp(),
        isProposal: true
      });
      
      const roomRef = doc(db, 'chatRooms', roomId);
      await updateDoc(roomRef, {
        lastMessage: "มีการยื่นข้อเสนอใหม่!",
        timestamp: serverTimestamp()
      });

      
      navigate(`/chat/${roomId}`);

    } catch (err) {
      console.error("Error submitting proposal:", err);
      alert("เกิดข้อผิดพลาดในการยื่นข้อเสนอ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmitProposal} className="proposal-form">
      <textarea 
        rows="4"
        placeholder="แนะนำตัวเองสั้นๆ และบอกว่าทำไมคุณถึงเหมาะกับงานนี้..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      ></textarea>
      <button type="submit" className="auth-button" disabled={loading}>
        {loading ? 'กำลังส่ง...' : 'ส่งข้อเสนอและเริ่มแชท'}
      </button>
    </form>
  );
}



function JobDetailPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [clientProfile, setClientProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const jobRef = doc(db, 'jobs', jobId);
    const unsubscribe = onSnapshot(jobRef, async (docSnap) => {
      if (docSnap.exists()) {
        const jobData = { id: docSnap.id, ...docSnap.data() };
        setJob(jobData);
        const clientRef = doc(db, 'users', jobData.clientId);
        const clientSnap = await getDoc(clientRef);
        if (clientSnap.exists()) {
          setClientProfile(clientSnap.data());
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [jobId]);

  const handleUpdateStatus = async (newStatus) => {
    const jobRef = doc(db, 'jobs', jobId);
    await updateDoc(jobRef, { status: newStatus });
  };


  if (loading) return <div className="container"><p>กำลังโหลด...</p></div>;
  if (!job) return <div className="container"><p>ไม่พบงาน</p></div>;

  const isOwner = currentUser && currentUser.uid === job.clientId;
  const isFreelancer = currentUser && !isOwner;

  return (
    <div className="container job-detail-page">
      <div className="job-detail-main">
        <span className="job-card-category">{job.category}</span>
        <h1>{job.title}</h1>
        <p className="job-detail-status">สถานะ: <strong>{job.status}</strong></p>
        
        <div className="job-detail-section">
          <h2>รายละเอียดงาน</h2>
          <p style={{whiteSpace: 'pre-wrap'}}>{job.description}</p>
        </div>

        {/* ส่วนสำหรับ "เจ้าของงาน" (ผู้ว่าจ้าง) */}
        {isOwner && job.status !== 'completed' && (
          <div className="job-detail-section">
            <h2>จัดการงาน</h2>
            <div className="job-management-actions">
              {job.status === 'open' && <p>คุณจะสามารถจัดการข้อเสนอที่ได้รับที่นี่</p>}
              {job.status === 'in-progress' && <button onClick={() => handleUpdateStatus('completed')} className="action-button success">ยืนยันว่างานเสร็จสิ้น</button>}
            </div>
          </div>
        )}

        {/* ส่วนสำหรับ "ฟรีแลนซ์" */}
        {isFreelancer && job.status === 'open' && (
          <div className="job-detail-section">
            <h2>ยื่นข้อเสนอสำหรับงานนี้</h2>
            <ProposalForm job={job} clientId={job.clientId} />
          </div>
        )}
        
      </div>
      <aside className="job-detail-sidebar">
        <div className="sidebar-widget">
          <h3>งบประมาณ</h3>
          <p className="sidebar-budget">฿{job.budget.toLocaleString()}</p>
        </div>
        <div className="sidebar-widget">
          <h3>ผู้ว่าจ้าง</h3>
          {clientProfile ? (
            <Link to={`/profile/${clientProfile.uid}`} className="client-profile-link">
              <img src={clientProfile.photoURL} alt="client avatar" />
              <span>{clientProfile.displayName}</span>
            </Link>
          ) : (<p>กำลังโหลด...</p>)}
        </div>
      </aside>
    </div>
  );
}

export default JobDetailPage;