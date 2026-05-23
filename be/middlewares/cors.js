export function corsMiddleware(req, res, next) {
  const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
  const requestOrigin = req.headers.origin;

  if (!requestOrigin || requestOrigin === allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin || allowedOrigin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
}
