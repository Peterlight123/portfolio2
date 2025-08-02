/**
 * Fixed Chatbot for Peter's Portfolio
 * A standalone implementation that works without dependencies
 */
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const chatToggleBtn = document.getElementById('chat-toggle-btn');
  const closeChatBtn = document.getElementById('close-chat-btn');
  const chatWindow = document.getElementById('chat-window');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  
  // Chat history
  const chatHistoryKey = 'peter_fixed_chat_history';
  let chatHistory = loadChatHistory();
  
  // Initialize
  function init() {
    // Toggle chat window
    if (chatToggleBtn) {
      chatToggleBtn.addEventListener('click', toggleChat);
    }
    
    if (closeChatBtn) {
      closeChatBtn.addEventListener('click', closeChat);
    }
    
    // Handle form submission
    if (chatForm) {
      chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (chatInput && chatInput.value.trim()) {
          handleSubmit();
        }
      });
    }
    
    // Display chat history
    displayChatHistory();
    
    // Show welcome message if chat is empty
    if (chatHistory.length === 0) {
      setTimeout(() => {
        addBotMessage("👋 Hello! I'm Peter's assistant. How can I help you today?");
        showQuickReplies(['Services', 'Portfolio', 'Contact', 'Pricing']);
      }, 500);
    }
    
    // Make sure the chatbot is responsive
    window.addEventListener('resize', adjustChatWindowPosition);
    adjustChatWindowPosition();
  }
  
  // Toggle chat window
  function toggleChat() {
    if (chatWindow) {
      chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
      if (chatWindow.style.display === 'flex' && chatInput) {
        chatInput.focus();
        if (chatMessages) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      }
    }
  }
  
  // Close chat window
  function closeChat() {
    if (chatWindow) {
      chatWindow.style.display = 'none';
    }
  }
  
  // Adjust chat window position for mobile
  function adjustChatWindowPosition() {
    if (chatWindow) {
      if (window.innerWidth <= 576) {
        chatWindow.style.width = '90vw';
        chatWindow.style.maxWidth = '320px';
        chatWindow.style.right = '5%';
      } else {
        chatWindow.style.width = '320px';
        chatWindow.style.right = '0';
      }
    }
  }
  
  // Handle form submission
  function handleSubmit() {
    const message = chatInput.value.trim();
    
    // Add user message
    addUserMessage(message);
    chatInput.value = '';
    
    // Remove any quick replies
    removeQuickReplies();
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate response with delay
    setTimeout(() => {
      hideTypingIndicator();
      const response = generateResponse(message);
      addBotMessage(response);
      
      // Show relevant quick replies
      showRelevantQuickReplies(message, response);
      
      // Save chat history
      saveChatHistory();
    }, 800);
  }
  
  // Add user message
  function addUserMessage(text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const messageDiv = document.createElement('div');
    messageDiv.style.marginBottom = '15px';
    messageDiv.style.display = 'flex';
    messageDiv.style.justifyContent = 'flex-end';
    
    const bubble = document.createElement('div');
    bubble.style.backgroundColor = '#0d6efd';
    bubble.style.color = 'white';
    bubble.style.padding = '10px 15px';
    bubble.style.borderRadius = '18px 18px 0 18px';
    bubble.style.maxWidth = '80%';
    bubble.style.position = 'relative';
    bubble.textContent = text;
    
    const timeSpan = document.createElement('div');
    timeSpan.style.fontSize = '0.7rem';
    timeSpan.style.opacity = '0.7';
    timeSpan.style.marginTop = '5px';
    timeSpan.style.textAlign = 'right';
    timeSpan.style.color = 'rgba(255, 255, 255, 0.8)';
    timeSpan.textContent = time;
    bubble.appendChild(timeSpan);
    
    messageDiv.appendChild(bubble);
    
    if (chatMessages) {
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Add to history
    chatHistory.push({
      sender: 'user',
      text: text,
      time: time
    });
  }
  
  // Add bot message
  function addBotMessage(text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const messageDiv = document.createElement('div');
    messageDiv.style.marginBottom = '15px';
    messageDiv.style.display = 'flex';
    messageDiv.style.justifyContent = 'flex-start';
    
    const bubble = document.createElement('div');
    bubble.style.backgroundColor = 'white';
    bubble.style.color = '#212529';
    bubble.style.padding = '10px 15px';
    bubble.style.borderRadius = '18px 18px 18px 0';
    bubble.style.maxWidth = '80%';
    bubble.style.position = 'relative';
    bubble.style.border = '1px solid #dee2e6';
    bubble.innerHTML = formatText(text);
    
    const timeSpan = document.createElement('div');
    timeSpan.style.fontSize = '0.7rem';
    timeSpan.style.opacity = '0.7';
    timeSpan.style.marginTop = '5px';
    timeSpan.style.textAlign = 'right';
    timeSpan.textContent = time;
    bubble.appendChild(timeSpan);
    
    messageDiv.appendChild(bubble);
    
    if (chatMessages) {
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Add to history
    chatHistory.push({
      sender: 'bot',
      text: text,
      time: time
    });
  }
  
  // Format text (convert URLs to links, etc.)
  function formatText(text) {
    // Convert URLs to links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    text = text.replace(urlRegex, url => `<a href="${url}" target="_blank" style="color: #0d6efd; text-decoration: underline;">${url}</a>`);
    
    // Convert line breaks to <br>
    text = text.replace(/\n/g, '<br>');
    
    return text;
  }
  
  // Show typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.style.marginBottom = '15px';
    typingDiv.style.display = 'flex';
    typingDiv.style.justifyContent = 'flex-start';
    
    const bubble = document.createElement('div');
    bubble.style.backgroundColor = 'white';
    bubble.style.padding = '10px 15px';
    bubble.style.borderRadius = '18px 18px 18px 0';
    bubble.style.minWidth = '50px';
    bubble.style.border = '1px solid #dee2e6';
    bubble.style.display = 'flex';
    bubble.style.alignItems = 'center';
    bubble.style.justifyContent = 'center';
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.borderRadius = '50%';
      dot.style.backgroundColor = '#0d6efd';
      dot.style.margin = '0 2px';
      dot.style.animation = `typingAnimation 1s infinite ${i * 0.2}s`;
      bubble.appendChild(dot);
    }
    
    typingDiv.appendChild(bubble);
    
    if (chatMessages) {
      chatMessages.appendChild(typingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Add animation style
    const style = document.createElement('style');
    style.textContent = `
      @keyframes typingAnimation {
        0% { opacity: 0.3; transform: translateY(0); }
        50% { opacity: 1; transform: translateY(-3px); }
        100% { opacity: 0.3; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Hide typing indicator
  function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  // Show quick replies
  function showQuickReplies(replies) {
    const container = document.createElement('div');
    container.className = 'quick-reply-container';
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.justifyContent = 'center';
    container.style.gap = '8px';
    container.style.marginTop = '10px';
    container.style.marginBottom = '15px';
    
    replies.forEach(reply => {
      const button = document.createElement('button');
      button.style.fontSize = '0.85rem';
      button.style.padding = '6px 12px';
      button.style.borderRadius = '20px';
      button.style.backgroundColor = 'white';
      button.style.color = '#0d6efd';
      button.style.border = '1px solid #0d6efd';
      button.style.transition = 'all 0.2s ease';
      button.style.whiteSpace = 'nowrap';
      button.style.cursor = 'pointer';
      button.textContent = reply;
      
      // Hover effect
      button.onmouseover = function() {
        this.style.backgroundColor = '#0d6efd';
        this.style.color = 'white';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 3px 8px rgba(13, 110, 253, 0.3)';
      };
      
      button.onmouseout = function() {
        this.style.backgroundColor = 'white';
        this.style.color = '#0d6efd';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
      };
      
      button.addEventListener('click', () => {
        // Use the quick reply as user input
        addUserMessage(reply);
        
        // Remove quick replies
        removeQuickReplies();
        
        // Show typing indicator
        showTypingIndicator();
        
        // Generate response with delay
        setTimeout(() => {
          hideTypingIndicator();
          const response = generateResponse(reply);
          addBotMessage(response);
          
          // Show relevant quick replies
          showRelevantQuickReplies(reply, response);
          
          // Save chat history
          saveChatHistory();
        }, 800);
      });
      
      container.appendChild(button);
    });
    
    if (chatMessages) {
      chatMessages.appendChild(container);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
  
  // Remove quick replies
  function removeQuickReplies() {
    const container = document.querySelector('.quick-reply-container');
    if (container) {
      container.remove();
    }
  }
  
  // Show relevant quick replies based on context
  function showRelevantQuickReplies(userMessage, botResponse) {
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
    
    showQuickReplies(quickReplies);
  }
  
  // Generate response based on user input
  function generateResponse(message) {
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
    
    // Default response
    return "I'm here to help with information about Peter's services, projects, pricing, or how to get in touch. What would you like to know?";
  }
  
  // Load chat history from localStorage
  function loadChatHistory() {
    try {
      const saved = localStorage.getItem(chatHistoryKey);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  }
  
  // Save chat history to localStorage
  function saveChatHistory() {
    try {
      // Limit history to last 50 messages
      const historyToSave = chatHistory.slice(-50);
      localStorage.setItem(chatHistoryKey, JSON.stringify(historyToSave));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }
  
  // Display chat history
  function displayChatHistory() {
    if (!chatMessages) return;
    
    chatHistory.forEach(msg => {
      if (msg.sender === 'user') {
        const messageDiv = document.createElement('div');
        messageDiv.style.marginBottom = '15px';
        messageDiv.style.display = 'flex';
        messageDiv.style.justifyContent = 'flex-end';
        
        const bubble = document.createElement('div');
        bubble.style.backgroundColor = '#0d6efd';
        bubble.style.color = 'white';
        bubble.style.padding = '10px 15px';
        bubble.style.borderRadius = '18px 18px 0 18px';
        bubble.style.maxWidth = '80%';
        bubble.style.position = 'relative';
        bubble.textContent = msg.text;
        
        const timeSpan = document.createElement('div');
        timeSpan.style.fontSize = '0.7rem';
        timeSpan.style.opacity = '0.7';
        timeSpan.style.marginTop = '5px';
        timeSpan.style.textAlign = 'right';
        timeSpan.style.color = 'rgba(255, 255, 255, 0.8)';
        timeSpan.textContent = msg.time;
        bubble.appendChild(timeSpan);
        
        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);
      } else {
        const messageDiv = document.createElement('div');
        messageDiv.style.marginBottom = '15px';
        messageDiv.style.display = 'flex';
        messageDiv.style.justifyContent = 'flex-start';
        
        const bubble = document.createElement('div');
        bubble.style.backgroundColor = 'white';
        bubble.style.color = '#212529';
        bubble.style.padding = '10px 15px';
        bubble.style.borderRadius = '18px 18px 18px 0';
        bubble.style.maxWidth = '80%';
        bubble.style.position = 'relative';
        bubble.style.border = '1px solid #dee2e6';
        bubble.innerHTML = formatText(msg.text);
        
        const timeSpan = document.createElement('div');
        timeSpan.style.fontSize = '0.7rem';
        timeSpan.style.opacity = '0.7';
        timeSpan.style.marginTop = '5px';
        timeSpan.style.textAlign = 'right';
        timeSpan.textContent = msg.time;
        bubble.appendChild(timeSpan);
        
        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);
      }
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Initialize the chatbot
  init();
});
