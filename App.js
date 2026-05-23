const express = require("express");
const cors = require("cors");
const session = require("express-session");
const moment = require("moment");
const dotenv = require("dotenv");

const Customer = require("./modle/customer");
const mongoose = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const logRoutes = require("./routes/logRoutes");
const userRoutes = require("./routes/userRoutes");
const signout = require("./routes/Signout");

dotenv.config();
const app = express();


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



app.set("view engine", "ejs");
app.use(express.static("public"));



app.use("/", authRoutes);
app.use("/", logRoutes);
app.use("/", signout);
app.use("/", userRoutes);


app.post("/user/add", async (req, res) => {
  try {
    await Customer.create({
      ...req.body,
      userId: req.session.user?.id
    });

    res.redirect("/index");

  } catch (err) {
    console.log(err);
    res.send("Error occurred");
  }
});


app.get("/user/:id", async (req, res) => {
  const user = await Customer.findById(req.params.id);

  res.render("user/view", {
    user,
    moment,
    name: req.session.user?.name
  });
});



app.post("/user/delete/:id", async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.redirect("/index");
});



app.post("/user/update/:id", async (req, res) => {
  await Customer.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/index");
});



app.get("/search", async (req, res) => {
  const users = await Customer.find({
    FirstName: {
      $regex: req.query.search,
      $options: "i"
    }
  });

  res.render("index", {
    arr: users,
    moment,
    name: req.session.user?.name
  });
});

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});