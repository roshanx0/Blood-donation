const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BloodBank = require('../models/BloodBank');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in cookies or Authorization header
    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request based on model type
      if (decoded.model === 'User') {
        req.user = await User.findById(decoded.id).select('-password');
        req.userType = 'user';
      } else if (decoded.model === 'BloodBank') {
        req.user = await BloodBank.findById(decoded.id).select('-password');
        req.userType = 'bloodbank';
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication',
    });
  }
};

// Admin only middleware
const adminOnly = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (req.userType !== 'user' || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authorization',
    });
  }
};

// Approved blood bank only middleware
const approvedBloodBankOnly = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (req.userType !== 'bloodbank') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Blood bank access only.',
      });
    }

    if (!req.user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your blood bank registration is pending approval.',
      });
    }

    next();
  } catch (error) {
    console.error('Blood bank middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authorization',
    });
  }
};

module.exports = { protect, adminOnly, approvedBloodBankOnly };