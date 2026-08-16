import { supabase, supabaseAdmin } from '../config/supabase.js';
import { INITIAL_PROPERTIES } from '../../src/data/mockData.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';
import { getPaginationParams, formatPaginationResponse } from '../utils/pagination.js';

// In-memory fallback favorites map: userId -> Set of propertyIds
const memoryFavorites = new Map([
  ['usr-investor-001', new Set(['prop-101', 'prop-102'])]
]);

export const getFavorites = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { page, limit, from, to } = getPaginationParams(req.query);

  let favoriteProperties = [];
  let totalCount = 0;
  let usedSupabase = false;

  if (supabase) {
    try {
      const { data, error, count } = await supabase
        .from('favorites')
        .select(`
          id,
          created_at,
          property_id,
          properties (*)
        `, { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!error && data) {
        favoriteProperties = data.map(f => f.properties || { id: f.property_id });
        totalCount = count || favoriteProperties.length;
        usedSupabase = true;
      }
    } catch (err) {}
  }

  if (!usedSupabase) {
    const userFavs = memoryFavorites.get(userId) || new Set();
    const favIds = Array.from(userFavs);
    totalCount = favIds.length;

    const startIndex = (page - 1) * limit;
    const paginatedIds = favIds.slice(startIndex, startIndex + limit);

    favoriteProperties = paginatedIds.map(id => {
      const prop = INITIAL_PROPERTIES.find(p => p.id === id || p._id === id);
      return prop || { id, title: 'Luxury Residence', price: 25000000 };
    });
  }

  const response = formatPaginationResponse(favoriteProperties, totalCount, page, limit);

  return res.status(200).json({
    success: true,
    ...response
  });
});

export const addFavorite = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { propertyId } = req.body;

  if (!propertyId) {
    return next(new ApiError(400, 'propertyId is required', 'MISSING_PROPERTY_ID'));
  }

  let createdFavorite = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .upsert([{ user_id: userId, property_id: propertyId }], { onConflict: 'user_id, property_id' })
        .select('*')
        .single();

      if (!error && data) createdFavorite = data;
    } catch (err) {}
  }

  if (!memoryFavorites.has(userId)) {
    memoryFavorites.set(userId, new Set());
  }
  memoryFavorites.get(userId).add(propertyId);

  return res.status(201).json({
    success: true,
    message: 'Property added to saved portfolio',
    data: {
      userId,
      propertyId,
      createdAt: new Date().toISOString()
    }
  });
});

export const removeFavorite = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { propertyId } = req.params;

  if (supabase) {
    try {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId);
    } catch (err) {}
  }

  if (memoryFavorites.has(userId)) {
    memoryFavorites.get(userId).delete(propertyId);
  }

  return res.status(200).json({
    success: true,
    message: 'Property removed from saved portfolio',
    propertyId
  });
});
