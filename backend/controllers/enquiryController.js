import enquiryModel from "../models/enquiryModel.js";
import userModel from "../models/userModel.js";
import { sendTicketEmail } from "../utils/sendMail.js";

/* ================= CREATE ENQUIRY ================= */
export const createEnquiryController = async (req, res) => {
  try {
    const { orderId, sendTo, subject, message } = req.body;

    if (!orderId || !sendTo || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const ticketId = "TICKET-" + Date.now();

    const newEnquiry = new enquiryModel({
      userId: req.user._id,
      orderId,
      sendTo,
      subject,
      message,
      ticketId,
    });

    await newEnquiry.save();
    await sendTicketEmail(sendTo, newEnquiry);

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully & email sent",
      data: newEnquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE STATUS ================= */
export const updateEnquiryStatusController = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const enquiry = await enquiryModel.findOneAndUpdate(
      { ticketId, userId: req.user._id },
      { status },
      { new: true },
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ENQUIRIES BY USER EMAIL ================= */
export const getUserEnquiriesController = async (req, res) => {
  try {
    const enquiries = await enquiryModel
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET USER STATS ================= */
export const getGlobalStatsController = async (req, res) => {
  try {
    const totalTickets = await enquiryModel.countDocuments();

    const resolvedTickets = await enquiryModel.countDocuments({
      status: "Resolved",
    });

    const closedTickets = await enquiryModel.countDocuments({
      status: "Closed",
    });

    res.status(200).json({
      success: true,
      data: {
        totalTickets,
        resolvedTickets,
        closedTickets,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
