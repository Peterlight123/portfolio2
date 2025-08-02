// bot.js - Handles the chat bot functionality.

document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements for the bot interface
    const botContainer = document.getElementById('bot-container');
    const botButton = document.getElementById('bot-button');
    const chatWindow = document.getElementById('bot-chat-window');
    const closeButton = document.getElementById('bot-close-button');
    const messagesContainer = document.getElementById('bot-messages');
    const inputField = document.getElementById('bot-input');
    const sendButton = document.getElementById('bot-send-button');

    let chatHistory = []; // Stores the conversation history

    // Function to show a loading indicator
    function showLoading() {
        const loadingMessage = document.createElement('div');
        loadingMessage.classList.add('bot-message', 'bot-message-loading');
        loadingMessage.innerHTML = '<span>.</span><span>.</span><span>.</span>';
        messagesContainer.appendChild(loadingMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Function to hide the loading indicator
    function hideLoading() {
        const loadingMessage = messagesContainer.querySelector('.bot-message-loading');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }

    // Function to display a message in the chat window
    function displayMessage(text, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('bot-message');
        messageElement.classList.add(isUser ? 'bot-message-user' : 'bot-message-bot');
        messageElement.textContent = text;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Function to handle the API call to the Gemini model
    async function sendMessageToBot(message) {
        showLoading(); // Show loading indicator before API call

        let prompt = `You are a helpful assistant for a portfolio website. The website belongs to a full-stack developer. Your purpose is to provide information about the developer's skills, projects, and contact information, and to engage in friendly conversation.

        Here is a brief summary of the developer:
        - Name: Your Name
        - Skills: React, Node.js, Python, Flask, MongoDB, HTML, CSS, JavaScript, Bootstrap.
        - Projects: E-commerce Platform (Full Stack), Weather Dashboard (Frontend), RESTful API (Backend).
        - Contact: email@example.com, +123 456 7890.

        User: ${message}`;

        chatHistory.push({ role: "user", parts: [{ text: prompt }] });

        try {
            const payload = { contents: chatHistory };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            // Implement exponential backoff for retries
            const maxRetries = 5;
            let retryCount = 0;
            let response;
            while (retryCount < maxRetries) {
                try {
                    response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        if (response.status === 429) {
                            const delay = Math.pow(2, retryCount) * 1000;
                            await new Promise(res => setTimeout(res, delay));
                            retryCount++;
                            continue;
                        } else {
                            throw new Error(`API error: ${response.statusText}`);
                        }
                    }

                    const result = await response.json();
                    if (result.candidates && result.candidates.length > 0 &&
                        result.candidates[0].content && result.candidates[0].content.parts &&
                        result.candidates[0].content.parts.length > 0) {
                        const botResponseText = result.candidates[0].content.parts[0].text;
                        displayMessage(botResponseText, false);
                        chatHistory.push({ role: "model", parts: [{ text: botResponseText }] });
                    } else {
                        throw new Error('Invalid API response structure');
                    }
                    break; // Exit the loop on success
                } catch (error) {
                    console.error('Fetch error:', error);
                    if (retryCount >= maxRetries - 1) {
                        displayMessage('Sorry, I am unable to connect right now. Please try again later.', false);
                    }
                    retryCount++;
                }
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            displayMessage('An unexpected error occurred. Please try again.', false);
        } finally {
            hideLoading();
        }
    }

    // Handle user input
    function handleUserInput() {
        const userMessage = inputField.value.trim();
        if (userMessage) {
            displayMessage(userMessage, true);
            sendMessageToBot(userMessage);
            inputField.value = '';
        }
    }

    // Event listeners
    botButton.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
        chatWindow.classList.toggle('closed');
        if (chatWindow.classList.contains('open')) {
            // Display a welcome message when the chat opens
            if (chatHistory.length === 0) {
                displayMessage("Hi there! I'm your friendly portfolio assistant. How can I help you today?", false);
                chatHistory.push({ role: "model", parts: [{ text: "Hi there! I'm your friendly portfolio assistant. How can I help you today?" }] });
            }
            inputField.focus();
        }
    });

    closeButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the main button from re-opening the chat
        chatWindow.classList.remove('open');
        chatWindow.classList.add('closed');
    });

    sendButton.addEventListener('click', handleUserInput);

    inputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleUserInput();
        }
    });

    // Styles for the bot container
    const style = document.createElement('style');
    style.innerHTML = `
        #bot-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }
        #bot-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        #bot-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
        }
        #bot-chat-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 450px;
            background-color: white;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: all 0.3s ease;
            transform: scale(0.8) translateY(20px);
            opacity: 0;
            transform-origin: bottom right;
        }
        #bot-chat-window.open {
            transform: scale(1) translateY(0);
            opacity: 1;
        }
        #bot-chat-window.closed {
            display: none;
        }
        #bot-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            font-size: 1.1rem;
            font-weight: bold;
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #bot-close-button {
            cursor: pointer;
            font-size: 1rem;
            transition: transform 0.2s ease;
        }
        #bot-close-button:hover {
            transform: scale(1.2);
        }
        #bot-messages {
            flex-grow: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background-color: #f7f7f7;
        }
        .bot-message {
            max-width: 80%;
            padding: 10px 15px;
            border-radius: 20px;
            line-height: 1.4;
            font-size: 0.9rem;
            word-wrap: break-word;
        }
        .bot-message-user {
            background-color: #0d6efd;
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 5px;
        }
        .bot-message-bot {
            background-color: #e9ecef;
            color: #212529;
            align-self: flex-start;
            border-bottom-left-radius: 5px;
        }
        .bot-message-loading {
            width: 50px;
            display: flex;
            justify-content: space-around;
        }
        .bot-message-loading span {
            animation: loading-dot-animation 1s infinite;
            font-size: 1.5rem;
            line-height: 0;
            color: #6c757d;
        }
        .bot-message-loading span:nth-child(2) { animation-delay: 0.2s; }
        .bot-message-loading span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes loading-dot-animation {
            0%, 80%, 100% { transform: scale(0); opacity: 0; }
            40% { transform: scale(1); opacity: 1; }
        }
        #bot-input-area {
            display: flex;
            padding: 10px;
            border-top: 1px solid #e9ecef;
        }
        #bot-input {
            flex-grow: 1;
            border: 1px solid #ced4da;
            border-radius: 20px;
            padding: 10px 15px;
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.2s ease;
        }
        #bot-input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
        }
        #bot-send-button {
            border: none;
            background: none;
            color: #667eea;
            font-size: 1.2rem;
            padding: 0 10px;
            cursor: pointer;
            transition: color 0.2s ease;
        }
        #bot-send-button:hover {
            color: #764ba2;
        }
        @media (max-width: 400px) {
            #bot-chat-window {
                width: 90vw;
                height: 80vh;
                max-height: 500px;
                right: 5vw;
                bottom: 80px;
            }
        }
    `;
    document.head.appendChild(style);
});
