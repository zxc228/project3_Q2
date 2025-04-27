const express = require('express');
const router = express.Router();

/**
 * profile routes implementation
 * 
 * @param {Object} services - initialized services
 * @returns {Object} router instance
 */
module.exports = function(services) {
  const { profileService } = services;

  /**
   * user login
   * POST /api/profiles/login
   */
  router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      const userData = await profileService.authenticateUser(email, password);
      res.json(userData);
    } catch (error) {
      if (error.message === 'User not found' || error.message === 'Invalid password') {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      next(error);
    }
  });

  /**
   * get profile by id
   * GET /api/profiles/:id
   */
  router.get('/:id', async (req, res, next) => {
    try {
      const profileId = req.params.id;
      const profile = await profileService.getCompleteProfile(profileId);
      res.json(profile);
    } catch (error) {
      if (error.message === 'Profile not found') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      next(error);
    }
  });

  /**
   * update profile
   * PUT /api/profiles/:id
   */
  router.put('/:id', async (req, res, next) => {
    try {
      const profileId = req.params.id;
      const profileData = req.body;
      
      // validating required fields
      if (!profileData) {
        return res.status(400).json({ error: 'Profile data is required' });
      }
      
      const updatedProfile = await profileService.updateProfile(profileId, profileData);
      res.json(updatedProfile);
    } catch (error) {
      if (error.message === 'Profile not found') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      if (error.message === 'Invalid degree selected') {
        return res.status(400).json({ error: 'Invalid degree selected' });
      }
      next(error);
    }
  });

  return router;
};
