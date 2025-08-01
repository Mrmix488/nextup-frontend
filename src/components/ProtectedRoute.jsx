

import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';


function ProtectedRoute({ children }) { 
  const currentUser = auth.currentUser;

  if (!currentUser) {
    
    return <Navigate to="/login" replace />;
  }

  
  return children;
}

export default ProtectedRoute;