/**
 * Request Logger Middleware
 * Logs the method, URL, and timestamp for every agricultural query
 */

const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  // Log the request details
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  // Add timestamp to request object for potential use later
  req.requestTime = timestamp;
  
  next();
};

module.exports = requestLogger;
