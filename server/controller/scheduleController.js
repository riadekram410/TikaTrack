import Schedule from "../model/schedule.js";
import Child from "../model/child.js";
import { generateVaccineSchedule } from "../utils/vaccineSchedule.js";

export const generateSchedulesForExistingChildren = async (req, res) => {
    try {
        const children = await Child.find({
            userId: req.user.id,
        });

        if (children.length === 0) {
            return res.status(404).json({
                error: "No children found",
            });
        }

        let createdCount = 0;
        let skippedCount = 0;

        for (const child of children) {
            const existingSchedules = await Schedule.countDocuments({
                childId: child._id,
            });

            if (existingSchedules > 0) {
                skippedCount++;
                continue;
            }

            const vaccineSchedule = generateVaccineSchedule(
                child.dateOfBirth,
                child._id
            );

            await Schedule.insertMany(vaccineSchedule);

            createdCount += vaccineSchedule.length;
        }

        return res.status(201).json({
            message: "Vaccine schedules generated successfully",
            childrenProcessed: children.length,
            schedulesCreated: createdCount,
            childrenSkipped: skippedCount,
        });

    } catch (err) {
        console.log(
            `Error generating existing schedules: ${err}`
        );

        return res.status(500).json({
            error: "Server error",
        });
    }
};

export const createSchedule = async (req, res) => {
    try {
        const {
            childId,
            name,
            description,
            dose,
            date,
            status,
        } = req.body;

        if (
            !childId ||
            !name ||
            !description ||
            !dose ||
            !date
        ) {
            return res.status(400).json({
                error: "Child, vaccine name, description, dose and date are required",
            });
        }

        const child = await Child.findOne({
            _id: childId,
            userId: req.user.id,
        });

        if (!child) {
            return res.status(404).json({
                error: "Child not found",
            });
        }

        const schedule = new Schedule({
            childId,
            name,
            description,
            dose,
            date,
            status: status || "Upcoming",
        });

        await schedule.save();

        return res.status(201).json({
            message: "Schedule created successfully",
            schedule,
        });
    } catch (err) {
        console.log(`Error creating schedule: ${err}`);

        return res.status(500).json({
            error: "Server error",
        });
    }
};


export const getSchedules = async (req, res) => {
    try {
        const children = await Child.find({
            userId: req.user.id,
        }).select("_id");

        const childIds = children.map(
            (child) => child._id
        );

        const schedules = await Schedule.find({
            childId: { $in: childIds },
        })
            .populate("childId", "name")
            .sort({ date: 1 });

        return res.status(200).json({
            schedules,
        });
    } catch (err) {
        console.log(`Error getting schedules: ${err}`);

        return res.status(500).json({
            error: "Server error",
        });
    }
};
export const getSchedule = async (req, res) => {
    try {
        const children = await Child.find({
            userId: req.user.id,
        }).select("_id");

        const childIds = children.map(
            (child) => child._id
        );

        const schedule = await Schedule.findOne({
            _id: req.params.id,
            childId: { $in: childIds },
        }).populate("childId", "name");

        if (!schedule) {
            return res.status(404).json({
                error: "Schedule not found",
            });
        }

        return res.status(200).json({
            schedule,
        });
    } catch (err) {
        console.log(`Error getting schedule: ${err}`);

        return res.status(500).json({
            error: "Server error",
        });
    }
};


export const updateSchedule = async (req, res) => {
    try {
        const children = await Child.find({
            userId: req.user.id,
        }).select("_id");

        const childIds = children.map(
            (child) => child._id
        );

        const schedule = await Schedule.findOne({
            _id: req.params.id,
            childId: { $in: childIds },
        });

        if (!schedule) {
            return res.status(404).json({
                error: "Schedule not found",
            });
        }

        const {
            name,
            description,
            dose,
            date,
            status,
        } = req.body;

        schedule.name = name ?? schedule.name;
        schedule.description =
            description ?? schedule.description;
        schedule.dose = dose ?? schedule.dose;
        schedule.date = date ?? schedule.date;
        schedule.status = status ?? schedule.status;

        await schedule.save();

        return res.status(200).json({
            message: "Schedule updated successfully",
            schedule,
        });
    } catch (err) {
        console.log(`Error updating schedule: ${err}`);

        return res.status(500).json({
            error: "Server error",
        });
    }
};


export const deleteSchedule = async (req, res) => {
    try {
        const children = await Child.find({
            userId: req.user.id,
        }).select("_id");

        const childIds = children.map(
            (child) => child._id
        );

        const schedule = await Schedule.findOneAndDelete({
            _id: req.params.id,
            childId: { $in: childIds },
        });

        if (!schedule) {
            return res.status(404).json({
                error: "Schedule not found",
            });
        }

        return res.status(200).json({
            message: "Schedule deleted successfully",
        });
    } catch (err) {
        console.log(`Error deleting schedule: ${err}`);

        return res.status(500).json({
            error: "Server error",
        });
    }
};