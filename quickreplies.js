// quickReplies.js - Advanced Quick Replies System

class QuickRepliesSystem {
    constructor() {
        this.currentContext = 'initial';
        this.conversationHistory = [];
        this.userPreferences = {};
        this.isScrolling = false;
        
        // Initialize the system
        this.init();
    }

    init() {
        this.loadUserPreferences();
        this.setupEventListeners();
        this.showInitialQuickReplies();
    }

    // Quick replies configuration with advanced actions
    getQuickRepliesConfig() {
        return {
            initial: {
                title: "How can I help you today?",
                context: "greeting",
                replies: [
                    {
                        id: "services",
                        text: "🔧 View Services",
                        icon: "bi-tools",
                        action: "show_services_menu",
                        response: "I offer several professional services. Let me show you what I can do for you:",
                        priority: 1
                    },
                    {
                        id: "portfolio",
                        text: "💼 See My Work",
                        icon: "bi-briefcase",
                        action: "navigate_with_response",
                        target: "#portfolio",
                        response: "Let me show you some of my recent projects and accomplishments...",
                        priority: 2
                    },
                    {
                        id: "contact",
                        text: "📞 Get In Touch",
                        icon: "bi-telephone",
                        action: "navigate_with_response",
                        target: "#contact",
                        response: "I'd love to hear from you! Here are the best ways to reach me:",
                        priority: 3
                    },
                    {
                        id: "about",
                        text: "👋 About Peter",
                        icon: "bi-person",
                        action: "navigate_with_response",
                        target: "#about",
                        response: "Let me tell you a bit about myself and my background...",
                        priority: 4
                    }
                ]
            },

            services: {
                title: "Which service interests you?",
                context: "services_menu",
                replies: [
                    {
                        id: "web_dev",
                        text: "💻 Web Development",
                        icon: "bi-code-slash",
                        action: "service_details",
                        service: "web_development",
                        response: "I specialize in creating modern, responsive websites and web applications. Here's what I can do for you:\n\n• Custom website design & development\n• E-commerce solutions\n• Mobile-responsive designs\n• Website maintenance & updates\n• Performance optimization\n• SEO-friendly development\n\nWould you like to see examples of my work or discuss your project?",
                        followUp: ["web_portfolio", "web_pricing", "web_timeline", "start_project"]
                    },
                    {
                        id: "virtual_assistant",
                        text: "👨‍💼 Virtual Assistant",
                        icon: "bi-headset",
                        action: "service_details",
                        service: "virtual_assistant",
                        response: "As your virtual assistant, I can help streamline your business operations:\n\n• Email management & organization\n• Administrative support\n• Data entry & research\n• Social media management\n• Customer service support\n• Project coordination\n• Calendar management\n\nWhat specific tasks would you like help with?",
                        followUp: ["va_tasks", "va_pricing", "va_availability", "start_project"]
                    },
                    {
                        id: "digital_marketing",
                        text: "📱 Digital Marketing",
                        icon: "bi-graph-up",
                        action: "service_details",
                        service: "digital_marketing",
                        response: "I offer comprehensive digital marketing services to grow your online presence:\n\n• SEO optimization\n• Social media marketing\n• Content creation & strategy\n• Email marketing campaigns\n• Brand development\n• Analytics & reporting\n• PPC advertising\n\nWhich aspect of digital marketing interests you most?",
                        followUp: ["seo_info", "social_media", "content_strategy", "marketing_audit"]
                    },
                    {
                        id: "saxophone",
                        text: "🎷 Saxophone Performance",
                        icon: "bi-music-note-beamed",
                        action: "navigate_to_page",
                        target: "saxophone.html",
                        response: "I'm also known as 'PeterPhonist' and provide professional saxophone performances! Let me take you to my music page where you can hear samples and book performances...",
                        delay: 1500
                    }
                ]
            },

            web_development: {
                title: "Web Development Options",
                context: "web_dev_details",
                replies: [
                    {
                        id: "web_portfolio",
                        text: "🖼️ View Portfolio",
                        action: "navigate_with_response",
                        target: "#portfolio",
                        response: "Here are some of my recent web development projects:"
                    },
                    {
                        id: "web_pricing",
                        text: "💰 Get Pricing",
                        action: "show_pricing_info",
                        service: "web_development",
                        response: "Here's my web development pricing structure:\n\n💻 **Basic Website:** $500 - $1,500\n• 5-10 pages\n• Responsive design\n• Contact forms\n• Basic SEO\n\n🛒 **E-commerce Site:** $1,500 - $5,000\n• Online store setup\n• Payment integration\n• Inventory management\n• Customer accounts\n\n🚀 **Custom Web App:** $2,000 - $10,000+\n• Custom functionality\n• Database integration\n• User authentication\n• API development\n\nWould you like a personalized quote?",
                        followUp: ["request_quote", "payment_terms", "timeline_info"]
                    },
                    {
                        id: "web_timeline",
                        text: "⏰ Timeline Info",
                        action: "respond",
                        response: "Typical web development timelines:\n\n⚡ **Simple Website:** 1-2 weeks\n📱 **Responsive Site:** 2-3 weeks\n🛒 **E-commerce Store:** 3-4 weeks\n🚀 **Custom Web App:** 4-8 weeks\n🏢 **Enterprise Solution:** 8+ weeks\n\nTimelines depend on:\n• Project complexity\n• Content readiness\n• Revision rounds\n• Third-party integrations\n\nI always provide realistic timelines and keep you updated throughout the process!",
                        followUp: ["start_project", "rush_options", "project_phases"]
                    },
                    {
                        id: "tech_stack",
                        text: "⚙️ Technologies Used",
                        action: "respond",
                        response: "I work with modern, reliable technologies:\n\n**Frontend:**\n• HTML5, CSS3, JavaScript\n• React, Vue.js, Angular\n• Bootstrap, Tailwind CSS\n• Responsive design\n\n**Backend:**\n• Node.js, Python, PHP\n• Express, Django, Laravel\n• RESTful APIs\n• Database design\n\n**Tools & Platforms:**\n• Git version control\n• AWS, Netlify, Vercel\n• WordPress, Shopify\n• Performance optimization\n\nI choose the best technology stack for each project's specific needs!",
                        followUp: ["start_project", "tech_consultation", "maintenance_info"]
                    }
                ]
            },

            // Add more contexts as needed...
        };
    }

    // Show initial quick replies when chat starts
    showInitialQuickReplies() {
        setTimeout(() => {
            this.displayQuickReplies('initial');
        }, 1000);
    }

    // Display quick replies in the chat
    displayQuickReplies(contextKey, customReplies = null) {
        const config = this.getQuickRepliesConfig();
        const context = customReplies || config[contextKey];
        
        if (!context) return;

        const chatContainer = document.getElementById('chat-messages') || document.querySelector('.chat-messages');
        if (!chatContainer) return;

        // Remove existing quick replies
        this.removeExistingQuickReplies();

        // Create quick replies container
        const quickRepliesContainer = document.createElement('div');
        quickRepliesContainer.className = 'quick-replies-container';
        quickRepliesContainer.innerHTML = `
            <div class="quick-replies-title">${context.title}</div>
            <div class="quick-replies-grid">
                ${context.replies.map(reply => this.createQuickReplyButton(reply)).join('')}
            </div>
        `;

        chatContainer.appendChild(quickRepliesContainer);
        this.scrollToBottom();
        this.animateQuickReplies(quickRepliesContainer);
    }

    // Create individual quick reply button
    createQuickReplyButton(reply) {
        const iconHtml = reply.icon ? `<i class="${reply.icon} me-2"></i>` : '';
        return `
            <button class="quick-reply-btn" 
                    data-reply-id="${reply.id}"
                    data-action="${reply.action}"
                    data-target="${reply.target || ''}"
                    data-service="${reply.service || ''}"
                    data-delay="${reply.delay || 0}">
                ${iconHtml}${reply.text}
            </button>
        `;
    }

    // Setup event listeners for quick replies
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply-btn')) {
                this.handleQuickReplyClick(e.target);
            }
        });

        // Listen for chat initialization
        document.addEventListener('chatInitialized', () => {
            this.showInitialQuickReplies();
        });
    }

    // Handle quick reply button clicks
    async handleQuickReplyClick(button) {
        const replyId = button.dataset.replyId;
        const action = button.dataset.action;
        const target = button.dataset.target;
        const service = button.dataset.service;
        const delay = parseInt(button.dataset.delay) || 0;

        // Add user message to chat
        this.addUserMessage(button.textContent.trim());

        // Remove quick replies
        this.removeExistingQuickReplies();

        // Add to conversation history
        this.conversationHistory.push({
            type: 'quick_reply',
            replyId: replyId,
            action: action,
            timestamp: new Date()
        });

        // Execute action with delay if specified
        if (delay > 0) {
            this.showTypingIndicator();
            await this.sleep(delay);
            this.hideTypingIndicator();
        }

        this.executeAction(action, { target, service, replyId });
    }

    // Execute different types of actions
    async executeAction(action, params) {
        switch (action) {
            case 'show_services_menu':
                await this.showServicesMenu();
                break;
            
            case 'navigate_with_response':
                await this.navigateWithResponse(params.target);
                break;
            
            case 'navigate_to_page':
                await this.navigateToPage(params.target);
                break;
            
            case 'service_details':
                await this.showServiceDetails(params.service);
                break;
            
            case 'show_pricing_info':
                await this.showPricingInfo(params.service);
                break;
            
            case 'respond':
                await this.sendBotResponse(this.getResponseForReply(params.replyId));
                break;
            
            default:
                await this.sendBotResponse("I'm processing your request...");
        }
    }

    // Show services menu
    async showServicesMenu() {
        await this.sendBotResponse("I offer several professional services. Let me show you what I can do for you:");
        await this.sleep(800);
        this.displayQuickReplies('services');
    }

    // Navigate with response
    async navigateWithResponse(target) {
        const responses = {
            '#portfolio': "Let me show you some of my recent projects and accomplishments...",
            '#contact': "I'd love to hear from you! Here are the best ways to reach me:",
            '#about': "Let me tell you a bit about myself and my background...",
            '#services': "Here are all the services I offer:"
        };

        const response = responses[target] || "Let me take you to that section...";
        await this.sendBotResponse(response);
        
        await this.sleep(1000);
        this.smoothScrollToTarget(target);
        
        // Show contextual quick replies after navigation
        setTimeout(() => {
            this.showContextualQuickReplies(target);
        }, 2000);
    }

    // Navigate to different page
    async navigateToPage(page) {
        await this.sendBotResponse("Taking you to my saxophone performance page...");
        await this.sleep(1500);
        
        // Open in new tab or same tab based on preference
        if (this.userPreferences.openInNewTab) {
            window.open(page, '_blank');
        } else {
            window.location.href = page;
        }
    }

    // Show service details
    async showServiceDetails(service) {
        const config = this.getQuickRepliesConfig();
        const serviceContext = config[service];
        
        if (serviceContext && serviceContext.replies[0]) {
            const response = serviceContext.replies[0].response;
            await this.sendBotResponse(response);
            
            await this.sleep(1000);
            this.displayQuickReplies(service);
        }
    }

    // Smooth scroll to target element
    smoothScrollToTarget(target) {
        const element = document.querySelector(target);
        if (element) {
            this.isScrolling = true;
            
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Highlight the target section
            this.highlightSection(element);
            
            setTimeout(() => {
                this.isScrolling = false;
            }, 1000);
        }
    }

    // Highlight target section
    highlightSection(element) {
        element.classList.add('highlighted-section');
        setTimeout(() => {
            element.classList.remove('highlighted-section');
        }, 3000);
    }

    // Show contextual quick replies based on current section
    showContextualQuickReplies(target) {
        const contextualReplies = {
            '#portfolio': {
                title: "Interested in my work?",
                replies: [
                    {
                        id: "discuss_project",
                        text: "💬 Discuss My Project",
                        action: "navigate_with_response",
                        target: "#contact"
                    },
                    {
                        id: "get_quote",
                        text: "💰 Get a Quote",
                        action: "show_quote_form"
                    },
                    {
                        id: "see_more_services",
                        text: "🔧 See All Services",
                        action: "show_services_menu"
                    }
                ]
            },
            '#contact': {
                title: "Ready to get started?",
                replies: [
                    {
                        id: "call_now",
                        text: "📞 Call Now",
                        action: "initiate_call"
                    },
                    {
                        id: "send_email",
                        text: "✉️ Send Email",
                        action: "open_email_client"
                    },
                    {
                        id: "schedule_meeting",
                        text: "📅 Schedule Meeting",
                        action: "show_calendar"
                    }
                ]
            }
        };

        const contextReplies = contextualReplies[target];
        if (contextReplies) {
            this.displayQuickReplies(null, contextReplies);
        }
    }

    // Utility functions
    addUserMessage(message) {
        const chatContainer = document.getElementById('chat-messages') || document.querySelector('.chat-messages');
        if (!chatContainer) return;

        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-time">${this.getCurrentTime()}</div>
        `;
        
        chatContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    async sendBotResponse(message) {
        const chatContainer = document.getElementById('chat-messages') || document.querySelector('.chat-messages');
        if (!chatContainer) return;

        this.showTypingIndicator();
        await this.sleep(800);
        this.hideTypingIndicator();

        const messageElement = document.createElement('div');
        messageElement.className = 'message bot-message';
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-time">${this.getCurrentTime()}</div>
        `;
        
        chatContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const chatContainer = document.getElementById('chat-messages') || document.querySelector('.chat-messages');
        if (!chatContainer) return;

        const typingElement = document.createElement('div');
        typingElement.className = 'typing-indicator';
        typingElement.id = 'typing-indicator';
        typingElement.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        chatContainer.appendChild(typingElement);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    removeExistingQuickReplies() {
        const existingReplies = document.querySelectorAll('.quick-replies-container');
        existingReplies.forEach(container => container.remove());
    }

    scrollToBottom() {
        const chatContainer = document.getElementById('chat-messages') || document.querySelector('.chat-messages');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    animateQuickReplies(container) {
        const buttons = container.querySelectorAll('.quick-reply-btn');
        buttons.forEach((button, index) => {
            setTimeout(() => {
                button.classList.add('animate-in');
            }, index * 100);
        });
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Load user preferences
    loadUserPreferences() {
        const saved = localStorage.getItem('quickRepliesPreferences');
        this.userPreferences = saved ? JSON.parse(saved) : {
            openInNewTab: false,
            animationSpeed: 'normal',
            autoScroll: true
        };
    }

    // Save user preferences
    saveUserPreferences() {
        localStorage.setItem('quickRepliesPreferences', JSON.stringify(this.userPreferences));
    }
}

// Initialize the quick replies system
const quickRepliesSystem = new QuickRepliesSystem();

// Export for use in other modules
window.QuickRepliesSystem = QuickRepliesSystem;
window.quickRepliesSystem = quickRepliesSystem;
