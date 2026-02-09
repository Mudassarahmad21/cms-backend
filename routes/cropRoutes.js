const express = require("express");
const { createCrop, getCrops, updateCrop, deleteCrop } = require("../controllers/cropController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCrops);
router.post("/", protect, authorize("FARMER", "ADMIN"), createCrop);
router.put("/:id", protect, authorize("FARMER", "ADMIN"), updateCrop);
router.delete("/:id", protect, authorize("ADMIN"), deleteCrop);

module.exports = router;