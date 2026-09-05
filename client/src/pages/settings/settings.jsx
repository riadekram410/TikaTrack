import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./settings.css";

function Settings() {
  const navigate = useNavigate();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [vaccinationReminders, setVaccinationReminders] = useState(true);
  const [overdueAlerts, setOverdueAlerts] = useState(true);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Logout failed:", data.error);
        return;
      }

      console.log(data.message);

      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

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

          <a href="/settings" className="active">
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

          <div className="settings-top-space"></div>

          <button className="settings-notification">
            ♧
            <span></span>
          </button>

          <div className="settings-user">

            <div className="settings-user-avatar">
              F
            </div>

            <div className="settings-user-info">
              <strong>Farzana Akter</strong>
              <small>Guardian</small>
            </div>

            <span className="settings-user-arrow">
              ▼
            </span>

          </div>

        </header>


        {/* ================= CONTENT ================= */}
        <div className="settings-content">

          {/* HEADER */}
          <div className="settings-page-header">

            <div>
              <span className="settings-label">
                ACCOUNT SETTINGS
              </span>

              <h1>
                Settings
              </h1>

              <p>
                Manage your account preferences and notification settings.
              </p>
            </div>

          </div>


          {/* ACCOUNT SETTINGS */}
          <section className="settings-card">

            <div className="settings-section-heading">

              <div className="settings-section-icon">
                ◉
              </div>

              <div>
                <span>ACCOUNT</span>

                <h2>
                  Account Settings
                </h2>

                <p>
                  Manage your basic account information.
                </p>
              </div>

            </div>


            <div className="settings-options">

              <div className="settings-option">

                <div className="option-icon">
                  ✉
                </div>

                <div className="option-content">
                  <strong>Email Address</strong>
                  <span>
                    farzana@example.com
                  </span>
                </div>

                <button className="settings-action">
                  Change
                </button>

              </div>


              <div className="settings-option">

                <div className="option-icon">
                  🔒
                </div>

                <div className="option-content">
                  <strong>Password</strong>
                  <span>
                    Last changed recently
                  </span>
                </div>

                <button className="settings-action">
                  Change
                </button>

              </div>

            </div>

          </section>


          {/* NOTIFICATION SETTINGS */}
          <section className="settings-card">

            <div className="settings-section-heading">

              <div className="settings-section-icon">
                🔔
              </div>

              <div>
                <span>NOTIFICATIONS</span>

                <h2>
                  Notification Preferences
                </h2>

                <p>
                  Choose how you want to receive vaccination reminders.
                </p>
              </div>

            </div>


            <div className="settings-options">

              {/* OPTION 1 */}
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
                    vaccinationReminders ? "on" : ""
                  }`}
                  onClick={() =>
                    setVaccinationReminders(
                      !vaccinationReminders
                    )
                  }
                >
                  <div></div>
                </button>

              </div>


              {/* OPTION 2 */}
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
                    emailNotifications ? "on" : ""
                  }`}
                  onClick={() =>
                    setEmailNotifications(
                      !emailNotifications
                    )
                  }
                >
                  <div></div>
                </button>

              </div>


              {/* OPTION 3 */}
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
                    overdueAlerts ? "on" : ""
                  }`}
                  onClick={() =>
                    setOverdueAlerts(
                      !overdueAlerts
                    )
                  }
                >
                  <div></div>
                </button>

              </div>

            </div>

          </section>


          {/* REMINDER SETTINGS */}
          <section className="settings-card">

            <div className="settings-section-heading">

              <div className="settings-section-icon">
                ◷
              </div>

              <div>
                <span>REMINDERS</span>

                <h2>
                  Reminder Preferences
                </h2>

                <p>
                  Set how early you want to be reminded.
                </p>
              </div>

            </div>


            <div className="reminder-preference">

              <label>
                Remind me before vaccination
              </label>

              <select defaultValue="3">
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


          {/* PRIVACY */}
          <section className="settings-card">

            <div className="settings-section-heading">

              <div className="settings-section-icon">
                🔒
              </div>

              <div>
                <span>PRIVACY</span>

                <h2>
                  Privacy & Security
                </h2>

                <p>
                  Manage your account security and privacy preferences.
                </p>
              </div>

            </div>


            <div className="privacy-options">

              <button className="privacy-btn">
                Change Password
                <span>→</span>
              </button>

              <button className="privacy-btn">
                Privacy Policy
                <span>→</span>
              </button>

            </div>

          </section>


          {/* DANGER ZONE */}
          <section className="settings-card danger-card">

            <div className="danger-content">

              <span>DANGER ZONE</span>

              <h2>
                Delete Account
              </h2>

              <p>
                Permanently delete your account and all associated data.
              </p>

            </div>

            <button className="delete-account-btn">
              Delete Account
            </button>

          </section>


          <div className="settings-last-updated">
            Settings are saved automatically
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