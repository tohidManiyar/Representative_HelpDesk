// Elements
const registerForm = document.getElementById("registerForm");
const registerSuccessPopup = document.getElementById("registerSuccessPopup");
const goToLogin = document.getElementById("goToLogin");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value.trim();
  const id = document.getElementById("id").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const shift = document.getElementById("shift").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();

  // Basic validation
  if (
    !name ||
    !email ||
    !password ||
    !role ||
    !id ||
    !phone ||
    !shift ||
    !address ||
    !city ||
    !state
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  if (!email.includes("@")) {
    alert("Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  const phonePattern = /^[0-9]{10}$/;
  if (!phonePattern.test(phone)) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  try {
    const response = await fetch("https://representative-helpdesk-3alv.onrender.com/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        id,
        phone,
        shift,
        address,
        city,
        state,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      registerSuccessPopup.classList.remove("hidden");
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Server error. Please try again later.");
  }
});

// Redirect to login page
goToLogin.addEventListener("click", () => {
  window.location.href = "login.html";
});
