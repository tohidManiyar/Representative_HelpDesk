// ===================== SERVICES INTERACTIVITY =====================

// Grab modal elements
const popupModal = document.getElementById("popupModal");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const popupClose = document.getElementById("popupClose");

// ===================== MAIN POPUP =====================

function openPopup(title, message) {
  if (!popupModal) return;

  popupTitle.textContent = title;
  popupMessage.innerHTML = message;
  popupModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePopup() {
  if (!popupModal) return;

  popupModal.classList.remove("active");
  document.body.style.overflow = "";
}

if (popupClose) {
  popupClose.addEventListener("click", closePopup);
}

if (popupModal) {
  popupModal.addEventListener("click", (e) => {
    if (e.target === popupModal) closePopup();
  });
}

// ===================== SECTION INTERACTIONS =====================

document.querySelectorAll(".services-section ul li").forEach(item => {
  item.addEventListener("click", () => {

    // 🚫 Ignore custom modal links
    if (
      item.id === "pastTicketsLink" ||
      item.id === "assignedLink" ||
      item.id === "reportsLink" ||
      item.id === "emailSectionLink"
    ) return;

    const sectionTitle =
      item.closest(".services-section").querySelector("h2").textContent;

    const message =
      item.getAttribute("data-message") ||
      `You selected "${item.textContent}" under ${sectionTitle}.`;

    openPopup(sectionTitle, message);
  });
});

// Expand/Collapse
document.querySelectorAll(".services-section h2").forEach(header => {
  header.addEventListener("dblclick", () => {
    const list = header.nextElementSibling;
    list.style.display =
      list.style.display === "none" ? "block" : "none";
  });
});

// ===================== BUTTON ACTIONS =====================

if (popupMessage) {
  popupMessage.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      alert(`Action triggered: ${e.target.textContent.trim()}`);
    }
  });

  popupMessage.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Form submitted successfully!");
  });
}

// ===================== SIDEBAR POPUPS =====================

function setupSidebarPopup(linkId, modalId, backdropId, closeId) {
  const link = document.getElementById(linkId);
  const modal = document.getElementById(modalId);
  const backdrop = document.getElementById(backdropId);
  const closeBtn = document.getElementById(closeId);

  if (!link || !modal || !backdrop) return;

  link.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("active");
    backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  function closeModal() {
    modal.classList.remove("active");
    backdrop.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
}

// Assigned
setupSidebarPopup(
  "assignedLink",
  "assignedModal",
  "assignedBackdrop",
  "assignedClose"
);

// Past Tickets
setupSidebarPopup(
  "pastTicketsLink",
  "pastModal",
  "pastBackdrop",
  "pastClose"
);

// Reports
setupSidebarPopup(
  "reportsLink",
  "reportsModal",
  "reportsBackdrop",
  "reportsClose"
);

// Email
setupSidebarPopup(
  "emailSectionLink",
  "emailModal",
  "emailBackdrop",
  "emailClose"
);

// ===================== HAMBURGER =====================

const hamburger = document.querySelector(".hamburger");
const sidebar = document.querySelector(".sidebar");
const mainContent = document.querySelector("main");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("closed");
    hamburger.classList.toggle("open");
    mainContent.classList.toggle("sidebar-open");
  });
}

// ===================== SIGNOUT =====================

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

if (cancelSignout) {
  cancelSignout.addEventListener("click", () => {
    signoutPopup.classList.add("hidden");
  });
}

if (confirmSignout) {
  confirmSignout.addEventListener("click", () => {
    window.location.href = "login.html";
  });
}

// ================== ASSIGNED TICKETS TABLE ==================

const assignedTable = document.querySelector(".assigned-table");

if (assignedTable) {
  assignedTable.addEventListener("click", (e) => {
    if (e.target.classList.contains("resolve-btn")) {
      const row = e.target.closest("tr");
      const statusDropdown = row.querySelector(".status-dropdown");

      if (statusDropdown) {
        statusDropdown.value = "Resolved";
        statusDropdown.classList.add("status-resolved");
      }

      e.target.disabled = true;
      e.target.textContent = "Done";
    }
  });
}

// Status color change
document.addEventListener("change", function (e) {
  if (e.target.classList.contains("status-dropdown")) {
    if (e.target.value === "Resolved") {
      e.target.classList.add("status-resolved");
    } else {
      e.target.classList.remove("status-resolved");
    }
  }
});