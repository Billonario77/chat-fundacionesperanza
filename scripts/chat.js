document.addEventListener('DOMContentLoaded', function () {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Open Chat
    chatToggle.addEventListener('click', function () {
        chatWindow.classList.add('active');
        chatToggle.style.display = 'none';
    });

    // Close Chat
    closeChat.addEventListener('click', function () {
        chatWindow.classList.remove('active');
        chatToggle.style.display = 'flex';
    });

    // Send Message
    chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const messageText = chatInput.value.trim();

        if (messageText !== "") {
            // Add User Message
            addMessage(messageText, 'user');
            chatInput.value = '';

            // Simulate Bot Response
            setTimeout(function () {
                addMessage("Gracias por escribirnos. Un asesor se pondrá en contacto contigo pronto.", 'bot');
            }, 1000);
        }
    });

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        const textP = document.createElement('p');
        textP.textContent = text;

        messageDiv.appendChild(textP);
        chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
