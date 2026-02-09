const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/statsController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All roles can see stats, but usually restricted to Admin/Farmer/Broker
router.get("/", protect, authorize("ADMIN", "FARMER", "BROKER"), getDashboardStats);

module.exports = router;