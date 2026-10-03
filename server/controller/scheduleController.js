import Schedule from "../model/schedule.js";
import Child from "../model/child.js";
import { generateVaccineSchedule, computeStatus } from "../utils/vaccineSchedule.js";
import { syncScheduleStatuses } from "../utils/vaccineSummary.js";

// ======================================================
// GENERATE SCHEDULES FOR EXISTING CHILDREN
// ======================================================

export const generateSchedulesForExistingChildren = async (
    req,
    res
) => {
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

            const existingSchedules =
                await Schedule.countDocuments({
                    childId: child._id,
                });


            // যদি আগে থেকেই schedule থাকে
            // তাহলে নতুন করে generate করবে না
            if (existingSchedules > 0) {
                skippedCount++;
                continue;
            }


            const vaccineSchedule =
                generateVaccineSchedule(
                    child.dateOfBirth,
                    child._id
                );


            await Schedule.insertMany(
                vaccineSchedule
            );


            createdCount +=
                vaccineSchedule.length;
        }


        return res.status(201).json({

            message:
                "Vaccine schedules generated successfully",

            childrenProcessed:
                children.length,

            schedulesCreated:
                createdCount,

            childrenSkipped:
                skippedCount,
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


// ======================================================
// CREATE SCHEDULE
// ======================================================

export const createSchedule = async (
    req,
    res
) => {

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

                error:
                    "Child, vaccine name, description, dose and date are required",

            });
        }


        // Check child belongs to logged-in user
        const child = await Child.findOne({

            _id: childId,

            userId: req.user.id,

        });


        if (!child) {

            return res.status(404).json({
                error: "Child not found",
            });
        }


        const vaccineDate =
            new Date(date);


        let vaccineStatus;


        // যদি frontend থেকে Completed পাঠানো হয়
        // তাহলে Completed থাকবে
        if (status === "Completed") {

            vaccineStatus =
                "Completed";

        } else {

            // অন্যথায় date অনুযায়ী
            // Upcoming / Overdue
            vaccineStatus =
                vaccineDate < new Date()
                    ? "Overdue"
                    : "Upcoming";
        }


        const schedule =
            new Schedule({

                childId,

                name,

                description,

                dose,

                date: vaccineDate,

                status: vaccineStatus,

            });


        await schedule.save();


        return res.status(201).json({

            message:
                "Schedule created successfully",

            schedule,

        });


    } catch (err) {

        console.log(
            `Error creating schedule: ${err}`
        );

        return res.status(500).json({
            error: "Server error",
        });
    }
};


// ======================================================
// GET ALL SCHEDULES
// ======================================================

export const getSchedules = async (
    req,
    res
) => {

    try {

        // Logged-in user's children
        const children =
            await Child.find({

                userId:
                    req.user.id,

            }).select("_id");


        const childIds =
            children.map(
                (child) =>
                    child._id
            );


        await syncScheduleStatuses(childIds);

        const schedules =
            await Schedule.find({

                childId: {
                    $in: childIds,
                },

            })
                .populate(
                    "childId",
                    "name dateOfBirth gender"
                )
                .sort({
                    date: 1,
                });


        return res.status(200).json({

            schedules,

        });


    } catch (err) {

        console.log(
            `Error getting schedules: ${err}`
        );

        return res.status(500).json({
            error: "Server error",
        });
    }
};


// ======================================================
// GET SINGLE SCHEDULE
// ======================================================

export const getSchedule = async (
    req,
    res
) => {

    try {

        const children =
            await Child.find({

                userId:
                    req.user.id,

            }).select("_id");


        const childIds =
            children.map(
                (child) =>
                    child._id
            );


        const schedule =
            await Schedule.findOne({

                _id: req.params.id,

                childId: {
                    $in: childIds,
                },

            }).populate(
                "childId",
                "name dateOfBirth gender"
            );


        if (!schedule) {

            return res.status(404).json({

                error:
                    "Schedule not found",

            });
        }


        // Completed হলে change হবে না
        if (
            schedule.status !==
            "Completed"
        ) {

            const today =
                new Date();

            const vaccineDate =
                new Date(
                    schedule.date
                );


            if (
                vaccineDate < today
            ) {

                schedule.status =
                    "Overdue";

            } else {

                schedule.status =
                    "Upcoming";
            }


            await schedule.save();
        }


        return res.status(200).json({

            schedule,

        });


    } catch (err) {

        console.log(
            `Error getting schedule: ${err}`
        );

        return res.status(500).json({
            error: "Server error",
        });
    }
};


// ======================================================
// UPDATE SCHEDULE
// ======================================================

export const updateSchedule = async (
    req,
    res
) => {

    try {

        const children =
            await Child.find({

                userId:
                    req.user.id,

            }).select("_id");


        const childIds =
            children.map(
                (child) =>
                    child._id
            );


        const schedule =
            await Schedule.findOne({

                _id: req.params.id,

                childId: {
                    $in: childIds,
                },

            });


        if (!schedule) {

            return res.status(404).json({

                error:
                    "Schedule not found",

            });
        }


        const {
            name,
            description,
            dose,
            date,
            status,
        } = req.body;


        schedule.name =
            name ??
            schedule.name;


        schedule.description =
            description ??
            schedule.description;


        schedule.dose =
            dose ??
            schedule.dose;


        if (date !== undefined) {

            schedule.date =
                date;

        }


        // যদি explicitly status পাঠানো হয়
        // সেটা use করবে
        if (status !== undefined) {

            schedule.status =
                status;

        } else if (
            schedule.status !==
            "Completed"
        ) {

            // Completed না হলে
            // date অনুযায়ী status update
            const vaccineDate =
                new Date(
                    schedule.date
                );

            schedule.status =
                vaccineDate <
                new Date()
                    ? "Overdue"
                    : "Upcoming";
        }


        await schedule.save();


        return res.status(200).json({

            message:
                "Schedule updated successfully",

            schedule,

        });


    } catch (err) {

        console.log(
            `Error updating schedule: ${err}`
        );

        return res.status(500).json({
            error: "Server error",
        });
    }
};


// ======================================================
// MARK VACCINATION AS COMPLETED
// ======================================================

export const markScheduleCompleted =
    async (req, res) => {

        try {

            const children =
                await Child.find({

                    userId:
                        req.user.id,

                }).select("_id");


            const childIds =
                children.map(
                    (child) =>
                        child._id
                );


            const schedule =
                await Schedule.findOne({

                    _id:
                        req.params.id,

                    childId: {
                        $in: childIds,
                    },

                });


            if (!schedule) {

                return res.status(404).json({

                    error:
                        "Schedule not found",

                });
            }


            // Vaccine completed
            schedule.status =
                "Completed";

            schedule.completedAt =
                new Date();


            await schedule.save();


            return res.status(200).json({

                message:
                    "Vaccination marked as completed",

                schedule,

            });


        } catch (err) {

            console.log(
                `Error marking vaccination completed: ${err}`
            );

            return res.status(500).json({
                error: "Server error",
            });
        }
    };


// ======================================================
// UNDO COMPLETED (back to Upcoming / Overdue by date)
// ======================================================

export const undoScheduleCompleted = async (req, res) => {
    try {
        const children = await Child.find({ userId: req.user.id }).select("_id");

        const schedule = await Schedule.findOne({
            _id: req.params.id,
            childId: { $in: children.map((c) => c._id) },
        });

        if (!schedule) {
            return res.status(404).json({ error: "Schedule not found" });
        }

        schedule.status = computeStatus(schedule.date);
        schedule.completedAt = null;

        await schedule.save();

        return res.status(200).json({
            message: "Vaccination marked as not completed",
            schedule,
        });
    } catch (err) {
        console.log(`Error undoing completion: ${err}`);

        return res.status(500).json({ error: "Server error" });
    }
};


// ======================================================
// DELETE SCHEDULE
// ======================================================

export const deleteSchedule = async (
    req,
    res
) => {

    try {

        const children =
            await Child.find({

                userId:
                    req.user.id,

            }).select("_id");


        const childIds =
            children.map(
                (child) =>
                    child._id
            );


        const schedule =
            await Schedule.findOneAndDelete({

                _id:
                    req.params.id,

                childId: {
                    $in: childIds,
                },

            });


        if (!schedule) {

            return res.status(404).json({

                error:
                    "Schedule not found",

            });
        }


        return res.status(200).json({

            message:
                "Schedule deleted successfully",

        });


    } catch (err) {

        console.log(
            `Error deleting schedule: ${err}`
        );

        return res.status(500).json({
            error: "Server error",
        });
    }
};