// ================= CHATBOT FUNCTIONALITY =================

// Elements
const chatbotContainer = document.getElementById("chatbot-container");
const minimizedChat = document.getElementById("minimizedChat");
const chatWindow = document.getElementById("chatWindow");
const minimizeChatBtn = document.getElementById("minimizeChatBtn");
const sendButton = document.getElementById("sendButton");
const messageInput = document.getElementById("messageInput");
const chatMessages = document.getElementById("chatMessages");
const attachButton = document.getElementById("attachButton");
const fileInput = document.getElementById("fileInput");
const themeToggle = document.getElementById("themeToggle");

// Toggle chatbot open/close
minimizedChat.addEventListener("click", () => {
  chatbotContainer.classList.add("open");
  minimizedChat.style.display = "none";
  chatWindow.classList.remove("hidden");
});

// Minimize chat back to button
minimizeChatBtn.addEventListener("click", () => {
  chatbotContainer.classList.remove("open");
  minimizedChat.style.display = "flex";
  chatWindow.classList.add("hidden");
});

// Send message
sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const text = messageInput.value.trim();
  if (text === "") return;

  // Create user message
  const messageWrapper = document.createElement("div");
  messageWrapper.classList.add("message", "user-message");

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  messageContent.textContent = text;

  const timeStamp = document.createElement("span");
  timeStamp.classList.add("message-time");
  timeStamp.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  messageContent.appendChild(timeStamp);
  messageWrapper.appendChild(messageContent);
  chatMessages.appendChild(messageWrapper);

  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Clear input
  messageInput.value = "";

  // Simulate bot reply
  setTimeout(() => {
    botReply("Thanks for your message! We'll get back to you shortly.");
  }, 1000);
}

function botReply(text) {
  const messageWrapper = document.createElement("div");
  messageWrapper.classList.add("message", "bot-message");

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  messageContent.textContent = text;

  const timeStamp = document.createElement("span");
  timeStamp.classList.add("message-time");
  timeStamp.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  messageContent.appendChild(timeStamp);
  messageWrapper.appendChild(messageContent);
  chatMessages.appendChild(messageWrapper);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// File attachment
attachButton.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    botReply(`📎 File attached: ${fileInput.files[0].name}`);
  }
});

// Dark/Light mode toggle
themeToggle.addEventListener("click", () => {
  chatbotContainer.classList.toggle("dark-mode");
  // Optional: change icon depending on mode
  if (chatbotContainer.classList.contains("dark-mode")) {
    themeToggle.textContent = "☀️"; // Light mode icon
  } else {
    themeToggle.textContent = "🌓"; // Dark mode icon
  }
});
