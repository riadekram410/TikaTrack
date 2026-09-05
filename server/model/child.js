import { Schema, model } from "mongoose";

const childSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        dateOfBirth: {
            type: Date,
            required: true,
        },

        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female", "Other"],
        },

        bloodGroup: {
            type: String,
            trim: true,
        },

        guardian: {
            type: String,
            required: true,
            trim: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Child = model("Child", childSchema);

export default Child;