const express = require("express");
const router = express.Router();
const {
  allOrders,
  orderDetails,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
// Route to get all orders for the authenticated user
router.get("/my-orders", protect, allOrders);   
// Route to get order details by ID
router.get("/:id", protect, orderDetails);

module.exports = router;