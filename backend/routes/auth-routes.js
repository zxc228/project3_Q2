const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { sendEmail } = require('../utils/mail');
const bcrypt = require('bcryptjs');

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

      if (!userData.id || !userData.email || !userData.password || !userData.role) {
        return res.status(400).json({ 
          error: "Fill in all required fields (id, email, password, role)" 
        });
      }

     
      const user = await authService.registerUser(userData);

      
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      await pool.query(`
        INSERT INTO email_verifications (email, token)
        VALUES ($1, $2)
        ON CONFLICT (email) DO UPDATE SET token = $2, created_at = NOW()
      `, [userData.email, verifyCode]);

     
      await sendEmail(
        userData.email,
        'Your U-TAD verification code',
        `Welcome! Your email verification code is: ${verifyCode}`
      );
      

      res.status(201).json({
        user,
        message: 'User registered. Verification email has been sent.'
      });
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

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      

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
   */
  router.post('/forgot-password', async (req, res, next) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
  
      
      const userCheck = await pool.query(
        `SELECT 1 FROM "User" WHERE email = $1`,
        [email]
      );
  
      if (userCheck.rowCount === 0) {
       
        return res.json({ message: 'Password reset email has been sent' });
      }
  
      
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  
      
      await pool.query(`
        INSERT INTO password_resets (email, code)
        VALUES ($1, $2)
        ON CONFLICT (email) DO UPDATE SET code = $2, created_at = NOW()
      `, [email, resetCode]);
  
      
      await sendEmail(
        email,
        'U-TAD Password Reset',
        `Use this code to reset your password: ${resetCode}`
      );
  
      res.json({
        message: 'Password reset email has been sent'
      });
  
    } catch (error) {
      next(error);
    }
  });
  
  /**
   * reset password
   */
  router.post('/reset-password', async (req, res, next) => {
    try {
      const { email, code, newPassword } = req.body;
  
      if (!email || !code || !newPassword) {
        return res.status(400).json({ error: 'Email, code, and new password are required' });
      }
  
      
      const result = await pool.query(`
        SELECT * FROM password_resets
        WHERE email = $1 AND code = $2 AND created_at > NOW() - INTERVAL '1 hour'
      `, [email, code]);
  
      if (result.rowCount === 0) {
        return res.status(400).json({ error: 'Invalid or expired code' });
      }
  
      
      const hash = await bcrypt.hash(newPassword, 10);
  
      // Обновляем пароль
      await pool.query(`
        UPDATE "User" SET passwordhash = $1 WHERE email = $2
      `, [hash, email]);
  
      
      await pool.query(`DELETE FROM password_resets WHERE email = $1`, [email]);
  
      res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
      next(error);
    }
  });
  

  /**
   * verify email
   */
  router.post('/verify-email', async (req, res, next) => {
    const { email, code } = req.body;
  
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }
  
    try {
      const result = await pool.query(`
        SELECT email FROM email_verifications
        WHERE email = $1 AND token = $2 AND created_at > NOW() - INTERVAL '1 day'
      `, [email, code]);
  
      if (result.rowCount === 0) {
        return res.status(400).json({ error: 'Invalid or expired verification code' });
      }
  
      await pool.query(`UPDATE "User" SET verify = true WHERE email = $1`, [email]);
      await pool.query(`DELETE FROM email_verifications WHERE email = $1`, [email]);
  
      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      next(error);
    }
  });
  

 

  return router;
};
