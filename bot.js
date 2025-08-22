// PeterBot - Main Chatbot Script
console.log('Loading PeterBot...');

// Bot configuration
const BOT_CONFIG = {
    name: 'PeterBot',
    avatar: 'https://i.imgur.com/Cgy2Aeq.png',
    welcomeMessage: "👋 Hello! I'm PeterBot, Peter's AI assistant. How can I help you today?",
    responseDelay: 800,
    showTypingIndicator: true,
    showQuickReplies: true
};

// Global variables
let currentSessionId = null;
let chatHistory = [];
let isTyping = false;
let botContainer = null;

// Initialize bot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing PeterBot...');
    initializeBot();
});

// Initialize the chatbot
function initializeBot() {
    try {
        console.log('Initializing PeterBot...');
        
        // Load settings from localStorage
        loadBotSettings();
        
        // Create bot container
        createBotContainer();
        
        // Create new session
        createNewSession();
        
        // Load chat history
        loadChatHistory();
        
        // Show welcome message if no history
        if (chatHistory.length === 0) {
            setTimeout(() => {
                addBotMessage(BOT_CONFIG.welcomeMessage);
                showQuickReplies();
            }, 1000);
        }
        
        console.log('PeterBot initialized successfully');
    } catch (error) {
        console.error('Error initializing PeterBot:', error);
    }
}

// Load bot settings from localStorage
function loadBotSettings() {
    try {
        const settings = JSON.parse(localStorage.getItem('peterbot_settings') || '{}');
        
        if (settings.botName) BOT_CONFIG.name = settings.botName;
        if (settings.botAvatar) BOT_CONFIG.avatar = settings.botAvatar;
        if (settings.welcomeMessage) BOT_CONFIG.welcomeMessage = settings.welcomeMessage;
        if (settings.responseDelay) BOT_CONFIG.responseDelay = settings.responseDelay;
        if (settings.showTypingIndicator !== undefined) BOT_CONFIG.showTypingIndicator = settings.showTypingIndicator;
        if (settings.showQuickReplies !== undefined) BOT_CONFIG.showQuickReplies = settings.showQuickReplies;
        
        console.log('Bot settings loaded:', BOT_CONFIG);
    } catch (error) {
        console.error('Error loading bot settings:', error);
    }
}

// Create bot container HTML
function createBotContainer() {
    // Remove existing bot container if any
    const existing = document.getElementById('peterbot-container');
    if (existing) {
        existing.remove();
    }
    
    // Create bot HTML
    const botHTML = `
        <div id="peterbot-container" class="peterbot-container">
            <!-- Chat Toggle Button -->
            <div id="peterbot-toggle" class="peterbot-toggle">
                <img src="${BOT_CONFIG.avatar}" alt="${BOT_CONFIG.name}" class="bot-avatar">
                <div class="pulse-ring"></div>
            </div>
            
            <!-- Chat Window -->
            <div id="peterbot-chat" class="peterbot-chat">
                <!-- Header -->
                <div class="peterbot-header">
                    <div class="bot-info">
                        <img src="${BOT_CONFIG.avatar}" alt="${BOT_CONFIG.name}" class="bot-avatar-small">
                        <div class="bot-details">
                            <div class="bot-name">${BOT_CONFIG.name}</div>
                            <div class="bot-status">Online</div>
                        </div>
                    </div>
                    <div class="header-actions">
                        <button id="peterbot-minimize" class="btn-icon" title="Minimize">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                        <button id="peterbot-close" class="btn-icon" title="Close">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Messages Area -->
                <div id="peterbot-messages" class="peterbot-messages">
                    <!-- Messages will be added here -->
                </div>
                
                <!-- Quick Replies -->
                <div id="peterbot-quick-replies" class="peterbot-quick-replies" style="display: none;">
                    <!-- Quick replies will be added here -->
                </div>
                
                <!-- Input Area -->
                <div class="peterbot-input">
                    <div class="input-container">
                        <input type="text" id="peterbot-input" placeholder="Type your message..." autocomplete="off">
                        <button id="peterbot-send" class="send-button">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add bot to page
    document.body.insertAdjacentHTML('beforeend', botHTML);
    
    // Get container reference
    botContainer = document.getElementById('peterbot-container');
    
    // Add event listeners
    setupEventListeners();
    
    // Add CSS if not already added
    addBotStyles();
    
    console.log('Bot container created');
}

// Setup event listeners
function setupEventListeners() {
    // Toggle chat
    const toggleBtn = document.getElementById('peterbot-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleChat);
    }
    
    // Close chat
    const closeBtn = document.getElementById('peterbot-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeChat);
    }
    
    // Minimize chat
    const minimizeBtn = document.getElementById('peterbot-minimize');
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', minimizeChat);
    }
    
    // Send message
    const sendBtn = document.getElementById('peterbot-send');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    // Input enter key
    const input = document.getElementById('peterbot-input');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Auto-resize input
        input.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });
    }
    
    console.log('Event listeners setup complete');
}

// Toggle chat window
function toggleChat() {
    const chatWindow = document.getElementById('peterbot-chat');
    const toggleBtn = document.getElementById('peterbot-toggle');
    
    if (chatWindow && toggleBtn) {
        const isOpen = chatWindow.classList.contains('open');
        
        if (isOpen) {
            closeChat();
        } else {
            openChat();
        }
    }
}

// Open chat window
function openChat() {
    const chatWindow = document.getElementById('peterbot-chat');
    const toggleBtn = document.getElementById('peterbot-toggle');
    
    if (chatWindow && toggleBtn) {
        chatWindow.classList.add('open');
        toggleBtn.classList.add('hidden');
        
        // Focus input
        setTimeout(() => {
            const input = document.getElementById('peterbot-input');
            if (input) input.focus();
        }, 300);
        
        console.log('Chat opened');
    }
}

// Close chat window
function closeChat() {
    const chatWindow = document.getElementById('peterbot-chat');
    const toggleBtn = document.getElementById('peterbot-toggle');
    
    if (chatWindow && toggleBtn) {
        chatWindow.classList.remove('open');
        toggleBtn.classList.remove('hidden');
        
        console.log('Chat closed');
    }
}

// Minimize chat window
function minimizeChat() {
    closeChat();
}

// Create new session
function createNewSession() {
    currentSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    chatHistory = [];
    
    console.log('New session created:', currentSessionId);
}

// Load chat history
function loadChatHistory() {
    if (!currentSessionId) return;
    
    try {
        const stored = localStorage.getItem(`peterbot_chat_${currentSessionId}`);
        if (stored) {
            chatHistory = JSON.parse(stored);
            displayChatHistory();
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
        chatHistory = [];
    }
}

// Save chat history
function saveChatHistory() {
    if (!currentSessionId) return;
    
    try {
        localStorage.setItem(`peterbot_chat_${currentSessionId}`, JSON.stringify(chatHistory));
        
        // Update sessions index
        let sessionsIndex = JSON.parse(localStorage.getItem('peterbot_sessions_index') || '[]');
        if (!sessionsIndex.includes(currentSessionId)) {
            sessionsIndex.push(currentSessionId);
            localStorage.setItem('peterbot_sessions_index', JSON.stringify(sessionsIndex));
        }
    } catch (error) {
        console.error('Error saving chat history:', error);
    }
}

// Display chat history
function displayChatHistory() {
    const messagesContainer = document.getElementById('peterbot-messages');
    if (!messagesContainer) return;
    
    messagesContainer.innerHTML = '';
    
    chatHistory.forEach(message => {
        displayMessage(message.text, message.sender, false);
    });
    
    scrollToBottom();
}

// Send message
function sendMessage() {
    const input = document.getElementById('peterbot-input');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // Clear input
    input.value = '';
    input.style.height = 'auto';
    
    // Add user message
    addUserMessage(message);
    
    // Hide quick replies
    hideQuickReplies();
    
    // Process bot response
    setTimeout(() => {
        processBotResponse(message);
    }, BOT_CONFIG.responseDelay);
}

// Add user message
function addUserMessage(text) {
    const message = {
        text: text,
        sender: 'user',
        time: new Date().toISOString()
    };
    
    chatHistory.push(message);
    displayMessage(text, 'user');
    saveChatHistory();
}

// Add bot message
function addBotMessage(text) {
    const message = {
        text: text,
        sender: 'bot',
        time: new Date().toISOString()
    };
    
    chatHistory.push(message);
    displayMessage(text, 'bot');
    saveChatHistory();
}

// Display message
function displayMessage(text, sender, animate = true) {
    const messagesContainer = document.getElementById('peterbot-messages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    if (animate) {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
    }
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <img src="${BOT_CONFIG.avatar}" alt="${BOT_CONFIG.name}">
            </div>
            <div class="message-content">
                <div class="message-bubble">${text}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-bubble">${text}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    
    if (animate) {
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 50);
    }
    
    scrollToBottom();
}

// Show typing indicator
function showTypingIndicator() {
    if (!BOT_CONFIG.showTypingIndicator || isTyping) return;
    
    isTyping = true;
    const messagesContainer = document.getElementById('peterbot-messages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <img src="${BOT_CONFIG.avatar}" alt="${BOT_CONFIG.name}">
        </div>
        <div class="message-content">
            <div class="message-bubble">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Process bot response
function processBotResponse(userMessage) {
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        
        const response = getBotResponse(userMessage);
        addBotMessage(response);
        
        // Show quick replies after bot response
        if (BOT_CONFIG.showQuickReplies) {
            setTimeout(() => {
                showQuickReplies();
            }, 500);
        }
    }, BOT_CONFIG.responseDelay);
}

// Get bot response
function getBotResponse(message) {
    const msg = message.toLowerCase();
    
    // Greetings
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        return "Hello! 👋 I'm PeterBot, Peter's AI assistant. I'm here to help you learn more about Peter's work and services. What would you like to know?";
    }
    
    // Services
    if (msg.includes('service') || msg.includes('what do you do') || msg.includes('what can you do')) {
        return "Peter offers several services:\n\n🎵 Music Production & Beat Making\n💻 Web Development\n🎨 Graphic Design\n📱 Mobile App Development\n🎬 Video Editing\n\nWhich service interests you most?";
    }
    
    // Music related
    if (msg.includes('music') || msg.includes('beat') || msg.includes('producer') || msg.includes('peterphonist')) {
        return "🎵 Peter is a talented music producer known as 'Peterphonist'! He creates:\n\n• Custom beats and instrumentals\n• Music production for artists\n• Audio mixing and mastering\n• Jingles and background music\n\nWould you like to hear some samples or discuss a music project?";
    }
    
    // Web development
    if (msg.includes('web') || msg.includes('website') || msg.includes('development')) {
        return "💻 Peter creates amazing websites and web applications:\n\n• Responsive web design\n• E-commerce solutions\n• Custom web applications\n• Website optimization\n• Maintenance and updates\n\nDo you have a web project in mind?";
    }
    
    // Pricing
    if (msg.includes('price') || msg.includes('cost') || msg.includes('rate') || msg.includes('charge')) {
        return "💰 Pricing varies based on project scope and requirements:\n\n• Music Production: $50-200 per beat\n• Web Development: $500-5000 per project\n• Graphic Design: $25-150 per design\n• Mobile Apps: $1000-10000 per app\n\nFor accurate pricing, please share your project details!";
    }
    
    // Contact
    if (msg.includes('contact') || msg.includes('reach') || msg.includes('phone') || msg.includes('email')) {
        return "📞 You can reach Peter through:\n\n📧 Email: peter@example.com\n📱 WhatsApp: +1234567890\n💬 Telegram: @peterphonist\n🐦 Twitter: @peterphonist\n\nFeel free to reach out anytime!";
    }
    
    // Portfolio
    if (msg.includes('portfolio') || msg.includes('work') || msg.includes('sample') || msg.includes('example')) {
        return "🎨 Check out Peter's amazing work:\n\n🎵 Music: SoundCloud.com/peterphonist\n💻 Websites: GitHub.com/peter\n🎨 Designs: Behance.net/peter\n📱 Apps: Available on App Store & Play Store\n\nWhich portfolio would you like to explore?";
    }
    
    // About
    if (msg.includes('about') || msg.includes('who is peter') || msg.includes('tell me about')) {
        return "👨‍💻 Peter is a multi-talented creative professional:\n\n• 5+ years in music production\n• Expert web developer\n• Skilled graphic designer\n• Mobile app creator\n• Video editing specialist\n\nHe's passionate about bringing creative ideas to life!";
    }
    
    // Thanks
    if (msg.includes('thank') || msg.includes('thanks')) {
        return "You're very welcome! 😊 I'm always here to help. Is there anything else you'd like to know about Peter's services?";
    }
    
    // Default response
    const defaultResponses = [
        "That's interesting! Could you tell me more about what you're looking for?",
        "I'd love to help you with that! Can you provide more details?",
        "Great question! Let me connect you with more information about Peter's services.",
        "I'm here to help! What specific service or information are you interested in?",
        "Thanks for reaching out! How can Peter assist you with your project?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Show quick replies
function showQuickReplies() {
    if (!BOT_CONFIG.showQuickReplies) return;
    
    const quickRepliesContainer = document.getElementById('peterbot-quick-replies');
    if (!quickRepliesContainer) return;
    
    const replies = [
        "🎵 Music Production",
        "💻 Web Development", 
        "💰 Pricing Info",
        "📞 Contact Peter",
        "🎨 View Portfolio"
    ];
    
    quickRepliesContainer.innerHTML = '';
    
    replies.forEach(reply => {
        const button = document.createElement('button');
        button.className = 'quick-reply-btn';
        button.textContent = reply;
        button.addEventListener('click', () => {
            handleQuickReply(reply);
        });
        quickRepliesContainer.appendChild(button);
    });
    
    quickRepliesContainer.style.display = 'flex';
}

// Hide quick replies
function hideQuickReplies() {
    const quickRepliesContainer = document.getElementById('peterbot-quick-replies');
    if (quickRepliesContainer) {
        quickRepliesContainer.style.display = 'none';
    }
}

// Handle quick reply
function handleQuickReply(reply) {
    // Add as user message
    addUserMessage(reply);
    
    // Hide quick replies
    hideQuickReplies();
    
    // Process response
    setTimeout(() => {
        processBotResponse(reply);
    }, BOT_CONFIG.responseDelay);
}

// Scroll to bottom
function scrollToBottom() {
    const messagesContainer = document.getElementById('peterbot-messages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Add bot styles
function addBotStyles() {
    // Check if styles already exist
    if (document.getElementById('peterbot-styles')) return;
    
    const styles = `
        <style id="peterbot-styles">
        /* PeterBot Styles */
        .peterbot-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .peterbot-toggle {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            position: relative;
        }
        
        .peterbot-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(0,0,0,0.2);
        }
        
        .peterbot-toggle.hidden {
            opacity: 0;
            transform: scale(0);
            pointer-events: none;
        }
        
        .bot-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid white;
        }
        
        .pulse-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px solid #667eea;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
        }
        
        .peterbot-chat {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            display: flex;
            flex-direction: column;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            pointer-events: none;
            transition: all 0.3s ease;
            overflow: hidden;
        }
        
        .peterbot-chat.open {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: all;
        }
        
        .peterbot-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .bot-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .bot-avatar-small {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.3);
        }
        
        .bot-name {
            font-weight: 600;
            font-size: 16px;
        }
        
        .bot-status {
            font-size: 12px;
            opacity: 0.8;
        }
        
        .header-actions {
            display: flex;
            gap: 5px;
        }
        
        .btn-icon {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 5px;
            border-radius: 5px;
            transition: background 0.2s;
        }
        
        .btn-icon:hover {
            background: rgba(255,255,255,0.1);
        }
        
        .peterbot-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #f8f9fa;
        }
        
        .message {
            margin-bottom: 15px;
            display: flex;
            transition: all 0.3s ease;
        }
        
        .user-message {
            justify-content: flex-end;
        }
        
        .bot-message {
            justify-content: flex-start;
        }
        
        .message-avatar {
            width: 30px;
            height: 30px;
            margin-right: 10px;
        }
        
        .message-avatar img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
        
        .message-content {
            max-width: 80%;
        }
        
        .message-bubble {
            padding: 12px 16px;
            border-radius: 18px;
            word-wrap: break-word;
            white-space: pre-line;
        }
        
        .user-message .message-bubble {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-bottom-right-radius: 5px;
        }
        
        .bot-message .message-bubble {
            background: white;
            color: #333;
            border: 1px solid #e9ecef;
            border-bottom-left-radius: 5px;
        }
        
        .message-time {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
            text-align: right;
        }
        
        .bot-message .message-time {
            text-align: left;
        }
        
        .typing-indicator .message-bubble {
            padding: 16px;
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
        }
        
        .typing-dots span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #999;
            animation: typing 1.4s infinite;
        }
        
        .typing-dots span:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dots span:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
        }
        
        .peterbot-quick-replies {
            padding: 10px 20px;
            background: white;
            border-top: 1px solid #e9ecef;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .quick-reply-btn {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 20px;
            padding: 8px 12px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .quick-reply-btn:hover {
            background: #e9ecef;
            transform: translateY(-1px);
        }
        
        .peterbot-input {
            background: white;
            border-top: 1px solid #e9ecef;
            padding: 15px 20px;
        }
        
        .input-container {
            display: flex;
            align-items: flex-end;
            gap: 10px;
        }
        
        #peterbot-input {
            flex: 1;
            border: 1px solid #dee2e6;
            border-radius: 20px;
            padding: 10px 15px;
            font-size: 14px;
            resize: none;
            outline: none;
            min-height: 20px;
            max-height: 80px;
        }
        
        #peterbot-input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
        }
        
        .send-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        
        .send-button:hover {
            transform: scale(1.1);
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
            .peterbot-container {
                bottom: 10px;
                right: 10px;
            }
            
            .peterbot-chat {
                width: calc(100vw - 20px);
                height: calc(100vh - 100px);
                max-width: 350px;
                max-height: 500px;
            }
            
            .message-content {
                max-width: 85%;
            }
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Export for admin panel
window.PeterBot = {
    init: initializeBot,
    config: BOT_CONFIG,
    openChat: openChat,
    closeChat: closeChat,
    addMessage: addBotMessage
};

console.log('PeterBot script loaded successfully');
