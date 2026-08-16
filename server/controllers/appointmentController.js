import { supabase, supabaseAdmin } from '../config/supabase.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';
import { getPaginationParams, formatPaginationResponse } from '../utils/pagination.js';

let inMemoryAppointments = [
  {
    id: 'v-101',
    propertyId: 'prop-101',
    propertyTitle: 'The Solstice Pavilion',
    location: 'Alibaug, Maharashtra',
    clientName: 'Alexander Wright',
    clientEmail: 'investor@avenor.com',
    clientPhone: '+91 98765 43210',
    date: '2026-08-20',
    time: '11:00 AM',
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  }
];

export const createAppointment = asyncHandler(async (req, res, next) => {
  const { propertyId, propertyTitle, clientName, clientEmail, clientPhone, date, appointmentDate, timeSlot, time, notes } = req.body;

  const resolvedDate = date || appointmentDate || new Date().toISOString().split('T')[0];
  const resolvedTime = timeSlot || time || '11:00 AM';

  const newAppointment = {
    id: `app-${Date.now()}`,
    propertyId,
    propertyTitle: propertyTitle || 'Architectural Estate',
    clientName,
    clientEmail,
    clientPhone,
    date: resolvedDate,
    time: resolvedTime,
    notes: notes || '',
    status: 'Confirmed',
    userId: req.user?.id || null,
    createdAt: new Date().toISOString()
  };

  if (supabase) {
    try {
      const client = supabaseAdmin || supabase;
      await client
        .from('appointments')
        .insert([{
          property_id: propertyId,
          user_id: req.user?.id || null,
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          appointment_date: resolvedDate,
          time_slot: resolvedTime,
          status: 'Confirmed',
          notes: notes || null
        }]);
    } catch (err) {}
  }

  inMemoryAppointments.unshift(newAppointment);

  return res.status(201).json({
    success: true,
    message: 'Private inspection scheduled successfully',
    data: newAppointment
  });
});

export const getUserAppointments = asyncHandler(async (req, res, next) => {
  const userEmail = req.user.email;
  const userId = req.user.id;

  const userApps = inMemoryAppointments.filter(a =>
    (a.clientEmail && a.clientEmail.toLowerCase() === userEmail.toLowerCase()) ||
    (a.userId && a.userId === userId)
  );

  return res.status(200).json({
    success: true,
    count: userApps.length,
    data: userApps
  });
});

export const getAllAppointments = asyncHandler(async (req, res, next) => {
  const { page, limit, from, to } = getPaginationParams(req.query);

  let appointments = [];
  let totalCount = 0;
  let usedSupabase = false;

  if (supabase) {
    try {
      const client = supabaseAdmin || supabase;
      const { data, error, count } = await client
        .from('appointments')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!error && data) {
        appointments = data;
        totalCount = count || data.length;
        usedSupabase = true;
      }
    } catch (err) {}
  }

  if (!usedSupabase) {
    totalCount = inMemoryAppointments.length;
    const startIndex = (page - 1) * limit;
    appointments = inMemoryAppointments.slice(startIndex, startIndex + limit);
  }

  const response = formatPaginationResponse(appointments, totalCount, page, limit);

  return res.status(200).json({
    success: true,
    ...response
  });
});

export const updateAppointmentStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const idx = inMemoryAppointments.findIndex(a => a.id === id);
  if (idx === -1) {
    return next(new ApiError(404, 'Appointment not found', 'APPOINTMENT_NOT_FOUND'));
  }

  inMemoryAppointments[idx].status = status;

  if (supabase) {
    try {
      const client = supabaseAdmin || supabase;
      await client
        .from('appointments')
        .update({ status })
        .eq('id', id);
    } catch (err) {}
  }

  return res.status(200).json({
    success: true,
    message: `Appointment status updated to ${status}`,
    data: inMemoryAppointments[idx]
  });
});
