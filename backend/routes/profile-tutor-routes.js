const express = require('express');
const router = express.Router();

/**
 * profile-tutor relationship routes
 * 
 * @param {Object} services - initialized services
 * @returns {Object} router instance
 */
module.exports = function(services) {
  const { tutorService } = services;

  /**
   * assigning a tutor to a student
   * PUT /api/profiles/:profileId/tutor
   */
  router.put('/:profileId/tutor', async (req, res, next) => {
    try {
      // checking if user has admin role
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      const { profileId } = req.params;
      const { tutorId } = req.body;
      
      if (!tutorId) {
        return res.status(400).json({ error: 'Tutor ID is required' });
      }
      
      const updatedProfile = await tutorService.assignTutorToStudent(profileId, tutorId);
      res.json(updatedProfile);
    } catch (error) {
      if (error.message === 'Profile not found' || error.message === 'Tutor not found') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  });

  /**
   * getting student's tutor
   * GET /api/profiles/:profileId/tutor
   */
  router.get('/:profileId/tutor', async (req, res, next) => {
    try {
      const { profileId } = req.params;
      
      const tutor = await tutorService.getStudentTutor(profileId);
      res.json(tutor);
    } catch (error) {
      if (error.message === 'Profile not found') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      if (error.message === 'No tutor assigned to this student') {
        return res.status(404).json({ error: 'No tutor assigned to this student' });
      }
      next(error);
    }
  });

  return router;
};
