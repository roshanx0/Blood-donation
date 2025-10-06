const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/User");
const BloodBank = require("../models/BloodBank");
const Request = require("../models/Request");

class AIChatbotService {
  constructor() {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.warn(
        "⚠️ GEMINI_API_KEY not configured. Chatbot will use fallback responses."
      );
      this.aiAvailable = false;
    } else {
      try {
        // Initialize Gemini AI
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({
          model: "gemini-pro",
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        });
        this.aiAvailable = true;
        console.log("✅ AI Chatbot service initialized successfully");
      } catch (error) {
        console.error("❌ Failed to initialize AI:", error.message);
        this.aiAvailable = false;
      }
    }

    // System context for the AI
    this.systemContext = `You are BloodBot, an intelligent AI assistant for BloodLife - Kerala's premier blood donation management system.

🎯 YOUR ROLE:
- Help users find blood banks and donors quickly
- Answer questions about blood donation clearly
- Guide users through registration and blood requests
- Provide accurate eligibility information
- Give helpful pre and post-donation care tips
- Check blood availability in real-time
- Provide emergency assistance guidance
- Explain blood donation camps and events

📋 CRITICAL ELIGIBILITY CRITERIA:
- Age: 18-65 years
- Weight: Minimum 50kg
- Health: Good general health, no infections
- Wait Period: 3 months (90 days) between donations
- No recent surgery or medication
- Not pregnant or breastfeeding
- No recent tattoos/piercings (6 months)

🩸 BLOOD TYPES:
- A+ (most common), A-, B+, B-, AB+, AB-, O+, O- (universal donor)
- Universal Donor: O- (can donate to all)
- Universal Receiver: AB+ (can receive from all)

📍 CITIES COVERED:
Thrissur, Ernakulam, Kozhikode, Palakkad, Kottayam, Kollam, Thiruvananthapuram, Malappuram

⏱️ DONATION PROCESS:
- Registration: 5 minutes
- Health screening: 10 minutes
- Blood donation: 8-10 minutes
- Rest & refreshments: 10 minutes
- Total: ~30-40 minutes

🚨 EMERGENCY PROTOCOL:
For medical emergencies, ALWAYS advise calling 108 (India) immediately first, then finding blood.

💡 RESPONSE STYLE:
- Be warm, friendly, and encouraging
- Use emojis appropriately but not excessively
- Keep responses concise (2-3 short paragraphs max)
- Provide actionable next steps
- Show empathy for urgent requests
- Never give medical advice - refer to doctors

🔒 PRIVACY:
- Never ask for sensitive personal information
- Don't store or share user data
- Respect confidentiality

Remember: Every blood donation saves up to 3 lives! Encourage and motivate donors.`;
  }

  async generateResponse(
    userMessage,
    conversationHistory = [],
    userContext = null
  ) {
    try {
      // Sanitize input
      if (!userMessage || typeof userMessage !== "string") {
        throw new Error("Invalid message format");
      }

      const sanitizedMessage = userMessage.trim().substring(0, 500); // Limit message length

      if (!sanitizedMessage) {
        return this.getFallbackResponse("empty");
      }

      // Check for common queries first (faster response)
      const quickResponse = this.getQuickResponse(
        sanitizedMessage,
        userContext
      );
      if (quickResponse) {
        return quickResponse;
      }

      // Check if query needs real-time data
      const needsData = await this.checkIfNeedsData(sanitizedMessage);

      let additionalContext = "";
      let hasData = false;

      // Fetch real-time data if needed
      if (needsData.needsBloodBanks) {
        const bloodBanks = await this.fetchBloodBanks(needsData.city);
        if (bloodBanks.length > 0) {
          additionalContext += `\n\n📍 Available Blood Banks:\n`;
          bloodBanks.forEach((bank, i) => {
            additionalContext += `${i + 1}. ${bank.name}, ${bank.city}\n   📞 ${
              bank.phone
            }\n   📍 ${bank.address}\n`;
          });
          hasData = true;
        }
      }

      if (needsData.needsAvailability) {
        const availability = await this.checkAvailability(needsData.bloodType);
        if (availability.length > 0) {
          additionalContext += `\n\n🩸 Blood Availability:\n`;
          availability.forEach((item, i) => {
            additionalContext += `${i + 1}. ${item.name}, ${
              item.city
            }\n   Blood Type: ${item.bloodType} | Quantity: ${
              item.quantity
            } units\n   📞 ${item.phone}\n`;
          });
          hasData = true;
        } else {
          additionalContext += `\n\n⚠️ No ${
            needsData.bloodType || ""
          } blood currently available in our records.\n`;
        }
      }

      if (needsData.needsRequests) {
        const requests = await this.fetchActiveRequests(needsData.city);
        if (requests.length > 0) {
          additionalContext += `\n\n🆘 Active Blood Requests:\n`;
          requests.forEach((req, i) => {
            additionalContext += `${i + 1}. ${req.bloodType} | ${
              req.quantity
            } units | ${req.urgency.toUpperCase()}\n   🏥 ${req.hospital}, ${
              req.city
            }\n   📞 ${req.contact}\n`;
          });
          hasData = true;
        }
      }

      // Use AI if available, otherwise use fallback
      if (this.aiAvailable && hasData) {
        try {
          // Build conversation context
          let contextPrompt = this.systemContext;

          // Add user context if available
          if (userContext) {
            contextPrompt += `\n\n👤 Current User:\n`;
            contextPrompt += `- Name: ${userContext.name}\n`;
            contextPrompt += `- Blood Type: ${
              userContext.bloodType || "Not specified"
            }\n`;
            contextPrompt += `- City: ${userContext.city || "Not specified"}\n`;
          }

          // Add conversation history (last 3 exchanges)
          if (conversationHistory && conversationHistory.length > 0) {
            contextPrompt += `\n\n💬 Recent Conversation:\n`;
            conversationHistory.slice(-6).forEach((msg) => {
              contextPrompt += `${
                msg.type === "user" ? "User" : "BloodBot"
              }: ${msg.message.substring(0, 100)}\n`;
            });
          }

          // Add current query and data
          contextPrompt += `\n\n📝 Current Query: ${sanitizedMessage}\n`;
          contextPrompt += additionalContext;
          contextPrompt += `\n\n🤖 Your Response (be helpful, concise, and friendly):`;

          // Generate AI response with timeout
          const result = await Promise.race([
            this.model.generateContent(contextPrompt),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("AI timeout")), 10000)
            ),
          ]);

          const response = result.response;
          let text = response.text();

          // Clean up response
          text = text.trim();

          // If response is too long, truncate intelligently
          if (text.length > 800) {
            const sentences = text.split(/[.!?]+/);
            text = sentences.slice(0, 5).join(". ") + ".";
          }

          // Generate quick replies
          const quickReplies = this.generateQuickReplies(
            sanitizedMessage,
            text,
            needsData
          );

          return {
            message: text,
            quickReplies: quickReplies,
            timestamp: new Date(),
          };
        } catch (aiError) {
          console.error("AI generation error:", aiError.message);
          // Fall through to fallback response
        }
      }

      // Fallback response with data
      return this.getFallbackResponseWithData(
        sanitizedMessage,
        additionalContext,
        needsData
      );
    } catch (error) {
      console.error("Chatbot Error:", error);
      return this.getFallbackResponse("error");
    }
  }

  // Quick responses for common queries (no AI needed)
  getQuickResponse(message, userContext) {
    const lower = message.toLowerCase();

    // Greeting
    if (
      /^(hi|hello|hey|good morning|good afternoon|good evening)/i.test(lower)
    ) {
      const name = userContext ? ` ${userContext.name}` : "";
      return {
        message: `Hello${name}! 👋\n\nI'm BloodBot, your AI assistant for BloodLife. I can help you with:\n\n🏥 Finding blood banks\n🩸 Checking blood availability\n✅ Donation eligibility\n📝 Creating blood requests\n💡 Donation tips\n\nWhat would you like to know?`,
        quickReplies: [
          "Find Blood Banks",
          "Check Eligibility",
          "Donation Tips",
          "Create Request",
        ],
        timestamp: new Date(),
      };
    }

    // Help
    if (/help|what can you do|commands/i.test(lower)) {
      return {
        message: `I can assist you with:\n\n🏥 **Finding Blood Banks**\nLocate nearby blood banks in Kerala\n\n🩸 **Blood Availability**\nCheck real-time blood stock\n\n✅ **Eligibility Check**\nLearn if you can donate\n\n📝 **Blood Requests**\nCreate or view urgent requests\n\n💡 **Donation Tips**\nPre & post-donation care\n\n📅 **Blood Camps**\nFind upcoming donation events\n\nJust ask me anything!`,
        quickReplies: [
          "Find Blood Banks",
          "Check Eligibility",
          "Donation Tips",
          "View Requests",
        ],
        timestamp: new Date(),
      };
    }

    // Eligibility
    if (/eligible|can i donate|eligibility|qualify/i.test(lower)) {
      return {
        message: `✅ **Blood Donation Eligibility Criteria:**\n\n**Basic Requirements:**\n- Age: 18-65 years\n- Weight: Minimum 50kg\n- Health: Good general health\n\n**Waiting Periods:**\n- Between donations: 3 months (90 days)\n- After illness: 2 weeks minimum\n- After medication: Consult doctor\n- After surgery: 6 months\n- After tattoo/piercing: 6 months\n\n**Cannot Donate If:**\n- Pregnant or breastfeeding\n- Recent infections or fever\n- Chronic diseases (consult doctor)\n- Taking certain medications\n\n💡 Always consult with medical staff at donation center!\n\nReady to save lives? 🩸`,
        quickReplies: [
          "Register as Donor",
          "Find Blood Banks",
          "Donation Tips",
          "More Info",
        ],
        timestamp: new Date(),
      };
    }

    // Donation tips
    if (/tips|advice|before donation|after donation|care/i.test(lower)) {
      return {
        message: `💡 **Blood Donation Tips:**\n\n**Before Donation:**\n- Get 7-8 hours of sleep\n- Eat iron-rich foods\n- Drink plenty of water (2-3 glasses)\n- Avoid fatty foods\n- Don't donate on empty stomach\n\n**During Donation:**\n- Relax and breathe normally\n- Inform staff if dizzy\n- Takes only 8-10 minutes\n\n**After Donation:**\n- Rest for 10-15 minutes\n- Drink fluids (juices, water)\n- Avoid heavy exercise for 24 hours\n- Keep bandage for 4-5 hours\n- Eat iron-rich foods\n\n🌟 You're a hero! Every donation saves 3 lives!`,
        quickReplies: [
          "Check Eligibility",
          "Find Blood Banks",
          "Register Now",
          "More Info",
        ],
        timestamp: new Date(),
      };
    }

    // Thank you
    if (/thank|thanks|appreciate/i.test(lower)) {
      return {
        message: `You're very welcome! 😊\n\nI'm here to help anytime. Remember, blood donation is a noble act that saves lives!\n\nIs there anything else you'd like to know?`,
        quickReplies: [
          "Find Blood Banks",
          "Check Availability",
          "Donation Tips",
          "Help",
        ],
        timestamp: new Date(),
      };
    }

    return null; // No quick response available
  }

  // Fallback responses
  getFallbackResponse(type) {
    const responses = {
      error: {
        message:
          "I apologize, but I'm having trouble right now. 😔\n\nLet me help you with these options:",
        quickReplies: [
          "Find Blood Banks",
          "Check Eligibility",
          "Donation Tips",
          "Help",
        ],
      },
      empty: {
        message: "I didn't receive your message. Please type your question! 💬",
        quickReplies: [
          "Find Blood Banks",
          "Check Eligibility",
          "View Requests",
          "Help",
        ],
      },
      default: {
        message:
          "I can help you with blood donation queries! Try asking about:\n\n- Finding blood banks\n- Checking blood availability\n- Donation eligibility\n- Creating requests\n- Donation tips",
        quickReplies: [
          "Find Blood Banks",
          "Check Eligibility",
          "Donation Tips",
          "Help",
        ],
      },
    };

    return {
      ...(responses[type] || responses.default),
      timestamp: new Date(),
    };
  }

  // Fallback response with real data
  getFallbackResponseWithData(message, dataContext, needsData) {
    let response = "";

    if (!dataContext.trim()) {
      // No data available
      if (needsData.needsBloodBanks) {
        if (!needsData.city) {
          response =
            '🏥 **Find Blood Banks**\n\nI can help you find blood banks! Please specify which city you\'d like to search in:\n\n📍 Available cities:\n- Thrissur\n- Ernakulam\n- Kozhikode\n- Palakkad\n- Kottayam\n- Kollam\n- Thiruvananthapuram\n- Malappuram\n\nJust say something like: *"blood banks in Thrissur"* or *"show me Ernakulam blood banks"*';
        } else {
          response = `😔 I couldn't find any approved blood banks in ${needsData.city} at the moment.\n\nThis could mean:\n- No blood banks registered yet in this city\n- Blood banks are pending approval\n\nTry searching in nearby cities or contact us to register your blood bank!`;
        }
      } else if (needsData.needsAvailability) {
        if (!needsData.bloodType) {
          response =
            '🩸 **Check Blood Availability**\n\nI can check blood stock for you! Please specify which blood type you\'re looking for:\n\n- A+, A-\n- B+, B-\n- AB+, AB-\n- O+, O- (Universal Donor)\n\nExample: *"check O+ availability"* or *"A+ blood stock"*';
        } else {
          response = `😔 No ${needsData.bloodType} blood currently available in our records.\n\nSuggestions:\n- Create an urgent request\n- Check nearby cities\n- Contact blood banks directly\n\n🆘 For emergencies, call 108 immediately!`;
        }
      } else if (needsData.needsRequests) {
        response = `📋 I don't see any active blood requests${
          needsData.city ? ` in ${needsData.city}` : ""
        } right now.\n\nThat's good news! But if you need blood urgently, you can create a request and notify nearby donors.`;
      } else {
        response += "Please provide more details or try one of these:";
      }
    } else {
      // We have data!
      response = "Here's what I found:\n\n" + dataContext;
    }

    const quickReplies = this.generateQuickReplies(
      message,
      response,
      needsData
    );

    return {
      message: response,
      quickReplies,
      timestamp: new Date(),
    };
  }

  // Check if query needs real-time data
  async checkIfNeedsData(message) {
    const lowerMessage = message.toLowerCase();

    const cities = [
      "thrissur",
      "ernakulam",
      "kozhikode",
      "palakkad",
      "kottayam",
      "kollam",
      "thiruvananthapuram",
      "malappuram",
    ];
    const bloodTypes = ["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"];

    let needs = {
      needsBloodBanks: false,
      needsAvailability: false,
      needsRequests: false,
      city: null,
      bloodType: null,
    };

    // Check if asking about blood banks
    if (
      lowerMessage.includes("blood bank") ||
      lowerMessage.includes("bloodbank") || // Without space
      lowerMessage.includes("blood-bank") || // With hyphen
      lowerMessage.includes("hospital") ||
      lowerMessage.includes("bank") ||
      lowerMessage.includes("find") ||
      lowerMessage.includes("search") ||
      lowerMessage.includes("locate") ||
      lowerMessage.includes("where")
    ) {
      needs.needsBloodBanks = true;

      // Extract city
      for (const city of cities) {
        if (lowerMessage.includes(city)) {
          needs.city = city.charAt(0).toUpperCase() + city.slice(1);
          break;
        }
      }
    }

    // Check if asking about availability
    if (
      lowerMessage.includes("available") ||
      lowerMessage.includes("availability") ||
      lowerMessage.includes("stock") ||
      lowerMessage.includes("inventory") ||
      lowerMessage.includes("check") ||
      lowerMessage.includes("have") ||
      lowerMessage.includes("got")
    ) {
      needs.needsAvailability = true;

      // Extract blood type
      for (const type of bloodTypes) {
        // Check for blood type with or without spaces/special chars
        const typePattern = type.replace("+", "\\+").replace("-", "\\-");
        const regex = new RegExp(`\\b${typePattern}\\b`, "i");
        if (regex.test(lowerMessage)) {
          needs.bloodType = type.toUpperCase();
          break;
        }
      }
    }

    // Check if asking about requests
    if (
      lowerMessage.includes("request") ||
      lowerMessage.includes("need blood") ||
      lowerMessage.includes("need") ||
      lowerMessage.includes("require") ||
      lowerMessage.includes("urgent") ||
      lowerMessage.includes("emergency") ||
      lowerMessage.includes("help")
    ) {
      needs.needsRequests = true;

      // Extract city (if not already extracted)
      if (!needs.city) {
        for (const city of cities) {
          if (lowerMessage.includes(city)) {
            needs.city = city.charAt(0).toUpperCase() + city.slice(1);
            break;
          }
        }
      }
    }

    // Fallback: If a city is mentioned but no specific need detected,
    // assume they want to find blood banks
    if (
      !needs.needsBloodBanks &&
      !needs.needsAvailability &&
      !needs.needsRequests
    ) {
      for (const city of cities) {
        if (lowerMessage.includes(city)) {
          needs.needsBloodBanks = true;
          needs.city = city.charAt(0).toUpperCase() + city.slice(1);
          break;
        }
      }
    }

    return needs;
  }

  // Fetch blood banks from database
  async fetchBloodBanks(city = null) {
    try {
      const query = { isApproved: true };
      if (city) {
        query.city = new RegExp(city, "i");
      }

      const bloodBanks = await BloodBank.find(query)
        .select("name phone address city")
        .limit(5);

      return bloodBanks.map((bank) => ({
        name: bank.name,
        phone: bank.phone,
        address: bank.address,
        city: bank.city,
      }));
    } catch (error) {
      console.error("Error fetching blood banks:", error);
      return [];
    }
  }

  // Check blood availability
  async checkAvailability(bloodType = null) {
    try {
      const bloodBanks = await BloodBank.find({ isApproved: true });

      let availability = [];
      bloodBanks.forEach((bank) => {
        if (bloodType) {
          const stock = bank.inventory?.find(
            (item) => item.bloodType === bloodType
          );
          if (stock && stock.quantity > 0) {
            availability.push({
              name: bank.name,
              city: bank.city,
              bloodType: stock.bloodType,
              quantity: stock.quantity,
              phone: bank.phone,
            });
          }
        } else {
          bank.inventory?.forEach((item) => {
            if (item.quantity > 0) {
              availability.push({
                name: bank.name,
                city: bank.city,
                bloodType: item.bloodType,
                quantity: item.quantity,
              });
            }
          });
        }
      });

      return availability.slice(0, 5);
    } catch (error) {
      console.error("Error checking availability:", error);
      return [];
    }
  }

  // Fetch active blood requests
  async fetchActiveRequests(city = null) {
    try {
      const query = { status: "pending" };
      if (city) {
        query.city = new RegExp(city, "i");
      }

      const requests = await Request.find(query)
        .select(
          "bloodType quantity urgency city hospital patientName contactNumber"
        )
        .sort({ urgency: -1, createdAt: -1 })
        .limit(5);

      return requests.map((req) => ({
        bloodType: req.bloodType,
        quantity: req.quantity,
        urgency: req.urgency,
        city: req.city,
        hospital: req.hospital,
        contact: req.contactNumber,
      }));
    } catch (error) {
      console.error("Error fetching requests:", error);
      return [];
    }
  }

  // Generate contextual quick replies
  generateQuickReplies(userMessage, botResponse, needsData = {}) {
    const lowerMessage = userMessage.toLowerCase();
    const lowerResponse = botResponse.toLowerCase();

    let replies = [];

    // Context-based replies from data needs
    if (needsData.needsBloodBanks && needsData.city) {
      replies.push("Check Availability");
      replies.push("View Requests");
    } else if (needsData.needsBloodBanks) {
      // No city specified - suggest popular cities
      replies.push("Thrissur Banks");
      replies.push("Ernakulam Banks");
      replies.push("Kozhikode Banks");
    }

    if (needsData.needsAvailability) {
      replies.push("Find Blood Banks");
      if (!needsData.bloodType) {
        replies.push("Check O+ Blood");
        replies.push("Check A+ Blood");
      }
    }

    if (needsData.needsRequests) {
      replies.push("Create Request");
      replies.push("View All Requests");
    }

    // Context from response
    if (
      lowerResponse.includes("eligible") ||
      lowerResponse.includes("criteria")
    ) {
      if (!replies.includes("Register as Donor")) {
        replies.push("Donation Tips");
      }
    }

    if (lowerResponse.includes("tip") || lowerResponse.includes("care")) {
      if (!replies.includes("Check Eligibility")) {
        replies.push("Check Eligibility");
      }
      if (!replies.includes("Find Blood Banks")) {
        replies.push("Find Blood Banks");
      }
    }

    // Message-based quick replies
    if (lowerMessage.includes("urgent") || lowerMessage.includes("emergency")) {
      if (!replies.includes("View Requests")) {
        replies.push("View Requests");
      }
      if (!replies.includes("Create Request")) {
        replies.push("Create Request");
      }
    }

    if (lowerMessage.includes("camp")) {
      replies.push("View Blood Camps");
      replies.push("Register for Camp");
    }

    // Ensure we have 4 quick replies
    const defaults = [
      "Find Blood Banks",
      "Check Availability",
      "Check Eligibility",
      "Donation Tips",
      "View Requests",
      "Help",
    ];

    for (const reply of defaults) {
      if (replies.length >= 4) break;
      if (!replies.includes(reply)) {
        replies.push(reply);
      }
    }

    // Remove duplicates and limit to 4
    return [...new Set(replies)].slice(0, 4);
  }

  // Format database error messages
  formatErrorMessage(operation) {
    return `I'm having trouble fetching ${operation} right now. Please try again in a moment or contact support if the issue persists.`;
  }
}

module.exports = new AIChatbotService();
