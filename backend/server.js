require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Import your configuration and initialization functions
const { initializeDAOs } = require('./daos/dao-index');
const { getDatabaseConfig } = require('./daos/db-config');
const { initializeServices } = require('./services/service-index');
const registerRoutes = require('./routes/routes-index');

// Create Express app
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json()); // replacement for bodyParser.json()
app.use(morgan("dev"));

// Initialize your DAOs and services
const dbConfig = getDatabaseConfig();
const daos = initializeDAOs(dbConfig);
const services = initializeServices(daos);

// Store DAOs and services for cleanup
app.locals.daos = daos;
app.locals.services = services;

// Register all routes using your routes index
registerRoutes(app, services);

// Serve static files if needed
app.use('/reports', express.static('public/reports'));

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));

// Graceful shutdown handling
process.on('SIGTERM', () => shutdown(server, app));
process.on('SIGINT', () => shutdown(server, app));

// Shutdown function (added later)
async function shutdown(server, app) {
  console.log('Shutting down server...');
  
  server.close(async () => {
    console.log('Server closed.');
    
    // Close database connections
    if (app.locals.daos) {
      await app.locals.daos.closeConnections();
      console.log('Database connections closed.');
    }
    
    process.exit(0);
  });
  
  // Force close if it takes too long
  setTimeout(() => {
    console.error('Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 10000);
}