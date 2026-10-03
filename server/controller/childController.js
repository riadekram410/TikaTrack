import Child from "../model/child.js";
import Schedule from "../model/schedule.js";
import { generateVaccineSchedule } from "../utils/vaccineSchedule.js";
import {
    syncScheduleStatuses,
    ensureSchedules,
    buildVaccineSummary,
} from "../utils/vaccineSummary.js";

// Attach vaccine summary (counts, age groups, next vaccine) to children
const attachSummaries = async (children) => {
    const ids = children.map((c) => c._id);

    await ensureSchedules(children);
    await syncScheduleStatuses(ids);

    const schedules = await Schedule.find({ childId: { $in: ids } }).lean();

    return children.map((child) => {
        const own = schedules.filter(
            (s) => String(s.childId) === String(child._id)
        );

        return {
            ...child,
            vaccineSummary: buildVaccineSummary(own),
        };
    });
};

// Create Child (vaccine schedule is generated automatically)
export const createChild = async (req, res) => {
    try {
        const { name, dateOfBirth, gender, bloodGroup, guardian } = req.body;

        if (!name || !dateOfBirth || !gender || !guardian) {
            return res.status(400).json({
                error: "Name, date of birth, gender and guardian are required",
            });
        }

        if (new Date(dateOfBirth) > new Date()) {
            return res.status(400).json({
                error: "Date of birth cannot be in the future",
            });
        }

        const child = new Child({
            name,
            dateOfBirth,
            gender,
            bloodGroup,
            guardian,
            userId: req.user.id,
        });

        await child.save();

        await Schedule.insertMany(
            generateVaccineSchedule(dateOfBirth, child._id)
        );

        const [withSummary] = await attachSummaries([child.toObject()]);

        return res.status(201).json({
            message: "Child added successfully",
            child: withSummary,
        });
    } catch (err) {
        console.log(`Error creating child: ${err}`);

        return res.status(500).json({ error: "Server error" });
    }
};

// Get all children of logged-in user (with vaccine summary per child)
export const getChildren = async (req, res) => {
    try {
        const children = await Child.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            children: await attachSummaries(children),
        });
    } catch (err) {
        console.log(`Error getting children: ${err}`);

        return res.status(500).json({ error: "Server error" });
    }
};

// Get single child
export const getChild = async (req, res) => {
    try {
        const child = await Child.findOne({
            _id: req.params.id,
            userId: req.user.id,
        }).lean();

        if (!child) {
            return res.status(404).json({ error: "Child not found" });
        }

        const [withSummary] = await attachSummaries([child]);

        return res.status(200).json({ child: withSummary });
    } catch (err) {
        console.log(`Error getting child: ${err}`);

        return res.status(500).json({ error: "Server error" });
    }
};

// Update child
export const updateChild = async (req, res) => {
    try {
        const child = await Child.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!child) {
            return res.status(404).json({ error: "Child not found" });
        }

        const { name, dateOfBirth, gender, bloodGroup, guardian } = req.body;

        if (dateOfBirth && new Date(dateOfBirth) > new Date()) {
            return res.status(400).json({
                error: "Date of birth cannot be in the future",
            });
        }

        const dobChanged =
            dateOfBirth &&
            new Date(dateOfBirth).getTime() !==
                new Date(child.dateOfBirth).getTime();

        child.name = name ?? child.name;
        child.dateOfBirth = dateOfBirth ?? child.dateOfBirth;
        child.gender = gender ?? child.gender;
        child.bloodGroup = bloodGroup ?? child.bloodGroup;
        child.guardian = guardian ?? child.guardian;

        await child.save();

        // Date of birth changed -> recalculate due dates.
        // Completed vaccines are kept exactly as they are.
        if (dobChanged) {
            const done = await Schedule.find({
                childId: child._id,
                status: "Completed",
            }).select("name");

            await Schedule.deleteMany({
                childId: child._id,
                status: { $ne: "Completed" },
            });

            await Schedule.insertMany(
                generateVaccineSchedule(
                    child.dateOfBirth,
                    child._id,
                    done.map((d) => d.name)
                )
            );
        }

        const [withSummary] = await attachSummaries([child.toObject()]);

        return res.status(200).json({
            message: "Child updated successfully",
            child: withSummary,
        });
    } catch (err) {
        console.log(`Error updating child: ${err}`);

        return res.status(500).json({ error: "Server error" });
    }
};

// Delete child (and all of their vaccine records)
export const deleteChild = async (req, res) => {
    try {
        const child = await Child.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!child) {
            return res.status(404).json({ error: "Child not found" });
        }

        await Schedule.deleteMany({ childId: child._id });

        return res.status(200).json({
            message: "Child deleted successfully",
        });
    } catch (err) {
        console.log(`Error deleting child: ${err}`);

        return res.status(500).json({ error: "Server error" });
    }
};