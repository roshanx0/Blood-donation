const express = require("express");
const router = express.Router();
const {
  registerOrganization,
  loginOrganization,
  getCurrentOrganization,
} = require("../controllers/organizationController");
const { protect } = require("../middleware/auth");

router.post("/register", registerOrganization);
router.post("/login", loginOrganization);
router.get("/me", protect, getCurrentOrganization);

module.exports = router;
