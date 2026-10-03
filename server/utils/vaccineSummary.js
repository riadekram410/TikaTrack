import Schedule from "../model/schedule.js";
import {
    AGE_GROUPS,
    getAgeGroup,
    startOfToday,
    generateVaccineSchedule,
} from "./vaccineSchedule.js";

// Keep Upcoming/Overdue correct in bulk (Completed is never touched)
export const syncScheduleStatuses = async (childIds) => {
    const today = startOfToday();

    await Schedule.updateMany(
        { childId: { $in: childIds }, status: "Upcoming", date: { $lt: today } },
        { $set: { status: "Overdue" } }
    );

    await Schedule.updateMany(
        { childId: { $in: childIds }, status: "Overdue", date: { $gte: today } },
        { $set: { status: "Upcoming" } }
    );
};

// Create the full vaccine list for any child that has none yet
export const ensureSchedules = async (children) => {
    const withSchedules = await Schedule.distinct("childId", {
        childId: { $in: children.map((c) => c._id) },
    });

    const have = new Set(withSchedules.map(String));

    const missing = children.filter((c) => !have.has(String(c._id)));

    if (missing.length) {
        const rows = missing.flatMap((c) =>
            generateVaccineSchedule(c.dateOfBirth, c._id)
        );
        await Schedule.insertMany(rows);
    }
};

// Turn a child's schedule rows into counts + age groups + next vaccine
export const buildVaccineSummary = (schedules) => {
    const sorted = [...schedules].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    const vaccines = sorted.map((s) => ({
        _id: s._id,
        name: s.name,
        description: s.description,
        dose: s.dose,
        date: s.date,
        status: s.status,
        completedAt: s.completedAt || null,
        ageGroup: getAgeGroup(s),
    }));

    const completed = vaccines.filter((v) => v.status === "Completed").length;
    const overdue = vaccines.filter((v) => v.status === "Overdue").length;
    const upcoming = vaccines.filter((v) => v.status === "Upcoming").length;
    const total = vaccines.length;

    // Most urgent pending vaccine: overdue ones first (oldest), then soonest upcoming
    const pending = vaccines.filter((v) => v.status !== "Completed");
    const nextVaccine =
        pending.find((v) => v.status === "Overdue") || pending[0] || null;

    const groups = AGE_GROUPS.map((label) => {
        const items = vaccines.filter((v) => v.ageGroup === label);
        return {
            label,
            items,
            completed: items.filter((v) => v.status === "Completed").length,
        };
    }).filter((g) => g.items.length > 0);

    return {
        total,
        completed,
        upcoming,
        overdue,
        percent: total ? Math.round((completed / total) * 100) : 0,
        nextVaccine,
        groups,
    };
};