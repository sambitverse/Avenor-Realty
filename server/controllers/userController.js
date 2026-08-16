import { supabase, supabaseAdmin } from '../config/supabase.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';
import { getPaginationParams, formatPaginationResponse } from '../utils/pagination.js';

let inMemoryUsersList = [
  {
    id: 'usr-admin-001',
    email: 'admin@avenor.com',
    full_name: 'Julian Vane',
    role: 'Admin',
    phone: '+1 800 555 0199',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    is_verified: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'usr-investor-001',
    email: 'investor@avenor.com',
    full_name: 'Alexander Wright',
    role: 'User',
    phone: '+91 98765 43210',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    is_verified: true,
    created_at: new Date().toISOString()
  }
];

export const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  let user = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, phone, avatar_url, is_verified, created_at')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) user = data;
    } catch (err) {}
  }

  if (!user) {
    user = inMemoryUsersList.find(u => u.id === userId) || {
      id: userId,
      email: req.user.email,
      full_name: req.user.name,
      role: req.user.role,
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      is_verified: true
    };
  }

  return res.status(200).json({
    success: true,
    data: user
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { name, phone, avatar } = req.body;

  let updated = null;

  if (supabase) {
    try {
      const client = supabaseAdmin || supabase;
      const { data, error } = await client
        .from('users')
        .update({
          full_name: name || undefined,
          phone: phone || undefined,
          avatar_url: avatar || undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('id, email, full_name, role, phone, avatar_url, is_verified, updated_at')
        .single();

      if (!error && data) updated = data;
    } catch (err) {}
  }

  const idx = inMemoryUsersList.findIndex(u => u.id === userId);
  if (idx !== -1) {
    inMemoryUsersList[idx] = {
      ...inMemoryUsersList[idx],
      full_name: name || inMemoryUsersList[idx].full_name,
      phone: phone !== undefined ? phone : inMemoryUsersList[idx].phone,
      avatar_url: avatar || inMemoryUsersList[idx].avatar_url
    };
    if (!updated) updated = inMemoryUsersList[idx];
  }

  if (!updated) {
    updated = {
      id: userId,
      email: req.user.email,
      full_name: name || req.user.name,
      role: req.user.role,
      phone: phone || '',
      avatar_url: avatar || ''
    };
  }

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updated
  });
});

export const getUsers = asyncHandler(async (req, res, next) => {
  const { page, limit, from, to } = getPaginationParams(req.query);

  let users = [];
  let totalCount = 0;
  let usedSupabase = false;

  if (supabase) {
    try {
      const client = supabaseAdmin || supabase;
      const { data, error, count } = await client
        .from('users')
        .select('id, email, full_name, role, phone, avatar_url, is_verified, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!error && data) {
        users = data;
        totalCount = count || data.length;
        usedSupabase = true;
      }
    } catch (err) {}
  }

  if (!usedSupabase) {
    totalCount = inMemoryUsersList.length;
    const startIndex = (page - 1) * limit;
    users = inMemoryUsersList.slice(startIndex, startIndex + limit);
  }

  const response = formatPaginationResponse(users, totalCount, page, limit);

  return res.status(200).json({
    success: true,
    ...response
  });
});

export const updateUserRole = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  let updated = null;

  if (supabase) {
    try {
      const client = supabaseAdmin || supabase;
      const { data, error } = await client
        .from('users')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('id, email, full_name, role')
        .single();

      if (!error && data) updated = data;
    } catch (err) {}
  }

  const idx = inMemoryUsersList.findIndex(u => u.id === id);
  if (idx !== -1) {
    inMemoryUsersList[idx].role = role;
    if (!updated) updated = inMemoryUsersList[idx];
  }

  if (!updated) {
    return next(new ApiError(404, `User with ID '${id}' not found`, 'USER_NOT_FOUND'));
  }

  return res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    data: updated
  });
});
