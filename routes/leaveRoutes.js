const express = require("express");
const authenticate = require("../middleware/authenticate");
const leaveController = require("../controllers/leaveController");

const router = express.Router();

router.post("/", authenticate, leaveController.applyLeave);
router.get("/", authenticate, leaveController.fetchLeaves);
router.patch("/:leaveId", authenticate, leaveController.updateLeaveStatus);

module.exports = router;
