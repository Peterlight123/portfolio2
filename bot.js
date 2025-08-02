/**
 * PeterChatbot - Advanced chatbot with admin panel integration
 * Version 2.0
 */
class PeterChatbot {
  constructor() {
    // Core properties
    this.chatKey = 'peterbot_chat_history';
    this.sessionKey = 'peterbot_session_id';
    this.sessionId = this.getOrCreateSessionId();
    this.chatHistory = this.loadChatHistory();
    this.isTyping = false;
    this.adminMode = window.location.pathname.includes('admin.html');
    
    // Initialize the bot
    this.init();
  }

  // Get existing session ID or create a new one
  getOrCreateSessionId() {
    let sessionId = localStorage.getItem(this.sessionKey);
    if (!sessionId) {
      sessionId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem(this.sessionKey, sessionId);
    }
    return sessionId;
  }

  // Initialize bot after DOM is ready
  init() {
    // Different initialization for admin page
    if (this.adminMode) {
      this.initAdminPanel();
      return;
    }

    const openBtn = document.getElementById("open-chat-button");
    const closeBtn = document.querySelector(".close-chat-button");
    const container = document.getElementById("chat-container");
    const form = document.getElementById("chat-form");
    const input = document.getElementById("chat-input");

    if (!openBtn || !container || !form || !input) {
      console.error("Chatbot elements not found in the DOM");
      return;
    }

    // Toggle chat visibility
    openBtn.addEventListener("click", () => {
      container.classList.remove("d-none");
      openBtn.classList.add("d-none");
      
      // Show welcome message if chat is empty
      if (this.chatHistory.length === 0) {
        this.appendMessage("👋 Hello! I'm PeterBot. How can I help you today?", "bot");
      }
      
      // Scroll to bottom
      const chatArea = document.getElementById("chat-area-widget");
      if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
    });
    
    // Close chat
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        container.classList.add("d-none");
        openBtn.classList.remove("d-none");
      });
    }

    // Submit chat
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const userInput = input.value.trim();
      if (!userInput) return;

      this.appendMessage(userInput, "user");
      input.value = "";
      
      // Show typing indicator
      this.showTypingIndicator();

      // Generate response with delay for natural feel
      setTimeout(() => {
        this.hideTypingIndicator();
        const response = this.generateResponse(userInput);
        this.appendMessage(response, "bot");
        this.saveChatHistory();
        this.sendToServer();
        
        // Show quick replies if applicable
        this.showQuickReplies(userInput, response);
      }, Math.random() * 1000 + 500); // Random delay between 500-1500ms
    });

    // Load existing history
    if (this.chatHistory.length > 0) {
      // Only show last 10 messages to avoid clutter
      const recentMessages = this.chatHistory.slice(-10);
      recentMessages.forEach(msg => this.displayMessage(msg.text, msg.sender, msg.time));
    }
  }
  
  // Initialize admin panel functionality
  initAdminPanel() {
    console.log("Initializing admin panel for chatbot");
    
    // Load all chat sessions from localStorage
    const allSessions = this.getAllChatSessions();
    
    // Display sessions in admin panel
    const sessionList = document.getElementById("chat-sessions-list");
    if (!sessionList) {
      console.error("Chat sessions list element not found");
      return;
    }
    
    // Clear existing list
    sessionList.innerHTML = '';
    
    // Add each session to the list
    if (Object.keys(allSessions).length === 0) {
      sessionList.innerHTML = '<div class="alert alert-info">No chat sessions found</div>';
    } else {
      Object.keys(allSessions).forEach(sessionId => {
        const session = allSessions[sessionId];
        const lastMessage = session.messages[session.messages.length - 1];
        const timestamp = new Date(lastMessage?.time || Date.now()).toLocaleString();
        
        const sessionItem = document.createElement('div');
        sessionItem.className = 'list-group-item list-group-item-action';
        sessionItem.innerHTML = `
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">Session: ${sessionId.substring(5, 13)}...</h5>
            <small>${timestamp}</small>
          </div>
          <p class="mb-1">${session.messages.length} messages</p>
          <small>Last message: ${lastMessage?.text.substring(0, 50) || 'No messages'}${lastMessage?.text.length > 50 ? '...' : ''}</small>
          <div class="mt-2">
            <button class="btn btn-sm btn-primary view-session" data-session="${sessionId}">View</button>
            <button class="btn btn-sm btn-danger delete-session" data-session="${sessionId}">Delete</button>
          </div>
        `;
        sessionList.appendChild(sessionItem);
      });
      
      // Add event listeners to view and delete buttons
      document.querySelectorAll('.view-session').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const sessionId = e.target.getAttribute('data-session');
          this.viewSession(sessionId, allSessions[sessionId]);
        });
      });
      
      document.querySelectorAll('.delete-session').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const sessionId = e.target.getAttribute('data-session');
          if (confirm('Are you sure you want to delete this chat session?')) {
            this.deleteSession(sessionId);
            // Refresh the admin panel
            this.initAdminPanel();
          }
        });
      });
    }
    
    // Add export all button functionality
    const exportBtn = document.getElementById('export-all-chats');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportAllChats(allSessions);
      });
    }
  }
  
  // View a specific chat session in the admin panel
  viewSession(sessionId, sessionData) {
    const chatViewer = document.getElementById('chat-viewer');
    if (!chatViewer) return;
    
    // Clear existing content
    chatViewer.innerHTML = '';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'bg-light p-3 mb-3 rounded';
    header.innerHTML = `
      <h4>Session: ${sessionId}</h4>
      <p>Total Messages: ${sessionData.messages.length}</p>
      <p>First Message: ${new Date(sessionData.messages[0]?.time || Date.now()).toLocaleString()}</p>
      <p>Last Message: ${new Date(sessionData.messages[sessionData.messages.length - 1]?.time || Date.now()).toLocaleString()}</p>
    `;
    chatViewer.appendChild(header);
    
    // Create chat container
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-messages p-3 border rounded';
    chatContainer.style.maxHeight = '500px';
    chatContainer.style.overflowY = 'auto';
    
    // Add messages
    sessionData.messages.forEach(msg => {
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-message ${msg.sender} mb-3`;
      
      const bubble = document.createElement('div');
      bubble.className = 'bubble p-2 rounded';
      bubble.innerHTML = msg.text.replace(/\n/g, "<br>");
      
      const timestamp = document.createElement('small');
      timestamp.className = 'text-muted d-block mt-1';
      timestamp.textContent = new Date(msg.time).toLocaleString();
      
      bubble.appendChild(timestamp);
      msgDiv.appendChild(bubble);
      chatContainer.appendChild(msgDiv);
    });
    
    chatViewer.appendChild(chatContainer);
    
    // Add export button for this session
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-success mt-3';
    exportBtn.textContent = 'Export This Session';
    exportBtn.addEventListener('click', () => {
      this.exportChatSession(sessionId, sessionData);
    });
    chatViewer.appendChild(exportBtn);
  }
  
  // Delete a chat session
  deleteSession(sessionId) {
    localStorage.removeItem(`peterbot_${sessionId}`);
    console.log(`Deleted session: ${sessionId}`);
  }
  
  // Export a single chat session as JSON
  exportChatSession(sessionId, sessionData) {
    const dataStr = JSON.stringify(sessionData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `chat_session_${sessionId.substring(5, 13)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
  
  // Export all chat sessions as JSON
  exportAllChats(allSessions) {
    const dataStr = JSON.stringify(allSessions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'all_chat_sessions.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
  
  // Get all chat sessions from localStorage
  getAllChatSessions() {
    const sessions = {};
    
    // Loop through localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      // Check if it's a chat session
      if (key.startsWith('peterbot_chat_')) {
        try {
          const sessionData = JSON.parse(localStorage.getItem(key));
          const sessionId = key.replace('peterbot_', '');
          sessions[sessionId] = {
            messages: sessionData,
            id: sessionId
          };
        } catch (e) {
          console.error(`Error parsing session data for ${key}:`, e);
        }
      }
    }
    
    return sessions;
  }

  // Show typing indicator
  showTypingIndicator() {
    if (this.isTyping) return;
    
    this.isTyping = true;
    const chatArea = document.getElementById("chat-area-widget");
    if (!chatArea) return;
    
    const typingDiv = document.createElement("div");
    typingDiv.className = "chat-message bot typing-indicator";
    typingDiv.innerHTML = `
      <div class="bubble typing">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    `;
    
    chatArea.appendChild(typingDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
  }
  
  // Hide typing indicator
  hideTypingIndicator() {
    this.isTyping = false;
    const typingIndicator = document.querySelector(".typing-indicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  // Show quick replies based on conversation context
  showQuickReplies(userInput, botResponse) {
    const chatArea = document.getElementById("chat-area-widget");
    if (!chatArea) return;
    
    // Remove existing quick replies
    const existingReplies = document.querySelector(".quick-replies");
    if (existingReplies) {
      existingReplies.remove();
    }
    
    let quickReplies = [];
    
    // Determine which quick replies to show based on context
    const lowerInput = userInput.toLowerCase();
    const lowerResponse = botResponse.toLowerCase();
    
    if (lowerResponse.includes("hello") || lowerResponse.includes("hi there")) {
      quickReplies = ["Services", "Portfolio", "Contact", "Pricing"];
    } else if (lowerInput.includes("project") || lowerResponse.includes("portfolio")) {
      quickReplies = ["Website Projects", "Design Work", "Contact Me", "Pricing"];
    } else if (lowerInput.includes("price") || lowerResponse.includes("pricing")) {
      quickReplies = ["Website Pricing", "Design Pricing", "Contact Me"];
    } else if (lowerInput.includes("contact") || lowerResponse.includes("contact")) {
      quickReplies = ["WhatsApp", "Email", "Portfolio", "Services"];
    } else {
      // Default quick replies
      quickReplies = ["Services", "Portfolio", "Contact", "About Peter"];
    }
    
    // Create quick replies container
    const repliesDiv = document.createElement("div");
    repliesDiv.className = "quick-replies d-flex flex-wrap justify-content-center mt-3";
    
    // Add each quick reply button
    quickReplies.forEach(reply => {
      const button = document.createElement("button");
      button.className = "btn btn-sm btn-outline-primary m-1 quick-reply-btn";
      button.textContent = reply;
      button.addEventListener("click", () => {
        // When clicked, send as user message
        const input = document.getElementById("chat-input");
        if (input) {
          input.value = reply;
          // Trigger form submission
          document.getElementById("chat-form").dispatchEvent(new Event("submit"));
        }
        
        // Remove quick replies
        repliesDiv.remove();
      });
      
      repliesDiv.appendChild(button);
    });
    
    chatArea.appendChild(repliesDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  // Append new message and store
  appendMessage(text, sender) {
    const time = new Date().toISOString();
    const displayTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = { sender, text, time };
    this.chatHistory.push(msg);
    this.displayMessage(text, sender, displayTime);
    this.saveChatHistory();
  }

  // Display message in chat
  displayMessage(text, sender, time) {
    const chatArea = document.getElementById("chat-area-widget");
    if (!chatArea) return;
    
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-message ${sender}`;

    const bubble = document.createElement("div");
    bubble.className = 'bubble';
    bubble.innerHTML = text.replace(/\n/g, "<br>");

    const stamp = document.createElement("span");
    stamp.className = "message-timestamp";
    stamp.textContent = time;

    bubble.appendChild(stamp);
    msgDiv.appendChild(bubble);
    chatArea.appendChild(msgDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  // Load from localStorage
  loadChatHistory() {
    const key = `peterbot_chat_${this.sessionId}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  }

  // Save to localStorage
  saveChatHistory() {
    const key = `peterbot_chat_${this.sessionId}`;
    localStorage.setItem(key, JSON.stringify(this.chatHistory));
  }

  // Send full chat to server (e.g., Formspree, Firebase, etc.)
  sendToServer() {
    if (this.chatHistory.length < 2) return; // Don't send empty or one-line chats

    const payload = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      pageUrl: location.href,
      messages: this.chatHistory
    };

    fetch("https://formspree.io/f/xpwrbkrr", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ _subject: "Chatbot Log", chatData: payload })
    }).catch(err => console.error("Chat not sent to server:", err));
  }

  // Enhanced AI response generator
  generateResponse(msg) {
    const lower = msg.toLowerCase();

    // Greetings
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.match(/^(yo|sup)/)) {
      return "👋 Hi there! I'm PeterBot, Peter's virtual assistant. How can I help you today?";
    }

    // Projects and portfolio
    if (lower.includes("project") || lower.includes("portfolio") || lower.includes("work") || lower.includes("sample")) {
      return "📁 You can view Peter's projects in his portfolio: <a href='https://peterlight123.github.io/portfolio/project.html' target='_blank'>View Portfolio</a>. He specializes in web development, graphic design, and content creation.";
    }

    // Contact information
    if (lower.includes("contact") || lower.includes("reach") || lower.includes("email") || lower.includes("phone") || lower.includes("whatsapp")) {
      return "📱 You can contact Peter through:\n\n📧 Email: petereluwade55@gmail.com\n📞 Phone/WhatsApp: +234 810 882 1809\n\nOr use the contact form on the website!";
    }

    // Pricing and rates
    if (lower.includes("price") || lower.includes("cost") || lower.includes("rate") || lower.includes("charge") || lower.includes("fee")) {
      return "💰 Here's a quick guide to Peter's rates:\n• Website: ₦150k – ₦500k\n• Logo/Graphics: ₦30k – ₦100k\n• VA Services: From ₦10k/week\n\nFor a custom quote based on your specific requirements, please reach out directly.";
    }

    // Services
    if (lower.includes("service") || lower.includes("offer") || lower.includes("provide") || lower.includes("do you")) {
      return "🛠️ Peter offers these services:\n\n• Web Development & Design\n• Graphic Design (logos, flyers, social media)\n• Content Creation & Blog Management\n• Social Media Management\n• Virtual Assistant Services\n• Data Entry & Administrative Support\n\nWhich service are you interested in?";
    }

    // About Peter
    if (lower.includes("about") || lower.includes("who") || lower.includes("background")) {
      return "👨‍💻 Peter Eluwade (Peter Lightspeed) is a versatile Virtual Assistant and Web Developer based in Nigeria. With certifications from FreeCodeCamp and other institutions, he specializes in web development, graphic design, content creation, and digital marketing. He also creates music under the name 'Peterphonist'!";
    }

    // Fallback response
    return "🤖 I'm still learning! If you have questions about Peter's services, projects, pricing, or how to get in touch, please let me know. You can also visit <a href='https://peterlight123.github.io/portfolio/' target='_blank'>Peter's portfolio</a> for more information.";
  }
}

// Activate on DOM load
document.addEventListener("DOMContentLoaded", () => {
  window.peterBot = new PeterChatbot();
});
