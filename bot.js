
// Enhanced PeterBot - Advanced AI Assistant
console.log('Loading Enhanced PeterBot v2.0...');

// Enhanced Bot Configuration
const BOT_CONFIG = {
    name: 'PeterBot',
    avatar: 'https://i.imgur.com/Cgy2Aeq.png',
    welcomeMessage: "👋 Hello! I'm PeterBot, Peter's AI assistant. I can help you with web development, virtual assistant services, digital marketing, and even saxophone performances! How can I assist you today?",
    responseDelay: 1200,
    showTypingIndicator: true,
    showQuickReplies: true,
    version: '2.0',
    lastUpdated: new Date().toISOString()
};
 jshint esversion: 11 
 jshint unused:false 

let chatHistory = [];
let currentSessionId = null;

// Enhanced Knowledge Base
const KNOWLEDGE_BASE = {
    personal: {
        name: "Peter Lightspeed",
        alias: "Peterphonist",
        profession: "Web Developer, Virtual Assistant & Saxophonist",
        experience: "2+ years in digital services and creative work",
        location: "Available globally (Remote services)",
        languages: ["English", "Professional Communication"],
        specialties: ["Web Development", "Virtual Assistant Services", "Digital Marketing", "Saxophone Performance"]
    },
    
    services: {
        web: {
            title: "Web Development & Design",
            description: "Full-stack web development and modern design solutions",
            offerings: [
                "Responsive website development",
                "E-commerce solutions",
                "Web application development",
                "Website redesign and optimization",
                "CMS development (WordPress, etc.)",
                "API integration and development",
                "Website maintenance and updates",
                "SEO optimization",
                "Performance optimization"
            ],
            pricing: {
                basic: {
                    usd: "$200-1000 (Simple websites)",
                    naira: "₦150,000-₦750,000 (Simple websites)"
                },
                standard: {
                    usd: "$1,000-3,000 (Business websites)",
                    naira: "₦750,000-₦2,250,000 (Business websites)"
                },
                premium: {
                    usd: "$3,000-7,000 (Complex applications)",
                    naira: "₦2,250,000-₦5,250,000 (Complex applications)"
                },
                maintenance: {
                    usd: "$100-300/month",
                    naira: "₦75,000-₦225,000/month"
                },
                consultation: {
                    usd: "$100/hour",
                    naira: "₦75,000/hour"
                }
            },
            technologies: ["HTML5", "CSS3", "JavaScript", "React", "Bootstrap", "PHP", "WordPress"]
        },
        
        virtual_assistant: {
            title: "Professional Virtual Assistant Services",
            description: "Comprehensive remote assistance for businesses and entrepreneurs",
            offerings: [
                "Administrative support",
                "Email management and communication",
                "Social media management",
                "Content creation and copywriting",
                "Research and data analysis",
                "Project management",
                "Customer service support",
                "Lead generation and CRM management",
                "Digital marketing assistance",
                "Technical support and troubleshooting"
            ],
            pricing: {
                hourly: {
                    usd: "$10-30/hour",
                    naira: "₦7,500-₦22,500/hour"
                },
                part_time: {
                    usd: "$800-1,500/month (20 hours/week)",
                    naira: "₦600,000-₦1,125,000/month (20 hours/week)"
                },
                full_time: {
                    usd: "$1,500-3,000/month (40 hours/week)",
                    naira: "₦1,125,000-₦2,250,000/month (40 hours/week)"
                },
                project_based: "Varies by scope"
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
                "Influencer marketing coordination",
                "Marketing automation"
            ],
            pricing: {
                basic: {
                    usd: "$300-800/month",
                    naira: "₦225,000-₦600,000/month"
                },
                standard: {
                    usd: "$800-2,000/month",
                    naira: "₦600,000-₦1,500,000/month"
                },
                premium: {
                    usd: "$2,000-5,000/month",
                    naira: "₦1,500,000-₦3,750,000/month"
                },
                consultation: {
                    usd: "$80/hour",
                    naira: "₦60,000/hour"
                }
            }
        },
        
        saxophone: {
            title: "Saxophone Performance & Music Services",
            description: "Professional saxophonist performing under the name 'Peterphonist'",
            offerings: [
                "Live saxophone performances for events (weddings, parties, concerts)",
                "Church programs and worship ministrations (free except transportation)",
                "Session recording for songs, albums, or collaborations",
                "Background instrumental music for special occasions",
                "Personalized saxophone renditions (birthday songs, anniversary surprises, etc.)",
                "Music coaching & saxophone lessons (beginner to advanced)",
                "Online collaborations & remote recording"
            ],
            pricing: {
                livePerformance: {
                    usd: "$200-500 per event (varies by duration & location)",
                    naira: "₦150,000-₦380,000 per event (varies by duration & location)"
                },
                churchPrograms: {
                    usd: "Free (transportation costs only)",
                    naira: "Free (transportation costs only)"
                },
                sessionRecording: {
                    usd: "$100-300 per track",
                    naira: "₦75,000-₦225,000 per track"
                },
                personalizedSong: {
                    usd: "$75-150 per request",
                    naira: "₦55,000-₦115,000 per request"
                },
                coaching: {
                    usd: "$50/hour (online or in-person)",
                    naira: "₦38,000/hour (online or in-person)"
                }
            }
        },
        
        additional: {
            title: "Additional Creative Services",
            offerings: [
                "Graphic design and branding",
                "Mobile app development",
                "Video editing and production",
                "Content strategy and creation",
                "Consultation and coaching"
            ]
        }
    },
    
    social_media: {
        youtube: "@peterphonist",
        facebook: "@peterphonist", 
        instagram: "@peterphonist",
        tiktok: "@peterphonist",
        snapchat: "@peterphonist",
        twitter: "@peterphonist",
        linkedin: "Peter Lightspeed",
        audiomack: "peterphonist",
        spotify: "Peterphonist"
    },
    
    contact: {
        email: "petereluwade55@gmail.com",
        whatsapp: "+234 8108821809",
        telegram: "@peterlightspeed",
        website: "https://peterlight123.github.io/portfolio/",
        booking: "Available for consultations and project discussions"
    },
    
    business: {
        sponsorship: {
            available: true,
            types: ["Brand partnerships", "Content sponsorships", "Event partnerships", "Music collaborations"],
            requirements: "Aligned with creative and professional values",
            contact_method: "Email or WhatsApp for sponsorship inquiries"
        },
        
        negotiation: {
            flexible_pricing: true,
            bulk_discounts: true,
            long_term_contracts: "Special rates available",
            payment_plans: "Available for larger projects",
            barter_system: "Open to skill exchanges and collaborations"
        }
    }
};
// Basic bot functions
function loadBotSettings() {
    // Load settings from localStorage if available
    try {
        const savedSettings = localStorage.getItem('peterbot_settings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            Object.assign(BOT_CONFIG, parsedSettings);
        }
    } catch (error) {
        console.error('Error loading bot settings:', error);
    }
}

function createBotContainer() {
    // Create the bot container if it doesn't exist
    if (document.getElementById('peterbot-container')) return;
    
    const container = document.createElement('div');
    container.id = 'peterbot-container';
    container.className = 'peterbot-container';
    
    // Create toggle button
    const toggle = document.createElement('div');
    toggle.id = 'peterbot-toggle';
    toggle.className = 'peterbot-toggle';
    toggle.innerHTML = `
        <div class="pulse-ring"></div>
        <img src="${BOT_CONFIG.avatar}" alt="${BOT_CONFIG.name}" class="bot-avatar">
    `;
    toggle.addEventListener('click', toggleChat);
    
    // Create chat interface
    const chat = document.createElement('div');
    chat.id = 'peterbot-chat';
    chat.className = 'peterbot-chat';
    chat.innerHTML = `
        <div class="peterbot-header">
            <div class="bot-info">
                <img src="${BOT_CONFIG.avatar}" alt="${BOT_CONFIG.name}" class="bot-avatar-small">
                <div>
                    <div class="bot-name">${BOT_CONFIG.name}</div>
                    <div class="bot-status">Online</div>
                </div>
            </div>
            <div class="header-actions">
                <button class="btn-icon" id="peterbot-minimize">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M14 8a.5.5 0 0 1-.5.5H1.5a.5.5 0 0 1 0-1H13.5a.5.5 0 0 1 .5.5z"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="peterbot-messages" id="peterbot-messages"></div>
        <div class="peterbot-quick-replies" id="peterbot-quick-replies" style="display: none;"></div>
        <div class="peterbot-input">
            <div class="input-container">
                <textarea id="peterbot-input" placeholder="Type a message..." rows="1"></textarea>
                <button class="send-button" id="peterbot-send">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    document.addEventListener('DOMContentLoaded', () => {
        const sendButton = document.getElementById('peterbot-send');
        const inputField = document.getElementById('peterbot-input');
        const minimizeButton = document.getElementById('peterbot-minimize');
        
        if (sendButton) {
            sendButton.addEventListener('click', sendMessage);
        }
        
        if (inputField) {
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
                
                // Auto-resize textarea
                inputField.style.height = 'auto';
                inputField.style.height = (inputField.scrollHeight) + 'px';
            });
            
            inputField.addEventListener('input', () => {
                // Auto-resize textarea
                inputField.style.height = 'auto';
                inputField.style.height = (inputField.scrollHeight) + 'px';
            });
        }
        
        if (minimizeButton) {
            minimizeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                closeChat();
            });
        }
    });
    
    container.appendChild(toggle);
    container.appendChild(chat);
    document.body.appendChild(container);
    
    // Add styles
    addBotStyles();
}

function createNewSession() {
    currentSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    chatHistory = [];
    
    // Store session metadata
    const sessionData = {
        id: currentSessionId,
        startTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        url: window.location.href
    };
    
    localStorage.setItem(`peterbot_session_${currentSessionId}`, JSON.stringify(sessionData));
    
    console.log('New enhanced session created:', currentSessionId);
}

function loadChatHistory() {
    // Try to load chat history from localStorage
    try {
        const savedHistory = localStorage.getItem(`peterbot_history_${currentSessionId}`);
        if (savedHistory) {
            chatHistory = JSON.parse(savedHistory);
            
            // Display loaded messages
            chatHistory.forEach(msg => {
                displayMessage(msg.text, msg.sender, false);
            });
            
            scrollToBottom();
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
        chatHistory = [];
    }
}

function toggleChat() {
    const chat = document.getElementById('peterbot-chat');
    const toggle = document.getElementById('peterbot-toggle');
    
    if (chat.classList.contains('open')) {
        closeChat();
    } else {
        openChat();
    }
}

function openChat() {
    const chat = document.getElementById('peterbot-chat');
    const toggle = document.getElementById('peterbot-toggle');
    
    chat.classList.add('open');
    toggle.classList.add('hidden');
    
    // Remove notification badge if exists
    const badge = toggle.querySelector('.notification-badge');
    if (badge) {
        badge.remove();
    }
    
    // Focus input field
    setTimeout(() => {
        const input = document.getElementById('peterbot-input');
        if (input) input.focus();
    }, 300);
    
    scrollToBottom();
}

function closeChat() {
    const chat = document.getElementById('peterbot-chat');
    const toggle = document.getElementById('peterbot-toggle');
    
    chat.classList.remove('open');
    toggle.classList.remove('hidden');
}

function sendMessage() {
    const input = document.getElementById('peterbot-input');
    const message = input.value.trim();
    
    if (message) {
        // Add user message
        addUserMessage(message);
        
        // Clear input
        input.value = '';
        input.style.height = 'auto';
        
        // Process bot response
        processBotResponse(message);
    }
}

function addUserMessage(text) {
    displayMessage(text, 'user');
    
    // Add to chat history
    chatHistory.push({
        text: text,
        sender: 'user',
        timestamp: new Date().toISOString()
    });
    
    // Save chat history
    saveChatHistory();
}

function addBotMessage(text) {
    displayMessage(text, 'bot');
    
    // Add to chat history
    chatHistory.push({
        text: text,
        sender: 'bot',
        timestamp: new Date().toISOString()
    });
    
    // Save chat history
    saveChatHistory();
}

function saveChatHistory() {
    try {
        localStorage.setItem(`peterbot_history_${currentSessionId}`, JSON.stringify(chatHistory));
    } catch (error) {
        console.error('Error saving chat history:', error);
    }
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('peterbot-messages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('peterbot-messages');
    if (!messagesContainer) return;
    
    // Create typing indicator
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

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function handleQuickReply(reply) {
    // Add user message
    addUserMessage(reply);
    
    // Process bot response
    processBotResponse(reply);
}

function showQuickReplies() {
    if (!BOT_CONFIG.showQuickReplies) return;
    
    const quickRepliesContainer = document.getElementById('peterbot-quick-replies');
    if (!quickRepliesContainer) return;
    
    const replies = getContextualQuickReplies();
    
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
        
        // Add feedback buttons for bot messages
        setTimeout(() => {
            addFeedbackButtons(messageDiv);
        }, 1000);
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


// Advanced Response Patterns
const RESPONSE_PATTERNS = {
    greetings: [
        /\b(hello|hi|hey|good morning|good afternoon|good evening|greetings)\b/i,
        /\b(what's up|how are you|howdy)\b/i
    ],
    
    services: [
        /\b(service|what do you do|what can you do|offerings|help with)\b/i,
        /\b(skills|abilities|expertise|specialization)\b/i
    ],
    
    web: [
        /\b(web|website|development|app|programming|code)\b/i,
        /\b(html|css|javascript|react|wordpress)\b/i
    ],
    
    virtual_assistant: [
        /\b(virtual assistant|va|administrative|support|help)\b/i,
        /\b(email management|social media|customer service)\b/i
    ],
    
    digital_marketing: [
        /\b(digital marketing|marketing|seo|social media|content|advertising)\b/i,
        /\b(promote|brand|audience|campaign|strategy)\b/i
    ],
    
    saxophone: [
        /\b(saxophone|sax|saxophonist|peterphonist|music|performance|play|instrument)\b/i,
        /\b(concert|event|wedding|church|worship|ministration)\b/i
    ],
    
    pricing: [
        /\b(price|cost|rate|charge|fee|budget|expensive|cheap|affordable)\b/i,
        /\b(how much|payment|invoice|quote|naira|dollar)\b/i
    ],
    
    contact: [
        /\b(contact|reach|phone|email|whatsapp|telegram)\b/i,
        /\b(get in touch|communicate|call|message)\b/i
    ],
    
    social: [
        /\b(social media|youtube|facebook|instagram|tiktok|snapchat|twitter)\b/i,
        /\b(follow|subscribe|like|share)\b/i
    ],
    
    sponsorship: [
        /\b(sponsor|sponsorship|partnership|collaborate|brand deal)\b/i,
        /\b(advertise|promote|marketing|business partnership)\b/i
    ],
    
    negotiation: [
        /\b(negotiate|bargain|discount|deal|lower price|cheaper)\b/i,
        /\b(flexible|payment plan|installment|budget friendly)\b/i
    ],
    
    portfolio: [
        /\b(portfolio|work|sample|example|previous projects)\b/i,
        /\b(showcase|gallery|demo|case study|listen|hear)\b/i
    ],
    
    about: [
        /\b(about|who is peter|tell me about|background|experience)\b/i,
        /\b(biography|story|journey|career)\b/i
    ]
};


// Enhanced Response Generator
class EnhancedResponseGenerator {
    constructor() {
        this.context = [];
        this.userPreferences = {};
    }
    
    generateResponse(message, context = []) {
        const msg = message.toLowerCase();
        this.context = context;
        
        // Check for multiple intents
        const intents = this.detectIntents(msg);
        
        if (intents.length === 0) {
            return this.getSmartDefaultResponse(msg);
        }
        
        // Handle multiple intents
        if (intents.length > 1) {
            return this.handleMultipleIntents(intents, msg);
        }
        
        // Handle single intent
        return this.handleSingleIntent(intents[0], msg);
    }
    
    detectIntents(message) {
        const intents = [];
        
        for (const [intent, patterns] of Object.entries(RESPONSE_PATTERNS)) {
            for (const pattern of patterns) {
                if (pattern.test(message)) {
                    intents.push(intent);
                    break;
                }
            }
        }
        
        return [...new Set(intents)]; // Remove duplicates
    }
    
    handleSingleIntent(intent, message) {
        switch (intent) {
            case 'greetings':
                return this.getGreetingResponse();
                
            case 'services':
                return this.getServicesResponse(message);
                
            case 'web':
                return this.getWebResponse(message);
                
            case 'virtual_assistant':
                return this.getVAResponse(message);
                
            case 'digital_marketing':
                return this.getDigitalMarketingResponse(message);
                
            case 'saxophone':
                return this.getSaxophoneResponse(message);
                
            case 'pricing':
                return this.getPricingResponse(message);
                
            case 'contact':
                return this.getContactResponse();
                
            case 'social':
                return this.getSocialResponse();
                
            case 'sponsorship':
                return this.getSponsorshipResponse();
                
            case 'negotiation':
                return this.getNegotiationResponse();
                
            case 'portfolio':
                return this.getPortfolioResponse();
                
            case 'about':
                return this.getAboutResponse();
                
            default:
                return this.getSmartDefaultResponse(message);
        }
    }
    
    handleMultipleIntents(intents, message) {
        // Prioritize intents
        const priority = ['web', 'virtual_assistant', 'digital_marketing', 'sponsorship', 'negotiation', 'pricing', 'services', 'contact', 'saxophone'];
        
        for (const priorityIntent of priority) {
            if (intents.includes(priorityIntent)) {
                return this.handleSingleIntent(priorityIntent, message);
            }
        }
        
        // Default to first detected intent
        return this.handleSingleIntent(intents[0], message);
    }
    
    getGreetingResponse() {
        const greetings = [
            "👋 Hello! I'm PeterBot, your AI assistant for all things Peter Lightspeed! I'm here to help you with web development, virtual assistant services, digital marketing, and more. What can I help you with today?",
            "💻 Hey there! Welcome to Peter's digital world! I can assist you with web development, VA services, digital marketing, pricing info, and even sponsorship opportunities. How can I help?",
            "✨ Hi! Great to meet you! I'm Peter's AI assistant, ready to help with any questions about his services, pricing, portfolio, or business opportunities. What interests you most?"
        ];
        
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    getServicesResponse() {
        return `🚀 **Peter Lightspeed offers comprehensive professional services:**

💻 **Web Development**
• Responsive websites
• E-commerce solutions
• Web applications
• SEO optimization

👨‍💼 **Virtual Assistant Services**
• Administrative support
• Social media management
• Content creation
• Project management

📊 **Digital Marketing**
• Social media marketing
• Content strategy
• SEO optimization
• Email campaigns

🎷 **Saxophone Performance**
• Live performances for events
• Church programs & worship
• Session recordings

🎨 **Additional Services**
• Graphic design
• Mobile app development
• Video editing

💰 **Pricing available in USD ($) and Naira (₦)**
🤝 **Open to sponsorships & partnerships**

Which service interests you most? I can provide detailed information and pricing!`;
    }
    
    getWebResponse(message) {
        return `💻 **Professional Web Development Services:**

**What I build:**
• Responsive websites (mobile-friendly)
• E-commerce stores & online shops
• Custom web applications
• WordPress & CMS solutions
• API integrations
• Website redesigns & optimization

**Technologies I use:**
HTML5, CSS3, JavaScript, React, Bootstrap, PHP, WordPress

**Pricing Structure (USD & Naira):**
• Simple websites: $200-1000 (₦150,000-₦750,000)
• Business websites: $1,000-3,000 (₦750,000-₦2,250,000)
• Complex applications: $3,000-7,000 (₦2,250,000-₦5,250,000)
• Maintenance: $100-300 (₦75,000-₦225,000) per month
• Consultation: $100 (₦75,000) per hour

**✨ What makes me different:**
• Fast delivery & responsive design
• SEO optimization included
• Ongoing support & maintenance
• Flexible payment plans available

**Recent Projects:**
• E-commerce platform for fashion retailer
• Portfolio site for creative professionals
• Booking system for service business
• Corporate website with custom CMS

🤝 **Special rates for long-term partnerships!**
Ready to discuss your web project?`;
    }
    
    getVAResponse(message) {
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
• Project-based: Custom quotes

**Client Success Stories:**
• Reduced email management time by 70% for small business
• Increased social media engagement by 150% in 3 months
• Streamlined operations saving 15+ hours per week
• Improved customer response time from 24 hours to 2 hours

🌟 **Why choose me as your VA:**
• 2+ years experience
• Multi-skilled (tech, creative, admin)
• Reliable & professional communication
• Flexible timezone availability

Ready to streamline your business operations?`;
    }
    
    getDigitalMarketingResponse(message) {
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
• YouTube channel management
• Email marketing platforms
• Google Ads & Facebook Ads

**Pricing Options (USD & Naira):**
• Basic Package: $300-800 (₦225,000-₦600,000) per month
• Standard Package: $800-2,000 (₦600,000-₦1,500,000) per month
• Premium Package: $2,000-5,000 (₦1,500,000-₦3,750,000) per month
• Consultation: $80 (₦60,000) per hour

**What You Get:**
• Customized marketing strategy
• Regular content creation & posting
• Audience growth & engagement
• Performance analytics & reporting
• Competitor analysis
• Brand voice development

**Success Metrics:**
• Average 40-200% increase in engagement
• 30-80% growth in followers/audience
• 25-50% improvement in conversion rates
• Measurable ROI on marketing spend

Ready to boost your online presence and grow your business? Let's create a tailored marketing strategy for you!`;
    }
    
    getSaxophoneResponse(message) {
        return `🎷 **Saxophone Performance Services:**

**What I Offer:**
• Live saxophone performances for events (weddings, parties, concerts)
• Church programs and worship ministrations (free except transportation)
• Session recordings for songs, albums, or collaborations
• Personalized saxophone renditions for special occasions

**Pricing (USD & Naira):**
• Live Performances: $200-500 (₦150,000-₦380,000) per event
• Church Programs: Free (transportation costs only)
• Session Recordings: $100-300 (₦75,000-₦225,000) per track
• Personalized Renditions: $75-150 (₦55,000-₦115,000) per request

**Find my music as "Peterphonist" on:**
YouTube, Spotify, Audiomack, Instagram, TikTok & more!

Would you like to book a performance or discuss collaboration options?`;
    }
    
    getPricingResponse(message) {
        if (message.includes('negotiate') || message.includes('bargain') || message.includes('discount')) {
            return this.getNegotiationResponse();
        }
        
        if (message.includes('web') || message.includes('website') || message.includes('development')) {
            return `💰 **Web Development Pricing (USD & Naira):**

• **Simple Websites:** $200-1000 (₦150,000-₦750,000)
  - Landing pages
  - Personal portfolios
  - Small business sites
  - Basic blogs

• **Business Websites:** $1,000-3,000 (₦750,000-₦2,250,000)
  - Corporate websites
  - Business catalogs
  - Professional portfolios
  - Advanced blogs
  - Small e-commerce sites

• **Complex Applications:** $3,000-7,000 (₦2,250,000-₦5,250,000)
  - Custom web applications
  - Large e-commerce platforms
  - Membership sites
  - Online learning platforms
  - Booking systems

• **Maintenance:** $100-300 (₦75,000-₦225,000) per month
  - Regular updates
  - Security monitoring
  - Content updates
  - Performance optimization

• **Consultation:** $100 (₦75,000) per hour
  - Technical advice
  - Project planning
  - System architecture

**All websites include:**
✅ Mobile responsive design
✅ Basic SEO optimization
✅ Contact forms
✅ Social media integration
✅ Google Analytics setup

**Payment terms:**
• 50% deposit to start
• 50% upon completion
• Maintenance billed monthly

Need a custom quote for your specific project?`;
        }
        
        if (message.includes('va') || message.includes('virtual') || message.includes('assistant')) {
            return `💰 **Virtual Assistant Pricing (USD & Naira):**

• **Hourly Rate:** $10-30 (₦7,500-₦22,500) per hour
  - Pay only for hours worked
  - Flexible scheduling
  - Ideal for small tasks or variable workloads

• **Part-Time Package:** $800-1,500 (₦600,000-₦1,125,000) per month
  - 20 hours per week
  - Dedicated support
  - Priority response
  - Regular reporting

• **Full-Time Package:** $1,500-3,000 (₦1,125,000-₦2,250,000) per month
  - 40 hours per week
  - Fully dedicated support
  - Priority response
  - Comprehensive reporting
  - Strategic planning

• **Project-Based:** Custom quotes based on scope
  - Clearly defined deliverables
  - Fixed price for peace of mind
  - Timeline guarantees

**All VA services include:**
✅ Regular communication
✅ Weekly progress reports
✅ Tools & software expertise
✅ Confidentiality agreement

**Payment terms:**
• Monthly retainers billed in advance
• Hourly work billed weekly
• Project-based: 50% deposit, 50% upon completion

Need a custom package tailored to your business needs?`;
        }
        
        if (message.includes('marketing') || message.includes('digital marketing')) {
            return `💰 **Digital Marketing Pricing (USD & Naira):**

• **Basic Package:** $300-800 (₦225,000-₦600,000) per month
  - Social media management (2 platforms)
  - 8-12 posts per month
  - Basic engagement monitoring
  - Monthly performance report

• **Standard Package:** $800-2,000 (₦600,000-₦1,500,000) per month
  - Social media management (3-4 platforms)
  - 16-20 posts per month
  - Content calendar development
  - Community engagement
  - SEO optimization
  - Bi-weekly performance reports

• **Premium Package:** $2,000-5,000 (₦1,500,000-₦3,750,000) per month
  - Comprehensive social media management (all platforms)
  - 20-30 posts per month
  - Content strategy & creation
  - Paid advertising management
  - Influencer outreach
  - Competitor analysis
  - Weekly performance reports

• **Consultation:** $80 (₦60,000) per hour
  - Marketing strategy development
  - Campaign planning
  - Performance analysis

**All marketing packages include:**
✅ Content creation
✅ Analytics tracking
✅ Audience growth strategies
✅ Brand voice consistency

**Payment terms:**
• Monthly retainers billed in advance
• 3-month minimum commitment recommended

Ready to boost your online presence with a custom marketing plan?`;
        }
        
        if (message.includes('naira') || message.includes('nigeria') || message.includes('₦')) {
            return `💰 **Pricing in Naira (₦):**

💻 **Web Development:**
• Simple sites: ₦150,000-₦750,000
• Business sites: ₦750,000-₦2,250,000
• Complex apps: ₦2,250,000-₦5,250,000
• Maintenance: ₦75,000-₦225,000/month

👨‍💼 **Virtual Assistant:**
• Hourly: ₦7,500-₦22,500/hour
• Part-time: ₦600,000-₦1,125,000/month
• Full-time: ₦1,125,000-₦2,250,000/month

📊 **Digital Marketing:**
• Basic: ₦225,000-₦600,000/month
• Standard: ₦600,000-₦1,500,000/month
• Premium: ₦1,500,000-₦3,750,000/month

🎷 **Saxophone Services:**
• Live Performances: ₦150,000-₦380,000 per event
• Church Programs: Free (transportation costs only)
• Session Recordings: ₦75,000-₦225,000 per track

**💡 Money-Saving Options:**
✅ Bulk project discounts
✅ Long-term contract rates
✅ Payment plan options
✅ Skill exchange opportunities

Want a custom quote for your specific project?`;
        }
        
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
    
    getSponsorshipResponse() {
        return `🤝 **Sponsorship & Partnership Opportunities:**

**I'm open to collaborations in:**
💻 Tech & web development partnerships
📊 Digital marketing collaborations
👨‍💼 Business service alliances
🎷 Music & creative projects

**What I offer partners:**
• Professional service delivery
• Cross-promotion opportunities
• Creative collaboration
• Audience engagement
• Measurable results & analytics

**My Reach:**
📺 YouTube: @peterphonist
📸 Instagram: @peterphonist
🎵 TikTok: @peterphonist
📘 Facebook: @peterphonist
👻 Snapchat: @peterphonist

**Partnership Requirements:**
✅ Aligned with professional values
✅ Mutual benefit & fair compensation
✅ Creative freedom maintained
✅ Long-term relationship potential

**Ready to partner?**
📧 Email: petereluwade55@gmail.com
📱 WhatsApp: +234 8108821809

Let's create something amazing together! 🚀`;
    }
    
    getNegotiationResponse() {
        return `💡 **Flexible Pricing & Negotiation Options:**

**I understand budgets vary! Here's how we can work together:**

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
• Equity partnerships for startups
• Cross-promotion opportunities

📊 **Value-Added Options:**
• Package deals across multiple services
• Maintenance & support included
• Free consultations for serious inquiries
• Performance-based pricing available

**Let's find a solution that works for your budget!**

What's your project scope and budget range? I'm confident we can find a win-win arrangement! 

📞 Contact me to discuss: petereluwade55@gmail.com`;
    }
    
    getContactResponse() {
    return `📞 **Get in Touch with Peter Lightspeed:**

**Primary Contact:**
📧 **Email:** petereluwade55@gmail.com
📱 **WhatsApp:** +234 8108821809
💬 **Telegram:** @peterlightspeed

**Social Media (all @peterphonist):**
🎬 **YouTube:** @peterphonist
📸 **Instagram:** @peterphonist
📘 **Facebook:** @peterphonist
🎵 **TikTok:** @peterphonist
👻 **Snapchat:** @peterphonist
🐦 **Twitter:** @peterphonist

**Professional:**
💼 **LinkedIn:** Eluwade Peter Toluwanimi
🌐 **Website:** https://peterlight123.github.io/portfolio/

**⏰ Response Times:**
• Email: Within 24 hours
• WhatsApp: Within 2-6 hours
• Social media: Within 12 hours

**🕐 Availability:**
Available globally for remote work
Flexible timezone accommodation

Ready to start your project? Reach out anytime! 🚀`;
}
    
getSocialResponse() {
    return `📱 **Follow Peter on Social Media:**

**All handles: @peterphonist**
**All handles: @eluwadepeter**

🎬 **YouTube:** @peterphonist
• Tutorial videos
• Project showcases
• Behind-the-scenes content
• Live streams & Q&As

📸 **Instagram:** @peterphonist  
• Portfolio highlights
• Daily creative updates
• Web development tips
• Stories & reels

🎵 **TikTok:** @peterphonist
• Quick tech tips
• Creative process videos
• Trending content

📘 **Facebook:** @peterphonist
• Professional updates
• Community engagement
• Event announcements

👻 **Snapchat:** @peterphonist
• Behind-the-scenes moments
• Quick updates
• Personal insights

🐦 **Twitter:** @peterphonist
• Industry thoughts
• Quick updates
• Networking

**💡 Pro Tip:** Follow on multiple platforms for different types of content and exclusive updates!

Which platform would you like to connect on first? 🚀`;
}
    
getPortfolioResponse() {
    return `🎨 **Peter's Portfolio & Work Samples:**

💻 **Web Development:**
• GitHub: github.com/peterlight123
• Live websites: Available upon request
• Case studies: Detailed project breakdowns
• Client testimonials: 5-star ratings

**Featured Web Projects:**
• E-commerce platform with 300% conversion improvement
• Corporate website with custom CMS
• Portfolio site for creative professionals
• Booking system for service business

👨‍💼 **Virtual Assistant Work:**
• Client success stories
• Process improvements achieved
• Efficiency metrics & results
• Before/after case studies

**VA Achievements:**
• Reduced email management time by 70% for small business
• Increased social media engagement by 150% in 3 months
• Streamlined operations saving 15+ hours per week
• Improved customer response time from 24 hours to 2 hours

📊 **Digital Marketing:**
• Campaign results
• Growth metrics
• Content strategy examples
• Social media management showcases

🎷 **Saxophone Portfolio (Peterphonist):**
• Audiomack: peterphonist
• Spotify: Peterphonist  
• YouTube: @peterphonist
• Instagram: @peterphonist (performance videos)

**📊 Recent Achievements:**
• 20+ successful web projects
• 15+ satisfied VA clients
• 90% client retention rate
• Multiple successful marketing campaigns

Want to see specific examples for your type of project? Let me know what you're interested in! 🚀`;
}
    
getAboutResponse() {
    return `👨‍💻 **Meet Peter Lightspeed:**

**🎯 Multi-Talented Digital Professional**
Web Developer, Virtual Assistant, Digital Marketer & Saxophonist

**📈 Experience & Expertise:**
• 2+ years in digital services and creative work
• Full-stack web developer
• Professional virtual assistant
• Digital marketing specialist
• Saxophonist (performing as "Peterphonist")
• Served 50+ clients globally

**🌟 What Makes Peter Unique:**
• Multi-disciplinary skill set
• Technical + creative expertise
• Reliable & professional communication
• Flexible & adaptable to client needs
• Passionate about bringing ideas to life

**💻 Tech Journey:**
Self-taught developer who became proficient in modern web technologies, helping businesses establish strong online presence with responsive, user-friendly websites and applications.

**👨‍💼 Business Journey:**
Evolved into comprehensive virtual assistant and digital marketer, helping entrepreneurs and businesses streamline operations and grow their online presence.

**🎷 Music Side:**
Passionate saxophonist performing at events and creating music under the name "Peterphonist"

**🌍 Global Reach:**
• Available for remote work worldwide
• Flexible timezone accommodation
• Multicultural project experience

**💡 Philosophy:**
"Every project is an opportunity to create something amazing and help others achieve their goals."

Ready to work with someone who truly cares about your success? Let's connect! 🚀`;
}
    
getSmartDefaultResponse(message) {
    // Analyze message for keywords and provide contextual response
    const responses = [
        "That's a great question! I'd love to help you with that. Could you tell me more about what you're looking for? I can assist with web development, virtual assistant services, digital marketing, or even saxophone performances.",
        
        "Interesting! I'm here to help with anything related to Peter's services. Whether you need web development, VA support, digital marketing strategy, or want to discuss collaborations - I've got you covered!",
        
        "I'd be happy to help! Peter offers web development, virtual assistant services, digital marketing, and saxophone performances. What specific area interests you most?",
        
        "Thanks for reaching out! I can provide detailed information about Peter's services, pricing (in USD and Naira), portfolio, or business opportunities. What would you like to know more about?",
        
        "Great to hear from you! I'm equipped to answer questions about web development, virtual assistant services, digital marketing, pricing negotiations, sponsorships, and more. How can I assist you today?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}}
// Enhanced quick replies based on context
function getContextualQuickReplies() {
    const lastBotMessage = chatHistory.slice().reverse().find(msg => msg.sender === 'bot');
    
    if (!lastBotMessage) {
        return [
            "💻 Web Development",
            "👨‍💼 Virtual Assistant", 
            "📊 Digital Marketing",
            "💰 Pricing Info",
            "🎷 Saxophone Services"
        ];
    }
    
    const lastMessage = lastBotMessage.text.toLowerCase();
    
    if (lastMessage.includes('web') || lastMessage.includes('website') || lastMessage.includes('development')) {
        return [
            "🌐 Web Portfolio",
            "💰 Web Pricing", 
            "🛒 E-commerce Sites",
            "📱 Mobile Apps",
            "🔧 Maintenance Plans"
        ];
    }
    
    if (lastMessage.includes('virtual assistant') || lastMessage.includes('va')) {
        return [
            "📋 VA Services List",
            "💰 VA Pricing",
            "📊 Success Stories",
            "⏰ Availability",
            "🤝 Long-term Contract"
        ];
    }
    
    if (lastMessage.includes('digital marketing') || lastMessage.includes('marketing')) {
        return [
            "📱 Social Media Marketing",
            "🔍 SEO Services",
            "📧 Email Campaigns",
            "📊 Marketing Analytics",
            "💰 Marketing Packages"
        ];
    }
    
    if (lastMessage.includes('saxophone') || lastMessage.includes('music') || lastMessage.includes('performance')) {
        return [
            "🎧 Hear Performances",
            "💰 Performance Pricing",
            "⛪ Church Programs",
            "📱 Follow @peterphonist",
            "🎵 Music Collaboration"
        ];
    }
    
    if (lastMessage.includes('sponsor') || lastMessage.includes('partnership')) {
        return [
            "📧 Contact for Partnership",
            "📊 Audience Analytics",
            "🎯 Partnership Types",
            "💼 Brand Alignment",
            "📱 Social Reach"
        ];
    }
    
    if (lastMessage.includes('pricing') || lastMessage.includes('cost')) {
        return [
            "💲 USD Pricing",
            "₦ Naira Pricing",
            "💡 Negotiate Price",
            "📦 Package Deals",
            "💳 Payment Plans"
        ];
    }
    
    // Default contextual replies
    return [
        "📞 Contact Peter",
        "🎨 View Portfolio",
        "💰 Get Quote",
        "🤝 Partnership Inquiry",
        "❓ Ask Another Question"
    ];
}
// Admin Storage System
class AdminStorage {
    constructor() {
        this.storageKey = 'peterbot_admin_data';
        this.data = this.loadData();
    }
    
    loadData() {
        try {
            const storedData = localStorage.getItem(this.storageKey);
            return storedData ? JSON.parse(storedData) : this.getDefaultData();
        } catch (error) {
            console.error('Error loading admin data:', error);
            return this.getDefaultData();
        }
    }
    
    getDefaultData() {
        return {
            leads: [],
            conversations: [],
            projects: [],
            analytics: {
                totalInteractions: 0,
                serviceInterests: {
                    web: 0,
                    va: 0,
                    marketing: 0,
                    saxophone: 0
                },
                conversionRate: 0
            },
            settings: {
                notificationsEnabled: true,
                autoFollowUp: true,
                dataRetentionDays: 90
            },
            lastUpdated: new Date().toISOString()
        };
    }
    
    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            return true;
        } catch (error) {
            console.error('Error saving admin data:', error);
            return false;
        }
    }
    
    addLead(lead) {
        this.data.leads.push({
            ...lead,
            id: `lead_${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'new'
        });
        
        this.saveData();
    }
    
    addProject(project) {
        this.data.projects.push({
            ...project,
            id: `project_${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'pending'
        });
        
        this.saveData();
    }
    
    logConversation(conversation) {
        this.data.conversations.push({
            ...conversation,
            id: `conv_${Date.now()}`,
            timestamp: new Date().toISOString()
        });
        
        // Update analytics
        this.data.analytics.totalInteractions++;
        
        // Update service interests if applicable
        if (conversation.topic) {
            if (conversation.topic.includes('web')) {
                this.data.analytics.serviceInterests.web++;
            } else if (conversation.topic.includes('va') || conversation.topic.includes('assistant')) {
                this.data.analytics.serviceInterests.va++;
            } else if (conversation.topic.includes('marketing')) {
                this.data.analytics.serviceInterests.marketing++;
            } else if (conversation.topic.includes('saxophone') || conversation.topic.includes('music')) {
                this.data.analytics.serviceInterests.saxophone++;
            }
        }
        
        this.data.lastUpdated = new Date().toISOString();
        this.saveData();
    }
    
    getLeads(status = null) {
        if (status) {
            return this.data.leads.filter(lead => lead.status === status);
        }
        return this.data.leads;
    }
    
    getProjects(status = null) {
        if (status) {
            return this.data.projects.filter(project => project.status === status);
        }
        return this.data.projects;
    }
    
    getAnalytics() {
        return this.data.analytics;
    }
    
    updateSettings(newSettings) {
        this.data.settings = {
            ...this.data.settings,
            ...newSettings
        };
        
        this.saveData();
    }
    
    cleanupOldData() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.data.settings.dataRetentionDays);
        const cutoffTimestamp = cutoffDate.toISOString();
        
        // Clean up old data
        this.data.leads = this.data.leads.filter(lead => lead.timestamp >= cutoffTimestamp);
        this.data.conversations = this.data.conversations.filter(conv => conv.timestamp >= cutoffTimestamp);
        
        // Keep all projects for record
        
        this.saveData();
    }
}

// Initialize admin storage
const adminStorage = new AdminStorage();
// Enhanced analytics and learning
function logInteraction(userMessage, botResponse, userSatisfaction = null) {
    const interaction = {
        timestamp: new Date().toISOString(),
        userMessage: userMessage,
        botResponse: botResponse,
        sessionId: currentSessionId,
        userSatisfaction: userSatisfaction,
        context: chatHistory.slice(-4)
    };
    
    // Store for analytics
    let analytics = JSON.parse(localStorage.getItem('peterbot_analytics') || '[]');
    analytics.push(interaction);
    
    // Keep only last 100 interactions
    if (analytics.length > 100) {
        analytics = analytics.slice(-100);
    }
    
    localStorage.setItem('peterbot_analytics', JSON.stringify(analytics));
    
    // Log to admin storage
    const topic = detectTopic(userMessage);
    adminStorage.logConversation({
        userMessage,
        botResponse,
        topic,
        satisfaction: userSatisfaction
    });
    
    // Check for lead or project intent
    checkForLeadIntent(userMessage, botResponse);
}

// Detect conversation topic
function detectTopic(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('web') || msg.includes('website') || msg.includes('development')) {
        return 'web';
    }
    
    if (msg.includes('virtual') || msg.includes('assistant') || msg.includes('va')) {
        return 'va';
    }
    
    if (msg.includes('marketing') || msg.includes('promote') || msg.includes('seo') || msg.includes('social media')) {
        return 'marketing';
    }
    
    if (msg.includes('saxophone') || msg.includes('sax') || msg.includes('music') || msg.includes('performance')) {
        return 'saxophone';
    }
    
    if (msg.includes('price') || msg.includes('cost') || msg.includes('rate') || msg.includes('naira') || msg.includes('dollar')) {
        return 'pricing';
    }
    
    return 'general';
}

// Check for lead or project intent
function checkForLeadIntent(userMessage, botResponse) {
    const msg = userMessage.toLowerCase();
    
    // Check for web project lead
    if ((msg.includes('need') || msg.includes('want') || msg.includes('looking for')) && 
        (msg.includes('website') || msg.includes('web') || msg.includes('app'))) {
        
        adminStorage.addLead({
            type: 'web',
            message: userMessage,
            response: botResponse,
            followUpScheduled: true,
            priority: 'high'
        });
    }
    
    // Check for VA lead
    if ((msg.includes('need') || msg.includes('want') || msg.includes('looking for')) && 
        (msg.includes('assistant') || msg.includes('va') || msg.includes('help'))) {
        
        adminStorage.addLead({
            type: 'va',
            message: userMessage,
            response: botResponse,
            followUpScheduled: true,
            priority: 'high'
        });
    }
    
    // Check for marketing lead
    if ((msg.includes('need') || msg.includes('want') || msg.includes('looking for')) && 
        (msg.includes('marketing') || msg.includes('promote') || msg.includes('seo'))) {
        
        adminStorage.addLead({
            type: 'marketing',
            message: userMessage,
            response: botResponse,
            followUpScheduled: true,
            priority: 'high'
        });
    }
    
    // Check for saxophone booking
    if ((msg.includes('book') || msg.includes('hire') || msg.includes('schedule')) && 
        (msg.includes('saxophone') || msg.includes('performance') || msg.includes('event'))) {
        
        adminStorage.addProject({
            type: 'saxophone',
            message: userMessage,
            response: botResponse,
            followUpScheduled: true,
            priority: 'medium'
        });
    }
    
    // Check for contact info (strong lead)
    if (msg.includes('email') || msg.includes('phone') || msg.includes('contact') || msg.includes('whatsapp')) {
        adminStorage.addLead({
            type: 'contact_request',
            message: userMessage,
            response: botResponse,
            priority: 'high',
            followUpScheduled: true
        });
    }
}
// Advanced AI Response System
class AdvancedAI {
    constructor() {
        this.learningData = this.loadLearningData();
        this.userProfiles = this.loadUserProfiles();
        this.conversationFlow = new Map();
    }
    
    // Sentiment Analysis for better responses
    analyzeSentiment(message) {
        const positiveWords = ['great', 'awesome', 'love', 'excellent', 'amazing', 'perfect', 'wonderful', 'fantastic'];
        const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'horrible', 'disappointed', 'frustrated', 'angry'];
        const urgentWords = ['urgent', 'asap', 'immediately', 'rush', 'emergency', 'quickly', 'fast'];
        
        const words = message.toLowerCase().split(' ');
        let sentiment = 'neutral';
        let urgency = 'normal';
        
        if (words.some(word => positiveWords.includes(word))) sentiment = 'positive';
        if (words.some(word => negativeWords.includes(word))) sentiment = 'negative';
        if (words.some(word => urgentWords.includes(word))) urgency = 'high';
        
        return { sentiment, urgency };
    }
    
    // Smart lead qualification
    qualifyLead(message, userHistory) {
        const qualificationScore = {
            budget_mentioned: /\$|\d+|budget|price|cost|naira|dollar/.test(message.toLowerCase()) ? 20 : 0,
            timeline_mentioned: /when|deadline|asap|soon|month|week|date|schedule/.test(message.toLowerCase()) ? 15 : 0,
            specific_service: /website|web|app|design|va|assistant|marketing|seo/.test(message.toLowerCase()) ? 25 : 0,
            contact_info: /email|phone|whatsapp|contact/.test(message.toLowerCase()) ? 30 : 0,
            return_visitor: userHistory.length > 3 ? 10 : 0
        };
        
        const totalScore = Object.values(qualificationScore).reduce((a, b) => a + b, 0);
        
        return {
            score: totalScore,
            level: totalScore >= 70 ? 'hot' : totalScore >= 40 ? 'warm' : 'cold',
            recommendations: this.getLeadRecommendations(totalScore, qualificationScore)
        };
    }
    
    getLeadRecommendations(score, breakdown) {
        const recommendations = [];
        
        if (breakdown.budget_mentioned === 0) {
            recommendations.push("Ask about budget range");
        }
        if (breakdown.timeline_mentioned === 0) {
            recommendations.push("Inquire about project timeline");
        }
        if (breakdown.contact_info === 0) {
            recommendations.push("Collect contact information");
        }
        
        return recommendations;
    }
    
    loadLearningData() {
        return JSON.parse(localStorage.getItem('peterbot_learning') || '{}');
    }
    
    loadUserProfiles() {
        return JSON.parse(localStorage.getItem('peterbot_profiles') || '{}');
    }
}

// Smart Follow-up System
class FollowUpSystem {
    constructor() {
        this.followUps = this.loadFollowUps();
        this.setupFollowUpTimer();
    }
    
    scheduleFollowUp(userId, type, delay = 24 * 60 * 60 * 1000) { // 24 hours default
        const followUp = {
            id: Date.now(),
            userId: userId,
            type: type,
            scheduledFor: Date.now() + delay,
            status: 'pending'
        };
        
        this.followUps.push(followUp);
        this.saveFollowUps();
    }
    
    getFollowUpMessage(type) {
        const messages = {
            'no_response': "👋 Hi! I noticed you were interested in Peter's services. Do you have any questions I can help with?",
            'web_inquiry': "💻 Hello! You showed interest in our web development services. Ready to discuss your project in detail?",
            'va_inquiry': "👨‍💼 Hi! You inquired about virtual assistant services. Would you like to discuss how Peter can help streamline your business?",
            'marketing_inquiry': "📊 Hello! You were interested in our digital marketing services. Would you like to explore how we can boost your online presence?",
            'pricing_inquiry': "💰 Hi! You asked about pricing earlier. Would you like a detailed quote for your project in USD or Naira?",
            'contact_attempt': "📞 Hello! You were looking to contact Peter. He's available for a consultation - shall I help you schedule one?"
        };
        
        return messages[type] || messages.no_response;
    }
    
    setupFollowUpTimer() {
        setInterval(() => {
            this.checkPendingFollowUps();
        }, 60000); // Check every minute
    }
    
    checkPendingFollowUps() {
        const now = Date.now();
        const dueFollowUps = this.followUps.filter(f => 
            f.status === 'pending' && f.scheduledFor <= now
        );
        
        dueFollowUps.forEach(followUp => {
            this.executeFollowUp(followUp);
        });
    }
    
    executeFollowUp(followUp) {
        // Show notification or add message
        const message = this.getFollowUpMessage(followUp.type);
        
        // Add as bot message if chat is open
        if (document.querySelector('.peterbot-chat.open')) {
            addBotMessage(message);
        } else {
            // Show notification badge
            this.showNotificationBadge();
        }
        
        followUp.status = 'sent';
        this.saveFollowUps();
    }
    
    showNotificationBadge() {
        const toggle = document.getElementById('peterbot-toggle');
        if (toggle && !toggle.querySelector('.notification-badge')) {
            const badge = document.createElement('div');
            badge.className = 'notification-badge';
            badge.textContent = '1';
            toggle.appendChild(badge);
        }
    }
    
    loadFollowUps() {
        return JSON.parse(localStorage.getItem('peterbot_followups') || '[]');
    }
    
    saveFollowUps() {
        localStorage.setItem('peterbot_followups', JSON.stringify(this.followUps));
    }
}

// Enhanced Response Generator with AI
class SuperEnhancedResponseGenerator extends EnhancedResponseGenerator {
    constructor() {
        super();
        this.ai = new AdvancedAI();
        this.followUpSystem = new FollowUpSystem();
        this.conversationState = 'initial';
        this.userIntent = null;
        this.collectingInfo = null;
    }
    
    generateResponse(message, context = []) {
        const sentiment = this.ai.analyzeSentiment(message);
        const leadQuality = this.ai.qualifyLead(message, context);
        
        // Store user profile data
        this.updateUserProfile(message, sentiment, leadQuality);
        
        // Get base response
        let response = super.generateResponse(message, context);
        
        // Enhance response based on sentiment and lead quality
        response = this.enhanceResponseWithAI(response, sentiment, leadQuality, message);
        
        // Schedule follow-ups if needed
        this.scheduleSmartFollowUps(message, leadQuality);
        
        return response;
    }
    
    enhanceResponseWithAI(baseResponse, sentiment, leadQuality, originalMessage) {
        let enhanced = baseResponse;
        
        // Add sentiment-based enhancements
        if (sentiment.sentiment === 'positive') {
            enhanced += "\n\n😊 I love your enthusiasm! Let's make something amazing together!";
        } else if (sentiment.sentiment === 'negative') {
            enhanced += "\n\n🤝 I understand your concerns. Let me help address them and find the perfect solution for you.";
        }
        
        // Add urgency handling
        if (sentiment.urgency === 'high') {
            enhanced += "\n\n⚡ I see this is urgent! Peter prioritizes time-sensitive projects. Let me connect you directly: 📱 WhatsApp: +234 8108821809";
        }
        
        // Add lead quality enhancements
        if (leadQuality.level === 'hot') {
            enhanced += "\n\n🔥 **Ready to get started?** Let me connect you with Peter directly for immediate assistance!";
            enhanced += "\n📧 **Direct Email:** petereluwade55@gmail.com";
            enhanced += "\n📱 **WhatsApp:** +234 8108821809";
        } else if (leadQuality.level === 'warm') {
            enhanced += "\n\n💡 **Next Steps:** I'd love to learn more about your project to provide the best assistance!";
        }
        
        return enhanced;
    }
    
    scheduleSmartFollowUps(message, leadQuality) {
        const msg = message.toLowerCase();
        
        if (msg.includes('think about it') || msg.includes('consider')) {
            this.followUpSystem.scheduleFollowUp('current_user', 'no_response', 2 * 60 * 60 * 1000); // 2 hours
        }
        
        if (msg.includes('web') || msg.includes('website')) {
            this.followUpSystem.scheduleFollowUp('current_user', 'web_inquiry', 4 * 60 * 60 * 1000); // 4 hours
        }
        
        if (msg.includes('virtual') || msg.includes('assistant')) {
            this.followUpSystem.scheduleFollowUp('current_user', 'va_inquiry', 6 * 60 * 60 * 1000); // 6 hours
        }
        
        if (msg.includes('marketing') || msg.includes('promote')) {
            this.followUpSystem.scheduleFollowUp('current_user', 'marketing_inquiry', 8 * 60 * 60 * 1000); // 8 hours
        }
        
        if (msg.includes('price') || msg.includes('cost')) {
            this.followUpSystem.scheduleFollowUp('current_user', 'pricing_inquiry', 24 * 60 * 60 * 1000); // 24 hours
        }
        
        if (leadQuality.level === 'hot' && !msg.includes('contact')) {
            this.followUpSystem.scheduleFollowUp('current_user', 'contact_attempt', 30 * 60 * 1000); // 30 minutes
        }
    }
    
    updateUserProfile(message, sentiment, leadQuality) {
        const profile = {
            lastMessage: message,
            lastSentiment: sentiment,
            leadScore: leadQuality.score,
            leadLevel: leadQuality.level,
            timestamp: Date.now(),
            messageCount: (this.userProfiles?.current?.messageCount || 0) + 1
        };
        
        this.userProfiles = this.userProfiles || {};
        this.userProfiles.current = profile;
        localStorage.setItem('peterbot_profiles', JSON.stringify(this.userProfiles));
    }
}
// Initialize enhanced systems
const superAI = new SuperEnhancedResponseGenerator();
const followUpSystem = new FollowUpSystem();

// Enhanced getBotResponse function with AI
function getBotResponse(message) {
    const context = chatHistory.slice(-6).map(msg => ({
        text: msg.text,
        sender: msg.sender
    }));
    
    // Check for special commands first
    if (message.toLowerCase().includes('get quote')) {
        const projectType = extractProjectType(message);
        return getQuoteResponse(projectType);
    }
    
    if (message.toLowerCase().includes('schedule') || message.toLowerCase().includes('book') || message.toLowerCase().includes('consultation')) {
        return getConsultationResponse(message);
    }
    
    if (message.toLowerCase().includes('portfolio') || message.toLowerCase().includes('samples') || message.toLowerCase().includes('examples')) {
        const category = extractCategory(message);
        return getPortfolioResponse(category);
    }
    
    // Use AI-enhanced response generation
    return superAI.generateResponse(message, context);
}

// Helper functions
function extractProjectType(message) {
    const msg = message.toLowerCase();
    if (msg.includes('web') || msg.includes('website')) return 'Web Development';
    if (msg.includes('va') || msg.includes('assistant')) return 'Virtual Assistant';
    if (msg.includes('marketing')) return 'Digital Marketing';
    if (msg.includes('saxophone') || msg.includes('music')) return 'Saxophone Performance';
    return 'Custom Project';
}

function extractCategory(message) {
    const msg = message.toLowerCase();
    if (msg.includes('web') || msg.includes('website')) return 'web';
    if (msg.includes('va') || msg.includes('assistant')) return 'va';
    if (msg.includes('marketing')) return 'marketing';
    if (msg.includes('saxophone') || msg.includes('music')) return 'saxophone';
    return 'web';
}

function getQuoteResponse(projectType) {
    return `🎯 **Get Instant Quote for ${projectType}:**
    
Please tell me:
1️⃣ Project details and requirements
2️⃣ Timeline/deadline
3️⃣ Budget range (USD or Naira)
4️⃣ Any special requirements

I'll provide an accurate quote within minutes! 💰`;
}

function getConsultationResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('web') || msg.includes('website')) {
        return `💻 **Schedule a Web Development Consultation:**
        
To discuss your web project with Peter:

1️⃣ **Project Information:**
   • Type of website/application needed
   • Key features and functionality
   • Design preferences (if any)
   • Timeline expectations

2️⃣ **Available Consultation Times:**
   • Monday-Friday: 9 AM - 6 PM WAT
   • Saturday: 10 AM - 2 PM WAT
   • Emergency projects: 24/7 availability

3️⃣ **Consultation Process:**
   • 30-minute initial consultation (free)
   • Project scope discussion
   • Technology recommendations
   • Timeline and budget planning

**Contact to Schedule:**
📱 WhatsApp: +234 8108821809
📧 Email: petereluwade55@gmail.com

Ready to bring your web project to life? Let's schedule your consultation! 🚀`;
    }
    
    if (msg.includes('va') || msg.includes('virtual') || msg.includes('assistant')) {
        return `👨‍💼 **Schedule a Virtual Assistant Consultation:**
        
To discuss how Peter can help streamline your business:

1️⃣ **Business Information:**
   • Type of business/industry
   • Current pain points
   • Tasks requiring assistance
   • Hours of support needed

2️⃣ **Available Consultation Times:**
   • Monday-Friday: 9 AM - 6 PM WAT
   • Saturday: 10 AM - 2 PM WAT
   • Flexible scheduling available

3️⃣ **Consultation Process:**
   • 30-minute initial consultation (free)
   • Workflow assessment
   • Task prioritization
   • Custom VA solution planning

**Contact to Schedule:**
📱 WhatsApp: +234 8108821809
📧 Email: petereluwade55@gmail.com

Ready to reclaim your time and boost productivity? Let's talk! ⏰`;
    }
    
    if (msg.includes('marketing') || msg.includes('digital marketing')) {
        return `📊 **Schedule a Digital Marketing Consultation:**
        
To discuss growing your online presence:

1️⃣ **Business Information:**
   • Current online presence
   • Target audience
   • Marketing goals
   • Previous marketing efforts

2️⃣ **Available Consultation Times:**
   • Monday-Friday: 9 AM - 6 PM WAT
   • Saturday: 10 AM - 2 PM WAT
   • Flexible scheduling available

3️⃣ **Consultation Process:**
   • 30-minute initial consultation (free)
   • Digital presence audit
   • Strategy recommendations
   • ROI projection planning

**Contact to Schedule:**
📱 WhatsApp: +234 8108821809
📧 Email: petereluwade55@gmail.com

Ready to boost your online visibility and engagement? Let's connect! 📈`;
    }
    
    return `📅 **Schedule a Consultation with Peter:**
        
🗓️ **Available Times:**
• Monday-Friday: 9 AM - 6 PM WAT
• Saturday: 10 AM - 2 PM WAT
• Emergency projects: 24/7 availability

**To schedule:**
📧 Email: petereluwade55@gmail.com
📱 WhatsApp: +234 8108821809
💬 Telegram: @peterlightspeed

**What to prepare:**
✅ Project details
✅ Timeline requirements  
✅ Budget expectations
✅ Reference materials

**All initial consultations are free!**

Ready to book your consultation? 🚀`;
}

function getPortfolioResponse(category) {
    const portfolios = {
        web: `💻 **Web Development Portfolio:**
            
🌐 **Recent Projects:**
• E-commerce: Fashion store (+300% sales)
• Restaurant: Online ordering system  
• Agency: Portfolio showcase site
• SaaS: Customer dashboard app

🛠️ **Technologies Used:**
• React, Node.js, WordPress
• Mobile-responsive design
• SEO optimization included
• Fast loading speeds

📊 **Results Achieved:**
• 95% client satisfaction rate
• Average 40% speed improvement
• 200% increase in conversions

**Client Testimonials:**
"Peter transformed our outdated website into a modern, user-friendly platform that's doubled our leads!" - Marketing Agency
"Our e-commerce sales increased by 300% after the redesign" - Fashion Retailer

Ready to see your project come to life? 🚀`,

        va: `👨‍💼 **Virtual Assistant Success Stories:**
            
📈 **Client Results:**
• 40% efficiency improvement
• 60% reduction in admin time
• 25+ satisfied business owners
• 95% client retention rate

🎯 **Services Delivered:**
• Email management (500+ emails/week)
• Social media growth (+150% engagement)
• Lead generation (50+ qualified leads/month)
• Customer service (98% satisfaction)

💼 **Industries Served:**
• E-commerce & Retail
• Real Estate & Finance  
• Healthcare & Wellness
• Technology & Startups

**Client Testimonials:**
"Peter's VA services saved me 15+ hours per week that I can now spend on growing my business" - E-commerce Owner
"Our customer response time went from 24 hours to under 2 hours" - Service Business

Ready to scale your business with professional VA support? 📊`,

        marketing: `📊 **Digital Marketing Portfolio:**
            
📱 **Social Media Campaigns:**
• Fashion Brand: 200% follower growth in 3 months
• Restaurant: 150% increase in engagement
• Service Business: 300% increase in leads from social

🔍 **SEO Success Stories:**
• Local Business: From page 5 to page 1 in 2 months
• E-commerce: 80% increase in organic traffic
• Blog: 200% increase in search visibility

📧 **Email Marketing Results:**
• Retail: 25% open rate, 10% conversion rate
• B2B: 35% open rate, 15% meeting booking rate
• Nonprofit: 40% open rate, 20% donation rate

**Client Testimonials:**
"Peter's marketing strategies helped us reach a completely new audience" - Retail Store
"Our social media presence has completely transformed" - Service Business

Ready to transform your digital presence? 📈`,

        saxophone: `🎷 **Saxophone Performance Portfolio:**
            
🎧 **Listen Now:**
• YouTube: @peterphonist
• Audiomack: peterphonist
• Instagram: @peterphonist (performance videos)

🎵 **Performance Highlights:**
• Corporate Events: Annual galas and product launches
• Weddings: Ceremony and reception performances
• Church Programs: Worship services and special events
• Recording Sessions: Studio work for various artists

**Client Testimonials:**
"Peter's saxophone performance added the perfect elegant touch to our wedding" - Happy Couple
"His music created the exact atmosphere we wanted for our corporate event" - Event Planner

Interested in booking a performance for your event? 🎵`
    };
    
    return portfolios[category] || portfolios.web;
}
// Enhanced process bot response with logging
function processBotResponse(userMessage) {
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        
        const response = getBotResponse(userMessage);
        addBotMessage(response);
        
        // Log interaction
        logInteraction(userMessage, response);
        
        // Show contextual quick replies
        if (BOT_CONFIG.showQuickReplies) {
            setTimeout(() => {
                showQuickReplies();
            }, 500);
        }
    }, BOT_CONFIG.responseDelay);
}
// Enhanced CSS with feedback styles
function addBotStyles() {
    if (document.getElementById('peterbot-styles')) return;
    
    const styles = `
        <style id="peterbot-styles">
        /* Enhanced PeterBot Styles */
        .peterbot-container {
            position: fixed;
            bottom: 20px;
            left: 20px;
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
            left: 0;
            width: 380px;
            height: 550px;
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
            flex-shrink: 0;
        }
        
        .message-avatar img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
        
        .message-content {
            max-width: 85%;
        }
        
        .message-bubble {
            padding: 12px 16px;
            border-radius: 18px;
            word-wrap: break-word;
            white-space: pre-line;
            line-height: 1.4;
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
        
        .message-feedback {
            margin-top: 8px;
            display: flex;
            gap: 5px;
            opacity: 0.7;
        }
        
        .feedback-btn {
            background: none;
            border: none;
            font-size: 14px;
            cursor: pointer;
            padding: 2px 5px;
            border-radius: 3px;
            transition: all 0.2s;
        }
        
        .feedback-btn:hover {
            background: #f0f0f0;
            transform: scale(1.1);
        }
        
        .feedback-thanks {
            font-size: 11px;
            color: #28a745;
            font-style: italic;
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
            max-height: 120px;
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
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
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
            background: #c1c1c1;
            border-radius: 3px;
        }
        
        .peterbot-messages::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
            .peterbot-container {
                bottom: 15px;
                left: 15px;
            }
            
            .peterbot-chat {
                width: calc(100vw - 30px);
                height: calc(100vh - 120px);
                max-width: 380px;
                max-height: 550px;
            }
            
            .message-content {
                max-width: 90%;
            }
            
            .peterbot-toggle {
                width: 55px;
                height: 55px;
            }
            
            .bot-avatar {
                width: 35px;
                height: 35px;
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
        
        /* Enhanced quick reply animations */
        .quick-reply-btn {
            animation: fadeInUp 0.3s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Status indicator */
        .bot-status::before {
            content: '●';
            color: #28a745;
            margin-right: 5px;
            animation: blink 2s infinite;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.5; }
        }
        
        /* Notification Badge */
        .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ff4757;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            animation: pulse-notification 2s infinite;
        }
        
        @keyframes pulse-notification {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}
// Enhanced initialization with error handling
function initializeBot() {
    try {
        console.log('Initializing Enhanced PeterBot v2.0...');
        
        // Load settings
        loadBotSettings();
        
        // Create container
        createBotContainer();
        
        // Create session
        createNewSession();
        
        // Load history
        loadChatHistory();
        
        // Welcome message
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
        
        console.log('Enhanced PeterBot v2.0 initialized successfully! 🚀');
        
        // Log initialization
        logInteraction('system_init', 'Bot initialized successfully', 'positive');
        
    } catch (error) {
        console.error('Error initializing Enhanced PeterBot:', error);
        
        // Fallback initialization
        setTimeout(() => {
            initializeBot();
        }, 2000);
    }
}

// Export enhanced bot
window.PeterBot = {
    init: initializeBot,
    config: BOT_CONFIG,
    knowledge: KNOWLEDGE_BASE,
    openChat: openChat,
    closeChat: closeChat,
    addMessage: addBotMessage,
    getAnalytics: () => JSON.parse(localStorage.getItem('peterbot_analytics') || '[]'),
    getAdminData: () => adminStorage.data,
    version: '2.0'
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Enhanced PeterBot v2.0...');
    initializeBot();
});

console.log('Enhanced PeterBot v2.0 script loaded successfully! 💻👨‍💼📊');
