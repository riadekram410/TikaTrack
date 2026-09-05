import express from "express";
import {
    createUser,
    getProfile,
} from "../controller/userController.js";
import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

// Register
router.post("/", createUser);

// Protected profile
router.get("/profile", checkToken, getProfile);

export default router;