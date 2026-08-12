require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const moment = require("moment");
const compression = require("compression");
const mongoose = require("mongoose");

const Customer = require("./modle/customer");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const logRoutes = require("./routes/logRoutes");
const signout = require("./routes/Signout");

const app = express();

// =========================
// Middlewares
// =========================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(cors());

app.set("trust proxy", 1);

// =========================
// Session
// =========================

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret_key",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// =========================
// View Engine
// =========================

app.set("view engine", "ejs");

app.use(express.static("public"));

// =========================
// Authentication Routes
// =========================

app.use("/", logRoutes);
app.use("/", signout);
app.use("/", authRoutes);



app.get("/user/add", (req, res) => {
  res.render("user/add", {
    name: req.session.user?.name,
    
  });

});


app.post("/user/add", async (req, res) => {
  try {
    await Customer.create({
      ...req.body,
      userId: req.session.user?.id,
    });

    res.redirect("/index");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error occurred");
  }
});

app.get("/user/edit/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid User ID");
    }

    const user = await Customer.findById(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("user/edit", {
      user,
      name: req.session.user?.name,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Error occurred");
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid User ID");
    }

    const user = await Customer.findById(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("user/view", {
      user,
      moment,
      name: req.session.user?.name,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error occurred");
  }
});

// =========================
// Delete Customer
// =========================

app.post("/user/delete/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid User ID");
    }

    await Customer.findByIdAndDelete(req.params.id);

    res.redirect("/index");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error occurred");
  }
});

// =========================
// Update Customer
// =========================

app.post("/user/update/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid User ID");
    }

    await Customer.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    res.redirect("/index");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error occurred");
  }
});



app.get("/search", async (req, res) => {
  try {
    const search = req.query.search || "";

    const users = await Customer.find({
      FirstName: {
        $regex: search,
        $options: "i",
      },
    });

    res.render("index", {
      arr: users,
      moment,
      name: req.session.user?.name,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error occurred");
  }
});



app.get("/index", async (req, res) => {
  try {
    const users = await Customer.find();

    res.render("index", {
      arr: users,
      moment,
      name: req.session.user?.name,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error occurred");
  }
});



app.get("/", async (req, res) => {
  try {
    const users = await Customer.find();

    res.render("authentication", {
      arr: users,
      moment,
      name: req.session.user?.name,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error occurred");
  }
});



const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (err) {
    console.log("Failed to start server:", err);
  }
};

startServer();