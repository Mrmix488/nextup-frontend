// frontend/src/pages/InboxPage.jsx (เวอร์ชันแก้ไข Loading)

import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import './InboxPage.css';

function ChatRoomItem({ room }) {
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;
    const otherUserId = room.users.find(uid => uid !== currentUser.uid);

    if (otherUserId) {
      const userRef = doc(db, 'users', otherUserId);
      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setOtherUser(docSnap.data());
        } else {
          // ถ้าไม่เจอโปรไฟล์คู่สนทนา (อาจจะโดนลบ) ก็ให้แสดงเป็น Unknown
          setOtherUser({ displayName: 'Unknown User', photoURL: '' });
        }
        setLoading(false); // <-- จุดที่ 1: โหลดเสร็จเสมอ
      });
      return () => unsubscribe();
    } else {
      setLoading(false); // <-- จุดที่ 2: ถ้าไม่มีคู่สนทนา ก็ต้องหยุดโหลด
    }
  }, [room, currentUser]);

  if (loading) {
    return <div className="chat-list-item-loading">กำลังโหลด...</div>;
  }

  return (
    <Link to={`/chat/${room.id}`} className="chat-list-item">
      <img 
        src={otherUser?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=?`} 
        alt="avatar"
        className="chat-avatar"
      />
      <div className="chat-info">
        <p className="chat-partner-name">{otherUser?.displayName}</p>
        <p className="chat-room-last-message">{room.lastMessage || '...'}</p>
      </div>
    </Link>
  );
}

function InboxPage() {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    // เพิ่มการป้องกัน ถ้าไม่มี currentUser ให้หยุดโหลดทันที
    if (!currentUser) {
      setLoading(false); // <-- จุดที่ 3: หยุดโหลดถ้า user logout ไปแล้ว
      return;
    }

    const chatRoomsRef = collection(db, "chatRooms");
    const q = query(
      chatRoomsRef, 
      where("users", "array-contains", currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const rooms = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChatRooms(rooms);
        setLoading(false); // <-- จุดที่ 4: หยุดโหลดเมื่อได้รับข้อมูล (แม้จะว่าง)
      }, 
      (error) => {
        console.error("InboxPage Error: ", error);
        setLoading(false); // <-- จุดที่ 5: หยุดโหลดเสมอแม้จะเกิด Error
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return <div className="container"><h1>กล่องข้อความ</h1><p>กำลังโหลด...</p></div>;
  }
  // ... (ส่วนแสดงผลเหมือนเดิม)
  return (
    <div className="container">
      <div className="inbox-container">
        <h1>กล่องข้อความ</h1>
        <div className="chat-list">
          {chatRooms.length > 0 ? (
            chatRooms.map(room => <ChatRoomItem key={room.id} room={room} />)
          ) : (
            <p className="no-chats-message">ยังไม่มีการสนทนา</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default InboxPage;