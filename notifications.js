// ===================== SIDEBAR TOGGLE =====================
const sidebar = document.querySelector('.sidebar');
const hamburger = document.getElementById('hamburger');
const mainContent = document.querySelector('main');

hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('closed');
  mainContent.classList.toggle('sidebar-open');
  hamburger.classList.toggle('open');

  if (sidebar.classList.contains('closed')) {
    mainContent.style.marginLeft = '0';
  } else {
    mainContent.style.marginLeft = '260px';
  }
});

// ===================== NOTIFICATION INTERACTIVITY =====================
const notificationCards = document.querySelectorAll('.notification-card');

notificationCards.forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('read');
  });
});

// ===================== POPUP LOGIC (s1 enabled) =====================

// Assigned Tickets Popup
const assignedLink = document.getElementById("assignedLink");
const assignedBackdrop = document.getElementById("assignedBackdrop");
const closeAssigned = document.getElementById("closeAssigned");

if (assignedLink && assignedBackdrop && closeAssigned) {
  assignedLink.addEventListener("click", (e) => {
    e.preventDefault();
    assignedBackdrop.style.display = "flex";
  });
  closeAssigned.addEventListener("click", () => {
    assignedBackdrop.style.display = "none";
  });
  assignedBackdrop.addEventListener("click", (e) => {
    if (e.target === assignedBackdrop) {
      assignedBackdrop.style.display = "none";
    }
  });
}

// Resolve button logic
const assignedTable = document.querySelector(".assigned-table");
if (assignedTable) {
  assignedTable.addEventListener("click", (e) => {
    if (e.target.classList.contains("resolve-btn")) {
      const row = e.target.closest("tr");
      const statusDropdown = row.querySelector(".status-dropdown");
      if (statusDropdown) {
        statusDropdown.value = "Resolved";
        statusDropdown.style.color = "#2ecc71";
      }
      e.target.disabled = true;
      e.target.textContent = "Done";
    }
  });
}


// Reports Popup
const reportsLink = document.getElementById("reportsLink");
const reportsModal = document.getElementById("reportsModal");
const reportsBackdrop = document.getElementById("reportsBackdrop");
const reportsClose = document.getElementById("reportsClose");

reportsLink.addEventListener("click", (e) => {
  e.preventDefault();
  reportsModal.classList.add("active");
  reportsBackdrop.classList.add("active");
});
reportsClose.addEventListener("click", () => {
  reportsModal.classList.remove("active");
  reportsBackdrop.classList.remove("active");
});
reportsBackdrop.addEventListener("click", () => {
  reportsModal.classList.remove("active");
  reportsBackdrop.classList.remove("active");
});

// Email Customers Popup
const emailLink = document.getElementById("emailSectionLink");
const emailModal = document.getElementById("emailModal");
const emailBackdrop = document.getElementById("emailBackdrop");
const emailClose = document.getElementById("emailClose");
const emailForm = document.getElementById("emailForm");
const issueDropdown = document.getElementById("issueDropdown");
const emailMessage = document.getElementById("emailMessage");

emailLink.addEventListener("click", (e) => {
  e.preventDefault();
  emailModal.classList.add("active");
  emailBackdrop.classList.add("active");
});
emailClose.addEventListener("click", () => {
  emailModal.classList.remove("active");
  emailBackdrop.classList.remove("active");
});
emailBackdrop.addEventListener("click", () => {
  emailModal.classList.remove("active");
  emailBackdrop.classList.remove("active");
});

// Auto-fill message when selecting common issue
issueDropdown.addEventListener("change", () => {
  if (issueDropdown.value) {
    emailMessage.value = issueDropdown.value;
  }
});

// Handle email form submission
emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const to = document.getElementById("emailTo").value;
  alert(`Email sent to ${to}`);
  emailModal.classList.remove("active");
  emailBackdrop.classList.remove("active");
  emailForm.reset();
});

// Elements
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
