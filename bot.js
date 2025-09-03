// PeterBot Professional v4.0 - Enhanced Styling with Image
(function() {
    'use strict';

    // Configuration
    const PETERBOT_CONFIG = {
        name: 'PeterBot',
        version: '4.0',
        avatar: 'https://i.imgur.com/5Eu01Tk.jpeg',
        apiKey: 'AIzaSyB03WLfMuQIz8iZjwu6sebdtwfXXjXG-Qw'
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

    // Enhanced Professional CSS Styles
    const styles = `
        .peterbot-container {
            position: fixed;
            bottom: 25px;
            right: 25px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .peterbot-toggle {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }

        .peterbot-toggle::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%);
            border-radius: 50%;
        }

        .peterbot-toggle:hover {
            transform: scale(1.1) translateY(-2px);
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6);
        }

        .peterbot-toggle:active {
            transform: scale(0.95);
        }

        .peterbot-chat {
            position: absolute;
            bottom: 90px;
            right: 0;
            width: 380px;
            height: 550px;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1);
            display: none;
            flex-direction: column;
            overflow: hidden;
            animation: chatSlideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(20px);
        }

        @keyframes chatSlideUp {
            from { 
                opacity: 0; 
                transform: translateY(30px) scale(0.9); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
        }

        .peterbot-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 25px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
        }

        .peterbot-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
        }

        .peterbot-header-info {
            display: flex;
            align-items: center;
            gap: 15px;
            position: relative;
            z-index: 1;
        }

        .peterbot-avatar {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            border: 3px solid rgba(255,255,255,0.3);
            object-fit: cover;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .peterbot-title {
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 2px;
        }

        .peterbot-status {
            font-size: 13px;
            opacity: 0.9;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #4ade80;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .peterbot-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all 0.2s;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 1;
        }

        .peterbot-close:hover {
            background: rgba(255,255,255,0.3);
            transform: rotate(90deg);
        }

        .peterbot-messages {
            flex: 1;
            padding: 25px;
            overflow-y: auto;
            background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
        }

        .peterbot-messages::-webkit-scrollbar {
            width: 6px;
        }

        .peterbot-messages::-webkit-scrollbar-track {
            background: transparent;
        }

        .peterbot-messages::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
        }

        .peterbot-messages::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }

        .message {
            display: flex;
            margin-bottom: 20px;
            animation: messageSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes messageSlideIn {
            from { 
                opacity: 0; 
                transform: translateY(15px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }

        .message.user {
            justify-content: flex-end;
        }

        .message-avatar {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            margin-right: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 14px;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .message.user .message-avatar {
            order: 2;
            margin-right: 0;
            margin-left: 12px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .message-avatar img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }

        .message-content {
            max-width: 75%;
        }

        .message.user .message-content {
            text-align: right;
        }

        .message-bubble {
            background: white;
            padding: 15px 18px;
            border-radius: 20px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.08);
            line-height: 1.5;
            position: relative;
            border: 1px solid rgba(0,0,0,0.05);
        }

        .message.user .message-bubble {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        }

        .message-bubble::before {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border-style: solid;
        }

        .message.bot .message-bubble::before {
            left: -8px;
            top: 15px;
            border-width: 8px 8px 8px 0;
            border-color: transparent white transparent transparent;
        }

        .message.user .message-bubble::before {
            right: -8px;
            top: 15px;
            border-width: 8px 0 8px 8px;
            border-color: transparent transparent transparent #667eea;
        }

        .message-time {
            font-size: 11px;
            color: #64748b;
            margin-top: 6px;
            font-weight: 500;
        }

        .message.user .message-time {
            color: #94a3b8;
        }

        .typing-indicator .message-bubble {
            padding: 20px;
            background: white;
        }

        .typing-dots {
            display: flex;
            gap: 6px;
            align-items: center;
        }

        .typing-dots span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #667eea;
            animation: typingBounce 1.4s infinite ease-in-out;
        }

        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingBounce {
            0%, 60%, 100% { 
                transform: translateY(0); 
                opacity: 0.7;
            }
            30% { 
                transform: translateY(-12px); 
                opacity: 1;
            }
        }

        .peterbot-input {
            padding: 20px 25px;
            border-top: 1px solid #e2e8f0;
            background: white;
        }

        .input-container {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .peterbot-input input {
            flex: 1;
            padding: 14px 18px;
            border: 2px solid #e2e8f0;
            border-radius: 25px;
            outline: none;
            font-size: 14px;
            transition: all 0.3s ease;
            background: #f8fafc;
        }

        .peterbot-input input:focus {
            border-color: #667eea;
            background: white;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .send-button {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .send-button:hover:not(:disabled) {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .send-button:disabled {
            background: #cbd5e1;
            cursor: not-allowed;
            box-shadow: none;
        }

        .quick-replies {
            padding: 15px 25px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            background: white;
            border-top: 1px solid #e2e8f0;
        }

        .quick-reply {
            padding: 10px 16px;
            background: #f1f5f9;
            border: 2px solid #e2e8f0;
            border-radius: 20px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
            color: #475569;
        }

        .quick-reply:hover {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .admin-panel {
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            padding: 15px 25px;
            border-bottom: 1px solid #f3f4f6;
            font-size: 13px;
            color: #92400e;
        }

        .admin-controls {
            display: flex;
            gap: 10px;
            margin-top: 8px;
        }

        .admin-btn {
            padding: 6px 12px;
            background: rgba(255,255,255,0.9);
            color: #92400e;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            transition: all 0.2s;
        }

        .admin-btn:hover {
            background: white;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        /* Text Formatting Styles */
        .bold { 
            font-weight: 700; 
            color: #1e293b;
        }
        
        .highlight { 
            color: #667eea; 
            font-weight: 600;
        }
        
        .price { 
            color: #059669; 
            font-weight: 700;
            background: rgba(5, 150, 105, 0.1);
            padding: 2px 6px;
            border-radius: 6px;
        }
        
        .service-title { 
            color: #1e293b; 
            font-weight: 700; 
            font-size: 16px;
            display: block;
            margin-bottom: 8px;
        }

        .contact-link {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }

        .contact-link:hover {
            text-decoration: underline;
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
            .peterbot-container {
                bottom: 20px;
                right: 20px;
            }

            .peterbot-chat {
                width: calc(100vw - 40px);
                height: calc(100vh - 120px);
                right: 20px;
                bottom: 90px;
            }

            .peterbot-toggle {
                width: 60px;
                height: 60px;
                font-size: 24px;
            }

            .message-content {
                max-width: 85%;
            }

            .peterbot-header {
                padding: 15px 20px;
            }

            .peterbot-messages {
                padding: 20px;
            }

            .peterbot-input {
                padding: 15px 20px;
            }
        }

        @media (max-width: 360px) {
            .peterbot-chat {
                width: calc(100vw - 20px);
                right: 10px;
            }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .peterbot-chat {
                background: #1e293b;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            }

            .peterbot-messages {
                background: linear-gradient(180deg, #334155 0%, #1e293b 100%);
            }

            .message-bubble {
                background: #334155;
                color: #f1f5f9;
                border-color: rgba(255,255,255,0.1);
            }

            .peterbot-input {
                background: #334155;
                border-color: rgba(255,255,255,0.1);
            }

            .peterbot-input input {
                background: #475569;
                color: #f1f5f9;
                border-color: rgba(255,255,255,0.2);
            }

            .quick-replies {
                background: #334155;
                border-color: rgba(255,255,255,0.1);
            }

            .quick-reply {
                background: #475569;
                color: #f1f5f9;
                border-color: rgba(255,255,255,0.2);
            }
        }

        /* Animations for better UX */
        .peterbot-container * {
            box-sizing: border-box;
        }

        .message-bubble {
            transform-origin: left center;
        }

        .message.user .message-bubble {
            transform-origin: right center;
        }

        /* Loading states */
        .loading {
            opacity: 0.7;
            pointer-events: none;
        }

        /* Focus states for accessibility */
        .peterbot-toggle:focus,
        .peterbot-close:focus,
        .send-button:focus,
        .quick-reply:focus,
        .admin-btn:focus {
            outline: 2px solid #667eea;
            outline-offset: 2px;
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
                <button class="peterbot-toggle" id="peterbot-toggle" title="Chat with PeterBot" aria-label="Open chat">
                    💬
                </button>
                
                <div class="peterbot-chat" id="peterbot-chat" role="dialog" aria-labelledby="peterbot-title">
                    <div class="peterbot-header">
                        <div class="peterbot-header-info">
                            <img src="${PETERBOT_CONFIG.avatar}" alt="Peter Eluwade" class="peterbot-avatar" 
                                 onerror="this.style.display='none';">
                            <div>
                                <div class="peterbot-title" id="peterbot-title">${PETERBOT_CONFIG.name}</div>
                                <div class="peterbot-status" id="bot-status">
                                    <span class="status-dot"></span>
                                    Online
                                </div>
                            </div>
                        </div>
                        <button class="peterbot-close" id="peterbot-close" title="Close chat" aria-label="Close chat">×</button>
                    </div>
                    
                    <div id="admin-panel" class="admin-panel" style="display: none;">
                        <div><span class="bold">🔧 Admin Mode Active</span></div>
                        <div class="admin-controls">
                            <button class="admin-btn" onclick="window.PeterBot.exportData()">📊 Export</button>
                            <button class="admin-btn" onclick="window.PeterBot.clearData()">🗑️ Clear</button>
                            <button class="admin-btn" onclick="window.PeterBot.showAnalytics()">📈 Analytics</button>
                        </div>
                    </div>
                    
                    <div class="peterbot-messages" id="messages-container" role="log" aria-live="polite">
                        <!-- Messages will be added here -->
                    </div>
                    
                    <div class="quick-replies" id="quick-replies" style="display: none;">
                        <!-- Quick replies will be added here -->
                    </div>
                    
                    <div class="peterbot-input">
                        <div class="input-container">
                            <input type="text" id="message-input" placeholder="Type your message..." 
                                   maxlength="500" autocomplete="off" aria-label="Type your message">
                            <button class="send-button" id="send-button" title="Send message" aria-label="Send message">
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

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && chatState.isOpen) {
                closeChat();
            }
        });
    }

    // Admin Functions
    function checkAdminAccess() {
        const password = prompt('Enter admin password:');
        if (password === PETERBOT_CONFIG.adminPassword) {
            chatState.isAdmin = true;
            document.getElementById('admin-panel').style.display = 'block';
            addMessage('🔧 <span class="bold">Admin mode activated.</span> You now have access to analytics and data management.', 'bot');
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
            toggle.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            
            // Show welcome message if no messages
            if (chatState.messages.length === 0) {
                setTimeout(() => {
                    const welcomeMsg = `👋 Hello! I'm <span class="bold">${PETERBOT_CONFIG.name}</span>, Peter's professional AI assistant.<br><br>I can help you with:<br><br>💻 <span class="highlight">Web Development</span> - Custom websites & applications<br>👨‍💼 <span class="highlight">Virtual Assistant Services</span> - Business support<br>📊 <span class="highlight">Digital Marketing</span> - SEO & social media<br>🎷 <span class="highlight">Saxophone Performances</span> - Live music events<br><br>What would you like to know about?`;
                    addMessage(welcomeMsg, 'bot');
                    showQuickReplies('welcome');
                }, 800);
            }
            
            // Focus input
            setTimeout(() => {
                document.getElementById('message-input')?.focus();
            }, 400);
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
            toggle.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
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
        setTimeout(() => processResponse(message), 1000);
        
        setTimeout(() => {
            sendBtn.disabled = false;
        }, 1200);
    }

    // Add Message
    function addMessage(content, sender) {
        const container = document.getElementById('messages-container');
        if (!container) return;

        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const messageEl = document.createElement('div');
        messageEl.className = `message ${sender}`;
        
        const avatar = sender === 'bot' 
            ? `<img src="${PETERBOT_CONFIG.avatar}" alt="Peter" onerror="this.style.display='none'; this.parentNode.innerHTML='🤖';">`
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
            await new Promise(resolve => setTimeout(resolve, 1500));
            chatState.apiConnected = false; // Set to true when API is working
            statusEl.innerHTML = chatState.apiConnected ? '<span class="status-dot"></span>AI Online' : '<span class="status-dot"></span>Online';
        } catch (error) {
            chatState.apiConnected = false;
            statusEl.innerHTML = '<span class="status-dot"></span>Online';
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
                setTimeout(() => showQuickReplies(context), 600);
            }, 2000);
            
        } catch (error) {
            console.error('Response error:', error);
            hideTyping();
            addMessage('Sorry, I encountered an error. Please try again or contact Peter directly at <a href="mailto:petereluwade55@gmail.com" class="contact-link">petereluwade55@gmail.com</a>', 'bot');
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
        
        if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
            return `👋 Hello there! I'm <span class="bold">${PETERBOT_CONFIG.name}</span>, Peter's professional AI assistant. I'm here to help you learn about Peter's services and get you connected with him.<br><br>I can provide information about web development, virtual assistant services, digital marketing, and saxophone performances. What interests you most?`;
        }
        
        if (msg.includes('service') || msg.includes('what') || msg.includes('offer')) {
            return `🚀 <span class="service-title">Peter's Professional Services Portfolio:</span><br><br>

💻 <span class="bold">Web Development & Design</span><br>
• Custom responsive websites<br>
• E-commerce solutions with payment integration<br>
• Web applications & dashboards<br>
• SEO optimization & performance tuning<br>
• WordPress & CMS development<br><br>

👨‍💼 <span class="bold">Virtual Assistant Services</span><br>
• Administrative support & email management<br>
• Social media management & content creation<br>
• Data entry & research tasks<br>
• Customer service & lead generation<br>
• Project coordination & scheduling<br><br>

📊 <span class="bold">Digital Marketing Solutions</span><br>
• Social media marketing & strategy<br>
• SEO & content optimization<br>
• Email marketing campaigns<br>
• Analytics & performance reporting<br>
• Brand development & messaging<br><br>

🎷 <span class="bold">Professional Saxophone Performances</span><br>
• Wedding ceremonies: <span class="price">$55 (₦82,500)</span><br>
• Birthday celebrations: <span class="price">$45 (₦67,500)</span><br>
• Church services: <span class="price">$75 (₦112,500)</span><br>
• Corporate events: <span class="price">Custom pricing</span><br><br>

Which service would you like to explore in detail?`;
        }
        
        if (msg.includes('web') || msg.includes('website') || msg.includes('development') || msg.includes('design')) {
            return `💻 <span class="service-title">Professional Web Development Services:</span><br><br>

<span class="bold">🎨 What Peter Creates:</span><br>
• <span class="highlight">Responsive Websites</span> - Perfect on all devices<br>
• <span class="highlight">E-commerce Stores</span> - Complete online shopping solutions<br>
• <span class="highlight">Business Applications</span> - Custom functionality for your needs<br>
• <span class="highlight">Portfolio Sites</span> - Showcase your work professionally<br>
• <span class="highlight">Landing Pages</span> - High-converting marketing pages<br><br>

<span class="bold">⚡ Technologies & Skills:</span><br>
Frontend: React, HTML5, CSS3, JavaScript, Bootstrap<br>
Backend: Node.js, PHP, Python, MySQL<br>
CMS: WordPress, Custom solutions<br>
Tools: Git, Figma, Adobe Creative Suite<br><br>

<span class="bold">💰 Investment Range:</span><br>
• Basic website: <span class="price">Starting from $200</span><br>
• E-commerce store: <span class="price">Starting from $500</span><br>
• Custom application: <span class="price">Quote on consultation</span><br><br>

<span class="bold">🌐 View Peter's Work:</span><br>
Portfolio: <a href="https://peterlight123.github.io/portfolio/" target="_blank" class="contact-link">peterlight123.github.io/portfolio/</a><br><br>

<span class="bold">📞 Ready to Start Your Project?</span><br>
📧 <a href="mailto:petereluwade55@gmail.com" class="contact-link">petereluwade55@gmail.com</a><br>
📱 <a href="https://wa.me/2348108821809" target="_blank" class="contact-link">WhatsApp: +234 8108821809</a><br><br>

Let's bring your vision to life! 🚀`;
        }
        
        if (msg.includes('virtual') || msg.includes('assistant') || msg.includes('admin') || msg.includes('support')) {
            return `👨‍💼 <span class="service-title">Professional Virtual Assistant Services:</span><br><br>

<span class="bold">📋 Administrative Excellence:</span><br>
• Email management & organization<br>
• Calendar scheduling & appointment setting<br>
• Document preparation & formatting<br>
• Data entry & database management<br>
• Research & information gathering<br><br>

<span class="bold">📱 Digital Support Services:</span><br>
• Social media account management<br>
• Content creation & curation<br>
• Customer service & chat support<br>
• Lead generation & qualification<br>
• Online reputation management<br><br>

<span class="bold">💼 Business Process Support:</span><br>
• Project coordination & tracking<br>
• Invoice & payment processing<br>
• CRM management & updates<br>
• Report generation & analysis<br>
• Travel planning & coordination<br><br>

<span class="bold">💰 Service Rates:</span><br>
• Hourly rate: <span class="price">$8-15/hour</span><br>
• Monthly packages: <span class="price">$300-800</span><br>
• Project-based: <span class="price">Custom quotes</span><br><br>

<span class="bold">✅ Why Choose Peter:</span><br>
🎯 5+ years professional experience<br>
⚡ Quick turnaround & reliable delivery<br>
💬 Excellent communication skills<br>
🔒 Confidential & secure handling<br>
🌍 Available across time zones<br><br>

<span class="bold">🚀 Get Started Today:</span><br>
📧 <a href="mailto:petereluwade55@gmail.com" class="contact-link">petereluwade55@gmail.com</a><br>
📱 <a href="https://wa.me/2348108821809" target="_blank" class="contact-link">+234 8108821809</a><br><br>

Let's streamline your business operations!`;
        }
        
        if (msg.includes('marketing') || msg.includes('seo') || msg.includes('social') || msg.includes('digital')) {
            return `📊 <span class="service-title">Digital Marketing & SEO Services:</span><br><br>

<span class="bold">📱 Social Media Marketing:</span><br>
• Platform strategy (Instagram, Facebook, Twitter, LinkedIn)<br>
• Content creation & visual design<br>
• Community management & engagement<br>
• Influencer outreach & partnerships<br>
• Social media advertising campaigns<br><br>

<span class="bold">🔍 SEO & Content Optimization:</span><br>
• Keyword research & competitive analysis<br>
• On-page & technical SEO optimization<br>
• Content strategy & blog management<br>
• Local SEO for businesses<br>
• Performance tracking & reporting<br><br>

<span class="bold">📧 Email & Content Marketing:</span><br>
• Email campaign design & automation<br>
• Newsletter creation & management<br>
• Blog writing & content creation<br>
• Brand messaging & voice development<br>
• Marketing funnel optimization<br><br>

<span class="bold">💰 Marketing Investment:</span><br>
• Social media management: <span class="price">$150-400/month</span><br>
• SEO services: <span class="price">$200-600/month</span><br>
• Content creation: <span class="price">$50-200/project</span><br>
• Full marketing package: <span class="price">$500-1200/month</span><br><br>

<span class="bold">📈 Results You Can Expect:</span><br>
🎯 Increased online visibility & brand awareness<br>
📊 Higher search engine rankings<br>
💰 Better ROI on marketing investments<br>
👥 Growing engaged audience & followers<br>
🔄 Improved conversion rates<br><br>

<span class="bold">🚀 Boost Your Online Presence:</span><br>
📧 <a href="mailto:petereluwade55@gmail.com" class="contact-link">petereluwade55@gmail.com</a><br>
📱 <a href="https://wa.me/2348108821809" target="_blank" class="contact-link">WhatsApp: +234 8108821809</a>`;
        }
        
        if (msg.includes('saxophone') || msg.includes('music') || msg.includes('performance') || msg.includes('wedding') || msg.includes('event')) {
            return `🎷 <span class="service-title">Professional Saxophone Performances:</span><br><br>

<span class="bold">🎵 Event Performance Pricing:</span><br>
💒 <span class="bold">Wedding Ceremonies:</span> <span class="price">$55 USD (₦82,500)</span><br>
🎂 <span class="bold">Birthday Celebrations:</span> <span class="price">$45 USD (₦67,500)</span><br>
⛪ <span class="bold">Church Services:</span> <span class="price">$75 USD (₦112,500)</span><br>
🏢 <span class="bold">Corporate Events:</span> <span class="price">Custom pricing available</span><br>
🎉 <span class="bold">Private Parties:</span> <span class="price">Starting from $40</span><br><br>

<span class="bold">🎼 What's Included:</span><br>
• Professional sound equipment setup<br>
• 1-2 hours of live performance<br>
• Song requests (when possible)<br>
• Professional attire & presentation<br>
• Travel within Lagos & surrounding areas<br><br>

<span class="bold">🎶 Musical Styles & Repertoire:</span><br>
Jazz Standards • Gospel Hymns • Contemporary Hits<br>
Classical Pieces • Afrobeat • R&B • Soul<br>
Wedding Classics • Birthday Songs • Custom Requests<br><br>

<span class="bold">📱 Follow @peterphonist:</span><br>
🎬 <a href="#" class="contact-link">YouTube</a> - Full performances & covers<br>
📸 <a href="#" class="contact-link">Instagram</a> - Behind the scenes content<br>
🎵 <a href="#" class="contact-link">TikTok</a> - Short performance clips<br>
📘 <a href="#" class="contact-link">Facebook</a> - Event updates & bookings<br><br>

<span class="bold">🎯 Perfect For:</span><br>
✨ Creating magical wedding moments<br>
🎊 Adding elegance to celebrations<br>
🙏 Enhancing worship experiences<br>
💼 Impressing at corporate functions<br><br>

<span class="bold">📅 Book Your Performance:</span><br>
📱 <a href="https://wa.me/2348108821809" target="_blank" class="contact-link">WhatsApp: +234 8108821809</a><br>
📧 <a href="mailto:petereluwade55@gmail.com" class="contact-link">petereluwade55@gmail.com</a><br><br>

Make your event unforgettable with live saxophone magic! ✨`;
        }
        
        if (msg.includes('payment') || msg.includes('pay') || msg.includes('crypto') || msg.includes('bank') || msg.includes('money')) {
            return `💳 <span class="service-title">Secure Payment Methods:</span><br><br>

<span class="bold">🪙 Cryptocurrency (Preferred & Fastest):</span><br>
• <span class="highlight">Bitcoin (BTC)</span> - Most secure option<br>
• <span class="highlight">Ethereum (ETH)</span> - Smart contract payments<br>
• <span class="highlight">USDT (Tether)</span> - Stable value option<br>
• <span class="highlight">Other major coins</span> - Upon request<br><br>

<span class="bold">🏦 Traditional Banking:</span><br>
• <span class="bold">Bank:</span> Zenith Bank Nigeria<br>
• <span class="bold">Account Number:</span> 4291620354<br>
• <span class="bold">Account Name:</span> Eluwade Peter Toluwanimi<br>
• <span class="bold">Swift Code:</span> Available on request<br><br>

<span class="bold">💰 Payment Process & Terms:</span><br>
1. <span class="highlight">Project Discussion</span> - Free consultation<br>
2. <span class="highlight">Quote & Agreement</span> - Detailed proposal<br>
3. <span class="highlight">50% Deposit</span> - To commence work<br>
4. <span class="highlight">Progress Updates</span> - Regular communication<br>
5. <span class="highlight">Final Payment</span> - Upon completion & approval<br><br>

<span class="bold">🌍 Accepted Currencies:</span><br>
💵 USD (US Dollars) • 🇳🇬 NGN (Nigerian Naira)<br>
💶 EUR (Euros) • 🪙 Major Cryptocurrencies<br><br>

<span class="bold">🔒 Security & Trust:</span><br>
✅ All transactions are secure & verified<br>
✅ Payment receipts provided<br>
✅ Escrow services available for large projects<br>
✅ Transparent pricing with no hidden fees<br><br>

<span class="bold">❓ Payment Questions?</span><br>
📧 <a href="mailto:petereluwade55@gmail.com" class="contact-link">petereluwade55@gmail.com</a><br>
📱 <a href="https://wa.me/2348108821809" target="_blank" class="contact-link">WhatsApp: +234 8108821809</a><br><br>

Ready to get started? Let's discuss your project! 🚀`;
        }
        
        if (msg.includes('contact') || msg.includes('reach') || msg.includes('phone') || msg.includes('email') || msg.includes('connect')) {
            return `📞 <span class="service-title">Connect with Peter Eluwade:</span><br><br>

<span class="bold">🎯 Primary Contact Methods:</span><br>
📧 <span class="bold">Email:</span> <a href="mailto:petereluwade55@gmail.com" class="contact-link">petereluwade55@gmail.com</a><br>
📱 <span class="bold">WhatsApp:</span> <a href="https://wa.me/2348108821809" target="_blank" class="contact-link">+234 8108821809</a><br>
💬 <span class="bold">Telegram:</span> @peterlightspeed<br>
📞 <span class="bold">Phone:</span> +234 8108821809<br><br>

<span class="bold">🌐 Professional Profiles:</span><br>
💼 <span class="bold">Portfolio Website:</span><br>
<a href="https://peterlight123.github.io/portfolio/" target="_blank" class="contact-link">peterlight123.github.io/portfolio/</a><br><br>
🔗 <span class="bold">LinkedIn:</span> Professional networking<br>
📄 <span class="bold">Resume/CV:</span> Available upon request<br>
💻 <span class="bold">GitHub:</span> Code repositories & projects<br><br>

<span class="bold">🎵 Music & Social Media (@peterphonist):</span><br>
🎬 <span class="bold">YouTube:</span> Full saxophone performances<br>
📸 <span class="bold">Instagram:</span> Daily updates & behind-the-scenes<br>
📘 <span class="bold">Facebook:</span> Event announcements & bookings<br>
🎵 <span class="bold">TikTok:</span> Short performance videos<br>
🐦 <span class="bold">Twitter:</span> Professional updates & insights<br><br>

<span class="bold">⏰ Response Times:</span><br>
• <span class="highlight">WhatsApp:</span> 2-6 hours (fastest)<br>
• <span class="highlight">Email:</span> Within 24 hours<br>
• <span class="highlight">Social Media:</span> Within 12 hours<br>
• <span class="highlight">Phone Calls:</span> By appointment<br><br>

<span class="bold">🌍 Availability:</span><br>
📅 Monday - Saturday: 8 AM - 10 PM (WAT)<br>
📅 Sunday: 2 PM - 8 PM (WAT)<br>
🌐 Available for international clients across time zones<br><br>

<span class="bold">💬 Preferred Contact Method:</span><br>
For quick responses: <a href="https://wa.me/2348108821809" target="_blank" class="contact-link">WhatsApp</a><br>
For detailed inquiries: <a href="mailto:petereluwade55@gmail.com" class="contact-link">Email</a><br><br>

Ready to start your project? Let's connect! 🚀`;
        }
        
        if (msg.includes('price') || msg.includes('cost') || msg.includes('rate') || msg.includes('pricing') || msg.includes('budget')) {
            return `💰 <span class="service-title">Complete Pricing Guide:</span><br><br>

<span class="bold">🎷 Saxophone Performance Rates:</span><br>
• Wedding ceremonies: <span class="price">$55 (₦82,500)</span><br>
• Birthday celebrations: <span class="price">$45 (₦67,500)</span><br>
• Church services: <span class="price">$75 (₦112,500)</span><br>
• Corporate events: <span class="price">$60-100</span><br>
• Private parties: <span class="price">$40-60</span><br><br>

<span class="bold">💻 Web Development Pricing:</span><br>
• Basic business website: <span class="price">$200-500</span><br>
• E-commerce store: <span class="price">$500-1,500</span><br>
• Custom web application: <span class="price">$800-3,000</span><br>
• WordPress site: <span class="price">$150-400</span><br>
• Landing page: <span class="price">$100-300</span><br><br>

<span class="bold">👨‍💼 Virtual Assistant Services:</span><br>
• Hourly rate: <span class="price">$8-15/hour</span><br>
• Part-time (20hrs/week): <span class="price">$300-500/month</span><br>
• Full-time (40hrs/week): <span class="price">$600-1,000/month</span><br>
• Project-based tasks: <span class="price">$25-200/project</span><br><br>

<span class="bold">📊 Digital Marketing Packages:</span><br>
• Social media management: <span class="price">$150-400/month</span><br>
• SEO optimization: <span class="price">$200-600/month</span><br>
• Content creation: <span class="price">$50-200/project</span><br>
• Complete marketing suite: <span class="price">$500-1,200/month</span><br><br>

<span class="bold">💳 Payment Options & Terms:</span><br>
🪙 Cryptocurrency (Bitcoin, ETH, USDT) - Preferred<br>
🏦 Bank transfer (Zenith Bank)<br>
💰 50% deposit, 50% on completion<br>
🔒 Secure & transparent transactions<br><br>

<span class="bold">🎯 Custom Quotes Available For:</span><br>
• Large-scale projects<br>
• Long-term partnerships<br>
• Multiple service combinations<br>
• Enterprise solutions<br><br>

<span class="bold">📞 Get Your Custom Quote:</span><br>
📧 <a href="mailto:petereluwade55@gmail.com" class="contact-link">petereluwade55@gmail.com</a><br>
📱 <a href="https://wa.me/2348108821809" target="_blank" class="contact-link">+234 8108821809</a><br><br>

All prices are competitive and negotiable based on project scope! 💼`;
        }
        
        if (msg.includes('portfolio') || msg.includes('work') || msg.includes('example') || msg.includes('sample')) {
            return `🌐 <span class="service-title">Peter's Professional Portfolio:</span><br><br>

<span class="bold">🔗 Main Portfolio Website:</span><br>
<a href="https://peterlight123.github.io/portfolio/" target="_blank" class="contact-link">https://peterlight123.github.io/portfolio/</a><br><br>

<span class="bold">💻 What You'll Discover:</span><br>
✅ <span class="bold">Live Project Demos</span> - Interactive examples<br>
✅ <span class="bold">Code Samples</span> - Technical expertise showcase<br>
✅ <span class="bold">Client Testimonials</span> - Real feedback & reviews<br>
✅ <span class="bold">Service Breakdowns</span> - Detailed offerings<br>
✅ <span class="bold">Pricing Information</span> - Transparent costs<br>
✅ <span class="bold">Contact Forms</span> - Easy project inquiries<br><br>

<span class="bold">🚀 Featured Web Projects:</span><br>
• Responsive business websites with modern design<br>
• E-commerce platforms with payment integration<br>
• Portfolio sites for creative professionals<br>
• Custom web applications & dashboards<br>
• WordPress sites with custom themes<br><br>

<span class="bold">🎵 Music Portfolio Highlights:</span><br>
🎬 <span class="bold">YouTube (@peterphonist):</span><br>
• Wedding ceremony performances<br>
• Gospel & contemporary covers<br>
• Jazz standards & improvisation<br>
• Behind-the-scenes content<br><br>

📸 <span class="bold">Instagram (@peterphonist):</span><br>
• Performance photos & videos<br>
• Event highlights & testimonials<br>
• Practice sessions & tutorials<br>
• Client appreciation posts<br><br>

<span class="bold">💼 Professional Experience:</span><br>
🎯 <span class="highlight">5+ years</span> in web development<br>
👥 <span class="highlight">100+ satisfied clients</span> worldwide<br>
🏆 <span class="highlight">50+ successful projects</span> completed<br>
🎷 <span class="highlight">200+ live performances</span> delivered<br>
⭐ <span class="highlight">4.9/5 average rating</span> from clients<br><br>

<span class="bold">🔧 Technical Skills Showcase:</span><br>
Frontend: React, Vue.js, HTML5, CSS3, JavaScript<br>
Backend: Node.js, PHP, Python, MySQL, MongoDB<br>
Tools: Git, Docker, AWS, Figma, Adobe Suite<br><br>

<span class="bold">📱 Quick Portfolio Access:</span><br>
💻 Desktop version: Full interactive experience<br>
📱 Mobile optimized: Perfect for on-the-go viewing<br>
⚡ Fast loading: Optimized for all connections<br><br>

<span class="bold">🎯 Ready to See More?</span><br>
Visit the portfolio and let's discuss your project!<br><br>

📧 <a href="mailto:petereluwade55@gmail.com" class="contact-link">petereluwade55@gmail.com</a><br>
📱 <a href="https://wa.me/2348108821809" target="_blank" class="contact-link">WhatsApp: +234 8108821809</a>`;
        }
        
        // Default responses for unmatched queries
        const defaultResponses = [
            `Thanks for reaching out! 🙋‍♂️ I'm here to help you learn about Peter's services:<br><br>💻 <span class="highlight">Web Development</span> - Custom websites & applications<br>👨‍💼 <span class="highlight">Virtual Assistant</span> - Business support services<br>📊 <span class="highlight">Digital Marketing</span> - SEO & social media<br>🎷 <span class="highlight">Saxophone Performances</span> - Live music events<br><br>What would you like to know more about?`,
            
            `Hello! 👋 I can provide detailed information about Peter's professional services, pricing, portfolio examples, or help you get in touch directly.<br><br>🌐 Check out his portfolio: <a href="https://peterlight123.github.io/portfolio/" target="_blank" class="contact-link">peterlight123.github.io/portfolio/</a><br><br>What specific service interests you most?`,
            
            `Hi there! 🌟 Whether you need a stunning website, reliable business support, effective marketing, or beautiful live music, Peter has the expertise to help.<br><br>💬 I'm here to answer questions and connect you with the right solution. What can I help you with today?`
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
                <img src="${PETERBOT_CONFIG.avatar}" alt="Peter" 
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
        setTimeout(() => processResponse(reply), 500);
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
        
        if (msg.includes('pricing') || msg.includes('rate') || msg.includes('budget')) {
            return 'pricing';
        }
        
        return 'welcome';
    }

    // Scroll to Bottom
    function scrollToBottom() {
        const container = document.getElementById('messages-container');
        if (container) {
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 100);
        }
    }

    // Admin Functions
    function exportData() {
        if (!chatState.isAdmin) return;
        
        const data = {
            messages: chatState.messages,
            analytics: chatState.analytics,
            exportDate: new Date().toISOString(),
            version: PETERBOT_CONFIG.version,
            totalMessages: chatState.messages.length,
            botInfo: {
                name: PETERBOT_CONFIG.name,
                version: PETERBOT_CONFIG.version
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `peterbot-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        addMessage('📊 <span class="bold">Data exported successfully!</span> Download should start automatically.', 'bot');
    }

    function clearData() {
        if (!chatState.isAdmin) return;
        
        if (confirm('⚠️ Are you sure you want to clear all chat data? This action cannot be undone.')) {
            localStorage.removeItem(PETERBOT_CONFIG.storageKey);
            chatState.messages = [];
            chatState.analytics = {
                totalChats: 0,
                commonQuestions: {},
                userFeedback: []
            };
            
            document.getElementById('messages-container').innerHTML = '';
            addMessage('🗑️ <span class="bold">All data cleared successfully!</span> Chat history and analytics have been reset.', 'bot');
            saveToStorage();
        }
    }

    function showAnalytics() {
        if (!chatState.isAdmin) return;
        
        const analytics = chatState.analytics;
        const topQuestions = Object.entries(analytics.commonQuestions)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([q, count]) => `• ${q.substring(0, 50)}... (${count} times)`)
            .join('<br>');
        
        const dataSize = (JSON.stringify(chatState).length / 1024).toFixed(2);
        const avgMessagesPerChat = chatState.analytics.totalChats > 0 
            ? (chatState.messages.length / chatState.analytics.totalChats).toFixed(1) 
            : 0;
        
        const analyticsMsg = `
            📊 <span class="service-title">PeterBot Analytics Dashboard</span><br><br>
            
            <span class="bold">📈 Usage Statistics:</span><br>
            • Total conversations: <span class="highlight">${analytics.totalChats}</span><br>
            • Total messages: <span class="highlight">${chatState.messages.length}</span><br>
            • Average messages per chat: <span class="highlight">${avgMessagesPerChat}</span><br>
            • Data storage used: <span class="highlight">${dataSize} KB</span><br><br>
            
            <span class="bold">🔥 Most Asked Questions:</span><br>
            ${topQuestions || '<span class="highlight">No data available yet</span>'}<br><br>
            
            <span class="bold">⚡ System Information:</span><br>
            • Bot version: <span class="highlight">${PETERBOT_CONFIG.version}</span><br>
            • API status: <span class="highlight">${chatState.apiConnected ? 'Connected' : 'Offline'}</span><br>
            • Admin mode: <span class="highlight">Active</span><br>
            • Last updated: <span class="highlight">${new Date().toLocaleString()}</span><br><br>
            
            <span class="bold">💾 Data Management:</span><br>
            Use the admin controls to export or clear data as needed.
        `;
        
        addMessage(analyticsMsg, 'bot');
    }

    // Create Fallback Bot (if main bot fails to load)
    function createFallbackBot() {
        console.log('Creating fallback contact button...');
        
        const fallbackHTML = `
        <div class="peterbot-container">
            <button class="peterbot-toggle" onclick="window.open('https://wa.me/2348108821809', '_blank')" 
                    title="Contact Peter on WhatsApp" style="background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);">
                📱
            </button>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', fallbackHTML);
    }

    // Error Handler
    function handleError(error, context = 'general') {
        console.error(`PeterBot Error (${context}):`, error);
        
        if (context === 'initialization') {
            createFallbackBot();
        }
    }

    // Initialize when DOM is ready
    function initializeBot() {
        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initPeterBot);
            } else {
                initPeterBot();
            }
        } catch (error) {
            handleError(error, 'initialization');
        }
    }

    // Initialize the bot
    initializeBot();

    // Global API for external access
    window.PeterBot = {
        // Core functions
        init: initPeterBot,
        open: () => {
            if (!chatState.isOpen) toggleChat();
        },
        close: closeChat,
        
        // Messaging
        send: (message) => {
            if (!chatState.isOpen) toggleChat();
            setTimeout(() => {
                const input = document.getElementById('message-input');
                if (input) {
                    input.value = message;
                    sendMessage();
                }
            }, 300);
        },
        
        // Admin functions
        exportData: exportData,
        clearData: clearData,
        showAnalytics: showAnalytics,
        
        // Configuration & state
        config: PETERBOT_CONFIG,
        state: chatState,
        version: '4.0',
        
        // Utility functions
        isOpen: () => chatState.isOpen,
        isAdmin: () => chatState.isAdmin,
        getMessageCount: () => chatState.messages.length,
        
        // Quick actions
        showServices: () => {
            if (!chatState.isOpen) toggleChat();
            setTimeout(() => processResponse('services'), 500);
        },
        showPricing: () => {
            if (!chatState.isOpen) toggleChat();
            setTimeout(() => processResponse('pricing'), 500);
        },
        showContact: () => {
            if (!chatState.isOpen) toggleChat();
            setTimeout(() => processResponse('contact'), 500);
        },
        showPortfolio: () => {
            if (!chatState.isOpen) toggleChat();
            setTimeout(() => processResponse('portfolio'), 500);
        }
    };

    // Console welcome message
    console.log(`
    🚀 PeterBot Professional v4.0 Loaded Successfully!
    
    ✨ Features:
    • Professional styling with Peter's image
    • Complete admin system with data storage
    • Comprehensive service information
    • Mobile-responsive design
    • Dark mode support
    • Analytics tracking
    
    🔧 Admin Access:
    • Press Ctrl+Shift+A while chat is open
    • Password: peter2024admin
    
    💻 Global API Available:
    • PeterBot.open() - Open chat
    • PeterBot.send('message') - Send message
    • PeterBot.showServices() - Show services
    • PeterBot.exportData() - Export data (admin)
    
    📱 Contact Peter:
    • Email: petereluwade55@gmail.com
    • WhatsApp: +234 8108821809
    • Portfolio: https://peterlight123.github.io/portfolio/
    `);

})();

// Auto-initialize when script loads
console.log('✅ PeterBot Professional v4.0 script loaded and ready!');

