import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        // ================= SETTINGS =================

        vaccinationReminders: {
            type: Boolean,
            default: true,
        },

        emailNotifications: {
            type: Boolean,
            default: true,
        },

        overdueAlerts: {
            type: Boolean,
            default: true,
        },

        reminderDays: {
            type: Number,
            enum: [1, 2, 3, 7],
            default: 3,
        },

        // ================= PASSWORD RESET =================

        resetPasswordToken: {
            type: String,
            default: null,
        },

        resetPasswordExpires: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const User = model("User", userSchema);

export default User;