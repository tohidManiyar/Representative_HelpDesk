document.addEventListener("DOMContentLoaded", function () {
  // ================= CHATBOT FUNCTIONALITY =================
  let currentCustomer = JSON.parse(localStorage.getItem("user"));
  let isLoggedIn = currentCustomer ? true : false;
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
    timeStamp.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    messageContent.appendChild(timeStamp);
    messageWrapper.appendChild(messageContent);
    chatMessages.appendChild(messageWrapper);

    chatMessages.scrollTop = chatMessages.scrollHeight;
    messageInput.value = "";

    // Generate smart reply
    setTimeout(async () => {
      const reply = await generateBotResponse(text);
      botReply(reply);
    }, 800);
  }

  function botReply(text) {
    const messageWrapper = document.createElement("div");
    messageWrapper.classList.add("message", "bot-message");

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.textContent = text;

    const timeStamp = document.createElement("span");
    timeStamp.classList.add("message-time");
    timeStamp.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

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

  let tickets = [];

  async function loadMyTickets() {
    const token = localStorage.getItem("token");

    if (!token) return [];

    try {
      const response = await fetch("http://localhost:8000/api/enquiry/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        tickets = data.data || [];
        return tickets;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Ticket Load Error:", error);
      return [];
    }
  }
  // ================= CLOSE ASSIGNED TICKETS =================
  const closeAssignedBtn = document.getElementById("closeAssigned");

  if (closeAssignedBtn) {
    closeAssignedBtn.addEventListener("click", () => {
      const popup = document.getElementById("assignedBackdrop");
      if (popup) popup.style.display = "none";
    });
  }

  const assignedBackdrop = document.getElementById("assignedBackdrop");

  if (assignedBackdrop) {
    assignedBackdrop.addEventListener("click", (e) => {
      if (e.target === assignedBackdrop) {
        assignedBackdrop.style.display = "none";
      }
    });
  }

  const reportsClose = document.getElementById("reportsClose");
  const reportsBackdrop = document.getElementById("reportsBackdrop");

  if (reportsClose) {
    reportsClose.addEventListener("click", () => {
      reportsBackdrop.style.display = "none";
      document.getElementById("reportsModal").style.display = "none";
    });
  }

  const emailClose = document.getElementById("emailClose");
  const emailBackdrop = document.getElementById("emailBackdrop");

  if (emailClose) {
    emailClose.addEventListener("click", () => {
      emailBackdrop.style.display = "none";
      document.getElementById("emailModal").style.display = "none";
    });
  }
  // ================= RESTORE LOGIN AFTER CUSTOMERS LOAD =================
  function restoreLogin() {
    const savedEmail = localStorage.getItem("loggedInUserEmail");

    if (!savedEmail || !window.customers) return;

    const found = window.customers.find(
      (c) => c.email.toLowerCase() === savedEmail.toLowerCase(),
    );

    if (found) {
      currentCustomer = found;
      isLoggedIn = true;

      console.log("User auto-restored:", found.name);
    }
  }

  // Try restoring every 500ms until customers load
  window.addEventListener("load", () => {
    const checkCustomersLoaded = setInterval(() => {
      if (window.customers && window.customers.length > 0) {
        restoreLogin();
        clearInterval(checkCustomersLoaded);
      }
    }, 300);
  });

  function createSummaryChart(totalSpent) {
    const chartContainer = document.createElement("div");
    chartContainer.style.marginTop = "10px";

    const bar = document.createElement("div");
    bar.style.height = "20px";
    bar.style.background = "linear-gradient(to right, #4CAF50, #2196F3)";
    bar.style.width = Math.min(totalSpent / 200, 100) + "%";
    bar.style.borderRadius = "5px";

    chartContainer.appendChild(bar);
    return chartContainer;
  }

  async function generateBotResponse(userText) {
    const text = userText.toLowerCase().trim();

    // ================= LOGIN SYSTEM =================
    if (text.startsWith("login ")) {
      const emailInput = text.replace("login ", "").trim();

      if (!window.customers || window.customers.length === 0) {
        return "⚠ Customer database not loaded yet.";
      }

      const found = window.customers.find(
        (c) => c.email.toLowerCase() === emailInput,
      );

      if (found) {
        currentCustomer = found;
        isLoggedIn = true;

        // Save to localStorage
        localStorage.setItem("loggedInUserEmail", found.email);

        return `✅ Login successful!

Welcome back, ${found.name} 🎉
You are logged in as a ${found.type} customer.`;
      } else {
        return "❌ No customer found with that email.";
      }
    }

    if (text === "logout") {
      currentCustomer = null;
      isLoggedIn = false;

      localStorage.removeItem("loggedInUserEmail");

      return "👋 You have been logged out successfully.";
    }
    // ================= SHOW MY TICKETS =================
    if (text.includes("ticket")) {
      if (!isLoggedIn || !currentCustomer) {
        return "🔐 Please login first.";
      }

      const myTickets = await loadMyTickets();

      if (!myTickets || myTickets.length === 0) {
        return "🎫 You have no tickets.";
      }

      let response = `🎫 You have ${myTickets.length} ticket(s):\n\n`;

      myTickets.forEach((t, index) => {
        response += `
🎟 Ticket: ${index + 1}
📝 Issue: ${t.message || t.issue}
📌 Status: ${t.status || "Pending"}
`;
      });

      return response;
    }

    // ================= PROCESS REFUND =================
    if (text.startsWith("refund ord")) {
      if (!isLoggedIn || !currentCustomer) {
        return "🔐 Please login first.";
      }

      const orderId = text.split(" ")[1].toUpperCase();

      const order = window.orders.find(
        (o) =>
          o.orderId.toUpperCase() === orderId &&
          o.email.toLowerCase() === currentCustomer.email.toLowerCase(),
      );

      if (!order) {
        return "❌ Order not found.";
      }

      if (order.status === "Refunded") {
        return "⚠ Refund already processed.";
      }

      order.status = "Refunded";

      return `💰 Refund for ${orderId} has been successfully processed.`;
    }

    // ================= BOT STATS =================
    if (
      text.includes("total tickets") ||
      text.includes("total emails") ||
      text.includes("closed tickets") ||
      text.includes("ticket stats")
    ) {
      if (!isLoggedIn) {
        return "🔐 Please login first.";
      }

      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:8000/api/enquiry/stats",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          return "⚠ Unable to fetch statistics.";
        }

        return `📊 Your Ticket Statistics:

🎫 Total Tickets: ${data.data.totalTickets || 0}
📩 Total Emails: ${data.data.totalTickets || 0}
🔒 Closed Tickets: ${data.data.closedTickets || 0}`;
      } catch (error) {
        return "⚠ Server error while fetching statistics.";
      }
    }
    // ================= CANCEL ORDER =================
    if (text.startsWith("cancel ord")) {
      if (!isLoggedIn || !currentCustomer) {
        return "🔐 Please login first.";
      }

      const orderId = text.split(" ")[1].toUpperCase();

      if (!window.orders || window.orders.length === 0) {
        return "⚠ Orders database not loaded.";
      }

      const order = window.orders.find(
        (o) =>
          o.orderId.toUpperCase() === orderId &&
          o.email.toLowerCase() === currentCustomer.email.toLowerCase(),
      );

      if (!order) {
        return "❌ Order not found for your account.";
      }

      if (order.status === "Cancelled") {
        return "⚠ This order is already cancelled.";
      }

      order.status = "Cancelled";

      return `❌ Order ${orderId} has been successfully cancelled.`;
    }

    // ================= TOTAL SUMMARY + LOYALTY =================
    if (text.includes("my summary") || text.includes("total spending")) {
      if (!isLoggedIn || !currentCustomer) {
        return "🔐 Please login first.";
      }

      if (!window.orders) {
        return "⚠ Orders database not loaded.";
      }

      const customerOrders = window.orders.filter(
        (o) => o.email.toLowerCase() === currentCustomer.email.toLowerCase(),
      );

      if (customerOrders.length === 0) {
        return "📦 You have no orders yet.";
      }

      let totalSpent = 0;

      customerOrders.forEach((o) => {
        totalSpent += parseFloat(o.amount);
      });

      let loyalty = "Silver 🥉";
      if (totalSpent > 5000 && totalSpent <= 15000) loyalty = "Gold 🥈";
      if (totalSpent > 15000) loyalty = "Platinum 🥇";
      setTimeout(() => {
        const lastMessage = chatMessages.lastElementChild;
        if (lastMessage) {
          const content = lastMessage.querySelector(".message-content");
          if (content) {
            content.appendChild(createSummaryChart(totalSpent));
          }
        }
      }, 100);

      return `📊 Customer Summary:

Total Orders: ${customerOrders.length}
Total Amount Spent: ₹${totalSpent}
Loyalty Level: ${loyalty}`;
    }

    // ================= SYSTEM NAVIGATION =================

    // Assigned Tickets
    if (
      text.includes("open tickets") ||
      text.includes("show tickets") ||
      text.includes("assigned tickets")
    ) {
      const popup = document.getElementById("assignedBackdrop");
      if (popup) popup.style.display = "flex";
      return "📋 Opening Assigned Tickets section.";
    }

    // Reports
    if (
      text.includes("open reports") ||
      text.includes("show reports") ||
      text.includes("weekly reports")
    ) {
      const reportsBackdrop = document.getElementById("reportsBackdrop");
      const reportsModal = document.getElementById("reportsModal");

      if (reportsBackdrop) reportsBackdrop.style.display = "block";
      if (reportsModal) reportsModal.style.display = "block";

      return "📊 Opening Reports section.";
    }

    // Email
    if (
      text.includes("send email") ||
      text.includes("email customer") ||
      text.includes("open email section")
    ) {
      const emailBackdrop = document.getElementById("emailBackdrop");
      const emailModal = document.getElementById("emailModal");

      if (emailBackdrop) emailBackdrop.style.display = "block";
      if (emailModal) emailModal.style.display = "block";

      return "📩 Opening Email Customer section.";
    }

    // Orders page
    if (text.includes("go to orders") || text.includes("orders page")) {
      window.location.href = "orders.html";
      return "📦 Redirecting to Orders page.";
    }

    // Customers page
    if (text.includes("go to customers")) {
      window.location.href = "customers.html";
      return "👤 Redirecting to Customers page.";
    }

    // Calendar
    if (text.includes("calendar")) {
      window.location.href = "calendar.html";
      return "📅 Redirecting to Calendar page.";
    }

    // Services
    if (text.includes("services")) {
      window.location.href = "services.html";
      return "🛠️ Redirecting to Services page.";
    }

    // Home
    if (text.includes("home") || text.includes("dashboard")) {
      window.location.href = "index.html";
      return "🏠 Redirecting to Home page.";
    }

    // Close Tickets
    if (text.includes("close tickets")) {
      const popup = document.getElementById("assignedBackdrop");
      if (popup) popup.style.display = "none";
      return "📋 Assigned Tickets closed.";
    }

    // ================= IF USER NOT IDENTIFIED =================
    if (!currentCustomer && text.includes("my")) {
      return "🤖 Please provide your name, email, or phone number first so I can identify you.";
    }

    // ================= PERSONAL QUESTIONS =================
    if (currentCustomer) {
      if (text.includes("name")) {
        return `👤 Your name is ${currentCustomer.name}.`;
      }

      if (text.includes("email")) {
        return `📧 Your registered email is ${currentCustomer.email}.`;
      }

      if (text.includes("phone")) {
        return `📱 Your phone number is ${currentCustomer.phone}.`;
      }

      if (text.includes("address")) {
        return `🏠 Your address is ${currentCustomer.address}.`;
      }

      if (text.includes("role")) {
        return `🧑‍💼 Your role is ${currentCustomer.role}.`;
      }

      if (text.includes("shift")) {
        return `⏰ Your shift timing is ${currentCustomer.shift}.`;
      }

      if (text.includes("city")) {
        return `🌆 Your city is ${currentCustomer.city}.`;
      }

      if (text.includes("state")) {
        return `🗺️ Your state is ${currentCustomer.state}.`;
      }

      if (text.includes("location")) {
        return `📍 Your location is ${currentCustomer.city}, ${currentCustomer.state}.`;
      }
    }

    // ================= SEARCH CUSTOMER =================
    if (window.customers && window.customers.length > 0) {
      const foundCustomer = window.customers.find((c) =>
        text
          .split(" ")
          .some(
            (word) =>
              c.name.toLowerCase().includes(word) ||
              c.email.toLowerCase().includes(word) ||
              c.phone.includes(word),
          ),
      );

      if (foundCustomer) {
        currentCustomer = foundCustomer;

        return `👤 Customer Identified Successfully!

Name: ${foundCustomer.name}
Email: ${foundCustomer.email}
Phone: ${foundCustomer.phone}
Address: ${foundCustomer.address}
Type: ${foundCustomer.type}
Gender: ${foundCustomer.gender}
Age: ${foundCustomer.age}
With Wishlistz: ${foundCustomer.duration}`;
      }
    }

    // ================= ORDER HISTORY =================
    if (text.includes("my orders") || text.includes("order history")) {
      if (!isLoggedIn || !currentCustomer) {
        return "🔐 Please login first using: login your-email@example.com";
      }

      if (!window.orders || window.orders.length === 0) {
        return "⚠ Order database not loaded yet.";
      }

      const customerOrders = window.orders.filter(
        (o) => o.email.toLowerCase() === currentCustomer.email.toLowerCase(),
      );

      if (customerOrders.length === 0) {
        return "📦 You have no orders yet.";
      }

      let orderList = "📦 Your Order History:\n\n";

      customerOrders.forEach((o) => {
        orderList += `Order ID: ${o.orderId}
Product: ${o.product}
Amount: ₹${o.amount}
Status: ${o.status}
Date: ${o.date}
-------------------------\n`;
      });

      return orderList;
    }

    // ================= PAYMENT ISSUE =================
    if (
      text.includes("payment") ||
      text.includes("paid but") ||
      text.includes("transaction failed")
    ) {
      return "💳 It looks like a payment-related issue.\n\nPlease verify:\n• Transaction ID\n• Payment status in Orders section\n• Bank confirmation\n\nIf payment is deducted but order not confirmed, create a high-priority ticket immediately.";
    }

    // ================= DELIVERY DELAY =================
    if (
      text.includes("delivery") ||
      text.includes("late") ||
      text.includes("delay")
    ) {
      return "🚚 For delivery delays:\n\n• Check order tracking in Orders section\n• Verify dispatch date\n• Inform customer about expected delivery date\n\nIf severely delayed, escalate to logistics team.";
    }

    // ================= REFUND =================
    if (text.includes("refund")) {
      return "💰 Refund Query Detected.\n\nPlease:\n• Check refund status in system\n• Confirm refund processing date\n• Inform customer that refund may take 5–7 business days\n\nIf not processed, escalate to accounts team.";
    }

    // ================= DAMAGED PRODUCT =================
    if (text.includes("damaged") || text.includes("broken")) {
      return "📦 Damaged product issue.\n\n• Request product images\n• Verify order ID\n• Create replacement ticket\n• Set priority as HIGH\n\nInform customer replacement will be processed soon.";
    }

    // ================= REPLACEMENT =================
    if (text.includes("replace") || text.includes("replacement")) {
      return "🔁 Replacement request detected.\n\n• Confirm order ID\n• Verify return eligibility\n• Create replacement ticket\n• Update ticket status to Pending until approval";
    }

    // ================= CANCELLATION =================
    if (
      text.includes("cancel my order") ||
      text.includes("order cancellation")
    ) {
      return "❌ Order cancellation request.\n\n• Check if order is dispatched\n• If not shipped → Cancel immediately\n• If shipped → Inform customer cancellation not possible\n• Update order status accordingly";
    }

    // ================= LOGIN ISSUE =================
    if (text.includes("login") || text.includes("account")) {
      return "🔐 Account/Login issue.\n\n• Ask customer to reset password\n• Verify registered email\n• Check if account is active\n\nIf issue persists, escalate to technical team.";
    }

    // ================= TICKET STATUS =================
    if (text.includes("ticket status")) {
      return "🎫 You can check ticket status in Assigned Tickets section.\n\nStatuses include: Open, Pending, Closed, Resolved.";
    }

    // ================= CUSTOMER SEARCH =================
    if (text.includes("customer details") || text.includes("customer info")) {
      return "👤 Use Customer Search section to view:\n• Name\n• Email\n• Phone\n• Address\n• Customer Type\n• Duration with Wishlistz";
    }

    // ================= GREETING =================
    if (text.includes("hi") || text.includes("hello")) {
      return "👋 Hello! Please tell me the customer's issue (payment, refund, delivery, damaged product, cancellation, etc.) and I’ll guide you.";
    }

    // ================= DEFAULT =================
    return "I didn’t understand your issue. Could you please explain it clearly?";
  }
});
