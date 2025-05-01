// db.js
const { Pool } = require('pg');
require('dotenv').config();  // Import and configure dotenv

// Create a connection pool for PostgreSQL using environment variables
const pool = new Pool({
  user: process.env.DB_USER,      // Get the username from .env
  host: process.env.DB_HOST,      // Get the host from .env
  database: process.env.DB_NAME,  // Get the database name from .env
  password: process.env.DB_PASSWORD,  // Get the password from .env
  port: process.env.DB_PORT || 5432,  // Default to 5432 if DB_PORT is not set
});

module.exports = pool;
