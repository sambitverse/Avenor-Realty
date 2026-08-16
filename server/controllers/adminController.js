import { supabase } from '../config/supabase.js';
import { INITIAL_PROPERTIES, INITIAL_ADMIN_ANALYTICS } from '../../src/data/mockData.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';

export const getAnalytics = asyncHandler(async (req, res, next) => {
  let totalProperties = INITIAL_PROPERTIES.length;
  let totalVolume = INITIAL_PROPERTIES.reduce((acc, p) => acc + (p.price || 0), 0);

  if (supabase) {
    try {
      const { count } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      if (count !== null) totalProperties = count;
    } catch (err) {}
  }

  const analytics = {
    ...INITIAL_ADMIN_ANALYTICS,
    overview: {
      totalProperties,
      totalVolume,
      activeLeads: 184,
      pendingInspections: 12,
      averageYield: '6.8%'
    }
  };

  return res.status(200).json({
    success: true,
    data: analytics
  });
});
