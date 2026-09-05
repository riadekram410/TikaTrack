import User from "../model/user.js";
import { comparePassword } from "../utils/helpers.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        // Email or phone and password are required
        if ((!email && !phone) || !password) {
            return res.status(400).json({
                error: "Email or phone and password are required",
            });
        }

        // Find user by email or phone
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

        // Compare entered password with hashed password
        const passwordMatch = await comparePassword(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid email/phone or password",
            });
        }

        // Create JWT
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

        // Store JWT in HttpOnly cookie
        res.cookie("token", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });

        // Never send password to frontend
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
export const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
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