import express from "express";
const route = express.Router();
import { requireSignIn } from "../middlewares/authMiddleware.js";

import {
  createEnquiryController,
  updateEnquiryStatusController,
  getUserEnquiriesController,
  getGlobalStatsController,
} from "../controllers/enquiryController.js";

route.post("/create", requireSignIn, createEnquiryController);
route.put(
  "/update-status/:ticketId",
  requireSignIn,
  updateEnquiryStatusController,
);
route.get("/user", requireSignIn, getUserEnquiriesController);
route.get("/stats", requireSignIn, getGlobalStatsController);

export default route;
