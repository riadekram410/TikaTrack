import { useState } from "react";
import "./reminders.css";

function Reminders() {
  const [filter, setFilter] = useState("All");

  const reminders = [
    {
      vaccine: "Penta-2",
      description: "Second dose of Pentavalent Vaccine",
      child: "Ahnaf Rahman",
      date: "20 May 2024",
      time: "10:00 AM",
      status: "Due Soon",
      icon: "💉",
    },
    {
      vaccine: "PCV-2",
      description: "Second dose of Pneumococcal Vaccine",
      child: "Ahnaf Rahman",
      date: "25 May 2024",
      time: "10:00 AM",
      status: "Upcoming",
      icon: "💉",
    },
    {
      vaccine: "OPV-1",
      description: "Second dose of Oral Polio Vaccine",
      child: "Ahnaf Rahman",
      date: "25 May 2024",
      time: "10:00 AM",
      status: "Upcoming",
      icon: "💉",
    },
    {
      vaccine: "Penta-3",
      description: "Third dose of Pentavalent Vaccine",
      child: "Ahnaf Rahman",
      date: "20 June 2024",
      time: "10:00 AM",
      status: "Upcoming",
      icon: "💉",
    },
    {
      vaccine: "BCG",
      description: "Bacillus Calmette–Guérin Vaccine",
      child: "Ahnaf Rahman",
      date: "12 March 2024",
      time: "10:00 AM",
      status: "Completed",
      icon: "✓",
    },
  ];

  const filteredReminders =
    filter === "All"
      ? reminders
      : reminders.filter(
          (reminder) => reminder.status === filter
        );

  const dueSoon = reminders.filter(
    (item) => item.status === "Due Soon"
  ).length;

  const upcoming = reminders.filter(
    (item) => item.status === "Upcoming"
  ).length;

  const completed = reminders.filter(
    (item) => item.status === "Completed"
  ).length;

  return (
    <div className="reminders-page">

      {/* SIDEBAR */}
      <aside className="reminders-sidebar">

        <div className="reminders-logo">
          Tika<span>Track</span>
        </div>

        <nav className="reminders-nav">

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

          <a href="/reminders" className="active">
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

          <a href="/settings">
            <span>⚙</span>
            Settings
          </a>

        </nav>

       

      </aside>


      {/* MAIN */}
      <main className="reminders-main">

        {/* TOPBAR */}
        <header className="reminders-topbar">

          <button className="reminders-mobile-menu">
            ☰
          </button>

          <div className="reminders-top-space"></div>

          <button className="reminders-notification">
            ♧
            <span></span>
          </button>

          <div className="reminders-user">

            <div className="reminders-user-avatar">
              F
            </div>

            <div className="reminders-user-info">
              <strong>Farzana Akter</strong>
              <small>Guardian</small>
            </div>

            <span className="reminders-user-arrow">
              ▼
            </span>

          </div>

        </header>


        {/* CONTENT */}
        <div className="reminders-content">

          {/* PAGE HEADER */}
          <div className="reminders-page-header">

            <div>
              <span className="reminders-label">
                NOTIFICATIONS
              </span>

              <h1>
                Vaccination <span>Reminders</span>
              </h1>

              <p>
                Never miss an important vaccination date.
              </p>
            </div>

            <button className="reminders-settings-btn">
              ⚙ Reminder Settings
            </button>

          </div>


          {/* SUMMARY */}
          <section className="reminders-summary">

            <div className="reminders-summary-card">

              <div className="reminders-summary-icon alert">
                🔔
              </div>

              <div>
                <strong>{dueSoon}</strong>
                <span>Due Soon</span>
              </div>

            </div>


            <div className="reminders-summary-card">

              <div className="reminders-summary-icon upcoming">
                ◷
              </div>

              <div>
                <strong>{upcoming}</strong>
                <span>Upcoming</span>
              </div>

            </div>


            <div className="reminders-summary-card">

              <div className="reminders-summary-icon completed">
                ✓
              </div>

              <div>
                <strong>{completed}</strong>
                <span>Completed</span>
              </div>

            </div>


            <div className="reminders-summary-card">

              <div className="reminders-summary-icon active-icon">
                🔔
              </div>

              <div>
                <strong>ON</strong>
                <span>Reminders Active</span>
              </div>

            </div>

          </section>


          {/* IMPORTANT REMINDER */}
          <section className="important-reminder">

            <div className="important-reminder-icon">
              🔔
            </div>

            <div className="important-reminder-content">

              <span>IMPORTANT REMINDER</span>

              <h2>
                Penta-2 vaccination is due soon
              </h2>

              <p>
                Ahnaf Rahman's second Pentavalent dose
                is scheduled for 20 May 2024.
              </p>

            </div>

            <div className="important-reminder-date">

              <span>DUE IN</span>

              <strong>
                5 Days
              </strong>

            </div>

            <button className="important-action">
              View Schedule
            </button>

          </section>


          {/* REMINDER LIST */}
          <section className="reminders-list-card">

            <div className="reminders-list-header">

              <div>
                <span>
                  REMINDER CENTER
                </span>

                <h2>
                  Your Reminders
                </h2>
              </div>

              <button className="mark-all-btn">
                ✓ Mark All Read
              </button>

            </div>


            {/* FILTER */}
            <div className="reminders-filters">

              {[
                "All",
                "Due Soon",
                "Upcoming",
                "Completed",
              ].map((item) => (

                <button
                  key={item}
                  className={
                    filter === item
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setFilter(item)
                  }
                >
                  {item}
                </button>

              ))}

            </div>


            {/* LIST */}
            <div className="reminders-list">

              {filteredReminders.map(
                (reminder, index) => (

                  <div
                    className="reminder-item"
                    key={index}
                  >

                    <div
                      className={`reminder-icon ${
                        reminder.status
                          .toLowerCase()
                          .replace(" ", "-")
                      }`}
                    >
                      {reminder.icon}
                    </div>


                    <div className="reminder-main-info">

                      <div className="reminder-title-row">

                        <h3>
                          {reminder.vaccine}
                        </h3>

                        <span
                          className={`reminder-status ${
                            reminder.status
                              .toLowerCase()
                              .replace(" ", "-")
                          }`}
                        >
                          {reminder.status}
                        </span>

                      </div>

                      <p>
                        {reminder.description}
                      </p>

                      <div className="reminder-meta">

                        <span>
                          👶 {reminder.child}
                        </span>

                        <span>
                          📅 {reminder.date}
                        </span>

                        <span>
                          ◷ {reminder.time}
                        </span>

                      </div>

                    </div>


                    <div className="reminder-actions">

                      {reminder.status ===
                        "Completed" ? (

                        <button className="completed-btn">
                          ✓ Done
                        </button>

                      ) : (

                        <>
                          <button className="snooze-btn">
                            Snooze
                          </button>

                          <button className="view-btn">
                            View
                          </button>
                        </>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>


            {filteredReminders.length === 0 && (

              <div className="reminders-empty">

                <span>🔔</span>

                <h3>
                  No reminders found
                </h3>

                <p>
                  There are no reminders in this category.
                </p>

              </div>

            )}

          </section>


          {/* REMINDER SETTINGS CARD */}
          <section className="reminder-preferences">

            <div className="preferences-icon">
              ⚙
            </div>

            <div className="preferences-content">

              <span>
                REMINDER PREFERENCES
              </span>

              <h2>
                Keep Your Reminders Active
              </h2>

              <p>
                Receive notifications before your child's
                vaccination is due.
              </p>

            </div>

            <div className="preference-status">

              <span>
                REMINDERS
              </span>

              <strong>
                ON
              </strong>

            </div>

            <button className="preference-btn">
              Manage
            </button>

          </section>

        </div>

      </main>


      {/* MOBILE NAV */}
      <nav className="reminders-mobile-nav">

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

        <a
          href="/reminders"
          className="active"
        >
          <span>♧</span>
          Reminders
        </a>

        <a href="/profile">
          <span>◉</span>
          Profile
        </a>

      </nav>

    </div>
  );
}

export default Reminders;