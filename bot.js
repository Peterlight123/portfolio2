/**
 * Peter Lightspeed Assistant - Simple Website-Based Chatbot
 * Answers questions based on website content and saves chat history for admin
 */

class PeterAssistant {
  constructor() {
    // Core properties
    this.sessionId = this.generateSessionId();
    this.chatHistory = [];
    this.isTyping = false;
    this.websiteData = {};
    
    // DOM elements
    this.chatWidget = document.getElementById('chatbot-widget');
    this.openChatBtn = document.getElementById('open-chat-button');
    this.closeChatBtn = document.getElementById('close-chat');
    this.chatForm = document.getElementById('chat-form');
    this.userInput = document.getElementById('user-input-widget');
    this.chatArea = document.getElementById('chat-area-widget');
    this.sendButton = document.getElementById('send-button-widget');
    this.notificationBadge = document.getElementById('notification-badge');
    
    // Initialize
    this.init();
  }
  
  // Initialize the chatbot
  async init() {
    // Check if DOM elements exist
    if (!this.chatWidget || !this.openChatBtn || !this.chatForm) {
      console.error('Required chatbot elements not found');
      return;
    }
    
    // Load website data
    await this.loadWebsiteData();
    
    // Bind events
    this.bindEvents();
    
    // Show welcome message after a short delay
    setTimeout(() => {
      this.showWelcomeMessage();
    }, 1000);
  }
  
  // Generate a unique session ID
  generateSessionId() {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }
  
  // Load website data for answering questions
  async loadWebsiteData() {
    try {
      // This data is based on your website content at peterlight123.github.io/portfolio
      this.websiteData = {
        about: {
          name: "Eluwade Peter Toluwanimi",
          nickname: "Peter Lightspeed",
          role: "Web Developer & Content Specialist",
          description: "I build modern websites for businesses, vendors, and stores that want to grow online. I also handle content management and creative services.",
          contact: {
            email: "petereluwade55@gmail.com",
            phone: "+234 810 882 1809",
            whatsapp: "+234 810 882 1809"
          }
        },
        services: [
          {
            title: "Typing & Data Entry",
            description: "Fast and accurate typing, file conversion, document formatting, and data management services."
          },
          {
            title: "Graphics Design",
            description: "Eye-catching designs for social media, logos, flyers, and ads using Canva and Photoshop."
          },
          {
            title: "Blogger Setup & Content",
            description: "Professional Blogger blog creation, layout design, SEO optimization, and AdSense integration."
          },
          {
            title: "Website Design",
            description: "Responsive websites that work perfectly on both mobile and desktop screens with swift loading speeds."
          },
          {
            title: "SEO & Meta Setup",
            description: "Boost your blog or website visibility with proper keyword research, SEO optimization, and meta setup."
          },
          {
            title: "Social Media Management",
            description: "Manage and grow social platforms (YouTube, TikTok, Facebook) with posting schedules, branding & analytics."
          }
        ],
        certifications: [
          {
            title: "Google Digital Marketing Certificate",
            issuer: "Google",
            link: "https://skillshop.credential.net/2656d9be-a41b-477e-a518-17d364c69a32"
          },
          {
            title: "Responsive Web Design",
            issuer: "freeCodeCamp",
            link: "https://www.freecodecamp.org/certification/Peterlightspeed/responsive-web-design"
          },
          {
            title: "Trade Test I & II",
            issuer: "Federal Ministry of Labour",
            link: "https://acrobat.adobe.com/id/urn:aaid:sc:EU:31d8cdb2-3afd-4e28-893a-8445cac9a2a9"
          },
          {
            title: "Digital Services Certificate",
            issuer: "Camex Global Concept",
            link: "https://imgur.com/3MUPR3u"
          },
          {
            title: "Soft Skills Certificate",
            issuer: "WAVE",
            link: "https://acrobat.adobe.com/id/urn:aaid:sc:EU:fe4db523-f86e-4486-964a-17c73cbbf9e3"
          }
        ],
        projects: [
          {
            title: "Beat Blast Flier",
            client: "Gideon Oluwapelumi",
            type: "Graphic Design"
          },
          {
            title: "Forex Flyer",
            client: "Andrew Stephen",
            type: "Graphic Design"
          },
          {
            title: "Basketball Flyer",
            client: "Tochukwu",
            type: "Graphic Design"
          }
        ],
        social: {
          youtube: "@peterphonist",
          instagram: "@peterphonist",
          tiktok: "@peterphonist",
          facebook: "@peterphonist"
        },
        music: {
          name: "Peterphonist",
          description: "I create music under the name 'Peterphonist', blending afrobeats with contemporary sounds."
        },
        links: {
          home: "#home",
          about: "#about",
          services: "#services",
          projects: "#projects",
          highlights: "#highlights",
          testimonials: "#testimonials",
          contact: "#contact",
          cv: "#cv"
        }
      };
      
      console.log('Website data loaded successfully');
    } catch (error) {
      console.error('Error loading website data:', error);
    }
  }
  
  // Bind event listeners
  bindEvents() {
    // Open chat button
    this.openChatBtn.addEventListener('click', () => this.openChat());
    
    // Close chat button
    this.closeChatBtn.addEventListener('click', () => this.closeChat());
    
    // Form submission
    this.chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleUserMessage();
    });
    
    // Send button click
    this.sendButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleUserMessage();
    });
    
    // Input keypress (Enter key)
    this.userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleUserMessage();
      }
    });
  }
  
  // Show welcome message
  showWelcomeMessage() {
    const welcomeMessage = "👋 Hi there! I'm Peter's virtual assistant. How can I help you today?";
    this.addMessage(welcomeMessage, 'bot');
    
    // Show quick reply suggestions
    setTimeout(() => {
      this.showQuickReplies([
        'Services', 
        'Portfolio', 
        'Contact', 
        'About Peter'
      ]);
    }, 500);
  }
  
  // Handle user message
  handleUserMessage() {
    const message = this.userInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    this.addMessage(message, 'user');
    
    // Clear input
    this.userInput.value = '';
    
    // Remove any quick replies
    this.removeQuickReplies();
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Generate response with delay
    setTimeout(() => {
      // Hide typing indicator
      this.hideTypingIndicator();
      
      // Generate and display response
      const response = this.generateResponse(message);
      this.addMessage(response.text, 'bot');
      
      // Show quick replies if available
      if (response.quickReplies && response.quickReplies.length > 0) {
        setTimeout(() => {
          this.showQuickReplies(response.quickReplies);
        }, 500);
      }
      
      // Save chat history
      this.saveChatHistory();
    }, 1000);
  }
  
  // Generate response based on user input
  generateResponse(message) {
    const lowerMsg = message.toLowerCase();
    let response = {
      text: '',
      quickReplies: []
    };
    
    // Check for greetings
    if (this.containsAny(lowerMsg, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
      response.text = `👋 Hello! I'm Peter's virtual assistant. How can I help you today?`;
      response.quickReplies = ['Services', 'Portfolio', 'Contact', 'About Peter'];
      return response;
    }
    
    // Check for services related questions
    if (this.containsAny(lowerMsg, ['service', 'offer', 'provide', 'do you', 'can you', 'help with'])) {
      let servicesList = this.websiteData.services.map(s => `• ${s.title}: ${s.description}`).join('\n\n');
      response.text = `🛠️ Here are the services Peter offers:\n\n${servicesList}\n\nWhich service are you interested in?`;
      response.quickReplies = ['Website Design', 'Graphics Design', 'Content Creation', 'Contact Peter'];
      return response;
    }
    
    // Check for specific services
    if (this.containsAny(lowerMsg, ['web', 'website', 'development', 'design'])) {
      const service = this.websiteData.services.find(s => s.title === "Website Design");
      response.text = `💻 ${service.description} Peter creates responsive websites that look great on all devices and load quickly. Would you like to see some examples or discuss your website needs?`;
      response.quickReplies = ['See Portfolio', 'Contact About Website', 'Other Services'];
      return response;
    }
    
    if (this.containsAny(lowerMsg, ['graphic', 'design', 'logo', 'flyer', 'poster'])) {
      const service = this.websiteData.services.find(s => s.title === "Graphics Design");
      response.text = `🎨 ${service.description} Peter can create logos, social media graphics, flyers, and more. Would you like to see some examples of his design work?`;
      response.quickReplies = ['See Design Examples', 'Contact About Design', 'Other Services'];
      return response;
    }
    
    if (this.containsAny(lowerMsg, ['blog', 'blogger', 'content', 'writing', 'seo'])) {
      const service = this.websiteData.services.find(s => s.title === "Blogger Setup & Content");
      response.text = `✍️ ${service.description} Peter can help set up your blog, create content, and optimize it for search engines. Would you like more information about this service?`;
      response.quickReplies = ['Blog Examples', 'Contact About Blogging', 'Other Services'];
      return response;
    }
    
    // Check for portfolio/projects
    if (this.containsAny(lowerMsg, ['portfolio', 'project', 'work', 'example', 'showcase'])) {
      const projectsList = this.websiteData.projects.map(p => `• ${p.title} (${p.type}) for ${p.client}`).join('\n');
      response.text = `📁 Here are some of Peter's recent projects:\n\n${projectsList}\n\nYou can view his full portfolio at: https://peterlight123.github.io/portfolio/project.html`;
      response.quickReplies = ['Services', 'Contact Peter', 'About Peter'];
      return response;
    }
    
    // Check for contact information
    if (this.containsAny(lowerMsg, ['contact', 'reach', 'email', 'phone', 'whatsapp', 'call', 'message'])) {
      response.text = `📱 You can contact Peter through:\n\n📧 Email: ${this.websiteData.about.contact.email}\n📞 Phone/WhatsApp: ${this.websiteData.about.contact.phone}\n\nOr use the contact form on the website: https://peterlight123.github.io/portfolio/#contact`;
      response.quickReplies = ['Services', 'Portfolio', 'About Peter'];
      return response;
    }
    
    // Check for about/bio information
    if (this.containsAny(lowerMsg, ['about', 'who', 'bio', 'background', 'peter'])) {
      response.text = `👨‍💻 ${this.websiteData.about.name} (${this.websiteData.about.nickname}) is a ${this.websiteData.about.role} based in Nigeria. ${this.websiteData.about.description} He also creates music under the name 'Peterphonist'!`;
      response.quickReplies = ['Services', 'Portfolio', 'Contact', 'Music'];
      return response;
    }
    
    // Check for music/Peterphonist
    if (this.containsAny(lowerMsg, ['music', 'song', 'peterphonist', 'artist'])) {
      response.text = `🎵 ${this.websiteData.music.description} You can find his music on:\n\n• YouTube: ${this.websiteData.social.youtube}\n• Instagram: ${this.websiteData.social.instagram}\n• TikTok: ${this.websiteData.social.tiktok}\n• Facebook: ${this.websiteData.social.facebook}`;
      response.quickReplies = ['Services', 'Contact Peter', 'About Peter'];
      return response;
    }
    
    // Check for certifications
    if (this.containsAny(lowerMsg, ['certification', 'certificate', 'qualification', 'education', 'skill'])) {
      const certList = this.websiteData.certifications.map(cert => `• ${cert.title} (${cert.issuer})`).join('\n');
      response.text = `🎓 Peter has the following certifications:\n\n${certList}\n\nYou can view his certificates at: https://peterlight123.github.io/portfolio/#licenses`;
      response.quickReplies = ['Services', 'Portfolio', 'Contact Peter'];
      return response;
    }
    
    // Default response if no match
    response.text = "I'm here to help with information about Peter's services, projects, or how to get in touch. What would you like to know?";
    response.quickReplies = ['Services', 'Portfolio', 'Contact', 'About Peter'];
    return response;
  }
  
  // Helper function to check if message contains any of the keywords
  containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }
  
  // Add message to chat
  addMessage(text, sender) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Format links in text
    const formattedText = this.formatLinks(text);
    bubble.innerHTML = formattedText.replace(/\n/g, '<br>');
    
    // Add timestamp
    const timestamp = document.createElement('span');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    bubble.appendChild(timestamp);
    
    messageDiv.appendChild(bubble);
    this.chatArea.appendChild(messageDiv);
    
    // Scroll to bottom
    this.chatArea.scrollTop = this.chatArea.scrollHeight;
    
    // Add to chat history
    this.chatHistory.push({
      text,
      sender,
      time: new Date().toISOString()
    });
  }
  
  // Format links in text
  formatLinks(text) {
    // Convert URLs to clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url => `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">${url}</a>`);
  }
  
  // Show typing indicator
  showTypingIndicator() {
    this.isTyping = true;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing-indicator';
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble typing';
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      bubble.appendChild(dot);
    }
    
    typingDiv.appendChild(bubble);
    this.chatArea.appendChild(typingDiv);
    
    // Scroll to bottom
    this.chatArea.scrollTop = this.chatArea.scrollHeight;
  }
  
  // Hide typing indicator
  hideTypingIndicator() {
    this.isTyping = false;
    
    const typingIndicator = this.chatArea.querySelector('.typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  // Show quick replies
  showQuickReplies(replies) {
    const repliesDiv = document.createElement('div');
    repliesDiv.className = 'quick-replies';
    
    replies.forEach(reply => {
      const button = document.createElement('button');
      button.className = 'quick-reply-btn';
      button.textContent = reply;
      
      button.addEventListener('click', () => {
        // Use the quick reply as user input
        this.userInput.value = reply;
        this.handleUserMessage();
      });
      
      repliesDiv.appendChild(button);
    });
    
    this.chatArea.appendChild(repliesDiv);
    
    // Scroll to bottom
    this.chatArea.scrollTop = this.chatArea.scrollHeight;
  }
  
    // Remove quick replies
  removeQuickReplies() {
    const quickReplies = this.chatArea.querySelector('.quick-replies');
    if (quickReplies) {
      quickReplies.remove();
    }
  }
  
  // Open chat
  openChat() {
    this.chatWidget.classList.remove('chatbot-hidden');
    this.chatWidget.classList.add('chatbot-visible');
    this.openChatBtn.classList.add('button-hidden');
    
    // Focus on input
    setTimeout(() => {
      this.userInput.focus();
    }, 300);
    
    // Hide notification badge
    if (this.notificationBadge) {
      this.notificationBadge.classList.add('d-none');
    }
  }
  
  // Close chat
  closeChat() {
    this.chatWidget.classList.remove('chatbot-visible');
    this.chatWidget.classList.add('chatbot-hidden');
    this.openChatBtn.classList.remove('button-hidden');
  }
  
  // Save chat history to localStorage for admin access
  saveChatHistory() {
    try {
      // Use the session ID as the key
      localStorage.setItem(`peterbot_chat_${this.sessionId}`, JSON.stringify(this.chatHistory));
      console.log('Chat history saved:', this.sessionId);
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add CSS link if not already in the document
  if (!document.querySelector('link[href*="chatbot.css"]')) {
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'chatbot.css';
    document.head.appendChild(cssLink);
  }
  
  // Initialize the chatbot
  window.peterAssistant = new PeterAssistant();
});
