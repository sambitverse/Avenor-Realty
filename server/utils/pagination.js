/**
 * Utility helper for pagination params and metadata response
 */
export const getPaginationParams = (query, defaultLimit = 12, maxLimit = 100) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
    from: offset,
    to: offset + limit - 1
  };
};

export const formatPaginationResponse = (data, totalCount, page, limit) => {
  const total = Number(totalCount) || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};
