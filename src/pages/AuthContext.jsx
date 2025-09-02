// frontend/src/context/AuthContext.jsx (ไฟล์ใหม่)

import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged จะคอยดักฟังการเปลี่ยนแปลงสถานะ login/logout
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        // ถ้ามี user (login), ให้ไปดักฟังข้อมูลโปรไฟล์ของเขาแบบ real-time
        const userRef = doc(db, 'users', user.uid);
        const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setUserData(null); // กรณีที่ user document ถูกลบไป
          }
          setLoading(false);
        });
        return unsubscribeProfile; // Cleanup profile listener เมื่อ user เปลี่ยน
      } else {
        // ถ้าไม่มี user (logout)
        setUserData(null);
        setLoading(false);
      }
    });

    return unsubscribeAuth; // Cleanup auth listener
  }, []);

  const value = {
    currentUser,
    userData,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}