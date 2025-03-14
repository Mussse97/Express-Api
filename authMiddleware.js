// middleware/authMiddleware.js
const API_KEY = "musseNyckel"; 

const authMiddleware = (req, res, next) => {
  const userApiKey = req.headers["x-api-key"];
  
  if (!userApiKey || userApiKey !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid API key" });
  }
  
  next(); // Fortsätt till nästa middleware eller route-handler
};

module.exports = authMiddleware;
