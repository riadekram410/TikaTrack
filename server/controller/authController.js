import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../model/user.js";
import {
    comparePassword,
    hashPassword,
} from "../utils/helpers.js";

import { sendPasswordResetEmail } from "../utils/email.js";

const RESET_MESSAGE =
    "If the email exists, a password reset link has been sent.";

const INVALID_LINK =
    "Invalid or expired reset link. Please request a new link.";

const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

// LOGIN
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
        console.error("Login failed:", err.name);

        return res.status(500).json({
            error: "Server error",
        });
    }
};

// LOGOUT
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
        console.error("Logout failed:", err.name);

        return res.status(500).json({
            error: "Server error",
        });
    }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
    let savedToken;
    let userId;

    try {
        const email = req.body?.email;

        if (typeof email !== "string" || !email.trim()) {
            return res.status(400).json({
                error: "Email is required",
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        });

        // Keep the response the same for unknown email addresses.
        if (!user) {
            return res.status(200).json({
                message: RESET_MESSAGE,
            });
        }

        // This must point to your frontend.
        const clientUrl = new URL(process.env.CLIENT_URL);

        if (!["http:", "https:"].includes(clientUrl.protocol)) {
            throw new Error("Invalid CLIENT_URL");
        }

        const token = crypto.randomBytes(32).toString("hex");

        // Email the original token; store only its hash.
        savedToken = hashToken(token);
        userId = user._id;

        const expires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        const result = await User.updateOne(
            {
                _id: userId,
            },
            {
                $set: {
                    resetPasswordToken: savedToken,
                    resetPasswordExpires: expires,
                },
            },
            {
                runValidators: true,
            }
        );

        // Confirm MongoDB saved both values before sending email.
        const persisted =
            result.matchedCount === 1 &&
            await User.exists({
                _id: userId,
                resetPasswordToken: savedToken,
                resetPasswordExpires: expires,
            });

        if (!persisted) {
            throw new Error(
                "Reset token persistence check failed"
            );
        }

        const resetLink = new URL(
            `/reset-password/${token}`,
            clientUrl
        ).href;

        await sendPasswordResetEmail(
            user.email,
            resetLink
        );

        return res.status(200).json({
            message: RESET_MESSAGE,
        });
    } catch (err) {
        // Clear this failed request without deleting a newer token.
        if (userId && savedToken) {
            try {
                await User.updateOne(
                    {
                        _id: userId,
                        resetPasswordToken: savedToken,
                    },
                    {
                        $set: {
                            resetPasswordToken: null,
                            resetPasswordExpires: null,
                        },
                    }
                );
            } catch {
                console.error(
                    "Unable to clear failed password reset request"
                );
            }
        }

        console.error(
            "Password reset email failed:",
            err.name
        );

        return res.status(500).json({
            error:
                "Unable to create or send the reset link. Please try again.",
        });
    }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body || {};

        if (
            typeof token !== "string" ||
            !/^[a-f0-9]{64}$/i.test(token)
        ) {
            return res.status(400).json({
                error: INVALID_LINK,
            });
        }

        if (
            typeof password !== "string" ||
            password.length < 8 ||
            Buffer.byteLength(password, "utf8") > 72
        ) {
            return res.status(400).json({
                error:
                    "Password must contain at least 8 characters and at most 72 UTF-8 bytes.",
            });
        }

        // Use the same hashing method used when saving the token.
        const tokenHash = hashToken(token);

        const validToken = () => ({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: {
                $gt: new Date(),
            },
        });

        const exists = await User.exists(validToken());

        if (!exists) {
            return res.status(400).json({
                error: INVALID_LINK,
            });
        }

        const hashedPassword = await hashPassword(password);

        // Update the password and consume the token in one operation.
        // Rechecking the token prevents reuse and concurrent resets.
        const result = await User.updateOne(
            validToken(),
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
            return res.status(400).json({
                error: INVALID_LINK,
            });
        }

        return res.status(200).json({
            message: "Password reset successfully",
        });
    } catch (err) {
        console.error(
            "Password reset failed:",
            err.name
        );

        return res.status(500).json({
            error: "Unable to reset password",
        });
    }
};