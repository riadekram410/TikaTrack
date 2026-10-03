// ======================================================
// BANGLADESH EPI VACCINATION SCHEDULE (age based)
// ======================================================

const addWeeks = (date, weeks) => {
    const result = new Date(date);
    result.setDate(result.getDate() + weeks * 7);
    return result;
};

const addMonths = (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
};

export const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

// Overdue = due date is before today. Completed is never touched here.
export const computeStatus = (date) =>
    new Date(date) < startOfToday() ? "Overdue" : "Upcoming";

// Ordered age milestones (used for grouping in the UI)
export const AGE_GROUPS = [
    "At Birth",
    "6 Weeks",
    "10 Weeks",
    "14 Weeks",
    "18 Weeks",
    "9 Months",
    "15 Months",
];

const VACCINES = [
    { name: "BCG", description: "Tuberculosis (TB)", dose: "1st", ageGroup: "At Birth", due: (d) => d },

    { name: "Pentavalent-1", description: "Diphtheria, Pertussis, Tetanus, Hepatitis-B, Hib", dose: "1st", ageGroup: "6 Weeks", due: (d) => addWeeks(d, 6) },
    { name: "OPV-1", description: "Polio", dose: "1st", ageGroup: "6 Weeks", due: (d) => addWeeks(d, 6) },
    { name: "PCV-1", description: "Pneumococcal disease", dose: "1st", ageGroup: "6 Weeks", due: (d) => addWeeks(d, 6) },

    { name: "Pentavalent-2", description: "DPT + Hep-B + Hib", dose: "2nd", ageGroup: "10 Weeks", due: (d) => addWeeks(d, 10) },
    { name: "OPV-2", description: "Polio", dose: "2nd", ageGroup: "10 Weeks", due: (d) => addWeeks(d, 10) },
    { name: "PCV-2", description: "Pneumococcal disease", dose: "2nd", ageGroup: "10 Weeks", due: (d) => addWeeks(d, 10) },

    { name: "Pentavalent-3", description: "DPT + Hep-B + Hib", dose: "3rd", ageGroup: "14 Weeks", due: (d) => addWeeks(d, 14) },
    { name: "OPV-3", description: "Polio", dose: "3rd", ageGroup: "14 Weeks", due: (d) => addWeeks(d, 14) },
    { name: "IPV-1", description: "Polio", dose: "1st", ageGroup: "14 Weeks", due: (d) => addWeeks(d, 14) },

    { name: "PCV-3", description: "Pneumococcal disease", dose: "3rd", ageGroup: "18 Weeks", due: (d) => addWeeks(d, 18) },

    { name: "MR-1", description: "Measles + Rubella", dose: "1st", ageGroup: "9 Months", due: (d) => addMonths(d, 9) },

    { name: "MR-2", description: "Measles + Rubella", dose: "2nd", ageGroup: "15 Months", due: (d) => addMonths(d, 15) },
];

// Fallback for old schedule rows created before `ageGroup` existed
const AGE_GROUP_BY_NAME = Object.fromEntries(
    VACCINES.map((v) => [v.name, v.ageGroup])
);

export const getAgeGroup = (schedule) =>
    schedule.ageGroup || AGE_GROUP_BY_NAME[schedule.name] || "Other";

// skipNames: vaccines to leave out (e.g. already completed ones)
export const generateVaccineSchedule = (
    dateOfBirth,
    childId,
    skipNames = []
) => {
    const dob = new Date(dateOfBirth);

    return VACCINES.filter((v) => !skipNames.includes(v.name)).map((v) => {
        const date = v.due(dob);

        return {
            childId,
            name: v.name,
            description: v.description,
            dose: v.dose,
            ageGroup: v.ageGroup,
            date,
            status: computeStatus(date),
        };
    });
};