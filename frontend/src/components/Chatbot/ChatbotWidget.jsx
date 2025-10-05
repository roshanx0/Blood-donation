import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User as UserIcon,
  Minimize2,
  Loader,
  Sparkles,
} from 'lucide-react';
import axios from '../../utils/axios';
import { useSelector } from 'react-redux';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    } else {
      // Welcome message
      const welcomeMessage = {
        type: 'bot',
        message: `Hello${isAuthenticated ? ` ${user?.name}` : ''}! 👋\n\nI'm BloodBot, your AI assistant for blood donation queries. I can help you with:\n\n🏥 Finding blood banks\n🩸 Checking blood availability\n📝 Registration guidance\n💡 Donation tips & eligibility\n\nHow can I assist you today?`,
        quickReplies: ['Find Blood Banks', 'Check Eligibility', 'Donation Tips', 'Help'],
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isAuthenticated, user]);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage.trim();
    
    if (!textToSend) return;

    // Add user message
    const userMessage = {
      type: 'user',
      message: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Send to AI backend
      const response = await axios.post('/chatbot/chat', {
        message: textToSend,
        conversationHistory: messages.slice(-10), // Last 10 messages for context
      });

      // Simulate typing delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const botMessage = {
        type: 'bot',
        message: response.data.response.message,
        quickReplies: response.data.response.quickReplies || [],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Show notification if chat is minimized or closed
      if (isMinimized || !isOpen) {
        setHasNewMessage(true);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      
      const errorMessage = {
        type: 'bot',
        message: "I'm having trouble connecting right now. Please try again in a moment. 😔",
        quickReplies: ['Try Again', 'Help'],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply) => {
    handleSendMessage(reply);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
    
    // Add welcome message after clearing
    const welcomeMessage = {
      type: 'bot',
      message: `Chat cleared! How can I help you? 😊`,
      quickReplies: ['Find Blood Banks', 'Check Eligibility', 'Donation Tips'],
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsOpen(true);
              setHasNewMessage(false);
            }}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-red-500/50 transition-all duration-300"
          >
            <MessageCircle className="h-7 w-7" />
            {hasNewMessage && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed bottom-6 right-6 z-50 bg-white dark:bg-dark-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-700 overflow-hidden ${
              isMinimized ? 'w-80' : 'w-96'
            }`}
            style={{ 
              height: isMinimized ? 'auto' : '600px',
              maxHeight: '90vh'
            }}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white dark:bg-dark-800 rounded-full flex items-center justify-center">
                    <Bot className="h-6 w-6 text-red-600 dark:text-red-500" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-dark-800" />
                </div>
                <div>
                  <h3 className="text-white font-bold flex items-center">
                    BloodBot
                    <Sparkles className="h-4 w-4 ml-1" />
                  </h3>
                  <p className="text-red-100 text-xs">AI Assistant • Online</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-red-800 dark:hover:bg-red-900 p-2 rounded-lg transition-colors"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-red-800 dark:hover:bg-red-900 p-2 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            {!isMinimized && (
              <>
                <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-dark-950">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          msg.type === 'user' 
                            ? 'bg-gradient-to-r from-red-600 to-red-700' 
                            : 'bg-gray-200 dark:bg-dark-800'
                        }`}>
                          {msg.type === 'user' ? (
                            <UserIcon className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-red-600 dark:text-red-500" />
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div>
                          <div className={`rounded-2xl px-4 py-3 ${
                            msg.type === 'user'
                              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                              : 'bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-dark-700'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {msg.message}
                            </p>
                          </div>
                          
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>

                          {/* Quick Replies */}
                          {msg.type === 'bot' && msg.quickReplies && msg.quickReplies.length > 0 && index === messages.length - 1 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {msg.quickReplies.map((reply, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleQuickReply(reply)}
                                  className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-dark-800 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-full hover:bg-red-50 dark:hover:bg-dark-700 transition-colors"
                                >
                                  {reply}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start space-x-2"
                    >
                      <div className="w-8 h-8 bg-gray-200 dark:bg-dark-800 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-red-600 dark:text-red-500" />
                      </div>
                      <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-700">
                  {/* Clear Chat Button */}
                  {messages.length > 1 && (
                    <button
                      onClick={clearChat}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 mb-2 transition-colors"
                    >
                      Clear chat history
                    </button>
                  )}

                  <div className="flex items-end space-x-2">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      rows="1"
                      className="flex-1 resize-none rounded-xl px-4 py-3 bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                      style={{ maxHeight: '120px' }}
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim() || isTyping}
                      className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 text-white p-3 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isTyping ? (
                        <Loader className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Powered by AI notice */}
                  <div className="mt-2 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Powered by AI • May make mistakes
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Minimized State */}
            {isMinimized && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Chat minimized. Click to expand.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;