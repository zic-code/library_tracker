//  postgresql connection configuration

const { Client } = require("pg");
require("dotenv").config();

const db = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql:///library_db",
});

db.connect();

module.exports = db;
