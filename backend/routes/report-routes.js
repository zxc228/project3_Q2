const express = require('express');
const router = express.Router();

/**
 * report routes implementation
 * 
 * @param {Object} services - initialized services
 * @returns {Object} router instance
 */
module.exports = function(services) {
  const { reportService } = services;

  /**
   * list reports for a profile
   * GET /api/profiles/:id/reports
   */
  router.get('/profiles/:id/reports', async (req, res, next) => {
    try {
      const profileId = req.params.id;
      const reports = await reportService.getCareerReportsByProfileId(profileId);
      res.json(reports);
    } catch (error) {
      next(error);
    }
  });

  /**
   * get report details
   * GET /api/reports/:id
   */
  router.get('/:id', async (req, res, next) => {
    try {
      const reportId = req.params.id;
      const report = await reportService.getCareerReportById(reportId);
      res.json(report);
    } catch (error) {
      if (error.message === 'Report not found') {
        return res.status(404).json({ error: 'Report not found' });
      }
      next(error);
    }
  });

  /**
   * create a new report
   * POST /api/reports
   */
  router.post('/', async (req, res, next) => {
    try {
      const { profileId, recommendation, additionalInfo } = req.body;
      
      if (!profileId || !recommendation) {
        return res.status(400).json({ 
          error: 'Profile ID and recommendation data are required' 
        });
      }
      
      const report = await reportService.createCareerReport(
        profileId,
        recommendation,
        additionalInfo || ''
      );
      
      res.status(201).json(report);
    } catch (error) {
      if (error.message === 'Invalid recommendation data') {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  });

  /**
   * update skill assessment
   * PUT /api/reports/:reportId/assessments/:id
   */
  router.put('/:reportId/assessments/:id', async (req, res, next) => {
    try {
      const { id: assessmentId } = req.params;
      const assessmentData = req.body;
      
      if (!assessmentData) {
        return res.status(400).json({ error: 'Assessment data is required' });
      }
      
      const updatedAssessment = await reportService.updateSkillAssessment(
        assessmentId,
        assessmentData
      );
      
      res.json(updatedAssessment);
    } catch (error) {
      next(error);
    }
  });

  /**
   * generate PDF for a report
   * GET /api/reports/:id/pdf
   */
  router.get('/:id/pdf', async (req, res, next) => {
    try {
      const reportId = req.params.id;
      const pdfUrl = await reportService.generatePDFReport(reportId);
      
      res.json({ pdfUrl });
    } catch (error) {
      if (error.message === 'Report not found') {
        return res.status(404).json({ error: 'Report not found' });
      }
      next(error);
    }
  });

  return router;
};
