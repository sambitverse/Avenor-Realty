import { z } from 'zod';

// ========================================================
// Authentication Schemas
// ========================================================
export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['User', 'Admin', 'Property Owner', 'Agent', 'admin', 'user']).optional().default('User'),
  phone: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

// ========================================================
// Property Schemas
// ========================================================
export const propertyQuerySchema = z.object({
  search: z.string().optional(),
  purpose: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(12),
  tag: z.string().optional(),
  status: z.string().optional()
});

export const createPropertySchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  subtitle: z.string().optional().default(''),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  purpose: z.enum(['Buy', 'Rent', 'Lease']).optional().default('Buy'),
  category: z.string().min(2, 'Category is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  emi: z.coerce.number().min(0).optional().default(0),
  location: z.string().trim().min(2, 'Location is required'),
  city: z.string().trim().min(2, 'City is required'),
  country: z.string().optional().default('India'),
  address: z.string().optional().default(''),
  area: z.coerce.number().positive('Area must be greater than 0').optional(),
  area_sqft: z.coerce.number().positive().optional(),
  bedrooms: z.coerce.number().int().min(0).optional().default(1),
  bathrooms: z.coerce.number().int().min(0).optional().default(1),
  parking: z.coerce.number().int().min(0).optional().default(1),
  yearBuilt: z.coerce.number().int().optional().default(2024),
  possession: z.string().optional().default('Ready to Move'),
  propertyStatus: z.enum(['Active', 'Sold', 'Rented', 'Archived']).optional().default('Active'),
  approvalStatus: z.enum(['Pending', 'Approved', 'Rejected']).optional().default('Approved'),
  isFeatured: z.boolean().optional().default(false),
  isLuxury: z.boolean().optional().default(true),
  tags: z.array(z.string()).optional().default([]),
  heroVideo: z.string().optional().default('/video.mp4'),
  images: z.array(z.string()).optional().default([]),
  amenities: z.array(z.string()).optional().default([]),
  floorPlan: z.string().optional().default('')
});

export const updatePropertySchema = createPropertySchema.partial();

// ========================================================
// Favorite Schemas
// ========================================================
export const favoriteSchema = z.object({
  propertyId: z.string().trim().min(1, 'Property ID is required')
});

// ========================================================
// Appointment & Contact Schemas
// ========================================================
export const appointmentSchema = z.object({
  propertyId: z.string().trim().min(1, 'Property ID is required'),
  propertyTitle: z.string().optional(),
  clientName: z.string().trim().min(2, 'Client name is required'),
  clientEmail: z.string().trim().email('Valid client email is required'),
  clientPhone: z.string().trim().min(6, 'Valid client phone is required'),
  date: z.string().min(1, 'Inspection date is required').optional(),
  appointmentDate: z.string().min(1, 'Inspection date is required').optional(),
  timeSlot: z.string().min(1, 'Time slot is required').optional(),
  time: z.string().min(1, 'Time slot is required').optional(),
  notes: z.string().optional()
});

export const contactRequestSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Valid email is required'),
  phone: z.string().trim().min(6, 'Phone is required'),
  interest: z.string().optional().default('Buying'),
  message: z.string().optional().default('')
});

// ========================================================
// Messaging Schemas
// ========================================================
export const sendMessageSchema = z.object({
  conversationId: z.string().trim().min(1, 'Conversation ID is required'),
  content: z.string().trim().min(1, 'Message cannot be empty').max(5000, 'Message too long'),
  recipientId: z.string().optional()
});

export const createConversationSchema = z.object({
  propertyId: z.string().optional(),
  recipientId: z.string().trim().min(1, 'Recipient ID is required')
});

// ========================================================
// User Management Schemas
// ========================================================
export const updateUserRoleSchema = z.object({
  role: z.enum(['User', 'Admin', 'Property Owner', 'Agent'])
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional()
});
