const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { academicRecordUpload, cvUpload } = require('../config/file-storage');


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
   * get student profile by id
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
   * update student profile
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

  /**
   * getting complete student profile with skills
   * GET /api/profiles/:id/complete-student
   */
  router.get('/:id/complete-student', async (req, res, next) => {
    try {
      const profileId = req.params.id;
      const completeProfile = await profileService.getCompleteProfileWithSkills(profileId);
      res.json(completeProfile);
    } catch (error) {
      if (error.message === 'Profile not found') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      next(error);
    }
  });

  /**
   * adding courses to student profile
   * POST /api/profiles/:id/courses
   */
  router.post('/:id/courses', async (req, res, next) => {
    try {
      const profileId = req.params.id;
      const { courses } = req.body;
      
      if (!Array.isArray(courses) || courses.length === 0) {
        return res.status(400).json({ error: 'Valid courses array is required' });
      }
      
      const updatedCourses = await profileService.addCoursesToProfile(profileId, courses);
      
      res.status(201).json(updatedCourses);
    } catch (error) {
      if (error.message === 'Profile not found') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      if (error.message.includes('Invalid subject')) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  });

  /**
   * adding grades to student profile
   * POST /api/profiles/:id/grades
   */
  router.post('/:id/grades', async (req, res, next) => {
    try {
      const profileId = req.params.id;
      const { grades } = req.body;
      
      if (!Array.isArray(grades) || grades.length === 0) {
        return res.status(400).json({ error: 'Valid grades array is required' });
      }
      
      const updatedGrades = await profileService.addGradesToProfile(profileId, grades);
      
      res.status(201).json(updatedGrades);
    } catch (error) {
      if (error.message === 'Profile not found') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      if (error.message.includes('Invalid')) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  });

  /**
   * uploading academic record
   * POST /api/profiles/:id/upload-academic-record
   */
  router.post('/:id/upload-academic-record', academicRecordUpload.single('academicRecord'), async (req, res, next) => {
    try {
      const profileId = req.params.id;

      // validating permissions before uploading
      const isOwner = await profileService.isUserProfile(req.user.id, profileId);
      const isAdmin = req.user.role === 'ADMIN';
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: 'Not authorized to upload files for this profile' });
      }
      
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      // saving file path to profile - now using secure API endpoint path
      const filename = req.file.filename;
      const filePath = `/api/files/academic_records/${filename}`;
      
      const updatedProfile = await profileService.updateProfile(profileId, { 
        academicRecordPath: filePath 
      });
      
      // if parser integration is available and requested
      if (req.body.parseFile === 'true' && services.academicParserService) {
        try {
          const parsedData = await services.academicParserService.parseAcademicRecord(
            req.file.path,
            profileId
          );
          
          return res.json({ 
            profile: updatedProfile,
            parsedData
          });
        } catch (parseError) {
          console.error('Parser error:', parseError);
          return res.json({
            profile: updatedProfile,
            parseError: 'Failed to parse academic record. Please check file format.'
          });
        }
      }
      
      res.json({ profile: updatedProfile });
    } catch (error) {
      if (error.message === 'Profile not found') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      next(error);
    }
  });

  /**
   * uploading CV
   * POST /api/profiles/:id/upload-cv
   */
  router.post('/:id/upload-cv', cvUpload.single('cv'), async (req, res, next) => {
    try {
      const profileId = req.params.id;
      
      // validating permissions before uploading
      const isOwner = await profileService.isUserProfile(req.user.id, profileId);
      const isAdmin = req.user.role === 'ADMIN';
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: 'Not authorized to upload files for this profile' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      // saving file path to profile - now using secure API endpoint path
      const filename = req.file.filename;
      const filePath = `/api/files/cvs/${filename}`;
      
      const updatedProfile = await profileService.updateProfile(profileId, { 
        cvPath: filePath 
      });
      
      res.json({ profile: updatedProfile });
    } catch (error) {
      if (error.message === 'Profile not found') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      next(error);
    }
  });

  return router;
};
