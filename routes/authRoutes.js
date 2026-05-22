const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/Sinup", (req, res) => {
  res.render("Sinup", {
    error: null
  });
});

router.post("/Sinup", authController.signup);
module.exports = router;
