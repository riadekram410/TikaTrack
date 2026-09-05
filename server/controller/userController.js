import User from "../model/user.js";
import { hashPassword } from "../utils/helpers.js";

export const createUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Name, email and password are required",
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            return res.status(409).json({
                error: "Email already exists",
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const user = new User({
            name,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
        });

        await user.save();

        // Don't send password back to client
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