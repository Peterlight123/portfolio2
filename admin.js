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
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Check if auth is still valid (24 hours)
    const now = new Date().getTime();
    const authTime = auth.timestamp || 0;
    
    if (now - authTime >= 24 * 60 * 60 * 1000) {
        localStorage.removeItem('peterbot_admin_auth');
        window.location.href = 'admin-login.html';
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
    
    // Update recent sessions table
    updateRecentSessionsTable(sessions);
    
    // Update common questions
    updateCommonQuestions(sessions);
}

// Update recent sessions table
function updateRecentSessionsTable(sessions) {
    const tableBody = document.getElementById('recent-sessions-table');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // If no sessions
    if (Object.keys(sessions).length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" class="text-center">No chat sessions found</td>';
        tableBody.appendChild(row);
        return;
    }
    
    // Sort sessions by last message time (most recent first)
    const sortedSessions = Object.entries(sessions).sort((a, b) => {
        const aLastMsg = a[1].messages.length > 0 ? new Date(a[1].messages[a[1].messages.length - 1].time) : new Date(0);
        const bLastMsg = b[1].messages.length > 0 ? new Date(b[1].messages[b[1].messages.length - 1].time) : new Date(0);
        return bLastMsg - aLastMsg;
    });
    
    // Show only the 10 most recent sessions
    const recentSessions = sortedSessions.slice(0, 10);
    
    recentSessions.forEach(([sessionId, session]) => {
        const row = document.createElement('tr');
        
        // Get last message time
        const lastMessageTime = session.messages.length > 0 ? 
            new Date(session.messages[session.messages.length - 1].time).toLocaleString() : 'N/A';
        
        // Get last message text (truncated)
        const lastMessageText = session.messages.length > 0 ? 
            session.messages[session.messages.length - 1].text.substring(0, 30) + 
            (session.messages[session.messages.length - 1].text.length > 30 ? '...' : '') : 'N/A';
        
        row.innerHTML = `
            <td>${sessionId.substring(0, 8)}...</td>
            <td>${lastMessageTime}</td>
            <td>${session.messages.length}</td>
            <td>${lastMessageText}</td>
            <td>
                <button class="btn btn-sm btn-primary view-session" data-session="${sessionId}">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-session" data-session="${sessionId}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to view and delete buttons
    document.querySelectorAll('.view-session').forEach(btn => {
        btn.addEventListener('click', function() {
            const sessionId = this.getAttribute('data-session');
            viewChatSession(sessionId, sessions[sessionId]);
        });
    });
    
    document.querySelectorAll('.delete-session').forEach(btn => {
        btn.addEventListener('click', function() {
            const sessionId = this.getAttribute('data-session');
            if (confirm('Are you sure you want to delete this chat session?')) {
                deleteSession(sessionId);
                loadDashboardData(); // Refresh dashboard
            }
        });
    });
}

// Update common questions section
function updateCommonQuestions(sessions) {
    const commonQuestionsDiv = document.getElementById('common-questions');
    if (!commonQuestionsDiv) return;
    
    // Extract all user messages
    const userMessages = [];
    Object.values(sessions).forEach(session => {
        session.messages.forEach(msg => {
            if (msg.sender === 'user') {
                userMessages.push(msg.text.toLowerCase());
            }
        });
    });
    
    // If no messages
    if (userMessages.length === 0) {
        commonQuestionsDiv.innerHTML = '<div class="alert alert-info">No chat data available yet.</div>';
        return;
    }
    
    // Count question frequencies
    const questionCounts = {};
    const questionCategories = {
        services: ['service', 'offer', 'provide', 'do you', 'can you', 'help with'],
        pricing: ['price', 'cost', 'rate', 'charge', 'fee', 'pricing', 'package', 'pay'],
        portfolio: ['project', 'portfolio', 'work', 'sample', 'showcase', 'example'],
        contact: ['contact', 'reach', 'email', 'phone', 'whatsapp', 'call', 'message'],
        music: ['music', 'song', 'artist', 'peterphonist', 'beat', 'producer', 'track']
    };
    
    userMessages.forEach(msg => {
        // Categorize the message
        let category = 'other';
        for (const [cat, keywords] of Object.entries(questionCategories)) {
            if (keywords.some(keyword => msg.includes(keyword))) {
                category = cat;
                break;
            }
        }
        
        // Count the category
        questionCounts[category] = (questionCounts[category] || 0) + 1;
    });
    
    // Create HTML for common questions
    let html = '<div class="row">';
    
    const categories = Object.entries(questionCounts).sort((a, b) => b[1] - a[1]);
    
    categories.forEach(([category, count]) => {
        const percentage = Math.round((count / userMessages.length) * 100);
        
        let icon, color;
        switch(category) {
            case 'services': icon = 'bi-gear'; color = 'primary'; break;
            case 'pricing': icon = 'bi-cash'; color = 'success'; break;
            case 'portfolio': icon = 'bi-folder'; color = 'warning'; break;
            case 'contact': icon = 'bi-envelope'; color = 'danger'; break;
            case 'music': icon = 'bi-music-note'; color = 'info'; break;
            default: icon = 'bi-question-circle'; color = 'secondary';
        }
        
        html += `
            <div class="col-md-4 mb-3">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="rounded-circle bg-${color} bg-opacity-10 p-3 me-3">
                                <i class="bi ${icon} text-${color} fs-4"></i>
                            </div>
                            <div>
                                <h6 class="mb-0 text-capitalize">${category} Questions</h6>
                                <div class="d-flex align-items-center">
                                    <div class="progress flex-grow-1 me-2" style="height: 6px;">
                                        <div class="progress-bar bg-${color}" role="progressbar" style="width: ${percentage}%"></div>
                                    </div>
                                    <span class="text-muted small">${percentage}%</span>
                                </div>
                                <small class="text-muted">${count} questions</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    commonQuestionsDiv.innerHTML = html;
}

// Load chat sessions
function loadChatSessions() {
    let sessions = getAllChatSessions();
    
    // Normalize session data to ensure compatibility
    sessions = normalizeSessionData(sessions);
    
    const sessionsList = document.getElementById('chat-sessions-list');
    
    if (!sessionsList) return;
    
    // Clear existing list
    sessionsList.innerHTML = '';
    
    // If no sessions
    if (Object.keys(sessions).length === 0) {
        const item = document.createElement('div');
        item.className = 'list-group-item text-center';
        item.textContent = 'No chat sessions found';
        sessionsList.appendChild(item);
        return;
    }
    
    // Sort sessions by last message time (most recent first)
    const sortedSessions = Object.entries(sessions).sort((a, b) => {
        const aLastMsg = a[1].messages.length > 0 ? new Date(a[1].messages[a[1].messages.length - 1].time) : new Date(0);
        const bLastMsg = b[1].messages.length > 0 ? new Date(b[1].messages[b[1].messages.length - 1].time) : new Date(0);
        return bLastMsg - aLastMsg;
    });
    
    sortedSessions.forEach(([sessionId, session]) => {
        const lastMessageTime = session.messages.length > 0 ? 
            new Date(session.messages[session.messages.length - 1].time).toLocaleString() : 'N/A';
        
        const item = document.createElement('div');
        item.className = 'list-group-item list-group-item-action chat-session-item';
        item.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">Session ${sessionId.substring(0, 8)}...</h6>
                <small>${session.messages.length} messages</small>
            </div>
            <p class="mb-1 text-truncate">
                ${session.messages.length > 0 ? session.messages[session.messages.length - 1].text : 'No messages'}
            </p>
            <small class="text-muted">${lastMessageTime}</small>
        `;
        
        item.addEventListener('click', () => {
            // Highlight selected session
            document.querySelectorAll('.chat-session-item').forEach(el => {
                el.classList.remove('active');
            });
            item.classList.add('active');
            
            // View session
            viewChatSession(sessionId, session);
        });
        
        sessionsList.appendChild(item);
    });
}

// View chat session
function viewChatSession(sessionId, session) {
    const chatViewer = document.getElementById('chat-viewer');
    if (!chatViewer) return;
    
    // Clear existing content
    chatViewer.innerHTML = '';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'mb-4';
    
    const firstMessageTime = session.messages.length > 0 ? 
        new Date(session.messages[0].time).toLocaleString() : 'N/A';
    const lastMessageTime = session.messages.length > 0 ? 
        new Date(session.messages[session.messages.length - 1].time).toLocaleString() : 'N/A';
    
    header.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <h5>Session: ${sessionId}</h5>
            <div>
                <button class="btn btn-sm btn-outline-primary export-session" data-session="${sessionId}">
                    <i class="bi bi-download me-1"></i> Export
                </button>
                <button class="btn btn-sm btn-outline-danger delete-session-view" data-session="${sessionId}">
                    <i class="bi bi-trash me-1"></i> Delete
                </button>
            </div>
        </div>
        <div class="text-muted small">
            <div>Messages: ${session.messages.length}</div>
            <div>Started: ${firstMessageTime}</div>
            <div>Last activity: ${lastMessageTime}</div>
        </div>
        <hr>
    `;
    
    chatViewer.appendChild(header);
    
    // If no messages
    if (session.messages.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'text-center text-muted py-5';
        emptyState.innerHTML = `
            <i class="bi bi-chat-square-text fs-1"></i>
            <p class="mt-3">This chat session has no messages</p>
        `;
        chatViewer.appendChild(emptyState);
        return;
    }
    
    // Create chat container
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-messages';
    
    // Add messages
    session.messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${msg.sender}-message mb-3`;
        
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        
        // Format message text (handle links, etc.)
        const formattedText = formatMessageText(msg.text);
        bubble.innerHTML = formattedText;
        
        const timeSpan = document.createElement('div');
        timeSpan.className = 'message-time';
        timeSpan.textContent = new Date(msg.time).toLocaleString();
        bubble.appendChild(timeSpan);
        
        messageDiv.appendChild(bubble);
        chatContainer.appendChild(messageDiv);
    });
    
    chatViewer.appendChild(chatContainer);
    
    // Add event listeners to export and delete buttons
    chatViewer.querySelector('.export-session').addEventListener('click', function() {
        exportChatSession(sessionId, session);
    });
    
    chatViewer.querySelector('.delete-session-view').addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this chat session?')) {
            deleteSession(sessionId);
            loadChatSessions();
            loadDashboardData();
            
            // Clear chat viewer
            chatViewer.innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="bi bi-chat-square-text fs-1"></i>
                    <p class="mt-3">Select a chat session to view the conversation</p>
                </div>
            `;
        }
    });
}

// Format message text
function formatMessageText(text) {
    // Convert URLs to links
    text = text.replace(/(https?:\/\/[^\s]+)/g, url => `<a href="${url}" target="_blank">${url}</a>`);
    
    // Convert line breaks to <br>
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

// Initialize charts
function initCharts() {
    if (typeof Chart === 'undefined') return;
    
    const sessions = getAllChatSessions();
    
    // Message distribution chart
    const messageCtx = document.getElementById('message-distribution-chart');
    if (messageCtx) {
        let userMessages = 0;
        let botMessages = 0;
        
        Object.values(sessions).forEach(session => {
            session.messages.forEach(msg => {
                if (msg.sender === 'user') {
                    userMessages++;
                } else {
                    botMessages++;
                }
            });
        });
        
        new Chart(messageCtx, {
            type: 'doughnut',
            data: {
                labels: ['User Messages', 'Bot Responses'],
                datasets: [{
                    data: [userMessages, botMessages],
                    backgroundColor: ['#0d6efd', '#20c997'],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }
    
    // Sessions over time chart
    const sessionsCtx = document.getElementById('sessions-time-chart');
    if (sessionsCtx) {
        // Get dates for the last 7 days
        const dates = [];
        const counts = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
            dates.push(dateString);
            counts.push(0);
        }
        
        // Count sessions per day
        Object.values(sessions).forEach(session => {
            if (session.messages.length > 0) {
                const sessionDate = new Date(session.messages[0].time).toISOString().split('T')[0];
                const index = dates.indexOf(sessionDate);
                if (index !== -1) {
                    counts[index]++;
                }
            }
        });
        
        // Format dates for display
        const displayDates = dates.map(date => {
            const [year, month, day] = date.split('-');
            return `${month}/${day}`;
        });
        
        new Chart(sessionsCtx, {
            type: 'line',
            data: {
                labels: displayDates,
                datasets: [{
                    label: 'Chat Sessions',
                    data: counts,
                    borderColor: '#0d6efd',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
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
    
    // Top questions chart
    const questionsCtx = document.getElementById('top-questions-chart');
    if (questionsCtx) {
        // Extract all user messages
        const userMessages = [];
        Object.values(sessions).forEach(session => {
            session.messages.forEach(msg => {
                if (msg.sender === 'user') {
                    userMessages.push(msg.text.toLowerCase());
                }
            });
        });
        
        // Count question categories
        const questionCategories = {
            services: 0,
            pricing: 0,
            portfolio: 0,
            contact: 0,
            other: 0
        };
        
        const categoryKeywords = {
            services: ['service', 'offer', 'provide', 'do you', 'can you', 'help with'],
            pricing: ['price', 'cost', 'rate', 'charge', 'fee', 'pricing', 'package', 'pay'],
            portfolio: ['project', 'portfolio', 'work', 'sample', 'showcase', 'example'],
            contact: ['contact', 'reach', 'email', 'phone', 'whatsapp', 'call', 'message']
        };
        
        userMessages.forEach(msg => {
            let categorized = false;
            
            for (const [category, keywords] of Object.entries(categoryKeywords)) {
                if (keywords.some(keyword => msg.includes(keyword))) {
                    questionCategories[category]++;
                    categorized = true;
                    break;
                }
            }
            
            if (!categorized) {
                questionCategories.other++;
            }
        });
        
                new Chart(questionsCtx, {
            type: 'bar',
            data: {
                labels: ['Services', 'Pricing', 'Portfolio', 'Contact', 'Other'],
                datasets: [{
                    label: 'Frequency',
                    data: [
                        questionCategories.services,
                        questionCategories.pricing,
                        questionCategories.portfolio,
                        questionCategories.contact,
                        questionCategories.other
                    ],
                    backgroundColor: [
                        '#0d6efd',
                        '#20c997',
                        '#fd7e14',
                        '#dc3545',
                        '#6c757d'
                    ]
                }]
            },
            options: {
                responsive: true,
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
        
        // Update analytics table
        updateAnalyticsTable(questionCategories, userMessages.length);
    }
}

// Update analytics table
function updateAnalyticsTable(categories, totalMessages) {
    const table = document.getElementById('analytics-table');
    if (!table) return;
    
    // Clear existing rows
    table.innerHTML = '';
    
    if (totalMessages === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" class="text-center">No data available</td>';
        table.appendChild(row);
        return;
    }
    
    // Create rows for each category
    const categoryData = [
        { name: 'Services Inquiries', count: categories.services },
        { name: 'Pricing Questions', count: categories.pricing },
        { name: 'Portfolio Requests', count: categories.portfolio },
        { name: 'Contact Information', count: categories.contact },
        { name: 'Other Questions', count: categories.other }
    ];
    
    categoryData.forEach(category => {
        const percentage = totalMessages > 0 ? Math.round((category.count / totalMessages) * 100) : 0;
        
        // Simulate trend (in a real app, this would compare to previous period)
        const trend = Math.floor(Math.random() * 21) - 10; // Random number between -10 and 10
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.name}</td>
            <td>${category.count}</td>
            <td>${percentage}%</td>
            <td>
                ${trend > 0 ? 
                    `<span class="text-success"><i class="bi bi-arrow-up"></i> ${trend}%</span>` : 
                    trend < 0 ? 
                    `<span class="text-danger"><i class="bi bi-arrow-down"></i> ${Math.abs(trend)}%</span>` : 
                    `<span class="text-warning"><i class="bi bi-dash"></i> 0%</span>`
                }
            </td>
        `;
        
        table.appendChild(row);
    });
}

// Load settings
function loadSettings() {
    try {
        const settings = JSON.parse(localStorage.getItem('peterbot_settings') || '{}');
        
        // General settings
        if (document.getElementById('bot-name')) {
            document.getElementById('bot-name').value = settings.botName || 'PeterBot';
        }
        
        if (document.getElementById('welcome-message')) {
            document.getElementById('welcome-message').value = settings.welcomeMessage || 
                "👋 Hello! I'm PeterBot. How can I help you today?";
        }
        
        if (document.getElementById('bot-avatar')) {
            document.getElementById('bot-avatar').value = settings.botAvatar || 
                'https://i.imgur.com/Cgy2Aeq.png';
        }
        
        if (document.getElementById('show-typing-indicator')) {
            document.getElementById('show-typing-indicator').checked = 
                settings.showTypingIndicator !== undefined ? settings.showTypingIndicator : true;
        }
        
        if (document.getElementById('show-quick-replies')) {
            document.getElementById('show-quick-replies').checked = 
                settings.showQuickReplies !== undefined ? settings.showQuickReplies : true;
        }
        
        // Advanced settings
        if (document.getElementById('response-delay')) {
            document.getElementById('response-delay').value = settings.responseDelay || 800;
        }
        
        if (document.getElementById('max-history')) {
            document.getElementById('max-history').value = settings.maxHistory || 50;
        }
        
        if (document.getElementById('formspree-endpoint')) {
            document.getElementById('formspree-endpoint').value = settings.formspreeEndpoint || 
                'https://formspree.io/f/xpwrbkrr';
        }
        
        if (document.getElementById('save-to-server')) {
            document.getElementById('save-to-server').checked = 
                settings.saveToServer !== undefined ? settings.saveToServer : true;
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Refresh dashboard
    const refreshDashboardBtn = document.getElementById('refresh-dashboard');
    if (refreshDashboardBtn) {
        refreshDashboardBtn.addEventListener('click', loadDashboardData);
    }
    
    // Export all data
    const exportAllDataBtn = document.getElementById('export-all-data');
    if (exportAllDataBtn) {
        exportAllDataBtn.addEventListener('click', exportAllData);
    }
    
    // Clear all data
    const clearAllDataBtn = document.getElementById('clear-all-data');
    if (clearAllDataBtn) {
        clearAllDataBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all chat data? This action cannot be undone.')) {
                clearAllData();
                loadDashboardData();
                loadChatSessions();
            }
        });
    }
    
    // Export all chats
    const exportAllChatsBtn = document.getElementById('export-all-chats');
    if (exportAllChatsBtn) {
        exportAllChatsBtn.addEventListener('click', exportAllData);
    }
    
    // Refresh analytics
    const refreshAnalyticsBtn = document.getElementById('refresh-analytics');
    if (refreshAnalyticsBtn) {
        refreshAnalyticsBtn.addEventListener('click', function() {
            initCharts();
        });
    }
    
    // Export analytics
    const exportAnalyticsBtn = document.getElementById('export-analytics');
    if (exportAnalyticsBtn) {
        exportAnalyticsBtn.addEventListener('click', exportAnalyticsData);
    }
    
    // Save settings
    const saveSettingsBtn = document.getElementById('save-settings');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }
    
    // Export all settings
    const exportAllSettingsBtn = document.getElementById('export-all-settings');
    if (exportAllSettingsBtn) {
        exportAllSettingsBtn.addEventListener('click', exportAllData);
    }
    
    // Import data
    const importDataBtn = document.getElementById('import-data-btn');
    if (importDataBtn) {
        importDataBtn.addEventListener('click', importData);
    }
    
    // Clear all chats
    const clearAllChatsBtn = document.getElementById('clear-all-chats');
    if (clearAllChatsBtn) {
        clearAllChatsBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
                clearAllChats();
                loadDashboardData();
                loadChatSessions();
            }
        });
    }
    
    // Reset all settings
    const resetAllSettingsBtn = document.getElementById('reset-all-settings');
    if (resetAllSettingsBtn) {
        resetAllSettingsBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
                resetAllSettings();
                loadSettings();
            }
        });
    }
    
    // Search sessions
    const searchBtn = document.getElementById('search-btn');
    const sessionSearch = document.getElementById('session-search');
    if (searchBtn && sessionSearch) {
        searchBtn.addEventListener('click', function() {
            searchSessions(sessionSearch.value);
        });
        
        sessionSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchSessions(sessionSearch.value);
            }
        });
    }
}

// Search sessions
function searchSessions(query) {
    if (!query) {
        loadChatSessions();
        return;
    }
    
    query = query.toLowerCase();
    const sessions = getAllChatSessions();
    const filteredSessions = {};
    
    Object.entries(sessions).forEach(([sessionId, session]) => {
        // Check if any message contains the query
        const hasMatch = session.messages.some(msg => 
            msg.text.toLowerCase().includes(query)
        );
        
        if (hasMatch) {
            filteredSessions[sessionId] = session;
        }
    });
    
    // Update sessions list with filtered results
    const sessionsList = document.getElementById('chat-sessions-list');
    if (!sessionsList) return;
    
    // Clear existing list
    sessionsList.innerHTML = '';
    
    // If no matching sessions
    if (Object.keys(filteredSessions).length === 0) {
        const item = document.createElement('div');
        item.className = 'list-group-item text-center';
        item.textContent = 'No matching sessions found';
        sessionsList.appendChild(item);
        return;
    }
    
    // Sort sessions by last message time (most recent first)
    const sortedSessions = Object.entries(filteredSessions).sort((a, b) => {
        const aLastMsg = a[1].messages.length > 0 ? new Date(a[1].messages[a[1].messages.length - 1].time) : new Date(0);
        const bLastMsg = b[1].messages.length > 0 ? new Date(b[1].messages[b[1].messages.length - 1].time) : new Date(0);
        return bLastMsg - aLastMsg;
    });
    
    sortedSessions.forEach(([sessionId, session]) => {
        const lastMessageTime = session.messages.length > 0 ? 
            new Date(session.messages[session.messages.length - 1].time).toLocaleString() : 'N/A';
        
        const item = document.createElement('div');
        item.className = 'list-group-item list-group-item-action chat-session-item';
        item.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">Session ${sessionId.substring(0, 8)}...</h6>
                <small>${session.messages.length} messages</small>
            </div>
            <p class="mb-1 text-truncate">
                ${session.messages.length > 0 ? session.messages[session.messages.length - 1].text : 'No messages'}
            </p>
            <small class="text-muted">${lastMessageTime}</small>
        `;
        
        item.addEventListener('click', () => {
            // Highlight selected session
            document.querySelectorAll('.chat-session-item').forEach(el => {
                el.classList.remove('active');
            });
            item.classList.add('active');
            
            // View session
            viewChatSession(sessionId, session);
        });
        
        sessionsList.appendChild(item);
    });
}

// Save settings
function saveSettings() {
    try {
        const settings = {
            // General settings
            botName: document.getElementById('bot-name')?.value || 'PeterBot',
            welcomeMessage: document.getElementById('welcome-message')?.value || "👋 Hello! I'm PeterBot. How can I help you today?",
            botAvatar: document.getElementById('bot-avatar')?.value || 'https://i.imgur.com/Cgy2Aeq.png',
            showTypingIndicator: document.getElementById('show-typing-indicator')?.checked || true,
            showQuickReplies: document.getElementById('show-quick-replies')?.checked || true,
            
            // Advanced settings
            responseDelay: parseInt(document.getElementById('response-delay')?.value) || 800,
            maxHistory: parseInt(document.getElementById('max-history')?.value) || 50,
            formspreeEndpoint: document.getElementById('formspree-endpoint')?.value || 'https://formspree.io/f/xpwrbkrr',
            saveToServer: document.getElementById('save-to-server')?.checked || true,
            
            // Metadata
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('peterbot_settings', JSON.stringify(settings));
        
        // Show success message
        alert('Settings saved successfully!');
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Error saving settings. Please try again.');
    }
}

// Reset all settings
function resetAllSettings() {
    localStorage.removeItem('peterbot_settings');
    alert('All settings have been reset to default.');
}

// Clear all chats
function clearAllChats() {
    // Get all keys in localStorage
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('peterbot_chat_')) {
            keys.push(key);
        }
    }
    
    // Remove all chat keys
    keys.forEach(key => {
        localStorage.removeItem(key);
    });
    
    // Clear sessions index
    localStorage.removeItem('peterbot_sessions_index');
    
    alert('All chat history has been cleared.');
}

// Clear all data
function clearAllData() {
    // Get all keys in localStorage
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('peterbot_')) {
            keys.push(key);
        }
    }
    
    // Remove all peterbot keys except auth
    keys.forEach(key => {
        if (key !== 'peterbot_admin_auth') {
            localStorage.removeItem(key);
        }
    });
    
    alert('All chat data has been cleared.');
}

// Export chat session
function exportChatSession(sessionId, session) {
    const data = {
        sessionId,
        messages: session.messages,
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileName = `peterbot_session_${sessionId.replace(/[^a-z0-9]/gi, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
}

// Export all data
function exportAllData() {
    const sessions = getAllChatSessions();
    const settings = JSON.parse(localStorage.getItem('peterbot_settings') || '{}');
    
    const data = {
        sessions,
        settings,
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileName = `peterbot_all_data_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
}

// Export analytics data
function exportAnalyticsData() {
    const sessions = getAllChatSessions();
    
    // Count messages by type
    let userMessages = 0;
    let botMessages = 0;
    
    // Count messages by category
    const categories = {
        services: 0,
        pricing: 0,
        portfolio: 0,
        contact: 0,
        music: 0,
        other: 0
    };
    
    const categoryKeywords = {
        services: ['service', 'offer', 'provide', 'do you', 'can you', 'help with'],
        pricing: ['price', 'cost', 'rate', 'charge', 'fee', 'pricing', 'package', 'pay'],
        portfolio: ['project', 'portfolio', 'work', 'sample', 'showcase', 'example'],
        contact: ['contact', 'reach', 'email', 'phone', 'whatsapp', 'call', 'message'],
        music: ['music', 'song', 'artist', 'peterphonist', 'beat', 'producer', 'track']
    };
    
    // Count messages by date
    const messagesByDate = {};
    
    Object.values(sessions).forEach(session => {
        session.messages.forEach(msg => {
            // Count by type
            if (msg.sender === 'user') {
                userMessages++;
                
                // Categorize user messages
                const text = msg.text.toLowerCase();
                let categorized = false;
                
                for (const [category, keywords] of Object.entries(categoryKeywords)) {
                    if (keywords.some(keyword => text.includes(keyword))) {
                        categories[category]++;
                        categorized = true;
                        break;
                    }
                }
                
                if (!categorized) {
                    categories.other++;
                }
            } else {
                botMessages++;
            }
            
            // Count by date
            const date = new Date(msg.time).toISOString().split('T')[0]; // YYYY-MM-DD
            messagesByDate[date] = (messagesByDate[date] || 0) + 1;
        });
    });
    
    // Prepare analytics data
    const analyticsData = {
        summary: {
            totalSessions: Object.keys(sessions).length,
            totalMessages: userMessages + botMessages,
            userMessages,
            botMessages,
            avgMessagesPerSession: Object.keys(sessions).length > 0 ? 
                Math.round((userMessages + botMessages) / Object.keys(sessions).length) : 0
        },
        categories,
        messagesByDate,
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileName = `peterbot_analytics_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
}

// Import data
function importData() {
    const fileInput = document.getElementById('import-file');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert('Please select a file to import.');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Check if it's a valid export file
            if (!data.sessions && !data.sessionId) {
                throw new Error('Invalid import file format.');
            }
            
            // Import sessions
            if (data.sessions) {
                // It's a full export
                const sessionIds = [];
                
                Object.entries(data.sessions).forEach(([sessionId, session]) => {
                    localStorage.setItem(`peterbot_chat_${sessionId}`, JSON.stringify(session.messages));
                    sessionIds.push(sessionId);
                });
                
                // Update sessions index
                localStorage.setItem('peterbot_sessions_index', JSON.stringify(sessionIds));
                
                // Import settings
                if (data.settings) {
                    localStorage.setItem('peterbot_settings', JSON.stringify(data.settings));
                }
                
                alert('All data imported successfully!');
            } else if (data.sessionId && data.messages) {
                // It's a single session export
                localStorage.setItem(`peterbot_chat_${data.sessionId}`, JSON.stringify(data.messages));
                
                // Update sessions index
                let sessionsIndex = JSON.parse(localStorage.getItem('peterbot_sessions_index') || '[]');
                if (!sessionsIndex.includes(data.sessionId)) {
                    sessionsIndex.push(data.sessionId);
                    localStorage.setItem('peterbot_sessions_index', JSON.stringify(sessionsIndex));
                }
                
                alert('Session imported successfully!');
            }
            
            // Refresh the admin panel
            loadDashboardData();
            loadChatSessions();
            loadSettings();
            initCharts();
            
            // Clear the file input
            fileInput.value = '';
        } catch (error) {
            console.error('Error importing data:', error);
            alert('Error importing data: ' + error.message);
        }
    };
    
    reader.readAsText(file);
}

// Delete session
function deleteSession(sessionId) {
    localStorage.removeItem(`peterbot_chat_${sessionId}`);
    
    // Update sessions index
    let sessionsIndex = JSON.parse(localStorage.getItem('peterbot_sessions_index') || '[]');
    sessionsIndex = sessionsIndex.filter(id => id !== sessionId);
    localStorage.setItem('peterbot_sessions_index', JSON.stringify(sessionsIndex));
}

// Add CSS for chat messages styling
const adminStyles = `
<style>
.chat-messages {
    max-height: 500px;
    overflow-y: auto;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
}

.chat-message {
    display: flex;
    margin-bottom: 15px;
}

.user-message {
    justify-content: flex-end;
}

.bot-message {
    justify-content: flex-start;
}

.chat-bubble {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 18px;
    position: relative;
    word-wrap: break-word;
}

.user-message .chat-bubble {
    background: #007bff;
    color: white;
    border-bottom-right-radius: 4px;
}

.bot-message .chat-bubble {
    background: white;
    color: #333;
    border: 1px solid #e9ecef;
    border-bottom-left-radius: 4px;
}

.message-time {
    font-size: 0.75rem;
    opacity: 0.7;
    margin-top: 5px;
    text-align: right;
}

.bot-message .message-time {
    text-align: left;
}

.chat-session-item:hover {
    background-color: #f8f9fa;
}

.chat-session-item.active {
    background-color: #e3f2fd;
    border-color: #2196f3;
}

.admin-actions {
    display: flex;
    gap: 10px;
    align-items: center;
}

@media (max-width: 768px) {
    .chat-bubble {
        max-width: 85%;
    }
    
    .admin-actions {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', adminStyles);

// Add window error handler for debugging
window.addEventListener('error', function(e) {
    console.error('Admin Panel Error:', e.error);
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
});

console.log('PeterBot Admin Panel loaded successfully');
