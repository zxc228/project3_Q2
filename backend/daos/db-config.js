const dbConfig = {
  development: {
    user: 'postgres',
    host: '188.225.14.199',
    database: 'p3q2database',
    password: 'HSfdk9Rs', // I am definitely not including the actual password here, bc this file goes to the github, but on the server it will be defined here, which it not the best practice, but will work for our purposes
    port: 5432,
    ssl: false
  },
  
  production: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false }
  }
};


function getDatabaseConfig() {
  const environment = process.env.NODE_ENV || 'development';
  return dbConfig[environment] || dbConfig.development;
}

module.exports = {
  getDatabaseConfig
};
