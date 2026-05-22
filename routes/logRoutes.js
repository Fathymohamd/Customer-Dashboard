
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController")
router.post("/Login" , userController.login)

router.get("/Login", (req, res) => {
  res.render("Login", {
    error: null
  });
});

module.exports = router;
