/**
 * Simple Chatbot for Peter's Portfolio
 * A lightweight, error-free implementation
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
  const chatHistoryKey = 'peter_simple_chat_history';
  let chatHistory = loadChatHistory();
  
  // Initialize
  function init() {
    // Toggle chat window
    chatToggleBtn.addEventListener('click', toggleChat);
    closeChatBtn.addEventListener('click', closeChat);
    
    // Handle form submission
    chatForm.addEventListener('submit', handleSubmit);
    
    // Display chat history
    displayChatHistory();
    
    // Show welcome message if chat is empty
    if (chatHistory.length === 0) {
      setTimeout(() => {
        addBotMessage("👋 Hello! I'm Peter's assistant. How can I help you today?");
        showQuickReplies(['Services', 'Portfolio', 'Contact', 'Pricing']);
      }, 500);
    }
  }
  
  // Toggle chat window
  function toggleChat() {
    chatWindow.classList.toggle('d-none');
    if (!chatWindow.classList.contains('d-none')) {
      chatInput.focus();
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
  
  // Close chat window
  function closeChat() {
    chatWindow.classList.add('d-none');
  }
  
  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;
    
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
    messageDiv.className = 'chat-message user-message';
    
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    
    const timeSpan = document.createElement('div');
    timeSpan.className = 'message-time';
    timeSpan.textContent = time;
    bubble.appendChild(timeSpan);
    
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
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
    messageDiv.className = 'chat-message bot-message';
    
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = formatText(text);
    
    const timeSpan = document.createElement('div');
    timeSpan.className = 'message-time';
    timeSpan.textContent = time;
    bubble.appendChild(timeSpan);
    
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
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
    text = text.replace(urlRegex, url => `<a href="${url}" target="_blank">${url}</a>`);
    
    // Convert line breaks to <br>
    text = text.replace(/\n/g, '<br>');
    
    return text;
  }
  
  // Show typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-indicator';
    typingDiv.innerHTML = `
      <div class="chat-bubble" style="min-width: 50px;">
        <span class="typing-dot">.</span>
        <span class="typing-dot">.</span>
        <span class="typing-dot">.</span>
      </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add CSS for typing animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes typingAnimation {
        0% { opacity: 0.3; }
        50% { opacity: 1; }
        100% { opacity: 0.3; }
      }
      .typing-dot {
        animation: typingAnimation 1s infinite;
        margin-right: 2px;
      }
      .typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      .typing-dot:nth-child(3) {
        animation-delay: 0.4s;
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
    
    replies.forEach(reply => {
      const button = document.createElement('button');
      button.className = 'quick-reply-btn';
      button.textContent = reply;
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
    
    chatMessages.appendChild(container);
    chatMessages.scrollTop = chatMessages.scrollHeight;
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
    chatHistory.forEach(msg => {
      if (msg.sender === 'user') {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user-message';
        
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.textContent = msg.text;
        
        const timeSpan = document.createElement('div');
        timeSpan.className = 'message-time';
        timeSpan.textContent = msg.time;
        bubble.appendChild(timeSpan);
        
        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);
      } else {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot-message';
        
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.innerHTML = formatText(msg.text);
        
        const timeSpan = document.createElement('div');
        timeSpan.className = 'message-time';
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
