import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import "./childDetails.css";

const API = import.meta.env.VITE_API_URL;

function ChildDetails() {
    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const childId =
        searchParams.get("id");


    // ======================================================
    // STATES
    // ======================================================

    const [child, setChild] =
        useState(null);

    const [vaccines, setVaccines] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [user, setUser] =
        useState(null);

    const [completingId, setCompletingId] =
        useState(null);


    // ======================================================
    // FETCH CHILD DETAILS
    // ======================================================

    const fetchChildDetails = async () => {

        try {

            setLoading(true);
            setError("");


            if (!childId) {

                setError(
                    "Child ID is missing."
                );

                return;
            }


            // ------------------------------------------------
            // GET CHILD INFORMATION
            // ------------------------------------------------

            const childResponse =
                await fetch(
                    `${API}/children/${childId}`,
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                    }
                );


            const childData =
                await childResponse.json();


            if (!childResponse.ok) {

                setError(
                    childData.error ||
                        "Failed to load child information."
                );

                return;
            }


            setChild(
                childData.child
            );


            // ------------------------------------------------
            // GET ALL SCHEDULES
            // ------------------------------------------------

            const scheduleResponse =
                await fetch(
                    `${API}/schedules`,
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                    }
                );


            const scheduleData =
                await scheduleResponse.json();


            if (!scheduleResponse.ok) {

                setError(
                    scheduleData.error ||
                        "Failed to load vaccination schedule."
                );

                return;
            }


            const childSchedules =
                (
                    scheduleData.schedules ||
                    []
                ).filter(
                    (schedule) =>
                        String(
                            schedule.childId?._id ||
                                schedule.childId
                        ) ===
                        String(childId)
                );


            setVaccines(
                childSchedules
            );


            // ------------------------------------------------
            // GET GUARDIAN PROFILE
            // ------------------------------------------------

            const profileResponse =
                await fetch(
                    `${API}/users/profile`,
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                    }
                );


            if (profileResponse.ok) {

                const profileData =
                    await profileResponse.json();

                setUser(
                    profileData.user
                );

            }

        } catch (err) {

            console.error(
                "Error loading child details:",
                err
            );

            setError(
                "Unable to connect to server."
            );

        } finally {

            setLoading(false);

        }
    };


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {

        fetchChildDetails();

    }, [childId]);


    // ======================================================
    // HELPERS
    // ======================================================

    const getInitials = (name) => {

        if (!name) {
            return "CH";
        }


        const words =
            name.trim().split(/\s+/);


        if (words.length === 1) {

            return words[0]
                .substring(0, 2)
                .toUpperCase();

        }


        return (
            words[0].charAt(0) +
            words[
                words.length - 1
            ].charAt(0)
        ).toUpperCase();

    };


    const formatDate = (date) => {

        if (!date) {
            return "Not available";
        }


        return new Date(
            date
        ).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );

    };


    const calculateAge = (
        dateOfBirth
    ) => {

        if (!dateOfBirth) {
            return "Age unavailable";
        }


        const dob =
            new Date(dateOfBirth);

        const today =
            new Date();


        let years =
            today.getFullYear() -
            dob.getFullYear();


        let months =
            today.getMonth() -
            dob.getMonth();


        let days =
            today.getDate() -
            dob.getDate();


        if (days < 0) {
            months--;
        }


        if (months < 0) {

            years--;

            months += 12;

        }


        if (years > 0) {

            return `${years} Year${
                years !== 1
                    ? "s"
                    : ""
            } ${months} Month${
                months !== 1
                    ? "s"
                    : ""
            }`;

        }


        return `${months} Month${
            months !== 1
                ? "s"
                : ""
        }`;

    };


    const getNameParts = (name) => {

        if (!name) {

            return {
                firstName: "",
                lastName: "",
            };

        }


        const words =
            name.trim().split(/\s+/);


        if (words.length === 1) {

            return {
                firstName:
                    words[0],
                lastName: "",
            };

        }


        return {

            firstName:
                words
                    .slice(0, -1)
                    .join(" "),

            lastName:
                words[
                    words.length - 1
                ],

        };

    };


    // ======================================================
    // VACCINATION CALCULATIONS
    // ======================================================

    const completedVaccines =
        vaccines.filter(
            (vaccine) =>
                vaccine.status ===
                "Completed"
        );


    const upcomingVaccines =
        vaccines.filter(
            (vaccine) =>
                vaccine.status ===
                "Upcoming"
        );


    const overdueVaccines =
        vaccines.filter(
            (vaccine) =>
                vaccine.status ===
                "Overdue"
        );


    const completedCount =
        completedVaccines.length;


    const upcomingCount =
        upcomingVaccines.length;


    const overdueCount =
        overdueVaccines.length;


    const totalVaccines =
        vaccines.length;


    // IMPORTANT:
    // Progress ONLY depends on manually
    // completed vaccines.

    const progress =
        totalVaccines > 0
            ? Math.round(
                  (completedCount /
                      totalVaccines) *
                      100
              )
            : 0;


    // ======================================================
    // SORT VACCINES BY DATE
    // ======================================================

    const sortedVaccines =
        [...vaccines].sort(
            (a, b) =>
                new Date(a.date) -
                new Date(b.date)
        );


    // ======================================================
    // NEXT UPCOMING VACCINATION
    // ======================================================

    const nextVaccine =
        [...vaccines]
            .filter(
                (vaccine) =>
                    vaccine.status ===
                    "Upcoming"
            )
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            )[0];


    const nameParts =
        getNameParts(
            child?.name
        );


    // ======================================================
    // MARK VACCINE AS COMPLETED
    // ======================================================

    const handleMarkCompleted =
        async (scheduleId) => {

            try {

                setCompletingId(
                    scheduleId
                );


                const response =
                    await fetch(
                        `${API}/schedules/${scheduleId}/complete`,
                        {
                            method: "PUT",
                            credentials:
                                "include",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                            "Failed to mark vaccination as completed."
                    );

                }


                // ------------------------------------------------
                // UPDATE FRONTEND IMMEDIATELY
                // ------------------------------------------------

                setVaccines(
                    (previous) =>
                        previous.map(
                            (vaccine) =>
                                String(
                                    vaccine._id
                                ) ===
                                String(
                                    scheduleId
                                )
                                    ? {
                                          ...vaccine,
                                          status:
                                              "Completed",
                                      }
                                    : vaccine
                        )
                );


            } catch (err) {

                console.error(
                    "Error completing vaccination:",
                    err
                );

                alert(
                    err.message ||
                        "Failed to mark vaccination as completed."
                );

            } finally {

                setCompletingId(
                    null
                );

            }

        };


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {

        return (
            <div className="child-details-page">

                <main className="child-details-main">

                    <div
                        style={{
                            padding: "50px",
                            textAlign:
                                "center",
                        }}
                    >
                        Loading child details...
                    </div>

                </main>

            </div>
        );

    }


    // ======================================================
    // ERROR
    // ======================================================

    if (error || !child) {

        return (
            <div className="child-details-page">

                <main className="child-details-main">

                    <div
                        style={{
                            padding: "50px",
                            textAlign:
                                "center",
                        }}
                    >

                        <h2>
                            {error ||
                                "Child not found"}
                        </h2>


                        <button
                            onClick={() =>
                                navigate(
                                    "/children"
                                )
                            }
                            style={{
                                marginTop:
                                    "20px",
                                padding:
                                    "12px 24px",
                                cursor:
                                    "pointer",
                            }}
                        >
                            Back to Children
                        </button>

                    </div>

                </main>

            </div>
        );

    }


    // ======================================================
    // MAIN UI
    // ======================================================

    return (
        <div className="child-details-page">


            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <aside className="child-details-sidebar">

                <div className="child-details-logo">

                    Tika
                    <span>
                        Track
                    </span>

                </div>


                <nav className="child-details-nav">

                    <a href="/dashboard">

                        <span>
                            ⌂
                        </span>

                        Dashboard

                    </a>


                    <a
                        href="/children"
                        className="active"
                    >

                        <span>
                            ♙
                        </span>

                        Children

                    </a>


                    <a href="/schedule">

                        <span>
                            ▣
                        </span>

                        Schedule

                    </a>


                    <a href="/reminders">

                        <span>
                            ♧
                        </span>

                        Reminders

                    </a>


                    <a href="/reports">

                        <span>
                            ▥
                        </span>

                        Reports

                    </a>


                    <a href="/profile">

                        <span>
                            ◉
                        </span>

                        Profile

                    </a>


                    <a href="/settings">

                        <span>
                            ⚙
                        </span>

                        Settings

                    </a>

                </nav>


                {/* ==================================================
                    LOGOUT
                ================================================== */}

                <button
                    className="child-details-logout"
                    onClick={async () => {

                        try {

                            await fetch(
                                `${API}/auth/logout`,
                                {
                                    method:
                                        "POST",
                                    credentials:
                                        "include",
                                }
                            );

                            navigate(
                                "/login"
                            );

                        } catch (err) {

                            console.error(
                                "Logout error:",
                                err
                            );

                        }

                    }}
                >

                    <span>
                        ↪
                    </span>

                    Logout

                </button>

            </aside>


            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="child-details-main">


                {/* ==================================================
                    TOPBAR
                ================================================== */}

                <header className="child-details-topbar">

                    <div className="child-details-top-space">
                    </div>


                    <button className="child-details-notification">

                        ♧

                        <span>
                        </span>

                    </button>


                    <div className="child-details-user">

                        <div className="child-details-user-avatar">

                            {user?.name
                                ? getInitials(
                                      user.name
                                  )
                                : "U"}

                        </div>


                        <div className="child-details-user-info">

                            <strong>
                                {user?.name ||
                                    "Guardian"}
                            </strong>


                            <small>
                                Guardian
                            </small>

                        </div>


                        <span className="child-details-arrow">
                            ▼
                        </span>

                    </div>

                </header>


                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div className="child-details-content">


                    {/* ==================================================
                        BACK
                    ================================================== */}

                    <button
                        className="child-details-back"
                        onClick={() =>
                            navigate(
                                "/children"
                            )
                        }
                        type="button"
                    >
                        ← Back to Children
                    </button>


                    {/* ==================================================
                        CHILD HEADER
                    ================================================== */}

                    <section className="child-profile-header">

                        <div className="child-profile-left">


                            <div className="child-profile-avatar">

                                {getInitials(
                                    child.name
                                )}

                            </div>


                            <div>

                                <span className="child-profile-label">
                                    CHILD PROFILE
                                </span>


                                <h1>

                                    {
                                        nameParts.firstName
                                    }


                                    {nameParts.lastName && (

                                        <>
                                            {" "}

                                            <span>
                                                {
                                                    nameParts.lastName
                                                }
                                            </span>
                                        </>

                                    )}

                                </h1>


                                <p>

                                    {child.gender}
                                    {" · "}
                                    {calculateAge(
                                        child.dateOfBirth
                                    )}

                                </p>


                                <small>

                                    Date of Birth:{" "}

                                    {formatDate(
                                        child.dateOfBirth
                                    )}

                                </small>

                            </div>

                        </div>


                        {/* ==================================================
                            EDIT PROFILE
                        ================================================== */}

                        <button
                            className="child-edit-button"
                            onClick={() =>
                                navigate(
                                    `/children?edit=${child._id}`
                                )
                            }
                        >
                            ✎ Edit Profile
                        </button>

                    </section>


                    {/* ==================================================
                        SUMMARY CARDS
                    ================================================== */}

                    <section className="child-detail-summary">


                        {/* COMPLETED */}

                        <div className="detail-summary-card">

                            <div className="detail-summary-icon green">
                                ✓
                            </div>


                            <div>

                                <strong>
                                    {
                                        completedCount
                                    }
                                </strong>

                                <span>
                                    Completed
                                </span>

                            </div>

                        </div>


                        {/* UPCOMING */}

                        <div className="detail-summary-card">

                            <div className="detail-summary-icon orange">
                                ♧
                            </div>


                            <div>

                                <strong>
                                    {
                                        upcomingCount
                                    }
                                </strong>

                                <span>
                                    Upcoming
                                </span>

                            </div>

                        </div>


                        {/* OVERDUE */}

                        <div className="detail-summary-card">

                            <div className="detail-summary-icon red">
                                !
                            </div>


                            <div>

                                <strong>
                                    {
                                        overdueCount
                                    }
                                </strong>

                                <span>
                                    Overdue
                                </span>

                            </div>

                        </div>


                        {/* PROGRESS */}

                        <div className="detail-summary-card">

                            <div className="detail-summary-icon blue">
                                %
                            </div>


                            <div>

                                <strong>
                                    {progress}%
                                </strong>

                                <span>
                                    Progress
                                </span>

                            </div>

                        </div>

                    </section>


                    {/* ==================================================
                        TWO COLUMN AREA
                    ================================================== */}

                    <div className="child-details-grid">


                        {/* ==================================================
                            LEFT - VACCINATION HISTORY
                        ================================================== */}

                        <section className="vaccination-history-card">


                            <div className="detail-card-heading">

                                <div>

                                    <span>
                                        VACCINATION RECORD
                                    </span>

                                    <h2>
                                        Vaccination
                                        History
                                    </h2>

                                </div>


                                <button
                                    onClick={() =>
                                        navigate(
                                            `/schedule?child=${child._id}`
                                        )
                                    }
                                >
                                    View All
                                </button>

                            </div>


                            <div className="vaccination-list">

                                {sortedVaccines.length ===
                                0 ? (

                                    <p
                                        style={{
                                            padding:
                                                "25px",
                                            color:
                                                "#777",
                                        }}
                                    >
                                        No vaccination
                                        records found
                                        for this child.
                                    </p>

                                ) : (

                                    sortedVaccines.map(
                                        (
                                            vaccine,
                                            index
                                        ) => (

                                            <div
                                                className="vaccination-item"
                                                key={
                                                    vaccine._id ||
                                                    index
                                                }
                                            >


                                                {/* STATUS ICON */}

                                                <div
                                                    className={`vaccination-status ${
                                                        vaccine.status ===
                                                        "Completed"
                                                            ? "completed"
                                                            : vaccine.status ===
                                                              "Overdue"
                                                            ? "overdue"
                                                            : "upcoming"
                                                    }`}
                                                >

                                                    {vaccine.status ===
                                                    "Completed"
                                                        ? "✓"
                                                        : vaccine.status ===
                                                          "Overdue"
                                                        ? "!"
                                                        : "○"}

                                                </div>


                                                {/* VACCINE INFO */}

                                                <div className="vaccination-info">

                                                    <strong>
                                                        {
                                                            vaccine.name
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            vaccine.dose
                                                        }
                                                    </span>

                                                </div>


                                                {/* DATE + STATUS */}

                                                <div className="vaccination-date">

                                                    <strong>
                                                        {formatDate(
                                                            vaccine.date
                                                        )}
                                                    </strong>


                                                    <span
                                                        className={
                                                            vaccine.status ===
                                                            "Completed"
                                                                ? "completed-text"
                                                                : vaccine.status ===
                                                                  "Overdue"
                                                                ? "overdue-text"
                                                                : "upcoming-text"
                                                        }
                                                    >
                                                        {
                                                            vaccine.status
                                                        }
                                                    </span>

                                                </div>


                                                {/* ==================================================
                                                    MARK COMPLETED
                                                ================================================== */}

                                                {vaccine.status !==
                                                    "Completed" && (

                                                    <button
                                                        type="button"
                                                        className="table-action"
                                                        disabled={
                                                            completingId ===
                                                            vaccine._id
                                                        }
                                                        onClick={() =>
                                                            handleMarkCompleted(
                                                                vaccine._id
                                                            )
                                                        }
                                                    >

                                                        {completingId ===
                                                        vaccine._id
                                                            ? "Saving..."
                                                            : "Mark Completed"}

                                                    </button>

                                                )}


                                                {vaccine.status ===
                                                    "Completed" && (

                                                    <span className="table-action completed-action">

                                                        ✓
                                                        Completed

                                                    </span>

                                                )}

                                            </div>

                                        )
                                    )

                                )}

                            </div>

                        </section>


                        {/* ==================================================
                            RIGHT - NEXT VACCINE
                        ================================================== */}

                        <aside className="next-vaccine-card">

                            <div className="next-vaccine-heading">

                                <span>
                                    NEXT VACCINATION
                                </span>


                                <div className="next-vaccine-big-icon">
                                    💉
                                </div>

                            </div>


                            {nextVaccine ? (

                                <>

                                    <h2>
                                        {
                                            nextVaccine.name
                                        }
                                    </h2>


                                    <p>
                                        {
                                            nextVaccine.description ||
                                            `${nextVaccine.name} vaccination`
                                        }
                                    </p>


                                    <div className="next-vaccine-date-box">

                                        <span>
                                            DUE DATE
                                        </span>


                                        <strong>
                                            {formatDate(
                                                nextVaccine.date
                                            )}
                                        </strong>


                                        <small>
                                            Upcoming
                                            vaccination
                                        </small>

                                    </div>


                                    <button
                                        className="schedule-reminder-button"
                                        type="button"
                                        onClick={() =>
                                            alert(
                                                "Reminder feature will be connected soon."
                                            )
                                        }
                                    >
                                        🔔 Set Reminder
                                    </button>

                                </>

                            ) : (

                                <>

                                    <h2>
                                        No upcoming
                                        vaccine
                                    </h2>


                                    <p>
                                        There is
                                        currently no
                                        upcoming
                                        vaccination
                                        scheduled for
                                        this child.
                                    </p>


                                    <div className="next-vaccine-date-box">

                                        <span>
                                            STATUS
                                        </span>


                                        <strong>
                                            —
                                        </strong>


                                        <small>
                                            Schedule up
                                            to date
                                        </small>

                                    </div>

                                </>

                            )}

                        </aside>

                    </div>


                    {/* ==================================================
                        OVERALL PROGRESS
                    ================================================== */}

                    <section className="overall-progress-card">

                        <div className="overall-progress-header">

                            <div>

                                <span>
                                    VACCINATION
                                    PROGRESS
                                </span>


                                <h2>
                                    Overall Progress
                                </h2>

                            </div>


                            <strong>
                                {progress}%
                            </strong>

                        </div>


                        <div className="overall-progress-bar">

                            <div
                                style={{
                                    width: `${progress}%`,
                                }}
                            >
                            </div>

                        </div>


                        <div className="overall-progress-bottom">

                            <span>

                                {completedCount}
                                {" "}
                                vaccination
                                {completedCount !==
                                1
                                    ? "s"
                                    : ""}
                                {" "}
                                completed

                            </span>


                            <span>

                                {Math.max(
                                    totalVaccines -
                                        completedCount,
                                    0
                                )}
                                {" "}
                                vaccination
                                {Math.max(
                                    totalVaccines -
                                        completedCount,
                                    0
                                ) !== 1
                                    ? "s"
                                    : ""}
                                {" "}
                                remaining

                            </span>

                        </div>

                    </section>


                    {/* ==================================================
                        NOTES
                    ================================================== */}

                    <section className="child-notes-card">

                        <div className="notes-icon">
                            ✎
                        </div>


                        <div>

                            <span>
                                IMPORTANT NOTE
                            </span>


                            <h3>
                                Keep vaccination
                                records updated
                            </h3>


                            <p>
                                After receiving a
                                vaccination, click
                                "Mark Completed" so
                                TikaTrack can keep the
                                vaccination progress
                                and schedule accurate.
                            </p>

                        </div>

                    </section>

                </div>

            </main>


            {/* ==================================================
                MOBILE NAV
            ================================================== */}

            <nav className="child-details-mobile-nav">

                <a href="/dashboard">

                    <span>
                        ⌂
                    </span>

                    Dashboard

                </a>


                <a
                    href="/children"
                    className="active"
                >

                    <span>
                        ♙
                    </span>

                    Children

                </a>


                <a href="/schedule">

                    <span>
                        ▣
                    </span>

                    Schedule

                </a>


                <a href="/reminders">

                    <span>
                        ♧
                    </span>

                    Reminders

                </a>


                <a href="/profile">

                    <span>
                        ◉
                    </span>

                    Profile

                </a>

            </nav>

        </div>
    );
}

export default ChildDetails;