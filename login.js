const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const forgotPopup = document.getElementById("forgotPopup");
const sendReset = document.getElementById("sendReset");
const cancelReset = document.getElementById("cancelReset");
const signinForm = document.getElementById("signinForm");

const notificationPopup = document.getElementById("notificationPopup");
const notificationTitle = document.getElementById("notificationTitle");
const notificationMessage = document.getElementById("notificationMessage");
const closeNotification = document.getElementById("closeNotification");

function showNotification(title, message) {
  notificationTitle.textContent = title;
  notificationMessage.textContent = message;
  notificationPopup.classList.remove("hidden");
}

closeNotification.addEventListener("click", () => {
  notificationPopup.classList.add("hidden");
});

forgotPasswordLink.addEventListener("click", (e) => {
  e.preventDefault();
  forgotPopup.classList.remove("hidden");
});

cancelReset.addEventListener("click", () => {
  forgotPopup.classList.add("hidden");
});

sendReset.addEventListener("click", async () => {
  const email = document.getElementById("resetEmail").value.trim();

  if (!email || !email.includes("@")) {
    showNotification("Error", "Please enter a valid email address.");
    return;
  }

  try {
    const response = await fetch(
      "https://representative-helpdesk.onrender.com/api/user/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      showNotification(
        "Success",
        data.message || "Reset link sent successfully.",
      );
      forgotPopup.classList.add("hidden");
    } else {
      showNotification("Error", data.message || "Something went wrong.");
    }
  } catch (error) {
    showNotification("Server Error", "Please try again later.");
  }
});

signinForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showNotification("Error", "Please fill in both Email and Password.");
    return;
  }

  try {
    const response = await fetch("https://representative-helpdesk.onrender.com/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showNotification("Login Successful", "Welcome back!");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      showNotification("Login Failed", data.message || "Invalid credentials");
    }
  } catch (error) {
    showNotification("Server Error", "Please try again later.");
  }
});
