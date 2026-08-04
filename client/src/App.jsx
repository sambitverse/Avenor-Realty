import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CinematicLoader from './components/layout/CinematicLoader';

// Multi-Page Component Views
import Hero from './components/hero/Hero';
import SmartSearch from './components/sections/SmartSearch';
import EditorialStory from './components/sections/EditorialStory';
import FeaturedProperties from './components/sections/FeaturedProperties';
import Testimonials from './components/sections/Testimonials';
import JournalBlog from './components/sections/JournalBlog';
import ContactSection from './components/sections/ContactSection';

// Dedicated Pages
import PropertiesPage from './pages/PropertiesPage';
import ProjectsPage from './pages/ProjectsPage';
import AboutPage from './pages/AboutPage';

// Dashboards & Portals
import UserDashboard from './components/dashboard/UserDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';

// Modals
import PropertyDetailModal from './components/modals/PropertyDetailModal';
import PropertyCompareModal from './components/modals/PropertyCompareModal';
import AuthModal from './components/modals/AuthModal';
import AppointmentModal from './components/modals/AppointmentModal';

// Home Page Composite
function HomePage() {
  return (
    <>
      <Hero />
      <SmartSearch />
      <EditorialStory />
      <FeaturedProperties />
      <Testimonials />
      <JournalBlog />
      <ContactSection />
    </>
  );
}

function MainApp() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <Router>
      {!loadingComplete && (
        <CinematicLoader onComplete={() => setLoadingComplete(true)} />
      )}

      <div className="min-h-screen bg-[#fdf8f8] text-[#1c1b1b] relative selection:bg-[#755a24] selection:text-white font-sans antialiased">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/company" element={<AboutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>

        <Footer />

        {/* Global Floating Modals */}
        <PropertyDetailModal />
        <PropertyCompareModal />
        <AuthModal />
        <AppointmentModal />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
