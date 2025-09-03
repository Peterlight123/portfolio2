// Enhanced PeterBot v3.0 with AI Integration
console.log('Loading Enhanced PeterBot v3.0 with AI...');

// Configuration
const PETERBOT_API_CONFIG = {
    googleAI: {
        apiKey: 'AIzaSyB03WLfMuQIz8iZjwu6sebdtwfXXjXG-Qw',
        model: 'gemini-pro',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
    }
};

const BOT_CONFIG = {
    name: 'PLS BOT',
    avatar: 'https://i.imgur.com/5Eu01Tk.jpeg', 
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    showTypingIndicator: true,
    typingDelay: 1500,
    useAI: true,
    fallbackToRules: true,
    maxRetries: 2,
    cacheResponses: true
};

// Enhanced Knowledge Base
const ENHANCED_KNOWLEDGE_BASE = {
    services: {
        webDevelopment: {
            description: "Professional web development services including responsive websites, e-commerce solutions, and web applications",
            pricing: "Custom quotes based on project scope",
            technologies: ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "PHP"]
        },
        virtualAssistant: {
            description: "Comprehensive virtual assistant services for administrative support and business management",
            services: ["Email management", "Social media management", "Content creation", "Administrative support"],
            pricing: "Hourly and project-based rates available"
        },
        digitalMarketing: {
            description: "Strategic digital marketing services to grow your online presence",
            services: ["Social media marketing", "Content strategy", "SEO optimization", "Email campaigns"],
            pricing: "Package deals and custom strategies available"
        },
        saxophone: {
            description: "Professional saxophone performances for special events",
            pricing: {
                wedding: { usd: 55, ngn: 82500 },
                birthday: { usd: 45, ngn: 67500 },
                church: { usd: 75, ngn: 112500 }
            }
        }
    },
    contact: {
        email: "petereluwade55@gmail.com",
        whatsapp: "+234 8108821809",
        telegram: "@peterlightspeed",
        website: "https://peterlight123.github.io/portfolio/",
        socialMedia: "@peterphonist"
    },
    payment: {
        crypto: ["Bitcoin", "Ethereum", "USDT"],
        bank: {
            name: "Zenith Bank",
            account: "4291620354",
            accountName: "Eluwade Peter Toluwanimi"
        },
        sponsorPage: "sponsor.html"
    }
};

// Global variables
let currentSessionId = null;
let chatHistory = [];
let isTyping = false;
let responseCache = new Map();

// Quick replies based on context
const CONTEXTUAL_QUICK_REPLIES = {
    default: [
        "💻 Web Development",
        "👨‍💼 Virtual Assistant",
        "📊 Digital Marketing", 
        "🎷 Saxophone Services",
        "💳 Payment Methods",
        "📞 Contact Info"
    ],
    services: [
        "💰 View Pricing",
        "📋 Service Details",
        "🚀 Start Project",
        "📞 Contact Peter"
    ],
    saxophone: [
        "💒 Wedding Performance",
        "🎂 Birthday Surprise",
        "⛪ Church Service",
        "📅 Book Performance"
    ],
    payment: [
        "🪙 Crypto Payment",
        "🏦 Bank Transfer",
        "💰 View Sponsor Page",
        "❓ Payment Help"
    ],
    contact: [
        "📧 Send Email",
        "📱 WhatsApp Chat",
        "🌐 Visit Website",
        "📱 Social Media"
    ]
};

// Initialize bot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Enhanced PLS Bot...');
    setTimeout(initializeBot, 100);
});

// Main initialization function
function initializeBot() {
    try {
        console.log('Initializing Enhanced PLS BOT v3.0...');
        
        createNewSession();
        createBotContainer();
        setupEventListeners();
        loadBotSettings();
        
        // Show welcome message after a short delay
        setTimeout(() => {
            showWelcomeMessage();
            showQuickReplies();
        }, 1000);
        
        console.log('Enhanced PLS Bot initialized successfully!');
        
    } catch (error) {
        console.error('Error initializing Enhanced PLS Bot:', error);
        // Fallback initialization
        createBasicBot();
    }
}

// Create bot container with enhanced styling
function createBotContainer() {
    // Add enhanced styles first
    addEnhancedBotStyles();
    
    const botHTML = `
        <div id="peterbot-container" class="peterbot-container">
            <!-- Chat Toggle Button -->
            <div id="peterbot-toggle" class="peterbot-toggle" title="Chat with ${BOT_CONFIG.name}">
                <div class="toggle-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
                        <circle cx="7" cy="9" r="1" fill="currentColor"/>
                        <circle cx="12" cy="9" r="1" fill="currentColor"/>
                        <circle cx="17" cy="9" r="1" fill="currentColor"/>
                    </svg>
                </div>
                <div class="notification-badge" id="peterbot-notification">1</div>
            </div>
            
            <!-- Chat Window -->
            <div id="peterbot-chat" class="peterbot-chat">
                <!-- Header -->
                <div class="peterbot-header">
                    <div class="bot-info">
                        <div class="bot-avatar">
                            <img src="${BOT_CONFIG.avatar}" alt="${BOT_CONFIG.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMCAySDRDMi45IDIgMiAyLjkgMiA0VjIyTDYgMThIMjBDMjEuMSAxOCAyMiAxNy4xIDIyIDE2VjRDMjIgMi45IDIxLjEgMiAyMCAyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo='">
                        </div>
                        <div class="bot-details">
                            <div class="bot-name">${BOT_CONFIG.name}</div>
                            <div class="bot-status">
                                <span class="status-indicator"></span>
                                <span>Online • AI Powered</span>
                            </div>
                        </div>
                    </div>
                    <div class="header-actions">
                        <button id="peterbot-minimize" class="header-btn" title="Minimize">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M19 13H5V11H19V13Z" fill="currentColor"/>
                            </svg>
                        </button>
                        <button id="peterbot-close" class="header-btn" title="Close">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Messages Container -->
                <div id="peterbot-messages" class="peterbot-messages">
                    <!-- Messages will be added here -->
                </div>
                
                <!-- Quick Replies -->
                <div id="peterbot-quick-replies" class="peterbot-quick-replies">
                    <!-- Quick replies will be added here -->
                </div>
                
                <!-- Input Area -->
                <div class="peterbot-input">
                    <div class="input-container">
                        <textarea 
                            id="peterbot-input" 
                            placeholder="Type your message..." 
                            rows="1"
                        ></textarea>
                        <button id="peterbot-send" class="send-button" title="Send message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', botHTML);
    console.log('Enhanced bot container created');
}

// Add enhanced bot styles
function addEnhancedBotStyles() {
    const styles = `
        <style>
        /* Enhanced PeterBot Styles v3.0 */
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
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .peterbot-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
        }
        
        .peterbot-toggle.hidden {
            transform: scale(0);
            opacity: 0;
            pointer-events: none;
        }
        
        .toggle-icon {
            transition: transform 0.3s ease;
        }
        
        .peterbot-toggle:hover .toggle-icon {
            transform: rotate(10deg);
        }
        
        .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ff4757;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .peterbot-chat {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 380px;
            height: 600px;
            max-width: calc(100vw - 40px);
            max-height: calc(100vh - 40px);
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            transform: scale(0) translateY(20px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            border: 1px solid #e9ecef;
        }
        
        .peterbot-chat.open {
            transform: scale(1) translateY(0);
            opacity: 1;
        }
        
        .peterbot-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 20px 20px 0 0;
        }
        
        .bot-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .bot-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .bot-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .bot-name {
            font-weight: 600;
            font-size: 16px;
        }
        
        .bot-status {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            opacity: 0.9;
        }
        
        .status-indicator {
            width: 8px;
            height: 8px;
            background: #2ed573;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        .header-actions {
            display: flex;
            gap: 8px;
        }
        
        .header-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 8px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            color: white;
        }
        
        .header-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }
        
        .peterbot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f8f9fa;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .message {
            display: flex;
            align-items: flex-end;
            gap: 10px;
            max-width: 100%;
            animation: messageSlideIn 0.3s ease-out;
        }
        
        .user-message {
            flex-direction: row-reverse;
        }
        
        .message-content {
            max-width: 75%;
            display: flex;
            flex-direction: column;
        }
        
        .message-bubble {
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
            word-wrap: break-word;
            transition: all 0.2s ease;
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
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
            background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
        }
        
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
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
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-10px); opacity: 1; }
        }
        
        .peterbot-quick-replies {
            padding: 15px 20px;
            background: white;
            border-top: 1px solid #e9ecef;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            max-height: 120px;
            overflow-y: auto;
        }
        
        .quick-reply-btn {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border: 1px solid #dee2e6;
            border-radius: 20px;
            padding: 8px 12px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
            position: relative;
            overflow: hidden;
        }
        
        .quick-reply-btn:hover {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .quick-reply-btn:active {
            transform: translateY(0);
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
            background: #f8f9fa;
            border-radius: 25px;
            padding: 5px;
            border: 2px solid transparent;
            transition: border-color 0.3s ease;
        }
        
        .input-container:focus-within {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        #peterbot-input {
            flex: 1;
            border: none;
            background: transparent;
            padding: 10px 15px;
            font-size: 14px;
            resize: none;
            outline: none;
            min-height: 20px;
            max-height: 80px;
            font-family: inherit;
        }
        
        #peterbot-input::placeholder {
            color: #999;
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
            transition: all 0.3s ease;
            flex-shrink: 0;
            position: relative;
            overflow: hidden;
        }
        
        .send-button:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .send-button:active {
            transform: scale(0.95);
        }
        
        /* Enhanced scrollbar */
        .peterbot-messages::-webkit-scrollbar {
            width: 6px;
        }
        
        .peterbot-messages::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }
        
        .peterbot-messages::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 3px;
        }
        
        .peterbot-messages::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #5a67d8, #6b46c1);
        }
        
        /* AI Enhancement Indicators */
        .ai-powered-message {
            position: relative;
        }
        
        .ai-powered-message::after {
            content: '✨ AI';
            position: absolute;
            top: -8px;
            right: 10px;
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            color: white;
            font-size: 8px;
            padding: 2px 4px;
            border-radius: 6px;
            font-weight: bold;
        }
        
        /* Payment method highlights */
        .payment-highlight {
            background: linear-gradient(135deg, #10ac84, #00d2d3);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
        }
        
        /* Service pricing highlights */
        .price-highlight {
            background: linear-gradient(135deg, #feca57, #ff9ff3);
            color: #333;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
            .peterbot-container {
                bottom: 10px;
                right: 10px;
                left: 10px;
            }
            
            .peterbot-chat {
                width: calc(100vw - 20px);
                height: calc(100vh - 100px);
                max-width: none;
                max-height: 600px;
                right: 0;
            }
            
            .message-content {
                max-width: 85%;
            }
            
            .peterbot-toggle {
                width: 50px;
                height: 50px;
            }
            
            .bot-avatar {
                width: 30px;
                height: 30px;
            }
            
            .quick-reply-btn {
                font-size: 11px;
                padding: 6px 10px;
            }
        }
        
        /* Animation for new messages */
        @keyframes messageSlideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Loading states */
        .loading-shimmer {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
        }
        
        /* Enhanced hover effects */
        .message-bubble:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .user-message .message-bubble:hover {
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Load bot settings
function loadBotSettings() {
    try {
        const savedSettings = localStorage.getItem('peterbot_settings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            Object.assign(BOT_CONFIG, settings);
        }
        console.log('Enhanced bot settings loaded:', BOT_CONFIG);
    } catch (error) {
        console.error('Error loading bot settings:', error);
    }
}

// Show welcome message
function showWelcomeMessage() {
    const welcomeMessage = `👋 **Welcome to PLS BOT!**

I'm Peter's AI-powered assistant, ready to help you with:

💻 **Web Development** - Custom websites & applications
👨‍💼 **Virtual Assistant** - Administrative & business support  
📊 **Digital Marketing** - Grow your online presence
🎷 **Saxophone Performances** - Special events & celebrations

**Quick Stats:**
✅ 100+ Projects Completed
🌟 AI-Enhanced Responses
⚡ Instant Support Available
💳 Crypto & Bank Payments Accepted

🌐 **Visit Portfolio:** https://peterlight123.github.io/portfolio/

What can I help you with today?`;

    setTimeout(() => {
        addBotMessage(welcomeMessage);
    }, 500);
}

// Show contextual quick replies
function showContextualQuickReplies(context = 'default') {
    const quickRepliesContainer = document.getElementById('peterbot-quick-replies');
    if (!quickRepliesContainer) return;
    
    const replies = CONTEXTUAL_QUICK_REPLIES[context] || CONTEXTUAL_QUICK_REPLIES.default;
    
    quickRepliesContainer.innerHTML = '';
    quickRepliesContainer.style.display = 'flex';
    
    replies.forEach(reply => {
        const button = document.createElement('button');
        button.className = 'quick-reply-btn';
        button.textContent = reply;
        button.addEventListener('click', () => {
            handleQuickReply(reply);
        });
        quickRepliesContainer.appendChild(button);
    });
}

// Handle quick reply clicks
function handleQuickReply(reply) {
    // Add user message
    addUserMessage(reply);
    
    // Hide quick replies temporarily
    hideQuickReplies();
    
    // Process response
    setTimeout(() => {
        processBotResponse(reply);
    }, 300);
}

// Process bot response with AI integration
async function processBotResponse(userMessage) {
    showTypingIndicator();
    
    try {
        let response;
        
        if (BOT_CONFIG.useAI) {
            // Try AI response first
            response = await getAIResponse(userMessage);
        }
        
        // Fallback to rule-based if AI fails or is disabled
        if (!response && BOT_CONFIG.fallbackToRules) {
            response = getBotResponse(userMessage);
        }
        
        // Final fallback
        if (!response) {
            response = "I'm here to help! Please let me know what you'd like to know about Peter's services.";
        }
        
        setTimeout(() => {
            hideTypingIndicator();
            addBotMessage(response);
            
            // Show contextual quick replies
            const context = determineContext(userMessage);
            setTimeout(() => {
                showContextualQuickReplies(context);
            }, 500);
        }, BOT_CONFIG.typingDelay);
        
    } catch (error) {
        console.error('Error processing bot response:', error);
        hideTypingIndicator();
        addBotMessage("I apologize, but I'm having trouble processing your request. Please try again or contact Peter directly at petereluwade55@gmail.com");
    }
}

// Determine context for quick replies - FIXED SYNTAX ERROR
function determineContext(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('saxophone') || msg.includes('music') || msg.includes('performance')) {
        return 'saxophone';
    } else if (msg.includes('payment') || msg.includes('pay') || msg.includes('crypto') || msg.includes('bank')) {
        return 'payment';
    } else if (msg.includes('contact') || msg.includes('reach') || msg.includes('phone') || msg.includes('email')) {
        return 'contact';
    } else if (msg.includes('service') || msg.includes('web') || msg.includes('virtual') || msg.includes('marketing')) {
        return 'services';
    }
    
    return 'default';
}

// AI Response function with enhanced context (continued)
async function getAIResponse(userMessage) {
    if (!BOT_CONFIG.useAI || !PETERBOT_API_CONFIG.googleAI.apiKey) {
        return null;
    }
    
    // Check cache first
    const cacheKey = userMessage.toLowerCase().trim();
    if (BOT_CONFIG.cacheResponses && responseCache.has(cacheKey)) {
        return responseCache.get(cacheKey);
    }
    
    try {
        const context = `You are PLS BOT, an AI assistant for Peter Eluwade (@peterphonist), a multi-talented professional offering:

SERVICES & PRICING:
1. Web Development - Custom websites, e-commerce, web applications using HTML5, CSS3, JavaScript, React, Node.js, PHP
2. Virtual Assistant - Email management, social media, content creation, admin support
3. Digital Marketing - Social media marketing, SEO, content strategy, email campaigns
4. Saxophone Performances:
   - Wedding ceremonies: $55 USD (₦82,500 NGN)
   - Birthday surprises: $45 USD (₦67,500 NGN)
   - Church ministrations: $75 USD (₦112,500 NGN)

CONTACT INFORMATION:
- Email: petereluwade55@gmail.com
- WhatsApp: +234 8108821809
- Telegram: @peterlightspeed
- Website: https://peterlight123.github.io/portfolio/
- Social Media: @peterphonist (YouTube, Instagram, TikTok, Facebook, Twitter)

PAYMENT METHODS:
- Cryptocurrency: Bitcoin, Ethereum, USDT (details on sponsor.html)
- Bank Transfer: Zenith Bank, Account: 4291620354, Name: Eluwade Peter Toluwanimi

PERSONALITY: Professional, helpful, enthusiastic about Peter's services. Use emojis appropriately. Always provide specific pricing when asked. Encourage contacting Peter for bookings/projects.

User Question: ${userMessage}

Provide a helpful, specific response about Peter's services:`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: context
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };

        const response = await fetch(`${PETERBOT_API_CONFIG.googleAI.endpoint}?key=${PETERBOT_API_CONFIG.googleAI.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`AI API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            
            // Cache the response
            if (BOT_CONFIG.cacheResponses) {
                responseCache.set(cacheKey, aiResponse);
            }
            
            return aiResponse;
        }
        
        return null;
        
    } catch (error) {
        console.error('AI API Error:', error);
        return null;
    }
}

// Fallback rule-based response system
function getBotResponse(message) {
    const msg = message.toLowerCase();
    
    // Greetings
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('greetings')) {
        return "👋 Hello! I'm PLS BOT, Peter's AI assistant. I can help you with information about his services:\n\n💻 Web Development\n👨‍💼 Virtual Assistant Services\n📊 Digital Marketing\n🎷 Saxophone Performances\n\n🌐 Visit: https://peterlight123.github.io/portfolio/\n\nWhat would you like to know more about?";
    }
    
    // Services overview
    if (msg.includes('service') || msg.includes('what do you do') || msg.includes('what can you do') || msg.includes('offerings')) {
        return `🚀 **Peter offers comprehensive professional services:**

💻 **Web Development**
• Responsive websites
• E-commerce solutions
• Web applications
• SEO optimization

👨‍💼 **Virtual Assistant Services**
• Administrative support
• Email management
• Social media management
• Content creation

📊 **Digital Marketing**
• Social media marketing
• Content strategy
• SEO optimization
• Email campaigns

🎷 **Saxophone Performance**
• Wedding ceremonies: <span class="price-highlight">$55 (₦82,500)</span>
• Birthday surprises: <span class="price-highlight">$45 (₦67,500)</span>
• Church ministrations: <span class="price-highlight">$75 (₦112,500)</span>

💳 **Payment Methods:**
• <span class="payment-highlight">Cryptocurrency</span> (Bitcoin, Ethereum, USDT)
• <span class="payment-highlight">Bank Transfer</span> (Zenith Bank: 4291620354)

🌐 **Portfolio:** https://peterlight123.github.io/portfolio/

Which service interests you most?`;
    }
    
    // Payment methods
    if (msg.includes('payment') || msg.includes('pay') || msg.includes('crypto') || msg.includes('bank')) {
        return `💳 **Payment Options Available:**

1. **🪙 Cryptocurrency**
   • <span class="payment-highlight">Bitcoin (BTC)</span>
   • <span class="payment-highlight">Ethereum (ETH)</span>
   • <span class="payment-highlight">USDT (Tether)</span>
   • Visit: <a href="sponsor.html" target="_blank">sponsor.html</a> for wallet addresses

2. **🏦 Bank Transfer (Nigerian Naira)**
   • Bank: <span class="payment-highlight">Zenith Bank</span>
   • Account: <span class="payment-highlight">4291620354</span>
   • Name: Eluwade Peter Toluwanimi
   • Also available on: <a href="sponsor.html" target="_blank">sponsor.html</a>

Both methods are secure and reliable! Which payment method would you prefer?`;
    }
    
    // Saxophone services
    if (msg.includes('saxophone') || msg.includes('sax') || msg.includes('music') || msg.includes('performance')) {
        return `🎷 **Saxophone Performance Services:**

**Performance Pricing:**
💒 **Wedding Ceremonies:** <span class="price-highlight">$55 USD (₦82,500 NGN)</span>
🎂 **Birthday Surprises:** <span class="price-highlight">$45 USD (₦67,500 NGN)</span>
⛪ **Church Ministrations (1 hour):** <span class="price-highlight">$75 USD (₦112,500 NGN)</span>

**Additional Services:**
• Special events and parties
• Session recordings for albums
• Personalized saxophone renditions

**Find Peter's music as "@peterphonist" on:**
🎬 YouTube | 📸 Instagram | 🎵 TikTok | 📘 Facebook | 🐦 Twitter

**Book a Performance:**
📱 WhatsApp: <a href="https://wa.me/2348108821809" target="_blank">+234 8108821809</a>
📧 Email: <a href="mailto:petereluwade55@gmail.com">petereluwade55@gmail.com</a>

Would you like to book a performance?`;
    }
    
    // Contact information
    if (msg.includes('contact') || msg.includes('reach') || msg.includes('phone') || msg.includes('email') || msg.includes('whatsapp')) {
        return `📞 **Get in Touch with Peter:**

**Primary Contact:**
📧 **Email:** <a href="mailto:petereluwade55@gmail.com">petereluwade55@gmail.com</a>
📱 **WhatsApp:** <a href="https://wa.me/2348108821809" target="_blank">+234 8108821809</a>
💬 **Telegram:** @peterlightspeed
🌐 **Website:** <a href="https://peterlight123.github.io/portfolio/" target="_blank">https://peterlight123.github.io/portfolio/</a>

**Social Media (all @peterphonist):**
🎬 YouTube | 📸 Instagram | 📘 Facebook | 🎵 TikTok | 🐦 Twitter

**Response Times:**
• WhatsApp: 2-6 hours
• Email: Within 24 hours
• Social media: Within 12 hours

Ready to start your project? Reach out anytime!`;
    }
    
    // Web development
    if (msg.includes('web') || msg.includes('website') || msg.includes('development') || msg.includes('coding')) {
        return `💻 **Web Development Services:**

**Specializations:**
• Responsive websites (mobile-friendly)
• E-commerce solutions
• Web applications
• Portfolio websites
• Business websites
• SEO optimization

**Technologies:**
• HTML5, CSS3, JavaScript
• React, Node.js
• PHP, MySQL
• WordPress customization

**Process:**
1. Consultation & requirements
2. Design mockups
3. Development & testing
4. Launch & optimization
5. Ongoing support

**Portfolio:** <a href="https://peterlight123.github.io/portfolio/" target="_blank">https://peterlight123.github.io/portfolio/</a>

**Get Started:**
📧 Email: <a href="mailto:petereluwade55@gmail.com">petereluwade55@gmail.com</a>
📱 WhatsApp: <a href="https://wa.me/2348108821809" target="_blank">+234 8108821809</a>

Ready to build your dream website?`;
    }
    
    // Virtual assistant
    if (msg.includes('virtual') || msg.includes('assistant') || msg.includes('admin') || msg.includes('support')) {
        return `👨‍💼 **Virtual Assistant Services:**

**Administrative Support:**
• Email management & organization
• Calendar scheduling
• Document preparation
• Data entry & research

**Digital Marketing Support:**
• Social media management
• Content creation & curation
• SEO optimization
• Email marketing campaigns

**Business Support:**
• Customer service
• Lead generation
• Project coordination
• Report preparation

**Why Choose Peter:**
✅ Professional experience
✅ Reliable communication
✅ Quick turnaround times
✅ Affordable rates

**Get Started:**
📧 Email: <a href="mailto:petereluwade55@gmail.com">petereluwade55@gmail.com</a>
📱 WhatsApp: <a href="https://wa.me/2348108821809" target="_blank">+234 8108821809</a>

Ready to streamline your business?`;
    }
    
    // Portfolio/website specific
    if (msg.includes('portfolio') || msg.includes('website') || msg.includes('site')) {
        return `🌐 **Peter's Portfolio Website:**

**Visit:** <a href="https://peterlight123.github.io/portfolio/" target="_blank">https://peterlight123.github.io/portfolio/</a>

**What you'll find:**
• Complete service overview
• Project showcases
• Client testimonials
• Contact information
• Payment details
• Social media links

**Features:**
✅ Responsive design
✅ Fast loading
✅ Professional layout
✅ Easy navigation
✅ Contact forms

The portfolio showcases Peter's expertise in web development, virtual assistance, digital marketing, and saxophone performances. Check it out!`;
    }
    
    // Default response
    const defaultResponses = [
        "I'd be happy to help! Peter offers web development, virtual assistant services, digital marketing, and saxophone performances. Visit his portfolio at https://peterlight123.github.io/portfolio/ or ask me about any specific service!",
        
        "Thanks for reaching out! I can provide detailed information about Peter's services, pricing (in USD and Naira), or help you get in touch. Check out https://peterlight123.github.io/portfolio/ for more details. What would you like to know?",
        
        "Great question! Peter specializes in web development, virtual assistant services, digital marketing, and saxophone performances. Visit https://peterlight123.github.io/portfolio/ to see his work. Which service would you like to learn more about?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
    
    console.log('Enhanced event listeners setup complete');
}

// Enhanced message display with AI indicators
function displayMessage(text, sender, animate = true) {
    const messagesContainer = document.getElementById('peterbot-messages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    // Add AI indicator for bot messages when using AI
    if (sender === 'bot' && BOT_CONFIG.useAI) {
        messageDiv.classList.add('ai-powered-message');
    }
    
    if (animate) {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
    }
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Enhanced message formatting
    const formattedText = formatMessageText(text);
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <img src="${BOT_CONFIG.avatar}" alt="${BOT_CONFIG.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMCAySDRDMi45IDIgMiAyLjkgMiA0VjIyTDYgMThIMjBDMjEuMSAxOCAyMiAxNy4xIDIyIDE2VjRDMjIgMi45IDIxLjEgMiAyMCAyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo='">
            </div>
            <div class="message-content">
                <div class="message-bubble">${formattedText}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-bubble">${formattedText}</div>
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

// Format message text with highlights
function formatMessageText(text) {
    let formatted = text;
    
    // Highlight prices
    formatted = formatted.replace(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)/g, '<span class="price-highlight">$$$1</span>');
    formatted = formatted.replace(/₦(\d+(?:,\d{3})*(?:\.\d{2})?)/g, '<span class="price-highlight">₦$1</span>');
    
    // Highlight payment methods
    formatted = formatted.replace(/(Bitcoin|Ethereum|USDT|Crypto|Bank Transfer)/gi, '<span class="payment-highlight">$1</span>');
    
    // Make links clickable
    formatted = formatted.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: #667eea;">$1</a>');
    
    // Make email clickable
    formatted = formatted.replace(/(petereluwade55@gmail\.com)/g, '<a href="mailto:$1" style="color: #667eea;">$1</a>');
    
    // Make phone numbers clickable
    formatted = formatted.replace(/(\+234 8108821809)/g, '<a href="https://wa.me/2348108821809" target="_blank" style="color: #667eea;">$1</a>');
    
    return formatted;
}

// Enhanced typing indicator
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
            <img src="${BOT_CONFIG.avatar}" alt="${BOT_CONFIG.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMCAySDRDMi45IDIgMiAyLjkgMiA0VjIyTDYgMThIMjBDMjEuMSAxOCAyMiAxNy4xIDIyIDE2VjRDMjIgMi45IDIxLjEgMiAyMCAyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo='">
        </div>
        <div class="message-content">
            <div class="message-bubble loading-shimmer">
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
        
        // Hide notification badge
        const badge = document.getElementById('peterbot-notification');
        if (badge) {
            badge.style.display = 'none';
        }
        
        // Focus input
        setTimeout(() => {
            const input = document.getElementById('peterbot-input');
            if (input) input.focus();
        }, 300);
        
        console.log('Enhanced chat opened');
    }
}

// Close chat window
function closeChat() {
    const chatWindow = document.getElementById('peterbot-chat');
    const toggleBtn = document.getElementById('peterbot-toggle');
    
    if (chatWindow && toggleBtn) {
        chatWindow.classList.remove('open');
        toggleBtn.classList.remove('hidden');
        
        console.log('Enhanced chat closed');
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
    
    console.log('New enhanced session created:', currentSessionId);
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
    }, 300);
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

// Save chat history
function saveChatHistory() {
    if (!currentSessionId) return;
    
    try {
        localStorage.setItem(`peterbot_chat_${currentSessionId}`, JSON.stringify(chatHistory));
    } catch (error) {
        console.error('Error saving chat history:', error);
    }
}

// Show quick replies (default)
function showQuickReplies() {
    showContextualQuickReplies('default');
}

// Hide quick replies
function hideQuickReplies() {
    const quickRepliesContainer = document.getElementById('peterbot-quick-replies');
    if (quickRepliesContainer) {
        quickRepliesContainer.style.display = 'none';
    }
}

// Scroll to bottom
function scrollToBottom() {
    const messagesContainer = document.getElementById('peterbot-messages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Create basic bot fallback
function createBasicBot() {
    console.log('Creating basic bot fallback...');
    
    const basicHTML = `
        <div id="peterbot-container" class="peterbot-container">
            <div id="peterbot-toggle" class="peterbot-toggle" title="Chat with PLS BOT">
                💬
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', basicHTML);
    
    const toggleBtn = document.getElementById('peterbot-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            alert('Chat temporarily unavailable. Please contact Peter directly at petereluwade55@gmail.com or WhatsApp: +234 8108821809');
        });
    }
}

// Export enhanced bot for admin panel
window.PeterBot = {
    init: initializeBot,
    config: BOT_CONFIG,
    knowledge: ENHANCED_KNOWLEDGE_BASE,
    openChat: openChat,
    closeChat: closeChat,
    addMessage: addBotMessage,
    getAIResponse: getAIResponse,
    version: '3.0'
};

console.log('Enhanced PeterBot v3.0 with AI integration loaded successfully');
