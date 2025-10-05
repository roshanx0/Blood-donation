const express = require('express');
const router = express.Router();
const aiChatbot = require('../services/aiChatbotService');
const { protect } = require('../middleware/auth');

// AI Chatbot endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    // Get user context if authenticated
    let userContext = null;
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (token) {
      // User is logged in, get their context (optional middleware)
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.model === 'User') {
          const User = require('../models/User');
          const user = await User.findById(decoded.id).select('name bloodType city role');
          if (user) {
            userContext = {
              name: user.name,
              bloodType: user.bloodType,
              city: user.city,
              role: user.role,
            };
          }
        }
      } catch (error) {
        // User not authenticated, continue without context
      }
    }

    // Generate AI response
    const response = await aiChatbot.generateResponse(
      message,
      conversationHistory || [],
      userContext
    );

    res.status(200).json({
      success: true,
      response,
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message',
    });
  }
});

module.exports = router;