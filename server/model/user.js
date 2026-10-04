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

        resetPasswordToken: {
            type: String,
            default: null,
            select: false,
        },

        resetPasswordExpires: {
            type: Date,
            default: null,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = model("User", userSchema);

export default User;