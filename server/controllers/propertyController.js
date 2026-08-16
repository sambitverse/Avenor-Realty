import { supabase, supabaseAdmin } from '../config/supabase.js';
import { INITIAL_PROPERTIES } from '../../src/data/mockData.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';
import { getPaginationParams, formatPaginationResponse } from '../utils/pagination.js';

// In-memory property store initialized with default luxury catalog
let propertiesMemoryStore = [...INITIAL_PROPERTIES];

export const getProperties = asyncHandler(async (req, res, next) => {
  const { search, purpose, category, city, minPrice, maxPrice, bedrooms, bathrooms, tag, status } = req.query;
  const { page, limit, from, to } = getPaginationParams(req.query);

  let properties = [];
  let totalCount = 0;
  let usedSupabase = false;

  if (supabase) {
    try {
      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' });

      // Apply Filters
      if (purpose && purpose !== 'All') {
        query = query.eq('purpose', purpose);
      }
      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      if (city && city !== 'All') {
        query = query.ilike('city', `%${city}%`);
      }
      if (minPrice) {
        query = query.gte('price', Number(minPrice));
      }
      if (maxPrice) {
        query = query.lte('price', Number(maxPrice));
      }
      if (bedrooms && bedrooms !== 'Any') {
        query = query.gte('bedrooms', parseInt(bedrooms, 10));
      }
      if (bathrooms && bathrooms !== 'Any') {
        query = query.gte('bathrooms', parseInt(bathrooms, 10));
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%,city.ilike.%${search}%,description.ilike.%${search}%`);
      }
      if (status) {
        query = query.eq('property_status', status);
      }

      // Order & Paginate
      query = query
        .order('created_at', { ascending: false })
        .range(from, to);

      const { data, error, count } = await query;

      if (!error && data && data.length > 0) {
        properties = data;
        totalCount = count || data.length;
        usedSupabase = true;
      }
    } catch (err) {
      console.warn('[Supabase Property Query Error]:', err.message);
    }
  }

  // Fallback in-memory query engine if Supabase not populated or unreachable
  if (!usedSupabase) {
    let list = [...propertiesMemoryStore];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.city && p.city.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    if (purpose && purpose !== 'All') {
      list = list.filter(p => p.purpose === purpose);
    }
    if (category && category !== 'All') {
      list = list.filter(p => p.category === category);
    }
    if (city && city !== 'All') {
      list = list.filter(p => p.city && p.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (minPrice) {
      list = list.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      list = list.filter(p => p.price <= Number(maxPrice));
    }
    if (bedrooms && bedrooms !== 'Any') {
      list = list.filter(p => p.bedrooms >= parseInt(bedrooms, 10));
    }
    if (bathrooms && bathrooms !== 'Any') {
      list = list.filter(p => p.bathrooms >= parseInt(bathrooms, 10));
    }
    if (tag && tag !== 'All') {
      list = list.filter(p => p.tags && p.tags.includes(tag));
    }
    if (status) {
      list = list.filter(p => p.propertyStatus === status);
    }

    totalCount = list.length;
    const startIndex = (page - 1) * limit;
    properties = list.slice(startIndex, startIndex + limit);
  }

  const response = formatPaginationResponse(properties, totalCount, page, limit);

  return res.status(200).json({
    success: true,
    count: properties.length,
    ...response
  });
});

export const getPropertyById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let property = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        property = data;
      }
    } catch (err) {}
  }

  if (!property) {
    property = propertiesMemoryStore.find(p => p.id === id || p._id === id);
  }

  if (!property) {
    return next(new ApiError(404, `Property listing with ID '${id}' not found`, 'PROPERTY_NOT_FOUND'));
  }

  return res.status(200).json({
    success: true,
    data: property
  });
});

export const createProperty = asyncHandler(async (req, res, next) => {
  const propertyPayload = {
    ...req.body,
    owner_id: req.user?.id || null,
    propertyStatus: req.body.propertyStatus || 'Active',
    approvalStatus: req.body.approvalStatus || 'Approved',
    created_at: new Date().toISOString()
  };

  const newId = `prop-${Date.now()}`;
  let createdProperty = null;

  if (supabase) {
    try {
      const client = supabaseAdmin || supabase;
      const { data, error } = await client
        .from('properties')
        .insert([{
          title: propertyPayload.title,
          subtitle: propertyPayload.subtitle,
          description: propertyPayload.description,
          purpose: propertyPayload.purpose,
          category: propertyPayload.category,
          price: propertyPayload.price,
          emi: propertyPayload.emi,
          location: propertyPayload.location,
          city: propertyPayload.city,
          country: propertyPayload.country,
          address: propertyPayload.address,
          area_sqft: propertyPayload.area || propertyPayload.area_sqft,
          bedrooms: propertyPayload.bedrooms,
          bathrooms: propertyPayload.bathrooms,
          parking: propertyPayload.parking,
          property_status: propertyPayload.propertyStatus,
          approval_status: propertyPayload.approvalStatus,
          is_featured: propertyPayload.isFeatured,
          is_luxury: propertyPayload.isLuxury,
          tags: propertyPayload.tags,
          images: propertyPayload.images,
          amenities: propertyPayload.amenities,
          owner_id: propertyPayload.owner_id
        }])
        .select('*')
        .single();

      if (!error && data) {
        createdProperty = data;
      }
    } catch (err) {
      console.warn('[Supabase Create Property Warning]:', err.message);
    }
  }

  if (!createdProperty) {
    createdProperty = {
      id: newId,
      _id: newId,
      ...propertyPayload
    };
    propertiesMemoryStore.unshift(createdProperty);
  }

  return res.status(201).json({
    success: true,
    message: 'Property listing created successfully',
    data: createdProperty
  });
});

export const updateProperty = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Verify ownership or admin privileges
  let existing = propertiesMemoryStore.find(p => p.id === id || p._id === id);

  if (req.user && req.user.role !== 'Admin' && existing && existing.owner_id && existing.owner_id !== req.user.id) {
    return next(new ApiError(403, 'You do not have permission to modify this property listing', 'UNAUTHORIZED_PROPERTY_UPDATE'));
  }

  let updated = null;

  if (supabase) {
    try {
      const client = supabaseAdmin || supabase;
      const { data, error } = await client
        .from('properties')
        .update({
          ...req.body,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .maybeSingle();

      if (!error && data) {
        updated = data;
      }
    } catch (err) {}
  }

  const memoryIndex = propertiesMemoryStore.findIndex(p => p.id === id || p._id === id);
  if (memoryIndex !== -1) {
    propertiesMemoryStore[memoryIndex] = {
      ...propertiesMemoryStore[memoryIndex],
      ...req.body
    };
    if (!updated) updated = propertiesMemoryStore[memoryIndex];
  }

  if (!updated) {
    return next(new ApiError(404, `Property with ID '${id}' not found`, 'PROPERTY_NOT_FOUND'));
  }

  return res.status(200).json({
    success: true,
    message: 'Property listing updated successfully',
    data: updated
  });
});

export const deleteProperty = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let existing = propertiesMemoryStore.find(p => p.id === id || p._id === id);
  if (req.user && req.user.role !== 'Admin' && existing && existing.owner_id && existing.owner_id !== req.user.id) {
    return next(new ApiError(403, 'You do not have permission to delete this property listing', 'UNAUTHORIZED_PROPERTY_DELETE'));
  }

  if (supabase) {
    try {
      const client = supabaseAdmin || supabase;
      await client
        .from('properties')
        .delete()
        .eq('id', id);
    } catch (err) {}
  }

  propertiesMemoryStore = propertiesMemoryStore.filter(p => p.id !== id && p._id !== id);

  return res.status(200).json({
    success: true,
    message: 'Property listing deleted successfully',
    id
  });
});
