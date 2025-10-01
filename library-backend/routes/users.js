//routes/users.js
const express = require("express");
const router = express.Router();
const { ensureLoggedIn } = require("../middleware/auth");
const User = require("../models/User");

router.get("/me", ensureLoggedIn, async (req, res, next) => {
  try {
    console.log(" /users/me 진입");
    console.log(" res.locals.user:", res.locals.user);
    const id = res.locals.user.id;
    const user = await User.getById(id);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;