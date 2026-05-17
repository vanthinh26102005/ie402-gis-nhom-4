export function sendSuccess(res, data = null, meta = {}, statusCode = 200) {
  return res.status(statusCode).json({
    data,
    meta,
    error: null,
  });
}

export function sendList(res, items = [], meta = {}, statusCode = 200) {
  return sendSuccess(
    res,
    items,
    {
      total: items.length,
      ...meta,
    },
    statusCode,
  );
}

export function sendError(res, error) {
  const statusCode = error.statusCode || error.status || 500;
  const code = error.code || (statusCode === 404 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR");

  return res.status(statusCode).json({
    data: null,
    meta: {},
    error: {
      message: error.message || "Internal server error",
      code,
    },
  });
}
