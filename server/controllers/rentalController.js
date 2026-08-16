import { supabase, supabaseAdmin } from '../config/supabase.js';
import { INITIAL_PROPERTIES } from '../../src/data/mockData.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';
import { getPaginationParams, formatPaginationResponse } from '../utils/pagination.js';

let inMemoryRentals = INITIAL_PROPERTIES
  .filter(p => p.purpose === 'Rent' || p.purpose === 'Lease')
  .map(p => ({
    id: `rental-${p.id}`,
    propertyId: p.id,
    title: p.title,
    location: p.location,
    city: p.city,
    monthlyRent: p.price,
    securityDeposit: p.price * 3,
    leaseTermMonths: 12,
    furnishedStatus: 'Fully Furnished',
    petFriendly: true,
    availableFrom: '2026-09-01',
    images: p.images,
    amenities: p.amenities
  }));

export const getRentals = asyncHandler(async (req, res, next) => {
  const { maxRent, minRent, furnishedStatus, petFriendly, city } = req.query;
  const { page, limit, from, to } = getPaginationParams(req.query);

  let rentals = [];
  let totalCount = 0;
  let usedSupabase = false;

  if (supabase) {
    try {
      let query = supabase
        .from('rentals')
        .select(`
          *,
          properties (*)
        `, { count: 'exact' });

      if (minRent) query = query.gte('monthly_rent', Number(minRent));
      if (maxRent) query = query.lte('monthly_rent', Number(maxRent));
      if (furnishedStatus) query = query.eq('furnished_status', furnishedStatus);
      if (petFriendly !== undefined) query = query.eq('pet_friendly', petFriendly === 'true');

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (!error && data && data.length > 0) {
        rentals = data;
        totalCount = count || data.length;
        usedSupabase = true;
      }
    } catch (err) {}
  }

  if (!usedSupabase) {
    let list = [...inMemoryRentals];
    if (minRent) list = list.filter(r => r.monthlyRent >= Number(minRent));
    if (maxRent) list = list.filter(r => r.monthlyRent <= Number(maxRent));
    if (furnishedStatus) list = list.filter(r => r.furnishedStatus === furnishedStatus);
    if (petFriendly !== undefined) list = list.filter(r => String(r.petFriendly) === String(petFriendly));
    if (city && city !== 'All') list = list.filter(r => r.city && r.city.toLowerCase().includes(city.toLowerCase()));

    totalCount = list.length;
    const startIndex = (page - 1) * limit;
    rentals = list.slice(startIndex, startIndex + limit);
  }

  const response = formatPaginationResponse(rentals, totalCount, page, limit);

  return res.status(200).json({
    success: true,
    count: rentals.length,
    ...response
  });
});

export const createRental = asyncHandler(async (req, res, next) => {
  const { propertyId, monthlyRent, securityDeposit, leaseTermMonths, furnishedStatus, petFriendly, availableFrom } = req.body;

  const newRental = {
    id: `rental-${Date.now()}`,
    propertyId,
    monthlyRent: Number(monthlyRent),
    securityDeposit: Number(securityDeposit || monthlyRent * 2),
    leaseTermMonths: Number(leaseTermMonths || 12),
    furnishedStatus: furnishedStatus || 'Fully Furnished',
    petFriendly: petFriendly !== undefined ? Boolean(petFriendly) : true,
    availableFrom: availableFrom || new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const client = supabaseAdmin || supabase;
      await client
        .from('rentals')
        .insert([{
          property_id: newRental.propertyId,
          monthly_rent: newRental.monthlyRent,
          security_deposit: newRental.securityDeposit,
          lease_term_months: newRental.leaseTermMonths,
          furnished_status: newRental.furnishedStatus,
          pet_friendly: newRental.petFriendly,
          available_from: newRental.availableFrom
        }]);
    } catch (err) {}
  }

  inMemoryRentals.unshift(newRental);

  return res.status(201).json({
    success: true,
    message: 'Rental listing registered successfully',
    data: newRental
  });
});
