import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth.route";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO as string);

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});

mongoose.connection.on("error", (error) => {
  console.log("Connection Error:", error);
});

// Server listening
app.listen(3000, () => {
  console.log("Server is running on port 3000!!");
});

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/server/auth", authRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
