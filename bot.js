// PeterBot - Enhanced Chatbot Script
/* jshint esversion: 11, unused: false */
console.log('Loading Enhanced PeterBot v2.0...');

// Bot configuration
const BOT_CONFIG = {
    name: 'PeterBot',
    avatar: 'https://i.imgur.com/Cgy2Aeq.png',
    welcomeMessage: "👋 Hello! I'm PeterBot, Peter's AI assistant. I can help you with web development, virtual assistant services, digital marketing, and saxophone performances! How can I assist you today?",
    responseDelay: 800,
    showTypingIndicator: true,
    showQuickReplies: true,
    version: '2.0'
};

// Knowledge base for balanced services
const KNOWLEDGE_BASE = {
    services: {
        web: {
            title: "Web Development & Design",
            description: "Professional web development services for businesses and individuals",
            offerings: [
                "Responsive website development",
                "E-commerce solutions",
                "Web application development",
                "Website redesign and optimization",
                "CMS development (WordPress, etc.)",
                "API integration",
                "Website maintenance and updates",
                "SEO optimization"
            ],
            pricing: {
                basic: "$200-1000 (₦150,000-₦750,000) - Simple websites",
                standard: "$1,000-3,000 (₦750,000-₦2,250,000) - Business websites",
                premium: "$3,000-7,000 (₦2,250,000-₦5,250,000) - Complex applications",
                maintenance: "$100-300 (₦75,000-₦225,000) per month"
            },
            technologies: ["HTML5", "CSS3", "JavaScript", "React", "Bootstrap", "PHP", "WordPress"]
        },
        
        virtual_assistant: {
            title: "Virtual Assistant Services",
            description: "Comprehensive remote assistance for businesses and entrepreneurs",
            offerings: [
                "Administrative support",
                "Email management",
                "Social media management",
                "Content creation and copywriting",
                "Research and data analysis",
                "Project management",
                "Customer service support",
                "Lead generation"
            ],
            pricing: {
                hourly: "$10-30 (₦7,500-₦22,500) per hour",
                part_time: "$800-1,500 (₦600,000-₦1,125,000) per month (20 hrs/week)",
                full_time: "$1,500-3,000 (₦1,125,000-₦2,250,000) per month (40 hrs/week)"
            }
        },
        
        digital_marketing: {
            title: "Digital Marketing Services",
            description: "Strategic digital marketing to grow your online presence",
            offerings: [
                "Social media marketing",
                "Content marketing strategy",
                "SEO optimization",
                "Email marketing campaigns",
                "PPC advertising management",
                "Analytics and reporting",
                "Brand development",
                "Marketing automation"
            ],
            pricing: {
                basic: "$300-800 (₦225,000-₦600,000) per month",
                standard: "$800-2,000 (₦600,000-₦1,500,000) per month",
                premium: "$2,000-5,000 (₦1,500,000-₦3,750,000) per month"
            }
        },
        
        saxophone: {
            title: "Saxophone Performance",
            description: "Professional saxophone performances as 'Peterphonist'",
            offerings: [
                "Live performances for events (weddings, parties, concerts)",
                "Church programs and worship ministrations (free except transportation)",
                "Session recordings for songs and albums",
                "Background instrumental music",
                "Personalized saxophone renditions"
            ],
            pricing: {
                livePerformance: "$200-500 (₦150,000-₦380,000) per event",
                churchPrograms: "Free (transportation costs only)",
                sessionRecording: "$100-300 (₦75,000-₦225,000) per track",
                personalizedSong: "$75-150 (₦55,000-₦115,000) per request"
            }
        }
    },
    
    contact: {
        email: "petereluwade55@gmail.com",
        whatsapp: "+234 8108821809",
        telegram: "@peterlightspeed",
        website: "https://peterlight123.github.io/portfolio/"
    },
    
    social_media: {
        youtube: "@peterphonist",
        facebook: "@peterphonist", 
        instagram: "@peterphonist",
        tiktok: "@peterphonist",
        twitter: "@peterphonist"
    }
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
        console.log('Initializing PeterBot v2.0...');
        
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
        } else {
            // Show quick replies for existing conversation
            setTimeout(() => {
                showQuickReplies();
            }, 500);
        }
        
        console.log('PeterBot v2.0 initialized successfully');
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

// Enhanced bot response system
function getBotResponse(message) {
    const msg = message.toLowerCase();
    
    // Greetings
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('greetings')) {
        return "👋 Hello! I'm PeterBot, Peter's AI assistant. I can help you with information about his services:\n\n💻 Web Development\n👨‍💼 Virtual Assistant Services\n📊 Digital Marketing\n🎷 Saxophone Performances\n\nWhat would you like to know more about?";
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
• Live performances for events
• Church programs & worship
• Session recordings

💰 **Pricing available in USD ($) and Naira (₦)**
🤝 **Open to collaborations & partnerships**

Which service interests you most?`;
    }
    
    // Web Development
    if (msg.includes('web') || msg.includes('website') || msg.includes('development') || msg.includes('app')) {
        return `💻 **Professional Web Development Services:**

**What Peter builds:**
• Responsive websites (mobile-friendly)
• E-commerce stores & online shops
• Custom web applications
• WordPress & CMS solutions
• API integrations
• Website redesigns & optimization

**Technologies used:**
HTML5, CSS3, JavaScript, React, Bootstrap, PHP, WordPress

**Pricing (USD & Naira):**
• Simple websites: $200-1000 (₦150,000-₦750,000)
• Business websites: $1,000-3,000 (₦750,000-₦2,250,000)
• Complex applications: $3,000-7,000 (₦2,250,000-₦5,250,000)
• Maintenance: $100-300 (₦75,000-₦225,000) per month

**✨ What makes Peter different:**
• Fast delivery & responsive design
• SEO optimization included
• Ongoing support & maintenance
• Flexible payment plans available

Ready to discuss your web project?`;
    }
    
    // Virtual Assistant
    if (msg.includes('virtual assistant') || msg.includes('va') || msg.includes('administrative') || msg.includes('support')) {
        return `👨‍💼 **Professional Virtual Assistant Services:**

**Administrative Support:**
• Email management & communication
• Calendar scheduling & organization
• Document creation & management
• Data entry & research

**Digital Marketing:**
• Social media management
• Content creation & copywriting
• Lead generation & CRM
• SEO & online presence

**Business Support:**
• Customer service & support
• Project management
• Technical troubleshooting
• Market research & analysis

**Pricing Options (USD & Naira):**
• Hourly: $10-30 (₦7,500-₦22,500) per hour
• Part-time: $800-1,500 (₦600,000-₦1,125,000) per month (20 hrs/week)
• Full-time: $1,500-3,000 (₦1,125,000-₦2,250,000) per month (40 hrs/week)

🌟 **Why choose Peter as your VA:**
• Multi-skilled (tech, creative, admin)
• Reliable & professional communication
• Flexible timezone availability

Ready to streamline your business operations?`;
    }
    
    // Digital Marketing
    if (msg.includes('digital marketing') || msg.includes('marketing') || msg.includes('seo') || msg.includes('social media')) {
        return `📊 **Strategic Digital Marketing Services:**

**Marketing Solutions:**
• Social media marketing & management
• Content marketing strategy & creation
• SEO optimization & keyword research
• Email marketing campaigns
• PPC advertising management
• Analytics & performance reporting

**Platform Expertise:**
• Instagram, Facebook, Twitter, LinkedIn
• Google Business Profile optimization
• Email marketing platforms
• Google Ads & Facebook Ads

**Pricing Options (USD & Naira):**
• Basic Package: $300-800 (₦225,000-₦600,000) per month
• Standard Package: $800-2,000 (₦600,000-₦1,500,000) per month
• Premium Package: $2,000-5,000 (₦1,500,000-₦3,750,000) per month

**What You Get:**
• Customized marketing strategy
• Regular content creation & posting
• Audience growth & engagement
• Performance analytics & reporting
• Competitor analysis
• Brand voice development

Ready to boost your online presence and grow your business?`;
    }
    
    // Saxophone
    if (msg.includes('saxophone') || msg.includes('sax') || msg.includes('music') || msg.includes('performance')) {
        return `🎷 **Saxophone Performance Services:**

**What Peter Offers:**
• Live saxophone performances for events (weddings, parties, concerts)
• Church programs and worship ministrations (free except transportation)
• Session recordings for songs, albums, or collaborations
• Personalized saxophone renditions for special occasions

**Pricing (USD & Naira):**
• Live Performances: $200-500 (₦150,000-₦380,000) per event
• Church Programs: Free (transportation costs only)
• Session Recordings: $100-300 (₦75,000-₦225,000) per track
• Personalized Renditions: $75-150 (₦55,000-₦115,000) per request

**Find Peter's music as "Peterphonist" on:**
YouTube, Instagram, TikTok & more!

Would you like to book a performance or discuss collaboration options?`;
    }
    
    // Church performances
    if (msg.includes('church') || msg.includes('worship') || msg.includes('ministration')) {
        return `⛪ **Church & Worship Saxophone Services:**

**Peter offers special arrangements for church programs:**

• 🙏 **Church Performances:** FREE (transportation costs only)
• 🎵 **Worship & Praise Sessions:** FREE (transportation costs only)
• 🎷 **Special Church Events:** FREE (transportation costs only)

**Why Peter offers free church services:**
Peter believes in using his talent to serve in ministry and contribute to worship experiences. He only requests transportation costs be covered for church programs.

**How to Book for Church Programs:**
1. Contact via WhatsApp: +234 8108821809
2. Email: petereluwade55@gmail.com
3. Provide event details (date, location, duration)
4. Discuss transportation arrangements

Would you like to book Peter for a church program?`;
    }
    
    // Pricing
    if (msg.includes('price') || msg.includes('cost') || msg.includes('rate') || msg.includes('charge') || msg.includes('fee')) {
        return `💰 **Transparent Pricing Structure (USD & Naira):**

💻 **Web Development:**
• Simple sites: $200-1000 (₦150,000-₦750,000)
• Business sites: $1,000-3,000 (₦750,000-₦2,250,000)
• Complex apps: $3,000-7,000 (₦2,250,000-₦5,250,000)
• Maintenance: $100-300 (₦75,000-₦225,000)/month

👨‍💼 **Virtual Assistant:**
• Hourly: $10-30 (₦7,500-₦22,500)/hour
• Part-time: $800-1,500 (₦600,000-₦1,125,000)/month
• Full-time: $1,500-3,000 (₦1,125,000-₦2,250,000)/month

📊 **Digital Marketing:**
• Basic: $300-800 (₦225,000-₦600,000)/month
• Standard: $800-2,000 (₦600,000-₦1,500,000)/month
• Premium: $2,000-5,000 (₦1,500,000-₦3,750,000)/month

🎷 **Saxophone Services:**
• Live Performances: $200-500 (₦150,000-₦380,000) per event
• Church Programs: Free (transportation costs only)
• Session Recordings: $100-300 (₦75,000-₦225,000) per track

**💡 Money-Saving Options:**
✅ Bulk project discounts
✅ Long-term contract rates
✅ Payment plan options
✅ Skill exchange opportunities

Want a custom quote for your specific project?`;
    }
    
    // Contact
    if (msg.includes('contact') || msg.includes('reach') || msg.includes('phone') || msg.includes('email') || msg.includes('whatsapp')) {
        return `📞 **Get in Touch with Peter:**

**Primary Contact:**
📧 **Email:** petereluwade55@gmail.com
📱 **WhatsApp:** +234 8108821809
💬 **Telegram:** @peterlightspeed
🌐 **Website:** https://peterlight123.github.io/portfolio/

**Social Media (all @peterphonist):**
🎬 **YouTube:** @peterphonist
📸 **Instagram:** @peterphonist
📘 **Facebook:** @peterphonist
🎵 **TikTok:** @peterphonist
🐦 **Twitter:** @peterphonist

**⏰ Response Times:**
• Email: Within 24 hours
• WhatsApp: Within 2-6 hours
• Social media: Within 12 hours

**🕐 Availability:**
Available globally for remote work
Flexible timezone accommodation

Ready to start your project? Reach out anytime!`;
    }
    
    // Portfolio
    if (msg.includes('portfolio') || msg.includes('work') || msg.includes('sample') || msg.includes('example')) {
        return `🎨 **Peter's Portfolio & Work Samples:**

💻 **Web Development:**
• GitHub: github.com/peterlight123
• Live websites: Available upon request
• Case studies: Detailed project breakdowns
• Client testimonials: 5-star ratings

👨‍💼 **Virtual Assistant Work:**
• Client success stories
• Process improvements achieved
• Efficiency metrics & results
• Before/after case studies

📊 **Digital Marketing:**
• Campaign results
• Growth metrics
• Content strategy examples
• Social media management showcases

🎷 **Saxophone Portfolio (Peterphonist):**
• YouTube: @peterphonist
• Instagram: @peterphonist (performance videos)

Want to see specific examples for your type of project?`;
    }
    
    // About (continued)
if (msg.includes('about') || msg.includes('who is peter') || msg.includes('tell me about')) {
    return `👨‍💻 **Meet Peter Lightspeed:**

**🎯 Multi-Talented Professional**
Web Developer, Virtual Assistant, Digital Marketer & Saxophonist

**📈 Experience & Expertise:**
• Full-stack web developer
• Professional virtual assistant
• Digital marketing specialist
• Saxophonist (performing as "Peterphonist")
• Served clients globally

**🌟 What Makes Peter Unique:**
• Multi-disciplinary skill set
• Technical + creative expertise
• Reliable & professional communication
• Flexible & adaptable to client needs
• Passionate about bringing ideas to life

**💻 Tech Journey:**
Self-taught developer who became proficient in modern web technologies, helping businesses establish strong online presence.

**👨‍💼 Business Journey:**
Evolved into comprehensive virtual assistant and digital marketer, helping entrepreneurs streamline operations.

**🎷 Music Side:**
Passionate saxophonist performing at events and creating music under the name "Peterphonist"

**🌍 Global Reach:**
• Available for remote work worldwide
• Flexible timezone accommodation
• Multicultural project experience

Ready to work with someone who truly cares about your success?`;
}
    
// Thanks
if (msg.includes('thank') || msg.includes('thanks')) {
    return "You're very welcome! 😊 I'm always here to help. Is there anything else you'd like to know about Peter's services?";
}

// Negotiation and discounts
if (msg.includes('discount') || msg.includes('negotiate') || msg.includes('cheaper') || msg.includes('deal')) {
    return `💡 **Flexible Pricing & Negotiation Options:**

**Peter understands budgets vary! Here's how you can work together:**

🎯 **Discount Opportunities:**
• Multiple projects: 10-25% off
• Long-term contracts: Special rates
• Referral bonuses: 15% off next project
• Student/startup discounts: 20% off

💳 **Payment Flexibility:**
• Payment plans for larger projects
• Milestone-based payments
• Retainer agreements available
• Multiple currency options (USD, Naira)

🔄 **Alternative Arrangements:**
• Skill exchange/bartering
• Revenue sharing models
• Cross-promotion opportunities

**Let's find a solution that works for your budget!**

What's your project scope and budget range? Peter is confident you can find a win-win arrangement!`;
}

// Social media
if (msg.includes('social media') || msg.includes('youtube') || msg.includes('instagram') || msg.includes('follow')) {
    return `📱 **Follow Peter on Social Media:**

**All handles: @peterphonist**

🎬 **YouTube:** @peterphonist
• Tutorial videos
• Saxophone performances
• Behind-the-scenes content
• Live streams & Q&As

📸 **Instagram:** @peterphonist  
• Portfolio highlights
• Daily creative updates
• Performance videos
• Stories & reels

🎵 **TikTok:** @peterphonist
• Quick saxophone clips
• Tech tips
• Creative process videos
• Trending content

📘 **Facebook:** @peterphonist
• Professional updates
• Community engagement
• Event announcements

🐦 **Twitter:** @peterphonist
• Industry thoughts
• Quick updates
• Networking

**💡 Pro Tip:** Follow on multiple platforms for different types of content and exclusive updates!

Which platform would you like to connect on first?`;
}

// Booking or scheduling
if (msg.includes('book') || msg.includes('schedule') || msg.includes('appointment') || msg.includes('hire')) {
    return `📅 **Book Peter's Services:**

**To schedule a service with Peter:**

1️⃣ **Choose Your Service:**
   • Web Development Project
   • Virtual Assistant Services
   • Digital Marketing Campaign
   • Saxophone Performance

2️⃣ **Contact Options:**
   • Email: petereluwade55@gmail.com
   • WhatsApp: +234 8108821809
   • Telegram: @peterlightspeed

3️⃣ **Information to Include:**
   • Service type needed
   • Project/event details
   • Timeline/date requirements
   • Budget expectations
   • Special requirements

**⏰ Availability:**
• Web/VA/Marketing: Flexible remote scheduling
• Saxophone: Subject to event date availability

**Free Consultation:**
Peter offers a free initial consultation to discuss your needs and provide a custom quote.

Ready to book or have questions about availability?`;
}

// Default response with balanced service focus
const defaultResponses = [
    "I'd be happy to help! Peter offers web development, virtual assistant services, digital marketing, and saxophone performances. What specific area interests you most?",
    
    "Thanks for reaching out! I can provide detailed information about Peter's services, pricing (in USD and Naira), portfolio, or business opportunities. What would you like to know more about?",
    
    "Great question! Peter specializes in web development, virtual assistant services, digital marketing, and saxophone performances. Which service would you like to learn more about?",
    
    "I'm here to help you learn about Peter's services! Whether you need a website, virtual assistant support, digital marketing strategy, or saxophone performance, Peter has you covered. What are you looking for?",
    
    "Peter offers a range of professional services including web development, virtual assistant support, digital marketing, and saxophone performances. How can he assist you today?"
];

return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Show contextual quick replies
function showQuickReplies() {
    if (!BOT_CONFIG.showQuickReplies) return;
    
    const quickRepliesContainer = document.getElementById('peterbot-quick-replies');
    if (!quickRepliesContainer) return;
    
    // Get the last bot message to provide context
    const lastBotMessage = chatHistory.length > 0 ? 
        chatHistory.slice().reverse().find(msg => msg.sender === 'bot')?.text.toLowerCase() : '';
    
    let replies = [];
    
    // Default replies
    if (!lastBotMessage) {
        replies = [
            "💻 Web Development",
            "👨‍💼 Virtual Assistant", 
            "📊 Digital Marketing",
            "🎷 Saxophone Services",
            "💰 Pricing Info"
        ];
    }
    // Web development context
    else if (lastBotMessage.includes('web') || lastBotMessage.includes('website') || lastBotMessage.includes('development')) {
        replies = [
            "🌐 Web Portfolio",
            "💰 Web Pricing", 
            "🛒 E-commerce Sites",
            "📱 Mobile Apps",
            "🔧 Maintenance Plans"
        ];
    }
    // Virtual assistant context
    else if (lastBotMessage.includes('virtual assistant') || lastBotMessage.includes('va')) {
        replies = [
            "📋 VA Services List",
            "💰 VA Pricing",
            "📊 Success Stories",
            "⏰ Availability",
            "🤝 Long-term Contract"
        ];
    }
    // Digital marketing context
    else if (lastBotMessage.includes('digital marketing') || lastBotMessage.includes('marketing')) {
        replies = [
            "📱 Social Media Marketing",
            "🔍 SEO Services",
            "📧 Email Campaigns",
            "📊 Marketing Analytics",
            "💰 Marketing Packages"
        ];
    }
    // Saxophone context
    else if (lastBotMessage.includes('saxophone') || lastBotMessage.includes('music') || lastBotMessage.includes('performance')) {
        replies = [
            "🎵 Performance Booking",
            "💰 Performance Pricing",
            "⛪ Church Programs",
            "🎧 Listen to Samples",
            "📱 Follow @peterphonist"
        ];
    }
    // Pricing context
    else if (lastBotMessage.includes('pricing') || lastBotMessage.includes('cost')) {
        replies = [
            "💲 USD Pricing",
            "₦ Naira Pricing",
            "💡 Negotiate Price",
            "📦 Package Deals",
            "💳 Payment Plans"
        ];
    }
    // Contact context
    else if (lastBotMessage.includes('contact') || lastBotMessage.includes('reach') || lastBotMessage.includes('email')) {
        replies = [
            "📧 Send Email",
            "📱 WhatsApp",
            "💬 Telegram",
            "🌐 Visit Website",
            "📞 Request Call"
        ];
    }
    // Portfolio context
    else if (lastBotMessage.includes('portfolio') || lastBotMessage.includes('work') || lastBotMessage.includes('sample')) {
        replies = [
            "💻 Web Projects",
            "👨‍💼 VA Case Studies",
            "📊 Marketing Results",
            "🎷 Saxophone Videos",
            "🎨 View All Work"
        ];
    }
    // About context
    else if (lastBotMessage.includes('about') || lastBotMessage.includes('who is peter')) {
        replies = [
            "💼 Professional Background",
            "🛠️ Skills & Expertise",
            "🎓 Education & Training",
            "🌟 Client Testimonials",
            "📞 Contact Peter"
        ];
    }
    // General context
    else {
        replies = [
            "📞 Contact Peter",
            "🎨 View Portfolio",
            "💰 Get Quote",
            "❓ Ask Another Question",
            "👋 End Conversation"
        ];
    }
    
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
            max-height: 100px;
            overflow-y: auto;
        }
        
        .quick-reply-btn {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 20px;
            padding: 8px 12px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        }
        
        .quick-reply-btn:hover {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
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
            font-family: inherit;
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
            flex-shrink: 0;
        }
        
        .send-button:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
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
            background: #c1c1c1;
            border-radius: 3px;
        }
        
        .peterbot-messages::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
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
            
            .peterbot-toggle {
                width: 50px;
                height: 50px;
            }
            
            .bot-avatar {
                width: 30px;
                height: 30px;
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
        
        .message {
            animation: messageSlideIn 0.3s ease-out;
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Export for admin panel
window.PeterBot = {
    init: initializeBot,
    config: BOT_CONFIG,
    knowledge: KNOWLEDGE_BASE,
    openChat: openChat,
    closeChat: closeChat,
    addMessage: addBotMessage,
    version: '2.0'
};

console.log('Enhanced PeterBot v2.0 script loaded successfully');

