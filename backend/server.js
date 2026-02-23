import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./utils/db.js";
import userRoute from "./routes/userRoute.js";
import enquiryRoute from "./routes/enquiryRoute.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/enquiry", enquiryRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
