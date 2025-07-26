import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import HeroSection from './HeroSection';
import FeaturesSection from './components/FeaturesSection';
import ServicesSection from './components/ServicesSection';
import AboutSection from './components/AboutSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Login from './components/Login';
import CampusFeedPage from './pages/CampusFeedPage';
import LostFoundPage from './pages/LostFoundPage';
import HostelSupportPage from './pages/HostelSupportPage';
import AnnouncementPage from './pages/AnnouncementPage';
import TimetablePage from './pages/TimetablePage';
import TechOpportunities from './pages/TechOpportunities';
import ComplaintPage from './pages/ComplaintPage';
import SkillLearningPage from './pages/SkillLearningPage';
import SessionBookingPage from './pages/SessionBookingPage';
import PollsFeedBackPage from './pages/PollsFeedBackPage';
import ProfilePage from './pages/ProfilePage';
import PollsFeedbackPage from './pages/PollsFeedBackPage';

function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/campus-feed" element={
              <ProtectedRoute>
                <CampusFeedPage />
              </ProtectedRoute>
            } />
            <Route path="/lost-found" element={
              <ProtectedRoute>
                <LostFoundPage />
              </ProtectedRoute>
            } />
            <Route path="/hostel-support" element={
              <ProtectedRoute>
                <HostelSupportPage />
              </ProtectedRoute>
            } />
            <Route path="/announcements" element={
              <ProtectedRoute>
                <AnnouncementPage />
              </ProtectedRoute>
            } />
            <Route path="/timetable" element={
              <ProtectedRoute>
                <TimetablePage />
              </ProtectedRoute>
            } />
            <Route path="/complaints" element={
              <ProtectedRoute>
                <ComplaintPage />
              </ProtectedRoute>
            } />
            <Route path="/techopportunities" element={
              <ProtectedRoute>
                <TechOpportunities />
              </ProtectedRoute>
            } />
            <Route path="/skill-learning" element={
              <ProtectedRoute>
                <SkillLearningPage />
              </ProtectedRoute>
            } />
            <Route path="/session-booking" element={
              <ProtectedRoute>
                <SessionBookingPage />
              </ProtectedRoute>
            } />
            <Route path="/pollsfeedback" element={
              <ProtectedRoute>
                <PollsFeedbackPage />
              </ProtectedRoute>
            } />
            
            {/* Redirect to home for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;