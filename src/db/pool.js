const { Pool } = require("pg");
const config = require("../config");
const { logToFile } = require("../logger");

// Create a pool for PostgreSQL connection
const pool = new Pool({
  connectionString: config.databaseUrl,
});

// Connect to PostgreSQL and handle errors
pool.connect((err) => {
  if (err) {
    logToFile('Database connection error: ' + err.message);
  } else {
    logToFile('Database connected successfully.');
  }
});

module.exports = pool; 
