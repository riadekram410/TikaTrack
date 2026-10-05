import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import "./settings.css";


function Settings() {

    const navigate = useNavigate();


    // ================= USER STATE =================

    const [user, setUser] = useState(null);


    // ================= SETTINGS STATE =================

    const [emailNotifications, setEmailNotifications] =
        useState(true);

    const [vaccinationReminders, setVaccinationReminders] =
        useState(true);

    const [overdueAlerts, setOverdueAlerts] =
        useState(true);

    const [reminderDays, setReminderDays] =
        useState(3);


    // ================= UI STATE =================

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD PROFILE + SETTINGS
    // =====================================================

    const loadSettings = async () => {

        try {

            setLoading(true);

            setError("");


            // Load profile and settings at the same time
            const [
                profileResponse,
                settingsResponse
            ] = await Promise.all([

                fetch(
                     `${import.meta.env.VITE_API_URL}/users/profile`,
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                    }
                ),

                fetch(
                    `${import.meta.env.VITE_API_URL}/users/settings`,
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                    }
                ),

            ]);


            const profileData =
                await profileResponse.json();

            const settingsData =
                await settingsResponse.json();


            // ================= PROFILE =================

            if (!profileResponse.ok) {

                throw new Error(
                    profileData.error ||
                    "Failed to load profile"
                );

            }


            setUser(profileData.user);


            // ================= SETTINGS =================

            if (!settingsResponse.ok) {

                throw new Error(
                    settingsData.error ||
                    "Failed to load settings"
                );

            }


            setVaccinationReminders(
                settingsData.settings.vaccinationReminders
            );


            setEmailNotifications(
                settingsData.settings.emailNotifications
            );


            setOverdueAlerts(
                settingsData.settings.overdueAlerts
            );


            setReminderDays(
                settingsData.settings.reminderDays
            );


        } catch (err) {

            console.error(
                "Settings loading error:",
                err
            );


            setError(
                "Failed to load settings."
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD SETTINGS ON PAGE OPEN
    // =====================================================

    useEffect(() => {

        loadSettings();

    }, []);


    // =====================================================
    // SAVE SETTINGS
    // =====================================================

    const saveSettings = async (
        newVaccinationReminders =
            vaccinationReminders,

        newEmailNotifications =
            emailNotifications,

        newOverdueAlerts =
            overdueAlerts,

        newReminderDays =
            reminderDays
    ) => {

        try {

            setSaving(true);

            setMessage("");

            setError("");


            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/users/settings`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify({

                        vaccinationReminders:
                            newVaccinationReminders,

                        emailNotifications:
                            newEmailNotifications,

                        overdueAlerts:
                            newOverdueAlerts,

                        reminderDays:
                            Number(newReminderDays),

                    }),
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Failed to save settings"
                );

            }


            setMessage(
                "Settings saved successfully."
            );


        } catch (err) {

            console.error(
                "Settings saving error:",
                err
            );


            setError(
                "Failed to save settings."
            );


        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // TOGGLE VACCINATION REMINDERS
    // =====================================================

    const handleVaccinationReminderToggle =
        () => {

            const newValue =
                !vaccinationReminders;


            setVaccinationReminders(
                newValue
            );


            saveSettings(
                newValue,
                emailNotifications,
                overdueAlerts,
                reminderDays
            );

        };


    // =====================================================
    // TOGGLE EMAIL NOTIFICATIONS
    // =====================================================

    const handleEmailNotificationToggle =
        () => {

            const newValue =
                !emailNotifications;


            setEmailNotifications(
                newValue
            );


            saveSettings(
                vaccinationReminders,
                newValue,
                overdueAlerts,
                reminderDays
            );

        };


    // =====================================================
    // TOGGLE OVERDUE ALERTS
    // =====================================================

    const handleOverdueAlertToggle =
        () => {

            const newValue =
                !overdueAlerts;


            setOverdueAlerts(
                newValue
            );


            saveSettings(
                vaccinationReminders,
                emailNotifications,
                newValue,
                reminderDays
            );

        };


    // =====================================================
    // REMINDER DAYS
    // =====================================================

    const handleReminderDaysChange =
        (event) => {

            const newValue =
                Number(event.target.value);


            setReminderDays(
                newValue
            );


            saveSettings(
                vaccinationReminders,
                emailNotifications,
                overdueAlerts,
                newValue
            );

        };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = async () => {

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/logout`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                console.error(
                    "Logout failed:",
                    data.error
                );

                return;

            }


            navigate("/login", {
                replace: true,
            });


        } catch (err) {

            console.error(
                "Logout error:",
                err
            );

        }

    };


    // =====================================================
    // DELETE ACCOUNT
    // =====================================================

    const handleDeleteAccount = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete your account? This will permanently delete your account, children and vaccination schedules."
            );


        if (!confirmed) {

            return;

        }


        const secondConfirmation =
            window.confirm(
                "This action cannot be undone. Continue?"
            );


        if (!secondConfirmation) {

            return;

        }


        try {

            setError("");

            setMessage("");


            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/users/account`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Failed to delete account"
                );

            }


            alert(
                "Your account has been deleted successfully."
            );


            navigate("/login", {
                replace: true,
            });


        } catch (err) {

            console.error(
                "Delete account error:",
                err
            );


            setError(
                err.message ||
                "Failed to delete account."
            );

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="settings-page">

                <div
                    style={{
                        width: "100%",
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        color: "#167c4c",
                    }}
                >

                    Loading settings...

                </div>

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="settings-page">


            {/* ================= SIDEBAR ================= */}

            <aside className="settings-sidebar">

                <div className="settings-logo">

                    Tika<span>Track</span>

                </div>


                <nav className="settings-nav">

                    <a href="/dashboard">
                        <span>⌂</span>
                        Dashboard
                    </a>


                    <a href="/children">
                        <span>♙</span>
                        Children
                    </a>


                    <a href="/schedule">
                        <span>▣</span>
                        Schedule
                    </a>


                    <a href="/reminders">
                        <span>♧</span>
                        Reminders
                    </a>


                    <a href="/reports">
                        <span>▥</span>
                        Reports
                    </a>


                    <a href="/profile">
                        <span>◉</span>
                        Profile
                    </a>


                    <a
                        href="/settings"
                        className="active"
                    >
                        <span>⚙</span>
                        Settings
                    </a>

                </nav>


                <button
                    className="settings-logout"
                    onClick={handleLogout}
                >

                    <span>↪</span>

                    Logout

                </button>

            </aside>


            {/* ================= MAIN ================= */}

            <main className="settings-main">


                {/* TOPBAR */}

                <header className="settings-topbar">

                    <div className="settings-top-space">
                    </div>


                    <div className="settings-user">

                        {/* Dynamic first letter */}

                        <div className="settings-user-avatar">

                            {user?.name
                                ?.charAt(0)
                                .toUpperCase() || "U"}

                        </div>


                        {/* Dynamic backend name */}

                        <div className="settings-user-info">

                            <strong>

                                {user?.name || "User"}

                            </strong>


                            <small>
                                Guardian
                            </small>

                        </div>

                    </div>

                </header>


                {/* ================= CONTENT ================= */}

                <div className="settings-content">


                    {/* HEADER */}

                    <div className="settings-page-header">

                        <div>

                            <span className="settings-label">

                                PREFERENCES

                            </span>


                            <h1>
                                Settings
                            </h1>


                            <p>
                                Manage your notification and vaccination reminder preferences.
                            </p>

                        </div>

                    </div>


                    {/* SUCCESS MESSAGE */}

                    {message && (

                        <div
                            style={{
                                marginBottom: "15px",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                background: "#e5f3e9",
                                color: "#167c4c",
                                fontSize: "11px",
                            }}
                        >

                            {message}

                        </div>

                    )}


                    {/* ERROR MESSAGE */}

                    {error && (

                        <div
                            style={{
                                marginBottom: "15px",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                background: "#fde9e7",
                                color: "#c05249",
                                fontSize: "11px",
                            }}
                        >

                            {error}

                        </div>

                    )}


                    {/* ================= NOTIFICATIONS ================= */}

                    <section className="settings-card">


                        <div className="settings-section-heading">

                            <div className="settings-section-icon">

                                🔔

                            </div>


                            <div>

                                <span>
                                    NOTIFICATIONS
                                </span>


                                <h2>
                                    Notification Preferences
                                </h2>


                                <p>
                                    Choose which vaccination notifications you want to receive.
                                </p>

                            </div>

                        </div>


                        <div className="settings-options">


                            {/* Vaccination Reminders */}

                            <div className="settings-toggle-row">

                                <div className="option-icon">
                                    🔔
                                </div>


                                <div className="option-content">

                                    <strong>
                                        Vaccination Reminders
                                    </strong>


                                    <span>
                                        Get notified when a vaccination is coming up.
                                    </span>

                                </div>


                                <button
                                    className={`toggle ${
                                        vaccinationReminders
                                            ? "on"
                                            : ""
                                    }`}
                                    onClick={
                                        handleVaccinationReminderToggle
                                    }
                                    disabled={saving}
                                >

                                    <div></div>

                                </button>

                            </div>


                            {/* Email Notifications */}

                            <div className="settings-toggle-row">

                                <div className="option-icon">
                                    ✉
                                </div>


                                <div className="option-content">

                                    <strong>
                                        Email Notifications
                                    </strong>


                                    <span>
                                        Receive important updates through email.
                                    </span>

                                </div>


                                <button
                                    className={`toggle ${
                                        emailNotifications
                                            ? "on"
                                            : ""
                                    }`}
                                    onClick={
                                        handleEmailNotificationToggle
                                    }
                                    disabled={saving}
                                >

                                    <div></div>

                                </button>

                            </div>


                            {/* Overdue Alerts */}

                            <div className="settings-toggle-row">

                                <div className="option-icon">
                                    !
                                </div>


                                <div className="option-content">

                                    <strong>
                                        Overdue Alerts
                                    </strong>


                                    <span>
                                        Get notified if a vaccination becomes overdue.
                                    </span>

                                </div>


                                <button
                                    className={`toggle ${
                                        overdueAlerts
                                            ? "on"
                                            : ""
                                    }`}
                                    onClick={
                                        handleOverdueAlertToggle
                                    }
                                    disabled={saving}
                                >

                                    <div></div>

                                </button>

                            </div>

                        </div>

                    </section>


                    {/* ================= REMINDER ================= */}

                    <section className="settings-card">


                        <div className="settings-section-heading">

                            <div className="settings-section-icon">
                                ◷
                            </div>


                            <div>

                                <span>
                                    REMINDERS
                                </span>


                                <h2>
                                    Reminder Preferences
                                </h2>


                                <p>
                                    Set how early you want to be reminded about vaccinations.
                                </p>

                            </div>

                        </div>


                        <div className="reminder-preference">

                            <label>
                                Remind me before vaccination
                            </label>


                            <select
                                value={reminderDays}
                                onChange={
                                    handleReminderDaysChange
                                }
                                disabled={saving}
                            >

                                <option value="1">
                                    1 day before
                                </option>


                                <option value="2">
                                    2 days before
                                </option>


                                <option value="3">
                                    3 days before
                                </option>


                                <option value="7">
                                    1 week before
                                </option>

                            </select>

                        </div>

                    </section>


                    {/* ================= DANGER ZONE ================= */}

                    <section className="settings-card danger-card">


                        <div className="danger-content">

                            <span>
                                DANGER ZONE
                            </span>


                            <h2>
                                Delete Account
                            </h2>


                            <p>
                                Permanently delete your account, children and all vaccination schedules.
                            </p>

                        </div>


                        <button
                            className="delete-account-btn"
                            onClick={
                                handleDeleteAccount
                            }
                        >

                            Delete Account

                        </button>

                    </section>


                    <div className="settings-last-updated">

                        {saving
                            ? "Saving settings..."
                            : "Settings are saved automatically"}

                    </div>

                </div>

            </main>


            {/* ================= MOBILE NAV ================= */}

            <nav className="settings-mobile-nav">

                <a href="/dashboard">
                    <span>⌂</span>
                    Dashboard
                </a>


                <a href="/children">
                    <span>♙</span>
                    Children
                </a>


                <a href="/schedule">
                    <span>▣</span>
                    Schedule
                </a>


                <a href="/reminders">
                    <span>♧</span>
                    Reminders
                </a>


                <a href="/reports">
                    <span>▥</span>
                    Reports
                </a>


                <a href="/profile">
                    <span>◉</span>
                    Profile
                </a>


                <a
                    href="/settings"
                    className="active"
                >
                    <span>⚙</span>
                    Settings
                </a>

            </nav>

        </div>

    );

}


export default Settings;