// PeterBot Professional v4.0 - Fixed Bold Text & Admin Storage
(function() {
    'use strict';

    // Configuration
    const PETERBOT_CONFIG = {
        name: 'PeterBot',
        version: '4.0',
        avatar: 'https://peterlight123.github.io/portfolio/assets/images/peter-avatar.jpg',
        apiKey: 'your-api-key-here', // Replace with actual API key
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        adminPassword: 'peter2024admin',
        storageKey: 'peterbot_data'
    };

    // Chat State
    let chatState = {
        isOpen: false,
        isTyping: false,
        apiConnected: false,
        isAdmin: false,
        messages: [],
        analytics: {
            totalChats: 0,
            commonQuestions: {},
            userFeedback: []
        }
    };

    // Quick Replies
    const QUICK_REPLIES = {
        welcome: ['Services', 'Pricing', 'Portfolio', 'Contact'],
        services: ['Web Development', 'Virtual Assistant', 'Digital Marketing', 'Saxophone'],
        contact: ['WhatsApp', 'Email', 'Portfolio', 'Social Media'],
        pricing: ['Web Pricing', 'VA Rates', 'Marketing Costs', 'Music Rates']
    };

    // Admin Storage Functions
    function saveToStorage() {
        try {
            const data = {
                messages: chatState.messages,
                analytics: chatState.analytics,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(PETERBOT_CONFIG.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Storage save error:', error);
        }
    }

    function loadFromStorage() {
        try {
            const data = localStorage.getItem(PETERBOT_CONFIG.storageKey);
            if (data) {
                const parsed = JSON.parse(data);
                chatState.analytics = parsed.analytics || chatState.analytics;
                return parsed;
            }
        } catch (error) {
            console.error('Storage load error:', error);
        }
        return null;
    }

    function updateAnalytics(message, type) {
        if (type === 'user') {
            chatState.analytics.totalChats++;
            const question = message.toLowerCase();
            chatState.analytics.commonQuestions[question] = 
                (chatState.analytics.commonQuestions[question] || 0) + 1;
        }
        saveToStorage();
    }

    // CSS Styles
    const styles = `
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
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .peterbot-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(0,0,0,0.2);
        }

        .peterbot-chat {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            display: none;
            flex-direction: column;
            overflow: hidden;
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .peterbot-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .peterbot-header-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .peterbot-avatar {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.3);
        }

        .peterbot-title {
            font-weight: 600;
            font-size: 16px;
        }

        .peterbot-status {
            font-size: 12px;
            opacity: 0.9;
        }

        .peterbot-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: background 0.2s;
        }

        .peterbot-close:hover {
            background: rgba(255,255,255,0.2);
        }

        .peterbot-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #f8f9fa;
        }

        .message {
            display: flex;
            margin-bottom: 15px;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .message.user {
            justify-content: flex-end;
        }

        .message-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #667eea;
            color: white;
            font-size: 12px;
            flex-shrink: 0;
        }

        .message.user .message-avatar {
            order: 2;
            margin-right: 0;
            margin-left: 10px;
            background: #28a745;
        }

        .message-avatar img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }

        .message-content {
            max-width: 70%;
        }

        .message.user .message-content {
            text-align: right;
        }

        .message-bubble {
            background: white;
            padding: 12px 16px;
            border-radius: 18px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            line-height: 1.4;
        }

        .message.user .message-bubble {
            background: #667eea;
            color: white;
        }

        .message-time {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
        }

        .typing-indicator .message-bubble {
            padding: 16px;
        }

        .typing-dots {
            display: flex;
            gap: 4px;
        }

        .typing-dots span {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #667eea;
            animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
        }

        .peterbot-input {
            padding: 15px 20px;
            border-top: 1px solid #eee;
            background: white;
        }

        .input-container {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .peterbot-input input {
            flex: 1;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 25px;
            outline: none;
            font-size: 14px;
        }

        .peterbot-input input:focus {
            border-color: #667eea;
        }

        .send-button {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #667eea;
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        .send-button:hover {
            background: #5a6fd8;
        }

        .send-button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .quick-replies {
            padding: 10px 20px;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            background: white;
            border-top: 1px solid #eee;
        }

        .quick-reply {
            padding: 8px 12px;
            background: #f1f3f4;
            border: none;
            border-radius: 15px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .quick-reply:hover {
            background: #667eea;
            color: white;
        }

        .admin-panel {
            background: #fff3cd;
            padding: 10px;
            border-bottom: 1px solid #ffeaa7;
            font-size: 12px;
        }

        .admin-controls {
            display: flex;
            gap: 10px;
            margin-top: 5px;
        }

        .admin-btn {
            padding: 4px 8px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
        }

        /* Bold text styles */
        .bold { font-weight: bold; }
        .highlight { color: #667eea; font-weight: bold; }
        .price { color: #28a745; font-weight: bold; }
        .service-title { color: #495057; font-weight: bold; font-size: 15px; }

        /* Mobile Responsive */
        @media (max-width: 480px) {
            .peterbot-chat {
                width: calc(100vw - 40px);
                height: calc(100vh - 100px);
                right: 20px;
            }
        }
    `;

    // Initialize PeterBot
    function initPeterBot() {
        console.log('🚀 Initializing PeterBot Professional v4.0...');
        
        // Load stored data
        loadFromStorage();
        
        // Inject styles
        if (!document.getElementById('peterbot-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'peterbot-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        // Create bot HTML
        createBotHTML();
        
        // Test API connection
        testAPIConnection();
        
        // Setup event listeners
        setupEventListeners();
        
        console.log('✅ PeterBot initialized successfully');
    }

    // Create Bot HTML
    function createBotHTML() {
        if (document.getElementById('peterbot-container')) return;

        const botHTML = `
            <div class="peterbot-container" id="peterbot-container">
                <button class="peterbot-toggle" id="peterbot-toggle" title="Chat with PeterBot">
                    💬
                </button>
                
                <div class="peterbot-chat" id="peterbot-chat">
                    <div class="peterbot-header">
                        <div class="peterbot-header-info">
                            <img src="${PETERBOT_CONFIG.avatar}" alt="Peter" class="peterbot-avatar" 
                                 onerror="this.style.display='none';">
                            <div>
                                <div class="peterbot-title">${PETERBOT_CONFIG.name}</div>
                                <div class="peterbot-status" id="bot-status">Online</div>
                            </div>
                        </div>
                        <button class="peterbot-close" id="peterbot-close">×</button>
                    </div>
                    
                    <div id="admin-panel" class="admin-panel" style="display: none;">
                        <div><span class="bold">Admin Mode Active</span></div>
                        <div class="admin-controls">
                            <button class="admin-btn" onclick="window.PeterBot.exportData()">Export Data</button>
                            <button class="admin-btn" onclick="window.PeterBot.clearData()">Clear Data</button>
                            <button class="admin-btn" onclick="window.PeterBot.showAnalytics()">Analytics</button>
                        </div>
                    </div>
                    
                    <div class="peterbot-messages" id="messages-container">
                        <!-- Messages will be added here -->
                    </div>
                    
                    <div class="quick-replies" id="quick-replies" style="display: none;">
                        <!-- Quick replies will be added here -->
                    </div>
                    
                    <div class="peterbot-input">
                        <div class="input-container">
                            <input type="text" id="message-input" placeholder="Type your message..." 
                                   maxlength="500" autocomplete="off">
                            <button class="send-button" id="send-button" title="Send message">
                                ➤
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', botHTML);
    }

    // Setup Event Listeners
    function setupEventListeners() {
        const toggle = document.getElementById('peterbot-toggle');
        const close = document.getElementById('peterbot-close');
        const input = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-button');

        toggle?.addEventListener('click', toggleChat);
        close?.addEventListener('click', closeChat);
        sendBtn?.addEventListener('click', sendMessage);
        
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Admin access
        input?.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                checkAdminAccess();
            }
        });
    }

    // Admin Functions
    function checkAdminAccess() {
        const password = prompt('Enter admin password:');
        if (password === PETERBOT_CONFIG.adminPassword) {
            chatState.isAdmin = true;
            document.getElementById('admin-panel').style.display = 'block';
            addMessage('Admin mode activated. You now have access to analytics and data management.', 'bot');
        }
    }

    // Toggle Chat
    function toggleChat() {
        const chat = document.getElementById('peterbot-chat');
        const toggle = document.getElementById('peterbot-toggle');
        
        if (!chat || !toggle) return;

        if (chatState.isOpen) {
            closeChat();
        } else {
            chat.style.display = 'flex';
            chatState.isOpen = true;
            toggle.textContent = '×';
            
            // Show welcome message if no messages
            if (chatState.messages.length === 0) {
                setTimeout(() => {
                    const welcomeMsg = `Hello! 👋 I'm <span class="bold">${PETERBOT_CONFIG.name}</span>, Peter's AI assistant.<br><br>I can help you with:<br>• <span class="highlight">Web Development</span><br>• <span class="highlight">Virtual Assistant Services</span><br>• <span class="highlight">Digital Marketing</span><br>• <span class="highlight">Saxophone Performances</span><br><br>What would you like to know about?`;
                    addMessage(welcomeMsg, 'bot');
                    showQuickReplies('welcome');
                }, 500);
            }
            
            // Focus input
            setTimeout(() => {
                document.getElementById('message-input')?.focus();
            }, 300);
        }
    }

    // Close Chat
    function closeChat() {
        const chat = document.getElementById('peterbot-chat');
        const toggle = document.getElementById('peterbot-toggle');
        
        if (chat && toggle) {
            chat.style.display = 'none';
            chatState.isOpen = false;
            toggle.textContent = '💬';
            hideQuickReplies();
        }
    }

    // Send Message
    function sendMessage() {
        const input = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-button');
        
        if (!input || !sendBtn) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        input.value = '';
        sendBtn.disabled = true;
        
        // Update analytics
        updateAnalytics(message, 'user');
        
        // Hide quick replies
        hideQuickReplies();
        
        // Process response
        setTimeout(() => processResponse(message), 800);
        
        setTimeout(() => {
            sendBtn.disabled = false;
        }, 1000);
    }

    // Add Message
    function addMessage(content, sender) {
        const container = document.getElementById('messages-container');
        if (!container) return;

        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const messageEl = document.createElement('div');
        messageEl.className = `message ${sender}`;
        
        const avatar = sender === 'bot' 
            ? `<img src="${PETERBOT_CONFIG.avatar}" alt="Bot" onerror="this.style.display='none'; this.parentNode.innerHTML='🤖';">`
            : '👤';
            
        messageEl.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-bubble">${content}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        container.appendChild(messageEl);
        
        // Store message
        chatState.messages.push({
            content: content,
            sender: sender,
            timestamp: new Date().toISOString()
        });
        
        scrollToBottom();
        saveToStorage();
    }

    // Test API Connection
    async function testAPIConnection() {
        const statusEl = document.getElementById('bot-status');
        if (!statusEl) return;

        try {
            // Simulate API test - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            chatState.apiConnected = false; // Set to true when API is working
            statusEl.textContent = chatState.apiConnected ? 'AI Online' : 'Online';
        } catch (error) {
            chatState.apiConnected = false;
            statusEl.textContent = 'Online';
        }
    }

    // Process Response
    async function processResponse(message) {
        showTyping();
        
        try {
            let response;
            
            if (chatState.apiConnected) {
                response = await getAIResponse(message);
            } else {
                response = getRuleBasedResponse(message);
            }
            
            setTimeout(() => {
                hideTyping();
                addMessage(response, 'bot');
                
                // Show contextual quick replies
                const context = getContext(message);
                setTimeout(() => showQuickReplies(context), 500);
            }, 1500);
            
        } catch (error) {
            console.error('Response error:', error);
            hideTyping();
            addMessage('Sorry, I encountered an error. Please try again or contact Peter directly at <span class="highlight">petereluwade55@gmail.com</span>', 'bot');
        }
    }

    // AI Response (when API is available)
    async function getAIResponse(message) {
        // This would integrate with actual AI API
        return getRuleBasedResponse(message);
    }

    // Rule-based Response with proper HTML formatting
    function getRuleBasedResponse(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('hello') || msg.includes('hi')) {
            return `👋 Hello! I'm <span class="bold">${PETERBOT_CONFIG.name}</span>, Peter's AI assistant. I can help you with web development, virtual assistant services, digital marketing, and saxophone performances. What interests you?`;
        }
        
        if (msg.includes('service') || msg.includes('what')) {
            return `🚀 <span class="service-title">Peter's Professional Services:</span><br><br>

💻 <span class="bold">Web Development</span><br>
• Custom websites & applications<br>
• E-commerce solutions<br>
• SEO optimization<br><br>

👨‍💼 <span class="bold">Virtual Assistant</span><br>
• Administrative support<br>
• Email & social media management<br>
• Content creation<br><br>

📊 <span class="bold">Digital Marketing</span><br>
• Social media marketing<br>
• SEO & content strategy<br>
• Analytics & reporting<br><br>

🎷 <span class="bold">Saxophone Performances</span><br>
• Weddings: <span class="price">$55 (₦82,500)</span><br>
• Birthdays: <span class="price">$45 (₦67,500)</span><br>
• Church events: <span class="price">$75 (₦112,500)</span><br><br>

Which service would you like to know more about?`;
        }
        
        if (msg.includes('web') || msg.includes('website') || msg.includes('development')) {
            return `💻 <span class="service-title">Web Development Services:</span><br><br>

<span class="bold">What Peter Offers:</span><br>
• <span class="highlight">Responsive Websites</span> - Mobile-friendly designs<br>
• <span class="highlight">E-commerce Solutions</span> - Online stores & payment integration<br>
• <span class="highlight">Web Applications</span> - Custom functionality<br>
• <span class="highlight">SEO Optimization</span> - Better search rankings<br>
• <span class="highlight">WordPress Sites</span> - Easy content management<br><br>

<span class="bold">Technologies Used:</span><br>
React, Node.js, PHP, HTML5, CSS3, JavaScript<br><br>

<span class="bold">Portfolio:</span> <span class="highlight">https://peterlight123.github.io/portfolio/</span><br><br>

<span class="bold">Get Started:</span><br>
📧 petereluwade55@gmail.com<br>
📱 WhatsApp: +234 8108821809<br><br>

Ready to build your website?`;
        }
        
        if (msg.includes('virtual') || msg.includes('assistant') || msg.includes('admin')) {
            return `👨‍💼 <span class="service-title">Virtual Assistant Services:</span><br><br>

<span class="bold">Administrative Support:</span><br>
• Email management & organization<br>
• Calendar scheduling & appointments<br>
• Document preparation & formatting<br>
• Data entry & research<br><br>

<span class="bold">Digital Support:</span><br>
• Social media management<br>
• Content creation & curation<br>
• Customer service support<br>
• Lead generation<br><br>

<span class="bold">Why Choose Peter:</span><br>
✅ Professional experience<br>
✅ Reliable communication<br>
✅ Quick turnaround<br>
✅ Competitive rates<br><br>

<span class="bold">Contact Peter:</span><br>
📧 petereluwade55@gmail.com<br>
📱 +234 8108821809<br><br>

Let's streamline your business operations!`;
        }
        
        if (msg.includes('marketing') || msg.includes('seo') || msg.includes('social')) {
            return `📊 <span class="service-title">Digital Marketing Services:</span><br><br>

<span class="bold">Social Media Marketing:</span><br>
• Content strategy & creation<br>
• Platform management (Instagram, Facebook, Twitter)<br>
• Engagement & community building<br>
• Analytics & reporting<br><br>

<span class="bold">SEO Services:</span><br>
• Keyword research & optimization<br>
• On-page & technical SEO<br>
• Content optimization<br>
• Performance tracking<br><br>

<span class="bold">Content Strategy:</span><br>
• Blog writing & management<br>
• Email marketing campaigns<br>
• Brand messaging<br>
• Visual content creation<br><br>

<span class="bold">Results-Driven Approach:</span><br>
📈 Increased online visibility<br>
🎯 Targeted audience engagement<br>
💰 Better ROI on marketing spend<br><br>

<span class="bold">Get Started:</span><br>
📧 petereluwade55@gmail.com<br>
📱 WhatsApp: +234 8108821809`;
        }
        
        if (msg.includes('saxophone') || msg.includes('music') || msg.includes('performance')) {
            return `🎷 <span class="service-title">Professional Saxophone Performances:</span><br><br>

<span class="bold">Event Pricing:</span><br>
💒 <span class="bold">Wedding Ceremonies:</span> <span class="price">$55 USD (₦82,500)</span><br>
🎂 <span class="bold">Birthday Celebrations:</span> <span class="price">$45 USD (₦67,500)</span><br>
⛪ <span class="bold">Church Services:</span> <span class="price">$75 USD (₦112,500)</span><br><br>

<span class="bold">Performance Includes:</span><br>
• Professional sound setup<br>
• 1-2 hours of live music<br>
• Song requests (when possible)<br>
• Professional attire<br><br>

<span class="bold">Music Styles:</span><br>
Jazz, Gospel, Contemporary, Classical, Afrobeat<br><br>

<span class="bold">Follow @peterphonist on:</span><br>
🎬 YouTube | 📸 Instagram | 🎵 TikTok | 📘 Facebook<br><br>

<span class="bold">Book Performance:</span><br>
📱 WhatsApp: +234 8108821809<br>
📧 petereluwade55@gmail.com<br><br>

Make your event unforgettable with live saxophone!`;
        }
        
        if (msg.includes('payment') || msg.includes('pay') || msg.includes('crypto') || msg.includes('bank')) {
            return `💳 <span class="service-title">Payment Methods:</span><br><br>

<span class="bold">🪙 Cryptocurrency (Preferred):</span><br>
• Bitcoin (BTC)<br>
• Ethereum (ETH)<br>
• USDT (Tether)<br><br>

<span class="bold">🏦 Bank Transfer:</span><br>
• <span class="bold">Bank:</span> Zenith Bank<br>
• <span class="bold">Account:</span> 4291620354<br>
• <span class="bold">Name:</span> Eluwade Peter Toluwanimi<br><br>

<span class="bold">💰 Payment Process:</span><br>
1. Service agreement & quote<br>
2. 50% deposit to start<br>
3. Remaining 50% on completion<br>
4. All payments secure & verified<br><br>

<span class="bold">Currency Options:</span><br>
USD, NGN, or Cryptocurrency<br><br>

<span class="bold">Questions about payment?</span><br>
📧 petereluwade55@gmail.com<br>
📱 WhatsApp: +234 8108821809`;
        }
        
        if (msg.includes('contact') || msg.includes('reach') || msg.includes('phone') || msg.includes('email')) {
            return `📞 <span class="service-title">Contact Peter Eluwade:</span><br><br>

<span class="bold">Primary Contact:</span><br>
📧 <span class="bold">Email:</span> <span class="highlight">petereluwade55@gmail.com</span><br>
📱 <span class="bold">WhatsApp:</span> <span class="highlight">+234 8108821809</span><br>
💬 <span class="bold">Telegram:</span> @peterlightspeed<br><br>

<span class="bold">Professional Links:</span><br>
🌐 <span class="bold">Portfolio:</span> <span class="highlight">https://peterlight123.github.io/portfolio/</span><br>
💼 <span class="bold">LinkedIn:</span> Professional networking<br>
📄 <span class="bold">Resume:</span> Available on request<br><br>

<span class="bold">Social Media (@peterphonist):</span><br>
🎬 YouTube - Music performances<br>
📸 Instagram - Behind the scenes<br>
📘 Facebook - Updates & events<br>
🎵 TikTok - Short performances<br>
🐦 Twitter - Professional updates<br><br>

<span class="bold">Response Times:</span><br>
• WhatsApp: 2-6 hours<br>
• Email: Within 24 hours<br>
• Social media: Within 12 hours<br><br>

Ready to connect?`;
        }
        
        if (msg.includes('price') || msg.includes('cost') || msg.includes('rate')) {
            return `💰 <span class="service-title">Service Pricing:</span><br><br>

<span class="bold">🎷 Saxophone Performances:</span><br>
• Weddings: <span class="price">$55 (₦82,500)</span><br>
• Birthdays: <span class="price">$45 (₦67,500)</span><br>
• Church events: <span class="price">$75 (₦112,500)</span><br><br>

<span class="bold">💻 Web Development:</span><br>
• Basic website: <span class="price">Starting from $200</span><br>
• E-commerce: <span class="price">Starting from $500</span><br>
• Custom applications: <span class="price">Quote on request</span><br><br>

<span class="bold">👨‍💼 Virtual Assistant:</span><br>
• Hourly rate: <span class="price">$8-15/hour</span><br>
• Monthly packages: <span class="price">$300-800</span><br>
• Project-based: <span class="price">Custom quotes</span><br><br>

<span class="bold">📊 Digital Marketing:</span><br>
• Social media management: <span class="price">$150-400/month</span><br>
• SEO services: <span class="price">$200-600/month</span><br>
• Content creation: <span class="price">$50-200/project</span><br><br>

<span class="bold">💳 Payment Options:</span><br>
Cryptocurrency & Bank Transfer<br><br>

<span class="bold">Get Custom Quote:</span><br>
📧 petereluwade55@gmail.com<br>
📱 +234 8108821809`;
        }
        
        if (msg.includes('portfolio') || msg.includes('work') || msg.includes('example')) {
            return `🌐 <span class="service-title">Peter's Professional Portfolio:</span><br><br>

<span class="bold">Visit:</span> <span class="highlight">https://peterlight123.github.io/portfolio/</span><br><br>

<span class="bold">What You'll Find:</span><br>
✅ <span class="bold">Project Showcases</span> - Web development examples<br>
✅ <span class="bold">Service Details</span> - Complete offerings<br>
✅ <span class="bold">Client Testimonials</span> - Real feedback<br>
✅ <span class="bold">Music Performances</span> - Saxophone videos<br>
✅ <span class="bold">Contact Information</span> - Easy to reach<br>
✅ <span class="bold">Payment Details</span> - Transparent pricing<br><br>

<span class="bold">Featured Projects:</span><br>
• Responsive business websites<br>
• E-commerce solutions<br>
• Portfolio sites<br>
• Web applications<br><br>

<span class="bold">Music Portfolio:</span><br>
🎬 YouTube: @peterphonist<br>
📸 Instagram: @peterphonist<br><br>

<span class="bold">Professional Experience:</span><br>
• 3+ years web development<br>
• 50+ satisfied clients<br>
• Multiple successful projects<br>
• Growing music career<br><br>

Check out the portfolio to see Peter's expertise!`;
        }
        
        // Default responses
        const defaultResponses = [
            `I'm here to help! Peter offers <span class="highlight">web development</span>, <span class="highlight">virtual assistant services</span>, <span class="highlight">digital marketing</span>, and <span class="highlight">saxophone performances</span>. What would you like to know more about?`,
            
            `Thanks for reaching out! I can provide information about Peter's services, pricing, or help you get in touch. Visit his portfolio at <span class="highlight">https://peterlight123.github.io/portfolio/</span> for more details.`,
            
            `Hello! I'm Peter's AI assistant. Whether you need a website, business support, marketing help, or live music, I can help you find the right solution. What interests you most?`
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Show Typing Indicator
    function showTyping() {
        if (chatState.isTyping) return;
        
        chatState.isTyping = true;
        const container = document.getElementById('messages-container');
        
        const typingEl = document.createElement('div');
        typingEl.className = 'message bot typing-indicator';
        typingEl.id = 'typing-indicator';
        typingEl.innerHTML = `
            <div class="message-avatar">
                <img src="${PETERBOT_CONFIG.avatar}" alt="Bot" 
                     onerror="this.style.display='none'; this.parentNode.innerHTML='🤖';">
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
        
        container?.appendChild(typingEl);
        scrollToBottom();
    }

    // Hide Typing Indicator
    function hideTyping() {
        chatState.isTyping = false;
        document.getElementById('typing-indicator')?.remove();
    }

    // Show Quick Replies
    function showQuickReplies(context = 'welcome') {
        const container = document.getElementById('quick-replies');
        if (!container) return;
        
        const replies = QUICK_REPLIES[context] || QUICK_REPLIES.welcome;
        
        container.innerHTML = '';
        container.style.display = 'flex';
        
        replies.forEach(reply => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply';
            btn.textContent = reply;
            btn.addEventListener('click', () => handleQuickReply(reply));
            container.appendChild(btn);
        });
    }

    // Hide Quick Replies
    function hideQuickReplies() {
        const container = document.getElementById('quick-replies');
        if (container) {
            container.style.display = 'none';
        }
    }

    // Handle Quick Reply
    function handleQuickReply(reply) {
        addMessage(reply, 'user');
        hideQuickReplies();
        setTimeout(() => processResponse(reply), 300);
    }

    // Get Context for Quick Replies
    function getContext(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('contact') || msg.includes('reach') || msg.includes('phone') || msg.includes('email')) {
            return 'contact';
        }
        
        if (msg.includes('service') || msg.includes('price') || msg.includes('cost')) {
            return 'services';
        }
        
        return 'welcome';
    }

    // Scroll to Bottom
    function scrollToBottom() {
        const container = document.getElementById('messages-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    // Admin Functions
    function exportData() {
        if (!chatState.isAdmin) return;
        
        const data = {
            messages: chatState.messages,
            analytics: chatState.analytics,
            exportDate: new Date().toISOString(),
            version: PETERBOT_CONFIG.version
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `peterbot-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        addMessage('<span class="bold">Data exported successfully!</span>', 'bot');
    }

    function clearData() {
        if (!chatState.isAdmin) return;
        
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.removeItem(PETERBOT_CONFIG.storageKey);
            chatState.messages = [];
            chatState.analytics = {
                totalChats: 0,
                commonQuestions: {},
                userFeedback: []
            };
            
            document.getElementById('messages-container').innerHTML = '';
            addMessage('<span class="bold">All data cleared successfully!</span>', 'bot');
        }
    }

    function showAnalytics() {
        if (!chatState.isAdmin) return;
        
        const analytics = chatState.analytics;
        const topQuestions = Object.entries(analytics.commonQuestions)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([q, count]) => `• ${q} (${count} times)`)
            .join('<br>');
        
        const analyticsMsg = `
            <span class="service-title">📊 PeterBot Analytics</span><br><br>
            <span class="bold">Total Conversations:</span> ${analytics.totalChats}<br>
            <span class="bold">Total Messages:</span> ${chatState.messages.length}<br>
            <span class="bold">Data Storage:</span> ${(JSON.stringify(chatState).length / 1024).toFixed(2)} KB<br><br>
            <span class="bold">Top Questions:</span><br>
            ${topQuestions || 'No data yet'}
        `;
        
        addMessage(analyticsMsg, 'bot');
    }

    // Create Fallback Bot
    function createFallbackBot() {
        console.log('Creating fallback bot...');
        
        const fallbackHTML = `
        <div class="peterbot-container">
            <button class="peterbot-toggle" onclick="window.open('https://wa.me/2348108821809', '_blank')" 
                    title="Contact Peter on WhatsApp">
                💬
            </button>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', fallbackHTML);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPeterBot);
    } else {
        initPeterBot();
    }

    // Export for global access
    window.PeterBot = {
        init: initPeterBot,
        config: PETERBOT_CONFIG,
        state: chatState,
        open: () => !chatState.isOpen && toggleChat(),
        close: closeChat,
        send: (message) => {
            if (!chatState.isOpen) toggleChat();
            setTimeout(() => {
                document.getElementById('message-input').value = message;
                sendMessage();
            }, 300);
        },
        exportData: exportData,
        clearData: clearData,
        showAnalytics: showAnalytics,
        version: '4.0'
    };

    console.log('✅ PeterBot Professional v4.0 loaded successfully');

})();
