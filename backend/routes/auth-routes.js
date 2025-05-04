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

  /**
   * request password reset
   * POST /api/auth/forgot-password
   */
  router.post('/forgot-password', async (req, res, next) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      // In a real implementation, this would send a reset link by email
      // For now, we'll just generate a token and return it
      const resetToken = await authService.generatePasswordResetToken(email);
      
      // In real prod implementation, you would send an email
      // For this prototype, we'll just return the token
      res.json({ 
        message: 'Password reset link has been sent to your email',
        // REMOVE THIS IN PRODUCTION - only for development/testing
        token: resetToken
      });
    } catch (error) {
      if (error.message === 'User not found') {
        // Return same message even if user not found for security
        return res.json({ message: 'Password reset link has been sent to your email' });
      }
      next(error);
    }
  });

  /**
   * reset password
   * POST /api/auth/reset-password
   */
  router.post('/reset-password', async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
      }
      
      // Reset the password
      await authService.resetPassword(token, newPassword);
      
      res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
      if (error.message === 'Invalid or expired token') {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
      next(error);
    }
  });

  return router;
};
