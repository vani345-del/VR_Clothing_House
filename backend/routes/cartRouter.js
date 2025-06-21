const express = require("express");
const router = express.Router();
const { protect } = require('../middleware/authmiddleware');
const { addProductToCart, updateProductQuantity, deleteItem, getUserCart, mergeCart } = require('../controllers/CartController');

// @route   POST /api/cart
// @desc    Add a product to the cart for guest or logged-in user
// @access  Public
router.post("/", addProductToCart);
router.put('/', updateProductQuantity);
router.delete('/', deleteItem);
router.get('/', getUserCart);
router.post('/merge',protect,mergeCart)


module.exports = router;
