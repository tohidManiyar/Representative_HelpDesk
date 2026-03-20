const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");

if (!token || !userData) {
  alert("You have not logged in.");
  window.location.href = "login.html";
}

const user = JSON.parse(userData);

document.getElementById("repName").textContent = user.name || "-";
document.getElementById("repRole").textContent = user.role || "-";
document.getElementById("repId").textContent = user.id || "-";
document.getElementById("repEmail").textContent = user.email || "-";
document.getElementById("repPhone").textContent = user.phone || "-";
document.getElementById("repShift").textContent = user.shift
  ? user.shift.charAt(0).toUpperCase() + user.shift.slice(1)
  : "-";

document.getElementById("repLocation").textContent =
  user.city && user.state ? `${user.city}, ${user.state}` : "-";
// ================== SIDEBAR TOGGLE ==================
const hamburgerBtn = document.getElementById("hamburger");
const sidebarEl = document.querySelector(".sidebar");
const mainEl = document.querySelector("main");

if (hamburgerBtn && sidebarEl && mainEl) {
  hamburgerBtn.addEventListener("click", () => {
    sidebarEl.classList.toggle("closed");
    hamburgerBtn.classList.toggle("open");
    mainEl.classList.toggle("sidebar-open");
  });
}

// ===================== POPUP SYSTEM =====================

function openPopup(modalId, backdropId) {
  const modal = document.getElementById(modalId);
  const backdrop = document.getElementById(backdropId);

  if (modal && backdrop) {
    modal.classList.add("active");
    backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closePopup(modalId, backdropId) {
  const modal = document.getElementById(modalId);
  const backdrop = document.getElementById(backdropId);

  if (modal && backdrop) {
    modal.classList.remove("active");
    backdrop.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function setupPopup(linkId, modalId, backdropId, closeId) {
  const link = document.getElementById(linkId);
  const closeBtn = document.getElementById(closeId);
  const backdrop = document.getElementById(backdropId);

  if (link) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openPopup(modalId, backdropId);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closePopup(modalId, backdropId);
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        closePopup(modalId, backdropId);
      }
    });
  }
}

// ===================== CONNECT SIDEBAR POPUPS =====================

setupPopup(
  "assignedLink",
  "assignedModal",
  "assignedBackdrop",
  "assignedClose",
);
setupPopup("reportsLink", "reportsModal", "reportsBackdrop", "reportsClose");
setupPopup("emailSectionLink", "emailModal", "emailBackdrop", "emailClose");

// ===================== ASSIGNED TABLE ACTION =====================

const assignedTable = document.querySelector(".assigned-table");

if (assignedTable) {
  assignedTable.addEventListener("click", async (e) => {
    if (e.target.classList.contains("resolve-btn")) {
      const ticketId = e.target.dataset.ticket;
      const row = e.target.closest("tr");
      const statusDropdown = row.querySelector(".status-dropdown");
      const newStatus = statusDropdown.value;

      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are not logged in.");
        window.location.href = "login.html";
        return;
      }

      try {
        const response = await fetch(
          `https://representative-helpdesk-3alv.onrender.com/api/enquiry/update-status/${ticketId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: newStatus }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          alert("Status updated successfully ✅");
          loadAssignedTickets();
        } else {
          alert(data.message || "Failed to update status");
        }
      } catch (error) {
        console.error("Update Error:", error);
        alert("Server Error");
      }
    }
  });
}

// ===================== EMAIL FORM =====================

document.getElementById("emailForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("customerEmail").value.trim();
  const message = document.getElementById("emailMessage").value.trim();

  if (!email || !message) {
    alert("Please complete the email form.");
    return;
  }

  alert(`Email sent successfully ✅\n\nTo: ${email}\nMessage: ${message}`);

  e.target.reset();
});

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
signoutLink.addEventListener("click", (e) => {
  e.preventDefault();
  signoutPopup.classList.remove("hidden");
});

cancelSignout.addEventListener("click", () => {
  signoutPopup.classList.add("hidden");
});

confirmSignout.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
});

//  ===================== LOAD ASSIGNED TICKETS =====================
const tableBody = document.getElementById("assignedTableBody");

async function loadAssignedTickets() {
  if (!token) {
    alert("You are not logged in.");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("https://representative-helpdesk-3alv.onrender.com/api/enquiry/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      tableBody.innerHTML = `<tr><td colspan="8">${data.message || "No tickets found"}</td></tr>`;
      return;
    }

    const tickets = data.data || [];

    if (tickets.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8">No tickets found</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";

    tickets.forEach((ticket) => {
      const row = `
        <tr>
          <td>${ticket.orderId || "-"}</td>
          <td>${ticket.sendTo || "-"}</td>
          <td>${ticket.subject || "-"}</td>
          <td>${ticket.message || "-"}</td>
          <td>${ticket.ticketId || "-"}</td>
          <td>
            <select class="status-dropdown">
              <option ${ticket.status === "submitted" ? "selected" : ""}>submitted</option>
              <option ${ticket.status === "In Progress" ? "selected" : ""}>In Progress</option>
              <option ${ticket.status === "Resolved" ? "selected" : ""}>Resolved</option>
              <option ${ticket.status === "Closed" ? "selected" : ""}>Closed</option>
            </select>
          </td>
          <td>
          <button class="resolve-btn" data-ticket="${ticket.ticketId}">
            Save
          </button>
        </td>
        </tr>
      `;

      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Assigned Tickets Error:", error);
    tableBody.innerHTML = `<tr><td colspan="8">Server Error</td></tr>`;
  }
}

loadAssignedTickets();

//  ===================== SUBMIT QUICK ENQUIRY =====================

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("quickEnquiryForm")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const orderId = document.getElementById("orderId").value.trim();
      const sendTo = document.getElementById("recipient").value;
      const subject = document.getElementById("enquirySubject").value.trim();
      const message = document.getElementById("enquiryMessage").value.trim();

      console.log({ orderId, sendTo, subject, message });

      if (!orderId || !sendTo || !subject || !message) {
        alert("Please fill all fields.");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are not logged in.");
        window.location.href = "login.html";
        return;
      }

      try {
        const response = await fetch(
          "https://representative-helpdesk-3alv.onrender.com/api/enquiry/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              orderId,
              sendTo,
              subject,
              message,
            }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          alert("Enquiry submitted successfully ✅");
          e.target.reset();
          loadAssignedTickets();
        } else {
          alert(data.message || "Failed to submit enquiry.");
        }
      } catch (error) {
        console.error("Enquiry Error:", error);
        alert("Server Error");
      }
    });
});

//  ===================== LOAD USER STATS =====================

async function loadUserStats() {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const response = await fetch("https://representative-helpdesk-3alv.onrender.com/api/enquiry/stats", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("emailsSent").textContent =
        data.data.totalTickets || 0;

      document.getElementById("solvedQueries").textContent =
        data.data.resolvedTickets || 0;

      document.getElementById("ticketsClosed").textContent =
        data.data.closedTickets || 0;
    }
  } catch (error) {
    console.error("Stats Error:", error);
  }
}

loadUserStats();
