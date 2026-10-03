import express from "express";

import {
    login,
    logout,
    forgotPassword,
    resetPassword,
} from "../controller/authController.js";

import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

// Login
router.post("/login", login);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);

// Logout
router.post("/logout", checkToken, logout);

export default router;