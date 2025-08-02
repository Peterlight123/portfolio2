/**
 * Peter Lightspeed Chatbot
 * Fixed and Responsive Implementation
 * Version 3.0
 */
class PeterChatbot {
  constructor() {
    // Core properties
    this.chatKey = 'peterbot_chat_history';
    this.sessionId = 'chat_' + Date.now();
    this.chatHistory = [];
    this.isOpen = false;
    
    // Load chat history
    this.loadChatHistory();
    
    // Initialize the bot
    this.init();
  }

  // Initialize bot after DOM is ready
  init() {
    // Get DOM elements
    this.chatToggleBtn = document.getElementById('open-chat-button');
    this.closeChatBtn = document.getElementById('close-chat');
    this.chatWindow = document.getElementById('chatbot-widget');
    this.chatForm = document.getElementById('chat-form');
    this.chatInput = document.getElementById('user-input-widget');
    this.chatMessages = document.getElementById('chat-area-widget');
    this.sendButton = document.getElementById('send-button-widget');
    
    // Fix positioning and styles
    this.fixChatbotStyles();
    
    // Add event listeners
    this.bindEvents();
    
    // Display chat history
    this.displayChatHistory();
    
    // Show welcome message if chat is empty
    if (this.chatHistory.length === 0) {
      setTimeout(() => {
        this.displayMessage("👋 Hello! I'm Peter's virtual assistant. How can I help you today?", 'bot');
        this.showQuickReplies(['Services', 'Portfolio', 'Contact', 'Pricing']);
      }, 500);
    }
    
    // Make sure the chatbot is responsive
    window.addEventListener('resize', () => this.adjustChatWindowPosition());
    this.adjustChatWindowPosition();
  }
  
  // Fix chatbot styles to ensure it's fixed and responsive
  fixChatbotStyles() {
    if (this.chatWindow) {
      // Fix chatbot widget
      this.chatWindow.style.position = 'fixed';
      this.chatWindow.style.bottom = '20px';
      this.chatWindow.style.right = '20px';
      this.chatWindow.style.width = '320px';
      this.chatWindow.style.zIndex = '9999';
      this.chatWindow.style.boxShadow = '0 5px 25px rgba(0,0,0,0.2)';
      this.chatWindow.style.borderRadius = '10px';
      this.chatWindow.style.overflow = 'hidden';
      this.chatWindow.style.display = 'flex';
      this.chatWindow.style.flexDirection = 'column';
      this.chatWindow.style.transform = 'scale(0)';
      this.chatWindow.style.transformOrigin = 'bottom right';
      this.chatWindow.style.transition = 'transform 0.3s ease';
      this.chatWindow.style.backgroundColor = 'white';
    }
    
    if (this.chatToggleBtn) {
      // Fix chat button
      this.chatToggleBtn.style.position = 'fixed';
      this.chatToggleBtn.style.bottom = '20px';
      this.chatToggleBtn.style.right = '20px';
      this.chatToggleBtn.style.width = '60px';
      this.chatToggleBtn.style.height = '60px';
      this.chatToggleBtn.style.borderRadius = '50%';
      this.chatToggleBtn.style.display = 'flex';
      this.chatToggleBtn.style.alignItems = 'center';
      this.chatToggleBtn.style.justifyContent = 'center';
      this.chatToggleBtn.style.zIndex = '9998';
      this.chatToggleBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      this.chatToggleBtn.style.cursor = 'pointer';
      this.chatToggleBtn.style.transition = 'transform 0.3s ease';
    }
    
    if (this.chatMessages) {
      // Fix chat messages area
      this.chatMessages.style.flex = '1';
      this.chatMessages.style.overflowY = 'auto';
      this.chatMessages.style.padding = '15px';
      this.chatMessages.style.backgroundColor = '#f8f9fa';
      this.chatMessages.style.height = '300px';
    }
  }
  
  // Adjust chat window position for mobile
  adjustChatWindowPosition() {
    if (this.chatWindow) {
      if (window.innerWidth <= 576) {
        this.chatWindow.style.width = '90vw';
        this.chatWindow.style.maxWidth = '320px';
        this.chatWindow.style.right = '5%';
      } else {
        this.chatWindow.style.width = '320px';
        this.chatWindow.style.right = '20px';
      }
    }
  }
  
  // Bind event listeners
  bindEvents() {
    // Toggle chat window
    if (this.chatToggleBtn) {
      this.chatToggleBtn.addEventListener('click', () => this.toggleChat());
    }
    
    // Close chat window
    if (this.closeChatBtn) {
      this.closeChatBtn.addEventListener('click', () => this.closeChat());
    }
    
    // Handle form submission
    if (this.chatForm) {
      this.chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.sendMessage();
      });
    }
    
    // Handle send button click
    if (this.sendButton) {
      this.sendButton.addEventListener('click', () => this.sendMessage());
    }
    
    // Handle enter key in input
    if (this.chatInput) {
      this.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }
    
    // Save chat history when user leaves the page
    window.addEventListener('beforeunload', () => {
      this.saveChatHistory();
    });
  }
  
  // Toggle chat window
  toggleChat() {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      if (this.chatWindow) this.chatWindow.style.transform = 'scale(1)';
      if (this.chatToggleBtn) this.chatToggleBtn.style.transform = 'scale(0)';
      if (this.chatInput) this.chatInput.focus();
      if (this.chatMessages) this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
      
      // Hide notification badge
      const notificationBadge = document.getElementById('notification-badge');
      if (notificationBadge) {
        notificationBadge.classList.add('d-none');
      }
    } else {
      if (this.chatWindow) this.chatWindow.style.transform = 'scale(0)';
      if (this.chatToggleBtn) this.chatToggleBtn.style.transform = 'scale(1)';
    }
  }
  
  // Close chat window
  closeChat() {
    this.isOpen = false;
    if (this.chatWindow) this.chatWindow.style.transform = 'scale(0)';
    if (this.chatToggleBtn) this.chatToggleBtn.style.transform = 'scale(1)';
    
    // Save chat history when closing
    this.saveChatHistory();
  }
  
  // Send message
  sendMessage() {
    if (!this.chatInput) return;
    
    const message = this.chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    this.displayMessage(message, 'user');
    this.chatInput.value = '';
    
    // Remove any quick replies
    this.removeQuickReplies();
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Generate response with delay
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateResponse(message);
      this.displayMessage(response, 'bot');
      
      // Show relevant quick replies
      this.showRelevantQuickReplies(message, response);
      
      // Save chat history
      this.saveChatHistory();
    }, 800);
  }
  
  // Display message
  displayMessage(text, sender) {
    if (!this.chatMessages) return;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `d-flex ${sender === 'user' ? 'justify-content-end' : ''} mb-3`;
    
    const bubble = document.createElement('div');
    bubble.className = sender === 'user' ? 'bg-primary text-white rounded p-3' : 'bg-light rounded p-3';
    bubble.style.maxWidth = '80%';
    bubble.style.borderRadius = sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0';
    bubble.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
    
    // Format links in the text
    const formattedText = this.formatLinks(text);
    bubble.innerHTML = formattedText.replace(/\n/g, '<br>');
    
    // Add timestamp
    const timestamp = document.createElement('small');
    timestamp.className = 'message-timestamp';
    timestamp.style.display = 'block';
    timestamp.style.fontSize = '0.7rem';
    timestamp.style.opacity = '0.7';
    timestamp.style.marginTop = '4px';
    timestamp.style.textAlign = 'right';
    timestamp.textContent = time;
    bubble.appendChild(timestamp);
    
    messageDiv.appendChild(bubble);
    this.chatMessages.appendChild(messageDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    
    // Add to chat history
    this.chatHistory.push({
      sender: sender,
      text: text,
      time: time
    });
  }
  
  // Format links in text
  formatLinks(text) {
    // Convert URLs to links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url => `<a href="${url}" target="_blank" style="color: inherit; text-decoration: underline;">${url}</a>`);
  }
  
  // Show typing indicator
  showTypingIndicator() {
    if (!this.chatMessages) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator d-flex mb-3';
    
    const bubble = document.createElement('div');
    bubble.className = 'bg-light rounded p-3';
    bubble.style.minWidth = '60px';
    bubble.style.display = 'flex';
    bubble.style.alignItems = 'center';
    bubble.style.justifyContent = 'center';
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'typing-dot';
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.borderRadius = '50%';
      dot.style.backgroundColor = '#0d6efd';
      dot.style.margin = '0 2px';
      dot.style.animation = `typingAnimation 1s infinite ${i * 0.2}s`;
      bubble.appendChild(dot);
    }
    
    typingDiv.appendChild(bubble);
    this.chatMessages.appendChild(typingDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    
    // Add animation style if it doesn't exist
    if (!document.getElementById('typing-animation-style')) {
      const style = document.createElement('style');
      style.id = 'typing-animation-style';
      style.textContent = `
        @keyframes typingAnimation {
          0% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
          100% { opacity: 0.3; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Hide typing indicator
  hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  // Show quick replies
  showQuickReplies(replies) {
    if (!this.chatMessages) return;
    
    // Remove existing quick replies
    this.removeQuickReplies();
    
    const container = document.createElement('div');
    container.className = 'quick-replies-container d-flex flex-wrap justify-content-center mb-3 gap-2';
    
    replies.forEach(reply => {
      const button = document.createElement('button');
      button.className = 'btn btn-sm btn-outline-primary quick-reply-btn';
      button.style.borderRadius = '20px';
      button.style.margin = '4px';
      button.style.transition = 'all 0.2s ease';
      button.textContent = reply;
      
      button.addEventListener('click', () => {
        // Use the quick reply as user input
        this.displayMessage(reply, 'user');
        
        // Remove quick replies
        this.removeQuickReplies();
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate response with delay
        setTimeout(() => {
          this.hideTypingIndicator();
          const response = this.generateResponse(reply);
          this.displayMessage(response, 'bot');
          
          // Show relevant quick replies
          this.showRelevantQuickReplies(reply, response);
          
          // Save chat history
          this.saveChatHistory();
        }, 800);
      });
      
      container.appendChild(button);
    });
    
    this.chatMessages.appendChild(container);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }
  
  // Remove quick replies
  removeQuickReplies() {
    const container = document.querySelector('.quick-replies-container');
    if (container) {
      container.remove();
    }
  }
  
  // Show relevant quick replies based on context
  showRelevantQuickReplies(userMessage, botResponse) {
    const lowerUserMsg = userMessage.toLowerCase();
    const lowerBotMsg = botResponse.toLowerCase();
    
    // Default quick replies
    let quickReplies = ['Services', 'Portfolio', 'Contact', 'Pricing'];
    
    // Context-specific quick replies
    if (lowerBotMsg.includes('services') || lowerUserMsg.includes('service')) {
      quickReplies = ['Web Development', 'Graphic Design', 'Content Creation', 'Pricing'];
    } else if (lowerBotMsg.includes('portfolio') || lowerUserMsg.includes('portfolio')) {
      quickReplies = ['Recent Projects', 'Contact Peter', 'Services', 'Pricing'];
    } else if (lowerBotMsg.includes('contact') || lowerUserMsg.includes('contact')) {
      quickReplies = ['WhatsApp', 'Email', 'Services', 'Portfolio'];
    } else if (lowerBotMsg.includes('pricing') || lowerUserMsg.includes('price')) {
      quickReplies = ['Web Design Pricing', 'Graphic Design Pricing', 'Contact Peter', 'Services'];
    }
    
    this.showQuickReplies(quickReplies);
  }
  
  // Generate response based on user input
  generateResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    // Greetings
    if (/\b(hello|hi|hey|good morning|good afternoon|good evening|greetings|sup|yo)\b/i.test(lowerMsg)) {
      return "👋 Hi there! I'm Peter's virtual assistant. How can I help you today?";
    }
    
    // Services
    if (/\b(service|offer|provide|do you|can you|help with|assistance|support)\b/i.test(lowerMsg)) {
      return "🛠️ Peter offers these services:\n\n• Web Development & Design\n• Graphic Design (logos, flyers, social media)\n• Content Creation & Blog Management\n• Social Media Management\n• Virtual Assistant Services\n• Data Entry & Administrative Support\n\nWhich service are you interested in?";
    }
    
    // Portfolio
    if (/\b(project|portfolio|work|sample|showcase|example|case study|previous work)\b/i.test(lowerMsg)) {
      return "📁 You can view Peter's projects in his portfolio: https://peterlight123.github.io/portfolio/project.html. He specializes in web development, graphic design, and content creation.";
    }
    
    // Contact
    if (/\b(contact|reach|email|phone|whatsapp|call|message|dm|get in touch|talk to)\b/i.test(lowerMsg)) {
      return "📱 You can contact Peter through:\n\n📧 Email: petereluwade55@gmail.com\n📞 Phone/WhatsApp: +234 810 882 1809\n\nOr use the contact form on the website!";
    }
    
    // Pricing
    if (/\b(price|cost|rate|charge|fee|pricing|package|pay|payment|quote|budget)\b/i.test(lowerMsg)) {
      return "💰 Here's a quick guide to Peter's rates:\n• Website: ₦150k – ₦500k\n• Logo/Graphics: ₦30k – ₦100k\n• VA Services: From ₦10k/week\n\nFor a custom quote based on your specific requirements, please reach out directly.";
    }
    
    // About
    if (/\b(about|who|background|experience|skills|education|bio|history|qualification)\b/i.test(lowerMsg)) {
      return "👨‍💻 Peter Eluwade (Peter Lightspeed) is a versatile Virtual Assistant and Web Developer based in Nigeria. With certifications from FreeCodeCamp and other institutions, he specializes in web development, graphic design, content creation, and digital marketing. He also creates music under the name 'Peterphonist'!";
    }
    
    // Web Development
    if (/\b(web|website|development|developer|coding|html|css|javascript)\b/i.test(lowerMsg)) {
      return "💻 Peter's web development services include:\n\n• Custom website design and development\n• Responsive mobile-friendly websites\n• E-commerce solutions\n• Landing page creation\n• Website maintenance and updates\n• WordPress and Blogger setup\n\nAll websites are built with modern technologies and optimized for speed and search engines.";
    }
    
    // Graphic Design
    if (/\b(graphic|design|logo|flyer|banner|poster|social media)\b/i.test(lowerMsg)) {
      return "🎨 Peter's graphic design services include:\n\n• Logo design and brand identity\n• Social media graphics and templates\n• Flyers, posters, and banners\n• Business cards and stationery\n• Product packaging design\n• Digital advertisements\n\nAll designs are created with commercial-quality tools and delivered in appropriate formats for your needs.";
    }
    
    // Content Creation
    if (/\b(content|blog|writing|article|post|seo|copywriting)\b/i.test(lowerMsg)) {
      return "✍️ Peter's content creation services include:\n\n• Blog post writing and management\n• SEO-optimized content\n• Social media content planning\n• Email newsletter content\n• Product descriptions\n• Website copy\n\nContent is crafted to engage your target audience and improve your online presence.";
    }
    
    // Default response
    return "I'm here to help with information about Peter's services, projects, pricing, or how to get in touch. What would you like to know?";
  }
  
  // Load chat history from localStorage
  loadChatHistory() {
    try {
      const saved = localStorage.getItem(this.chatKey);
      this.chatHistory = saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      this.chatHistory = [];
    }
  }
  
  // Save chat history to localStorage
  saveChatHistory() {
    try {
      // Limit history to last 50 messages
      const historyToSave = this.chatHistory.slice(-50);
      localStorage.setItem(this.chatKey, JSON.stringify(historyToSave));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }
  
  // Display chat history
  displayChatHistory() {
    if (!this.chatMessages || this.chatHistory.length === 0) return;
    
    // Display last 10 messages (or fewer if history is shorter)
    const messagesToShow = this.chatHistory.slice(-10);
    messagesToShow.forEach(msg => {
      this.displayMessage(msg.text, msg.sender);
    });
  }
}

// Initialize the chatbot when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded - initializing chatbot");
  
  // Check if elements exist
  const chatbotWidget = document.getElementById('chatbot-widget');
  const openChatButton = document.getElementById('open-chat-button');
  const closeChatButton = document.getElementById('close-chat');
  
  console.log("Chatbot widget found:", !!chatbotWidget);
  console.log("Open chat button found:", !!openChatButton);
  console.log("Close chat button found:", !!closeChatButton);
  
  // Initialize the chatbot
  window.PeterBot = new PeterChatbot();
  console.log("Chatbot initialized");
  
  // Emergency fix for chatbot positioning
  setTimeout(() => {
    const chatbotWidget = document.getElementById('chatbot-widget');
    const openChatButton = document.getElementById('open-chat-button');
    
    if (chatbotWidget) {
      chatbotWidget.style.position = 'fixed';
      chatbotWidget.style.bottom = '20px';
      chatbotWidget.style.right = '20px';
      chatbotWidget.style.zIndex = '9999';
      chatbotWidget.style.transform = 'scale(0)';
      chatbotWidget.style.transformOrigin = 'bottom right';
    }
    
    if (openChatButton) {
      openChatButton.style.position = 'fixed';
      openChatButton.style.bottom = '20px';
      openChatButton.style.right = '20px';
      openChatButton.style.zIndex = '9998';
    }
  }, 500);
});
