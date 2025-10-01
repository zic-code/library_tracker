// isLoggedin Middleware
require("dotenv").config()
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "secret-dev-key";

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;

    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s/i, "").trim();
      const payload = jwt.verify(token, SECRET_KEY);
      res.locals.user = payload;
    }
    return next();

  } catch (err) {
    return next(); 
  }
}

function ensureLoggedIn(req, res, next) {
  if (!res.locals.user) {

    const err = new Error("Unauthorized: Please log in");
    err.status = 401;
    return next(err);
  }
  return next();
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn
}