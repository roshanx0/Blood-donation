const express = require("express");
const router = express.Router();
const {
  getPendingBloodBanks,
  approveBloodBank,
  rejectBloodBank,
  getAllBloodBanks,
  getAllUsers,
  getDashboardStats,
  getAllOrganizations,
  toggleOrganizationVerification,
  deleteOrganization,
  getAllCamps,
  toggleCampApproval,
  deleteCamp,
} = require("../controllers/adminController");
const { getAnalytics } = require("../controllers/analyticsController");
const { protect, adminOnly } = require("../middleware/auth");

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

router.get("/stats", getDashboardStats);
router.get("/analytics", getAnalytics);
router.get("/bloodbanks/pending", getPendingBloodBanks);
router.get("/bloodbanks", getAllBloodBanks);
router.put("/bloodbanks/:id/approve", approveBloodBank);
router.delete("/bloodbanks/:id/reject", rejectBloodBank);
router.get("/users", getAllUsers);

// Organization routes
router.get("/organizations", getAllOrganizations);
router.put("/organizations/:id/verify", toggleOrganizationVerification);
router.delete("/organizations/:id", deleteOrganization);

// Blood camp routes
router.get("/camps", getAllCamps);
router.put("/camps/:id/approve", toggleCampApproval);
router.delete("/camps/:id", deleteCamp);

module.exports = router;
