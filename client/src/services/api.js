import { INITIAL_PROPERTIES, INITIAL_ADMIN_ANALYTICS } from '../data/mockData';

// API Client layer that connects to MERN serverless API routes (/api/*) or falls back smoothly for static execution
const API_BASE = '/api';

export const propertyApi = {
  getAll: async (filters = {}) => {
    try {
      const res = await fetch(`${API_BASE}/properties`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.log("Using internal MERN dataset fallback.");
    }
    // Fallback filter engine
    let list = [...INITIAL_PROPERTIES];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (filters.purpose && filters.purpose !== 'All') {
      list = list.filter(p => p.purpose === filters.purpose);
    }
    if (filters.category && filters.category !== 'All') {
      list = list.filter(p => p.category === filters.category);
    }
    if (filters.city && filters.city !== 'All') {
      list = list.filter(p => p.city === filters.city);
    }
    if (filters.maxPrice) {
      list = list.filter(p => p.price <= filters.maxPrice);
    }
    if (filters.bedrooms && filters.bedrooms !== 'Any') {
      list = list.filter(p => p.bedrooms >= parseInt(filters.bedrooms));
    }
    if (filters.tag && filters.tag !== 'All') {
      list = list.filter(p => p.tags.includes(filters.tag));
    }
    return list;
  },

  getById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/properties/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return INITIAL_PROPERTIES.find(p => p.id === id) || INITIAL_PROPERTIES[0];
  },

  create: async (propertyData) => {
    try {
      const res = await fetch(`${API_BASE}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { ...propertyData, id: `prop-${Date.now()}` };
  },

  update: async (id, updateData) => {
    try {
      const res = await fetch(`${API_BASE}/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { id, ...updateData };
  },

  delete: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/properties/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, id };
  }
};

export const adminApi = {
  getAnalytics: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/analytics`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return INITIAL_ADMIN_ANALYTICS;
  }
};

export const bookingApi = {
  createBooking: async (bookingData) => {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, id: `book-${Date.now()}`, ...bookingData };
  }
};
