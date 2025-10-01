//user query logic
//Models/User.js

const db = require("../db");
const bcrypt = require("bcrypt")
const ExpressError = require("../helpers/expressError")
const BCRYPT_WORK_FACTOR = Number(process.env.BCRYPT_WORK_FACTOR || 12);

async function register({ username, email, password }) {
  if (!username || !email || !password) {
    throw new ExpressError("Missing required fields", 400);
  }
  const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

  const result = await db.query(
    `INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, username, email`,
    [username, email, hashedPassword]
  );
  return result.rows[0];
}

async function authenticate(username, password) {
  const result = await db.query(
    `SELECT id, username, email, password FROM users WHERE username = $1`,
    [username]
  );

  const user = result.rows[0];

  if (!user) {
    throw new ExpressError("Invalid username/password", 401);
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new ExpressError("Invalid username/password", 401);
  }

  delete user.password;
  return user;
}

async function getById(id) {
  const result = await db.query(
    `SELECT id, username, email FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

module.exports = {
  register,
  authenticate,
  getById
};