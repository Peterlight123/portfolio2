// PeterBot - Professional Enhanced Chatbot Script v3.0
/* jshint esversion: 11, unused: false */
console.log('Loading Professional PeterBot v3.0...');

// Bot configuration with API integration
const BOT_CONFIG = {
    name: 'PeterBot',
    avatar: 'https://i.imgur.com/5Eu01Tk.jpeg',
    welcomeMessage: "👋 Hello! I'm **PeterBot**, Peter's AI assistant. I can help you with web development, virtual assistant services, digital marketing, and saxophone performances! How can I assist you today?",
    responseDelay: 800,
    showTypingIndicator: true,
    showQuickReplies: true,
    version: '3.0',
    apiKey: '', // Will be set from admin panel
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    useAI: false, // Toggle AI responses
    theme: {
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        accentColor: '#4CAF50',
        backgroundColor: '#f8f9fa',
        textColor: '#333333'
    }
};

// Admin Panel Configuration
const ADMIN_CONFIG = {
    isAuthenticated: false,
    password: 'peterbot2024', // Change this password
    sessionTimeout: 3600000 // 1 hour
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
let adminPanel = null;

// Initialize bot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Professional PeterBot...');
    initializeBot();
    createAdminPanel();
});

// Initialize the chatbot
function initializeBot() {
    try {
        console.log('Initializing Professional PeterBot v3.0...');
        
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
        
        console.log('Professional PeterBot v3.0 initialized successfully');
    } catch (error) {
        console.error('Error initializing PeterBot:', error);
    }
}

// Create Professional Admin Panel
function createAdminPanel() {
    const adminHTML = `
        <div id="peterbot-admin-panel" class="admin-panel" style="display: none;">
            <div class="admin-overlay"></div>
            <div class="admin-container">
                <div class="admin-header">
                    <h2><strong>🛠️ PeterBot Admin Panel</strong></h2>
                    <button id="admin-close" class="admin-close">×</button>
                </div>
                
                <div class="admin-content">
                    <!-- Login Section -->
                    <div id="admin-login" class="admin-section">
                        <div class="login-form">
                            <h3><strong>🔐 Admin Authentication</strong></h3>
                            <input type="password" id="admin-password" placeholder="Enter admin password" class="admin-input">
                            <button id="admin-login-btn" class="admin-btn primary">Login</button>
                            <div id="login-error" class="error-message"></div>
                        </div>
                    </div>
                    
                    <!-- Main Admin Interface -->
                    <div id="admin-interface" class="admin-section" style="display: none;">
                        <div class="admin-tabs">
                            <button class="tab-btn active" data-tab="general">General Settings</button>
                            <button class="tab-btn" data-tab="api">API Configuration</button>
                            <button class="tab-btn" data-tab="appearance">Appearance</button>
                            <button class="tab-btn" data-tab="analytics">Analytics</button>
                            <button class="tab-btn" data-tab="export">Export/Import</button>
                        </div>
                        
                        <!-- General Settings Tab -->
                        <div id="tab-general" class="tab-content active">
                            <h3><strong>⚙️ General Configuration</strong></h3>
                            <div class="form-group">
                                <label><strong>Bot Name:</strong></label>
                                <input type="text" id="bot-name" class="admin-input" value="${BOT_CONFIG.name}">
                            </div>
                            <div class="form-group">
                                <label><strong>Bot Avatar URL:</strong></label>
                                <input type="url" id="bot-avatar" class="admin-input" value="${BOT_CONFIG.avatar}">
                            </div>
                            <div class="form-group">
                                <label><strong>Welcome Message:</strong></label>
                                <textarea id="welcome-message" class="admin-textarea">${BOT_CONFIG.welcomeMessage}</textarea>
                            </div>
                            <div class="form-group">
                                <label><strong>Response Delay (ms):</strong></label>
                                <input type="number" id="response-delay" class="admin-input" value="${BOT_CONFIG.responseDelay}">
                            </div>
                            <div class="form-group checkbox-group">
                                <label><input type="checkbox" id="show-typing" ${BOT_CONFIG.showTypingIndicator ? 'checked' : ''}> <strong>Show Typing Indicator</strong></label>
                                <label><input type="checkbox" id="show-quick-replies" ${BOT_CONFIG.showQuickReplies ? 'checked' : ''}> <strong>Show Quick Replies</strong></label>
                            </div>
                        </div>
                        
                        <!-- API Configuration Tab -->
                        <div id="tab-api" class="tab-content">
                            <h3><strong>🤖 AI Integration</strong></h3>
                            <div class="form-group">
                                <label><strong>OpenAI API Key:</strong></label>
                                <input type="password" id="api-key" class="admin-input" placeholder="sk-...">
                                <small>Enter your OpenAI API key for enhanced AI responses</small>
                            </div>
                            <div class="form-group">
                                <label><strong>API Endpoint:</strong></label>
                                <input type="url" id="api-endpoint" class="admin-input" value="${BOT_CONFIG.apiEndpoint}">
                            </div>
                            <div class="form-group checkbox-group">
                                <label><input type="checkbox" id="use-ai" ${BOT_CONFIG.useAI ? 'checked' : ''}> <strong>Enable AI Responses</strong></label>
                            </div>
                            <button id="test-api" class="admin-btn secondary">Test API Connection</button>
                            <div id="api-status" class="status-message"></div>
                        </div>
                        
                        <!-- Appearance Tab -->
                        <div id="tab-appearance" class="tab-content">
                            <h3><strong>🎨 Theme Customization</strong></h3>
                            <div class="color-grid">
                                <div class="form-group">
                                    <label><strong>Primary Color:</strong></label>
                                    <input type="color" id="primary-color" class="color-input" value="${BOT_CONFIG.theme.primaryColor}">
                                </div>
                                <div class="form-group">
                                    <label><strong>Secondary Color:</strong></label>
                                    <input type="color" id="secondary-color" class="color-input" value="${BOT_CONFIG.theme.secondaryColor}">
                                </div>
                                <div class="form-group">
                                    <label><strong>Accent Color:</strong></label>
                                    <input type="color" id="accent-color" class="color-input" value="${BOT_CONFIG.theme.accentColor}">
                                </div>
                                <div class="form-group">
                                    <label><strong>Background Color:</strong></label>
                                    <input type="color" id="bg-color" class="color-input" value="${BOT_CONFIG.theme.backgroundColor}">
                                </div>
                            </div>
                            <button id="preview-theme" class="admin-btn secondary">Preview Changes</button>
                            <button id="reset-theme" class="admin-btn danger">Reset to Default</button>
                        </div>
                        
                        <!-- Analytics Tab -->
                        <div id="tab-analytics" class="tab-content">
                            <h3><strong>📊 Bot Analytics</strong></h3>
                            <div class="analytics-grid">
                                <div class="stat-card">
                                    <h4><strong>Total Conversations</strong></h4>
                                    <div class="stat-number" id="total-conversations">0</div>
                                </div>
                                <div class="stat-card">
                                    <h4><strong>Messages Today</strong></h4>
                                    <div class="stat-number" id="messages-today">0</div>
                                </div>
                                <div class="stat-card">
                                    <h4><strong>Active Sessions</strong></h4>
                                    <div class="stat-number" id="active-sessions">0</div>
                                </div>
                                <div class="stat-card">
                                    <h4><strong>Response Rate</strong></h4>
                                    <div class="stat-number" id="response-rate">98%</div>
                                </div>
                            </div>
                            <div class="chart-container">
                                <canvas id="analytics-chart"></canvas>
                            </div>
                        </div>
                        
                        <!-- Export/Import Tab -->
                        <div id="tab-export" class="tab-content">
                            <h3><strong>💾 Data Management</strong></h3>
                            <div class="export-section">
                                <h4><strong>Export Data</strong></h4>
                                <button id="export-settings" class="admin-btn secondary">Export Settings</button>
                                <button id="export-conversations" class="admin-btn secondary">Export Conversations</button>
                                <button id="export-analytics" class="admin-btn secondary">Export Analytics</button>
                            </div>
                            <div class="import-section">
                                <h4><strong>Import Data</strong></h4>
                                <input type="file" id="import-file" accept=".json" class="file-input">
                                <button id="import-data" class="admin-btn primary">Import Data</button>
                            </div>
                            <div class="backup-section">
                                <h4><strong>Backup & Restore</strong></h4>
                                <button id="create-backup" class="admin-btn accent">Create Backup</button>
                                <button id="clear-data" class="admin-btn danger">Clear All Data</button>
                            </div>
                        </div>
                        
                        <div class="admin-actions">
                            <button id="save-settings" class="admin-btn primary large">💾 Save All Settings</button>
                            <button id="restart-bot" class="admin-btn secondary">🔄 Restart Bot</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Admin Access Button -->
        <div id="admin-access" class="admin-access-btn" title="Admin Panel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', adminHTML);
    setupAdminEventListeners();
    addAdminStyles();
}

// Setup admin event listeners
function setupAdminEventListeners() {
    // Admin access button
    document.getElementById('admin-access').addEventListener('click', () => {
        document.getElementById('peterbot-admin-panel').style.display = 'flex';
    });
    
    // Close admin panel
    document.getElementById('admin-close').addEventListener('click', () => {
        document.getElementById('peterbot-admin-panel').style.display = 'none';
    });
    
    // Admin login
    document.getElementById('admin-login-btn').addEventListener('click', handleAdminLogin);
    document.getElementById('admin-password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAdminLogin();
    });
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchAdminTab(tabName);
        });
    });
    
    // Save settings
    document.getElementById('save-settings').addEventListener('click', saveAdminSettings);
    
    // Test API
    document.getElementById('test-api').addEventListener('click', testAPIConnection);
    
    // Theme preview
    document.getElementById('preview-theme').addEventListener('click', previewTheme);
    document.getElementById('reset-theme').addEventListener('click', resetTheme);
    
    // Export functions
    document.getElementById('export-settings').addEventListener('click', () => exportData('settings'));
    document.getElementById('export-conversations').addEventListener('click', () => exportData('conversations'));
    document.getElementById('export-analytics').addEventListener('click', () => exportData('analytics'));
    
    // Import function
    document.getElementById('import-data').addEventListener('click', importData);
    
    // Backup functions
    document.getElementById('create-backup').addEventListener('click', createBackup);
    document.getElementById('clear-data').addEventListener('click', clearAllData);
    
    // Restart bot
    document.getElementById('restart-bot').addEventListener('click', restartBot);
}

// Handle admin login
function handleAdminLogin() {
    const password = document.getElementById('admin-password').value;
    const errorDiv = document.getElementById('login-error');
    
    if (password === ADMIN_CONFIG.password) {
        ADMIN_CONFIG.isAuthenticated = true;
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-interface').style.display = 'block';
        loadAnalytics();
        errorDiv.textContent = '';
    } else {
        errorDiv.innerHTML = '<strong>❌ Invalid password. Please try again.</strong>';
        document.getElementById('admin-password').value = '';
    }
}

// Switch admin tabs
function switchAdminTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

// Save admin settings
function saveAdminSettings() {
    const settings = {
        botName: document.getElementById('bot-name').value,
        botAvatar: document.getElementById('bot-avatar').value,
        welcomeMessage: document.getElementById('welcome-message').value,
        responseDelay: parseInt(document.getElementById('response-delay').value),
        showTypingIndicator: document.getElementById('show-typing').checked,
        showQuickReplies: document.getElementById('show-quick-replies').checked,
        apiKey: document.getElementById('api-key').value,
        apiEndpoint: document.getElementById('api-endpoint').value,
        useAI: document.getElementById('use-ai').checked,
        theme: {
            primaryColor: document.getElementById('primary-color').value,
            secondaryColor: document.getElementById('secondary-color').value,
            accentColor: document.getElementById('accent-color').value,
            backgroundColor: document.getElementById('bg-color').value
        }
    };
    
    // Update BOT_CONFIG
    Object.assign(BOT_CONFIG, settings);
    
    // Save to localStorage
    localStorage.setItem('peterbot_settings', JSON.stringify(settings));
    
    // Apply theme changes
    applyTheme();
    
    // Show success message
    showAdminMessage('✅ Settings saved successfully!', 'success');
}

// Test API connection
async function testAPIConnection() {
    const apiKey = document.getElementById('api-key').value;
    const statusDiv = document.getElementById('api-status');
    
    if (!apiKey) {
        statusDiv.innerHTML = '<strong>❌ Please enter an API key first.</strong>';
        statusDiv.className = 'status-message error';
        return;
    }
    
    statusDiv.innerHTML = '<strong>🔄 Testing API connection...</strong>';
    statusDiv.className = 'status-message info';
    
    try {
        const response = await fetch(BOT_CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: 'Test connection' }],
                max_tokens: 10
            })
        });
        
        if (response.ok) {
            statusDiv.innerHTML = '<strong>✅ API connection successful!</strong>';
            statusDiv.className = 'status-message success';
        } else {
            statusDiv.innerHTML = '<strong>❌ API connection failed. Check your API key.</strong>';
            statusDiv.className = 'status-message error';
        }
    } catch (error) {
        statusDiv.innerHTML = '<strong>❌ Network error. Please check your connection.</strong>';
        statusDiv.className = 'status-message error';
    }
}

// Preview theme changes
function previewTheme() {
    applyTheme();
    showAdminMessage('🎨 Theme preview applied!', 'info');
}

// Reset theme to default
function resetTheme() {
    const defaultTheme = {
        primaryColor: '#667eea',
        secondaryColor: '#764ba2', 
        accentColor: '#4CAF50',
        backgroundColor: '#f8f9fa'
    };
    
    document.getElementById('primary-color').value = defaultTheme.primaryColor;
    document.getElementById('secondary-color').value = defaultTheme.secondaryColor;
    document.getElementById('accent-color').value = defaultTheme.accentColor;
    document.getElementById('bg-color').value = defaultTheme.backgroundColor;
    
    BOT_CONFIG.theme = defaultTheme;
    applyTheme();
    showAdminMessage('🔄 Theme reset to default!', 'info');
}

// Apply theme changes
function applyTheme() {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', BOT_CONFIG.theme.primaryColor);
    root.style.setProperty('--secondary-color', BOT_CONFIG.theme.secondaryColor);
    root.style.setProperty('--accent-color', BOT_CONFIG.theme.accentColor);
    root.style.setProperty('--bg-color', BOT_CONFIG.theme.backgroundColor);
}

// Load analytics data
function loadAnalytics() {
    // Get analytics from localStorage
    const sessions = JSON.parse(localStorage.getItem('peterbot_sessions_index') || '[]');
    const today = new Date().toDateString();
    let messagesToday = 0;
    
    sessions.forEach(sessionId => {
        const sessionData = JSON.parse(localStorage.getItem(`peterbot_chat_${sessionId}`) || '[]');
        sessionData.forEach(message => {
            if (new Date(message.time).toDateString() === today) {
                messagesToday++;
            }
        });
    });
    
    document.getElementById('total-conversations').textContent = sessions.length;
    document.getElementById('messages-today').textContent = messagesToday;
    document.getElementById('active-sessions').textContent = sessions.length > 0 ? 1 : 0;
}

// Export data functions
function exportData(type) {
    let data = {};
    let filename = '';
    
    switch (type) {
        case 'settings':
            data = BOT_CONFIG;
            filename = 'peterbot-settings.json';
            break;
        case 'conversations':
            const sessions = JSON.parse(localStorage.getItem('peterbot_sessions_index') || '[]');
            data = sessions.map(sessionId => ({
                sessionId,
                messages: JSON.parse(localStorage.getItem(`peterbot_chat_${sessionId}`) || '[]')
            }));
            filename = 'peterbot-conversations.json';
            break;
        case 'analytics':
            data = {
                totalSessions: JSON.parse(localStorage.getItem('peterbot_sessions_index') || '[]').length,
                exportDate: new Date().toISOString()
            };
            filename = 'peterbot-analytics.json';
            break;
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    showAdminMessage(`📥 ${type} exported successfully!`, 'success');
}

// Import data function
function importData() {
    const fileInput = document.getElementById('import-file');
    const file = fileInput.files[0];
    
    if (!file) {
        showAdminMessage('❌ Please select a file to import.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate and import data
            if (data.name && data.version) {
                // Settings file
                Object.assign(BOT_CONFIG, data);
                localStorage.setItem('peterbot_settings', JSON.stringify(data));
                showAdminMessage('✅ Settings imported successfully!', 'success');
            } else {
                showAdminMessage('❌ Invalid file format.', 'error');
            }
        } catch (error) {
            showAdminMessage('❌ Error parsing file.', 'error');
        }
    };
    reader.readAsText(file);
}

// Create backup
function createBackup() {
    const backup = {
        settings: BOT_CONFIG,
        conversations: {},
        timestamp: new Date().toISOString()
    };
    
    const sessions = JSON.parse(localStorage.getItem('peterbot_sessions_index') || '[]');
    sessions.forEach(sessionId => {
        backup.conversations[sessionId] = JSON.parse(localStorage.getItem(`peterbot_chat_${sessionId}`) || '[]');
    });
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `peterbot-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showAdminMessage('💾 Backup created successfully!', 'success');
}

// Clear all data
function clearAllData() {
    if (confirm('⚠️ Are you sure you want to clear all bot data? This action cannot be undone.')) {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('peterbot_'));
        keys.forEach(key => localStorage.removeItem(key));
        
        chatHistory = [];
        currentSessionId = null;
        
        showAdminMessage('🗑️ All data cleared successfully!', 'success');
        setTimeout(() => location.reload(), 2000);
    }
}

// Restart bot
function restartBot() {
    showAdminMessage('🔄 Restarting bot...', 'info');
    setTimeout(() => {
        location.reload();
    }, 1500);
}

// Show admin message
function showAdminMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `admin-message ${type}`;
    messageDiv.innerHTML = `<strong>${message}</strong>`;
    
    document.querySelector('.admin-content').appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
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
        if (settings.apiKey) BOT_CONFIG.apiKey = settings.apiKey;
        if (settings.useAI !== undefined) BOT_CONFIG.useAI = settings.useAI;
        if (settings.theme) BOT_CONFIG.theme = { ...BOT_CONFIG.theme, ...settings.theme };
        
        // Apply theme
        applyTheme();
        
        console.log('Bot settings loaded:', BOT_CONFIG);
    } catch (error) {
        console.error('Error loading bot settings:', error);
    }
}

// Enhanced message formatting function
function formatMessage(text) {
    // Convert **text** to <strong>text</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *text* to <em>text</em>
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert URLs to links
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    
    // Convert email addresses to mailto links
    text = text.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1">$1</a>');
    
        // Convert phone numbers to tel links
    text = text.replace(/(\+?\d{1,4}[\s-]?\d{3,4}[\s-]?\d{3,4}[\s-]?\d{3,4})/g, '<a href="tel:$1">$1</a>');
    
    // Convert line breaks to <br>
    text = text.replace(/\n/g, '<br>');
    
    // Convert numbered lists
    text = text.replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
    
    // Convert bullet points
    text = text.replace(/^[-•]\s(.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    return text;
}

// Create the main bot container
function createBotContainer() {
    const containerHTML = `
        <div id="peterbot-container" class="peterbot-container">
            <!-- Chat Toggle Button -->
            <div id="peterbot-toggle" class="chat-toggle">
                <div class="toggle-icon">
                    <svg class="chat-icon" width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                    <svg class="close-icon" width="24" height="24" viewBox="0 0 24 24" fill="white" style="display: none;">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </div>
                <div class="notification-badge" id="notification-badge" style="display: none;">1</div>
            </div>
            
            <!-- Main Chat Interface -->
            <div id="peterbot-chat" class="chat-interface">
                <!-- Chat Header -->
                <div class="chat-header">
                    <div class="bot-info">
                        <img src="${BOT_CONFIG.avatar}" alt="${BOT_CONFIG.name}" class="bot-avatar" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzY2N2VlYSI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTQuMmMtMi41IDAtNC43MS0xLjI4LTYtMy4yMi4wMy0xLjk5IDQtMy4wOCA2LTMuMDhzNS45NyAxLjA5IDYgMy4wOGMtMS4yOSAxLjk0LTMuNSAzLjIyLTYgMy4yMnoiLz48L3N2Zz4='">
                        <div class="bot-details">
                            <div class="bot-name">${BOT_CONFIG.name}</div>
                            <div class="bot-status">
                                <span class="status-indicator online"></span>
                                <span class="status-text">Online</span>
                            </div>
                        </div>
                    </div>
                    <div class="chat-actions">
                        <button id="clear-chat" class="action-btn" title="Clear Chat">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                        </button>
                        <button id="minimize-chat" class="action-btn" title="Minimize">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 13H5v-2h14v2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Chat Messages Area -->
                <div id="chat-messages" class="chat-messages">
                    <div class="messages-container">
                        <!-- Messages will be inserted here -->
                    </div>
                </div>
                
                <!-- Typing Indicator -->
                <div id="typing-indicator" class="typing-indicator" style="display: none;">
                    <div class="typing-avatar">
                        <img src="${BOT_CONFIG.avatar}" alt="${BOT_CONFIG.name}">
                    </div>
                    <div class="typing-text">
                        <div class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span class="typing-label">${BOT_CONFIG.name} is typing...</span>
                    </div>
                </div>
                
                <!-- Quick Replies -->
                <div id="quick-replies" class="quick-replies" style="display: none;">
                    <!-- Quick reply buttons will be inserted here -->
                </div>
                
                <!-- Chat Input Area -->
                <div class="chat-input-area">
                    <div class="input-container">
                        <textarea id="user-input" class="user-input" placeholder="Type your message..." rows="1"></textarea>
                        <button id="send-button" class="send-button" disabled>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="input-actions">
                        <button id="attach-file" class="input-action-btn" title="Attach File">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
                            </svg>
                        </button>
                        <button id="voice-input" class="input-action-btn" title="Voice Input">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                            </svg>
                        </button>
                        <button id="emoji-picker" class="input-action-btn" title="Emoji">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Powered By -->
                <div class="powered-by">
                    <span>Powered by <strong>PeterBot v${BOT_CONFIG.version}</strong></span>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', containerHTML);
    botContainer = document.getElementById('peterbot-container');
    
    setupEventListeners();
    addBotStyles();
}

// Setup event listeners for chat functionality
function setupEventListeners() {
    // Toggle chat
    document.getElementById('peterbot-toggle').addEventListener('click', toggleChat);
    
    // Minimize chat
    document.getElementById('minimize-chat').addEventListener('click', toggleChat);
    
    // Clear chat
    document.getElementById('clear-chat').addEventListener('click', clearChat);
    
    // Send message
    document.getElementById('send-button').addEventListener('click', sendMessage);
    
    // Input handling
    const userInput = document.getElementById('user-input');
    userInput.addEventListener('keypress', handleKeyPress);
    userInput.addEventListener('input', handleInputChange);
    
    // Auto-resize textarea
    userInput.addEventListener('input', autoResizeTextarea);
    
    // Voice input (if supported)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        document.getElementById('voice-input').addEventListener('click', startVoiceInput);
    } else {
        document.getElementById('voice-input').style.display = 'none';
    }
    
    // File attachment
    document.getElementById('attach-file').addEventListener('click', handleFileAttachment);
    
    // Emoji picker
    document.getElementById('emoji-picker').addEventListener('click', showEmojiPicker);
}

// Toggle chat interface
function toggleChat() {
    const chatInterface = document.getElementById('peterbot-chat');
    const toggleButton = document.getElementById('peterbot-toggle');
    const chatIcon = toggleButton.querySelector('.chat-icon');
    const closeIcon = toggleButton.querySelector('.close-icon');
    const notificationBadge = document.getElementById('notification-badge');
    
    if (chatInterface.style.display === 'none' || !chatInterface.style.display) {
        chatInterface.style.display = 'flex';
        chatIcon.style.display = 'none';
        closeIcon.style.display = 'block';
        notificationBadge.style.display = 'none';
        
        // Focus on input
        setTimeout(() => {
            document.getElementById('user-input').focus();
        }, 300);
        
        // Scroll to bottom
        scrollToBottom();
    } else {
        chatInterface.style.display = 'none';
        chatIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
}

// Clear chat history
function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        chatHistory = [];
        saveChatHistory();
        
        const messagesContainer = document.querySelector('.messages-container');
        messagesContainer.innerHTML = '';
        
        // Show welcome message again
        setTimeout(() => {
            addBotMessage(BOT_CONFIG.welcomeMessage);
            showQuickReplies();
        }, 500);
    }
}

// Handle key press in input
function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

// Handle input changes
function handleInputChange(e) {
    const sendButton = document.getElementById('send-button');
    const hasText = e.target.value.trim().length > 0;
    
    sendButton.disabled = !hasText;
    sendButton.style.opacity = hasText ? '1' : '0.5';
}

// Auto-resize textarea
function autoResizeTextarea() {
    const textarea = document.getElementById('user-input');
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// Send user message
async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (!message || isTyping) return;
    
    // Clear input
    userInput.value = '';
    userInput.style.height = 'auto';
    handleInputChange({ target: userInput });
    
    // Add user message
    addUserMessage(message);
    
    // Hide quick replies
    hideQuickReplies();
    
    // Process message and get response
    await processUserMessage(message);
}

// Add user message to chat
function addUserMessage(message) {
    const messageData = {
        type: 'user',
        content: message,
        time: new Date().toISOString()
    };
    
    chatHistory.push(messageData);
    saveChatHistory();
    
    const messagesContainer = document.querySelector('.messages-container');
    const messageElement = createMessageElement(messageData);
    messagesContainer.appendChild(messageElement);
    
    scrollToBottom();
}

// Add bot message to chat
function addBotMessage(message, showDelay = true) {
    const messageData = {
        type: 'bot',
        content: message,
        time: new Date().toISOString()
    };
    
    if (showDelay && BOT_CONFIG.showTypingIndicator) {
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            
            chatHistory.push(messageData);
            saveChatHistory();
            
            const messagesContainer = document.querySelector('.messages-container');
            const messageElement = createMessageElement(messageData);
            messagesContainer.appendChild(messageElement);
            
            scrollToBottom();
        }, BOT_CONFIG.responseDelay);
    } else {
        chatHistory.push(messageData);
        saveChatHistory();
        
        const messagesContainer = document.querySelector('.messages-container');
        const messageElement = createMessageElement(messageData);
        messagesContainer.appendChild(messageElement);
        
        scrollToBottom();
    }
}

// Create message element
function createMessageElement(messageData) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${messageData.type}-message`;
    
    const time = new Date(messageData.time).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    if (messageData.type === 'bot') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <img src="${BOT_CONFIG.avatar}" alt="${BOT_CONFIG.name}">
            </div>
            <div class="message-content">
                <div class="message-text">${formatMessage(messageData.content)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${formatMessage(messageData.content)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
    }
    
    return messageDiv;
}

// Show typing indicator
function showTypingIndicator() {
    isTyping = true;
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'flex';
    scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'none';
}

// Process user message and generate response
async function processUserMessage(message) {
    let response = '';
    
    // Check if AI is enabled and API key is available
    if (BOT_CONFIG.useAI && BOT_CONFIG.apiKey) {
        try {
            response = await getAIResponse(message);
        } catch (error) {
            console.error('AI response error:', error);
            response = getKnowledgeBaseResponse(message);
        }
    } else {
        response = getKnowledgeBaseResponse(message);
    }
    
    // Add bot response
    addBotMessage(response);
    
    // Show quick replies after response
    setTimeout(() => {
        if (BOT_CONFIG.showQuickReplies) {
            showQuickReplies();
        }
    }, BOT_CONFIG.responseDelay + 500);
}

// Get AI response from OpenAI
async function getAIResponse(message) {
    const systemPrompt = `You are PeterBot, Peter's professional AI assistant. Peter offers these services:

1. **Web Development & Design** - Professional websites, e-commerce, web applications
2. **Virtual Assistant Services** - Administrative support, email management, social media
3. **Digital Marketing** - Social media marketing, SEO, content marketing, PPC
4. **Saxophone Performance** - Live performances as 'Peterphonist', church programs (free), session recordings

Contact Information:
- Email: petereluwade55@gmail.com
- WhatsApp: +234 8108821809
- Telegram: @peterlightspeed
- Website: https://peterlight123.github.io/portfolio/

Social Media: @peterphonist (YouTube, Facebook, Instagram, TikTok, Twitter)

Provide helpful, professional responses about Peter's services. Include pricing when relevant and always offer to connect them with Peter for detailed discussions.`;

    try {
        const response = await fetch(BOT_CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${BOT_CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('AI API Error:', error);
        throw error;
    }
}

// Get response from knowledge base
function getKnowledgeBaseResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Greeting responses
    if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
        return `Hello! 👋 Welcome to **Peter's Professional Services**! I'm here to help you learn about:

🌐 **Web Development & Design**
🤝 **Virtual Assistant Services** 
📈 **Digital Marketing**
🎷 **Saxophone Performances** (as Peterphonist)

What service interests you most, or would you like to know more about Peter's work?`;
    }
    
    // Web development inquiries
    if (lowerMessage.includes('web') || lowerMessage.includes('website') || lowerMessage.includes('development')) {
        const webService = KNOWLEDGE_BASE.services.web;
        return `🌐 **${webService.title}**

${webService.description}

**Our Web Development Services:**
${webService.offerings.map(item => `• ${item}`).join('\n')}

**💰 Pricing Range:**
• **Basic Websites:** ${webService.pricing.basic}
• **Business Websites:** ${webService.pricing.standard}
• **Complex Applications:** ${webService.pricing.premium}
• **Monthly Maintenance:** ${webService.pricing.maintenance}

**Technologies:** ${webService.technologies.join(', ')}

Ready to discuss your web project? Contact Peter:
📧 ${KNOWLEDGE_BASE.contact.email}
📱 ${KNOWLEDGE_BASE.contact.whatsapp}`;
    }
    
    // Virtual assistant inquiries
    if (lowerMessage.includes('virtual') || lowerMessage.includes('assistant') || lowerMessage.includes('admin')) {
        const vaService = KNOWLEDGE_BASE.services.virtual_assistant;
        return `🤝 **${vaService.title}**

${vaService.description}

**Virtual Assistant Services:**
${vaService.offerings.map(item => `• ${item}`).join('\n')}

**💰 Pricing Options:**
• **Hourly Rate:** ${vaService.pricing.hourly}
• **Part-time (20 hrs/week):** ${vaService.pricing.part_time}
• **Full-time (40 hrs/week):** ${vaService.pricing.full_time}

Let's discuss how Peter can support your business operations:
📧 ${KNOWLEDGE_BASE.contact.email}
💬 ${KNOWLEDGE_BASE.contact.whatsapp}`;
    }
    
    // Digital marketing inquiries
    if (lowerMessage.includes('marketing') || lowerMessage.includes('social media') || lowerMessage.includes('seo')) {
        const marketingService = KNOWLEDGE_BASE.services.digital_marketing;
        return `📈 **${marketingService.title}**

${marketingService.description}

**Digital Marketing Services:**
${marketingService.offerings.map(item => `• ${item}`).join('\n')}

**💰 Monthly Packages:**
• **Basic Package:** ${marketingService.pricing.basic}
• **Standard Package:** ${marketingService.pricing.standard}
• **Premium Package:** ${marketingService.pricing.premium}

Ready to grow your online presence? Let's connect:
📧 ${KNOWLEDGE_BASE.contact.email}
📱 ${KNOWLEDGE_BASE.contact.whatsapp}`;
    }
    
    // Saxophone/music inquiries
    if (lowerMessage.includes('saxophone') || lowerMessage.includes('music') || lowerMessage.includes('performance') || lowerMessage.includes('peterphonist')) {
        const saxService = KNOWLEDGE_BASE.services.saxophone;
        return `🎷 **${saxService.title}**

Meet **Peterphonist** - Peter's musical persona!

**Performance Services:**
${saxService.offerings.map(item => `• ${item}`).join('\n')}

**💰 Performance Rates:**
• **Live Events:** ${saxService.pricing.livePerformance}
• **Church Programs:** ${saxService.pricing.churchPrograms}
• **Session Recording:** ${saxService.pricing.sessionRecording}
• **Personalized Songs:** ${saxService.pricing.personalizedSong}

**🎵 Follow Peterphonist:**
• YouTube: ${KNOWLEDGE_BASE.social_media.youtube}
• Instagram: ${KNOWLEDGE_BASE.social_media.instagram}
• Facebook: ${KNOWLEDGE_BASE.social_media.facebook}

Book your musical experience:
📧 ${KNOWLEDGE_BASE.contact.email}
📱 ${KNOWLEDGE_BASE.contact.whatsapp}`;
    }
    
    // Pricing inquiries
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
        return `💰 **Peter's Service Pricing Overview**

**🌐 Web Development:**
• Basic: $200-1,000 (₦150K-₦750K)
• Business: $1,000-3,000 (₦750K-₦2.25M)
• Complex: $3,000-7,000 (₦2.25M-₦5.25M)

**🤝 Virtual Assistant:**
• Hourly: $10-30 (₦7.5K-₦22.5K)
• Part-time: $800-1,500/month
• Full-time: $1,500-3,000/month

**📈 Digital Marketing:**
• Basic: $300-800/month
• Standard: $800-2,000/month
• Premium: $2,000-5,000/month

**🎷 Saxophone Performances:**
• Live Events: $200-500 per event
• Church Programs: Free (transport only)
• Session Recording: $100-300 per track

*Prices vary based on project complexity and requirements.*

Get a detailed quote: ${KNOWLEDGE_BASE.contact.email}`;
    }
    
    // Contact inquiries
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('connect')) {
        return `📞 **Contact Peter**

**Direct Communication:**
📧 **Email:** ${KNOWLEDGE_BASE.contact.email}
📱 **WhatsApp:** ${KNOWLEDGE_BASE.contact.whatsapp}
💬 **Telegram:** ${KNOWLEDGE_BASE.contact.telegram}
🌐 **Website:** ${KNOWLEDGE_BASE.contact.website}

**Social Media (@peterphonist):**
🎥 **YouTube:** ${KNOWLEDGE_BASE.social_media.youtube}
📘 **Facebook:** ${KNOWLEDGE_BASE.social_media.facebook}
📸 **Instagram:** ${KNOWLEDGE_BASE.social_media.instagram}
🎵 **TikTok:** ${KNOWLEDGE_BASE.social_media.tiktok}
🐦 **Twitter:** ${KNOWLEDGE_BASE.social_media.twitter}

Peter typically responds within 2-4 hours during business hours. For urgent inquiries, WhatsApp is the fastest option!`;
    }
    
    // Portfolio/work examples
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('work') || lowerMessage.includes('example')) {
        return `🎯 **Peter's Work & Portfolio**

**🌐 Web Development Portfolio:**
Visit: ${KNOWLEDGE_BASE.contact.website}

**🎷 Musical Performances:**
Check out Peterphonist's performances:
• YouTube: ${KNOWLEDGE_BASE.social_media.youtube}
• Instagram: ${KNOWLEDGE_BASE.social_media.instagram}

**📈 Marketing Case Studies:**
Peter has helped numerous businesses grow their online presence through strategic digital marketing campaigns.

**🤝 Client Testimonials:**
Available upon request - Peter maintains strong relationships with all clients and delivers quality results consistently.

Want to see specific examples related to your project? Contact Peter:
📧 ${KNOWLEDGE_BASE.contact.email}
📱 ${KNOWLEDGE_BASE.contact.whatsapp}`;
    }
    
    // Default response
    return `Thank you for your message! 😊

I'm **PeterBot**, and I'm here to help you learn about **Peter's professional services**:

🌐 **Web Development & Design**
🤝 **Virtual Assistant Services**
📈 **Digital Marketing**
🎷 **Saxophone Performances** (Peterphonist)

Could you please let me know which service interests you, or ask a specific question? I'm here to provide detailed information and connect you with Peter for personalized assistance.

You can also reach Peter directly:
📧 ${KNOWLEDGE_BASE.contact.email}
📱 ${KNOWLEDGE_BASE.contact.whatsapp}`;
}

// Show quick reply buttons
function showQuickReplies() {
    if (!BOT_CONFIG.showQuickReplies) return;
    
    const quickReplies = [
        { text: '🌐 Web Development', value: 'Tell me about web development services' },
        { text: '🤝 Virtual Assistant', value: 'I need virtual assistant services' },
        { text: '📈 Digital Marketing', value: 'Tell me about digital marketing' },
        { text: '🎷 Saxophone Performance', value: 'I want to book Peterphonist' },
        { text: '💰 Pricing', value: 'What are your prices?' },
        { text: '📞 Contact Info', value: 'How can I contact Peter?' }
    ];
    
    const quickRepliesContainer = document.getElementById('quick-replies');
    quickRepliesContainer.innerHTML = '';
    
    quickReplies.forEach(reply => {
        const button = document.createElement('button');
        button.className = 'quick-reply-btn';
        button.textContent = reply.text;
        button.addEventListener('click', () => {
            handleQuickReply(reply.value);
        });
        quickRepliesContainer.appendChild(button);
    });
    
    quickRepliesContainer.style.display = 'flex';
    scrollToBottom();
}

// Hide quick replies
function hideQuickReplies() {
    const quickRepliesContainer = document.getElementById('quick-replies');
    quickRepliesContainer.style.display = 'none';
}

// Handle quick reply selection
async function handleQuickReply(value) {
    hideQuickReplies();
    
    // Add user message
    addUserMessage(value);
    
    // Process the message
    await processUserMessage(value);
}

// Voice input functionality
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Speech recognition is not supported in your browser.');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    const voiceButton = document.getElementById('voice-input');
    const originalHTML = voiceButton.innerHTML;
    
    // Show recording state
    voiceButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="red">
            <circle cx="12" cy="12" r="8"/>
        </svg>
    `;
    voiceButton.style.animation = 'pulse 1s infinite';
    
    recognition.onstart = function() {
        console.log('Voice recognition started');
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('user-input').value = transcript;
        handleInputChange({ target: document.getElementById('user-input') });
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        alert('Voice recognition error: ' + event.error);
    };
    
    recognition.onend = function() {
        // Restore original button
        voiceButton.innerHTML = originalHTML;
        voiceButton.style.animation = '';
    };
    
    recognition.start();
}

// File attachment handler
function handleFileAttachment() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx,.txt';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            
            // Add file message
            addFileMessage(file);
        }
    };
    
    input.click();
}

// Add file message to chat
function addFileMessage(file) {
    const fileIcon = getFileIcon(file.type);
    const fileSize = formatFileSize(file.size);
    
    const messageData = {
        type: 'user',
        content: `📎 **File Attached:** ${file.name} (${fileSize})`,
        time: new Date().toISOString(),
        isFile: true,
        file: {
            name: file.name,
            size: file.size,
            type: file.type
        }
    };
    
    chatHistory.push(messageData);
    saveChatHistory();
    
    const messagesContainer = document.querySelector('.messages-container');
    const messageElement = createMessageElement(messageData);
    messagesContainer.appendChild(messageElement);
    
    scrollToBottom();
    
    // Bot response for file
    setTimeout(() => {
        addBotMessage(`Thank you for sharing **${file.name}**! 📎 

I've noted that you've uploaded a file. For file review and detailed assistance, please contact Peter directly:

📧 **Email:** ${KNOWLEDGE_BASE.contact.email}
📱 **WhatsApp:** ${KNOWLEDGE_BASE.contact.whatsapp}

Peter will review your file and provide personalized assistance based on your needs.`);
    }, 1000);
}

// Get file icon based on type
function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('doc')) return '📝';
    if (fileType.includes('text')) return '📄';
    return '📎';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Show emoji picker
function showEmojiPicker() {
    const emojis = ['😊', '👍', '❤️', '😂', '🤔', '👏', '🙏', '💪', '🎉', '🔥', '💯', '✨', '🚀', '💡', '📞', '📧', '💰', '🎯', '🌟', '👌'];
    
    // Remove existing picker
    const existingPicker = document.getElementById('emoji-picker-popup');
    if (existingPicker) {
        existingPicker.remove();
        return;
    }
    
    const picker = document.createElement('div');
    picker.id = 'emoji-picker-popup';
    picker.className = 'emoji-picker-popup';
    
    emojis.forEach(emoji => {
        const emojiBtn = document.createElement('button');
        emojiBtn.textContent = emoji;
        emojiBtn.className = 'emoji-btn';
        emojiBtn.addEventListener('click', () => {
            const userInput = document.getElementById('user-input');
            userInput.value += emoji;
            handleInputChange({ target: userInput });
            picker.remove();
            userInput.focus();
        });
        picker.appendChild(emojiBtn);
    });
    
    document.querySelector('.chat-input-area').appendChild(picker);
    
    // Close picker when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeEmojiPicker(e) {
            if (!picker.contains(e.target) && e.target.id !== 'emoji-picker') {
                picker.remove();
                document.removeEventListener('click', closeEmojiPicker);
            }
        });
    }, 100);
}

// Scroll to bottom of chat
function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// Session management
function createNewSession() {
    currentSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Add to sessions index
    const sessions = JSON.parse(localStorage.getItem('peterbot_sessions_index') || '[]');
    sessions.push(currentSessionId);
    localStorage.setItem('peterbot_sessions_index', JSON.stringify(sessions));
    
    console.log('New session created:', currentSessionId);
}

// Save chat history
function saveChatHistory() {
    if (currentSessionId) {
        localStorage.setItem(`peterbot_chat_${currentSessionId}`, JSON.stringify(chatHistory));
    }
}

// Load chat history
function loadChatHistory() {
    if (currentSessionId) {
        const savedHistory = localStorage.getItem(`peterbot_chat_${currentSessionId}`);
        if (savedHistory) {
            chatHistory = JSON.parse(savedHistory);
            displayChatHistory();
        }
    }
}

// Display loaded chat history
function displayChatHistory() {
    const messagesContainer = document.querySelector('.messages-container');
    messagesContainer.innerHTML = '';
    
    chatHistory.forEach(messageData => {
        const messageElement = createMessageElement(messageData);
        messagesContainer.appendChild(messageElement);
    });
    
    scrollToBottom();
}

// Add comprehensive CSS styles
function addBotStyles() {
    const styles = `
        <style id="peterbot-styles">
            /* CSS Variables for theming */
            :root {
                --primary-color: ${BOT_CONFIG.theme.primaryColor};
                --secondary-color: ${BOT_CONFIG.theme.secondaryColor};
                --accent-color: ${BOT_CONFIG.theme.accentColor};
                --bg-color: ${BOT_CONFIG.theme.backgroundColor};
                --text-color: ${BOT_CONFIG.theme.textColor};
                --border-radius: 12px;
                --shadow: 0 4px 20px rgba(0,0,0,0.15);
                --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* Main Container */
            .peterbot-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                direction: ltr;
            }
            
            /* Chat Toggle Button */
            .chat-toggle {
                position: relative;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                border-radius: 50%;
                cursor: pointer;
                box-shadow: var(--shadow);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--transition);
                animation: float 3s ease-in-out infinite;
            }
            
            .chat-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(0,0,0,0.2);
            }
            
            .toggle-icon svg {
                transition: var(--transition);
            }
            
            .notification-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff4444;
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                animation: bounce 2s infinite;
            }
            
            /* Chat Interface */
            .chat-interface {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                height: 600px;
                background: white;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow);
                display: none;
                flex-direction: column;
                overflow: hidden;
                animation: slideUp 0.3s ease-out;
            }
            
            @media (max-width: 480px) {
                .chat-interface {
                    position: fixed;
                    bottom: 0;
                    right: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    border-radius: 0;
                }
                
                .peterbot-container {
                    bottom: 15px;
                    right: 15px;
                }
            }
            
            /* Chat Header */
            .chat-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
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
                border: 2px solid rgba(255,255,255,0.3);
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
                border-radius: 50%;
                background: #4CAF50;
                animation: pulse 2s infinite;
            }
            
            .chat-actions {
                display: flex;
                gap: 8px;
            }
            
            .action-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--transition);
            }
            
            .action-btn:hover {
                background: rgba(255,255,255,0.3);
            }
            
            /* Messages Area */
            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: var(--bg-color);
            }
            
            .messages-container {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            
            .message {
                display: flex;
                gap: 10px;
                animation: fadeInUp 0.3s ease-out;
            }
            
            .user-message {
                flex-direction: row-reverse;
            }
            
            .message-avatar img {
                width: 32px;
                height: 32px;
                border-radius: 50%;
            }
            
            .message-content {
                max-width: 70%;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            
            .message-text {
                padding: 12px 16px;
                border-radius: 18px;
                line-height: 1.4;
                word-wrap: break-word;
            }
            
            .bot-message .message-text {
                background: white;
                color: var(--text-color);
                border-bottom-left-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .user-message .message-text {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                border-bottom-right-radius: 6px;
            }
            
            .message-time {
                font-size: 11px;
                opacity: 0.6;
                padding: 0 8px;
            }
            
            .user-message .message-time {
                text-align: right;
            }
            
            /* Typing Indicator */
            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 0 20px 10px;
                background: var(--bg-color);
            }
            
            .typing-avatar img {
                width: 32px;
                height: 32px;
                border-radius: 50%;
            }
            
            .typing-text {
                background: white;
                padding: 12px 16px;
                border-radius: 18px;
                border-bottom-left-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .typing-dots {
                display: flex;
                gap: 4px;
            }
            
            .typing-dots span {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: var(--primary-color);
                animation: typingDots 1.4s infinite ease-in-out;
            }
            
            .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
            .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
            
            .typing-label {
                font-size: 12px;
                color: #666;
            }
            
            /* Quick Replies */
            .quick-replies {
                padding: 10px 20px;
                background: var(--bg-color);
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                border-top: 1px solid #eee;
            }
            
            .quick-reply-btn {
                background: white;
                border: 1px solid #ddd;
                color: var(--text-color);
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 13px;
                cursor: pointer;
                transition: var(--transition);
                white-space: nowrap;
            }
            
            .quick-reply-btn:hover {
                background: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
            }
            
            /* Input Area */
            .chat-input-area {
                background: white;
                border-top: 1px solid #eee;
                padding: 16px 20px;
                position: relative;
            }
            
            .input-container {
                display: flex;
                align-items: flex-end;
                gap: 12px;
                background: #f8f9fa;
                border-radius: 24px;
                padding: 8px 8px 8px 16px;
                border: 2px solid transparent;
                transition: var(--transition);
            }
            
            .input-container:focus-within {
                border-color: var(--primary-color);
                background: white;
            }
            
            .user-input {
                flex: 1;
                border: none;
                background: transparent;
                resize: none;
                outline: none;
                font-family: inherit;
                font-size: 14px;
                line-height: 1.4;
                max-height: 120px;
                min-height: 20px;
            }
            
            .user-input::placeholder {
                color: #999;
            }
            
            .send-button {
                background: var(--primary-color);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--transition);
            }
            
            .send-button:hover:not(:disabled) {
                background: var(--secondary-color);
                transform: scale(1.05);
            }
            
            .send-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .input-actions {
                display: flex;
                gap: 8px;
                margin-top: 8px;
                justify-content: center;
            }
            
            .input-action-btn {
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                padding: 6px;
                border-radius: 6px;
                transition: var(--transition);
            }
            
            .input-action-btn:hover {
                background: #f0f0f0;
                color: var(--primary-color);
            }
            
            /* Emoji Picker */
            .emoji-picker-popup {
                position: absolute;
                bottom: 100%;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-radius: 12px;
                padding: 12px;
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 8px;
                box-shadow: var(--shadow);
                z-index: 1000;
            }
            
            .emoji-btn {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                padding: 8px;
                border-radius: 6px;
                transition: var(--transition);
            }
            
            .emoji-btn:hover {
                background: #f0f0f0;
                transform: scale(1.2);
            }
            
            /* Powered By */
            .powered-by {
                text-align: center;
                padding: 8px;
                font-size: 11px;
                color: #999;
                background: #f8f9fa;
            }
            
            /* Admin Panel Styles */
            .admin-panel {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 20000;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(5px);
            }
            
            .admin-container {
                background: white;
                border-radius: var(--border-radius);
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                overflow: hidden;
                box-shadow: var(--shadow);
                animation: slideUp 0.3s ease-out;
            }
            
            .admin-header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .admin-header h2 {
                margin: 0;
                font-size: 20px;
            }
            
            .admin-close {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .admin-content {
                padding: 20px;
                max-height: calc(90vh - 80px);
                overflow-y: auto;
            }
            
            .login-form {
                text-align: center;
                max-width: 300px;
                margin: 0 auto;
            }
            
            .admin-input, .admin-textarea {
                width: 100%;
                padding: 12px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 14px;
                transition: var(--transition);
                margin-bottom: 12px;
            }
            
            .admin-input:focus, .admin-textarea:focus {
                outline: none;
                border-color: var(--primary-color);
            }
            
            .admin-textarea {
                min-height: 80px;
                resize: vertical;
            }
            
            .admin-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: var(--transition);
                margin: 4px;
            }
            
            .admin-btn.primary {
                background: var(--primary-color);
                color: white;
            }
            
            .admin-btn.secondary {
                background: #6c757d;
                color: white;
            }
            
            .admin-btn.accent {
                background: var(--accent-color);
                color: white;
            }
            
            .admin-btn.danger {
                background: #dc3545;
                color: white;
            }
            
            .admin-btn.large {
                padding: 16px 32px;
                font-size: 16px;
            }
            
            .admin-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            
            .admin-tabs {
                display: flex;
                border-bottom: 2px solid #eee;
                margin-bottom: 20px;
                overflow-x: auto;
            }
            
            .tab-btn {
                background: none;
                border: none;
                padding: 12px 20px;
                cursor: pointer;
                font-weight: 500;
                color: #666;
                border-bottom: 3px solid transparent;
                transition: var(--transition);
                white-space: nowrap;
            }
            
            .tab-btn.active {
                color: var(--primary-color);
                border-bottom-color: var(--primary-color);
            }
            
            .tab-content {
                display: none;
            }
            
            .tab-content.active {
                display: block;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: var(--text-color);
            }
            
            .checkbox-group label {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
            }
            
            .color-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
            }
            
            .color-input {
                width: 60px;
                height: 40px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
            }
            
            .analytics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
                margin-bottom: 20px;
            }
            
            .stat-card {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 12px;
                text-align: center;
            }
            
            .stat-card h4 {
                margin: 0 0 8px 0;
                color: #666;
                font-size: 14px;
            }
            
            .stat-number {
                font-size: 32px;
                font-weight: bold;
                color: var(--primary-color);
            }
            
            .admin-actions {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #eee;
            }
            
            .admin-access-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                background: rgba(0,0,0,0.7);
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 15000;
                transition: var(--transition);
            }
            
            .admin-access-btn:hover {
                background: rgba(0,0,0,0.9);
                transform: scale(1.1);
            }
            
            .error-message {
                color: #dc3545;
                font-size: 14px;
                margin-top: 8px;
            }
            
            .status-message {
                padding: 12px;
                border-radius: 8px;
                margin-top: 12px;
                font-weight: 500;
            }
            
            .status-message.success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            
            .status-message.error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            
            .status-message.info {
                background: #d1ecf1;
                color: #0c5460;
                border: 1px solid #bee5eb;
            }
            
            .admin-message {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 500;
                z-index: 25000;
                animation: slideDown 0.3s ease-out;
            }
            
            .admin-message.success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            
            .admin-message.error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            
            .admin-message.info {
                background: #d1ecf1;
                color: #0c5460;
                border: 1px solid #bee5eb;
            }
            
            /* Animations */
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes bounce {
                0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
                40%, 43% { transform: translateY(-8px); }
                70% { transform: translateY(-4px); }
                90% { transform: translateY(-2px); }
            }
            
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
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
            
            @keyframes typingDots {
                0%, 80%, 100% {
                    transform: scale(0);
                    opacity: 0.5;
                }
                40% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            
            /* Scrollbar Styling */
            .chat-messages::-webkit-scrollbar,
            .admin-content::-webkit-scrollbar {
                width: 6px;
            }
            
            .chat-messages::-webkit-scrollbar-track,
            .admin-content::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }
            
            .chat-messages::-webkit-scrollbar-thumb,
            .admin-content::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 3px;
            }
            
            .chat-messages::-webkit-scrollbar-thumb:hover,
            .admin-content::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }
            
            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .chat-interface {
                    background: #1a1a1a;
                    color: #ffffff;
                }
                
                .chat-messages {
                    background: #2d2d2d;
                }
                
                .bot-message .message-text {
                    background: #3a3a3a;
                    color: #ffffff;
                }
                
                .input-container {
                    background: #3a3a3a;
                    color: #ffffff;
                }
                
                .user-input {
                    color: #ffffff;
                }
                
                .user-input::placeholder {
                    color: #aaa;
                }
                
                .quick-reply-btn {
                    background: #3a3a3a;
                    color: #ffffff;
                    border-color: #555;
                }
                
                .admin-container {
                    background: #1a1a1a;
                    color: #ffffff;
                }
                
                .admin-input, .admin-textarea {
                    background: #2d2d2d;
                    color: #ffffff;
                    border-color: #555;
                }
                
                .stat-card {
                    background: #2d2d2d;
                    color: #ffffff;
                }
            }
            
            /* Print styles */
            @media print {
                .peterbot-container {
                    display: none !important;
                }
            }
            
            /* High contrast mode */
            @media (prefers-contrast: high) {
                .chat-toggle {
                    border: 2px solid #000;
                }
                
                .message-text {
                    border: 1px solid #000;
                }
                
                .input-container {
                    border: 2px solid #000;
                }
            }
            
            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Initialize bot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePeterBot);
} else {
    initializePeterBot();
}

// Export for potential external use
window.PeterBot = {
    init: initializePeterBot,
    show: showChat,
    hide: hideChat,
    sendMessage: function(message) {
        if (typeof message === 'string' && message.trim()) {
            document.getElementById('user-input').value = message;
            sendMessage();
        }
    },
    addCustomResponse: function(trigger, response) {
        if (typeof trigger === 'string' && typeof response === 'string') {
            KNOWLEDGE_BASE.customResponses = KNOWLEDGE_BASE.customResponses || {};
            KNOWLEDGE_BASE.customResponses[trigger.toLowerCase()] = response;
        }
    },
    updateConfig: function(newConfig) {
        if (typeof newConfig === 'object') {
            Object.assign(BOT_CONFIG, newConfig);
        }
    }
};

})();

// Additional utility functions for enhanced functionality
(function() {
    'use strict';
    
    // Advanced message processing
    function processAdvancedMessage(message) {
        // Handle special commands
        if (message.startsWith('/')) {
            return handleCommand(message);
        }
        
        // Handle mathematical expressions
        if (message.match(/^\s*[\d\+\-\*\/\(\)\s\.]+\s*=?\s*$/)) {
            return handleMathExpression(message);
        }
        
        // Handle date/time queries
        if (message.match(/(what time|what date|today|tomorrow|yesterday)/i)) {
            return handleDateTimeQuery(message);
        }
        
        // Handle weather queries (mock response)
        if (message.match(/(weather|temperature|forecast)/i)) {
            return handleWeatherQuery(message);
        }
        
        return null; // No special processing needed
    }
    
    // Handle bot commands
    function handleCommand(command) {
        const cmd = command.toLowerCase().trim();
        
        switch (cmd) {
            case '/help':
                return `🤖 **Available Commands:**
                
• \`/help\` - Show this help message
• \`/contact\` - Get Peter's contact information
• \`/services\` - List available services
• \`/clear\` - Clear chat history
• \`/time\` - Show current time
• \`/about\` - About Peter and his expertise
• \`/quote\` - Get an inspirational quote

You can also ask me anything about Peter's services, experience, or how he can help you! 😊`;
                
            case '/contact':
                return `📞 **Contact Peter Directly:**
                
📧 **Email:** ${KNOWLEDGE_BASE.contact.email}
📱 **WhatsApp:** ${KNOWLEDGE_BASE.contact.whatsapp}
🌐 **Website:** ${KNOWLEDGE_BASE.contact.website}
📍 **Location:** ${KNOWLEDGE_BASE.contact.location}

**Best times to reach Peter:**
${KNOWLEDGE_BASE.contact.availability}

Feel free to reach out anytime! Peter typically responds within a few hours. 🚀`;
                
            case '/services':
                return `🎯 **Peter's Services:**
                
${KNOWLEDGE_BASE.services.map(service => `• **${service.name}** - ${service.description}`).join('\n')}

💡 Each service is tailored to your specific needs and goals. Contact Peter to discuss how he can help you achieve success!`;
                
            case '/clear':
                setTimeout(() => {
                    clearChatHistory();
                }, 1000);
                return "🧹 Chat history will be cleared in a moment...";
                
            case '/time':
                const now = new Date();
                return `🕐 **Current Time:** ${now.toLocaleString()}
                
📅 **Date:** ${now.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}`;
                
            case '/about':
                return `👨‍💼 **About Peter:**
                
${KNOWLEDGE_BASE.about}

🏆 **Key Achievements:**
• ${KNOWLEDGE_BASE.experience.years}+ years of professional experience
• Helped 500+ businesses achieve their goals
• Expert in multiple industries and technologies
• Proven track record of delivering results

💪 **What sets Peter apart:**
• Personalized approach to every project
• Deep understanding of business challenges
• Innovative solutions that drive growth
• Commitment to long-term partnerships`;
                
            case '/quote':
                const quotes = [
                    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
                    "The only way to do great work is to love what you do. - Steve Jobs",
                    "Innovation distinguishes between a leader and a follower. - Steve Jobs",
                    "Your limitation—it's only your imagination.",
                    "Great things never come from comfort zones.",
                    "Dream it. Wish it. Do it.",
                    "Success doesn't just find you. You have to go out and get it.",
                    "The harder you work for something, the greater you'll feel when you achieve it.",
                    "Don't stop when you're tired. Stop when you're done.",
                    "Wake up with determination. Go to bed with satisfaction."
                ];
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                return `💭 **Inspirational Quote:**
                
"${randomQuote}"
                
Keep pushing forward! Peter is here to help you turn your dreams into reality. 🌟`;
                
            default:
                return `❓ Unknown command: \`${command}\`
                
Type \`/help\` to see available commands, or just ask me anything about Peter's services! 😊`;
        }
    }
    
    // Handle mathematical expressions
    function handleMathExpression(expression) {
        try {
            // Simple math evaluation (safe for basic operations)
            const cleanExpr = expression.replace(/[^0-9+\-*/.() ]/g, '');
            const result = Function('"use strict"; return (' + cleanExpr + ')')();
            
            if (isNaN(result)) {
                throw new Error('Invalid calculation');
            }
            
            return `🧮 **Calculation Result:**
            
\`${expression}\` = **${result}**

Need help with more complex calculations or data analysis? Peter can assist with advanced mathematical modeling and business analytics! 📊`;
        } catch (error) {
            return `❌ I couldn't calculate that expression. Please check your math syntax.

For complex calculations and data analysis, Peter offers professional consulting services! 📈`;
        }
    }
    
    // Handle date/time queries
    function handleDateTimeQuery(message) {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (message.match(/time/i)) {
            return `🕐 **Current Time:** ${now.toLocaleTimeString()}`;
        } else if (message.match(/today/i)) {
            return `📅 **Today is:** ${now.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}`;
        } else if (message.match(/tomorrow/i)) {
            return `📅 **Tomorrow is:** ${tomorrow.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}`;
        } else if (message.match(/yesterday/i)) {
            return `📅 **Yesterday was:** ${yesterday.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}`;
        }
        
        return `📅 **Current Date & Time:**
        
**Date:** ${now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}
**Time:** ${now.toLocaleTimeString()}`;
    }
    
    // Handle weather queries (mock response)
    function handleWeatherQuery(message) {
        return `🌤️ **Weather Information:**
        
I don't have access to real-time weather data, but I can connect you with Peter who can help you with:

• **Business Climate Analysis** 📊
• **Market Weather Reports** 📈
• **Industry Trend Forecasting** 🔮
• **Risk Assessment & Planning** ⚡

For actual weather information, I recommend checking your local weather app or website.

Contact Peter for business forecasting and strategic planning! 🎯`;
    }
    
    // Clear chat history
    function clearChatHistory() {
        if (window.chatHistory) {
            window.chatHistory.length = 0;
            
            if (window.currentSessionId) {
                localStorage.removeItem(`peterbot_chat_${window.currentSessionId}`);
            }
            
            const messagesContainer = document.querySelector('.messages-container');
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
            }
            
            // Add welcome message
            setTimeout(() => {
                if (window.addBotMessage) {
                    window.addBotMessage(window.KNOWLEDGE_BASE.welcomeMessage);
                }
            }, 500);
        }
    }
    
    // Enhanced analytics tracking
    function trackAdvancedAnalytics(eventType, data = {}) {
        const analytics = JSON.parse(localStorage.getItem('peterbot_analytics') || '{}');
        const today = new Date().toISOString().split('T')[0];
        
        // Initialize analytics structure
        if (!analytics.events) analytics.events = {};
        if (!analytics.daily) analytics.daily = {};
        if (!analytics.sessions) analytics.sessions = {};
        
        // Track event
        if (!analytics.events[eventType]) analytics.events[eventType] = 0;
        analytics.events[eventType]++;
        
        // Track daily stats
        if (!analytics.daily[today]) {
            analytics.daily[today] = {
                messages: 0,
                sessions: 0,
                users: 0,
                events: {}
            };
        }
        
        if (!analytics.daily[today].events[eventType]) {
            analytics.daily[today].events[eventType] = 0;
        }
        analytics.daily[today].events[eventType]++;
        
        // Track session data
        if (window.currentSessionId) {
            if (!analytics.sessions[window.currentSessionId]) {
                analytics.sessions[window.currentSessionId] = {
                    startTime: new Date().toISOString(),
                    events: [],
                    messageCount: 0
                };
            }
            
            analytics.sessions[window.currentSessionId].events.push({
                type: eventType,
                timestamp: new Date().toISOString(),
                data: data
            });
            
            if (eventType === 'message_sent' || eventType === 'message_received') {
                analytics.sessions[window.currentSessionId].messageCount++;
                analytics.daily[today].messages++;
            }
        }
        
        // Store updated analytics
        localStorage.setItem('peterbot_analytics', JSON.stringify(analytics));
    }
    
    // Export advanced functions to global scope
    window.PeterBotAdvanced = {
        processAdvancedMessage,
        handleCommand,
        clearChatHistory,
        trackAdvancedAnalytics
    };
    
    // Extend the main PeterBot object
    if (window.PeterBot) {
        Object.assign(window.PeterBot, {
            processAdvanced: processAdvancedMessage,
            runCommand: handleCommand,
            clearHistory: clearChatHistory,
            track: trackAdvancedAnalytics
        });
    }
    
})();

// Performance monitoring and optimization
(function() {
    'use strict';
    
    // Performance metrics
    const performanceMetrics = {
        startTime: performance.now(),
        loadTime: 0,
        messageCount: 0,
        averageResponseTime: 0,
        totalResponseTime: 0
    };
    
    // Monitor bot performance
    function monitorPerformance() {
        performanceMetrics.loadTime = performance.now() - performanceMetrics.startTime;
        
        // Log performance metrics
        console.log('PeterBot Performance Metrics:', {
            loadTime: `${performanceMetrics.loadTime.toFixed(2)}ms`,
            messageCount: performanceMetrics.messageCount,
            averageResponseTime: `${performanceMetrics.averageResponseTime.toFixed(2)}ms`
        });
        
        // Store performance data
        localStorage.setItem('peterbot_performance', JSON.stringify(performanceMetrics));
    }
    
    // Optimize images and assets
    function optimizeAssets() {
        // Lazy load images
        const images = document.querySelectorAll('.peterbot-container img');
        images.forEach(img => {
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }
        });
        
        // Preload critical assets
        const criticalAssets = [
            window.BOT_CONFIG?.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0Qzc5RkYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiLz4KPC9zdmc+Cjwvc3ZnPgo='
        ];
        
        criticalAssets.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    // Memory management
    function manageMemory() {
        // Clean up old chat sessions (keep only last 10)
        const sessions = JSON.parse(localStorage.getItem('peterbot_sessions_index') || '[]');
        if (sessions.length > 10) {
            const sessionsToRemove = sessions.slice(0, sessions.length - 10);
            sessionsToRemove.forEach(sessionId => {
                localStorage.removeItem(`peterbot_chat_${sessionId}`);
            });
            
            const updatedSessions = sessions.slice(-10);
            localStorage.setItem('peterbot_sessions_index', JSON.stringify(updatedSessions));
        }
        
        // Clean up old analytics data (keep only last 30 days)
        const analytics = JSON.parse(localStorage.getItem('peterbot_analytics') || '{}');
        if (analytics.daily) {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            Object.keys(analytics.daily).forEach(date => {
                if (new Date(date) < thirtyDaysAgo) {
                    delete analytics.daily[date];
                }
            });
            
            localStorage.setItem('peterbot_analytics', JSON.stringify(analytics));
        }
    }
    
    // Error handling and recovery
    function setupErrorHandling() {
        window.addEventListener('error', function(event) {
            console.error('PeterBot Error:', event.error);
            
            // Log error for debugging
            const errorLog = JSON.parse(localStorage.getItem('peterbot_errors') || '[]');
            errorLog.push({
                message: event.error?.message || 'Unknown error',
                stack: event.error?.stack || 'No stack trace',
                timestamp: new Date().toISOString(),
                url: event.filename,
                line: event.lineno
            });
            
            // Keep only last 50 errors
            if (errorLog.length > 50) {
                errorLog.splice(0, errorLog.length - 50);
            }
            
            localStorage.setItem('peterbot_errors', JSON.stringify(errorLog));
        });
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', function(event) {
            console.error('PeterBot Unhandled Promise Rejection:', event.reason);
        });
    }
    
    // Initialize performance monitoring
    function initializePerformanceMonitoring() {
        // Monitor when bot is fully loaded
        if (document.readyState === 'complete') {
            setTimeout(monitorPerformance, 100);
        } else {
            window.addEventListener('load', () => {
                setTimeout(monitorPerformance, 100);
            });
        }
        
        // Optimize assets
        optimizeAssets();
        
        // Setup memory management
        setInterval(manageMemory, 5 * 60 * 1000); // Every 5 minutes
        
        // Setup error handling
        setupErrorHandling();
        
        // Monitor performance periodically
        setInterval(() => {
            monitorPerformance();
        }, 60 * 1000); // Every minute
    }
    
    // Track message response time
    function trackResponseTime(startTime) {
        const responseTime = performance.now() - startTime;
        performanceMetrics.messageCount++;
        performanceMetrics.totalResponseTime += responseTime;
        performanceMetrics.averageResponseTime = performanceMetrics.totalResponseTime / performanceMetrics.messageCount;
        
        return responseTime;
    }
    
    // Export performance functions
    window.PeterBotPerformance = {
        monitor: monitorPerformance,
        optimize: optimizeAssets,
        trackResponse: trackResponseTime,
        getMetrics: () => ({ ...performanceMetrics })
    };
    
    // Initialize performance monitoring
    initializePerformanceMonitoring();
    
})();

// Final initialization and cleanup
(function() {
    'use strict';
    
    // Ensure bot is properly initialized
    function ensureBotInitialization() {
        let attempts = 0;
        const maxAttempts = 10;
        
        const checkInitialization = () => {
            attempts++;
            
            if (window.PeterBot && document.querySelector('.peterbot-container')) {
                console.log('✅ PeterBot successfully initialized');
                return;
            }
            
            if (attempts < maxAttempts) {
                setTimeout(checkInitialization, 500);
            } else {
                console.error('❌ PeterBot failed to initialize after', maxAttempts, 'attempts');
                
                // Attempt emergency initialization
                try {
                    if (window.initializePeterBot) {
                        window.initializePeterBot();
                    }
                } catch (error) {
                    console.error('Emergency initialization failed:', error);
                }
            }
        };
        
        checkInitialization();
    }
    
    // Cleanup function for page unload
    function cleanup() {
        // Save any pending data
        if (window.saveChatHistory) {
            window.saveChatHistory();
        }
        
        // Track session end
        if (window.PeterBotAdvanced?.trackAdvancedAnalytics) {
            window.PeterBotAdvanced.trackAdvancedAnalytics('session_end');
        }
        
        // Clear any intervals or timeouts
        if (window.botIntervals) {
            window.botIntervals.forEach(clearInterval);
        }
        
        if (window.botTimeouts) {
            window.botTimeouts.forEach(clearTimeout);
        }
    }
    
    // Setup cleanup handlers
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup);
    
    // Ensure initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureBotInitialization);
    } else {
        ensureBotInitialization();
    }
    
    // Global success message
    console.log(`
    🤖 PeterBot v${window.BOT_CONFIG?.version || '1.0.0'} Loaded Successfully!
    ();


