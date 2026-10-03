import User from "../model/user.js";
import {
  hashPassword,
  comparePassword,
} from "../utils/helpers.js";

// Register a user
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

// Load the logged-in user's profile
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

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error getting profile:", err);

    return res.status(500).json({
      error: "Unable to load profile",
    });
  }
};

// Update personal details
export const updateProfile = async (req, res) => {
  try {
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        error: "Profile details are required",
      });
    }

    const updates = {};

    // Address and password cannot be changed through this endpoint.
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
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select(["-password", "-__v"]);

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

// Change the logged-in user's password
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

    // bcrypt supports a maximum of 72 password bytes.
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

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const currentPasswordCorrect = await comparePassword(
      currentPassword,
      user.password
    );

    if (!currentPasswordCorrect) {
      return res.status(400).json({
        error: "Current password is incorrect",
      });
    }

    const samePassword = await comparePassword(
      newPassword,
      user.password
    );

    if (samePassword) {
      return res.status(400).json({
        error: "Choose a different new password",
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    // The password must still match the one we just verified.
    const result = await User.updateOne(
      {
        _id: req.user.id,
        password: user.password,
      },
      {
        $set: {
          password: hashedPassword,
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