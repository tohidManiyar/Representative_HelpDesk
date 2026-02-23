document.addEventListener("DOMContentLoaded", function () {

  // ================== SAFE ELEMENT GETTER ==================
const $ = (id) => document.getElementById(id);

// ================== ELEMENTS ==================
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

// ================== HAMBURGER TOGGLE ==================
if (hamburger && sidebar && mainContent) {
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("closed");
    mainContent.classList.toggle("sidebar-open");
    hamburger.classList.toggle("active");
  });
}

// ================== GENERIC POPUP HANDLER ==================
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

  // Close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      backdrop.style.display = "none";
    }
  });
}

// Setup popups
setupPopup(assignedLink, assignedBackdrop, closeAssigned);
setupPopup(reportsLink, reportsBackdrop, closeReports);
setupPopup(emailLink, emailBackdrop, closeEmail);

// ================== ASSIGNED TICKETS TABLE ACTIONS ==================
const assignedTable = document.querySelector(".assigned-table");

if (assignedTable) {
  assignedTable.addEventListener("click", (e) => {
    if (e.target.classList.contains("resolve-btn")) {
      const row = e.target.closest("tr");
      const statusDropdown = row.querySelector(".status-dropdown");
      if (statusDropdown) {
        statusDropdown.value = "Resolved"; // set dropdown to Resolved
        statusDropdown.style.color = "#2ecc71"; // optional: green text
      }
      e.target.disabled = true;
      e.target.textContent = "Done";
    }
  });
}


// ================== REPORT DOWNLOAD BUTTONS ==================
document.querySelectorAll(".download-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const week = btn.dataset.week || "Unknown";

    const content = `Weekly Report - Week ${week}
----------------------------------------
Total Tickets: 120
Resolved: 98
Pending: 22
Customer Satisfaction: 92%
Generated on: ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Week_${week}_Report.txt`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
});

// ================== EMAIL DROPDOWN AUTO FILL ==================
if (emailDropdown && emailMessage) {
  emailDropdown.addEventListener("change", () => {
    if (emailDropdown.value) {
      emailMessage.value = emailDropdown.value;
    }
  });
}

// ================== EMAIL FORM SUBMIT ==================
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

// ================== SIGN OUT POPUP ==================
const signoutLink = document.getElementById("signoutLink");
const signoutPopup = document.getElementById("signoutPopup");
const confirmSignout = document.getElementById("confirmSignout");
const cancelSignout = document.getElementById("cancelSignout");

// Show popup when clicking sidebar Sign Out
signoutLink.addEventListener("click", (e) => {
  e.preventDefault(); // prevent direct navigation
  signoutPopup.classList.remove("hidden");
});

// Hide popup if "No" clicked
cancelSignout.addEventListener("click", () => {
  signoutPopup.classList.add("hidden");
});

// Redirect if "Yes" clicked
confirmSignout.addEventListener("click", () => {
  window.location.href = "login.html"; // placeholder redirect
});


});