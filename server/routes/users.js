import express from "express";

import {
    createUser,
    getProfile,
    getSettings,
    updateSettings,
    deleteAccount,
} from "../controller/userController.js";

import checkToken from "../middlewares/checkToken.js";

const router = express.Router();


// Register
router.post("/", createUser);


// Profile
router.get(
    "/profile",
    checkToken,
    getProfile
);


// Settings
router.get(
    "/settings",
    checkToken,
    getSettings
);

router.put(
    "/settings",
    checkToken,
    updateSettings
);


// Delete Account
router.delete(
    "/account",
    checkToken,
    deleteAccount
);


export default router;