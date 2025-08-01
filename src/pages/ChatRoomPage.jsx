

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { IoPaperPlaneOutline } from "react-icons/io5";
import './ChatRoomPage.css';

function ChatRoomPage() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUserInfo, setOtherUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentUser || !roomId) {
        setLoading(false);
        return;
    };
    
    
    const roomRef = doc(db, 'chatRooms', roomId);
    const unsubRoom = onSnapshot(roomRef, async (docSnap) => {
      if (docSnap.exists()) {
        const roomData = docSnap.data();
        const otherUserId = roomData.users.find(uid => uid !== currentUser.uid);
        if (otherUserId) {
          const otherUserRef = doc(db, "users", otherUserId);
          const otherUserSnap = await getDoc(otherUserRef);
          if (otherUserSnap.exists()) {
            setOtherUserInfo(otherUserSnap.data());
          }
        }
      }
    });

    const messagesRef = collection(db, 'chatRooms', roomId, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));
    const unsubMessages = onSnapshot(q, 
      (querySnapshot) => {
        const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
        setLoading(false); 
      },
      (error) => {
        console.error("ChatRoomPage Error: ", error);
        setLoading(false); 
      }
    );

    return () => {
      unsubRoom();
      unsubMessages();
    };
  }, [roomId, currentUser]);

  
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    const messagesRef = collection(db, 'chatRooms', roomId, 'messages');
    await addDoc(messagesRef, { text: newMessage, senderId: currentUser.uid, timestamp: serverTimestamp() });
    const roomRef = doc(db, 'chatRooms', roomId);
    await updateDoc(roomRef, { lastMessage: newMessage, timestamp: serverTimestamp() });
    setNewMessage('');
  };

  if (loading) {
    return <div className="container"><p>กำลังโหลดแชท...</p></div>;
  }
  
  return (
    <div className="container creative-background">
      <div className="chat-room-container">
        <header className="chat-room-header">
          <Link to="/inbox" className="back-to-inbox-btn">←</Link>
          <div className="chat-partner-info">
             <img src={otherUserInfo?.photoURL || `...`} alt="avatar" className="chat-avatar-header" />
            <h2>คุยกับ {otherUserInfo?.displayName || '...'}</h2>
          </div>
        </header>
        <main className="chat-messages">
          {messages.length === 0 && !loading && (
            <div className="welcome-message"> ... </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`message-bubble ${msg.senderId === currentUser.uid ? 'sent' : 'received'}`}>
              <p>{msg.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} /> 
        </main>
        <footer className="chat-form-container">
          <form onSubmit={handleSendMessage} className="chat-form">
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="พิมพ์ข้อความ..." className="chat-input" />
            <button type="submit" className="send-button"><IoPaperPlaneOutline size={20} /></button>
          </form>
        </footer>
      </div>
    </div>
  );
}

export default ChatRoomPage;