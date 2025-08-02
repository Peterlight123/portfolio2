/**
 * Peter Lightspeed Chatbot
 * An advanced AI assistant for the portfolio website with chat history storage
 * Version 2.1
 */
class PeterChatbot {
    constructor() {
        this.isOpen = false;
        this.chatHistory = [];
        this.messageCount = 0;
        this.conversationContext = [];
        this.lastLanguage = 'en'; // Track last detected language for context
        this.sessionId = this.generateSessionId(); // Generate unique session ID
        this.loadChatHistory(); // Load chat history from storage
        this.init();
    }

    // Generate a unique session ID
    generateSessionId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Load chat history from localStorage
    loadChatHistory() {
        try {
            // Try to load previous chat history
            const savedHistory = localStorage.getItem('peterbot_chat_history');
            if (savedHistory) {
                this.chatHistory = JSON.parse(savedHistory);
                this.messageCount = this.chatHistory.length;
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            // Reset if there's an error
            this.chatHistory = [];
            this.messageCount = 0;
        }
    }

    // Save chat history to localStorage
    saveChatHistory() {
        try {
            // Limit history to last 50 messages to prevent storage issues
            const historyToSave = this.chatHistory.slice(-50);
            localStorage.setItem('peterbot_chat_history', JSON.stringify(historyToSave));
            
            // Also send to server if needed
            this.sendChatToServer();
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    // Send chat history to server for permanent storage
    sendChatToServer() {
        // Only send if there are at least 2 messages (a conversation)
        if (this.chatHistory.length < 2) return;
        
        // Prepare data for sending
        const chatData = {
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            messages: this.chatHistory,
            userAgent: navigator.userAgent,
            pageUrl: window.location.href
        };
        // Add these methods to your PeterChatbot class

// Format messages with timestamps
displayMessage(text, sender) {
    const chatArea = document.getElementById('chat-area-widget');
    if (!chatArea) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `d-flex ${sender === 'user' ? 'justify-content-end' : ''} mb-3 message-appear`;
    
    const bubble = document.createElement('div');
    bubble.className = sender === 'user' ? 'bg-primary text-white rounded p-3' : 'bg-light rounded p-3';
    bubble.style.maxWidth = '80%';
    
    // Format links in the text
    const formattedText = this.formatLinks(text);
    
    // Check for sponsor-specific content
    let enhancedText = formattedText;
    if (sender === 'bot') {
        // Add crypto address formatting
        enhancedText = this.formatCryptoAddresses(enhancedText);
        
        // Add donation amount buttons
        enhancedText = this.formatDonationAmounts(enhancedText);
    }
    
    bubble.innerHTML = enhancedText.replace(/\n/g, '<br>');
    
    // Add timestamp
    const timestamp = document.createElement('small');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    bubble.appendChild(timestamp);
    
    messageDiv.appendChild(bubble);
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    
    // Add copy functionality to crypto addresses
    if (sender === 'bot') {
        const copyButtons = chatArea.querySelectorAll('.copy-button');
        copyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const address = e.target.getAttribute('data-address');
                navigator.clipboard.writeText(address).then(() => {
                    e.target.textContent = 'Copied!';
                    setTimeout(() => {
                        e.target.textContent = 'Copy';
                    }, 2000);
                });
            });
        });
    }
}

// Format crypto addresses with copy buttons
formatCryptoAddresses(text) {
    const cryptoRegex = /(bitcoin|ethereum|btc|eth|usdt|sol):\s*([a-zA-Z0-9]{30,})/gi;
    return text.replace(cryptoRegex, (match, coin, address) => {
        return `<div class="crypto-address">
            ${coin.toUpperCase()}: ${address}
            <button class="copy-button" data-address="${address}">Copy</button>
        </div>`;
    });
}

// Format donation amounts as clickable buttons
formatDonationAmounts(text) {
    const amountRegex = /\$(\d+)/g;
    return text.replace(amountRegex, (match, amount) => {
        return `<span class="donation-amount">$${amount}</span>`;
    });
}

// Add sponsor-specific responses
getResponse(message) {
    const lang = this.detectLanguage(message);
    const lowerMsg = message.toLowerCase();
    
    // Sponsor-specific responses
    if (lowerMsg.includes('sponsor') || lowerMsg.includes('donation') || lowerMsg.includes('support')) {
        return `💖 Thank you for your interest in supporting my work!

You can sponsor my development journey through:

• Bank Transfer (Zenith Bank)
• Cryptocurrency (BTC, ETH, USDT, SOL)

Your support helps me continue creating innovative digital solutions and contributing to the developer community.

Would you like to donate $5, $10, or $20 today?`;
    }
    else if (lowerMsg.includes('bank') || lowerMsg.includes('transfer') || lowerMsg.includes('account')) {
        return `🏦 Bank Transfer Details:

• Bank: Zenith Bank
• Account Name: Eluwade Peter Toluwanimi
• Account Number: 2384957201

<div class="sponsor-highlight">
Please send me a message after making your transfer so I can properly thank you!
</div>`;
    }
    else if (lowerMsg.includes('crypto') || lowerMsg.includes('bitcoin') || lowerMsg.includes('eth') || lowerMsg.includes('usdt')) {
        return `💰 Cryptocurrency Donation Options:

Bitcoin: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh

Ethereum: 0x71c7656ec7ab88b098defb751b7401b5f6d8976f

USDT (TRC20): TKQbkAjrNRtJ2yzgGMNpfPRpYiNAYs5r9Z

Solana: 8ZUkTZNVSXBJjXWVvjzLrBXbfVq5wG58yXXS6FfVCFX4

<div class="thank-you-message">
<i class="bi bi-heart-fill"></i><br>
Thank you for your generous support!
</div>`;
    }
    else if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
        return `🙏 You're welcome! Thank you for considering supporting Peter's work. Your contribution makes a real difference and helps him continue creating quality digital solutions.

Is there anything else you'd like to know about sponsorship options?`;
    }
    else if (lowerMsg.includes('$5') || lowerMsg.includes('$10') || lowerMsg.includes('$20') || lowerMsg.includes('donate')) {
        return `Thank you for your generosity! To proceed with your donation, you can use any of these methods:

1. Bank Transfer - I'll provide the account details
2. Cryptocurrency - I'll share the wallet addresses
3. Contact me directly for other options

Which method would you prefer?`;
    }
    
    // Continue with your regular responses...
    // ...
}

        // Send to server using Formspree or similar service
        fetch('https://formspree.io/f/xpwrbkrr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `Chatbot Conversation ${this.sessionId}`,
                chatData: chatData
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error sending chat history to server:', error);
        });
    }
// Add this to your showRelevantQuickReplies method
showRelevantQuickReplies(userMessage, botResponse) {
    const lowerMsg = userMessage.toLowerCase();
    
    // Sponsor-specific quick replies
    if (lowerMsg.includes('sponsor') || lowerMsg.includes('donation') || lowerMsg.includes('support')) {
        this.displayQuickReplies(['Bank Transfer Details', 'Cryptocurrency Options', 'Donate $10', 'Why Sponsor?']);
    }
    else if (lowerMsg.includes('bank') || lowerMsg.includes('transfer')) {
        this.displayQuickReplies(['I Made a Transfer', 'Cryptocurrency Options', 'Contact Peter']);
    }
    else if (lowerMsg.includes('crypto') || lowerMsg.includes('bitcoin')) {
        this.displayQuickReplies(['Bank Transfer Details', 'Thank You', 'Contact Peter']);
    }
    else if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
        this.displayQuickReplies(['Other Ways to Help', 'View Projects', 'Contact Peter']);
    }
    else if (lowerMsg.includes('donate') || lowerMsg.includes('$')) {
        this.displayQuickReplies(['Bank Transfer', 'Cryptocurrency', 'Other Amount', 'Contact Peter']);
    }
    else if (botResponse.includes('Thank you for your generosity')) {
        this.displayQuickReplies(['Bank Transfer', 'Cryptocurrency', 'Contact Peter']);
    }
    
    // Continue with your regular quick replies...
    // ...
}

    get knowledgeBase() {
        return {
            en: {
                greetings: {
                    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'sup', 'yo'],
                    responses: [
                        `👋 Hello! Welcome to Peter's assistant.
I can help with websites, designs, or business support.
What would you like to ask?`,
                        `👋 Hi there! I'm Peter's digital assistant.
Need info about his services, projects, or want to get in touch?
Just ask me anything!`
                    ]
                },
                pricing: {
                    keywords: ['how much', 'price', 'cost', 'rate', 'budget', 'charge', 'quote', 'payment', 'fee', 'pricing', 'package', 'pay'],
                    responses: [
                        `💰 Here's a quick guide to Peter's rates:
• Website: ₦150k – ₦500k
• Logo/Graphics: ₦30k – ₦100k
• VA Services: From ₦10k/week

Message Peter with your project details for a custom quote.`
                    ]
                },
                projects: {
                    keywords: ['project', 'portfolio', 'example', 'work', 'show me', 'samples', 'case study', 'showcase', 'previous work'],
                    responses: [
                        `🛠️ Here are some of Peter's notable projects:

• PLSWorldNews Blog - Entertainment and lifestyle blog
• Rizz Script Video Management - Social media content creation
• Forex Trading Flyer - Professional design for financial services
• Beat Blast Event Flyer - Music event promotional materials
• Basketball Academy Flyer - Sports promotional design

View the full portfolio: https://peterlight123.github.io/portfolio/project.html`
                    ]
                },
                contact: {
                    keywords: ['contact', 'reach', 'talk to you', 'get in touch', 'email', 'whatsapp', 'phone', 'dm', 'message', 'call'],
                    responses: [
                        `📞 Contact Peter through any of these channels:

📧 Email: petereluwade55@gmail.com
📱 WhatsApp: +234 810 882 1809
🐦 Twitter: @peterlightspeed
📸 Instagram: @eluwadepeter
🎵 TikTok: @eluwadepeter
🎹 Music: @peterphonist
🔗 LinkedIn: peter-eluwade-5b8a73363

Or use the contact form on this website!`
                    ]
                },
                turnaround: {
                    keywords: ['how long', 'timeline', 'turnaround', 'deliver', 'delivery time', 'deadline', 'eta', 'finish', 'complete'],
                    responses: [
                        `⏱️ Peter's typical delivery timeframes:

• Logo Design: 2–3 days
• Website Development: 5–10 days
• Graphics Package: 2–5 days
• Blog Setup: 3-4 days
• Content Writing: 1-3 days

Urgent projects can be accommodated with rush fees. The exact timeline will be confirmed based on your specific requirements and current workload.`
                    ]
                },
                revisions: {
                    keywords: ['edit', 'revisions', 'change', 'update', 'correction', 'modify', 'adjust', 'alter', 'fix'],
                    responses: [
                        `🔁 All projects include revision options:

• 2–5 free revisions (within the agreed project scope)
• Minor changes handled within 24 hours
• Major revisions discussed and scheduled accordingly
• Clear feedback process to ensure your satisfaction

Just let Peter know what needs adjusting, and he'll make it happen!`
                    ]
                },
                urgent: {
                    keywords: ['urgent', 'quick job', 'fast', 'asap', 'immediately', 'need now', 'rush', 'emergency', 'deadline', 'tomorrow'],
                    responses: [
                        `⚡ Yes, Peter accepts urgent projects based on availability:

• Rush fee typically adds 20-30% to standard rates
• Same-day delivery possible for small tasks
• 24-48 hour turnaround for medium projects
• Clear communication about what's possible within your timeframe

Please provide your deadline and project details for confirmation.`
                    ]
                },
                installment: {
                    keywords: ['installment', 'two parts', 'split payment', 'half now', 'pay later', 'deposit', 'milestone', 'payment plan'],
                    responses: [
                        `💳 Flexible payment options available:

• Standard: 50% upfront, 50% upon completion
• Milestone payments for larger projects
• Secure payment methods including bank transfer and crypto
• Clear payment terms outlined in project agreement

Let's discuss the payment structure that works best for your project!`
                    ]
                },
                training: {
                    keywords: ['train', 'teach', 'class', 'learn', 'tutorial', 'course', 'workshop', 'mentor', 'coaching', 'education'],
                    responses: [
                        `🎓 Peter offers training in several areas:

• Web Development: HTML, CSS, JavaScript basics
• Design Skills: Canva, basic Photoshop techniques
• Content Creation: Blog writing, SEO optimization
• Digital Marketing: Social media strategy, audience growth
• Freelancing Tips: Client acquisition, project management

Training can be personalized to your specific learning goals. What area interests you most?`
                    ]
                },
                about: {
                    keywords: ['about', 'who is', 'background', 'experience', 'skills', 'education', 'bio', 'history', 'qualification'],
                    responses: [
                        `👨‍💻 About Peter Eluwade (Peter Lightspeed):

Peter is a versatile Virtual Assistant and Web Developer based in Nigeria. With certifications from FreeCodeCamp, WAVE (West Africa Vocational Education), and the Federal Ministry of Labour, he specializes in web development, graphic design, content creation, and digital marketing.

His diverse skill set includes:
• Web Development (HTML, CSS, JavaScript, Bootstrap)
• Graphic Design (Canva, Photoshop)
• Content Creation & Blog Management
• Social Media Management
• Data Entry & Administrative Support

Peter also creates music under the name "Peterphonist" and manages the PLSWorldNews entertainment blog.`
                    ]
                },
                music: {
                    keywords: ['music', 'song', 'artist', 'peterphonist', 'beat', 'producer', 'track', 'audio', 'sound', 'playlist'],
                    responses: [
                        `🎵 About Peter's music (as Peterphonist):

Peter creates music under the name "Peterphonist" where he produces beats and instrumental tracks. His musical style blends elements of afrobeats, hip-hop, and electronic music.

You can check out his music on:
• Instagram: @peterphonist
• YouTube: Coming soon!

Feel free to reach out for music collaborations or beat purchases.`
                    ]
                },
                location: {
                    keywords: ['where', 'location', 'country', 'city', 'based', 'from', 'live', 'address', 'nigeria'],
                    responses: [
                        `📍 Peter is based in Nigeria.

He works remotely with clients worldwide, providing virtual assistant services, web development, and graphic design across different time zones.

While he's physically located in Nigeria, his digital services are available globally with convenient communication options.`
                    ]
                },
                availability: {
                    keywords: ['available', 'schedule', 'busy', 'time', 'hours', 'when', 'weekend', 'weekday', 'start'],
                    responses: [
                        `⏰ Peter's typical availability:

• Working hours: Monday-Friday, 9am-6pm WAT (GMT+1)
• Weekend availability for urgent projects (by arrangement)
• Response time: Usually within 2-4 hours during business hours
• Project kickoff: Can typically begin within 1-3 days of agreement

For your specific timeline needs, please reach out directly.`
                    ]
                },
                services: {
                    keywords: ['service', 'offer', 'provide', 'do you', 'can you', 'help with', 'assistance', 'support'],
                    responses: [
                        `🛠️ Services offered by Peter:

• Web Development & Design
• Graphic Design (logos, flyers, social media graphics)
• Content Creation & Blog Management
• Social Media Management
• Virtual Assistant Services
• Data Entry & Administrative Support
• SEO Optimization
• Typing & Document Formatting

Is there a specific service you'd like to know more about?`
                    ]
                },
                testimonials: {
                    keywords: ['testimonial', 'review', 'feedback', 'client', 'say about', 'recommend', 'rating', 'satisfied'],
                    responses: [
                        `⭐ Client Testimonials:

"Peter lightspeed delivered a flier that perfectly matched the energy of Gidi Beat Blast. The design was bold, rhythmic and instantly got attention just like a good drum beat." - Gideon Oluwapelumi

"Peter completely exceeded my expectations with the forex flier design. The layout was sleek, the colors were well balanced, and it captured the professionalism I needed." - Andrew Stephen

"Working with peter lightspeed was a slam dunk. The basketball flier he designed for my academy was eye catching and energetic." - Tochukwu

Check out more testimonials on the website!`
                    ]
                },
                tools: {
                    keywords: ['tool', 'software', 'app', 'program', 'platform', 'technology', 'tech stack', 'use', 'work with'],
                    responses: [
                        `🧰 Tools & Technologies Peter uses:

• Design: Canva, Adobe Photoshop
• Web Development: HTML5, CSS3, JavaScript, Bootstrap
• Content Management: WordPress, Blogger
• Video Editing: CapCut
• Project Management: Trello, Google Workspace
• Communication: WhatsApp, Email, Zoom

Peter stays updated with the latest tools to deliver the best results for clients.`
                    ]
                },
                sponsor: {
                    keywords: ['sponsor', 'donation', 'support', 'contribute', 'fund', 'back', 'donate'],
                    responses: [
                        `💖 Support Peter's work:

If you'd like to sponsor Peter's development journey, you can contribute through:

• Bank Transfer (Zenith Bank)
• Cryptocurrency (BTC, ETH, USDT, SOL)

Your support helps him continue creating innovative digital solutions and contributing to the developer community.

Visit the Sponsor page for more details: https://peterlight123.github.io/portfolio/sponsor.html`
                    ]
                },
                blog: {
                    keywords: ['blog', 'plsworldnews', 'article', 'post', 'content', 'write', 'news'],
                    responses: [
                        `📝 About PLSWorldNews Blog:

PLSWorldNews is an entertainment and lifestyle blog created and maintained by Peter. It features:

• Daily posts on trending topics
• Celebrity news and updates
• Lifestyle content and tips
• SEO-optimized articles
• Google AdSense monetization

Check it out at: https://plsworldnews.blogspot.com`
                    ]
                },
                cv: {
                    keywords: ['cv', 'resume', 'qualification', 'experience', 'certification', 'certificate', 'credential'],
                    responses: [
                        `📄 Peter's Qualifications & Certifications:

• FreeCodeCamp Frontend Certificate - Responsive Web Design
• Soft Skills Training Certificate - West Africa Vocational Education (WAVE)
• Trade Test I & II - Federal Ministry of Labour (ICT/Office Support)
• Digital Services Certificate - Camex Global Concept
• Google Digital Marketing Certificate

You can download his full CV from the website: https://peterlight123.github.io/portfolio/index.html#cv`
                    ]
                },
                joke: {
                    keywords: ['joke', 'funny', 'humor', 'laugh', 'fun', 'comedy'],
                    responses: [
                        `😄 Why don't web developers like going outside?
They get too many bugs!

(I'm still learning jokes, but Peter has a great sense of humor!)`,
                        
                        `😄 Why was the website cold?
It left its backend exposed!

(Peter would probably have a better joke, but I'm just a chatbot!)`,
                        
                        `😄 How many programmers does it take to change a light bulb?
None, that's a hardware problem!

(Peter might laugh at this one!)`,
                        
                        `😄 What's a web developer's favorite snack?
Cookies!

(I'm trying my best with these tech jokes!)`
                    ]
                }
            },
            pidgin: {
                greetings: {
                    keywords: ['how far', 'wetin dey', 'you dey', 'i hail', 'hi', 'oya', 'hello', 'hey', 'sup'],
                    responses: [
                        `👋 How you dey? Na Peter smart chatbot be this!
I fit help you find info about design, coding or VA work.`,
                        
                        `👋 Abeg! You don land for Peter assistant.
You fit ask me anything about im work or how to reach am.`
                    ]
                },
                pricing: {
                    keywords: ['how much', 'money', 'collect', 'cost', 'rate', 'budget', 'quote', 'payment', 'price', 'pay', 'charge'],
                    responses: [
                        `💰 See small estimate for Peter work:
• Website: ₦150k – ₦500k
• Logo/Design: ₦30k – ₦100k
• VA work: From ₦10k/week

Talk your work make I run better quote. No be fixed price.`
                    ]
                },
                projects: {
                    keywords: ['project', 'work wey you don do', 'sample', 'portfolio', 'example', 'show me', 'show us'],
                    responses: [
                        `🛠️ Projects wey Peter don do:

• PLSWorldNews Blog - Entertainment and lifestyle blog
• Rizz Script Video - Social media content
• Forex Trading Flyer - Money matter design
• Beat Blast Event Flyer - Music show design
• Basketball Academy Flyer - Sports design

Check all for website: https://peterlight123.github.io/portfolio/project.html`
                    ]
                },
                contact: {
                    keywords: ['contact', 'reach', 'yarn you', 'talk to you', 'get you', 'email', 'phone', 'number', 'call', 'message'],
                    responses: [
                        `📞 You fit reach Peter for:

📧 Email: petereluwade55@gmail.com
📱 WhatsApp: +234 810 882 1809
🐦 Twitter: @peterlightspeed
📸 Instagram: @eluwadepeter
🎵 TikTok: @eluwadepeter
🎹 Music: @peterphonist

Or use form for website to send message!`
                    ]
                },
                turnaround: {
                    keywords: ['how long', 'deliver', 'fit ready', 'timeline', 'delivery time', 'when', 'finish', 'complete'],
                    responses: [
                        `⏱️ E dey depend on wetin you want:

• Logo: 2–3 days
• Website: 5–10 days
• Graphics: 2–5 days
• Blog Setup: 3-4 days
• Content Writing: 1-3 days

Just talk wetin you need, make we run am. If you need am quick quick, we go add small money.`
                    ]
                },
                revisions: {
                    keywords: ['edit', 'change am', 'correction', 'adjust', 'revise', 'fix am', 'no like am'],
                    responses: [
                        `🔁 No wahala, we dey allow corrections:

• Free revisions dey (2-5 times)
• Small changes na quick run
• Big changes we go talk about am
• We go make sure say you like am well well

Just talk wetin you wan make we change.`
                    ]
                },
                urgent: {
                    keywords: ['urgent', 'sharp sharp', 'fast fast', 'now now', 'asap', 'quick', 'today', 'tomorrow'],
                    responses: [
                        `⚡ If na urgent work, e possible o!

• We go add small money on top (like 20-30%)
• Some small work fit ready same day
• Medium work fit take 1-2 days
• We go tell you true true if e possible

Just drop wetin you wan make I run, but rush job dey get extra fee sha.`
                    ]
                },
                installment: {
                    keywords: ['two part', 'half pay', 'balance later', 'installment', 'deposit', 'pay small small'],
                    responses: [
                        `💳 You fit pay am twice:

• Half now make we start
• Half when we finish
• For big work, we fit break am more
• We get bank transfer and crypto

No wahala. Just talk your budget.`
                    ]
                },
                training: {
                    keywords: ['train', 'learn', 'teach', 'school me', 'tutor', 'show me how'],
                    responses: [
                        `🎓 I dey train people for:

• Website design: HTML, CSS, JavaScript
• Design work: Canva, Photoshop small small
• Content: How to write blog wey go blow
• Social Media: How to grow followers
• Money work: How to find clients

Tell me wetin you wan learn.`
                    ]
                },
                about: {
                    keywords: ['about', 'who be', 'background', 'experience', 'skills', 'education', 'bio', 'history'],
                    responses: [
                        `👨‍💻 About Peter Eluwade (Peter Lightspeed):

Peter na Virtual Assistant and Web Developer from Nigeria. E get certificates from FreeCodeCamp, WAVE (West Africa Vocational Education), and Federal Ministry of Labour.

E sabi do plenty things like:
• Web Development (HTML, CSS, JavaScript, Bootstrap)
• Graphic Design (Canva, Photoshop)
• Content Creation & Blog Management
• Social Media Management
• Data Entry

E also dey do music as "Peterphonist" and e get PLSWorldNews entertainment blog.`
                    ]
                },
                music: {
                    keywords: ['music', 'song', 'artist', 'peterphonist', 'beat', 'producer', 'track', 'audio', 'sound'],
                    responses: [
                        `🎵 About Peter music (as Peterphonist):

Peter dey do music as "Peterphonist" where e dey produce beats and instrumentals. E music style na mix of afrobeats, hip-hop, and electronic.

You fit check im music for:
• Instagram: @peterphonist
• YouTube: E dey come soon!

If you want make una do music together or buy beat, holla am.`
                    ]
                },
                location: {
                    keywords: ['where', 'location', 'country', 'city', 'based', 'from', 'live', 'address', 'nigeria'],
                    responses: [
                        `📍 Peter dey stay for Nigeria.

E dey work with clients for all over world, dey provide virtual assistant services, web development, and graphic design.

Even though e dey Nigeria, e services dey available worldwide with good communication options.`
                    ]
                },
                services: {
                    keywords: ['service', 'offer', 'provide', 'do you', 'can you', 'help with', 'assistance', 'support', 'wetin you dey do'],
                    responses: [
                        `🛠️ Services wey Peter dey offer:

• Website Development & Design
• Graphic Design (logos, flyers, social media)
• Content Creation & Blog Management
• Social Media Management
• Virtual Assistant Services
• Data Entry & Office Work
• SEO Optimization
• Typing & Document Formatting

You wan know more about any of these?`
                    ]
                },
                testimonials: {
                    keywords: ['testimonial', 'review', 'feedback', 'client', 'say about', 'recommend', 'rating'],
                    responses: [
                        `⭐ Wetin people talk about Peter work:

"Peter lightspeed deliver flier wey match energy for Gidi Beat Blast. The design bold, e catch attention like good drum beat." - Gideon Oluwapelumi

"Peter work pass wetin I expect for forex flier design. The layout clean, colors balance well, and e show professionalism wey I need." - Andrew Stephen

"To work with Peter na correct gbedu. The basketball flier wey e design for my academy catch eye well well." - Tochukwu

Check more for website!`
                    ]
                },
                tools: {
                    keywords: ['tool', 'software', 'app', 'program', 'platform', 'technology', 'tech stack', 'use', 'work with'],
                    responses: [
                        `🧰 Tools & Technologies wey Peter dey use:

• Design: Canva, Adobe Photoshop
• Web Development: HTML5, CSS3, JavaScript, Bootstrap
• Content Management: WordPress, Blogger
• Video Editing: CapCut
• Project Management: Trello, Google Workspace
• Communication: WhatsApp, Email, Zoom

Peter dey always update imself with new tools.`
                    ]
                },
                sponsor: {
                    keywords: ['sponsor', 'donation', 'support', 'contribute', 'fund', 'back', 'donate', 'dash am'],
                    responses: [
                        `💖 Support Peter work:

If you wan sponsor Peter journey, you fit contribute through:

• Bank Transfer (Zenith Bank)
• Cryptocurrency (BTC, ETH, USDT, SOL)

Your support go help am continue to dey create better digital solutions.

Visit Sponsor page for more details: https://peterlight123.github.io/portfolio/sponsor.html`
                    ]
                },
                joke: {
                    keywords: ['joke', 'funny', 'humor', 'laugh', 'fun', 'comedy', 'play'],
                    responses: [
                        `😄 Why programmer no like go outside?
Too many bugs dey there!

(I still dey learn jokes, but Peter get better sense of humor!)`,
                        
                        `😄 Why website dey cold?
E leave im backend open!

(Peter fit get better joke, but I just be chatbot!)`,
                        
                        `😄 How many programmers e dey take to change light bulb?
None, na hardware problem!

(Peter fit laugh this one!)`
                    ]
                }
            },
            default: {
                en: [
                    `I'm not sure I understand. Try asking about:
• Peter's services or pricing
• Portfolio examples or projects
• Contact information
• Turnaround times or availability`,
                    
                    `I didn't quite catch that. You can ask me about:
• Web development and design services
• Graphic design work and pricing
• Peter's background and experience
• How to get in touch with Peter`,
                    
                    `I'm still learning! Try asking about:
• Peter's skills and services
• Project examples and testimonials
• Contact details and availability
• Pricing and payment options`
                ],
                pidgin: [
                    `I no understand wetin you talk. You fit ask about:
• Peter services or how much e dey charge
• Examples of work wey e don do
• How to contact am
• How long e dey take finish work`,
                    
                    `I no catch wetin you dey talk. Try ask about:
• Website and design work
• Graphics work and price
• Peter background and experience
• How to reach Peter`,
                    
                    `I still dey learn! Ask me about:
• Wetin Peter sabi do
• Examples of im work
• How to contact am
• How much e dey charge`
                ]
            }
        };
    }

    detectLanguage(msg) {
        const pidginWords = ['how far', 'wetin', 'dey', 'collect', 'oga', 'abeg', 'yarn', 'fit', 'na', 'sha', 'wahala', 'sabi', 'make', 'una', 'don', 'wey', 'sef', 'nawa', 'gbedu', 'chop'];
        let pidginCount = 0;
        const lowerMsg = msg.toLowerCase();
        
        // Count pidgin words in message
        for (let word of pidginWords) {
            if (lowerMsg.includes(word)) pidginCount++;
        }
        
        // Check for common pidgin phrases
        const pidginPhrases = ['how far', 'wetin dey', 'abeg', 'no wahala', 'make we', 'i dey'];
        for (let phrase of pidginPhrases) {
            if (lowerMsg.includes(phrase)) pidginCount += 2; // Give phrases more weight
        }
        
        // Use context from previous messages
        const detectedLang = pidginCount >= 2 ? 'pidgin' : 'en';
        
        // If message is very short, default to previous language
        if (msg.length < 5 && this.lastLanguage) {
            return this.lastLanguage;
        }
        
        // Update last language
        this.lastLanguage = detectedLang;
        return detectedLang;
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
            'cv': '#cv',
            'portfolio': '#projects',
            'skills': '#highlights',
            'experience': '#About',
            'certificates': '#highlights',
            'certifications': '#highlights',
            'blog': '#highlights',
            'music': '#About'
        };
        
        for (const keyword in keywordMap) {
            if (query.toLowerCase().includes(keyword)) {
                const section = document.querySelector(keywordMap[keyword]);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                    return true; // Indicate that scrolling happened
                }
            }
        }
        return false; // No scrolling happened
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
                
                // Display previous messages if any
                if (this.chatHistory.length > 0) {
                    this.displayPreviousMessages();
                } else {
                    // Add welcome message if chat is empty
                    const chatArea = document.getElementById('chat-area-widget');
                    if (chatArea && chatArea.children.length === 0) {
                        this.displayMessage(`👋 Hello! I'm Peter's virtual assistant. How can I help you today?`, 'bot');
                        
                        // Add to chat history
                        this.chatHistory.push({
                            role: 'bot',
                            content: `👋 Hello! I'm Peter's virtual assistant. How can I help you today?`,
                            timestamp: new Date().toISOString()
                        });
                        this.messageCount++;
                        
                        // Add quick reply options
                        setTimeout(() => {
                            this.displayQuickReplies([
                                'Services & Pricing',
                                'View Portfolio',
                                'Contact Info',
                                'About Peter'
                            ]);
                        }, 500);
                    }
                }
            });
        }
        
        if (closeChatButton && chatbotWidget && openChatButton) {
            closeChatButton.addEventListener('click', () => {
                chatbotWidget.style.transform = 'scale(0)';
                openChatButton.style.transform = 'scale(1)';
                
                // Save chat history when closing
                this.saveChatHistory();
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
        
        // Save chat history when user leaves the page
        window.addEventListener('beforeunload', () => {
            this.saveChatHistory();
        });
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
        
        // Listen for clicks on quick replies
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply-btn')) {
                const message = e.target.textContent;
                const input = document.getElementById('user-input-widget');
                if (input) input.value = message;
                this.sendMessage();
                
                // Remove quick replies after selection
                const quickRepliesContainer = document.getElementById('quick-replies-container');
                if (quickRepliesContainer) {
                    quickRepliesContainer.remove();
                }
            }
        });
    }

    sendMessage() {
        const input = document.getElementById('user-input-widget');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) return;

        this.displayMessage(message, 'user');
        input.value = '';
        
        // Remove any existing quick replies
        const quickRepliesContainer = document.getElementById('quick-replies-container');
        if (quickRepliesContainer) {
            quickRepliesContainer.remove();
        }
        
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
        
        // Add user message to chat history
        this.chatHistory.push({
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });
        this.messageCount++;
        
        // Delay response for natural feel
        setTimeout(() => {
            // Remove typing indicator
            if (chatArea && typingIndicator.parentNode === chatArea) {
                chatArea.removeChild(typingIndicator);
            }
            
            const response = this.getResponse(message);
            const didScroll = this.scrollToSection(message);
            this.displayMessage(response, 'bot');
            
            // Add bot response to chat history
            this.chatHistory.push({
                role: 'bot',
                content: response,
                timestamp: new Date().toISOString()
            });
            this.messageCount++;
            
            // Save chat history after each exchange
            this.saveChatHistory();
            
            // Show relevant quick replies based on the conversation
            this.showRelevantQuickReplies(message, response);
        }, 1000);
    }

    // Display previous chat messages when opening the chat
    displayPreviousMessages() {
        const chatArea = document.getElementById('chat-area-widget');
        if (!chatArea || this.chatHistory.length === 0) return;
        
        // Clear existing messages
        chatArea.innerHTML = '';
        
        // Display last 10 messages (or fewer if history is shorter)
        const messagesToShow = this.chatHistory.slice(-10);
        messagesToShow.forEach(msg => {
            this.displayMessage(msg.content, msg.role);
        });
    }

    getResponse(message) {
        const lang = this.detectLanguage(message);
        const kb = this.knowledgeBase[lang];
        let bestMatch = null;
        let highestScore = 0;
        
        // Check for exact keyword matches first
        for (const key in kb) {
            const block = kb[key];
            if (block.keywords && block.keywords.some(word => message.toLowerCase().includes(word))) {
                // Get random response from the matched block
                return block.responses[Math.floor(Math.random() * block.responses.length)];
            }
        }
        
        // If no exact match, try fuzzy matching
        const lowerMsg = message.toLowerCase();
        for (const key in kb) {
            const block = kb[key];
            if (block.keywords) {
                for (const keyword of block.keywords) {
                    // Calculate similarity score (very simple implementation)
                    const score = this.calculateSimilarity(lowerMsg, keyword);
                    if (score > highestScore && score > 0.6) { // Threshold for fuzzy matching
                        highestScore = score;
                        bestMatch = block;
                    }
                }
            }
        }
        
        if (bestMatch) {
            return bestMatch.responses[Math.floor(Math.random() * bestMatch.responses.length)];
        }
        
        // If no match found, return default response
        return this.knowledgeBase.default[lang][Math.floor(Math.random() * this.knowledgeBase.default[lang].length)];
    }
    
    calculateSimilarity(str1, str2) {
        // Very simple similarity check - can be improved with more sophisticated algorithms
        if (str1.includes(str2) || str2.includes(str1)) {
            return 0.8; // High score for substring match
        }
        
        // Count matching words
        const words1 = str1.split(' ');
        const words2 = str2.split(' ');
        let matches = 0;
        
        for (const word of words1) {
            if (word.length > 2 && words2.includes(word)) { // Only count meaningful words
                matches++;
            }
        }
        
        return matches / Math.max(words1.length, words2.length);
    }

    displayMessage(text, sender) {
        const chatArea = document.getElementById('chat-area-widget');
        if (!chatArea) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'd-flex justify-content-end mb-3' : 'd-flex mb-3';
        
        const bubble = document.createElement('div');
        bubble.className = sender === 'user' ? 'bg-primary text-white rounded p-3' : 'bg-light rounded p-3';
        bubble.style.maxWidth = '80%';
        
        // Format links in the text
        const formattedText = this.formatLinks(text);
        bubble.innerHTML = formattedText.replace(/\n/g, '<br>');
        
        messageDiv.appendChild(bubble);
        chatArea.appendChild(messageDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    }
    
    formatLinks(text) {
        // Convert URLs to clickable links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, url => `<a href="${url}" target="_blank" class="text-decoration-underline">${url}</a>`);
    }
    
    displayQuickReplies(options) {
        const chatArea = document.getElementById('chat-area-widget');
        if (!chatArea) return;
        
        // Remove any existing quick replies
        const existingQuickReplies = document.getElementById('quick-replies-container');
        if (existingQuickReplies) {
            existingQuickReplies.remove();
        }
        
        const quickRepliesContainer = document.createElement('div');
        quickRepliesContainer.id = 'quick-replies-container';
        quickRepliesContainer.className = 'd-flex flex-wrap justify-content-center mb-3 gap-2';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'btn btn-sm btn-outline-primary quick-reply-btn';
            button.textContent = option;
            quickRepliesContainer.appendChild(button);
        });
        
        chatArea.appendChild(quickRepliesContainer);
        chatArea.scrollTop = chatArea.scrollHeight;
    }
    
    showRelevantQuickReplies(userMessage, botResponse) {
        const lowerMsg = userMessage.toLowerCase();
        
        // Determine which quick replies to show based on context
        if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much')) {
            this.displayQuickReplies(['Tell me about your services', 'Payment options', 'Contact info', 'View portfolio']);
        } 
        else if (lowerMsg.includes('project') || lowerMsg.includes('portfolio') || lowerMsg.includes('work')) {
            this.displayQuickReplies(['Contact for a project', 'Services offered', 'Testimonials', 'Pricing info']);
        }
        else if (lowerMsg.includes('contact') || lowerMsg.includes('reach') || lowerMsg.includes('email')) {
            this.displayQuickReplies(['What services do you offer?', 'How much do you charge?', 'Turnaround times', 'About Peter']);
        }
        else if (lowerMsg.includes('about') || lowerMsg.includes('who')) {
            this.displayQuickReplies(['Peter\'s music', 'Skills & services', 'View portfolio', 'Contact info']);
        }
        else if (lowerMsg.includes('music') || lowerMsg.includes('peterphonist')) {
            this.displayQuickReplies(['About Peter', 'Other services', 'Contact info']);
        }
        else if (lowerMsg.includes('blog') || lowerMsg.includes('plsworldnews')) {
            this.displayQuickReplies(['Other projects', 'Services offered', 'Contact Peter']);
        }
        else if (botResponse.includes('training') || botResponse.includes('teach') || botResponse.includes('learn')) {
            this.displayQuickReplies(['Web development training', 'Design training', 'Content creation training', 'Pricing info']);
        }
        else if (this.messageCount > 4) {
            // After a few messages, offer general options
            this.displayQuickReplies(['Contact Peter', 'View portfolio', 'Services & pricing', 'Tell me a joke']);
        }
    }
}

// Initialize the chatbot when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded - initializing chatbot");
    
    // Check if elements exist
    const chatbotWidget = document.getElementById('chatbot-widget');
    const openChatButton = document.getElementById('open-chat-button');
    const closeChatButton = document.getElementById('close-chat');
    
    console.log("Chatbot widget found:", !!chatbotWidget);
    console.log("Open chat button found:", !!openChatButton);
    console.log("Close chat button found:", !!closeChatButton);
    
    // Initialize the chatbot
    window.PeterBot = new PeterChatbot();
    console.log("Chatbot initialized");
});
