
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import "dotenv/config";
import dns from "dns";

import userRoutes from "./routes/users.js";
import authRouter from "./routes/auth.js";
import childRoutes from "./routes/children.js";
import scheduleRoutes from "./routes/schedules.js";
import carbonFootprint from "./middlewares/carbonFootprint.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    await mongoose.connect(process.env.DATABASE_URL, {
        serverSelectionTimeoutMS: 10000,
    });

    console.log("Connected to MongoDB");
};

// Basic middleware
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        credentials: true,
        origin: process.env.ALLOWED_ORIGIN,
    })
);

// Database middleware
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);

        return res.status(503).json({
            error: "Database unavailable. Please try again.",
        });
    }
});

// Carbon footprint tracking
app.use(carbonFootprint);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "TikaTrack API is running!",
    });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRouter);
app.use("/api/children", childRoutes);
app.use("/api/schedules", scheduleRoutes);

// Start server
app.listen(PORT, () => {
    console.log(
        `TikaTrack server running on http://localhost:${PORT}`
    );
});
