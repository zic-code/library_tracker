//nodejs express entry point
//app.js
require("dotenv").config()
const express = require("express");
const cors = require("cors");

// DB CONNECT
const db = require("./db")

const authRoutes = require("./routes/auth");
const UserRoutes = require("./routes/users")
const { authenticateJWT } = require("./middleware/auth")
const bookRoutes = require("./routes/books")
const myBookRoutes = require("./routes/mybooks");
const reviewRoutes = require("./routes/reviews");
const homeRoutes = require('./routes/home');
// const DATABASE_URL = process.env.DATABASE_URL;

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://library-frontend-xxxx.onrender.com"], // 프론트 주소들
  credentials: true
}));
app.use(express.json());
app.use(authenticateJWT);

app.use((req, res, next) => {
  console.log(`Reqest received ${req.method} ${req.path}`);
  next();
});

app.use('/home', homeRoutes);
app.use("/auth", authRoutes);
app.use("/users", UserRoutes);
app.use("/books", bookRoutes);
app.use("/mybooks", myBookRoutes);
app.use("/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("library app backend Running");
});

app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  return res.status(status).json({
    error: { message, status }
  });
});

app.listen(5000, () => {
  console.log(`Server is running on ${db.connectionParameters.database}`)
})

module.exports = app;
