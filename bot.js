// Enhanced PeterBot - Advanced AI Assistant for Saxophonist
console.log('Loading Enhanced PeterBot v2.0...');

// Enhanced Bot Configuration
const BOT_CONFIG = {
    name: 'PeterBot',
    avatar: 'https://i.imgur.com/Cgy2Aeq.png',
    welcomeMessage: "👋 Hello! I'm PeterBot, Peter's AI assistant. I can help you with saxophone performances, web development, pricing, bookings, and much more! How can I assist you today?",
    responseDelay: 1200,
    showTypingIndicator: true,
    showQuickReplies: true,
    version: '2.0',
    lastUpdated: new Date().toISOString()
};
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
    
    saxophone: [
        /\b(saxophone|sax|saxophonist|peterphonist|music|performance|play|instrument)\b/i,
        /\b(concert|event|wedding|church|worship|ministration)\b/i
    ],
    
    web: [
        /\b(web|website|development|app|programming|code)\b/i,
        /\b(html|css|javascript|react|wordpress)\b/i
    ],
    
    virtual_assistant: [
        /\b(virtual assistant|va|administrative|support|help)\b/i,
        /\b(email management|social media|customer service)\b/i
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
    ],
    
    church: [
        /\b(church|worship|ministration|gospel|christian|praise)\b/i,
        /\b(religious|spiritual|faith|service)\b/i
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
                
            case 'music':
                return this.getMusicResponse(message);
                
            case 'web':
                return this.getWebResponse(message);
                
            case 'virtual_assistant':
                return this.getVAResponse(message);
                
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
        const priority = ['sponsorship', 'negotiation', 'pricing', 'services', 'contact'];
        
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
            "👋 Hello! I'm PeterBot, your AI assistant for all things Peter Lightspeed! I'm here to help you with music production, web development, virtual assistant services, and more. What can I help you with today?",
            "🎵 Hey there! Welcome to Peter's creative world! I can assist you with music production (as Peterphonist), web development, VA services, pricing info, and even sponsorship opportunities. How can I help?",
            "✨ Hi! Great to meet you! I'm Peter's AI assistant, ready to help with any questions about his services, pricing, portfolio, or business opportunities. What interests you most?"
        ];
        
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    getServicesResponse(message) {
        return `🚀 **Peter Lightspeed offers comprehensive creative services:**

🎵 **Music Production (as Peterphonist)**
• Custom beats & compositions
• Mixing & mastering
• Jingles & commercial music
• Sound design

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

🎨 **Additional Services**
• Graphic design
• Mobile app development
• Video editing
• Digital marketing

💰 **Flexible pricing & payment plans available**
🤝 **Open to sponsorships & partnerships**

Which service interests you most? I can provide detailed information and pricing!`;
    }
    
    getMusicResponse(message) {
        if (message.includes('peterphonist')) {
            return `🎵 **Peterphonist - Peter's Music Identity!**

Find Peter's music on ALL platforms:
🎬 **YouTube:** @peterphonist
📘 **Facebook:** @peterphonist  
📸 **Instagram:** @peterphonist
🎵 **TikTok:** @peterphonist
👻 **Snapchat:** @peterphonist
🎧 **Audiomack:** peterphonist
🎶 **Spotify:** Peterphonist

**Music Services:**
livePerformance: "$200-500 per event (varies by duration & location) note: church programs are free apart from transportation",
sessionRecording: "$100-300 per track",
personalizedSong: "$75-150 per request",
coaching: "$50/hour (online or in-person)"
🎯 **Special offers for bulk orders!**
🤝 **Open to music collaborations & sponsorships!**

Want to hear samples or discuss a project?`;
        }
        
        return `🎵 **Peter's Music Production Services:**

What I Offer:

• 🎷 Live saxophone performances (weddings, parties, concerts, church programs)
• 🎶 Worship & ministration music
• 🎧 Session recordings for songs, albums, or collaborations
• 🎼 Personalized saxophone renditions (birthday/anniversary surprises)
• 📚 Saxophone lessons & coaching (beginner to advanced)
• 🌍 Online collaborations & remote recordings
• 🎤 Background instrumental music for special occasions

Pricing (Starting At):

• Live Performances: $200–500 per event (varies by duration & location)
• Session Recordings: $100–300 per track
• Personalized Sax Rendition: $75–150 per request
• Coaching / Lessons: $50 per hour (online or in-person)

**Find my music as "Peterphonist" on:**
YouTube, Spotify, Audiomack, Instagram, TikTok & more!

🎯 **Bulk discounts available!**
💬 Ready to create something amazing together?`;
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
HTML5, CSS3, JavaScript, React, Node.js, PHP, WordPress

**Pricing Structure:**
• Simple websites: $200-1000
• Business websites: $1,000-3,000
• Complex applications: $3,000-7,000
• Maintenance: $100-300/month
• Consultation: $100/hour

**✨ What makes me different:**
• Fast delivery & responsive design
• SEO optimization included
• Ongoing support & maintenance
• Flexible payment plans available

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

**Pricing Options:**
• Hourly: $15-35/hour
• Part-time: $800-1,500/month (20 hrs/week)
• Full-time: $1,500-3,000/month (40 hrs/week)
• Project-based: Custom quotes

🌟 **Why choose me as your VA:**
• 2+ years experience
• Multi-skilled (tech, creative, admin)
• Reliable & professional communication
• Flexible timezone availability

Ready to streamline your business operations?`;
    }
    
    getPricingResponse(message) {
        if (message.includes('negotiate') || message.includes('bargain') || message.includes('discount')) {
            return this.getNegotiationResponse();
        }
        
        return `💰 **Transparent Pricing Structure:**

🎵 **Music Production:**
• Live Performances: $200–500 per event (varies by duration & location)
• Session Recordings: $100–300 per track
• Personalized Sax Rendition: $75–150 per request
• Coaching / Lessons: $50 per hour (online or in-person)

💻 **Web Development:**
• Simple sites: $500-1,500
• Business sites: $1,500-5,000
• Complex apps: $5,000-15,000
• Maintenance: $100-300/month

👨‍💼 **Virtual Assistant:**
• Hourly: $15-35/hour
• Part-time: $800-1,500/month
• Full-time: $1,500-3,000/month

🎨 **Additional Services:**
• Graphic design: $25-150 per design
• Mobile apps: $1,000-10,000
• Video editing: $50-200 per project

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
🎵 Music collaborations & features
🎬 Content creation partnerships
💼 Brand ambassadorships
🎪 Event partnerships & performances
📱 Product reviews & endorsements

**What I offer sponsors:**
• Authentic engagement across all platforms
• Professional content creation
• Cross-platform promotion
• Creative collaboration opportunities
• Measurable results & analytics

**My Reach:**
📺 YouTube: @peterphonist
📸 Instagram: @peterphonist
🎵 TikTok: @peterphonist
📘 Facebook: @peterphonist
👻 Snapchat: @peterphonist

**Partnership Requirements:**
✅ Aligned with creative/professional values
✅ Mutual benefit & fair compensation
✅ Creative freedom maintained
✅ Long-term relationship potential

**Ready to partner?**
📧 Email: ppetereluwade55@gmail.com
📱 WhatsApp: +234 8108821809

Let's create something amazing together! 🚀`;
    }
    
    getNegotiationResponse() {
        return `💡 **Flexible Pricing & Negotiation Options:**

**I understand budgets vary! Here's how we can work together:**

🎯 **Discount Opportunities:**
• Bulk projects: 10-25% off
• Long-term contracts: Special rates
• Referral bonuses: 15% off next project
• Student/startup discounts: 20% off

💳 **Payment Flexibility:**
• Payment plans for larger projects
• Milestone-based payments
• Retainer agreements available
• Cryptocurrency accepted

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

**Music Platforms:**
🎧 **Audiomack:** peterphonist
🎶 **Spotify:** Peterphonist

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
• Music videos & tutorials
• Behind-the-scenes content
• Live streams & Q&As

📸 **Instagram:** @peterphonist  
• Daily creative updates
• Work-in-progress shots
• Stories & reels

🎵 **TikTok:** @peterphonist
• Quick music clips
• Creative process videos
• Trending audio content

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

**Music Platforms:**
🎧 **SoundCloud:** peterphonist
🎶 **Spotify:** Peterphonist

**💡 Pro Tip:** Follow on multiple platforms for different types of content and exclusive updates!

Which platform would you like to connect on first? 🚀`;
    }
    
    getPortfolioResponse() {
        return `🎨 **Peter's Portfolio & Work Samples:**

🎵 **Music Portfolio (Peterphonist):**
• Audiomack: peterphonist
• Spotify: Peterphonist  
• YouTube: @peterphonist
• Instagram: @peterphonist (audio posts)

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

🎨 **Creative Work:**
• Instagram: @eluwadepeter

**📊 Recent Achievements:**
• 20+ successful web projects
• 15+ satisfied VA clients
• 90% client retention rate

**🎯 Specialization Examples:**
• E-commerce sites with 300% conversion improvement
• Viral music content (1M+ plays)
• Streamlined business operations (40% efficiency gain)

Want to see specific examples for your type of project? Let me know what you're interested in! 🚀`;
    }
    
    getAboutResponse() {
        return `👨‍💻 **Meet Peter Lightspeed:**

**🎯 Multi-Talented Creative Professional**
Known in the music world as "Peterphonist"

**📈 Experience & Expertise:**
• 2+ years in digital creative services
• Saxophonis, web developer, VA specialist
• Served 50+ clients globally
• Expertise across multiple industries

**🌟 What Makes Peter Unique:**
• Multi-disciplinary skill set
• Creative + technical expertise
• Reliable & professional communication
• Flexible & adaptable to client needs
• Passionate about bringing ideas to life

**🎵 Music Journey:**
Started as bedroom saxophonis, now creating professional saxophone scales and compositions for artists worldwide under "Peterphonist"

**💻 Tech Journey:**
Self-taught developer who became proficient in modern web technologies, helping businesses establish strong online presence

**👨‍💼 Business Journey:**
Evolved into comprehensive virtual assistant, helping entrepreneurs and businesses streamline operations

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
            "That's a great question! I'd love to help you with that. Could you tell me more about what you're looking for? I can assist with music production, web development, virtual assistant services, pricing, or partnerships.",
            
            "Interesting! I'm here to help with anything related to Peter's services. Whether you need music production (as Peterphonist), web development, VA support, or want to discuss sponsorships - I've got you covered!",
            
            "I'd be happy to help! Peter offers music production, web development, virtual assistant services, and is open to partnerships. What specific area interests you most?",
            
            "Thanks for reaching out! I can provide detailed information about Peter's services, pricing, portfolio, or business opportunities. What would you like to know more about?",
            
            "Great to hear from you! I'm equipped to answer questions about music production (Peterphonist), web development, virtual assistant services, pricing negotiations, sponsorships, and more. How can I assist you today?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Initialize enhanced response generator
const responseGenerator = new EnhancedResponseGenerator();

// Enhanced getBotResponse function
function getBotResponse(message) {
    // Get conversation context (last 3 messages)
    const context = chatHistory.slice(-6).map(msg => ({
        text: msg.text,
        sender: msg.sender
    }));
    
    return responseGenerator.generateResponse(message, context);
}

// Enhanced quick replies based on context
function getContextualQuickReplies() {
    const lastBotMessage = chatHistory.slice().reverse().find(msg => msg.sender === 'bot');
    
    if (!lastBotMessage) {
        return [
            "🎵 Saxophone",
            "💻 Web Development", 
            "👨‍💼 Virtual Assistant",
            "💰 Pricing Info",
            "🤝 Sponsorships"
        ];
    }
    
    const lastMessage = lastBotMessage.text.toLowerCase();
    
    if (lastMessage.includes('music') || lastMessage.includes('peterphonist')) {
        return [
            "🎧 Hear music",
            "💰 Music Pricing",
            "📱 Social Media",
            "🤝 Music Collaboration"
        ];
    }
    
    if (lastMessage.includes('web') || lastMessage.includes('development')) {
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
    
    if (lastMessage.includes('sponsor') || lastMessage.includes('partnership')) {
        return [
            "📧 Contact for Sponsorship",
            "📊 Audience Analytics",
            "🎯 Partnership Types",
            "💼 Brand Alignment",
            "📱 Social Reach"
        ];
    }
    
    if (lastMessage.includes('pricing') || lastMessage.includes('cost')) {
        return [
            "💡 Negotiate Price",
            "📦 Package Deals",
            "💳 Payment Plans",
            "🎯 Bulk Discounts",
            "📞 Custom Quote"
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

// Update the showQuickReplies function
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
}

// Add feedback system
function addFeedbackButtons(messageElement) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'message-feedback';
    feedbackDiv.innerHTML = `
        <button class="feedback-btn positive" title="Helpful">👍</button>
        <button class="feedback-btn negative" title="Not helpful">👎</button>
    `;
    
    messageElement.appendChild(feedbackDiv);
    
    // Add event listeners
    feedbackDiv.querySelector('.positive').addEventListener('click', () => {
        logInteraction('', '', 'positive');
        feedbackDiv.innerHTML = '<span class="feedback-thanks">Thanks for your feedback! 😊</span>';
    });
    
    feedbackDiv.querySelector('.negative').addEventListener('click', () => {
        logInteraction('', '', 'negative');
        feedbackDiv.innerHTML = '<span class="feedback-thanks">Thanks! I\'ll improve. 🤔</span>';
    });
}

// Enhanced message display with feedback
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
            </div>`;
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

// Enhanced session management
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

// Export enhanced bot
window.PeterBot = {
init: initializeBot,
config: BOT_CONFIG,
knowledge: KNOWLEDGE_BASE,
openChat: openChat,
closeChat: closeChat,
addMessage: addBotMessage,
getAnalytics: () => JSON.parse(localStorage.getItem('peterbot_analytics') || '[]'),
version: '2.0'
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
console.log('DOM loaded, initializing Enhanced PeterBot v2.0...');
initializeBot();
});

// Advanced Features Extension for Enhanced PeterBot v2.0
console.log('Loading Advanced Features Extension...');

// Advanced AI Response System
class AdvancedAI {
    constructor() {
        this.learningData = this.loadLearningData();
        this.userProfiles = this.loadUserProfiles();
        this.conversationFlow = new Map();
        this.sentimentAnalyzer = new SentimentAnalyzer();
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
            budget_mentioned: /\$|\d+|budget|price|cost/.test(message.toLowerCase()) ? 20 : 0,
            timeline_mentioned: /when|deadline|asap|soon|month|week/.test(message.toLowerCase()) ? 15 : 0,
            specific_service: /beat|website|app|design|va|assistant/.test(message.toLowerCase()) ? 25 : 0,
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
            'pricing_inquiry': "💰 Hi! You asked about pricing earlier. Would you like a detailed quote for your project?",
            'service_interest': "🎯 Hello! You showed interest in our services. Ready to discuss your project in detail?",
            'portfolio_request': "🎨 Hi! You wanted to see Peter's portfolio. I can share specific examples for your type of project!",
            'contact_attempt': "📞 Hello! You were looking to contact Peter. He's available for a consultation - shall I help you schedule one?"
        };
        
        return messages[type] || messages['no_response'];
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
            enhanced += "\n\n⚡ I see this is urgent! Peter prioritizes time-sensitive projects. Let me connect you directly: 📱 WhatsApp: +1234567890";
        }
        
        // Add lead quality enhancements
        if (leadQuality.level === 'hot') {
            enhanced += "\n\n🔥 **Ready to get started?** Let me connect you with Peter directly for immediate assistance!";
            enhanced += "\n📧 **Direct Email:** peter@peterlightspeed.com";
            enhanced += "\n📱 **WhatsApp:** +1234567890";
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
            messageCount: (this.userProfiles.current?.messageCount || 0) + 1
        };
        
        this.userProfiles.current = profile;
        localStorage.setItem('peterbot_profiles', JSON.stringify(this.userProfiles));
    }
}

// Smart Project Calculator
class ProjectCalculator {
    constructor() {
        this.projectData = {};
    }
    
    calculateEstimate(projectType, requirements) {
        const basePrices = {
            music: {
                beat: { min: 50, max: 200 },
                mixing: { min: 100, max: 300 },
                mastering: { min: 50, max: 150 },
                jingle: { min: 150, max: 500 }
            },
            web: {
                simple: { min: 500, max: 1500 },
                business: { min: 1500, max: 5000 },
                ecommerce: { min: 3000, max: 8000 },
                app: { min: 5000, max: 15000 }
            },
            va: {
                hourly: { min: 15, max: 35 },
                parttime: { min: 800, max: 1500 },
                fulltime: { min: 1500, max: 3000 }
            }
        };
        
        let estimate = basePrices[projectType] || { min: 100, max: 500 };
        
        // Apply multipliers based on requirements
        if (requirements.includes('urgent')) {
            estimate.min *= 1.5;
            estimate.max *= 1.5;
        }
        
        if (requirements.includes('complex')) {
            estimate.min *= 1.3;
            estimate.max *= 1.3;
        }
        
        return {
            range: `$${Math.round(estimate.min)}-${Math.round(estimate.max)}`,
            factors: this.getEstimateFactors(requirements)
        };
    }
    
    getEstimateFactors(requirements) {
        const factors = [];
        
        if (requirements.includes('urgent')) factors.push('Rush delivery (+50%)');
        if (requirements.includes('complex')) factors.push('Complex requirements (+30%)');
        if (requirements.includes('revisions')) factors.push('Multiple revisions included');
        
        return factors;
    }
}

// Enhanced Quick Actions
const ENHANCED_QUICK_ACTIONS = {
    getQuote: (projectType) => {
        return `🎯 **Get Instant Quote for ${projectType}:**
        
Please tell me:
1️⃣ Project scope/requirements
2️⃣ Timeline/deadline
3️⃣ Budget range
4️⃣ Any special requirements

I'll provide an accurate quote within minutes! 💰`;
    },
    
    scheduleCall: () => {
        return `📞 **Schedule a Call with Peter:**
        
🗓️ **Available Times:**
• Monday-Friday: 9 AM - 6 PM EST
• Saturday: 10 AM - 2 PM EST
• Emergency projects: 24/7 availability

**To schedule:**
📧 Email: peter@peterlightspeed.com
📱 WhatsApp: +1234567890
💬 Telegram: @peterphonist

**What to prepare:**
✅ Project details
✅ Timeline requirements  
✅ Budget expectations
✅ Reference materials

Ready to book your consultation? 🚀`;
    },
    
    viewSamples: (category) => {
        const samples = {
            music: `🎵 **Music Samples (Peterphonist):**
            
🎧 **Listen Now:**
• Spotify: Peterphonist
• SoundCloud: peterphonist
• YouTube: @peterphonist

🎼 **Sample Beats:**
• Hip-Hop: "Urban Vibes" - 2M+ plays
• Pop: "Sunset Dreams" - 1.5M+ plays  
• Electronic: "Digital Pulse" - 800K+ plays
• R&B: "Smooth Nights" - 1.2M+ plays

🎯 **Client Testimonials:**
"Peterphonist delivered exactly what I needed!" - Artist MC Flow
"Professional quality, fast delivery!" - Singer Luna Rose

Want a custom beat in your style? 🎵`,

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

Ready to scale your business? 📊`
        };
        
        return samples[category] || samples.web;
    }
};

// Initialize enhanced systems
const superAI = new SuperEnhancedResponseGenerator();
const projectCalculator = new ProjectCalculator();
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
        return ENHANCED_QUICK_ACTIONS.getQuote(projectType);
    }
    
    if (message.toLowerCase().includes('schedule call') || message.toLowerCase().includes('book consultation')) {
        return ENHANCED_QUICK_ACTIONS.scheduleCall();
    }
    
    if (message.toLowerCase().includes('samples') || message.toLowerCase().includes('portfolio')) {
        const category = extractCategory(message);
        return ENHANCED_QUICK_ACTIONS.viewSamples(category);
    }
    
    // Use AI-enhanced response generation
    return superAI.generateResponse(message, context);
}

// Helper functions
function extractProjectType(message) {
    const msg = message.toLowerCase();
    if (msg.includes('music') || msg.includes('beat')) return 'Music Production';
    if (msg.includes('web') || msg.includes('website')) return 'Web Development';
    if (msg.includes('va') || msg.includes('assistant')) return 'Virtual Assistant';
    return 'Custom Project';
}

function extractCategory(message) {
    const msg = message.toLowerCase();
    if (msg.includes('music') || msg.includes('beat')) return 'music';
    if (msg.includes('web') || msg.includes('website')) return 'web';
    if (msg.includes('va') || msg.includes('assistant')) return 'va';
    return 'web';
}

// Enhanced Quick Replies with Smart Suggestions
function getContextualQuickReplies() {
    const lastBotMessage = chatHistory.slice().reverse().find(msg => msg.sender === 'bot');
    const userProfile = JSON.parse(localStorage.getItem('peterbot_profiles') || '{}').current;
    
    // Smart suggestions based on user behavior
    if (userProfile?.leadLevel === 'hot') {
        return [
            "📞 Schedule Call Now",
            "💰 Get Custom Quote", 
            "📧 Contact Directly",
            "🎯 View Portfolio",
            "⚡ Rush Project"
        ];
    }
    
    if (userProfile?.leadLevel === 'warm') {
        return [
            "💰 Pricing Calculator",
            "🎨 View Samples",
            "📋 Project Details", 
            "📞 Free Consultation",
            "🤝 Partnership Info"
        ];
    }
    
    // Context-based suggestions
    if (!lastBotMessage) {
        return [
            "🎵 Music Production",
            "💻 Web Development", 
            "👨‍💼 Virtual Assistant",
            "💰 Get Quote",
            "🤝 Sponsorship"
        ];
    }
    
    const lastMessage = lastBotMessage.text.toLowerCase();
    
    if (lastMessage.includes('music') || lastMessage.includes('peterphonist')) {
        return [
            "🎧 Hear Samples",
            "💰 Beat Pricing",
            "🎵 Custom Order",
            "📱 Follow @peterphonist",
            "🤝 Collaboration"
        ];
    }
    
    if (lastMessage.includes('web') || lastMessage.includes('development')) {
        return [
            "🌐 View Portfolio",
            "💰 Website Quote", 
            "🛒 E-commerce Info",
            "📱 Mobile Apps",
            "🔧 Maintenance"
        ];
    }
    
    if (lastMessage.includes('virtual assistant') || lastMessage.includes('va')) {
        return [
            "📋 VA Services",
            "💰 VA Pricing",
            "📊 Success Stories",
            "⏰ Availability",
            "🤝 Long-term Deal"
        ];
    }
    
    if (lastMessage.includes('sponsor') || lastMessage.includes('partnership')) {
        return [
            "📧 Sponsorship Email",
            "📊 Audience Stats",
            "🎯 Partnership Types",
            "💼 Brand Deals",
            "📱 Social Reach"
        ];
    }
    
    // Default smart suggestions
    return [
        "📞 Contact Peter",
        "🎨 View Portfolio",
        "💰 Get Quote",
        "🤝 Partnership",
        "❓ Ask Question"
    ];
}

// Enhanced CSS for new features
function addEnhancedStyles() {
    const additionalStyles = `
        <style id="peterbot-enhanced-styles">
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
        
        /* Enhanced Quick Reply Buttons */
        .quick-reply-btn.priority {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: white;
            font-weight: 600;
            animation: glow 2s infinite alternate;
        }
        
        @keyframes glow {
            from { box-shadow: 0 0 5px rgba(255, 107, 107, 0.5); }
            to { box-shadow: 0 0 20px rgba(255, 107, 107, 0.8); }
        }
        
        /* Lead Quality Indicators */
        .message.hot-lead .message-bubble {
            border-left: 4px solid #ff6b6b;
        }
        
        .message.warm-lead .message-bubble {
            border-left: 4px solid #ffa502;
        }
        
        .message.cold-lead .message-bubble {
            border-left: 4px solid #70a1ff;
        }
        
        /* Smart Suggestions */
        .smart-suggestion {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 10px 15px;
            border-radius: 10px;
            margin: 5px 0;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .smart-suggestion:hover {
            transform: translateX(5px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }
        
        /* Enhanced Status Indicators */
        .typing-indicator-enhanced {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 10px;
            margin: 10px 0;
        }
        
        .ai-thinking {
            color: #667eea;
            font-style: italic;
            font-size: 12px;
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', additionalStyles);
}

// Initialize all enhanced features
function initializeEnhancedFeatures() {
    // Add enhanced styles
    addEnhancedStyles();
    
    // Initialize AI systems
    console.log('🤖 AI Systems initialized');
    console.log('📊 Analytics tracking enabled');
    console.log('🔄 Follow-up system active');
    console.log('💡 Smart suggestions ready');
    
    // Setup advanced event listeners
    setupAdvancedEventListeners();
}

function setupAdvancedEventListeners() {
    // Track user engagement
    document.addEventListener('click', (e) => {
        if (e.target.closest('.peterbot-container')) {
            logUserEngagement('click', e.target.className);
        }
    });
    
    // Track scroll behavior in chat
    const messagesContainer = document.getElementById('peterbot-messages');
    if (messagesContainer) {
        messagesContainer.addEventListener('scroll', () => {
            logUserEngagement('scroll', 'messages');
        });
    }
    
    // Track typing patterns
    const input = document.getElementById('peterbot-input');
    if (input) {
        let typingTimer;
        input.addEventListener('input', () => {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
                logUserEngagement('typing_pause', input.value.length);
            }, 1000);
        });
    }
}

function logUserEngagement(action, data) {
    const engagement = {
        timestamp: Date.now(),
        action: action,
        data: data,
        sessionId: currentSessionId
    };
    
    let engagementLog = JSON.parse(localStorage.getItem('peterbot_engagement') || '[]');
    engagementLog.push(engagement);
    
    // Keep only last 50 engagement events
    if (engagementLog.length > 50) {
        engagementLog = engagementLog.slice(-50);
    }
    
    localStorage.setItem('peterbot_engagement', JSON.stringify(engagementLog));
}

// Initialize enhanced features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeEnhancedFeatures();
    }, 1000);
});

console.log('🚀 Enhanced PeterBot v2.0 with Advanced AI Features loaded! 🎵💻🤖');
