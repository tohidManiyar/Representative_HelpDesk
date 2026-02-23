import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    orderId: { type: String, required: true },
    sendTo: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    ticketId: { type: String, required: true },
    status: { type: String, default: "submitted" },
  },
  {
    timestamps: true,
  },
);

const enquiry = mongoose.model("enquiry", enquirySchema);
export default enquiry;
