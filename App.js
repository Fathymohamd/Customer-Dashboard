const express = require("express");
const cors = require("cors");
const session = require("express-session");
const moment = require("moment");
const dotenv = require("dotenv");
const compression = require("compression");

const Customer = require("./modle/customer");
const mongoose = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const logRoutes = require("./routes/logRoutes");
const userRoutes = require("./routes/userRoutes");
const signout = require("./routes/Signout");

dotenv.config();

const app = express(); 


app.use(compression());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// view engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// routes
app.use("/", authRoutes);
app.use("/", logRoutes);
app.use("/", signout);
app.use("/", userRoutes);

// home route
app.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("index", {
    name: req.session.user.name,
    moment
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
mongoose()