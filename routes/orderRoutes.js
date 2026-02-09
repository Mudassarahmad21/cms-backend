const express = require("express");
const router = express.Router();
const { 
    createOrder, 
    getMyOrders, 
    getAllOrders, 
    updateOrderStatus 
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Client: Place and see own orders
router.post("/", protect, authorize("CLIENT"), createOrder);
router.get("/myorders", protect, authorize("CLIENT"), getMyOrders);

// Admin/Broker: See all and update status
router.get("/", protect, authorize("ADMIN", "BROKER"), getAllOrders);
router.put("/:id/status", protect, authorize("ADMIN", "BROKER"), updateOrderStatus);

module.exports = router;