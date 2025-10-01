// login/signup api

const express = require("express");
const router = express.Router();
const { createToken } = require("../helpers/token");
const User = require("../models/User")
const ExpressError = require("../helpers/expressError")

router.post("/register", async (req, res, next) => {
  try {
    
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      throw new ExpressError("Missing required Fields", 400)
    }
    const user = await User.register({username, email, password})
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
  
})

router.post("/login", async (req, res, next) => {
  try {
    console.log(" POST /auth/login 도달");
    const { username, password } = req.body;
    console.log(username,password)
    if (!username || !password) {
      throw new ExpressError("Username and password required", 400);
    }

    const user = await User.authenticate(username, password)
    console.log("")
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);  
  }
});

module.exports = router;