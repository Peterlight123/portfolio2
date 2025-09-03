// PeterBot Professional v4.0 - Fixed Version
(function() {
    'use strict';

    // Configuration - Fixed syntax error
    const PETERBOT_CONFIG = {
        name: 'PeterBot',
        version: '4.0',
        avatar: 'https://i.imgur.com/5Eu01Tk.jpeg',
        apiKey: 'AIzaSyB03WLfMuQIz8iZjwu6sebdtwfXXjXG-Qw',
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

    // Storage Functions
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

    // Professional CSS Styles
    const styles = `
        .peterbot-container {
            position: fixed;
            bottom: 25px;
            right: 25px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
        }

        .peterbot-toggle:hover {
            transform: scale(1.1) translateY(-2px);
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6);
        }

        .peterbot-chat {
            position: absolute;
            bottom: 90px;
            right: 0;
            width: 380px;
            height: 550px;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            display: none;
            flex-direction: column;
            overflow: hidden;
            animation: chatSlideUp 0.4s ease-out;
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
        }

        .peterbot-header-info {
            display: flex;
            align-items: center;
            gap: 15px;
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
        }

        .peterbot-messages::-webkit-scrollbar {
            width: 6px;
        }

        .peterbot-messages::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
        }

        .message {
            display: flex;
            margin-bottom: 20px;
            animation: messageSlideIn 0.4s ease-out;
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
        }

        .message.user .message-bubble {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .message-time {
            font-size: 11px;
            color: #64748b;
            margin-top: 6px;
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
        }

        .send-button:hover:not(:disabled) {
            transform: scale(1.05);
        }

        .send-button:disabled {
            background: #cbd5e1;
            cursor: not-allowed;
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
            transform: translateY(-2px);
        }

        .admin-panel {
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            padding: 15px 25px;
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
        }

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

        @media (max-width: 480px) {
            .peterbot-chat {
                width: calc(100vw - 40px);
                height: calc(100vh - 120px);
                right: 20px;
            }
            
            .message-content {
                max-width: 85%;
            }
        }
    `;

    // Initialize PeterBot
    function initPeterBot() {
        console.log('🚀 Initializing PeterBot Professional v4.0...');
        
        try {
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
            
            // Setup event listeners
            setupEventListeners();
            
            console.log('✅ PeterBot initialized successfully');
        } catch (error) {
            console.error('❌ PeterBot initialization failed:', error);
            createFallbackBot();
        }
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
                            <img src="${PETERBOT_CONFIG.avatar}" alt="Peter Eluwade" class="peterbot-avatar" 
                                 onerror="this.style.display='none';">
                            <div>
                                <div class="peterbot-title">${PETERBOT_CONFIG.name}</div>
                                <div class="peterbot-status">
                                    <span class="status-dot"></span>
                                    Online
                                </div>
                            </div>
                        </div>
                        <button class="peterbot-close" id="peterbot-close">×</button>
                    </div>
                    
                    <div id="admin-panel" class="admin-panel" style="display: none;">
                        <div><span class="bold">🔧 Admin Mode Active</span></div>
                        <div class="admin-controls">
                            <button class="admin-btn" onclick="window.PeterBot.exportData()">📊 Export</button>
                            <button class="admin-btn" onclick="window.PeterBot.clearData()">🗑️ Clear</button>
                            <button class="admin-btn" onclick="window.PeterBot.showAnalytics()">📈 Analytics</button>
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
                            <input type="text" id="message-input" placeholder="Type your message..." maxlength="500">
                            <button class="send-button" id="send-button">➤</button>
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

        if (toggle) toggle.addEventListener('click', toggleChat);
        if (close) close.addEventListener('click', closeChat);
        if (sendBtn) sendBtn.addEventListener('click', sendMessage);
        
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                }
            });

            // Admin access
            input.addEventListener('keydown', function(e) {
                if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                    checkAdminAccess();
                }
            });
        }
    }

    // Admin Functions
    function checkAdminAccess() {
        const password = prompt('Enter admin password:');
        if (password === PETERBOT_CONFIG.adminPassword) {
            chatState.isAdmin = true;
            const adminPanel = document.getElementById('admin-panel');
            if (adminPanel) adminPanel.style.display = 'block';
            addMessage('🔧 <span class="bold">Admin mode activated.</span>', 'bot');
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
                setTimeout(function() {
                    const welcomeMsg = `👋 Hello! I'm <span class="bold">${PETERBOT_CONFIG.name}</span>, Peter's AI assistant.<br><br>I can help you with:<br><br>💻 <span class="highlight">Web Development</span><br>👨‍💼 <span class="highlight">Virtual Assistant Services</span><br>📊 <span class="highlight">Digital Marketing</span><br>🎷 <span class="highlight">Saxophone Performances</span><br><br>What would you like to know?`;
                    addMessage(welcomeMsg, 'bot');
                    showQuickReplies('welcome');
                }, 800);
            }
            
            // Focus input
            setTimeout(function() {
                const input = document.getElementById('message-input');
                if (input) input.focus();
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
        setTimeout(function() {
            processResponse(message);
        }, 1000);
        
        setTimeout(function() {
            sendBtn.disabled = false;
        }, 1200);
    }

    // Add Message
    function addMessage(content, sender) {
        const container = document.getElementById('messages-container');
        if (!container) return;

        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const messageEl = document.createElement('div');
        messageEl.className = 'message ' + sender;
        
        const avatar = sender === 'bot' 
            ? '<img src="' + PETERBOT_CONFIG.avatar + '" alt="Peter" onerror="this.style.display=\'none\'; this.parentNode.innerHTML=\'🤖\';">'
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

    // Process Response
    function processResponse(message) {
        showTyping();
        
        setTimeout(function() {
            hideTyping();
            const response = getRuleBasedResponse(message);
            addMessage(response, 'bot');
            
            // Show contextual quick replies
            const context = getContext(message);
            setTimeout(function() {
                showQuickReplies(context);
            }, 600);
        }, 2000);
    }

    // Rule-based Response
    function getRuleBasedResponse(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
            return `👋 Hello! I'm <span class="bold">${PETERBOT_CONFIG.name}</span>, Peter's AI assistant. I can help you learn about his professional services. What interests you?`;
        }
        
        if (msg.includes('service') || msg.includes('what') || msg.includes('offer')) {
            return `🚀 <span class="service-title">Peter's Professional Services:</span><br><br>💻 <span class="bold">Web Development</span> - Custom websites & applications<br>👨‍💼 <span class="bold">Virtual Assistant</span> - Business support services<br>📊 <span class="bold">Digital Marketing</span> - SEO & social media<br>🎷 <span class="bold">Saxophone Performances</span> - Live music events<br><br>Which service interests you most?`;
        }
        
        if (msg.includes('web') || msg.includes('website') || msg.includes('development')) {
            return `💻 <span class="service-title">Web Development Services:</span><br><br><span class="bold">What Peter Creates:</span><br>• Responsive websites<br>• E-commerce stores<br>• Custom applications<br>• Portfolio sites<br><br><span class="bold">Pricing:</span><br>• Basic website: <span class="price">$200-500</span><br>• E-commerce: <span class="price">$500-1,500</span><br>• Custom app: <span class="price">$800-3,000</span><br><br><span class="bold">Portfolio:</span> <a href="https://peterlight123.github.io/portfolio/" target="_blank" class="contact-link">View Examples</a>`;
        }
        
        if (msg.includes('contact') || msg.includes('reach') || msg.includes('phone') || msg.includes('email')) {
            return `📞 <span class="service-title">Contact Peter:</span><br><br>📧 <span class="bold">Email:</span> <a href="mailto:petereluwade55@gmail.com" class="contact-link">petereluwade55@gmail.com</a><br>📱 <span class="bold">WhatsApp:</span> <a href="https://wa.me/2348108821809" target="_blank" class="contact-link">+234 8108821809</a><br>🌐 <span class="bold">Portfolio:</span> <a href="https://peterlight123.github.io/portfolio/" target="_blank" class="contact-link">peterlight123.github.io/portfolio/</a><br><br><span class="bold">Response Time:</span> Within 2-6 hours`;
        }
        
        if (msg.includes('price') || msg.includes('cost') || msg.includes('pricing')) {
            return `💰 <span class="service-title">Pricing Overview:</span><br><br><span class="bold">🎷 Saxophone:</span><br>• Weddings: <span class="price">$55</span><br>• Birthdays: <span class="price">$45</span><br>• Church: <span class="price">$75</span><br><br><span class="bold">💻 Web Development:</span><br>• Basic site: <span class="price">$200-500</span><br>• E-commerce: <span class="price">$500-1,500</span><br><br><span class="bold">👨‍💼 Virtual Assistant:</span><br>• Hourly: <span class="price">$8-15/hour</span><br>• Monthly: <span class="price">$300-800</span>`;
        }
        
        // Default response
        return `Thanks for reaching out! I can help you learn about Peter's services:<br><br>💻 <span class="highlight">Web Development</span><br>👨‍💼 <span class="highlight">Virtual Assistant</span><br>📊 <span class="highlight">Digital Marketing</span><br>🎷 <span class="highlight">Saxophone Performances</span><br><br>What would you like to know more about?`;
    }

    // Show/Hide Typing
    function showTyping() {
        if (chatState.isTyping) return;
        
        chatState.isTyping = true;
        const container = document.getElementById('messages-container');
        
        const typingEl = document.createElement('div');
        typingEl.className = 'message bot typing-indicator';
        typingEl.id = 'typing-indicator';
        typingEl.innerHTML = `
            <div class="message-avatar">
                <img src="${PETERBOT_CONFIG.avatar}" alt="Peter" onerror="this.style.display='none'; this.parentNode.innerHTML='🤖';">
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
        
        if (container) container.appendChild(typingEl);
        scrollToBottom();
    }

    function hideTyping() {
        chatState.isTyping = false;
        const typingEl = document.getElementById('typing-indicator');
        if (typingEl) typingEl.remove();
    }

    // Quick Replies
    function showQuickReplies(context) {
        const container = document.getElementById('quick-replies');
        if (!container) return;
        
        const replies = QUICK_REPLIES[context] || QUICK_REPLIES.welcome;
        
        container.innerHTML = '';
        container.style.display = 'flex';
        
        replies.forEach(function(reply) {
            const btn = document.createElement('button');
            btn.className = 'quick-reply';
            btn.textContent = reply;
            btn.addEventListener('click', function() {
                handleQuickReply(reply);
            });
            container.appendChild(btn);
        });
    }

    function hideQuickReplies() {
        const container = document.getElementById('quick-replies');
        if (container) {
            container.style.display = 'none';
        }
    }

    function handleQuickReply(reply) {
        addMessage(reply, 'user');
        hideQuickReplies();
        setTimeout(function() {
            processResponse(reply);
        }, 500);
    }

    function getContext(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('contact') || msg.includes('reach')) {
            return 'contact';
        }
        
        if (msg.includes('price') || msg.includes('cost')) {
            return 'pricing';
        }
        
        return 'welcome';
    }

    // Scroll to Bottom
    function scrollToBottom() {
        const container = document.getElementById('messages-container');
        if (container) {
            setTimeout(function() {
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
            version: PETERBOT_CONFIG.version
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
        
        addMessage('📊 <span class="bold">Data exported successfully!</span>', 'bot');
    }

    function clearData() {
        if (!chatState.isAdmin) return;
        
        if (confirm('⚠️ Clear all chat data? This cannot be undone.')) {
            localStorage.removeItem(PETERBOT_CONFIG.storageKey);
            chatState.messages = [];
            chatState.analytics = {
                totalChats: 0,
                commonQuestions: {},
                userFeedback: []
            };
            
            document.getElementById('messages-container').innerHTML = '';
            addMessage('🗑️ <span class="bold">All data cleared!</span>', 'bot');
            saveToStorage();
        }
    }

    function showAnalytics() {
        if (!chatState.isAdmin) return;
        
        const analytics = chatState.analytics;
        const topQuestions = Object.entries(analytics.commonQuestions)
            .sort(function(a, b) { return b[1] - a[1]; })
            .slice(0, 5)
            .map(function(item) { 
                return '• ' + item[0].substring(0, 30) + '... (' + item[1] + ' times)'; 
            })
            .join('<br>');
        
        const analyticsMsg = `
            📊 <span class="service-title">Analytics Dashboard</span><br><br>
            <span class="bold">Usage Stats:</span><br>
            • Total chats: <span class="highlight">${analytics.totalChats}</span><br>
            • Total messages: <span class="highlight">${chatState.messages.length}</span><br><br>
            <span class="bold">Top Questions:</span><br>
            ${topQuestions || 'No data yet'}<br><br>
            <span class="bold">System:</span><br>
            • Version: <span class="highlight">${PETERBOT_CONFIG.version}</span><br>
            • Status: <span class="highlight">Active</span>
        `;
        
        addMessage(analyticsMsg, 'bot');
    }

    // Fallback Bot
    function createFallbackBot() {
        console.log('Creating fallback contact button...');
        
        const fallbackHTML = `
        <div class="peterbot-container">
            <button class="peterbot-toggle" onclick="window.open('https://wa.me/2348108821809', '_blank')" 
                    title="Contact Peter on WhatsApp" 
                    style="background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);">
                📱
            </button>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', fallbackHTML);
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
            console.error('PeterBot initialization error:', error);
            createFallbackBot();
        }
    }

    // Global API
    window.PeterBot = {
        init: initPeterBot,
        open: function() {
            if (!chatState.isOpen) toggleChat();
        },
        close: closeChat,
        send: function(message) {
            if (!chatState.isOpen) toggleChat();
            setTimeout(function() {
                const input = document.getElementById('message-input');
                if (input) {
                    input.value = message;
                    sendMessage();
                }
            }, 300);
        },
        exportData: exportData,
        clearData: clearData,
        showAnalytics: showAnalytics,
        config: PETERBOT_CONFIG,
        state: chatState,
        version: '4.0',
        isOpen: function() { return chatState.isOpen; },
        isAdmin: function() { return chatState.isAdmin; },
        getMessageCount: function() { return chatState.messages.length; },
        showServices: function() {
            if (!chatState.isOpen) toggleChat();
            setTimeout(function() { processResponse('services'); }, 500);
        },
        showPricing: function() {
            if (!chatState.isOpen) toggleChat();
            setTimeout(function() { processResponse('pricing'); }, 500);
        },
        showContact: function() {
            if (!chatState.isOpen) toggleChat();
            setTimeout(function() { processResponse('contact'); }, 500);
        }
    };

    // Initialize the bot
    initializeBot();

    // Console message
    console.log(`
    🚀 PeterBot Professional v4.0 Loaded!
    
    ✨ Features:
    • Professional styling with Peter's image
    • Admin system (Ctrl+Shift+A, password: peter2024admin)
    • Complete service information
    • Mobile responsive design
    • Analytics tracking
    
    💻 API Available:
    • PeterBot.open() - Open chat
    • PeterBot.send('message') - Send message
    • PeterBot.showServices() - Show services
    
    📱 Contact Peter:
    • Email: petereluwade55@gmail.com
    • WhatsApp: +234 8108821809
    • Portfolio: https://peterlight123.github.io/portfolio/
    `);

})();

console.log('✅ PeterBot Professional v4.0 script loaded successfully!');

