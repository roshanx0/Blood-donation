const express = require("express");
const router = express.Router();
const {
  registerUser,
  registerBloodBank,
  loginUser,
  loginBloodBank,
  getMe,
  updateProfile,
  getDonationHistory,
  addDonationRecord,
  logout,
  getUserById,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// User routes
router.post("/register/user", registerUser);
router.post("/login/user", loginUser);

// Blood bank routes
router.post("/register/bloodbank", registerBloodBank);
router.post("/login/bloodbank", loginBloodBank);

// Common routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

// Get user by ID (for blood banks to view donor info)
router.get("/users/:id", protect, getUserById);

// Donation history routes (Users only)
router.get("/donation-history", protect, getDonationHistory);
router.post("/donation-history", protect, addDonationRecord);

router.post("/logout", protect, logout);

module.exports = router;
