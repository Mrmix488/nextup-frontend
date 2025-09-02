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
      // --- เครื่องดักฟังที่ 1: เช็คสถานะ Auth ---
      console.log("%c[AuthContext] Auth state changed:", "color: purple; font-weight: bold;", user);
      setCurrentUser(user);
      
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            // --- เครื่องดักฟังที่ 2: เช็คข้อมูลโปรไฟล์ที่ดึงได้ ---
            console.log("%c[AuthContext] Fetched Firestore profile data:", "color: green; font-weight: bold;", docSnap.data());
            setUserData(docSnap.data());
          } else {
            console.error("[AuthContext] User document NOT FOUND in Firestore for UID:", user.uid);
            setUserData(null);
          }
          setLoading(false);
        });
        return unsubscribeProfile;
      } else {
        setUserData(null);
        setLoading(false);
      }
    });
    return unsubscribeAuth;
  }, []);

  const value = { currentUser, userData, loading };

  // --- เครื่องดักฟังที่ 3: เช็คค่าที่จะส่งออกไป ---
  console.log("[AuthContext] Providing value:", value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}