document.addEventListener("DOMContentLoaded", function () {
  let customers = [];

  const searchInput = document.getElementById("customerSearchInput");
  const resultsDiv = document.getElementById("customerResults");

  // ===================== LOAD DATA FROM CSV =====================
  async function loadCustomers() {
    try {
      const response = await fetch("customers.csv");
      const csvText = await response.text();

      const rows = csvText.split("\n").slice(1);

      customers = rows
        .filter((row) => row.trim() !== "")
        .map((row) => {
          const cols = row.split(",");

          return {
            name: cols[0],
            email: cols[1],
            phone: cols[2],
            address: cols[3],
            type: cols[4],
            gender: cols[5],
            age: cols[6],
            duration: cols[7],
          };
        });

      displayCustomers(customers);
    } catch (error) {
      console.error("Error loading customers:", error);
    }
  }

  // ===================== DISPLAY CUSTOMERS =====================
  function displayCustomers(list) {
    resultsDiv.innerHTML = "";

    list.forEach((c) => {
      const card = document.createElement("div");
      card.className = "customer-card";

      card.innerHTML = `
        <h3>${c.name}</h3>
        <p><b>Email:</b> ${c.email}</p>
        <p><b>Phone:</b> ${c.phone}</p>
        <p><b>Address:</b> ${c.address}</p>
        <p><b>Customer Type:</b> ${c.type}</p>
        <p><b>Gender:</b> ${c.gender}</p>
        <p><b>Age:</b> ${c.age}</p>
        <p><b>With Wishlistz:</b> ${c.duration}</p>
      `;

      resultsDiv.appendChild(card);
    });
  }

  // ===================== SEARCH FILTER =====================
  if (searchInput) {
    searchInput.addEventListener("keyup", () => {
      const value = searchInput.value.toLowerCase();

      const filtered = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(value) ||
          c.email.toLowerCase().includes(value) ||
          c.phone.includes(value),
      );

      displayCustomers(filtered);
    });
  }

  // Load data when page opens
  loadCustomers();

  // ============================================================
  // ============ ADDED SIDEBAR + POPUP LOGIC ===================
  // ============================================================

  const $ = (id) => document.getElementById(id);

  const hamburger = $("hamburger");
  const sidebar = $("sidebar");
  const mainContent = $("mainContent");

  const assignedLink = $("assignedLink");
  const assignedBackdrop = $("assignedBackdrop");
  const closeAssigned = $("closeAssigned");

  const reportsLink = $("reportsLink");
  const reportsBackdrop = $("reportsBackdrop");
  const closeReports = $("closeReports");

  const emailLink = $("emailLink");
  const emailBackdrop = $("emailBackdrop");
  const closeEmail = $("closeEmail");

  const emailDropdown = $("emailDropdown");
  const emailMessage = $("emailMessage");
  const emailForm = $("emailForm");

  const signoutLink = $("signoutLink");
  const signoutPopup = $("signoutPopup");
  const confirmSignout = $("confirmSignout");
  const cancelSignout = $("cancelSignout");

  // ================== HAMBURGER ==================
  if (hamburger && sidebar && mainContent) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("closed");
      mainContent.classList.toggle("sidebar-open");
      hamburger.classList.toggle("active");
    });
  }

  // ================== POPUP HANDLER ==================
  function setupPopup(openBtn, backdrop, closeBtn) {
    if (!openBtn || !backdrop) return;

    openBtn.addEventListener("click", (e) => {
      e.preventDefault();
      backdrop.style.display = "flex";
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        backdrop.style.display = "none";
      });
    }

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.style.display = "none";
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        backdrop.style.display = "none";
      }
    });
  }

  setupPopup(assignedLink, assignedBackdrop, closeAssigned);
  setupPopup(reportsLink, reportsBackdrop, closeReports);
  setupPopup(emailLink, emailBackdrop, closeEmail);

  // ================== EMAIL DROPDOWN ==================
  if (emailDropdown && emailMessage) {
    emailDropdown.addEventListener("change", () => {
      if (emailDropdown.value) {
        emailMessage.value = emailDropdown.value;
      }
    });
  }

  // ================== EMAIL FORM ==================
  if (emailForm) {
    emailForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const to = $("emailTo")?.value.trim();
      const subject = $("emailSubject")?.value.trim();
      const message = emailMessage?.value.trim();

      if (!to || !subject || !message) {
        alert("Please complete all fields.");
        return;
      }

      alert(`Email sent successfully ✅

To: ${to}
Subject: ${subject}`);

      if (emailBackdrop) {
        emailBackdrop.style.display = "none";
      }

      emailForm.reset();
    });
  }

  // ================== SIGN OUT ==================
  if (signoutLink && signoutPopup) {
    signoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      signoutPopup.classList.remove("hidden");
    });
  }

  if (cancelSignout && signoutPopup) {
    cancelSignout.addEventListener("click", () => {
      signoutPopup.classList.add("hidden");
    });
  }

  if (confirmSignout) {
    confirmSignout.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

});


// ===================== UNIVERSAL POPUP HANDLER =====================

// Open popup when clicking any element with data-popup attribute
document.querySelectorAll("[data-popup]").forEach((button) => {
  button.addEventListener("click", function () {
    const targetId = this.getAttribute("data-popup");
    const popup = document.getElementById(targetId);

    if (popup) {
      popup.classList.add("active");
      popup.classList.remove("hidden");
    }
  });
});

// Close popup when clicking element with class popup-close
document.querySelectorAll(".popup-close").forEach((btn) => {
  btn.addEventListener("click", function () {
    const popup = this.closest(".popup, .popup-modal, .popup-overlay");
    if (popup) {
      popup.classList.remove("active");
      popup.classList.add("hidden");
    }
  });
});

// Close when clicking backdrop
document.querySelectorAll(".popup-backdrop").forEach((backdrop) => {
  backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) {
      backdrop.classList.remove("active");
    }
  });
});

// ===================== SIDEBAR TOGGLE =====================
const hamburger = document.getElementById("hamburger");
const sidebar = document.querySelector(".sidebar");
const main = document.querySelector("main");

if (hamburger && sidebar && main) {
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("closed");
    hamburger.classList.toggle("open");
    main.classList.toggle("sidebar-open");
  });
}


// ===================== ASSIGNED TICKETS =====================
const assignedLink = document.getElementById("assignedLink");
const assignedBackdrop = document.getElementById("assignedBackdrop");
const closeAssigned = document.getElementById("closeAssigned");

if (assignedLink && assignedBackdrop) {
  assignedLink.addEventListener("click", (e) => {
    e.preventDefault();
    assignedBackdrop.style.display = "flex";
  });
}

if (closeAssigned && assignedBackdrop) {
  closeAssigned.addEventListener("click", () => {
    assignedBackdrop.style.display = "none";
  });
}


// ===================== REPORTS POPUP =====================
const reportsLink = document.getElementById("reportsLink");
const reportsBackdrop = document.getElementById("reportsBackdrop");
const reportsModal = document.getElementById("reportsModal");
const reportsClose = document.getElementById("reportsClose");

if (reportsLink && reportsBackdrop && reportsModal) {
  reportsLink.addEventListener("click", (e) => {
    e.preventDefault();
    reportsBackdrop.style.display = "flex";
    reportsModal.style.display = "block";
  });
}

if (reportsClose) {
  reportsClose.addEventListener("click", () => {
    reportsBackdrop.style.display = "none";
    reportsModal.style.display = "none";
  });
}

if (reportsBackdrop) {
  reportsBackdrop.addEventListener("click", () => {
    reportsBackdrop.style.display = "none";
    reportsModal.style.display = "none";
  });
}


// ===================== EMAIL POPUP =====================
const emailLink = document.getElementById("emailSectionLink");
const emailBackdrop = document.getElementById("emailBackdrop");
const emailModal = document.getElementById("emailModal");
const emailClose = document.getElementById("emailClose");

if (emailLink && emailBackdrop && emailModal) {
  emailLink.addEventListener("click", (e) => {
    e.preventDefault();
    emailBackdrop.style.display = "flex";
    emailModal.style.display = "block";
  });
}

if (emailClose) {
  emailClose.addEventListener("click", () => {
    emailBackdrop.style.display = "none";
    emailModal.style.display = "none";
  });
}

if (emailBackdrop) {
  emailBackdrop.addEventListener("click", () => {
    emailBackdrop.style.display = "none";
    emailModal.style.display = "none";
  });
}


// ===================== ISSUE DROPDOWN AUTO MESSAGE =====================
const issueDropdown = document.getElementById("issueDropdown");
const emailMessage = document.getElementById("emailMessage");

if (issueDropdown && emailMessage) {
  issueDropdown.addEventListener("change", function () {
    emailMessage.value = this.value;
  });
}


// ===================== SIGN OUT POPUP =====================
const signoutLink = document.getElementById("signoutLink");
const signoutPopup = document.getElementById("signoutPopup");
const confirmSignout = document.getElementById("confirmSignout");
const cancelSignout = document.getElementById("cancelSignout");

if (signoutLink && signoutPopup) {
  signoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    signoutPopup.classList.remove("hidden");
  });
}

if (cancelSignout && signoutPopup) {
  cancelSignout.addEventListener("click", () => {
    signoutPopup.classList.add("hidden");
  });
}

if (confirmSignout) {
  confirmSignout.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}