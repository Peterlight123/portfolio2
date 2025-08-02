/**
 * Peter Lightspeed Chatbot
 * A simple AI assistant for the portfolio website
 */
class PeterChatbot {
    constructor() {
        this.isOpen = false;
        this.chatHistory = [];
        this.messageCount = 0;
        this.conversationContext = [];
        this.init();
    }

    get knowledgeBase() {
        return {
            en: {
                greetings: {
                    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
                    responses: [
                        `👋 Hello! Welcome to Peter's assistant.
I can help with websites, designs, or business support.
What would you like to ask?`
                    ]
                },
                pricing: {
                    keywords: ['how much', 'price', 'cost', 'rate', 'budget', 'charge', 'quote', 'payment'],
                    responses: [
                        `💰 Here's a quick guide:
• Website: ₦150k – ₦500k
• Logo/Graphics: ₦30k – ₦100k
• VA Services: From ₦10k/week

Message me with your project for a custom quote.`
                    ]
                },
                projects: {
                    keywords: ['project', 'portfolio', 'example', 'work', 'show me', 'samples'],
                    responses: [
                        `🛠️ Here are some sample works:
• Business websites
• Dashboards (Excel, Sheets)
• Logos, Flyers, Brands

View more: https://peterlight123.github.io/portfolio/project.html`
                    ]
                },
                contact: {
                    keywords: ['contact', 'reach', 'talk to you', 'get in touch', 'email', 'whatsapp', 'phone'],
                    responses: [
                        `📞 Contact Peter:
📧 Email: petereluwade55@gmail.com
📱 IG/Twitter: @peterlightspeed
🌐 Website: https://peterlight123.github.io/portfolio/`
                    ]
                },
                turnaround: {
                    keywords: ['how long', 'timeline', 'turnaround', 'deliver', 'delivery time'],
                    responses: [
                        `⏱️ Delivery time depends on the task:
• Logo: 2–3 days
• Website: 5–10 days
• Graphics Pack: 2–5 days
Let's confirm based on your specific need.`
                    ]
                },
                revisions: {
                    keywords: ['edit', 'revisions', 'change', 'update', 'correction'],
                    responses: [
                        `🔁 No worries! All projects include revisions:
• 2–5 free edits (within agreed scope)
• Quick changes handled within 24 hours
Just let us know what needs fixing.`
                    ]
                },
                urgent: {
                    keywords: ['urgent', 'quick job', 'fast', 'asap', 'immediately', 'need now'],
                    responses: [
                        `⚡ Yes, I accept urgent projects depending on my schedule.
Please send your details and timeline. Rush fees may apply.`
                    ]
                },
                installment: {
                    keywords: ['installment', 'two parts', 'split payment', 'half now', 'pay later'],
                    responses: [
                        `💳 Yes, payment in 2 parts is available:
• 50% upfront to begin
• 50% after completion
Let's discuss the project scope!`
                    ]
                },
                training: {
                    keywords: ['train', 'teach', 'class', 'learn', 'tutorial'],
                    responses: [
                        `🎓 I offer training on:
• Web development
• Design with Canva & Photoshop
• Digital freelancing tips
Let me know which you're interested in!`
                    ]
                }
            },
            pidgin: {
                greetings: {
                    keywords: ['how far', 'wetin dey', 'you dey', 'i hail', 'hi', 'oya'],
                    responses: [
                        `👋 How you dey? Na Peter smart chatbot be this!
I fit help you find info about design, coding or VA work.`
                    ]
                },
                pricing: {
                    keywords: ['how much', 'money', 'collect', 'cost', 'rate', 'budget', 'quote', 'payment'],
                    responses: [
                        `💰 See small estimate:
• Website: ₦150k – ₦500k
• Logo/Design: ₦30k – ₦100k
• VA work: From ₦10k/week

Talk your work make I run better quote.`
                    ]
                },
                projects: {
                    keywords: ['project', 'work wey you don do', 'sample', 'portfolio', 'example', 'show me'],
                    responses: [
                        `🛠️ Projects Peter don do:
• Business site
• Dashboards
• Logos/Flyers

Check am: https://peterlight123.github.io/portfolio/project.html`
                    ]
                },
                contact: {
                    keywords: ['contact', 'reach', 'yarn you', 'talk to you', 'get you', 'email', 'phone'],
                    responses: [
                        `📞 You fit reach Peter:
📧 Email: petereluwade55@gmail.com
📱 IG/Twitter: @peterlightspeed
🌐 Website: https://peterlight123.github.io/portfolio/`
                    ]
                },
                turnaround: {
                    keywords: ['how long', 'deliver', 'fit ready', 'timeline', 'delivery time'],
                    responses: [
                        `⏱️ E dey depend on wetin you want:
• Logo: 2–3 days
• Website: 5–10 days
• Graphics: 2–5 days
Just talk wetin you need, make we run am.`
                    ]
                },
                revisions: {
                    keywords: ['edit', 'change am', 'correction', 'adjust', 'revise'],
                    responses: [
                        `🔁 No wahala, we dey allow corrections:
• Free revisions dey
• Small changes na quick run
Just talk wetin you wan make we change.`
                    ]
                },
                urgent: {
                    keywords: ['urgent', 'sharp sharp', 'fast fast', 'now now', 'asap'],
                    responses: [
                        `⚡ If na urgent work, e possible o!
Just drop wetin you wan make I run, but rush job dey get extra fee sha.`
                    ]
                },
                installment: {
                    keywords: ['two part', 'half pay', 'balance later', 'installment'],
                    responses: [
                        `💳 You fit pay am twice:
• Half now make we start
• Balance when we finish
No wahala. Just talk your budget.`
                    ]
                },
                training: {
                    keywords: ['train', 'learn', 'teach', 'school me', 'tutor'],
                    responses: [
                        `🎓 I dey train people:
• Website design
• Canva or Photoshop
• How to do online hustle
Tell me wetin you wan learn.`
                    ]
                }
            },
            default: {
                en: [`I'm not sure I understand. Try something like:
• "Show me your portfolio"
• "How much is a logo?"
• "Contact info"`],
                pidgin: [`I no understand wetin you talk. You fit ask:
• "Show me your works"
• "How much you dey collect?"
• "Your contact"`]
            }
        };
    }

    detectLanguage(msg) {
        const pidginWords = ['how far', 'wetin', 'dey', 'collect', 'oga', 'abeg', 'yarn', 'fit'];
        let pidginCount = 0;
        for (let word of pidginWords) {
            if (msg.toLowerCase().includes(word)) pidginCount++;
        }
        return pidginCount >= 2 ? 'pidgin' : 'en';
    }

    scrollToSection(query) {
        const keywordMap = {
            'testimonials': '#testimonials',
            'services': '#services',
            'contact': '#contact',
            'about': '#About',
            'projects': '#projects',
            'highlights': '#highlights',
            'sponsor': '#sponsor',
            'cv': '#cv'
        };
        for (const keyword in keywordMap) {
            if (query.toLowerCase().includes(keyword)) {
                const section = document.querySelector(keywordMap[keyword]);
                if (section) section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    init() {
        this.bindEvents();
        
        // Set up chat open/close buttons
        const openChatButton = document.getElementById('open-chat-button');
        const closeChatButton = document.getElementById('close-chat');
        const chatbotWidget = document.getElementById('chatbot-widget');
        
        if (openChatButton && chatbotWidget) {
            openChatButton.addEventListener('click', () => {
                chatbotWidget.style.transform = 'scale(1)';
                openChatButton.style.transform = 'scale(0)';
                
                // Hide notification badge
                const notificationBadge = document.getElementById('notification-badge');
                if (notificationBadge) {
                    notificationBadge.classList.add('d-none');
                }
                
                // Add welcome message if chat is empty
                const chatArea = document.getElementById('chat-area-widget');
                if (chatArea && chatArea.children.length === 0) {
                    this.displayMessage(`👋 Hello! I'm Peter's virtual assistant. How can I help you today?`, 'bot');
                }
            });
        }
        
        if (closeChatButton && chatbotWidget && openChatButton) {
            closeChatButton.addEventListener('click', () => {
                chatbotWidget.style.transform = 'scale(0)';
                openChatButton.style.transform = 'scale(1)';
            });
        }
        
        // Show notification after 15 seconds
        setTimeout(() => {
            const notificationBadge = document.getElementById('notification-badge');
            const chatbotWidget = document.getElementById('chatbot-widget');
            if (notificationBadge && chatbotWidget && chatbotWidget.style.transform !== 'scale(1)') {
                notificationBadge.classList.remove('d-none');
            }
        }, 15000);
    }

    bindEvents() {
        const sendBtn = document.getElementById('send-button-widget');
        const input = document.getElementById('user-input-widget');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    sendMessage() {
        const input = document.getElementById('user-input-widget');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) return;

        this.displayMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        const chatArea = document.getElementById('chat-area-widget');
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator d-flex align-items-center mb-3';
        typingIndicator.innerHTML = `
            <div class="bg-light rounded p-3">
                <div class="d-flex">
                    <div class="spinner-grow spinner-grow-sm text-primary me-1" role="status"></div>
                    <div class="spinner-grow spinner-grow-sm text-primary me-1" role="status"></div>
                    <div class="spinner-grow spinner-grow-sm text-primary" role="status"></div>
                </div>
            </div>
        `;
        if (chatArea) {
            chatArea.appendChild(typingIndicator);
            chatArea.scrollTop = chatArea.scrollHeight;
        }
        
        // Delay response for natural feel
        setTimeout(() => {
            // Remove typing indicator
            if (chatArea && typingIndicator.parentNode === chatArea) {
                chatArea.removeChild(typingIndicator);
            }
            
            const response = this.getResponse(message);
            this.scrollToSection(message);
            this.displayMessage(response, 'bot');
        }, 1000);
    }

    getResponse(message) {
        const lang = this.detectLanguage(message);
        const kb = this.knowledgeBase[lang];

        for (const key in kb) {
            const block = kb[key];
            if (block.keywords && block.keywords.some(word => message.toLowerCase().includes(word))) {
                return block.responses[Math.floor(Math.random() * block.responses.length)];
            }
        }

        return this.knowledgeBase.default[lang][0];
    }

    displayMessage(text, sender) {
        const chatArea = document.getElementById('chat-area-widget');
        if (!chatArea) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'd-flex justify-content-end mb-3' : 'd-flex mb-3';
        
        const bubble = document.createElement('div');
        bubble.className = sender === 'user' ? 'bg-primary text-white rounded p-3' : 'bg-light rounded p-3';
        bubble.style.maxWidth = '80%';
        bubble.innerHTML = text.replace(/\n/g, '<br>');
        
        messageDiv.appendChild(bubble);
        chatArea.appendChild(messageDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    }
}

// Initialize the chatbot when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.PeterBot = new PeterChatbot();
});
