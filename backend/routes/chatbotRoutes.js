const express = require("express");
const router = express.Router();
const aiChatbot = require("../services/aiChatbotService");
const { protect } = require("../middleware/auth");

// AI Chatbot endpoint
router.post("/chat", async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    // Validate message
    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid message is required",
        response: {
          message: "Please provide a message to chat! 💬",
          quickReplies: [
            "Find Blood Banks",
            "Check Eligibility",
            "Donation Tips",
            "Help",
          ],
          timestamp: new Date(),
        },
      });
    }

    // Validate message length
    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Message too long (max 500 characters)",
        response: {
          message:
            "Your message is too long. Please keep it under 500 characters. 📝",
          quickReplies: [
            "Find Blood Banks",
            "Check Eligibility",
            "Donation Tips",
            "Help",
          ],
          timestamp: new Date(),
        },
      });
    }

    // Validate conversation history
    let validHistory = [];
    if (Array.isArray(conversationHistory)) {
      validHistory = conversationHistory
        .slice(-10)
        .filter((msg) => msg && msg.type && msg.message);
    }

    // Get user context if authenticated
    let userContext = null;
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (token) {
      try {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.model === "User") {
          const User = require("../models/User");
          const user = await User.findById(decoded.id).select(
            "name bloodType city role"
          );
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
        // User not authenticated or token invalid, continue without context
        console.log("User context not available:", error.message);
      }
    }

    // Generate AI response with timeout
    const responsePromise = aiChatbot.generateResponse(
      message,
      validHistory,
      userContext
    );

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 15000)
    );

    const response = await Promise.race([responsePromise, timeoutPromise]);

    // Ensure response has required fields
    if (!response || !response.message) {
      throw new Error("Invalid response from chatbot service");
    }

    res.status(200).json({
      success: true,
      response: {
        message: response.message,
        quickReplies: response.quickReplies || ["Find Blood Banks", "Help"],
        timestamp: response.timestamp || new Date(),
      },
    });
  } catch (error) {
    console.error("Chatbot API error:", error.message);

    // Provide helpful error response
    const errorResponse = {
      message:
        "I'm experiencing some technical difficulties right now. 😔\n\nPlease try:\n- Refreshing the page\n- Rephrasing your question\n- Trying again in a moment\n\nOr use these quick options:",
      quickReplies: [
        "Find Blood Banks",
        "Check Eligibility",
        "Donation Tips",
        "Help",
      ],
      timestamp: new Date(),
    };

    res.status(500).json({
      success: false,
      message: "Chatbot service error",
      response: errorResponse,
    });
  }
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Chatbot service is running",
    aiAvailable: aiChatbot.aiAvailable || false,
    timestamp: new Date(),
  });
});

module.exports = router;
