const express = require('express');
const router = express.Router();

/**
 * skill routes implementation
 * 
 * @param {Object} services - initialized services
 * @returns {Object} router instance
 */
module.exports = function(services) {
  const { skillService } = services;

  /**
   * get all skills
   * GET /api/skills
   */
  router.get('/', async (req, res, next) => {
    try {
      const skills = await skillService.getAllSkills();
      res.json(skills);
    } catch (error) {
      next(error);
    }
  });

  /**
   * get skills for a profile
   * GET /api/profiles/:id/skills
   */
  router.get('/profiles/:id/skills', async (req, res, next) => {
    try {
      const profileId = req.params.id;
      const skills = await skillService.getProfileSkills(profileId);
      res.json(skills);
    } catch (error) {
      if (error.message === 'Profile not found') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      next(error);
    }
  });

  /**
   * initialize skills for a profile
   * POST /api/profiles/:id/skills/initialize
   */
  router.post('/profiles/:id/skills/initialize', async (req, res, next) => {
    try {
      const profileId = req.params.id;
      const skills = await skillService.initializeSkillsForProfile(profileId);
      res.json(skills);
    } catch (error) {
      if (error.message === 'Profile not found') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      next(error);
    }
  });

  /**
   * update a specific skill for a profile
   * PUT /api/profiles/:id/skills/:skillId
   */
  router.put('/profiles/:id/skills/:skillId', async (req, res, next) => {
    try {
      const { id: profileId, skillId } = req.params;
      const { skillLevel } = req.body;
      
      if (skillLevel === undefined) {
        return res.status(400).json({ error: 'Skill level is required' });
      }
      
      const updatedSkill = await skillService.updateProfileSkill(
        profileId,
        skillId,
        skillLevel
      );
      
      res.json(updatedSkill);
    } catch (error) {
      if (error.message === 'Profile skill not found') {
        return res.status(404).json({ error: 'Profile skill not found' });
      }
      if (error.message.includes('Skill level must be between')) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  });

  /**
   * bulk update skills for a profile (self-assessment)
   * PUT /api/profiles/:id/skills
   */
  router.put('/profiles/:id/skills', async (req, res, next) => {
    try {
      const profileId = req.params.id;
      const { skills } = req.body;
      
      if (!Array.isArray(skills)) {
        return res.status(400).json({ error: 'Skills array is required' });
      }
      
      const updatedSkills = await skillService.updateProfileSkills(profileId, skills);
      res.json(updatedSkills);
    } catch (error) {
      if (error.message === 'Profile not found') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      if (error.message.includes('Skill level for')) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  });

  return router;
};
