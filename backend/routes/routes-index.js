const profileRoutes = require('./profile-routes');
const skillRoutes = require('./skill-routes');
const careerRoutes = require('./career-routes');
const reportRoutes = require('./report-routes');
const authRoutes = require('./auth-routes');
const authMiddleware = require('../config/auth-middleware');
const tutorRoutes = require('./tutor-routes');
const profileTutorRoutes = require('./profile-tutor-routes');
const fileAccessRoutes = require('./file-access-routes');


/**
 * registering all API routes
 * 
 * @param {Object} app - express app instance
 * @param {Object} services - initialized services
 */
module.exports = function(app, services) {
  // public authentication routes (no auth required)
  app.use('/api/auth', authRoutes({ authService: services.authService }));


  
  // creating auth middleware with auth service
  const authenticate = authMiddleware(services.authService);
  
  // applying authentication middleware to protected routes
  app.use('/api/profiles', authenticate, profileRoutes(services));
  app.use('/api/profiles', authenticate, profileTutorRoutes(services));
  app.use('/api/skills', authenticate, skillRoutes(services));
  app.use('/api/careers', authenticate, careerRoutes(services));
  app.use('/api/reports', authenticate, reportRoutes(services));
  app.use('/api/tutors', authenticate, tutorRoutes(services));
  app.use('/api/files', authenticate, fileAccessRoutes(services));
  
  // catchall route for 404 errors
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });
  
  // global error handling middleware
  app.use((err, req, res, next) => {
    console.error('API Error:', err);
    res.status(err.status || 500).json({
      error: {
        message: err.message || 'Internal Server Error',
        // include stack trace in development only
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      }
    });
  });
};

