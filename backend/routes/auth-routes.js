const express = require('express');
const router = express.Router();

/**
 * authentication routes implementation
 * 
 * @param {Object} services - initialized services
 * @returns {Object} router instance
 */
module.exports = function(services) {
  const { authService } = services;

  /**
   * register a new user
   * POST /api/auth/register
   */
  router.post('/register', async (req, res, next) => {
    try {
      const userData = req.body;
      
      // validating required fields
      if (!userData.id || !userData.email || !userData.password || !userData.role) {
        return res.status(400).json({ 
          error: "Fill in all required fields (id, email, password, role)" 
        });
      }
      
      // registering new user
      const user = await authService.registerUser(userData);
      
      res.status(201).json({ user });
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message.includes('duplicate key')) {
        return res.status(409).json({ error: "User with this email already exists" });
      }
      next(error);
    }
  });

  /**
   * authenticate user and get token
   * POST /api/auth/login
   */
  router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      // validating required fields
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      // authenticating user
      const authData = await authService.authenticateUser(email, password);
      
      res.json(authData);
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: "Invalid login credentials" });
      }
      next(error);
    }
  });

  return router;
};
