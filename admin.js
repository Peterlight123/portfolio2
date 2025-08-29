/**
 * PeterBot Admin Panel
 * Manages the admin interface for the chatbot
 */

// Enhanced security check - add this at the very beginning of admin.js
(function() {
    'use strict';
    
    // Security configuration
    const ADMIN_CONFIG = {
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
        inactivityTimeout: 30 * 60 * 1000, // 30 minutes
        maxSessions: 1 // Only allow one admin session
    };
    
    let lastActivity = Date.now();
    let inactivityTimer;
    
    // Enhanced authentication check
    function enhancedAuthCheck() {
        const auth = JSON.parse(localStorage.getItem('peterbot_admin_auth') || '{"authenticated":false}');
        
        if (!auth.authenticated || !auth.timestamp || !auth.sessionId) {
            redirectToLogin();
            return false;
        }
        
        const now = Date.now();
        const sessionAge = now - auth.timestamp;
        
        // Check session timeout
        if (sessionAge >= ADMIN_CONFIG.sessionTimeout) {
            localStorage.removeItem('peterbot_admin_auth');
            alert('Session expired. Please login again.');
            redirectToLogin();
            return false;
        }
        
        // Check inactivity
        const inactivityTime = now - lastActivity;
        if (inactivityTime >= ADMIN_CONFIG.inactivityTimeout) {
            localStorage.removeItem('peterbot_admin_auth');
            alert('Session expired due to inactivity. Please login again.');
            redirectToLogin();
            return false;
        }
        
        return true;
    }
    
    function redirectToLogin() {
        window.location.href = 'auth-x7k9m.html';
    }
    
    // Track user activity
    function trackActivity() {
        lastActivity = Date.now();
        
        // Reset inactivity timer
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
        
        inactivityTimer = setTimeout(() => {
            if (enhancedAuthCheck()) {
                alert('You will be logged out due to inactivity in 2 minutes.');
                
                setTimeout(() => {
                    localStorage.removeItem('peterbot_admin_auth');
                    redirectToLogin();
                }, 2 * 60 * 1000);
            }
        }, ADMIN_CONFIG.inactivityTimeout - (2 * 60 * 1000));
    }
    
    // Activity event listeners
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
        document.addEventListener(event, trackActivity, true);
    });
    
    // Check authentication every 5 minutes
    setInterval(enhancedAuthCheck, 5 * 60 * 1000);
    
    // Initial security check
    if (!enhancedAuthCheck()) {
        return;
    }
    
    // Security: Disable developer tools
    let devtools = {
        open: false,
        orientation: null
    };
    
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
            if (!devtools.open) {
                devtools.open = true;
                console.clear();
                console.log('%cAccess Denied', 'color: red; font-size: 50px; font-weight: bold;');
            }
        } else {
            devtools.open = false;
        }
    }, 500);
    
    // Override your existing checkAuth function
    window.checkAuth = enhancedAuthCheck;
    
})();
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();
    
    // Initialize admin panel
    initAdminPanel();
    
    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('peterbot_admin_auth');
            window.location.href = 'auth-x7k9m.html';
        });
    }
    
    // Debug stored sessions on load
    debugStoredSessions();
});

// Check if user is authenticated
function checkAuth() {
    const auth = JSON.parse(localStorage.getItem('peterbot_admin_auth') || '{"authenticated":false}');
    if (!auth.authenticated) {
        window.location.href = 'auth-x7k9m.html';
        return;
    }
    
    // Check if auth is still valid (24 hours)
    const now = new Date().getTime();
    const authTime = auth.timestamp || 0;
    
    if (now - authTime >= 24 * 60 * 60 * 1000) {
        localStorage.removeItem('peterbot_admin_auth');
        window.location.href = 'auth-x7k9m.html';
    }
}

// Debug function to check stored sessions
function debugStoredSessions() {
    console.group('Chatbot Sessions Debug');
    
    // Check sessions index
    const sessionsIndex = JSON.parse(localStorage.getItem('peterbot_sessions_index') || '[]');
    console.log('Sessions Index:', sessionsIndex);
    
    // Check all localStorage keys
    const chatKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('peterbot_')) {
            chatKeys.push(key);
        }
    }
    console.log('All Chatbot Keys:', chatKeys);
    
    // Check retrieved sessions
    const sessions = getAllChatSessions();
    console.log('Retrieved Sessions:', sessions);
    console.log('Total Sessions:', Object.keys(sessions).length);
    
    console.groupEnd();
}
// Get all chat sessions from localStorage
function getAllChatSessions() {
    const sessions = {};
    
    try {
        // First check if we have a sessions index
        const sessionsIndex = JSON.parse(localStorage.getItem('peterbot_sessions_index') || '[]');
        
        if (sessionsIndex.length > 0) {
            // Use the index to retrieve sessions
            sessionsIndex.forEach(sessionId => {
                const chatData = localStorage.getItem(`peterbot_chat_${sessionId}`);
                if (chatData) {
                    try {
                        const messages = JSON.parse(chatData);
                        sessions[sessionId] = {
                            messages: messages || []
                        };
                    } catch (e) {
                        console.error(`Error parsing session data for ${sessionId}:`, e);
                    }
                }
            });
        } else {
            // Fallback: Scan all localStorage keys (less efficient)
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                
                // Check if it's a chat session
                if (key && key.startsWith('peterbot_chat_')) {
                    try {
                        const sessionId = key.replace('peterbot_chat_', '');
                        const messages = JSON.parse(localStorage.getItem(key));
                        
                        sessions[sessionId] = {
                            messages: messages || []
                        };
                    } catch (error) {
                        console.error(`Error parsing session data for ${key}:`, error);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error retrieving chat sessions:', error);
    }
    
    return sessions;
}

// Ensure compatibility between different chat history formats
function normalizeSessionData(sessions) {
    const normalizedSessions = {};
    
    Object.entries(sessions).forEach(([sessionId, sessionData]) => {
        // Check if the session data is already in the expected format
        if (sessionData.messages && Array.isArray(sessionData.messages)) {
            normalizedSessions[sessionId] = sessionData;
        } 
        // Check if the session data is an array of messages (direct format)
        else if (Array.isArray(sessionData)) {
            normalizedSessions[sessionId] = {
                messages: sessionData
            };
        }
        // Unknown format, try to convert
        else {
            console.warn(`Unknown session data format for ${sessionId}:`, sessionData);
            try {
                // Attempt to convert to expected format
                normalizedSessions[sessionId] = {
                    messages: Array.isArray(sessionData) ? sessionData : []
                };
            } catch (e) {
                console.error(`Failed to normalize session data for ${sessionId}:`, e);
            }
        }
    });
    
    return normalizedSessions;
}

// Create a test session for debugging
function createTestSession() {
    const testSessionId = 'test_session_' + Date.now();
    const testMessages = [
        {
            text: "Hello! How can I help you?",
            sender: "bot",
            time: new Date().toISOString()
        },
        {
            text: "I'm interested in your services",
            sender: "user",
            time: new Date().toISOString()
        },
        {
            text: "Great! I offer web development, graphic design, and content creation services.",
            sender: "bot",
            time: new Date().toISOString()
        }
    ];
    
    // Save test session
    localStorage.setItem(`peterbot_chat_${testSessionId}`, JSON.stringify(testMessages));
    
    // Update sessions index
    let sessionsIndex = JSON.parse(localStorage.getItem('peterbot_sessions_index') || '[]');
    sessionsIndex.push(testSessionId);
    localStorage.setItem('peterbot_sessions_index', JSON.stringify(sessionsIndex));
    
    alert('Test session created! Refresh the sessions list to see it.');
}
// Initialize admin panel
function initAdminPanel() {
    // Load dashboard data
    loadDashboardData();
    
    // Load chat sessions
    loadChatSessions();
    
    // Initialize charts
    initCharts();
    
    // Load settings
    loadSettings();
    
    // Set up event listeners
    setupEventListeners();
    
    // Add refresh button functionality
    const refreshBtn = document.getElementById('refresh-dashboard');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadChatSessions();
            loadDashboardData();
            debugStoredSessions();
        });
    }
    
    // Add test session button
    const adminActions = document.querySelector('.admin-actions');
    if (adminActions) {
        const testBtn = document.createElement('button');
        testBtn.id = 'create-test-session';
        testBtn.className = 'btn btn-outline-primary ms-2';
        testBtn.innerHTML = '<i class="bi bi-plus-circle me-1"></i> Create Test Session';
        testBtn.addEventListener('click', createTestSession);
        adminActions.appendChild(testBtn);
    }
}

// Load dashboard data
function loadDashboardData() {
    // Get all chat sessions from localStorage
    const sessions = getAllChatSessions();
    const sessionCount = Object.keys(sessions).length;
    
    // Count total messages
    let totalMessages = 0;
    let todayActiveSessions = 0;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    Object.values(sessions).forEach(session => {
        totalMessages += session.messages.length;
        
        // Check if session was active today
        const lastMessageTime = session.messages.length > 0 ? 
            new Date(session.messages[session.messages.length - 1].time).toISOString().split('T')[0] : '';
        
        if (lastMessageTime === today) {
            todayActiveSessions++;
        }
    });
    
    // Calculate average messages per session
    const avgMessages = sessionCount > 0 ? Math.round(totalMessages / sessionCount) : 0;
    
    // Update dashboard stats
    const totalSessionsEl = document.getElementById('total-sessions');
    const totalMessagesEl = document.getElementById('total-messages');
    const avgMessagesEl = document.getElementById('avg-messages');
    const activeTodayEl = document.getElementById('active-today');
    
    if (totalSessionsEl) totalSessionsEl.textContent = sessionCount;
    if (totalMessagesEl) totalMessagesEl.textContent = totalMessages;
    if (avgMessagesEl) avgMessagesEl.textContent = avgMessages;
    if (activeTodayEl) activeTodayEl.textContent = todayActiveSessions;
    
    // Add service distribution analysis
    const serviceDistribution = {
        web: 0,
        va: 0,
        marketing: 0,
        saxophone: 0,
        other: 0
    };
    
    const serviceKeywords = {
        web: ['web', 'website', 'development', 'app', 'application', 'responsive'],
        va: ['virtual', 'assistant', 'va', 'administrative', 'support', 'email management'],
        marketing: ['marketing', 'digital marketing', 'seo', 'social media', 'content', 'promotion'],
        saxophone: ['saxophone', 'music', 'performance', 'sax', 'peterphonist', 'church']
    };
    
    // Count user messages by service category
    Object.values(sessions).forEach(session => {
        session.messages.forEach(msg => {
            if (msg.sender === 'user') {
                const text = msg.text.toLowerCase();
                let categorized = false;
                
                for (const [service, keywords] of Object.entries(serviceKeywords)) {
                    if (keywords.some(keyword => text.includes(keyword))) {
                        serviceDistribution[service]++;
                        categorized = true;
                        break;
                    }
                }
                
                if (!categorized) {
                    serviceDistribution.other++;
                }
            }
        });
    });
    
    // Update service distribution in dashboard
    const serviceDistributionEl = document.getElementById('service-distribution');
    if (serviceDistributionEl) {
        const totalServiceMentions = Object.values(serviceDistribution).reduce((a, b) => a + b, 0);
        
        if (totalServiceMentions > 0) {
            serviceDistributionEl.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Service Interest Distribution</h5>
                    </div>
                    <div class="card-body">
                        <div class="service-bars">
                            <div class="service-bar mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>Web Development</span>
                                    <span>${Math.round((serviceDistribution.web / totalServiceMentions) * 100)}%</span>
                                </div>
                                <div class="progress" style="height: 10px;">
                                    <div class="progress-bar bg-primary" role="progressbar" 
                                        style="width: ${(serviceDistribution.web / totalServiceMentions) * 100}%"></div>
                                </div>
                            </div>
                            <div class="service-bar mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>Virtual Assistant</span>
                                    <span>${Math.round((serviceDistribution.va / totalServiceMentions) * 100)}%</span>
                                </div>
                                <div class="progress" style="height: 10px;">
                                    <div class="progress-bar bg-success" role="progressbar" 
                                        style="width: ${(serviceDistribution.va / totalServiceMentions) * 100}%"></div>
                                </div>
                            </div>
                            <div class="service-bar mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>Digital Marketing</span>
                                    <span>${Math.round((serviceDistribution.marketing / totalServiceMentions) * 100)}%</span>
                                </div>
                                <div class="progress" style="height: 10px;">
                                    <div class="progress-bar bg-warning" role="progressbar" 
                                        style="width: ${(serviceDistribution.marketing / totalServiceMentions) * 100}%"></div>
                                </div>
                            </div>
                            <div class="service-bar mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>Saxophone Performance</span>
                                    <span>${Math.round((serviceDistribution.saxophone / totalServiceMentions) * 100)}%</span>
                                </div>
                                <div class="progress" style="height: 10px;">
                                    <div class="progress-bar bg-info" role="progressbar" 
                                        style="width: ${(serviceDistribution.saxophone / totalServiceMentions) * 100}%"></div>
                                </div>
                            </div>
                            <div class="service-bar">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>Other</span>
                                    <span>${Math.round((serviceDistribution.other / totalServiceMentions) * 100)}%</span>
                                </div>
                                <div class="progress" style="height: 10px;">
                                    <div class="progress-bar bg-secondary" role="progressbar" 
                                        style="width: ${(serviceDistribution.other / totalServiceMentions) * 100}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            serviceDistributionEl.innerHTML = '<div class="alert alert-info">No service data available yet.</div>';
        }
    }
    
    // Update recent sessions table
    updateRecentSessionsTable(sessions);
    
    // Update common questions
    updateCommonQuestions(sessions);
}
// Load and display chat sessions
function loadChatSessions() {
    const sessions = getAllChatSessions();
    const normalizedSessions = normalizeSessionData(sessions);
    
    console.log('Loading chat sessions:', normalizedSessions);
    
    const sessionsList = document.getElementById('sessions-list');
    if (!sessionsList) return;
    
    // Clear existing sessions
    sessionsList.innerHTML = '';
    
    if (Object.keys(normalizedSessions).length === 0) {
        sessionsList.innerHTML = `
            <div class="alert alert-info">
                <h5>No chat sessions found</h5>
                <p>No chat sessions have been recorded yet. Sessions will appear here once users start chatting with the bot.</p>
                <button class="btn btn-primary" onclick="createTestSession()">Create Test Session</button>
            </div>
        `;
        return;
    }
    
    // Sort sessions by last message time (most recent first)
    const sortedSessions = Object.entries(normalizedSessions).sort((a, b) => {
        const aLastMessage = a[1].messages.length > 0 ? 
            new Date(a[1].messages[a[1].messages.length - 1].time || 0) : new Date(0);
        const bLastMessage = b[1].messages.length > 0 ? 
            new Date(b[1].messages[b[1].messages.length - 1].time || 0) : new Date(0);
        return bLastMessage - aLastMessage;
    });
    
    // Display sessions
    sortedSessions.forEach(([sessionId, sessionData]) => {
        const sessionCard = createSessionCard(sessionId, sessionData);
        sessionsList.appendChild(sessionCard);
    });
}

// Create session card element
function createSessionCard(sessionId, sessionData) {
    const card = document.createElement('div');
    card.className = 'card mb-3 session-card';
    card.setAttribute('data-session-id', sessionId);
    
    const messages = sessionData.messages || [];
    const messageCount = messages.length;
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    const firstUserMessage = messages.find(msg => msg.sender === 'user');
    
    // Format timestamps
    const lastMessageTime = lastMessage ? formatTimestamp(lastMessage.time) : 'Unknown';
    const sessionStart = messages.length > 0 ? formatTimestamp(messages[0].time) : 'Unknown';
    
    // Get session preview (first user message or first message)
    const previewMessage = firstUserMessage ? 
        firstUserMessage.text.substring(0, 100) + (firstUserMessage.text.length > 100 ? '...' : '') :
        (messages.length > 0 ? messages[0].text.substring(0, 100) + (messages[0].text.length > 100 ? '...' : '') : 'No messages');
    
    // Count user vs bot messages
    const userMessages = messages.filter(msg => msg.sender === 'user').length;
    const botMessages = messages.filter(msg => msg.sender === 'bot').length;
    
    // Determine session status
    const sessionStatus = lastMessage && lastMessage.sender === 'user' ? 'pending' : 'completed';
    const statusBadge = sessionStatus === 'pending' ? 
        '<span class="badge bg-warning">Pending Response</span>' : 
        '<span class="badge bg-success">Completed</span>';
    
    card.innerHTML = `
        <div class="card-header d-flex justify-content-between align-items-center">
            <div>
                <h6 class="mb-0">Session: ${sessionId}</h6>
                <small class="text-muted">Started: ${sessionStart}</small>
            </div>
            <div class="d-flex align-items-center gap-2">
                ${statusBadge}
                <div class="dropdown">
                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" 
                            data-bs-toggle="dropdown" aria-expanded="false">
                        Actions
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" onclick="viewSession('${sessionId}')">
                            <i class="bi bi-eye me-2"></i>View Details</a></li>
                        <li><a class="dropdown-item" href="#" onclick="exportSession('${sessionId}')">
                            <i class="bi bi-download me-2"></i>Export</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="#" onclick="deleteSession('${sessionId}')">
                            <i class="bi bi-trash me-2"></i>Delete</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-8">
                    <p class="card-text mb-2"><strong>Preview:</strong> ${previewMessage}</p>
                    <small class="text-muted">Last activity: ${lastMessageTime}</small>
                </div>
                <div class="col-md-4">
                    <div class="session-stats">
                        <div class="d-flex justify-content-between mb-1">
                            <span>Total Messages:</span>
                            <span class="badge bg-primary">${messageCount}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-1">
                            <span>User Messages:</span>
                            <span class="badge bg-info">${userMessages}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>Bot Responses:</span>
                            <span class="badge bg-secondary">${botMessages}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer collapse" id="session-details-${sessionId}">
            <div class="session-messages" style="max-height: 300px; overflow-y: auto;">
                <!-- Messages will be loaded here when expanded -->
            </div>
        </div>
    `;
    
    return card;
}

// Format timestamp for display
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown';
    
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return 'Invalid Date';
        
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (error) {
        console.error('Error formatting timestamp:', error);
        return 'Unknown';
    }
}

// Update recent sessions table
function updateRecentSessionsTable(sessions) {
    const recentSessionsTable = document.getElementById('recent-sessions-table');
    if (!recentSessionsTable) return;
    
    const tbody = recentSessionsTable.querySelector('tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Get the 5 most recent sessions
    const sortedSessions = Object.entries(sessions)
        .filter(([_, sessionData]) => sessionData.messages && sessionData.messages.length > 0)
        .sort((a, b) => {
            const aTime = new Date(a[1].messages[a[1].messages.length - 1].time || 0);
            const bTime = new Date(b[1].messages[b[1].messages.length - 1].time || 0);
            return bTime - aTime;
        })
        .slice(0, 5);
    
    if (sortedSessions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No recent sessions</td></tr>';
        return;
    }
    
    sortedSessions.forEach(([sessionId, sessionData]) => {
        const messages = sessionData.messages || [];
        const lastMessage = messages[messages.length - 1];
        const firstUserMessage = messages.find(msg => msg.sender === 'user');
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><code>${sessionId.substring(0, 8)}...</code></td>
            <td>${messages.length}</td>
            <td>${formatTimestamp(lastMessage.time)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewSession('${sessionId}')">
                    <i class="bi bi-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
// View session details in modal
function viewSession(sessionId) {
    const sessions = getAllChatSessions();
    const normalizedSessions = normalizeSessionData(sessions);
    const sessionData = normalizedSessions[sessionId];
    
    if (!sessionData) {
        alert('Session not found!');
        return;
    }
    
    // Create or get modal
    let modal = document.getElementById('session-modal');
    if (!modal) {
        modal = createSessionModal();
        document.body.appendChild(modal);
    }
    
    // Populate modal with session data
    populateSessionModal(sessionId, sessionData);
    
    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

// Create session modal
function createSessionModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'session-modal';
    modal.tabIndex = -1;
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Session Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div id="session-info" class="mb-3"></div>
                    <div id="session-messages" class="chat-messages" style="max-height: 400px; overflow-y: auto;"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="export-session-btn">
                        <i class="bi bi-download me-1"></i>Export Session
                    </button>
                </div>
            </div>
        </div>
    `;
    return modal;
}

// Populate session modal with data
function populateSessionModal(sessionId, sessionData) {
    const messages = sessionData.messages || [];
    
    // Session info
    const sessionInfo = document.getElementById('session-info');
    const startTime = messages.length > 0 ? formatTimestamp(messages[0].time) : 'Unknown';
    const endTime = messages.length > 0 ? formatTimestamp(messages[messages.length - 1].time) : 'Unknown';
    const userMessages = messages.filter(msg => msg.sender === 'user').length;
    const botMessages = messages.filter(msg => msg.sender === 'bot').length;
    
    sessionInfo.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <p><strong>Session ID:</strong> <code>${sessionId}</code></p>
                <p><strong>Started:</strong> ${startTime}</p>
                <p><strong>Last Activity:</strong> ${endTime}</p>
            </div>
            <div class="col-md-6">
                <p><strong>Total Messages:</strong> ${messages.length}</p>
                <p><strong>User Messages:</strong> ${userMessages}</p>
                <p><strong>Bot Responses:</strong> ${botMessages}</p>
            </div>
        </div>
    `;
    
    // Messages
    const messagesContainer = document.getElementById('session-messages');
    messagesContainer.innerHTML = '';
    
    if (messages.length === 0) {
        messagesContainer.innerHTML = '<div class="alert alert-info">No messages in this session.</div>';
        return;
    }
    
    messages.forEach((message, index) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message mb-3 ${message.sender === 'user' ? 'user-message' : 'bot-message'}`;
        
        const timestamp = formatTimestamp(message.time);
        const senderLabel = message.sender === 'user' ? 'User' : 'PeterBot';
        const senderClass = message.sender === 'user' ? 'text-primary' : 'text-success';
        
        messageDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-start mb-1">
                <strong class="${senderClass}">${senderLabel}</strong>
                <small class="text-muted">${timestamp}</small>
            </div>
            <div class="message-content p-2 rounded ${message.sender === 'user' ? 'bg-light' : 'bg-primary bg-opacity-10'}">
                ${escapeHtml(message.text)}
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
    });
    
    // Set up export button
    const exportBtn = document.getElementById('export-session-btn');
    exportBtn.onclick = () => exportSession(sessionId);
}

// Export session to JSON
function exportSession(sessionId) {
    const sessions = getAllChatSessions();
    const normalizedSessions = normalizeSessionData(sessions);
    const sessionData = normalizedSessions[sessionId];
    
    if (!sessionData) {
        alert('Session not found!');
        return;
    }
    
    const exportData = {
        sessionId: sessionId,
        exportDate: new Date().toISOString(),
        messageCount: sessionData.messages.length,
        messages: sessionData.messages
    };
    
    // Create and download file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `peterbot_session_${sessionId}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(link.href);
}

// Delete session
function deleteSession(sessionId) {
    if (!confirm(`Are you sure you want to delete session ${sessionId}? This action cannot be undone.`)) {
        return;
    }
    
    try {
        // Remove from localStorage
        localStorage.removeItem(`peterbot_chat_${sessionId}`);
        
        // Update sessions index
        let sessionsIndex = JSON.parse(localStorage.getItem('peterbot_sessions_index') || '[]');
        sessionsIndex = sessionsIndex.filter(id => id !== sessionId);
        localStorage.setItem('peterbot_sessions_index', JSON.stringify(sessionsIndex));
        
        // Refresh the display
        loadChatSessions();
        loadDashboardData();
        
        // Show success message
        showNotification('Session deleted successfully', 'success');
        
    } catch (error) {
        console.error('Error deleting session:', error);
        showNotification('Error deleting session', 'error');
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}
// Update common questions analysis
function updateCommonQuestions(sessions) {
    const commonQuestionsEl = document.getElementById('common-questions');
    if (!commonQuestionsEl) return;
    
    // Extract all user messages
    const userMessages = [];
    Object.values(sessions).forEach(session => {
        session.messages.forEach(msg => {
            if (msg.sender === 'user') {
                userMessages.push(msg.text.toLowerCase().trim());
            }
        });
    });
    
    if (userMessages.length === 0) {
        commonQuestionsEl.innerHTML = '<div class="alert alert-info">No user questions found yet.</div>';
        return;
    }
    
    // Define question patterns and keywords
    const questionPatterns = {
        'Services & Pricing': [
            'service', 'services', 'price', 'pricing', 'cost', 'how much', 'rate', 'rates', 'fee', 'fees'
        ],
        'Web Development': [
            'website', 'web', 'development', 'app', 'application', 'responsive', 'mobile', 'design'
        ],
        'Virtual Assistant': [
            'virtual assistant', 'va', 'administrative', 'support', 'email', 'management', 'organize'
        ],
        'Digital Marketing': [
            'marketing', 'seo', 'social media', 'content', 'promotion', 'advertising', 'brand'
        ],
        'Saxophone Performance': [
            'saxophone', 'sax', 'music', 'performance', 'church', 'event', 'wedding', 'peterphonist'
        ],
        'Contact & Availability': [
            'contact', 'reach', 'available', 'availability', 'schedule', 'meeting', 'call', 'email'
        ],
        'Portfolio & Experience': [
            'portfolio', 'work', 'experience', 'examples', 'previous', 'sample', 'showcase'
        ]
    };
    
    // Count questions by category
    const questionCounts = {};
    const specificQuestions = [];
    
    Object.keys(questionPatterns).forEach(category => {
        questionCounts[category] = 0;
    });
    
    userMessages.forEach(message => {
        let categorized = false;
        
        // Check each category
        for (const [category, keywords] of Object.entries(questionPatterns)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                questionCounts[category]++;
                categorized = true;
                
                // Store specific questions for display
                if (specificQuestions.length < 10) {
                    specificQuestions.push({
                        category: category,
                        question: message.charAt(0).toUpperCase() + message.slice(1),
                        count: 1
                    });
                }
                break;
            }
        }
        
        if (!categorized) {
            questionCounts['Other'] = (questionCounts['Other'] || 0) + 1;
        }
    });
    
    // Sort categories by count
    const sortedCategories = Object.entries(questionCounts)
        .filter(([_, count]) => count > 0)
        .sort(([,a], [,b]) => b - a);
    
    // Generate HTML
    let html = `
        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0">Common Question Categories</h5>
            </div>
            <div class="card-body">
    `;
    
    if (sortedCategories.length === 0) {
        html += '<div class="alert alert-info">No categorized questions found yet.</div>';
    } else {
        html += '<div class="row">';
        
        // Categories chart
        html += '<div class="col-md-6"><div class="question-categories">';
        sortedCategories.forEach(([category, count]) => {
            const percentage = Math.round((count / userMessages.length) * 100);
            html += `
                <div class="category-item mb-3">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="fw-medium">${category}</span>
                        <span class="badge bg-primary">${count} (${percentage}%)</span>
                    </div>
                    <div class="progress" style="height: 8px;">
                        <div class="progress-bar" role="progressbar" 
                             style="width: ${percentage}%" 
                             aria-valuenow="${percentage}" 
                             aria-valuemin="0" 
                             aria-valuemax="100">
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div></div>';
        
        // Recent questions
        html += '<div class="col-md-6"><div class="recent-questions">';
        html += '<h6 class="mb-3">Recent Questions</h6>';
        
        if (specificQuestions.length > 0) {
            html += '<div class="list-group list-group-flush">';
            specificQuestions.slice(0, 5).forEach(item => {
                const truncatedQuestion = item.question.length > 80 ? 
                    item.question.substring(0, 80) + '...' : item.question;
                html += `
                    <div class="list-group-item px-0 py-2">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <p class="mb-1">"${truncatedQuestion}"</p>
                                <small class="text-muted">Category: ${item.category}</small>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        } else {
            html += '<div class="text-muted">No recent questions to display.</div>';
        }
        
        html += '</div></div>';
        html += '</div>'; // Close row
    }
    
    html += `
            </div>
        </div>
    `;
    
    commonQuestionsEl.innerHTML = html;
}

// Initialize charts
function initCharts() {
    // Only initialize if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded, skipping charts initialization');
        return;
    }
    
    initMessagesChart();
    initSessionsChart();
}

// Initialize messages over time chart
function initMessagesChart() {
    const ctx = document.getElementById('messages-chart');
    if (!ctx) return;
    
    const sessions = getAllChatSessions();
    const normalizedSessions = normalizeSessionData(sessions);
    
    // Prepare data for last 7 days
    const last7Days = [];
    const messageCounts = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        last7Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Count messages for this day
        let dayCount = 0;
        Object.values(normalizedSessions).forEach(session => {
            session.messages.forEach(msg => {
                if (msg.time) {
                    const msgDate = new Date(msg.time).toISOString().split('T')[0];
                    if (msgDate === dateStr) {
                        dayCount++;
                    }
                }
            });
        });
        messageCounts.push(dayCount);
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Messages',
                data: messageCounts,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Messages Over Last 7 Days'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Initialize sessions chart
function initSessionsChart() {
    const ctx = document.getElementById('sessions-chart');
    if (!ctx) return;
    
    const sessions = getAllChatSessions();
    const normalizedSessions = normalizeSessionData(sessions);
    
    // Prepare data for last 7 days
    const last7Days = [];
    const sessionCounts = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        last7Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Count sessions active on this day
        let dayCount = 0;
        Object.values(normalizedSessions).forEach(session => {
            const hasActivityOnDay = session.messages.some(msg => {
                if (msg.time) {
                    const msgDate = new Date(msg.time).toISOString().split('T')[0];
                    return msgDate === dateStr;
                }
                return false;
            });
            if (hasActivityOnDay) {
                dayCount++;
            }
        });
        sessionCounts.push(dayCount);
    }
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Active Sessions',
                data: sessionCounts,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Active Sessions Over Last 7 Days'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}
// Load settings
function loadSettings() {
    const settingsForm = document.getElementById('settings-form');
    if (!settingsForm) return;
    
    // Load saved settings or use defaults
    const settings = JSON.parse(localStorage.getItem('peterbot_admin_settings') || '{}');
    
    const defaultSettings = {
        botName: 'PeterBot',
        welcomeMessage: 'Hello! I\'m PeterBot, Peter\'s virtual assistant. How can I help you today?',
        autoResponse: true,
        responseDelay: 1000,
        maxSessionTime: 30,
        enableAnalytics: true,
        enableNotifications: true,
        theme: 'light',
        language: 'en'
    };
    
    // Merge with defaults
    const currentSettings = { ...defaultSettings, ...settings };
    
    // Populate form fields
    Object.keys(currentSettings).forEach(key => {
        const field = settingsForm.querySelector(`[name="${key}"]`);
        if (field) {
            if (field.type === 'checkbox') {
                field.checked = currentSettings[key];
            } else {
                field.value = currentSettings[key];
            }
        }
    });
    
    // Display current settings info
    updateSettingsInfo(currentSettings);
}

// Save settings
function saveSettings() {
    const settingsForm = document.getElementById('settings-form');
    if (!settingsForm) return;
    
    const formData = new FormData(settingsForm);
    const settings = {};
    
    // Get all form values
    for (let [key, value] of formData.entries()) {
        const field = settingsForm.querySelector(`[name="${key}"]`);
        if (field && field.type === 'checkbox') {
            settings[key] = field.checked;
        } else if (field && field.type === 'number') {
            settings[key] = parseInt(value) || 0;
        } else {
            settings[key] = value;
        }
    }
    
    // Handle unchecked checkboxes
    const checkboxes = settingsForm.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (!formData.has(checkbox.name)) {
            settings[checkbox.name] = false;
        }
    });
    
    try {
        // Save to localStorage
        localStorage.setItem('peterbot_admin_settings', JSON.stringify(settings));
        
        // Update settings info display
        updateSettingsInfo(settings);
        
        // Show success notification
        showNotification('Settings saved successfully!', 'success');
        
        // Apply theme if changed
        if (settings.theme) {
            applyTheme(settings.theme);
        }
        
    } catch (error) {
        console.error('Error saving settings:', error);
        showNotification('Error saving settings', 'error');
    }
}

// Update settings info display
function updateSettingsInfo(settings) {
    const settingsInfo = document.getElementById('settings-info');
    if (!settingsInfo) return;
    
    settingsInfo.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h6 class="card-title mb-0">Current Configuration</h6>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Bot Name:</strong> ${settings.botName}</p>
                        <p><strong>Auto Response:</strong> ${settings.autoResponse ? 'Enabled' : 'Disabled'}</p>
                        <p><strong>Response Delay:</strong> ${settings.responseDelay}ms</p>
                        <p><strong>Max Session Time:</strong> ${settings.maxSessionTime} minutes</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Analytics:</strong> ${settings.enableAnalytics ? 'Enabled' : 'Disabled'}</p>
                        <p><strong>Notifications:</strong> ${settings.enableNotifications ? 'Enabled' : 'Disabled'}</p>
                        <p><strong>Theme:</strong> ${settings.theme}</p>
                        <p><strong>Language:</strong> ${settings.language}</p>
                    </div>
                </div>
                <div class="mt-3">
                    <p><strong>Welcome Message:</strong></p>
                    <div class="alert alert-light">${settings.welcomeMessage}</div>
                </div>
            </div>
        </div>
    `;
}

// Apply theme
function applyTheme(theme) {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('theme-light', 'theme-dark');
    
    // Apply new theme
    body.classList.add(`theme-${theme}`);
    
    // Update theme-specific elements
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (theme === 'dark') {
            navbar.classList.remove('navbar-light', 'bg-light');
            navbar.classList.add('navbar-dark', 'bg-dark');
        } else {
            navbar.classList.remove('navbar-dark', 'bg-dark');
            navbar.classList.add('navbar-light', 'bg-light');
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Settings form
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSettings();
        });
    }
    
    // Export all data button
    const exportAllBtn = document.getElementById('export-all-data');
    if (exportAllBtn) {
        exportAllBtn.addEventListener('click', exportAllData);
    }
    
    // Import data button
    const importDataBtn = document.getElementById('import-data');
    if (importDataBtn) {
        importDataBtn.addEventListener('click', function() {
            document.getElementById('import-file').click();
        });
    }
    
    // File input for import
    const importFile = document.getElementById('import-file');
    if (importFile) {
        importFile.addEventListener('change', handleImportFile);
    }
    
    // Clear all data button
    const clearDataBtn = document.getElementById('clear-all-data');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', clearAllData);
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-sessions');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filterSessions(e.target.value);
        });
    }
    
    // Filter by date
    const dateFilter = document.getElementById('date-filter');
    if (dateFilter) {
        dateFilter.addEventListener('change', function(e) {
            filterSessionsByDate(e.target.value);
        });
    }
    
    // Refresh data button
    const refreshDataBtn = document.getElementById('refresh-data');
    if (refreshDataBtn) {
        refreshDataBtn.addEventListener('click', function() {
            loadChatSessions();
            loadDashboardData();
            showNotification('Data refreshed successfully!', 'success');
        });
    }
}

// Filter sessions by search term
function filterSessions(searchTerm) {
    const sessionCards = document.querySelectorAll('.session-card');
    const term = searchTerm.toLowerCase().trim();
    
    sessionCards.forEach(card => {
        const sessionId = card.getAttribute('data-session-id');
        const cardText = card.textContent.toLowerCase();
        
        if (term === '' || cardText.includes(term) || sessionId.toLowerCase().includes(term)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update results count
    const visibleCards = document.querySelectorAll('.session-card[style="display: block"], .session-card:not([style*="display: none"])');
    const resultsCount = document.getElementById('search-results-count');
    if (resultsCount) {
        resultsCount.textContent = `Showing ${visibleCards.length} sessions`;
    }
}

// Filter sessions by date
function filterSessionsByDate(dateValue) {
    const sessionCards = document.querySelectorAll('.session-card');
    
    if (!dateValue) {
        // Show all sessions
        sessionCards.forEach(card => {
            card.style.display = 'block';
        });
        return;
    }
    
    const filterDate = new Date(dateValue).toISOString().split('T')[0];
    
    sessionCards.forEach(card => {
        const sessionId = card.getAttribute('data-session-id');
        const sessions = getAllChatSessions();
        const normalizedSessions = normalizeSessionData(sessions);
        const sessionData = normalizedSessions[sessionId];
        
        if (sessionData && sessionData.messages.length > 0) {
            // Check if any message in the session matches the filter date
            const hasMatchingDate = sessionData.messages.some(msg => {
                if (msg.time) {
                    const msgDate = new Date(msg.time).toISOString().split('T')[0];
                    return msgDate === filterDate;
                }
                return false;
            });
            
            card.style.display = hasMatchingDate ? 'block' : 'none';
        } else {
            card.style.display = 'none';
        }
    });
}
// Export all data
function exportAllData() {
    try {
        const sessions = getAllChatSessions();
        const settings = JSON.parse(localStorage.getItem('peterbot_admin_settings') || '{}');
        const sessionsIndex = JSON.parse(localStorage.getItem('peterbot_sessions_index') || '[]');
        
        const exportData = {
            exportInfo: {
                timestamp: new Date().toISOString(),
                version: '1.0',
                totalSessions: Object.keys(sessions).length,
                totalMessages: Object.values(sessions).reduce((total, session) => 
                    total + (session.messages ? session.messages.length : 0), 0)
            },
            sessions: sessions,
            settings: settings,
            sessionsIndex: sessionsIndex
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `peterbot_admin_export_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(link.href);
        showNotification('All data exported successfully!', 'success');
        
    } catch (error) {
        console.error('Error exporting data:', error);
        showNotification('Error exporting data', 'error');
    }
}

// Handle import file
function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/json') {
        showNotification('Please select a valid JSON file', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            
            // Validate import data structure
            if (!importData.sessions && !importData.settings) {
                throw new Error('Invalid import file format');
            }
            
            // Confirm import
            const sessionCount = importData.sessions ? Object.keys(importData.sessions).length : 0;
            const confirmMessage = `This will import ${sessionCount} sessions and settings. Current data will be merged. Continue?`;
            
            if (!confirm(confirmMessage)) {
                return;
            }
            
            // Import sessions
            if (importData.sessions) {
                Object.entries(importData.sessions).forEach(([sessionId, sessionData]) => {
                    localStorage.setItem(`peterbot_chat_${sessionId}`, JSON.stringify(sessionData.messages || sessionData));
                });
            }
            
            // Import settings
            if (importData.settings) {
                localStorage.setItem('peterbot_admin_settings', JSON.stringify(importData.settings));
            }
            
            // Import sessions index
            if (importData.sessionsIndex) {
                localStorage.setItem('peterbot_sessions_index', JSON.stringify(importData.sessionsIndex));
            }
            
            // Refresh the display
            loadChatSessions();
            loadDashboardData();
            loadSettings();
            
            showNotification(`Successfully imported ${sessionCount} sessions!`, 'success');
            
        } catch (error) {
            console.error('Error importing data:', error);
            showNotification('Error importing data: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Clear all data
function clearAllData() {
    const confirmMessage = 'Are you sure you want to delete ALL chat sessions and settings? This action cannot be undone!';
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    // Double confirmation
    const doubleConfirm = prompt('Type "DELETE ALL" to confirm this action:');
    if (doubleConfirm !== 'DELETE ALL') {
        showNotification('Action cancelled', 'info');
        return;
    }
    
    try {
        // Get all peterbot keys
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('peterbot_')) {
                keysToRemove.push(key);
            }
        }
        
        // Remove all keys
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Refresh the display
        loadChatSessions();
        loadDashboardData();
        loadSettings();
        
        showNotification('All data cleared successfully!', 'success');
        
    } catch (error) {
        console.error('Error clearing data:', error);
        showNotification('Error clearing data', 'error');
    }
}

// Generate analytics report
function generateAnalyticsReport() {
    const sessions = getAllChatSessions();
    const normalizedSessions = normalizeSessionData(sessions);
    
    const report = {
        generatedAt: new Date().toISOString(),
        summary: {
            totalSessions: Object.keys(normalizedSessions).length,
            totalMessages: 0,
            totalUserMessages: 0,
            totalBotMessages: 0,
            averageMessagesPerSession: 0,
            averageSessionDuration: 0
        },
        timeAnalysis: {
            sessionsLast7Days: 0,
            sessionsLast30Days: 0,
            peakHours: {},
            peakDays: {}
        },
        serviceAnalysis: {
            webDevelopment: 0,
            virtualAssistant: 0,
            digitalMarketing: 0,
            saxophonePerformance: 0,
            other: 0
        }
    };
    
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Analyze sessions
    Object.values(normalizedSessions).forEach(session => {
        const messages = session.messages || [];
        report.summary.totalMessages += messages.length;
        
        messages.forEach(msg => {
            if (msg.sender === 'user') {
                report.summary.totalUserMessages++;
            } else {
                report.summary.totalBotMessages++;
            }
            
            // Time analysis
            if (msg.time) {
                const msgDate = new Date(msg.time);
                
                if (msgDate >= last7Days) {
                    report.timeAnalysis.sessionsLast7Days++;
                }
                if (msgDate >= last30Days) {
                    report.timeAnalysis.sessionsLast30Days++;
                }
                
                // Peak hours
                const hour = msgDate.getHours();
                report.timeAnalysis.peakHours[hour] = (report.timeAnalysis.peakHours[hour] || 0) + 1;
                
                // Peak days
                const day = msgDate.toLocaleDateString('en-US', { weekday: 'long' });
                report.timeAnalysis.peakDays[day] = (report.timeAnalysis.peakDays[day] || 0) + 1;
            }
        });
    });
    
    // Calculate averages
    const sessionCount = Object.keys(normalizedSessions).length;
    if (sessionCount > 0) {
        report.summary.averageMessagesPerSession = Math.round(report.summary.totalMessages / sessionCount);
    }
    
    return report;
}

// Utility function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Get storage usage
function getStorageUsage() {
    let totalSize = 0;
    let peterbotSize = 0;
    
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            const itemSize = localStorage[key].length + key.length;
            totalSize += itemSize;
            
            if (key.startsWith('peterbot_')) {
                peterbotSize += itemSize;
            }
        }
    }
    
    return {
        total: totalSize,
        peterbot: peterbotSize,
        percentage: totalSize > 0 ? Math.round((peterbotSize / totalSize) * 100) : 0
    };
}

// Update storage info display
function updateStorageInfo() {
    const storageInfo = document.getElementById('storage-info');
    if (!storageInfo) return;
    
    const usage = getStorageUsage();
    
    storageInfo.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h6 class="card-title mb-0">Storage Usage</h6>
            </div>
            <div class="card-body">
                <p><strong>PeterBot Data:</strong> ${formatFileSize(usage.peterbot)}</p>
                <p><strong>Total LocalStorage:</strong> ${formatFileSize(usage.total)}</p>
                <p><strong>Usage Percentage:</strong> ${usage.percentage}%</p>
                <div class="progress mt-2">
                    <div class="progress-bar" role="progressbar" 
                         style="width: ${usage.percentage}%" 
                         aria-valuenow="${usage.percentage}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize storage info update
setInterval(updateStorageInfo, 30000); // Update every 30 seconds

// Console commands for debugging
window.peterbotAdmin = {
    getSessions: getAllChatSessions,
    clearAllData: clearAllData,
    createTestSession: createTestSession,
    exportAllData: exportAllData,
    generateReport: generateAnalyticsReport,
    getStorageUsage: getStorageUsage,
    debugSessions: debugStoredSessions
};

console.log('PeterBot Admin Panel loaded successfully!');
console.log('Available commands: peterbotAdmin.getSessions(), peterbotAdmin.clearAllData(), etc.');
