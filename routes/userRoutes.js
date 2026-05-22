const express = require("express");
const router = express.Router();


const userController = require("../controllers/RouterController");
router.get("/index", userController.createUser);
module.exports = router;


const App = require("../controllers/RouterController")
router.get("/user/add.html" , App.app)
module.exports = router


const authenticationAction = require("../controllers/RouterController")
router.get("/" ,authenticationAction.authentication)
module.exports = router

const usresearch = require("../controllers/RouterController")
router.get("/" , usresearch.search)
module.exports = router

const useredit = require("../controllers/RouterController")
router.get("/user/edit/:id", usresearch.Useredit)
module.exports = router

