const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
// ✅ Test Protected Route (to verify access token)
router.get("/me", protect, (req, res) => {
  res.json({ message: "Token verified ✅", user: req.user });
});

module.exports = router;
 // ✅ Make sure this is a Router object
