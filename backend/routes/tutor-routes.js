const express = require('express');
const router = express.Router();

/**
 * tutor routes implementation
 * 
 * @param {Object} services - initialized services
 * @returns {Object} router instance
 */
module.exports = function(services) {
  const { tutorService } = services;

  /**
   * getting all tutors
   * GET /api/tutors
   */
  router.get('/', async (req, res, next) => {
    try {
      // checking if user has admin or teacher role
      if (req.user.role !== 'ADMIN' && req.user.role !== 'TEACHER') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      const tutors = await tutorService.getAllTutors();
      res.json(tutors);
    } catch (error) {
      next(error);
    }
  });

  /**
   * getting a tutor by id
   * GET /api/tutors/:id
   */
  router.get('/:id', async (req, res, next) => {
    try {
      const tutorId = req.params.id;
      const tutor = await tutorService.getTutorById(tutorId);
      res.json(tutor);
    } catch (error) {
      if (error.message === 'Tutor not found') {
        return res.status(404).json({ error: 'Tutor not found' });
      }
      next(error);
    }
  });

  /**
   * creating a new tutor
   * POST /api/tutors
   */
  router.post('/', async (req, res, next) => {
    try {
      // checking if user has admin role
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      const tutorData = req.body;
      
      // validating required fields
      if (!tutorData.id || !tutorData.userId || !tutorData.firstName || !tutorData.lastName) {
        return res.status(400).json({ error: 'Required fields missing' });
      }
      
      const tutor = await tutorService.createTutor(tutorData);
      res.status(201).json(tutor);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: 'User not found' });
      }
      next(error);
    }
  });

  /**
   * updating a tutor
   * PUT /api/tutors/:id
   */
  router.put('/:id', async (req, res, next) => {
    try {
      const tutorId = req.params.id;
      const tutorData = req.body;
      
      // getting tutor to check permissions
      const tutor = await tutorService.getTutorById(tutorId);
      
      // checking if user has admin role or is the tutor themselves
      const isAdmin = req.user.role === 'ADMIN';
      const isTutor = req.user.role === 'TEACHER' && tutor.userId === req.user.id;
      
      if (!isAdmin && !isTutor) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      const updatedTutor = await tutorService.updateTutor(tutorId, tutorData);
      res.json(updatedTutor);
    } catch (error) {
      if (error.message === 'Tutor not found') {
        return res.status(404).json({ error: 'Tutor not found' });
      }
      next(error);
    }
  });

  /**
   * getting students assigned to a tutor
   * GET /api/tutors/:id/students
   */
  router.get('/:id/students', async (req, res, next) => {
    try {
      const tutorId = req.params.id;
      
      // getting tutor to check permissions
      const tutor = await tutorService.getTutorById(tutorId);
      
      // checking if user has admin role or is the tutor themselves
      const isAdmin = req.user.role === 'ADMIN';
      const isTutor = req.user.role === 'TEACHER' && tutor.userId === req.user.id;
      
      if (!isAdmin && !isTutor) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      const students = await tutorService.getTutorStudents(tutorId);
      res.json(students);
    } catch (error) {
      if (error.message === 'Tutor not found') {
        return res.status(404).json({ error: 'Tutor not found' });
      }
      next(error);
    }
  });

  /**
   * searching students by name
   * GET /api/tutors/search-students
   */
  router.get('/search-students', async (req, res, next) => {
    try {
      const { name } = req.query;
      
      if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: 'Search term must be at least 2 characters' });
      }
      
      const students = await tutorService.searchStudentsByName(name);
      
      res.json(students);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
