const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { initializeDAOs } = require('./DAOs/dao-index');
const { getDatabaseConfig } = require('./DAOs/db-config');
const { initializeServices } = require('./services/service-index');
const registerRoutes = require('./routes/routes-index');

/**
 * initializing express application with all dependencies
 * 
 * @returns {Object} configured express app
 */
function setupApp() {
  // creating express app
  const app = express();
  
  // applying middlewares
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));
  
  // initializing DAOs and services
  const dbConfig = getDatabaseConfig();
  const daos = initializeDAOs(dbConfig);
  const services = initializeServices(daos);
  
  // storing DAOs and services for cleanup
  app.locals.daos = daos;
  app.locals.services = services;
  
  // registering API routes
  registerRoutes(app, services);
  
  // serving static files (like PDFs) if needed
  app.use('/reports', express.static('public/reports'));
  
  return app;
}

/**
 * starting the server
 * 
 * @param {number} port - port to listen on
 */
function startServer(port = process.env.PORT || 3000) {
  const app = setupApp();
  
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
  // handling graceful shutdown
  process.on('SIGTERM', () => shutdown(server, app));
  process.on('SIGINT', () => shutdown(server, app));
  
  return server;
}

/**
 * shutting down the server gracefully
 * 
 * @param {Object} server - http server instance
 * @param {Object} app - express app
 */
async function shutdown(server, app) {
  console.log('Shutting down server...');
  
  server.close(async () => {
    console.log('Server closed.');
    
    // closing database connections
    if (app.locals.daos) {
      await app.locals.daos.closeConnections();
      console.log('Database connections closed.');
    }
    
    process.exit(0);
  });
  
  // force close if it takes too long
  setTimeout(() => {
    console.error('Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 10000);
}

// directly start server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = {
  setupApp,
  startServer
};
