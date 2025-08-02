// Emergency fix for chatbot positioning and functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log("Applying emergency chatbot fix");
    
    // Fix chatbot positioning
    const fixChatbotPositioning = function() {
        const chatbotWidget = document.getElementById('chatbot-widget');
        const openChatButton = document.getElementById('open-chat-button');
        
        if (chatbotWidget) {
            chatbotWidget.style.position = 'fixed';
            chatbotWidget.style.bottom = '20px';
            chatbotWidget.style.right = '20px';
            chatbotWidget.style.zIndex = '9999';
        }
        
        if (openChatButton) {
            openChatButton.style.position = 'fixed';
            openChatButton.style.bottom = '20px';
            openChatButton.style.right = '20px';
            openChatButton.style.zIndex = '9998';
        }
    };
    
    // Fix event listeners
    const fixChatbotEvents = function() {
        const chatbotWidget = document.getElementById('chatbot-widget');
        const openChatButton = document.getElementById('open-chat-button');
        const closeChatButton = document.getElementById('close-chat');
        
        if (openChatButton && chatbotWidget) {
            openChatButton.onclick = function() {
                console.log("Open button clicked");
                chatbotWidget.style.transform = 'scale(1)';
                openChatButton.style.transform = 'scale(0)';
                
                // Hide notification badge
                const notificationBadge = document.getElementById('notification-badge');
                if (notificationBadge) {
                    notificationBadge.classList.add('d-none');
                }
            };
        }
        
        if (closeChatButton && chatbotWidget && openChatButton) {
            closeChatButton.onclick = function() {
                console.log("Close button clicked");
                chatbotWidget.style.transform = 'scale(0)';
                openChatButton.style.transform = 'scale(1)';
            };
        }
    };
    
    // Apply fixes
    fixChatbotPositioning();
    fixChatbotEvents();
    
    // Re-apply fixes after a delay to ensure they take effect
    setTimeout(function() {
        fixChatbotPositioning();
        fixChatbotEvents();
    }, 1000);
});
