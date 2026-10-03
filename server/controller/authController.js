import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../model/user.js";
import {
    comparePassword,
    hashPassword,
} from "../utils/helpers.js";

import { sendPasswordResetEmail } from "../utils/email.js";


// =====================================================
// LOGIN
// =====================================================

export const login = async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        if ((!email && !phone) || !password) {
            return res.status(400).json({
                error: "Email or phone and password are required",
            });
        }

        const user = await User.findOne(
            email
                ? { email: email.toLowerCase() }
                : { phone }
        );

        if (!user) {
            return res.status(401).json({
                error: "Invalid email/phone or password",
            });
        }

        const passwordMatch = await comparePassword(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid email/phone or password",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        res.cookie("token", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    } catch (err) {
        console.log(`Error logging in: ${err}`);

        return res.status(500).json({
            error: "Server error",
        });
    }
};


// =====================================================
// LOGOUT
// =====================================================

export const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });

        return res.status(200).json({
            message: "Logout successful",
        });
    } catch (err) {
        console.log(`Error logging out: ${err}`);

        return res.status(500).json({
            error: "Server error",
        });
    }
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: "Email is required",
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        // Do not reveal whether the email exists
        if (!user) {
            return res.status(200).json({
                message:
                    "If the email exists, a password reset link has been sent.",
            });
        }

        // Generate random reset token
        const resetToken = crypto
            .randomBytes(32)
            .toString("hex");

        // Save token
        user.resetPasswordToken = resetToken;

        // Token expires after 15 minutes
        user.resetPasswordExpires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await user.save();

        // Create reset link
        const resetLink =
            `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        // Send email
        await sendPasswordResetEmail(
            user.email,
            resetLink
        );

        return res.status(200).json({
            message:
                "If the email exists, a password reset link has been sent.",
        });
    } catch (err) {
        console.log(
            `Error sending password reset email: ${err}`
        );

        return res.status(500).json({
            error: "Unable to send password reset email",
        });
    }
};


// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                error: "Token and new password are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "Password must be at least 6 characters",
            });
        }

        // Find user with valid and non-expired token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {
                $gt: new Date(),
            },
        });

        if (!user) {
            return res.status(400).json({
                error: "Invalid or expired reset link",
            });
        }

        // Hash new password
        user.password = await hashPassword(password);

        // Remove reset token
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully",
        });
    } catch (err) {
        console.log(
            `Error resetting password: ${err}`
        );

        return res.status(500).json({
            error: "Unable to reset password",
        });
    }
};