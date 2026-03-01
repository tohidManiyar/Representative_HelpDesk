import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendResetEmail } from "../utils/sendMail.js";

/* ================= REGISTER ================= */
export const registerController = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      id,
      phone,
      shift,
      address,
      city,
      state,
    } = req.body;

    const exists = await userModel.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email: email.toLowerCase(),
      password: hashPassword,
      role,
      id,
      phone,
      shift,
      address,
      city,
      state,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registered successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= LOGIN ================= */
export const loginController = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password!",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const { password: _, ...userData } = user._doc;

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `https://representativehelpdesk.netlify.app/forgot.html?token=${resetToken}`;

    // You can modify sendMail function to send link instead of OTP
    await sendResetEmail(email, resetLink);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to email",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashPassword = await bcrypt.hash(newPassword, 10);

    await userModel.findByIdAndUpdate(decoded.userId, {
      password: hashPassword,
    });

    res.status(200).json({
      success: true,
      message: "Password reset successfully!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
