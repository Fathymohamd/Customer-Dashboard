const Customer  = require("./modle/customer");
const moment = require("moment");
const express = require("express");
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const session = require("express-session");
const mongoose = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const logRoutes = require("./routes/logRoutes");
const userRoutes = require("./routes/userRoutes");
const signout = require("./routes/Signout");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(session({
  secret: process.env.DATABASE,
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



// Live Reload
const liveReloadServer = livereload.createServer();

app.use(connectLiveReload());

liveReloadServer.watch(__dirname + "/public");

liveReloadServer.watch(__dirname + "/views");


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
    user: user,
    moment: moment,
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
    moment: moment,
    name: req.session.user?.name
  });
});

app.listen(5000, () => {
 console.log("Server running 5000");

})
mongoose();