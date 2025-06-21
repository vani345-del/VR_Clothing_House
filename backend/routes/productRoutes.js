// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const { createProduct,updateProduct, deleteProduct, queryFilters, bestSeller, newArrivals, categoryBased, singleProduct, categoryfilter,similarProducts, getFilteredProducts  } = require("../controllers/productController");
const { protect, admin } = require('../middleware/authmiddleware');

// POST /api/products - create a product (admin only)
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin,deleteProduct); 
router.get("/", queryFilters);
router.get("/best-seller", bestSeller);
router.get("/new-arrivals",newArrivals) ;
router.get("/new-arrivals/:category",categoryBased);// Assuming you want to use the same queryFilters for best-selling products
router.get("/:id",singleProduct)
router.get('/product',categoryfilter)// This route is for getting a single product by ID, you can implement it in the controller
router.get('/similar/:id',similarProducts)
router.get('/', getFilteredProducts); // This route is for getting similar products, you can implement it in the controller
module.exports = router;
