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
