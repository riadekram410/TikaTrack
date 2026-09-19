import { Schema, model } from "mongoose";

const scheduleSchema = new Schema(
    {
        childId: {
            type: Schema.Types.ObjectId,
            ref: "Child",
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        dose: {
            type: String,
            required: true,
            trim: true,
        },

        date: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["Completed", "Upcoming", "Overdue"],
            default: "Upcoming",
        },
    },
    {
        timestamps: true,
    }
);

const Schedule = model("Schedule", scheduleSchema);

export default Schedule;