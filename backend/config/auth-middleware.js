// this is the middleware for authenticating requests with JWT tokens
function authMiddleware(authService) {
  return (req, res, next) => {
    // extracting token from authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN format
    
    // checking if token exists
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }
    
    try {
      // verifying token validity
      const decoded = authService.verifyToken(token);
      
      // attaching user information to request
      req.user = decoded;
      
      // proceeding to the next middleware or route handler
      next();
    } catch (error) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
  };
}

module.exports = authMiddleware;
