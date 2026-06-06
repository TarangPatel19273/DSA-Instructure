document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initTypingEffect();
    initGSAPAnimations();
    initChatLogic();
});

function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const trail = document.getElementById('cursor-trail');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
        }, 50);
    });

    document.querySelectorAll('a, button, input').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

function initTypingEffect() {
    const algorithms = ['Binary Search', 'Dynamic Programming', 'Graph Traversal', 'Segment Trees', 'Tries', 'Dijkstra\'s Algorithm'];
    const typingText = document.getElementById('typing-text');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = algorithms[wordIndex];
        
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % algorithms.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }
    
    setTimeout(type, 1000);
}

function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Mouse Parallax for specific elements
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        document.querySelectorAll('.parallax-el').forEach(el => {
            const speed = el.getAttribute('data-speed') || 0.05;
            gsap.to(el, {
                x: x * 100 * speed,
                y: y * 100 * speed,
                rotationX: -y * 10 * speed,
                rotationY: x * 10 * speed,
                duration: 1,
                ease: "power2.out"
            });
        });
    });

    // Hologram Text Glitch
    gsap.to('.hologram-text', {
        textShadow: "0 0 20px rgba(0, 243, 255, 0.8), -2px 0 red, 2px 0 blue",
        duration: 0.1,
        repeat: -1,
        yoyo: true,
        repeatDelay: 5
    });
}

function initChatLogic() {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const sendBtn = document.getElementById('send-btn');
    const voiceWave = document.getElementById('voice-wave');
    let chatHistory = [];

    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            } else {
                return hljs.highlightAuto(code).value;
            }
        }
    });

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const question = userInput.value.trim();
        if (!question) return;

        appendMessage('user', question);
        chatHistory.push({ role: 'user', parts: [{ text: question }] });
        
        userInput.value = '';
        sendBtn.disabled = true;
        voiceWave.classList.remove('hidden');

        const loadingId = appendLoading();

        try {
            const response = await fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: chatHistory }),
            });

            const data = await response.json();
            
            removeLoading(loadingId);
            voiceWave.classList.add('hidden');

            if (response.ok) {
                chatHistory.push({ role: 'model', parts: [{ text: data.answer }] });
                typewriterMessage('ai', data.answer);
            } else {
                typewriterMessage('ai', `Error: ${data.error || 'Connection severed.'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            removeLoading(loadingId);
            voiceWave.classList.add('hidden');
            typewriterMessage('ai', 'Error: Neural link disconnected. Server unreachable.');
        } finally {
            sendBtn.disabled = false;
            userInput.focus();
        }
    });

    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);

        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('avatar', `${sender}-avatar`);

        if (sender === 'ai') {
            avatarDiv.innerHTML = `<div class="orbiting-rings"></div><span class="ai-icon">AI</span>`;
        } else {
            avatarDiv.textContent = 'U';
        }

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content', 'glass-bubble', `${sender}-bubble`);
        
        if (sender === 'ai') {
            contentDiv.innerHTML = marked.parse(text);
        } else {
            contentDiv.textContent = text;
        }

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        chatBox.appendChild(messageDiv);
        
        scrollToBottom();
    }

    function typewriterMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);

        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('avatar', `${sender}-avatar`);
        avatarDiv.innerHTML = `<div class="orbiting-rings"></div><span class="ai-icon">AI</span>`;

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content', 'glass-bubble', `${sender}-bubble`);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        chatBox.appendChild(messageDiv);

        // Typewriter effect
        const parsedHTML = marked.parse(text);
        contentDiv.innerHTML = '';
        
        let i = 0;
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = parsedHTML;
        let textNodes = getTextNodes(tempDiv);
        let currentIndex = 0;

        // Simple typing effect by replacing character by character would break HTML structure.
        // So we just fade in the markdown content and let CSS handle a generic reveal.
        // For a true char-by-char, we can just reveal text. Since this is complex with HTML tags, 
        // a cool matrix fade-in is easier and looks great.
        contentDiv.innerHTML = parsedHTML;
        contentDiv.style.opacity = 0;
        
        gsap.to(contentDiv, {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            onUpdate: scrollToBottom
        });
    }

    function getTextNodes(node) {
        let all = [];
        for (node = node.firstChild; node; node = node.nextSibling) {
            if (node.nodeType === 3) all.push(node);
            else all = all.concat(getTextNodes(node));
        }
        return all;
    }

    function appendLoading() {
        const id = 'loading-' + Date.now();
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'ai-message');
        messageDiv.id = id;

        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('avatar', 'ai-avatar');
        avatarDiv.innerHTML = `<div class="orbiting-rings"></div><span class="ai-icon">AI</span>`;

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content', 'glass-bubble', 'ai-bubble');
        contentDiv.innerHTML = `<span class="glitch-text">Processing...</span>`;

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        chatBox.appendChild(messageDiv);

        scrollToBottom();
        return id;
    }

    function removeLoading(id) {
        const loadingElement = document.getElementById(id);
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    function scrollToBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
