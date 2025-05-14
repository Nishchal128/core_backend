const express = require("express");
const authenticate = require("../middleware/authenticate");
const attendanceController = require("../controllers/attendanceController");

const router = express.Router();

router.post("/mark", authenticate, attendanceController.markAttendance);

module.exports = router;
