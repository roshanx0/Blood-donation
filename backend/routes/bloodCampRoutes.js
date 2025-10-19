const express = require("express");
const router = express.Router();
const {
  createBloodCamp,
  getAllBloodCamps,
  getBloodCampById,
  registerForCamp,
  unregisterFromCamp,
  getMyCamps,
  getMyRegistrations,
  updateBloodCamp,
  deleteBloodCamp,
  verifyAttendance,
} = require("../controllers/bloodCampController");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/", getAllBloodCamps);

// Protected routes - specific routes must come before parameterized routes
router.post("/", protect, createBloodCamp);
router.get("/organization/my-camps", protect, getMyCamps);
router.get("/user/my-registrations", protect, getMyRegistrations);

// Parameterized routes (must come after specific routes)
router.get("/:id", getBloodCampById);
router.post("/:id/register", protect, registerForCamp);
router.post("/:id/unregister", protect, unregisterFromCamp);
router.post("/:id/verify-attendance", protect, verifyAttendance);
router.put("/:id", protect, updateBloodCamp);
router.delete("/:id", protect, deleteBloodCamp);

module.exports = router;
