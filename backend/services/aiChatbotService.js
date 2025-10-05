const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const BloodBank = require('../models/BloodBank');
const Request = require('../models/Request');

class AIChatbotService {
  constructor() {
    // Initialize Gemini AI
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // System context for the AI
    this.systemContext = `You are BloodBot, an AI assistant for BloodLife - a blood donation management system in Kerala, India. 

Your role is to:
- Help users find blood banks and donors
- Answer questions about blood donation
- Guide users through registration and creating blood requests
- Provide blood donation eligibility information
- Give pre and post-donation care tips
- Check blood availability
- Provide emergency assistance

Important Information:
- Blood donation eligibility: Age 18-65, Weight min 50kg, Good health
- Wait period between donations: 3 months (90 days)
- Donation process takes about 30 minutes
- All blood types: A+, A-, B+, B-, AB+, AB-, O+, O-
- Universal donor: O-, Universal receiver: AB+

Cities we cover: Thrissur, Ernakulam, Kozhikode, Palakkad, Kottayam, Kollam, Thiruvananthapuram, Malappuram

Be friendly, empathetic, and encouraging. Use emojis appropriately. Keep responses concise but informative.
If asked about medical emergencies, always advise to call emergency services (108 in India) first.`;
  }

  async generateResponse(userMessage, conversationHistory = [], userContext = null) {
    try {
      // Build conversation context
      let contextPrompt = this.systemContext;

      // Add user context if available
      if (userContext) {
        contextPrompt += `\n\nCurrent User Info:\n`;
        contextPrompt += `- Name: ${userContext.name}\n`;
        contextPrompt += `- Blood Type: ${userContext.bloodType || 'Unknown'}\n`;
        contextPrompt += `- City: ${userContext.city || 'Unknown'}\n`;
        contextPrompt += `- Role: ${userContext.role || 'User'}\n`;
      }

      // Add conversation history
      if (conversationHistory.length > 0) {
        contextPrompt += `\n\nPrevious conversation:\n`;
        conversationHistory.slice(-5).forEach(msg => {
          contextPrompt += `${msg.type === 'user' ? 'User' : 'Bot'}: ${msg.message}\n`;
        });
      }

      // Add current message
      contextPrompt += `\n\nUser: ${userMessage}\n\nBot:`;

      // Check if query needs real-time data
      const needsData = await this.checkIfNeedsData(userMessage);
      
      let additionalContext = '';
      if (needsData.needsBloodBanks) {
        const bloodBanks = await this.fetchBloodBanks(needsData.city);
        additionalContext += `\n\nAvailable Blood Banks:\n${JSON.stringify(bloodBanks, null, 2)}`;
      }
      
      if (needsData.needsAvailability) {
        const availability = await this.checkAvailability(needsData.bloodType);
        additionalContext += `\n\nBlood Availability:\n${JSON.stringify(availability, null, 2)}`;
      }

      if (needsData.needsRequests) {
        const requests = await this.fetchActiveRequests(needsData.city);
        additionalContext += `\n\nActive Blood Requests:\n${JSON.stringify(requests, null, 2)}`;
      }

      // Generate AI response
      const result = await this.model.generateContent(contextPrompt + additionalContext);
      const response = result.response;
      const text = response.text();

      // Generate quick replies based on response
      const quickReplies = this.generateQuickReplies(userMessage, text);

      return {
        message: text,
        quickReplies: quickReplies,
        timestamp: new Date(),
      };

    } catch (error) {
      console.error('AI Chatbot Error:', error);
      return {
        message: "I'm having trouble processing that right now. Could you rephrase your question? Or try asking about:\n- Finding blood banks\n- Blood donation eligibility\n- Creating a blood request\n- Donation tips",
        quickReplies: ['Find Blood Banks', 'Check Eligibility', 'Donation Tips', 'Help'],
        timestamp: new Date(),
      };
    }
  }

  // Check if query needs real-time data
  async checkIfNeedsData(message) {
    const lowerMessage = message.toLowerCase();
    
    const cities = ['thrissur', 'ernakulam', 'kozhikode', 'palakkad', 'kottayam', 'kollam', 'thiruvananthapuram', 'malappuram'];
    const bloodTypes = ['a+', 'a-', 'b+', 'b-', 'ab+', 'ab-', 'o+', 'o-'];
    
    let needs = {
      needsBloodBanks: false,
      needsAvailability: false,
      needsRequests: false,
      city: null,
      bloodType: null,
    };

    // Check if asking about blood banks
    if (lowerMessage.includes('blood bank') || lowerMessage.includes('hospital') || lowerMessage.includes('find')) {
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
    if (lowerMessage.includes('available') || lowerMessage.includes('stock') || lowerMessage.includes('check')) {
      needs.needsAvailability = true;
      
      // Extract blood type
      for (const type of bloodTypes) {
        if (lowerMessage.includes(type)) {
          needs.bloodType = type.toUpperCase();
          break;
        }
      }
    }

    // Check if asking about requests
    if (lowerMessage.includes('request') || lowerMessage.includes('need blood') || lowerMessage.includes('urgent')) {
      needs.needsRequests = true;
      
      // Extract city
      for (const city of cities) {
        if (lowerMessage.includes(city)) {
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
        query.city = new RegExp(city, 'i');
      }

      const bloodBanks = await BloodBank.find(query)
        .select('name phone address city')
        .limit(5);

      return bloodBanks.map(bank => ({
        name: bank.name,
        phone: bank.phone,
        address: bank.address,
        city: bank.city,
      }));
    } catch (error) {
      console.error('Error fetching blood banks:', error);
      return [];
    }
  }

  // Check blood availability
  async checkAvailability(bloodType = null) {
    try {
      const bloodBanks = await BloodBank.find({ isApproved: true });
      
      let availability = [];
      bloodBanks.forEach(bank => {
        if (bloodType) {
          const stock = bank.inventory?.find(item => item.bloodType === bloodType);
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
          bank.inventory?.forEach(item => {
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
      console.error('Error checking availability:', error);
      return [];
    }
  }

  // Fetch active blood requests
  async fetchActiveRequests(city = null) {
    try {
      const query = { status: 'pending' };
      if (city) {
        query.city = new RegExp(city, 'i');
      }

      const requests = await Request.find(query)
        .select('bloodType quantity urgency city hospital patientName contactNumber')
        .sort({ urgency: -1, createdAt: -1 })
        .limit(5);

      return requests.map(req => ({
        bloodType: req.bloodType,
        quantity: req.quantity,
        urgency: req.urgency,
        city: req.city,
        hospital: req.hospital,
        contact: req.contactNumber,
      }));
    } catch (error) {
      console.error('Error fetching requests:', error);
      return [];
    }
  }

  // Generate contextual quick replies
  generateQuickReplies(userMessage, botResponse) {
    const lowerMessage = userMessage.toLowerCase();
    const lowerResponse = botResponse.toLowerCase();

    let replies = [];

    // Context-based replies
    if (lowerResponse.includes('blood bank')) {
      replies.push('Show More Banks');
    }

    if (lowerResponse.includes('eligible') || lowerResponse.includes('criteria')) {
      replies.push('Register Now');
      replies.push('More Info');
    }

    if (lowerResponse.includes('available') || lowerResponse.includes('stock')) {
      replies.push('Check Other Types');
      replies.push('Create Request');
    }

    if (lowerResponse.includes('request')) {
      replies.push('Create Request');
      replies.push('View All Requests');
    }

    // Default quick replies
    if (replies.length < 3) {
      const defaults = [
        'Find Blood Banks',
        'Check Availability',
        'Donation Tips',
        'Register',
        'Help',
      ];
      
      defaults.forEach(reply => {
        if (replies.length < 4 && !replies.includes(reply)) {
          replies.push(reply);
        }
      });
    }

    return replies.slice(0, 4);
  }
}

module.exports = new AIChatbotService();