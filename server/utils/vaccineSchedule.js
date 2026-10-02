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

const getInitialStatus = (date) => {
    return date < new Date() ? "Overdue" : "Upcoming";
};

export const generateVaccineSchedule = (dateOfBirth, childId) => {
    const dob = new Date(dateOfBirth);

    const vaccines = [
        {
            name: "BCG",
            description: "Tuberculosis (TB)",
            dose: "1st",
            date: dob,
        },

        {
            name: "Pentavalent-1",
            description:
                "Diphtheria, Pertussis, Tetanus, Hepatitis-B, Hib",
            dose: "1st",
            date: addWeeks(dob, 6),
        },

        {
            name: "OPV-1",
            description: "Polio",
            dose: "1st",
            date: addWeeks(dob, 6),
        },

        {
            name: "PCV-1",
            description: "Pneumococcal disease",
            dose: "1st",
            date: addWeeks(dob, 6),
        },

        {
            name: "Pentavalent-2",
            description: "DPT + Hep-B + Hib",
            dose: "2nd",
            date: addWeeks(dob, 10),
        },

        {
            name: "OPV-2",
            description: "Polio",
            dose: "2nd",
            date: addWeeks(dob, 10),
        },

        {
            name: "PCV-2",
            description: "Pneumococcal disease",
            dose: "2nd",
            date: addWeeks(dob, 10),
        },

        {
            name: "Pentavalent-3",
            description: "DPT + Hep-B + Hib",
            dose: "3rd",
            date: addWeeks(dob, 14),
        },

        {
            name: "OPV-3",
            description: "Polio",
            dose: "3rd",
            date: addWeeks(dob, 14),
        },

        {
            name: "IPV-1",
            description: "Polio",
            dose: "1st",
            date: addWeeks(dob, 14),
        },

        {
            name: "PCV-3",
            description: "Pneumococcal disease",
            dose: "3rd",
            date: addWeeks(dob, 18),
        },

        {
            name: "MR-1",
            description: "Measles + Rubella",
            dose: "1st",
            date: addMonths(dob, 9),
        },

        {
            name: "MR-2",
            description: "Measles + Rubella",
            dose: "2nd",
            date: addMonths(dob, 15),
        },
    ];

    return vaccines.map((vaccine) => ({
        childId,
        name: vaccine.name,
        description: vaccine.description,
        dose: vaccine.dose,
        date: vaccine.date,
        status: getInitialStatus(vaccine.date),
    }));
};