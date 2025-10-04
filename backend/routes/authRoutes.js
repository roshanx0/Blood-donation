const express = require('express');
const router = express.Router();
const {
  registerUser,
  registerBloodBank,
  loginUser,
  loginBloodBank,
  getMe,
  logout,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// User routes
router.post('/register/user', registerUser);
router.post('/login/user', loginUser);

// Blood bank routes
router.post('/register/bloodbank', registerBloodBank);
router.post('/login/bloodbank', loginBloodBank);

// Common routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;