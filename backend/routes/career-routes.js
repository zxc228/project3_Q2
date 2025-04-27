const express = require('express');
const router = express.Router();
;


/**
 * career routes implementation
 * 
 * @param {Object} services - initialized services
 * @returns {Object} router instance
 */
module.exports = function(services) {
  const { careerRecommendationService } = services;

  /**
   * get all career fields
   * GET /api/careers/fields
   */
  router.get('/fields', async (req, res, next) => {
    try {
      const fields = await careerRecommendationService.getCareerFields();
      res.json(fields);
    } catch (error) {
      next(error);
    }
  });

  /**
   * get career types for a field
   * GET /api/careers/fields/:id/types
   */
  router.get('/fields/:id/types', async (req, res, next) => {
    try {
      const fieldId = req.params.id;
      const types = await careerRecommendationService.getCareerTypesByField(fieldId);
      res.json(types);
    } catch (error) {
      next(error);
    }
  });

  /**
   * get career recommendations for a profile
   * GET /api/profiles/:id/recommendations
   */
  router.get('/profiles/:id/recommendations', async (req, res, next) => {
    try {
      const profileId = req.params.id;
      const { careerFieldId, careerType } = req.query;
      
      const options = {};
      if (careerFieldId) options.careerFieldId = careerFieldId;
      if (careerType) options.careerType = careerType;
      
      const recommendations = await careerRecommendationService.getCareerRecommendations(
        profileId,
        options
      );
      
      res.json(recommendations);
    } catch (error) {
      if (error.message === 'Profile not found') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      next(error);
    }
  });

  /**
   * get specific career recommendation for a profile
   * GET /api/profiles/:id/recommendations/:careerTypeId
   */
  router.get('/profiles/:id/recommendations/:careerTypeId', async (req, res, next) => {
    try {
      const { id: profileId, careerTypeId } = req.params;
      
      const recommendation = await careerRecommendationService.getSpecificCareerRecommendation(
        profileId,
        careerTypeId
      );
      
      res.json(recommendation);
    } catch (error) {
      if (error.message === 'Profile not found') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      if (error.message === 'Career type not found') {
        return res.status(404).json({ error: 'Career type not found' });
      }
      if (error.message === 'Career field not found') {
        return res.status(404).json({ error: 'Career field not found' });
      }
      next(error);
    }
  });
  router.get('/skills/:careerTypeId', async (req, res, next) => {
    try {
      const { careerTypeId } = req.params;
      const skills = await careerRecommendationService.getCareerSkillsByTypeId(careerTypeId);
      res.json(skills);
    } catch (error) {
      console.error('API Error:', error);
      next(error);
    }
  });
  
  

  return router;
};
