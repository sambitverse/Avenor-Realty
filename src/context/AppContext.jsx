import React, { createContext, useContext, useState, useEffect } from 'react';
import { propertyApi } from '../services/api';
import { INITIAL_PROPERTIES } from '../data/mockData';

const AppContext = createContext();

const DEFAULT_APPOINTMENTS = [
  {
    id: 'v-101',
    propertyId: 'prop-101',
    propertyTitle: 'The Solstice Pavilion',
    location: 'Alibaug, Maharashtra',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    clientName: 'Alexander Wright',
    clientEmail: 'investor@avenor.com',
    clientPhone: '+91 98765 43210',
    date: '2026-08-08',
    time: '11:00 AM',
    status: 'Confirmed'
  }
];

export const AppProvider = ({ children }) => {
  // Properties state with localStorage persistence
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('avenor_properties');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved properties', e);
      }
    }
    return INITIAL_PROPERTIES;
  });

  const [filters, setFilters] = useState({
    search: '',
    purpose: 'All',
    category: 'All',
    city: 'All',
    bedrooms: 'Any',
    maxPrice: 100000000,
    tag: 'All'
  });

  // Default empty lists for fresh auth scoping
  const [bookmarks, setBookmarks] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  // Booked Private Inspections / Appointments with localStorage persistence
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('avenor_appointments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Failed to parse saved appointments', e);
      }
    }
    return DEFAULT_APPOINTMENTS;
  });

  // User state with localStorage persistence
  const [user, setUserState] = useState(() => {
    const saved = localStorage.getItem('avenor_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return null;
  });

  // Sync properties to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('avenor_properties', JSON.stringify(properties));
  }, [properties]);

  // Sync appointments to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('avenor_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Sync user to localStorage whenever updated
  useEffect(() => {
    if (user) {
      localStorage.setItem('avenor_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('avenor_user');
    }
  }, [user]);

  // Views & Modals
  const [activeTab, setActiveTab] = useState('main'); // 'main' | 'dashboard' | 'admin'
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [appointmentProperty, setAppointmentProperty] = useState(null);

  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourProperty, setTourProperty] = useState(null);

  const toggleBookmark = (id) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleCompare = (prop) => {
    const id = typeof prop === 'string' ? prop : prop.id;
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(item => item !== id);
      if (prev.length >= 3) {
        alert('You can compare up to 3 properties at a time.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const addRecentlyViewed = (id) => {
    setRecentlyViewed(prev => [id, ...prev.filter(item => item !== id)]);
  };

  const addAppointment = (newApp) => {
    setAppointments(prev => [newApp, ...prev]);
  };

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const openPropertyDetail = (prop) => {
    setSelectedProperty(prop);
    setIsDetailOpen(true);
    addRecentlyViewed(prop.id);
  };

  const closePropertyDetail = () => {
    setIsDetailOpen(false);
    setSelectedProperty(null);
  };

  const openBookingModal = (prop = null) => {
    setAppointmentProperty(prop);
    setIsAppointmentOpen(true);
  };

  const closeBookingModal = () => {
    setIsAppointmentOpen(false);
    setAppointmentProperty(null);
  };

  const open360Tour = (prop) => {
    setTourProperty(prop);
    setIsTourOpen(true);
  };

  const close360Tour = () => {
    setIsTourOpen(false);
    setTourProperty(null);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthOpen(false);
  };

  // Property CRUD for Admin with state & localStorage persistence
  const addProperty = async (newProp) => {
    const created = {
      ...newProp,
      id: newProp.id || `prop-${Date.now()}`
    };
    setProperties(prev => [created, ...prev]);
    return created;
  };

  const updateProperty = async (id, updatedFields) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deleteProperty = async (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  // Handle user authentication
  const handleUserAuth = (userData, isSignup = false) => {
    setUserState(userData);
    if (isSignup) {
      // Fresh user starts with empty wishlist and empty recent inspections
      setBookmarks([]);
      setRecentlyViewed([]);
    }
  };

  // Logout function
  const logout = () => {
    setUserState(null);
    localStorage.removeItem('avenor_user');
  };

  return (
    <AppContext.Provider value={{
      properties,
      filters,
      setFilters,
      bookmarks,
      toggleBookmark,
      compareList,
      toggleCompare,
      recentlyViewed,
      addRecentlyViewed,
      appointments,
      addAppointment,
      updateAppointmentStatus,
      user,
      setUser: handleUserAuth,
      logout,
      activeTab,
      setActiveTab,
      selectedProperty,
      isDetailOpen,
      openPropertyDetail,
      closePropertyDetail,
      isCompareOpen,
      setIsCompareOpen,
      isAuthOpen,
      authMode,
      openAuthModal,
      closeAuthModal,
      isAppointmentOpen,
      appointmentProperty,
      openBookingModal,
      closeBookingModal,
      isTourOpen,
      tourProperty,
      open360Tour,
      close360Tour,
      addProperty,
      updateProperty,
      deleteProperty
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
