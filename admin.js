/**
 * PeterBot Admin Panel
 * Manages the admin interface for the chatbot
 */
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  checkAuth();
  
  // Initialize admin panel
  initAdminPanel();
  
  // Handle logout
  document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('peterbot_admin_auth');
    window.location.href = 'admin-login.html';
  });
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
    localStorage.removeItem('peterbot_admin_

_Note: `style.css`, `index (6).html`, `sponsor.html`, and 3 more were excluded from the analysis due to size limit. Please upload again or start a new conversation if your question is related to them._
