// frontend/src/App.jsx (วางทับทั้งหมด)

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Import Components & Pages...
import Navbar from './components/Navbar';
import CategoryFilter from './components/CategoryFilter';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import CategoryPage from './pages/CategoryPage';
import SubCategoryPage from './pages/SubCategoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import InboxPage from './pages/InboxPage';
import ChatRoomPage from './pages/ChatRoomPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import LeaveReviewPage from './pages/LeaveReviewPage';
import PostJobPage from './pages/PostJobPage';
import FindJobsPage from './pages/FindJobsPage';
import JobDetailPage from './pages/JobDetailPage';
import MyJobsPage from './pages/MyJobsPage';
import AdminPage from './pages/AdminPage';
import PostServicePage from './pages/PostServicePage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import HowToUsePage from './pages/HowToUsePage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';

// --- สร้าง Component ใหม่ขึ้นมาเพื่อจัดการ Layout ---
function AppLayout({ currentUser }) {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // เงื่อนไขในการแสดง CategoryFilter
  const showCategoryFilter = location.pathname === '/';

  // Logic การดักจับ Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="site-wrapper creative-background">
      <header className={`sticky-header ${isScrolled ? 'scrolled' : ''}`}>
        <Navbar currentUser={currentUser} />
        {showCategoryFilter && <CategoryFilter />}
      </header>
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/find-jobs" element={<FindJobsPage />} />
          <Route path="/job/:jobId" element={<JobDetailPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/category/:categoryName/:subCategoryName" element={<SubCategoryPage />} />
          <Route path="/service/:id" element={<ServiceDetailPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/how-to-use" element={<HowToUsePage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
          <Route path="/chat/:roomId" element={<ProtectedRoute><ChatRoomPage /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
          <Route path="/review/:freelancerId" element={<ProtectedRoute><LeaveReviewPage /></ProtectedRoute>} />
          <Route path="/post-job" element={<ProtectedRoute><PostJobPage /></ProtectedRoute>} />
          <Route path="/post-service" element={<ProtectedRoute><PostServicePage /></ProtectedRoute>} />
          <Route path="/my-jobs" element={<ProtectedRoute><MyJobsPage /></ProtectedRoute>} />
          
          {/* Admin Route */}
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
// --- จบ Component Layout ---


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><p>กำลังตรวจสอบผู้ใช้งาน...</p></div>;
  }

  return (
    <Router>
      <AppLayout currentUser={currentUser} />
    </Router>
  );
}

export default App;