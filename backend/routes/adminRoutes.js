const express = require('express');
const router = express.Router();
const {
  getPendingBloodBanks,
  approveBloodBank,
  rejectBloodBank,
  getAllBloodBanks,
  getAllUsers,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

router.get('/stats', getDashboardStats);
router.get('/bloodbanks/pending', getPendingBloodBanks);
router.get('/bloodbanks', getAllBloodBanks);
router.put('/bloodbanks/:id/approve', approveBloodBank);
router.delete('/bloodbanks/:id/reject', rejectBloodBank);
router.get('/users', getAllUsers);

module.exports = router;