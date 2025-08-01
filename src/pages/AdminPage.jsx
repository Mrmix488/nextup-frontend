

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function AdminPage() {
  const [pendingServices, setPendingServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const servicesRef = collection(db, 'services');
    const q = query(servicesRef, where("status", "==", "pending"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const services = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPendingServices(services);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  
  const handleApprove = async (serviceId) => {
    try {
      const serviceRef = doc(db, 'services', serviceId);
      await updateDoc(serviceRef, { status: 'approved' });
      alert(`อนุมัติบริการ ID: ${serviceId} เรียบร้อย`);
    } catch (error) {
      console.error("Error approving:", error);
      alert("เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };

  
  const handleReject = async (serviceId) => {
    try {
      if (window.confirm("คุณแน่ใจหรือไม่ว่าจะปฏิเสธบริการนี้?")) {
        const serviceRef = doc(db, 'services', serviceId);
        await updateDoc(serviceRef, { status: 'rejected' });
        alert(`ปฏิเสธบริการ ID: ${serviceId} เรียบร้อย`);
      }
    } catch (error) {
      console.error("Error rejecting:", error);
      alert("เกิดข้อผิดพลาดในการปฏิเสธ");
    }
  };

  return (
    <div className="container">
      <div className="admin-dashboard-container">
        <div className="admin-header">
          <h1>แผงควบคุมแอดมิน</h1>
          <p>จัดการและตรวจสอบข้อมูลต่างๆ ของแพลตฟอร์ม</p>
        </div>
        <div className="admin-section">
          <h2>บริการที่รอการอนุมัติ ({pendingServices.length})</h2>
          {loading ? ( <p>กำลังโหลด...</p> ) : (
            <div className="admin-table-container">
              <table>
                <thead>
                  <tr>
                    <th>ชื่อบริการ</th><th>ผู้สร้าง</th><th>หมวดหมู่</th><th>ราคา</th><th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingServices.length > 0 ? (
                    pendingServices.map(service => (
                      <tr key={service.id}>
                        <td>{service.title}</td>
                        <td><Link to={`/profile/${service.authorId}`} className="admin-user-link">{service.authorName}</Link></td>
                        <td>{service.category}</td>
                        <td>{service.price}</td>
                        <td className="actions">
                          {/* --- เชื่อมปุ่มกับ "สมอง" --- */}
                          <button onClick={() => handleApprove(service.id)} className="approve-btn">อนุมัติ</button>
                          <button onClick={() => handleReject(service.id)} className="reject-btn">ปฏิเสธ</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>ไม่มีบริการรอการอนุมัติ</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default AdminPage;