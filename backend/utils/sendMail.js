import axios from "axios";

export const sendResetEmail = async (to, resetLink) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.SMTP_FROM,
          name: "Your App Name",
        },
        to: [{ email: to }],
        subject: "Reset Your Password",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password.</p>
            <p>Click the button below to reset your password:</p>
            
            <a href="${resetLink}" 
               style="
                 display:inline-block;
                 padding:12px 20px;
                 background-color:#4CAF50;
                 color:white;
                 text-decoration:none;
                 border-radius:5px;
                 margin-top:10px;
               ">
               Reset Password
            </a>

            <p style="margin-top:20px;">
              This link will expire in 15 minutes.
            </p>

            <p>If you did not request this, please ignore this email.</p>
          </div>
        `,
      },
      {
        headers: {
          "api-key": process.env.SMTP_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    return true;
  } catch (error) {
    console.error(
      "Brevo API Error:",
      error.response ? error.response.data : error.message,
    );
    return false;
  }
};

export const sendTicketEmail = async (recipientRole, ticketData) => {
  try {
    // Map role to email
    const roleEmailMap = {
      manager: process.env.MANAGER_EMAIL,
      techie: process.env.TECHIE_EMAIL,
      supportLead: process.env.SUPPORT_LEAD_EMAIL,
      admin: process.env.ADMIN_EMAIL,
    };

    const toEmail = roleEmailMap[recipientRole];

    if (!toEmail) {
      throw new Error("Invalid recipient role selected");
    }

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.SMTP_FROM,
          name: "Support Desk",
        },
        to: [{ email: toEmail }],
        subject: `New Support Ticket - ${ticketData.ticketId}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>New Support Ticket Created</h2>

            <p><strong>Ticket ID:</strong> ${ticketData.ticketId}</p>
            <p><strong>Order ID:</strong> ${ticketData.orderId || "N/A"}</p>
            <p><strong>Subject:</strong> ${ticketData.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${ticketData.message}</p>

            <hr />
            <p>Status: ${ticketData.status}</p>
            <p>Created At: ${new Date().toLocaleString()}</p>
          </div>
        `,
      },
      {
        headers: {
          "api-key": process.env.SMTP_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    return true;
  } catch (error) {
    console.error(
      "Ticket Email Error:",
      error.response ? error.response.data : error.message,
    );
    return false;
  }
};
