/**
 * PeterBot - Advanced Chatbot for Peter Eluwade's Portfolio
 * Version 2.0
 */
class PeterChatbot {
  constructor() {
    // Core properties
    this.chatKey = 'peterbot_chat_history';
    this.sessionId = this.getOrCreateSessionId();
    this.chatHistory = [];
    this.isTyping = false;
    this.settings = this.loadSettings();
    
    // Initialize the bot
    this.init();
  }
  
  // Generate or retrieve session ID
  getOrCreateSessionId() {
    const sessionKey = 'peterbot_session_id';
    let sessionId = localStorage.getItem(sessionKey);
    
    if (!sessionId) {
      sessionId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem(sessionKey, sessionId);
    }
    
    return sessionId;
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
    
    // Check if elements exist
    if (!this.chatToggleBtn || !this.chatWindow || !this.chatForm || !this.chatInput || !this.chatMessages) {
      console.error('Chatbot elements not found in the DOM');
      return;
    }
    
    // Fix positioning and styles
    this.fixChatbotStyles();
    
    // Add event listeners
    this.bindEvents();
    
    // Load chat history
    this.loadChatHistory();
    
    // Display chat history
    this.displayChatHistory();
    
    // Show welcome message if chat is empty
    if (this.chatHistory.length === 0) {
      setTimeout(() => {
        this.appendMessage(this.settings.welcomeMessage, 'bot');
        this.showQuickReplies(['Services', 'Portfolio', 'Contact', 'Pricing']);
      }, 500);
    }
  }
  
  // Fix chatbot styles to ensure it's fixed and responsive
  fixChatbotStyles() {
    if (this.chatWindow) {
      this.chatWindow.style.transform = 'scale(0)';
    }
    
    // Make sure the chatbot is responsive
    window.addEventListener('resize', () => this.adjustChatWindowPosition());
    this.adjustChatWindowPosition();
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
      this.sendButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.sendMessage();
      });
    }
  }
  
  // Toggle chat window
  toggleChat() {
    if (this.chatWindow) {
      if (this.chatWindow.style.transform === 'scale(1)') {
        this.closeChat();
      } else {
        this.openChat();
      }
    }
  }
  
  // Open chat window
  openChat() {
    if (this.chatWindow && this.chatToggleBtn) {
      this.chatWindow.style.transform = 'scale(1)';
      this.chatToggleBtn.style.transform = 'scale(0)';
      
      if (this.chatInput) {
        this.chatInput.focus();
      }
      
      if (this.chatMessages) {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
      }
      
      // Hide notification badge
      const notificationBadge = document.getElementById('notification-badge');
      if (notificationBadge) {
        notificationBadge.classList.add('d-none');
      }
    }
  }
  
  // Close chat window
  closeChat() {
    if (this.chatWindow && this.chatToggleBtn) {
      this.chatWindow.style.transform = 'scale(0)';
      this.chatToggleBtn.style.transform = 'scale(1)';
    }
  }
  
  // Send message
  sendMessage() {
    if (!this.chatInput) return;
    
    const message = this.chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    this.appendMessage(message, 'user');
    this.chatInput.value = '';
    
    // Remove any quick replies
    this.removeQuickReplies();
    
    // Show typing indicator
    if (this.settings.showTypingIndicator) {
      this.showTypingIndicator();
    }
    
    // Generate response with delay
    setTimeout(() => {
      if (this.settings.showTypingIndicator) {
        this.hideTypingIndicator();
      }
      
      const response = this.generateResponse(message);
      this.appendMessage(response, 'bot');
      
      // Show relevant quick replies
      if (this.settings.showQuickReplies) {
        this.showRelevantQuickReplies(message, response);
      }
      
      // Save chat history

 // Send message (continued)
  sendMessage() {
    if (!this.chatInput) return;
    
    const message = this.chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    this.appendMessage(message, 'user');
    this.chatInput.value = '';
    
    // Remove any quick replies
    this.removeQuickReplies();
    
    // Show typing indicator
    if (this.settings.showTypingIndicator) {
      this.showTypingIndicator();
    }
    
    // Generate response with delay
    setTimeout(() => {
      if (this.settings.showTypingIndicator) {
        this.hideTypingIndicator();
      }
      
      const response = this.generateResponse(message);
      this.appendMessage(response, 'bot');
      
      // Show relevant quick replies
      if (this.settings.showQuickReplies) {
        this.showRelevantQuickReplies(message, response);
      }
      
      // Save chat history
      this.saveChatHistory();
      
      // Send to server if enabled
      if (this.settings.saveToServer) {
        this.sendToServer();
      }
    }, this.settings.responseDelay);
  }
  
  // Append message to chat
  appendMessage(text, sender) {
    const time = new Date().toISOString();
    const displayTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add to chat history
    this.chatHistory.push({
      sender,
      text,
      time
    });
    
    // Display in chat
    this.displayMessage(text, sender, displayTime);
  }
  
  // Display message in chat
  displayMessage(text, sender, time) {
    if (!this.chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Format links in the text
    const formattedText = this.formatLinks(text);
    bubble.innerHTML = formattedText.replace(/\n/g, '<br>');
    
    const timestamp = document.createElement('span');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = time;
    bubble.appendChild(timestamp);
    
    messageDiv.appendChild(bubble);
    this.chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
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
    
    this.isTyping = true;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing-indicator';
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble typing';
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      bubble.appendChild(dot);
    }
    
    typingDiv.appendChild(bubble);
    this.chatMessages.appendChild(typingDiv);
    
    // Scroll to bottom
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }
  
  // Hide typing indicator
  hideTypingIndicator() {
    if (!this.chatMessages) return;
    
    this.isTyping = false;
    
    const typingIndicator = this.chatMessages.querySelector('.typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  // Show quick replies
  showQuickReplies(replies) {
    if (!this.chatMessages) return;
    
    const repliesDiv = document.createElement('div');
    repliesDiv.className = 'quick-replies';
    
    replies.forEach(reply => {
      const button = document.createElement('button');
      button.className = 'quick-reply-btn';
      button.textContent = reply;
      
      button.addEventListener('click', () => {
        // Use the quick reply as user input
        this.appendMessage(reply, 'user');
        
        // Remove quick replies
        this.removeQuickReplies();
        
        // Show typing indicator
        if (this.settings.showTypingIndicator) {
          this.showTypingIndicator();
        }
        
        // Generate response with delay
        setTimeout(() => {
          if (this.settings.showTypingIndicator) {
            this.hideTypingIndicator();
          }
          
          const response = this.generateResponse(reply);
          this.appendMessage(response, 'bot');
          
          // Show relevant quick replies
          if (this.settings.showQuickReplies) {
            this.showRelevantQuickReplies(reply, response);
          }
          
          // Save chat history
          this.saveChatHistory();
          
          // Send to server if enabled
          if (this.settings.saveToServer) {
            this.sendToServer();
          }
        }, this.settings.responseDelay);
      });
      
      repliesDiv.appendChild(button);
    });
    
    this.chatMessages.appendChild(repliesDiv);
    
    // Scroll to bottom
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }
  
  // Remove quick replies
  removeQuickReplies() {
    if (!this.chatMessages) return;
    
    const quickReplies = this.chatMessages.querySelector('.quick-replies');
    if (quickReplies) {
      quickReplies.remove();
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
    } else if (lowerBotMsg.includes('music') || lowerUserMsg.includes('music') || lowerUserMsg.includes('peterphonist')) {
      quickReplies = ['YouTube', 'Instagram', 'TikTok', 'Music Style'];
    } else if (lowerBotMsg.includes('pidgin') || lowerUserMsg.includes('pidgin') || lowerUserMsg.includes('naija')) {
      quickReplies = ['Services', 'Contact', 'Music', 'Portfolio'];
    }
    
    this.showQuickReplies(quickReplies);
  }
  
  // Generate response based on user input
  generateResponse(message) {
    const lower = message.toLowerCase();
    
    // Check for pidgin English request
    if (lower.includes('pidgin') || lower.includes('naija') || lower.includes('9ja') || lower.includes('speak pidgin')) {
      return this.generatePidginResponse(lower);
    }
    
    // Greetings
    if (lower.match(/\b(hello|hi|hey|good morning|good afternoon|good evening|greetings|sup|yo)\b/)) {
      return "👋 Hi there! I'm Peter's virtual assistant. How can I help you today?";
    }
    
    // Services
    if (lower.match(/\b(service|offer|provide|do you|can you|help with|assistance|support)\b/)) {
      return "🛠️ Peter offers these services:\n\n• Web Development & Design\n• Graphic Design (logos, flyers, social media)\n• Content Creation & Blog Management\n• Social Media Management\n• Virtual Assistant Services\n• Data Entry & Administrative Support\n\nWhich service are you interested in?";
    }
    
    // Portfolio
    if (lower.match(/\b(project|portfolio|work|sample|showcase|example|case study|previous work)\b/)) {
      return "📁 You can view Peter's projects in his portfolio: https://peterlight123.github.io/portfolio/project.html. He specializes in web development, graphic design, and content creation.";
    }
    
    // Contact
    if (lower.match(/\b(contact|reach|email|phone|whatsapp|call|message|dm|get in touch|talk to)\b/)) {
      return "📱 You can contact Peter through:\n\n📧 Email: petereluwade55@gmail.com\n📞 Phone/WhatsApp: +234 810 882 1809\n\nOr use the contact form on the website!";
    }
    
    // Pricing
    if (lower.match(/\b(price|cost|rate|charge|fee|pricing|package|pay|payment|quote|budget)\b/)) {
      return "💰 Here's a quick guide to Peter's rates:\n• Website: ₦150k – ₦500k\n• Logo/Graphics: ₦30k – ₦100k\n• VA Services: From ₦10k/week\n\nFor a custom quote based on your specific requirements, please reach out directly.";
    }
    
    // About
    if (lower.match(/\b(about|who|background|experience|skills|education|bio|history|qualification)\b/)) {
      return "👨‍💻 Peter Eluwade (Peter Lightspeed) is a versatile Virtual Assistant and Web Developer based in Nigeria. With certifications from FreeCodeCamp and other institutions, he specializes in web development, graphic design, content creation, and digital marketing. He also creates music under the name 'Peterphonist'!";
    }
    
    // Music/Peterphonist
    if (lower.match(/\b(music|song|artist|peterphonist|beat|producer|track|audio|sound)\b/)) {
      return "🎵 Peter creates music under the name 'Peterphonist'. You can find his music on:\n\n• YouTube: @peterphonist\n• Instagram: @peterphonist\n• TikTok: @peterphonist\n• Facebook: @peterphonist\n• Snapchat: @peterphonist\n\nCheck out his tracks for a blend of afrobeats and contemporary sounds!";
    }
    
    // Web Development
    if (lower.match(/\b(web|website|development|developer|coding|html|css|javascript)\b/)) {
      return "💻 Peter's web development services include:\n\n• Custom website design and development\n• Responsive mobile-friendly websites\n• E-commerce solutions\n• Landing page creation\n• Website maintenance and updates\n• WordPress and Blogger setup\n\nAll websites are built with modern technologies and optimized for speed and search engines.";
    }
    
    // Graphic Design
    if (lower.match(/\b(graphic|design|logo|flyer|banner|poster|social media)\b/)) {
      return "🎨 Peter's graphic design services include:\n\n• Logo design and brand identity\n• Social media graphics and templates\n• Flyers, posters, and banners\n• Business cards and stationery\n• Product packaging design\n• Digital advertisements\n\nAll designs are created with commercial-quality tools and delivered in appropriate formats for your needs.";
    }
    
    // Content Creation
    if (lower.match(/\b(content|blog|writing|article|post|seo|copywriting)\b/)) {
      return "✍️ Peter's content creation services include:\n\n• Blog post writing and management\n• SEO-optimized content\n• Social media content planning\n• Email newsletter content\n• Product descriptions\n• Website copy\n\nContent is crafted to engage your target audience and improve your online presence.";
    }
    
    // Social Media
    if (lower.match(/\b(social media|instagram|facebook|twitter|tiktok|youtube|snapchat)\b/)) {
      return "📱 Find Peter on social media:\n\n• Instagram: @peterphonist\n• TikTok: @peterphonist\n• YouTube: @peterphonist\n• Facebook: @peterphonist\n• Snapchat: @peterphonist\n\nFollow for updates on his work and music!";
    }
    
    // Default response
    return "I'm here to help with information about Peter's services, projects, pricing, or how to get in touch. You can also ask about his music as 'Peterphonist'. What would you like to know?";
  }
  
  // Generate response in Nigerian Pidgin English
  generatePidginResponse(message) {
    const lower = message.toLowerCase();
    
    // Greetings
    if (lower.match(/\b(hello|hi|hey|good morning|good afternoon|good evening|greetings|sup|yo)\b/)) {
      return "👋 How far! I be Peter assistant. Wetin you want make I help you with today?";
    }
    
    // Services
    if (lower.match(/\b(service|offer|provide|do you|can you|help with|assistance|support)\b/)) {
      return "🛠️ Peter dey offer these services:\n\n• Web Development & Design\n• Graphic Design (logos, flyers, social media)\n• Content Creation & Blog Management\n• Social Media Management\n• Virtual Assistant Services\n• Data Entry & Administrative Support\n\nWhich one you wan know about?";
    }
    
    // Portfolio
    if (lower.match(/\b(project|portfolio|work|sample|showcase|example|case study|previous work)\b/)) {
      return "📁 You fit check Peter work for im portfolio: https://peterlight123.github.io/portfolio/project.html. E sabi web development, graphic design, and content creation well well.";
    }
    
    // Contact
    if (lower.match(/\b(contact|reach|email|phone|whatsapp|call|message|dm|get in touch|talk to)\b/)) {
      return "📱 You fit contact Peter through:\n\n📧 Email: petereluwade55@gmail.com\n📞 Phone/WhatsApp: +234 810 882 1809\n\nOr use the contact form for the website!";
    }
    
    // Pricing
    if (lower.match(/\b(price|cost|rate|charge|fee|pricing|package|pay|payment|quote|budget)\b/)) {
      return "💰 See how Peter dey charge:\n• Website: ₦150k – ₦500k\n• Logo/Graphics: ₦30k – ₦100k\n• VA Services: From ₦10k/week\n\nIf you want better price wey go match your project, make you contact am direct.";
    }
    
    // About
    if (lower.match(/\b(about|who|background|experience|skills|education|bio|history|qualification)\b/)) {
      return "👨‍💻 Peter Eluwade (Peter Lightspeed) na Virtual Assistant and Web Developer from Nigeria. E get certifications from FreeCodeCamp and other places, and e sabi web development, graphic design, content creation, and digital marketing well well. E also dey make music as 'Peterphonist'!";
    }
    
    // Music/Peterphonist
    if (lower.match(/\b(music|song|artist|peterphonist|beat|producer|track|audio|sound)\b/)) {
      return "🎵 Peter dey make music as 'Peterphonist'. You fit find im music for:\n\n• YouTube: @peterphonist\n• Instagram: @peterphonist\n• TikTok: @peterphonist\n• Facebook: @peterphonist\n• Snapchat: @peterphonist\n\nCheck am out, e dey blend afrobeats with modern sounds!";
    }
    
    // Default response
    return "I dey here to help you with information about Peter services, projects, pricing, or how to contact am. You fit also ask about im music as 'Peterphonist'. Wetin you wan know?";
  }
  
  // Load chat history
  loadChatHistory() {
    try {
      const key = `peterbot_chat_${this.sessionId}`;
      const saved = localStorage.getItem(key);
      
      if (saved) {
        this.chatHistory = JSON.parse(saved);
        
        // Limit history to max size
        if (this.chatHistory.length > this.settings.maxHistory) {
          this.chatHistory = this.chatHistory.slice(-this.settings.maxHistory);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      this.chatHistory = [];
    }
  }
  
  // Save chat history
  saveChatHistory() {
    try {
      const key = `peterbot_chat_${this.sessionId}`;
      
      // Limit history to max size
      if (this.chatHistory.length > this.settings.maxHistory) {
        this.chatHistory = this.chatHistory.slice(-this.settings.maxHistory);
      }
      
      localStorage.setItem(key, JSON.stringify(this.chatHistory));
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
      const time = new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.displayMessage(msg.text, msg.sender, time);
    });
  }
  
  // Send chat data to server
  sendToServer() {
    if (!this.settings.saveToServer || !this.settings.formspreeEndpoint) return;
    
    // Only send if there are at least 2 messages
    if (this.chatHistory.length < 2) return;
    
    const payload = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      pageUrl: location.href,
      messages: this.chatHistory
    };
    
    fetch(this.settings.formspreeEndpoint, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ _subject: "Chatbot Log", chatData: payload })
    }).catch(err => console.error("Chat not sent to server:", err));
  }
  
  // Load settings
  loadSettings() {
    try {
      const savedSettings = localStorage.getItem('peterbot_settings');
      const defaultSettings = {
        botName: 'Peter Assistant',
        welcomeMessage: "👋 Hello! I'm Peter's virtual assistant. How can I help you today?",
        botAvatar: 'https://i.imgur.com/Cgy2Aeq.png',
        showTypingIndicator: true,
        showQuickReplies: true,
        responseDelay: 800,
        maxHistory: 50,
        formspreeEndpoint: 'https://formspree.io/f/xpwrbkrr',
        saveToServer: true
      };
      
      if (savedSettings) {
        return { ...defaultSettings, ...JSON.parse(savedSettings) };
      }
      
      return defaultSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      
      // Return default settings
      return {
        botName: 'Peter Assistant',
        welcomeMessage: "👋 Hello! I'm Peter's virtual assistant. How can I help you today?",
        botAvatar: 'https://i.imgur.com/Cgy2Aeq.png',
        showTypingIndicator: true,
        showQuickReplies: true,
        responseDelay: 800,
        maxHistory: 50,
        formspreeEndpoint: 'https://formspree.io/f/xpwrbkrr',
        saveToServer: true
      };
    }
  }
}

// Initialize the chatbot when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.peterBot = new PeterChatbot();
});
