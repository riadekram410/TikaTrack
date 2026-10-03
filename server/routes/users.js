import express from "express";

import {
  createUser,
  getProfile,
  updateProfile,
  changePassword,
} from "../controller/userController.js";

import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

// Register
router.post("/", createUser);

// Load profile
router.get("/profile", checkToken, getProfile);

// Save personal details
router.put("/profile", checkToken, updateProfile);

// Change password
router.put("/change-password", checkToken, changePassword);

export default router;