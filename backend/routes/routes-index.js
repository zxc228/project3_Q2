const profileRoutes = require('./profile-routes');
const skillRoutes = require('./skill-routes');
const careerRoutes = require('./career-routes');
const reportRoutes = require('./report-routes');

/**
 * registering all API routes
 * 
 * @param {Object} app - express app instance
 * @param {Object} services - initialized services
 */
module.exports = function(app, services) {
  // applying authentication middleware if needed
  // app.use('/api', authMiddleware);
  
  // registering route handlers
  app.use('/api/profiles', profileRoutes(services));
  app.use('/api/skills', skillRoutes(services));
  app.use('/api/careers', careerRoutes(services));
  app.use('/api/reports', reportRoutes(services));
  
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
