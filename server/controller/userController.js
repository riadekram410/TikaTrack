import User from "../model/user.js";
import Child from "../model/child.js";
import Schedule from "../model/schedule.js";

import {
  hashPassword,
  comparePassword,
} from "../utils/helpers.js";

// =====================================================
// CREATE USER
// =====================================================

export const createUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

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

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Error creating user:", err);

    if (err.code === 11000) {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

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
      "-resetPasswordToken",
      "-resetPasswordExpires",
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
    console.error("Error getting profile:", err);

    return res.status(500).json({
      error: "Unable to load profile",
    });
  }
};

// =====================================================
// UPDATE PROFILE
// =====================================================

export const updateProfile = async (req, res) => {
  try {
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        error: "Profile details are required",
      });
    }

    const updates = {};

    // Only these personal details can be updated.
    for (const field of ["name", "email", "phone"]) {
      if (Object.hasOwn(body, field)) {
        if (typeof body[field] !== "string") {
          return res.status(400).json({
            error: `${field} must be text`,
          });
        }

        updates[field] = body[field].trim();
      }
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        error: "No editable profile details provided",
      });
    }

    if (
      updates.name !== undefined &&
      (!updates.name || updates.name.length > 200)
    ) {
      return res.status(400).json({
        error: "Name is required and must be 200 characters or fewer",
      });
    }

    if (updates.email !== undefined) {
      updates.email = updates.email.toLowerCase();

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        updates.email.length > 254 ||
        !emailPattern.test(updates.email)
      ) {
        return res.status(400).json({
          error: "Enter a valid email address",
        });
      }
    }

    if ((updates.phone?.length ?? 0) > 50) {
      return res.status(400).json({
        error: "Phone must be 50 characters or fewer",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: updates,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select([
      "-password",
      "-__v",
      "-resetPasswordToken",
      "-resetPasswordExpires",
    ]);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Please check your profile details",
      });
    }

    console.error("Error updating profile:", err);

    return res.status(500).json({
      error: "Unable to save profile",
    });
  }
};

// =====================================================
// CHANGE PASSWORD
// =====================================================

export const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body || {};

    if (
      typeof currentPassword !== "string" ||
      !currentPassword ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return res.status(400).json({
        error: "All password fields are required",
      });
    }

    if (
      newPassword.length < 8 ||
      Buffer.byteLength(newPassword, "utf8") > 72
    ) {
      return res.status(400).json({
        error:
          "New password must have at least 8 characters and at most 72 UTF-8 bytes",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: "New passwords do not match",
      });
    }

    // Get the user identified by the verified login token.
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Check the current password.
    const currentPasswordCorrect = await comparePassword(
      currentPassword,
      user.password
    );

    if (!currentPasswordCorrect) {
      return res.status(400).json({
        error: "Current password is incorrect",
      });
    }

    // Prevent choosing the same password again.
    const samePassword = await comparePassword(
      newPassword,
      user.password
    );

    if (samePassword) {
      return res.status(400).json({
        error: "Choose a different new password",
      });
    }

    // Hash the new password before storing it.
    const hashedPassword = await hashPassword(newPassword);

    const result = await User.updateOne(
      {
        _id: req.user.id,
        password: user.password,
      },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      },
      {
        runValidators: true,
      }
    );

    if (result.modifiedCount !== 1) {
      return res.status(409).json({
        error:
          "Password changed in another request. Try again with your current password",
      });
    }

    return res.status(200).json({
      message:
        "Password changed successfully. Use your new password next time you log in.",
    });
  } catch (err) {
    console.error("Error changing password:", err.name);

    return res.status(500).json({
      error: "Unable to change password",
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
        vaccinationReminders: user.vaccinationReminders,
        emailNotifications: user.emailNotifications,
        overdueAlerts: user.overdueAlerts,
        reminderDays: user.reminderDays,
      },
    });
  } catch (err) {
    console.error("Error getting settings:", err);

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
    const selectedReminderDays = Number(reminderDays);

    if (!allowedReminderDays.includes(selectedReminderDays)) {
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
        vaccinationReminders: user.vaccinationReminders,
        emailNotifications: user.emailNotifications,
        overdueAlerts: user.overdueAlerts,
        reminderDays: user.reminderDays,
      },
    });
  } catch (err) {
    console.error("Error updating settings:", err);

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

    const children = await Child.find({
      userId,
    }).select("_id");

    const childIds = children.map((child) => child._id);

    // Delete the user's children's vaccination schedules.
    if (childIds.length > 0) {
      await Schedule.deleteMany({
        childId: {
          $in: childIds,
        },
      });
    }

    // Delete the user's children.
    await Child.deleteMany({
      userId,
    });

    // Delete the user.
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Clear the login cookie.
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
    console.error("Error deleting account:", err);

    return res.status(500).json({
      error: "Server error",
    });
  }
};