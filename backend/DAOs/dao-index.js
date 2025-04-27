const { Pool } = require('pg');
const UserDAO = require('./user-dao');
const ProfileDAO = require('./profile-dao');
const AcademicDAO = require('./academic-dao');
const SkillsDAO = require('./skills-dao');
const CareerDAO = require('./career-dao');
const ReportDAO = require('./report-dao');
const AuthDao = require('./auth-dao');
const TutorDAO = require('./tutor-dao');

// initializing database connection and DAOs
function initializeDAOs(config) {
  // creating database connection pool
  const pool = new Pool({
    user: config.user,
    host: config.host,
    database: config.database,
    password: config.password,
    port: config.port,
    ssl: config.ssl
  });

  // initializing DAOs with the connection pool
  return {
    userDAO: new UserDAO(pool),
    profileDAO: new ProfileDAO(pool),
    academicDAO: new AcademicDAO(pool),
    skillsDAO: new SkillsDAO(pool),
    careerDAO: new CareerDAO(pool),
    reportDAO: new ReportDAO(pool),
    authDao: new AuthDao(pool),
    tutorDAO: new TutorDAO(pool),
    
    // method to close all connections when shutting down
    closeConnections: async () => {
      await pool.end();
    }
  };
}

module.exports = {
  initializeDAOs
};
