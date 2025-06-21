const express = require("express");
const router = express.Router();
const { protect } = require('../middleware/authmiddleware');
const { checkout,payCheckout, finalize } = require("../controllers/checkoutController");


router.post("/", protect, checkout);
router.put("/:id/pay", protect, payCheckout);
router.post("/:id/finalize", protect, finalize);

module.exports = router;