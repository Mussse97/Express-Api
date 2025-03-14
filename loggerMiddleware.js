// middleware/loggerMiddleware.js
const loggerMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Fortsätt till nästa middleware eller route-handler
  };
  
  module.exports = loggerMiddleware;
  