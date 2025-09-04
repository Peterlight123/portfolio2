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
    const adminAccessBtn = document.getElementById('admin-access');
    if (adminAccessBtn) {
        adminAccessBtn.addEventListener('click', () => {
            document.getElementById('peterbot-admin-panel').style.display = 'flex';
        });
    }
    
    // Close admin panel
    const adminCloseBtn = document.getElementById('admin-close');
    if (adminCloseBtn) {
        adminCloseBtn.addEventListener('click', () => {
            document.getElementById('peterbot-admin-panel').style.display = 'none';
        });
    }
    
    // Admin login
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminPassword = document.getElementById('admin-password');
    
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', handleAdminLogin);
    }
    
    if (adminPassword) {
        adminPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAdminLogin();
        });
    }
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchAdminTab(tabName);
        });
    });
    
    // Save settings
    const saveSettingsBtn = document.getElementById('save-settings');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveAdminSettings);
    }
    
    // Test API
    const testApiBtn = document.getElementById('test-api');
    if (testApiBtn) {
        testApiBtn.addEventListener('click', testAPIConnection);
    }
    
    // Theme preview
    const previewThemeBtn = document.getElementById('preview-theme');
    const resetThemeBtn = document.getElementById('reset-theme');
    
    if (previewThemeBtn) {
        previewThemeBtn.addEventListener('click', previewTheme);
    }
    
    if (resetThemeBtn) {
        resetThemeBtn.addEventListener('click', resetTheme);
    }
    
    // Export functions
    const exportSettingsBtn = document.getElementById('export-settings');
    const exportConversationsBtn = document.getElementById('export-conversations');
    const exportAnalyticsBtn = document.getElementById('export-analytics');
    
    if (exportSettingsBtn) {
        exportSettingsBtn.addEventListener('click', () => exportData('settings'));
    }
    
    if (exportConversationsBtn) {
        exportConversationsBtn.addEventListener('click', () => exportData('conversations'));
    }
    
    if (exportAnalyticsBtn) {
        exportAnalyticsBtn.addEventListener('click', () => exportData('analytics'));
    }
    
    // Import function
    const importDataBtn = document.getElementById('import-data');
    if (importDataBtn) {
        importDataBtn.addEventListener('click', importData);
    }
    
    // Backup functions
    const createBackupBtn = document.getElementById('create-backup');
    const clearDataBtn = document.getElementById('clear-data');
    
    if (createBackupBtn) {
        createBackupBtn.addEventListener('click', createBackup);
    }
    
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', clearAllData);
    }
    
    // Restart bot
    const restartBotBtn = document.getElementById('restart-bot');
    if (restartBotBtn) {
        restartBotBtn.addEventListener('click', restartBot);
    }
}

// Handle admin login
function handleAdminLogin() {
    const passwordInput = document.getElementById('admin-password');
    const errorDiv = document.getElementById('login-error');
    
    if (!passwordInput || !errorDiv) return;
    
    const password = passwordInput.value;
    
    if (password === ADMIN_CONFIG.password) {
        ADMIN_CONFIG.isAuthenticated = true;
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-interface').style.display = 'block';
        loadAnalytics();
        errorDiv.textContent = '';
    } else {
        errorDiv.innerHTML = '<strong>❌ Invalid password. Please try again.</strong>';
        passwordInput.value = '';
    }
}

// Switch admin tabs
function switchAdminTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(`tab-${tabName}`);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedContent) selectedContent.classList.add('active');
}

// Save admin settings
function saveAdminSettings() {
    const settings = {
        botName: getElementValue('bot-name') || BOT_CONFIG.name,
        botAvatar: getElementValue('bot-avatar') || BOT_CONFIG.avatar,
        welcomeMessage: getElementValue('welcome-message') || BOT_CONFIG.welcomeMessage,
        responseDelay: parseInt(getElementValue('response-delay')) || BOT_CONFIG.responseDelay,
        showTypingIndicator: getElementChecked('show-typing'),
        showQuickReplies: getElementChecked('show-quick-replies'),
        apiKey: getElementValue('api-key') || BOT_CONFIG.apiKey,
        apiEndpoint: getElementValue('api-endpoint') || BOT_CONFIG.apiEndpoint,
        useAI: getElementChecked('use-ai'),
        theme: {
            primaryColor: getElementValue('primary-color') || BOT_CONFIG.theme.primaryColor,
            secondaryColor: getElementValue('secondary-color') || BOT_CONFIG.theme.secondaryColor,
            accentColor: getElementValue('accent-color') || BOT_CONFIG.theme.accentColor,
            backgroundColor: getElementValue('bg-color') || BOT_CONFIG.theme.backgroundColor
        }
    };
    
    // Update BOT_CONFIG
    Object.assign(BOT_CONFIG, settings);
    
    // Save to localStorage
    try {
        localStorage.setItem('peterbot_settings', JSON.stringify(settings));
        
        // Apply theme changes
        applyTheme();
        
        // Show success message
        showAdminMessage('✅ Settings saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving settings:', error);
        showAdminMessage('❌ Error saving settings!', 'error');
    }
}

// Helper functions for getting element values safely
function getElementValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : null;
}

function getElementChecked(id) {
    const element = document.getElementById(id);
    return element ? element.checked : false;
}

// Test API connection
async function testAPIConnection() {
    const apiKey = getElementValue('api-key');
    const statusDiv = document.getElementById('api-status');
    
    if (!statusDiv) return;
    
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
    
    const primaryColorInput = document.getElementById('primary-color');
    const secondaryColorInput = document.getElementById('secondary-color');
    const accentColorInput = document.getElementById('accent-color');
    const bgColorInput = document.getElementById('bg-color');
    
    if (primaryColorInput) primaryColorInput.value = defaultTheme.primaryColor;
    if (secondaryColorInput) secondaryColorInput.value = defaultTheme.secondaryColor;
    if (accentColorInput) accentColorInput.value = defaultTheme.accentColor;
    if (bgColorInput) bgColorInput.value = defaultTheme.backgroundColor;
    
    BOT_CONFIG.theme = { ...BOT_CONFIG.theme, ...defaultTheme };
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
    try {
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
        
        const totalConversationsEl = document.getElementById('total-conversations');
        const messagesTodayEl = document.getElementById('messages-today');
        const activeSessionsEl = document.getElementById('active-sessions');
        
        if (totalConversationsEl) totalConversationsEl.textContent = sessions.length;
        if (messagesTodayEl) messagesTodayEl.textContent = messagesToday;
        if (activeSessionsEl) activeSessionsEl.textContent = sessions.length > 0 ? 1 : 0;
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

// Export data functions
function exportData(type) {
    let data = {};
    let filename = '';
    
    try {
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
    } catch (error) {
        console.error('Export error:', error);
        showAdminMessage(`❌ Error exporting ${type}!`, 'error');
    }
}

// Import data function
function importData() {
    const fileInput = document.getElementById('import-file');
    
    if (!fileInput) return;
    
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
            console.error('Import error:', error);
            showAdminMessage('❌ Error parsing file.', 'error');
        }
    };
    reader.readAsText(file);
}

// Create backup
function createBackup() {
    try {
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
    } catch (error) {
        console.error('Backup error:', error);
        showAdminMessage('❌ Error creating backup!', 'error');
    }
}

// Clear all data
function clearAllData() {
    if (confirm('⚠️ Are you sure you want to clear all data? This action cannot be undone.')) {
        try {
            // Clear all PeterBot related localStorage items
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('peterbot_')) {
                    localStorage.removeItem(key);
                }
            });
            
            // Reset chat history
            chatHistory = [];
            
            // Clear chat container
            const messagesContainer = document.querySelector('.peterbot-messages');
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
            }
            
            showAdminMessage('<span style="color: #4CAF50; font-weight: bold;">✅ All data cleared successfully!</span>', 'success');
            
            // Restart bot after clearing
            setTimeout(() => {
                restartBot();
            }, 1500);
        } catch (error) {
            console.error('Clear data error:', error);
            showAdminMessage('<span style="color: #f44336; font-weight: bold;">❌ Error clearing data!</span>', 'error');
        }
    }
}

// Restart bot
function restartBot() {
    try {
        // Hide admin panel
        document.getElementById('peterbot-admin-panel').style.display = 'none';
        
        // Remove existing bot container
        if (botContainer) {
            botContainer.remove();
        }
        
        // Reset variables
        currentSessionId = null;
        chatHistory = [];
        isTyping = false;
        
        // Reinitialize bot
        setTimeout(() => {
            initializeBot();
            showAdminMessage('<span style="color: #2196F3; font-weight: bold;">🔄 Bot restarted successfully!</span>', 'info');
        }, 500);
    } catch (error) {
        console.error('Restart error:', error);
        showAdminMessage('<span style="color: #f44336; font-weight: bold;">❌ Error restarting bot!</span>', 'error');
    }
}

// Show admin messages
function showAdminMessage(message, type = 'info') {
    // Create or update admin message element
    let messageEl = document.getElementById('admin-message');
    
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'admin-message';
        messageEl.className = 'admin-message';
        
        const adminContent = document.querySelector('.admin-content');
        if (adminContent) {
            adminContent.appendChild(messageEl);
        }
    }
    
    messageEl.innerHTML = message;
    messageEl.className = `admin-message ${type}`;
    messageEl.style.display = 'block';
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        if (messageEl) {
            messageEl.style.display = 'none';
        }
    }, 3000);
}

// Create bot container with enhanced styling
function createBotContainer() {
    const containerHTML = `
        <div id="peterbot-container" class="peterbot-container">
            <div class="peterbot-header">
                <div class="bot-avatar">
                    <img src="${BOT_CONFIG.avatar}" alt="${BOT_CONFIG.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiLz4KPC9zdmc+Cg=='">
                </div>
                <div class="bot-info">
                    <div class="bot-name">
                        <span style="color: #667eea; font-weight: bold;">${BOT_CONFIG.name}</span>
                        <span class="bot-version" style="color: #999; font-size: 0.8em;">v${BOT_CONFIG.version}</span>
                    </div>
                    <div class="bot-status">
                        <span class="status-indicator"></span>
                        <span style="color: #4CAF50; font-weight: bold;">Online</span>
                    </div>
                </div>
                <div class="bot-controls">
                    <button id="minimize-bot" class="control-btn" title="Minimize">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 13H5v-2h14v2z"/>
                        </svg>
                    </button>
                    <button id="close-bot" class="control-btn" title="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="peterbot-messages" id="peterbot-messages">
                <!-- Messages will be inserted here -->
            </div>
            
            <div class="peterbot-quick-replies" id="peterbot-quick-replies" style="display: none;">
                <!-- Quick replies will be inserted here -->
            </div>
            
            <div class="peterbot-input-container">
                <div class="input-wrapper">
                    <input type="text" id="peterbot-input" class="peterbot-input" 
                           placeholder="Type your message..." maxlength="500">
                    <button id="peterbot-send" class="peterbot-send-btn" title="Send message">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
                <div class="input-footer">
                    <span style="color: #999; font-size: 0.75em;">
                        Powered by <span style="color: #667eea; font-weight: bold;">PeterBot AI</span>
                    </span>
                </div>
            </div>
            
            <div class="peterbot-typing" id="peterbot-typing" style="display: none;">
                <div class="typing-avatar">
                    <img src="${BOT_CONFIG.avatar}" alt="Bot typing">
                </div>
                <div class="typing-indicator">
                    <span style="color: #667eea; font-weight: bold;">${BOT_CONFIG.name} is typing</span>
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Bot Toggle Button -->
        <div id="peterbot-toggle" class="peterbot-toggle" title="Open PeterBot">
            <div class="toggle-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
            </div>
            <div class="notification-badge" id="notification-badge" style="display: none;">
                <span style="color: white; font-weight: bold; font-size: 0.7em;">1</span>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', containerHTML);
    botContainer = document.getElementById('peterbot-container');
    
    setupBotEventListeners();
    applyTheme();
}

// Setup bot event listeners
function setupBotEventListeners() {
    // Toggle bot visibility
    const toggleBtn = document.getElementById('peterbot-toggle');
    const minimizeBtn = document.getElementById('minimize-bot');
    const closeBtn = document.getElementById('close-bot');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (botContainer) {
                const isVisible = botContainer.style.display !== 'none';
                botContainer.style.display = isVisible ? 'none' : 'flex';
                toggleBtn.style.display = isVisible ? 'flex' : 'none';
                
                // Hide notification badge when opened
                const badge = document.getElementById('notification-badge');
                if (badge && !isVisible) {
                    badge.style.display = 'none';
                }
            }
        });
    }
    
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            if (botContainer && toggleBtn) {
                botContainer.style.display = 'none';
                toggleBtn.style.display = 'flex';
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (botContainer && toggleBtn) {
                botContainer.style.display = 'none';
                toggleBtn.style.display = 'flex';
            }
        });
    }
    
    // Message input handling
    const messageInput = document.getElementById('peterbot-input');
    const sendBtn = document.getElementById('peterbot-send');
    
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        messageInput.addEventListener('input', (e) => {
            const sendButton = document.getElementById('peterbot-send');
            if (sendButton) {
                sendButton.disabled = e.target.value.trim().length === 0;
            }
        });
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
}

// Send message function with enhanced formatting
function sendMessage() {
    const messageInput = document.getElementById('peterbot-input');
    
    if (!messageInput) return;
    
    const message = messageInput.value.trim();
    
    if (!message || isTyping) return;
    
    // Add user message
    addUserMessage(message);
    
    // Clear input
    messageInput.value = '';
    
    // Process bot response
    setTimeout(() => {
        processBotResponse(message);
    }, BOT_CONFIG.responseDelay);
}

// Add user message with styling
function addUserMessage(message) {
    const messagesContainer = document.getElementById('peterbot-messages');
    
    if (!messagesContainer) return;
    
    const messageEl = document.createElement('div');
    messageEl.className = 'message user-message';
    messageEl.innerHTML = `
        <div class="message-content">
            <div class="message-text">
                <span style="color: #333; font-weight: normal;">${escapeHtml(message)}</span>
            </div>
            <div class="message-time">
                <span style="color: #999; font-size: 0.75em;">${formatTime(new Date())}</span>
            </div>
        </div>
        <div class="message-avatar">
            <div class="user-avatar">
                <span style="color: white; font-weight: bold;">U</span>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(messageEl);
    scrollToBottom();
    
    // Save to chat history
    chatHistory.push({
        type: 'user',
        message: message,
        time: new Date().toISOString()
    });
    
    saveChatHistory();
}

// Add bot message with enhanced styling and colors
function addBotMessage(message) {
    const messagesContainer = document.getElementById('peterbot-messages');
    
    if (!messagesContainer) return;
    
    // Hide typing indicator
    hideTypingIndicator();
    
    const messageEl = document.createElement('div');
    messageEl.className = 'message bot-message';
    
    // Process message for enhanced formatting
    const formattedMessage = formatBotMessage(message);
    
    messageEl.innerHTML = `
        <div class="message-avatar">
            <img src="${BOT_CONFIG.avatar}" alt="${BOT_CONFIG.name}" class="bot-avatar-img">
        </div>
        <div class="message-content">
            <div class="message-header">
                <span style="color: #667eea; font-weight: bold; font-size: 0.85em;">${BOT_CONFIG.name}</span>
            </div>
            <div class="message-text">
                ${formattedMessage}
            </div>
            <div class="message-time">
                <span style="color: #999; font-size: 0.75em;">${formatTime(new Date())}</span>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(messageEl);
    scrollToBottom();
    
    // Save to chat history
    chatHistory.push({
        type: 'bot',
        message: message,
        time: new Date().toISOString()
    });
    
    saveChatHistory();
}

// Format bot message with colors and styling
function formatBotMessage(message) {
    // Convert markdown-style formatting to HTML with colors
    let formatted = message
        // Bold text with color
        .replace(/\*\*(.*?)\*\*/g, '<span style="font-weight: bold; color: #667eea;">$1</span>')
        // Italic text
        .replace(/\*(.*?)\*/g, '<span style="font-style: italic; color: #764ba2;">$1</span>')
        // Code blocks
        .replace(/`(.*?)`/g, '<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 3px; color: #e91e63; font-weight: bold;">$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #4CAF50; font-weight: bold; text-decoration: none;">$1</a>')
        // Line breaks
        .replace(/\n/g, '<br>')
        // Emojis enhancement
        .replace(/(👋|🎯|💼|🎷|📧|📱|💰|✅|❌|🔥|⭐|🚀)/g, '<span style="font-size: 1.2em;">$1</span>');
    
    // Add special formatting for service sections
    formatted = formatted
        .replace(/(Web Development|Virtual Assistant|Digital Marketing|Saxophone Performance)/g, 
                '<span style="color: #667eea; font-weight: bold; font-size: 1.1em;">$1</span>')
        .replace(/(₦[\d,]+|$[\d,]+)/g, 
                '<span style="color: #4CAF50; font-weight: bold; background: #e8f5e8; padding: 1px 4px; border-radius: 3px;">$1</span>')
        .replace(/(Free|Available|Professional)/g, 
                '<span style="color: #2196F3; font-weight: bold;">$1</span>');
    
    return formatted;
}

// Show typing indicator
function showTypingIndicator() {
    if (!BOT_CONFIG.showTypingIndicator) return;
    
    const typingEl = document.getElementById('peterbot-typing');
    if (typingEl) {
        typingEl.style.display = 'flex';
        isTyping = true;
        scrollToBottom();
    }
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingEl = document.getElementById('peterbot-typing');
    if (typingEl) {
        typingEl.style.display = 'none';
        isTyping = false;
    }
}

// Process bot response with AI integration
async function processBotResponse(userMessage) {
    showTypingIndicator();
    
    let response = '';
    
    try {
        if (BOT_CONFIG.useAI && BOT_CONFIG.apiKey) {
            response = await getAIResponse(userMessage);
        } else {
            response = getKnowledgeBaseResponse(userMessage);
        }
        
        setTimeout(() => {
            addBotMessage(response);
            
            // Show quick replies after response
            if (BOT_CONFIG.showQuickReplies) {
                setTimeout(() => {
                    showQuickReplies();
                }, 500);
            }
        }, BOT_CONFIG.responseDelay);
        
    } catch (error) {
        console.error('Error processing response:', error);
        setTimeout(() => {
            addBotMessage(`<span style="color: #f44336; font-weight: bold;">❌ Sorry, I encountered an error.</span> Let me help you with my <span style="color: #667eea; font-weight: bold;">available services</span> instead! 🚀`);
        }, BOT_CONFIG.responseDelay);
    }
}

// Get AI response from OpenAI
async function getAIResponse(userMessage) {
    if (!BOT_CONFIG.apiKey) {
        throw new Error('API key not configured');
    }
    
    const systemPrompt = `You are PeterBot, Peter's professional AI assistant. You help with:
    
    **Services:**
    - 🌐 **Web Development**: Responsive websites, e-commerce, web apps
    - 👨‍💼 **Virtual Assistant**: Admin support, email management, social media
    - 📈 **Digital Marketing**: SEO, social media marketing, content strategy  
    - 🎷 **Saxophone Performance**: Live events, church programs, recordings
    
    **Contact Info:**
    - Email: petereluwade55@gmail.com
    - WhatsApp: +234 8108821809
    - Social: @peterphonist (all platforms)
    
    Always be professional, helpful, and highlight Peter's expertise. Use emojis and formatting for engaging responses.`;
    
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
                    { role: 'user', content: userMessage }
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
        return getKnowledgeBaseResponse(userMessage);
    }
}

// Get knowledge base response with enhanced formatting
function getKnowledgeBaseResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Greeting responses
    if (message.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
        return `👋 <span style="color: #667eea; font-weight: bold;">Hello there!</span> Welcome to **Peter's Professional Services**! 

I'm here to help you with:
🌐 <span style="color: #2196F3; font-weight: bold;">Web Development & Design</span>
👨‍💼 <span style="color: #9C27B0; font-weight: bold;">Virtual Assistant Services</span>  
📈 <span style="color: #FF9800; font-weight: bold;">Digital Marketing</span>
🎷 <span style="color: #4CAF50; font-weight: bold;">Saxophone Performances</span>

What service interests you most? 🚀`;
    }
    
    // Web development inquiries
    if (message.match(/(web|website|development|design|coding|programming|html|css|javascript|react)/)) {
        return `🌐 <span style="color: #667eea; font-weight: bold; font-size: 1.2em;">Web Development & Design Services</span>

**<span style="color: #2196F3;">What I Offer:</span>**
✅ <span style="color: #4CAF50; font-weight: bold;">Responsive Website Development</span>
✅ <span style="color: #4CAF50; font-weight: bold;">E-commerce Solutions</span>
✅ <span style="color: #4CAF50; font-weight: bold;">Web Application Development</span>
✅ <span style="color: #4CAF50; font-weight: bold;">Website Redesign & Optimization</span>
✅ <span style="color: #4CAF50; font-weight: bold;">CMS Development (WordPress)</span>
✅ <span style="color: #4CAF50; font-weight: bold;">API Integration</span>

**<span style="color: #FF9800;">Pricing:</span>**
💰 Basic Sites: <span style="color: #4CAF50; font-weight: bold;">$200-1,000 (₦150,000-₦750,000)</span>
💰 Business Sites: <span style="color: #4CAF50; font-weight: bold;">$1,000-3,000 (₦750,000-₦2,250,000)</span>
💰 Complex Apps: <span style="color: #4CAF50; font-weight: bold;">$3,000-7,000 (₦2,250,000-₦5,250,000)</span>

**<span style="color: #9C27B0;">Technologies:</span>** HTML5, CSS3, JavaScript, React, Bootstrap, PHP, WordPress

Ready to bring your vision to life? 🚀 Contact me for a **<span style="color: #f44336; font-weight: bold;">FREE consultation!</span>**`;
    }
    
    // Virtual assistant inquiries
    if (message.match(/(virtual assistant|va|admin|support|management|email|social media)/)) {
        return `👨‍💼 <span style="color: #9C27B0; font-weight: bold; font-size: 1.2em;">Virtual Assistant Services</span>

**<span style="color: #2196F3;">Professional Remote Support:</span>**
📋 <span style="color: #4CAF50; font-weight: bold;">Administrative Support</span>
📧 <span style="color: #4CAF50; font-weight: bold;">Email Management</span>
📱 <span style="color: #4CAF50; font-weight: bold;">Social Media Management</span>
✍️ <span style="color: #4CAF50; font-weight: bold;">Content Creation & Copywriting</span>
🔍 <span style="color: #4CAF50; font-weight: bold;">Research & Data Analysis</span>
📊 <span style="color: #4CAF50; font-weight: bold;">Project Management</span>
🎧 <span style="color: #4CAF50; font-weight: bold;">Customer Service Support</span>
🎯 <span style="color: #4CAF50; font-weight: bold;">Lead Generation</span>

**<span style="color: #FF9800;">Flexible Pricing:</span>**
⏰ Hourly: <span style="color: #4CAF50; font-weight: bold;">$10-30 (₦7,500-₦22,500)</span>
📅 Part-time: <span style="color: #4CAF50; font-weight: bold;">$800-1,500 (₦600,000-₦1,125,000)/month</span>
🕐 Full-time: <span style="color: #4CAF50; font-weight: bold;">$1,500-3,000 (₦1,125,000-₦2,250,000)/month</span>

Let me handle your tasks so you can focus on growing your business! 💼`;
    }
    
    // Digital marketing inquiries
    if (message.match(/(digital marketing|marketing|seo|social media|advertising|promotion|brand)/)) {
        return `📈 <span style="color: #FF9800; font-weight: bold; font-size: 1.2em;">Digital Marketing Services</span>

**<span style="color: #2196F3;">Grow Your Online Presence:</span>**
📱 <span style="color: #4CAF50; font-weight: bold;">Social Media Marketing</span>
📝 <span style="color: #4CAF50; font-weight: bold;">Content Marketing Strategy</span>
🔍 <span style="color: #4CAF50; font-weight: bold;">SEO Optimization</span>
📧 <span style="color: #4CAF50; font-weight: bold;">Email Marketing Campaigns</span>
💰 <span style="color: #4CAF50; font-weight: bold;">PPC Advertising Management</span>
📊 <span style="color: #4CAF50; font-weight: bold;">Analytics & Reporting</span>
🎨 <span style="color: #4CAF50; font-weight: bold;">Brand Development</span>
🤖 <span style="color: #4CAF50; font-weight: bold;">Marketing Automation</span>

**<span style="color: #FF9800;">Investment Packages:</span>**
🥉 Basic: <span style="color: #4CAF50; font-weight: bold;">$300-800 (₦225,000-₦600,000)/month</span>
🥈 Standard: <span style="color: #4CAF50; font-weight: bold;">$800-2,000 (₦600,000-₦1,500,000)/month</span>
🥇 Premium: <span style="color: #4CAF50; font-weight: bold;">$2,000-5,000 (₦1,500,000-₦3,750,000)/month</span>

Ready to dominate your market? Let's create a winning strategy! 🏆`;
    }
    
    // Saxophone performance inquiries
    if (message.match(/(saxophone|sax|music|performance|peterphonist|wedding|event|church)/)) {
        return `🎷 <span style="color: #4CAF50; font-weight: bold; font-size: 1.2em;">Professional Saxophone Performances</span>

**<span style="color: #2196F3;">As "Peterphonist" - Your Musical Experience:</span>**
🎊 <span style="color: #4CAF50; font-weight: bold;">Live Event Performances</span> (Weddings, Parties, Concerts)
⛪ <span style="color: #4CAF50; font-weight: bold;">Church Programs & Worship</span> (Free - Transportation only!)
🎵 <span style="color: #4CAF50; font-weight: bold;">Session Recordings</span> (Songs & Albums)
🎼 <span style="color: #4CAF50; font-weight: bold;">Background Instrumental Music</span>
💝 <span style="color: #4CAF50; font-weight: bold;">Personalized Saxophone Renditions</span>

**<span style="color: #FF9800;">Performance Rates:</span>**
🎉 Live Events: <span style="color: #4CAF50; font-weight: bold;">$200-500 (₦150,000-₦380,000)</span>
⛪ Church Programs: <span style="color: #4CAF50; font-weight: bold;">FREE</span> (Transportation costs only)
🎧 Studio Sessions: <span style="color: #4CAF50; font-weight: bold;">$100-300 (₦75,000-₦225,000)/track</span>
🎁 Custom Songs: <span style="color: #4CAF50; font-weight: bold;">$75-150 (₦55,000-₦115,000)</span>

**<span style="color: #9C27B0;">Follow @peterphonist</span>** on all social platforms for amazing performances! 🎶

Let's make your event unforgettable with soulful saxophone melodies! ✨`;
    }
    
    // Pricing inquiries
    if (message.match(/(price|cost|rate|fee|budget|how much|pricing)/)) {
        return `💰 <span style="color: #FF9800; font-weight: bold; font-size: 1.2em;">Professional Service Pricing</span>

**<span style="color: #667eea;">🌐 Web Development:</span>**
• Basic: <span style="color: #4CAF50; font-weight: bold;">$200-1,000 (₦150K-₦750K)</span>
• Business: <span style="color: #4CAF50; font-weight: bold;">$1,000-3,000 (₦750K-₦2.25M)</span>
• Enterprise: <span style="color: #4CAF50; font-weight: bold;">$3,000-7,000 (₦2.25M-₦5.25M)</span>

**<span style="color: #9C27B0;">👨‍💼 Virtual Assistant:</span>**
• Hourly: <span style="color: #4CAF50; font-weight: bold;">$10-30 (₦7.5K-₦22.5K)</span>
• Part-time: <span style="color: #4CAF50; font-weight: bold;">$800-1,500 (₦600K-₦1.125M)/month</span>
• Full-time: <span style="color: #4CAF50; font-weight: bold;">$1,500-3,000 (₦1.125M-₦2.25M)/month</span>

**<span style="color: #FF9800;">📈 Digital Marketing:</span>**
• Basic: <span style="color: #4CAF50; font-weight: bold;">$300-800 (₦225K-₦600K)/month</span>
• Standard: <span style="color: #4CAF50; font-weight: bold;">$800-2,000 (₦600K-₦1.5M)/month</span>
• Premium: <span style="color: #4CAF50; font-weight: bold;">$2,000-5,000 (₦1.5M-₦3.75M)/month</span>

**<span style="color: #4CAF50;">🎷 Saxophone Performance:</span>**
• Live Events: <span style="color: #4CAF50; font-weight: bold;">$200-500 (₦150K-₦380K)</span>
• Church: <span style="color: #4CAF50; font-weight: bold;">FREE</span> (Transport only)
• Recordings: <span style="color: #4CAF50; font-weight: bold;">$100-300 (₦75K-₦225K)/track</span>

**<span style="color: #f44336; font-weight: bold;">🎁 Special Offer:</span>** First consultation is always **FREE!** 🚀`;
    }
    
    // Contact inquiries
    if (message.match(/(contact|reach|phone|email|whatsapp|telegram|social)/)) {
        return `📞 <span style="color: #2196F3; font-weight: bold; font-size: 1.2em;">Get In Touch With Peter</span>

**<span style="color: #FF9800;">📧 Primary Contact:</span>**
Email: <span style="color: #4CAF50; font-weight: bold;">petereluwade55@gmail.com</span>

**<span style="color: #FF9800;">📱 Instant Messaging:</span>**
WhatsApp: <span style="color: #4CAF50; font-weight: bold;">+234 8108821809</span>
Telegram: <span style="color: #4CAF50; font-weight: bold;">@peterlightspeed</span>

**<span style="color: #FF9800;">🌐 Online Presence:</span>**
Portfolio: <span style="color: #4CAF50; font-weight: bold;">peterlight123.github.io/portfolio</span>

**<span style="color: #FF9800;">📱 Social Media (@peterphonist):</span>**
🎥 YouTube: <span style="color: #f44336; font-weight: bold;">@peterphonist</span>
📘 Facebook: <span style="color: #3b5998; font-weight: bold;">@peterphonist</span>
📷 Instagram: <span style="color: #e4405f; font-weight: bold;">@peterphonist</span>
🎵 TikTok: <span style="color: #000; font-weight: bold;">@peterphonist</span>
🐦 Twitter: <span style="color: #1da1f2; font-weight: bold;">@peterphonist</span>

**<span style="color: #9C27B0;">⏰ Response Time:</span>** Usually within <span style="color: #4CAF50; font-weight: bold;">2-4 hours</span> during business hours!

Ready to start your project? Let's connect! 🚀`;
    }
    
    // About Peter inquiries
    if (message.match(/(about|who|peter|background|experience|skills)/)) {
        return `👨‍💻 <span style="color: #667eea; font-weight: bold; font-size: 1.2em;">Meet Peter - Your Multi-Talented Professional</span>

**<span style="color: #2196F3;">🎯 Professional Expertise:</span>**
🌐 <span style="color: #4CAF50; font-weight: bold;">Full-Stack Web Developer</span> - Creating stunning, responsive websites
👨‍💼 <span style="color: #4CAF50; font-weight: bold;">Virtual Assistant Expert</span> - Streamlining business operations  
📈 <span style="color: #4CAF50; font-weight: bold;">Digital Marketing Strategist</span> - Growing online presence
🎷 <span style="color: #4CAF50; font-weight: bold;">Professional Saxophonist "Peterphonist"</span> - Creating memorable musical experiences

**<span style="color: #FF9800;">💡 What Makes Peter Special:</span>**
✨ <span style="color: #9C27B0; font-weight: bold;">Multi-disciplinary expertise</span> across tech and arts
✨ <span style="color: #9C27B0; font-weight: bold;">Client-focused approach</span> with personalized solutions
✨ <span style="color: #9C27B0; font-weight: bold;">Proven track record</span> of successful projects
✨ <span style="color: #9C27B0; font-weight: bold;">Excellent communication</span> and project management
✨ <span style="color: #9C27B0; font-weight: bold;">Competitive pricing</span> with premium quality

**<span style="color: #4CAF50;">🎵 Fun Fact:</span>** When not coding or managing projects, you'll find Peter creating beautiful saxophone melodies as **"Peterphonist"**! 🎶

Ready to work with a professional who brings both **<span style="color: #667eea; font-weight: bold;">technical expertise</span>** and **<span style="color: #4CAF50; font-weight: bold;">creative flair</span>** to every project? 🚀`;
    }
    
    // Default response for unmatched queries
    return `🤔 <span style="color: #667eea; font-weight: bold;">Great question!</span> I'd love to help you with that.

I specialize in **<span style="color: #2196F3; font-weight: bold;">four main areas:</span>**

🌐 **<span style="color: #667eea;">Web Development</span>** - Custom websites & applications
👨‍💼 **<span style="color: #9C27B0;">Virtual Assistant</span>** - Business support & management  
📈 **<span style="color: #FF9800;">Digital Marketing</span>** - Online growth strategies
🎷 **<span style="color: #4CAF50;">Saxophone Performance</span>** - Live events & recordings

**<span style="color: #f44336;">Which service interests you most?</span>** Or feel free to ask me anything specific about Peter's work! 

For immediate assistance: <span style="color: #4CAF50; font-weight: bold;">📱 +234 8108821809</span> (WhatsApp) 🚀`;
}

// Show quick replies with enhanced styling
function showQuickReplies() {
    if (!BOT_CONFIG.showQuickReplies) return;
    
    const quickRepliesContainer = document.getElementById('peterbot-quick-replies');
    
    if (!quickRepliesContainer) return;
    
    const quickReplies = [
        { text: '🌐 Web Development', color: '#667eea' },
        { text: '👨‍💼 Virtual Assistant', color: '#9C27B0' },
        { text: '📈 Digital Marketing', color: '#FF9800' },
        { text: '🎷 Saxophone Shows', color: '#4CAF50' },
        { text: '💰 Pricing Info', color: '#f44336' },
        { text: '📞 Contact Peter', color: '#2196F3' }
    ];
    
    const repliesHTML = quickReplies.map(reply => 
        `<button class="quick-reply-btn" style="border-color: ${reply.color}; color: ${reply.color};" data-message="${reply.text}">
            <span style="font-weight: bold;">${reply.text}</span>
         </button>`
    ).join('');
    
    quickRepliesContainer.innerHTML = `
        <div class="quick-replies-header">
            <span style="color: #999; font-size: 0.85em; font-weight: bold;">💡 Quick Options:</span>
        </div>
        <div class="quick-replies-grid">
            ${repliesHTML}
        </div>
    `;
    
    quickRepliesContainer.style.display = 'block';
    
    // Add event listeners to quick reply buttons
    quickRepliesContainer.querySelectorAll('.quick-reply-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const message = e.target.closest('.quick-reply-btn').dataset.message;
            
            // Add user message
            addUserMessage(message);
            
            // Hide quick replies
            quickRepliesContainer.style.display = 'none';
            
            // Process response
            setTimeout(() => {
                processBotResponse(message);
            }, BOT_CONFIG.responseDelay);
        });
    });
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('peterbot-messages');
    if (messagesContainer) {
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }
}

// Session and storage management
function createNewSession() {
    currentSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Add to sessions index
    const sessions = JSON.parse(localStorage.getItem('peterbot_sessions_index') || '[]');
    sessions.push(currentSessionId);
    localStorage.setItem('peterbot_sessions_index', JSON.stringify(sessions));
    
    console.log('New session created:', currentSessionId);
}

function saveChatHistory() {
    if (currentSessionId && chatHistory.length > 0) {
        try {
            localStorage.setItem(`peterbot_chat_${currentSessionId}`, JSON.stringify(chatHistory));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }
}

function loadChatHistory() {
    if (!currentSessionId) return;
    
    try {
        const savedHistory = localStorage.getItem(`peterbot_chat_${currentSessionId}`);
        if (savedHistory) {
            chatHistory = JSON.parse(savedHistory);
            
            // Restore messages to UI
            const messagesContainer = document.getElementById('peterbot-messages');
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
                
                chatHistory.forEach(msg => {
                    if (msg.type === 'user') {
                        addUserMessage(msg.message);
                    } else {
                        addBotMessage(msg.message);
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
        chatHistory = [];
    }
}

function loadBotSettings() {
    try {
        const savedSettings = localStorage.getItem('peterbot_settings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            Object.assign(BOT_CONFIG, settings);
        }
    } catch (error) {
        console.error('Error loading bot settings:', error);
    }
}

// Add comprehensive CSS styles
function addAdminStyles() {
    const styles = `
        <style>
        /* PeterBot Professional Styles */
        :root {
            --primary-color: ${BOT_CONFIG.theme.primaryColor};
            --secondary-color: ${BOT_CONFIG.theme.secondaryColor};
            --accent-color: ${BOT_CONFIG.theme.accentColor};
            --bg-color: ${BOT_CONFIG.theme.backgroundColor};
            --text-color: ${BOT_CONFIG.theme.textColor};
            --shadow: 0 10px 30px rgba(0,0,0,0.1);
            --border-radius: 12px;
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Bot Container Styles */
        .peterbot-container {
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 380px;
            height: 600px;
            background: white;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            display: flex;
            flex-direction: column;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
            transition: var(--transition);
            border: 1px solid #e0e0e0;
        }
        
        .peterbot-header {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-radius: var(--border-radius) var(--border-radius) 0 0;
        }
        
        .bot-avatar img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.3);
            object-fit: cover;
        }
        
        .bot-info {
            flex: 1;
        }
        
        .bot-name {
            font-weight: 600;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
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
            background: #4CAF50;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        .bot-controls {
            display: flex;
            gap: 8px;
        }
        
        .control-btn {
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
        
        .control-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: scale(1.05);
        }
        
        /* Messages Area */
        .peterbot-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background: #fafafa;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
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
        
        .message {
            display: flex;
            gap: 12px;
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .user-message {
            flex-direction: row-reverse;
        }
        
        .message-avatar {
            flex-shrink: 0;
        }
        
        .bot-avatar-img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
        }
        
        .user-avatar {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            font-weight: 600;
        }
        
        .message-content {
            flex: 1;
            max-width: 280px;
        }
        
        .user-message .message-content {
            text-align: right;
        }
        
        .message-header {
            margin-bottom: 4px;
        }
        
        .message-text {
            background: white;
            padding: 12px 16px;
            border-radius: 18px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            line-height: 1.4;
            word-wrap: break-word;
        }
        
        .user-message .message-text {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
        }
        
        .message-time {
            margin-top: 4px;
            font-size: 11px;
            opacity: 0.7;
        }
        
        /* Quick Replies */
        .peterbot-quick-replies {
            padding: 12px 16px;
            background: white;
            border-top: 1px solid #e0e0e0;
        }
        
        .quick-replies-header {
            margin-bottom: 8px;
        }
        
        .quick-replies-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        
        .quick-reply-btn {
            background: white;
            border: 1.5px solid;
            padding: 8px 12px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            transition: var(--transition);
            text-align: center;
        }
        
        .quick-reply-btn:hover {
            background: currentColor;
            color: white !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        /* Input Area */
        .peterbot-input-container {
            background: white;
            border-top: 1px solid #e0e0e0;
            padding: 16px;
        }
        
        .input-wrapper {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        
        .peterbot-input {
            flex: 1;
            border: 1.5px solid #e0e0e0;
            border-radius: 24px;
            padding: 12px 16px;
            font-size: 14px;
            outline: none;
            transition: var(--transition);
        }
        
        .peterbot-input:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .peterbot-send-btn {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border: none;
            color: white;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition);
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }
        
        .peterbot-send-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
        }
        
        .peterbot-send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .input-footer {
            margin-top: 8px;
            text-align: center;
        }
        
        /* Typing Indicator */
        .peterbot-typing {
            position: absolute;
            bottom: 80px;
            left: 16px;
            right: 16px;
            background: white;
            border-radius: 12px;
            padding: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideUp 0.3s ease-out;
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
        
        .typing-avatar img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
        }
        
        .typing-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
        }
        
        .typing-dots {
            display: flex;
            gap: 2px;
        }
        
        .typing-dots span {
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            animation: typingDot 1.4s infinite ease-in-out;
        }
        
        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typingDot {
            0%, 80%, 100% {
                transform: scale(0);
                opacity: 0.5;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        /* Toggle Button */
        .peterbot-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            z-index: 9999;
            transition: var(--transition);
        }
        
        .peterbot-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
        }
        
        .notification-badge {
            position: absolute;
            top: -2px;
            right: -2px;
            background: #f44336;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
        
        /* Admin Panel Styles */
        .admin-panel {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 20000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .admin-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        }
        
        .admin-container {
            position: relative;
            width: 90%;
            max-width: 900px;
            max-height: 90vh;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            animation: modalSlideIn 0.4s ease-out;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: scale(0.9) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
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
            font-size: 24px;
            font-weight: 600;
        }
        
        .admin-close {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition);
        }
        
        .admin-close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg);
        }
        
        .admin-content {
            padding: 0;
            max-height: calc(90vh - 80px);
            overflow-y: auto;
        }
        
        .admin-content::-webkit-scrollbar {
            width: 8px;
        }
        
        .admin-content::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        
        .admin-content::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 4px;
        }
        
        /* Login Section */
        .login-form {
            padding: 40px;
            text-align: center;
        }
        
        .login-form h3 {
            margin-bottom: 24px;
            color: var(--primary-color);
        }
        
        /* Admin Tabs */
        .admin-tabs {
            display: flex;
            background: #f8f9fa;
            border-bottom: 1px solid #e0e0e0;
            overflow-x: auto;
        }
        
        .tab-btn {
            background: none;
            border: none;
            padding: 16px 20px;
            cursor: pointer;
            font-weight: 500;
            color: #666;
            transition: var(--transition);
            white-space: nowrap;
            border-bottom: 3px solid transparent;
        }
        
        .tab-btn:hover {
            background: rgba(102, 126, 234, 0.1);
            color: var(--primary-color);
        }
        
        .tab-btn.active {
            color: var(--primary-color);
            border-bottom-color: var(--primary-color);
            background: white;
        }
        
        /* Tab Content */
        .tab-content {
            display: none;
            padding: 24px;
        }
        
        .tab-content.active {
            display: block;
        }
        
        .tab-content h3 {
            margin-top: 0;
            margin-bottom: 24px;
            color: var(--primary-color);
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 8px;
        }
        
        /* Form Elements */
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #333;
        }
        
        .admin-input, .admin-textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            transition: var(--transition);
            font-family: inherit;
        }
        
        .admin-input:focus, .admin-textarea:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .admin-textarea {
            resize: vertical;
            min-height: 80px;
        }
        
        .color-input {
            width: 60px;
            height: 40px;
            padding: 0;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            cursor: pointer;
        }
        
        .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .checkbox-group label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: normal;
            cursor: pointer;
        }
        
        .checkbox-group input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: var(--primary-color);
        }
        
        /* Color Grid */
        .color-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
        }
        
        /* Buttons */
        .admin-btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
        }
        
        .admin-btn.primary {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
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
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .admin-btn:active {
            transform: translateY(0);
        }
        
        /* Analytics */
        .analytics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 24px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            border: 1px solid #e0e0e0;
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
        
        /* Export/Import Sections */
        .export-section, .import-section, .backup-section {
            margin-bottom: 32px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid var(--primary-color);
        }
        
        .export-section h4, .import-section h4, .backup-section h4 {
            margin-top: 0;
            color: var(--primary-color);
        }
        
        .file-input {
            margin-bottom: 12px;
            padding: 8px;
            border: 2px dashed #ccc;
            border-radius: 8px;
            width: 100%;
        }
        
        /* Admin Actions */
        .admin-actions {
            padding: 24px;
            background: #f8f9fa;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        /* Status Messages */
        .status-message, .error-message, .admin-message {
            padding: 12px 16px;
            border-radius: 8px;
            margin: 12px 0;
            font-weight: 500;
        }
        
        .status-message.success, .admin-message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .status-message.error, .error-message, .admin-message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .status-message.info, .admin-message.info {
            background: #cce7ff;
            color: #004085;
            border: 1px solid #b3d7ff;
        }
        
        /* Admin Access Button */
        .admin-access-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #6c757d, #495057);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 9998;
            transition: var(--transition);
            opacity: 0.7;
        }
        
        .admin-access-btn:hover {
            opacity: 1;
            transform: scale(1.1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .peterbot-container {
                width: calc(100vw - 20px);
                height: calc(100vh - 120px);
                right: 10px;
                bottom: 80px;
            }
            
            .admin-container {
                width: 95%;
                max-height: 95vh;
            }
            
            .admin-tabs {
                flex-wrap: wrap;
            }
            
            .tab-btn {
                flex: 1;
                min-width: 120px;
            }
            
            .color-grid {
                grid-template-columns: 1fr;
            }
            
            .analytics-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .quick-replies-grid {
                grid-template-columns: 1fr;
            }
            
            .admin-actions {
                flex-direction: column;
            }
            
            .admin-btn {
                width: 100%;
                justify-content: center;
            }
        }
        
        @media (max-width: 480px) {
            .analytics-grid {
                grid-template-columns: 1fr;
            }
            
            .peterbot-toggle {
                width: 50px;
                height: 50px;
                bottom: 15px;
                right: 15px;
            }
            
            .admin-access-btn {
                width: 35px;
                height: 35px;
                top: 15px;
                right: 15px;
            }
        }
        
        /* Enhanced Message Styling */
        .message-text a {
            color: inherit;
            text-decoration: underline;
            font-weight: bold;
        }
        
        .message-text a:hover {
            opacity: 0.8;
        }
        
        .message-text code {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
        }
        
        .message-text strong {
            font-weight: 600;
        }
        
        /* Loading States */
        .loading {
            opacity: 0.6;
            pointer-events: none;
        }
        
        .loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin: -10px 0 0 -10px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Accessibility Improvements */
        .peterbot-container:focus-within {
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
        }
        
        .admin-btn:focus,
        .control-btn:focus,
        .quick-reply-btn:focus,
        .peterbot-send-btn:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .peterbot-container {
                background: #2d3748;
                border-color: #4a5568;
            }
            
            .peterbot-messages {
                background: #1a202c;
            }
            
            .message-text {
                background: #2d3748;
                color: #e2e8f0;
            }
            
            .bot-message .message-text {
                background: #4a5568;
            }
            
            .peterbot-input-container {
                background: #2d3748;
                border-color: #4a5568;
            }
            
            .peterbot-input {
                background: #1a202c;
                border-color: #4a5568;
                color: #e2e8f0;
            }
            
            .admin-container {
                background: #2d3748;
                color: #e2e8f0;
            }
            
            .tab-content {
                background: #2d3748;
            }
            
            .admin-input,
            .admin-textarea {
                background: #1a202c;
                border-color: #4a5568;
                color: #e2e8f0;
            }
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Enhanced notification system
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `peterbot-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close">×</button>
    `;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const notificationStyles = `
            <style id="notification-styles">
            .peterbot-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                padding: 16px;
                z-index: 25000;
                max-width: 400px;
                animation: notificationSlideIn 0.3s ease-out;
                border-left: 4px solid;
            }
            
            .peterbot-notification.success {
                border-left-color: #4CAF50;
                background: #f1f8e9;
            }
            
            .peterbot-notification.error {
                border-left-color: #f44336;
                background: #ffebee;
            }
            
            .peterbot-notification.warning {
                border-left-color: #ff9800;
                background: #fff3e0;
            }
            
            .peterbot-notification.info {
                border-left-color: #2196F3;
                background: #e3f2fd;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification-icon {
                font-size: 18px;
            }
            
            .notification-message {
                flex: 1;
                font-weight: 500;
                color: #333;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                color: #333;
            }
            
            @keyframes notificationSlideIn {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes notificationSlideOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', notificationStyles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }
    
    return notification;
}

function removeNotification(notification) {
    notification.style.animation = 'notificationSlideOut 0.3s ease-out';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('PeterBot Error:', e.error);
    showNotification('<span style="color: #f44336; font-weight: bold;">An error occurred. Please refresh the page.</span>', 'error');
});

// Performance monitoring
function logPerformance(action, startTime) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`PeterBot Performance - ${action}: ${duration.toFixed(2)}ms`);
}

// Initialize performance monitoring
const initStartTime = performance.now();

// Final initialization
document.addEventListener('DOMContentLoaded', function() {
    logPerformance('DOM Load', initStartTime);
    
    // Show welcome notification
    setTimeout(() => {
        showNotification(
            '<span style="color: #667eea; font-weight: bold;">🚀 PeterBot v3.0 is ready!</span> Click the chat icon to get started.',
            'success',
            5000
        );
    }, 1000);
});

// Export for potential external use
window.PeterBot = {
    config: BOT_CONFIG,
    addMessage: addBotMessage,
    showNotification: showNotification,
    version: '3.0'
};

console.log('%c🤖 PeterBot v3.0 Professional Edition Loaded Successfully! 🚀', 
    'color: #667eea; font-size: 16px; font-weight: bold; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');

console.log('%cFeatures: ✅ AI Integration ✅ Admin Panel ✅ Analytics ✅ Responsive Design', 
    'color: #4CAF50; font-weight: bold;');

console.log('%cDeveloped by Peter | Contact: petereluwade55@gmail.com', 
    'color: #666; font-style: italic;');

