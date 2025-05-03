const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const PDFDocument = require("pdfkit");
const { Readable } = require("stream");

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
  

  router.get('/types/:careerTypeId/description', async (req, res, next) => {
    const { careerTypeId } = req.params;

    try {
      const query = `
        SELECT description
        FROM "CareerType"
        WHERE id = $1
      `;
      const result = await pool.query(query, [careerTypeId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Career type not found' });
      }

      return res.json({ description: result.rows[0].description });
    } catch (error) {
      console.error('DB Error:', error);
      next(error);
    }
  });
  /**
 * POST /api/careers/report
 * Получает массив topRecommendations и возвращает PDF отчёт
 */
  router.post("/report", async (req, res, next) => {
    const { topRecommendations } = req.body;

    if (!Array.isArray(topRecommendations) || topRecommendations.length === 0) {
      return res.status(400).json({ error: "Missing or invalid topRecommendations array" });
    }

    try {
      const doc = new PDFDocument();

      // Прокинуть PDF как stream
      const stream = new Readable();
      stream._read = () => {};
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=career_report.pdf");
      doc.pipe(res);

      doc.fontSize(18).text("Career Recommendation Report", { align: "center" });
      doc.moveDown(1);

      topRecommendations.forEach((rec, index) => {
        doc.fontSize(14).fillColor("black").text(`${index + 1}. ${rec.careerFieldName} (${rec.careerType})`, {
          underline: true,
        });

        doc.fontSize(12).fillColor("gray").text(`Fitness Score: ${(rec.fitnessScore / 5 * 100).toFixed(1)}%`, {
          indent: 10,
        });

        doc.fontSize(12).fillColor("black").text("Skills:", { indent: 10 });

        rec.skillAssessments.forEach(skill => {
          doc
            .fontSize(11)
            .text(`- ${skill.skillName}: Current ${skill.currentLevel}, Importance ${skill.importanceLevel}, Gap ${skill.gap}`, {
              indent: 20,
            });
        });

        doc.moveDown(1);
      });

      doc.end();
    } catch (err) {
      console.error("PDF generation error:", err);
      next(err);
    }
  });

  
  return router;
};
