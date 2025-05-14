const express = require("express");
const authenticate = require("../middleware/authenticate");
const manageUsersController = require("../controllers/manageUsersController");

const router = express.Router();

router.post("/add", authenticate, manageUsersController.addUser);
router.delete("/delete/:id", authenticate, manageUsersController.deleteUser);

module.exports = router;
