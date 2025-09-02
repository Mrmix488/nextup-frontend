
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';


const ADMIN_UID = "QiP4ghf9ktT79LOH0FUy6lDCchk1"; 

function AdminRoute({ children }) {
  const currentUser = auth.currentUser;

  
  if (!currentUser || currentUser.uid !== ADMIN_UID) {
    return <Navigate to="/" replace />;
  }

  return children; 
}

export default AdminRoute;