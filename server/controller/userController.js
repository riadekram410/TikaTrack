import User from "../model/user.js";
import Child from "../model/child.js";
import Schedule from "../model/schedule.js";

import { hashPassword } from "../utils/helpers.js";


// =====================================================
// CREATE USER
// =====================================================

export const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Name, email and password are required",
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            return res.status(409).json({
                error: "Email already exists",
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = new User({
            name,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
        });

        await user.save();

        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt,
        };

        return res.status(201).json({
            message: "User registered successfully",
            user: userResponse,
        });
    } catch (err) {
        console.log(`Error creating user: ${err}`);

        return res.status(500).json({
            error: "Server error",
        });
    }
};


// =====================================================
// GET PROFILE
// =====================================================

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select([
            "-password",
            "-__v",
        ]);

        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        return res.status(200).json({
            user,
        });
    } catch (err) {
        console.log(`Error getting profile: ${err}`);

        return res.status(500).json({
            error: "Server error",
        });
    }
};


// =====================================================
// GET SETTINGS
// =====================================================

export const getSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select([
            "vaccinationReminders",
            "emailNotifications",
            "overdueAlerts",
            "reminderDays",
        ]);

        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        return res.status(200).json({
            settings: {
                vaccinationReminders:
                    user.vaccinationReminders,

                emailNotifications:
                    user.emailNotifications,

                overdueAlerts:
                    user.overdueAlerts,

                reminderDays:
                    user.reminderDays,
            },
        });
    } catch (err) {
        console.log(`Error getting settings: ${err}`);

        return res.status(500).json({
            error: "Server error",
        });
    }
};


// =====================================================
// UPDATE SETTINGS
// =====================================================

export const updateSettings = async (req, res) => {
    try {
        const {
            vaccinationReminders,
            emailNotifications,
            overdueAlerts,
            reminderDays,
        } = req.body;

        if (
            typeof vaccinationReminders !== "boolean" ||
            typeof emailNotifications !== "boolean" ||
            typeof overdueAlerts !== "boolean"
        ) {
            return res.status(400).json({
                error: "Invalid notification settings",
            });
        }

        const allowedReminderDays = [1, 2, 3, 7];

        const selectedReminderDays =
            Number(reminderDays);

        if (
            !allowedReminderDays.includes(
                selectedReminderDays
            )
        ) {
            return res.status(400).json({
                error: "Invalid reminder days",
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                vaccinationReminders,
                emailNotifications,
                overdueAlerts,
                reminderDays: selectedReminderDays,
            },
            {
                new: true,
                runValidators: true,
            }
        ).select([
            "vaccinationReminders",
            "emailNotifications",
            "overdueAlerts",
            "reminderDays",
        ]);

        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        return res.status(200).json({
            message: "Settings updated successfully",

            settings: {
                vaccinationReminders:
                    user.vaccinationReminders,

                emailNotifications:
                    user.emailNotifications,

                overdueAlerts:
                    user.overdueAlerts,

                reminderDays:
                    user.reminderDays,
            },
        });
    } catch (err) {
        console.log(`Error updating settings: ${err}`);

        return res.status(500).json({
            error: "Server error",
        });
    }
};


// =====================================================
// DELETE ACCOUNT
// =====================================================

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find all children belonging to this user
        const children = await Child.find({
            userId,
        }).select("_id");

        const childIds = children.map(
            (child) => child._id
        );

        // Delete all schedules belonging to those children
        if (childIds.length > 0) {
            await Schedule.deleteMany({
                childId: {
                    $in: childIds,
                },
            });
        }

        // Delete all children
        await Child.deleteMany({
            userId,
        });

        // Delete user
        const deletedUser =
            await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        // Clear login cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });

        return res.status(200).json({
            message:
                "Account and all associated data deleted successfully",
        });
    } catch (err) {
        console.log(`Error deleting account: ${err}`);

        return res.status(500).json({
            error: "Server error",
        });
    }
};