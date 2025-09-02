// frontend/src/context/AuthContext.jsx
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
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setUserData(null);
          }
          setLoading(false);
        });
        // คืนค่า unsub ของ profile listener เมื่อ user เปลี่ยน
        return unsubscribeProfile;
      } else {
        setUserData(null);
        setLoading(false);
      }
    });
    // คืนค่า unsub ของ auth listener เมื่อ component unmount
    return unsubscribeAuth;
  }, []);

  const value = { currentUser, userData, loading };

  // จะไม่ render children ถ้ายังโหลดไม่เสร็จ
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}