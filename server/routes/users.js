import express from "express";

import {
  createUser,
  getProfile,
  updateProfile,
  changePassword,
  getSettings,
  updateSettings,
  deleteAccount,
} from "../controller/userController.js";

import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

// Register
router.post("/", createUser);

// Get profile
router.get("/profile", checkToken, getProfile);

// Update profile
router.put("/profile", checkToken, updateProfile);

// Change password
router.put("/change-password", checkToken, changePassword);

// Get settings
router.get("/settings", checkToken, getSettings);

// Update settings
router.put("/settings", checkToken, updateSettings);

// Delete account
router.delete("/account", checkToken, deleteAccount);

export default router;