import express from "express";
import {
    login,
    logout,
} from "../controller/authController.js";
import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

// Login
router.post("/login", login);

// Logout
router.post("/logout", checkToken, logout);

export default router;