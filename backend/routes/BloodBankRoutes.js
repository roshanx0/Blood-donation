const express = require("express");
const router = express.Router();
const {
  updateInventory,
  getInventory,
  getAllBloodBanks,
  getProfile,
  updateProfile,
  verifyDonation,
} = require("../controllers/bloodBankController");
const { protect, approvedBloodBankOnly } = require("../middleware/auth");

// Public routes
router.get("/", getAllBloodBanks);
router.get("/:id/inventory", getInventory);

// Protected routes (blood bank only - must be approved)
router.use(protect);
router.use(approvedBloodBankOnly);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/inventory", updateInventory);
router.post("/verify-donation", verifyDonation);

module.exports = router;
