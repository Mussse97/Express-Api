
const validationMiddleware = (req, res, next) => {
    const { name, email } = req.body;
  
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
  
    next(); // Fortsätt till nästa middleware eller route-handler
  };
  
  module.exports = validationMiddleware;
  