import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import "dotenv/config";

import userRoutes from "./routes/users.js";
import authRouter from "./routes/auth.js";
import childRoutes from "./routes/children.js";
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use(cookieParser());

app.use(
    cors({
        credentials: true,
        origin: process.env.ALLOWED_ORIGIN,
    })
);

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log(`Error connecting to MongoDB: ${err}`);
        process.exit(1);
    }
};

connectDB();

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "TikaTrack API is running!"
    });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRouter);
app.use("/api/children", childRoutes);
// Start server
app.listen(PORT, () => {
    console.log(
        `TikaTrack server running on http://localhost:${PORT}`
    );
});