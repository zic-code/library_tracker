//helpers/token
//jwt token create

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY

function createToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    SECRET_KEY
  );
}

module.exports = { createToken }