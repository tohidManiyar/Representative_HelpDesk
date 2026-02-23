import express from "express";
const route = express.Router();

import {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/userController.js";

/* ================= REGISTER ================= */
route.post("/register", registerController);

/* ================= LOGIN ================= */
route.post("/login", loginController);

/* ================= FORGOT PASSWORD ================= */
route.post("/forgot-password", forgotPasswordController);

/* ================= RESET PASSWORD ================= */
route.post("/reset-password/:token", resetPasswordController);

export default route;
