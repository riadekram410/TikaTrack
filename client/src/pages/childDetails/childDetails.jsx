import "./childDetails.css";

function ChildDetails() {
  const vaccines = [
    {
      name: "BCG",
      date: "12 March 2024",
      status: "Completed",
      dose: "Dose 1",
    },
    {
      name: "OPV-0",
      date: "12 March 2024",
      status: "Completed",
      dose: "Dose 1",
    },
    {
      name: "Penta-1",
      date: "20 April 2024",
      status: "Completed",
      dose: "Dose 1",
    },
    {
      name: "Penta-2",
      date: "20 May 2024",
      status: "Upcoming",
      dose: "Dose 2",
    },
    {
      name: "PCV-2",
      date: "25 May 2024",
      status: "Upcoming",
      dose: "Dose 2",
    },
  ];

  return (
    <div className="child-details-page">

      {/* SIDEBAR */}
      <aside className="child-details-sidebar">

        <div className="child-details-logo">
          Tika<span>Track</span>
        </div>

        <nav className="child-details-nav">

          <a href="/dashboard">
            <span>⌂</span>
            Dashboard
          </a>

          <a href="/children" className="active">
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

          <a href="/settings">
            <span>⚙</span>
            Settings
          </a>

        </nav>

        <button className="child-details-logout">
          <span>↪</span>
          Logout
        </button>

      </aside>


      {/* MAIN */}
      <main className="child-details-main">

        {/* TOPBAR */}
        <header className="child-details-topbar">

          <button className="child-details-mobile-menu">
            ☰
          </button>

          <div className="child-details-top-space"></div>

          <button className="child-details-notification">
            ♧
            <span></span>
          </button>

          <div className="child-details-user">

            <div className="child-details-user-avatar">
              F
            </div>

            <div className="child-details-user-info">
              <strong>Farzana Akter</strong>
              <small>Guardian</small>
            </div>

            <span className="child-details-arrow">
              ▼
            </span>

          </div>

        </header>


        {/* CONTENT */}
        <div className="child-details-content">

          {/* BACK */}
          <a
            href="/children"
            className="child-details-back"
          >
            ← Back to Children
          </a>


          {/* HEADER */}
          <section className="child-profile-header">

            <div className="child-profile-left">

              <div className="child-profile-avatar">
                AR
              </div>

              <div>

                <span className="child-profile-label">
                  CHILD PROFILE
                </span>

                <h1>
                  Ahnaf <span>Rahman</span>
                </h1>

                <p>
                  Male · 1 Year 2 Months
                </p>

                <small>
                  Date of Birth: 12 March 2024
                </small>

              </div>

            </div>

            <button className="child-edit-button">
              ✎ Edit Profile
            </button>

          </section>


          {/* SUMMARY CARDS */}
          <section className="child-detail-summary">

            <div className="detail-summary-card">

              <div className="detail-summary-icon green">
                ✓
              </div>

              <div>
                <strong>3</strong>
                <span>Completed</span>
              </div>

            </div>


            <div className="detail-summary-card">

              <div className="detail-summary-icon orange">
                ♧
              </div>

              <div>
                <strong>2</strong>
                <span>Upcoming</span>
              </div>

            </div>


            <div className="detail-summary-card">

              <div className="detail-summary-icon red">
                !
              </div>

              <div>
                <strong>0</strong>
                <span>Overdue</span>
              </div>

            </div>


            <div className="detail-summary-card">

              <div className="detail-summary-icon blue">
                %
              </div>

              <div>
                <strong>60%</strong>
                <span>Progress</span>
              </div>

            </div>

          </section>


          {/* TWO COLUMN AREA */}
          <div className="child-details-grid">


            {/* LEFT */}
            <section className="vaccination-history-card">

              <div className="detail-card-heading">

                <div>
                  <span>
                    VACCINATION RECORD
                  </span>

                  <h2>
                    Vaccination History
                  </h2>
                </div>

                <button>
                  View All
                </button>

              </div>


              <div className="vaccination-list">

                {vaccines.map((vaccine, index) => (

                  <div
                    className="vaccination-item"
                    key={index}
                  >

                    <div
                      className={`vaccination-status ${
                        vaccine.status === "Completed"
                          ? "completed"
                          : "upcoming"
                      }`}
                    >
                      {vaccine.status === "Completed"
                        ? "✓"
                        : "○"}
                    </div>

                    <div className="vaccination-info">

                      <strong>
                        {vaccine.name}
                      </strong>

                      <span>
                        {vaccine.dose}
                      </span>

                    </div>

                    <div className="vaccination-date">

                      <strong>
                        {vaccine.date}
                      </strong>

                      <span
                        className={
                          vaccine.status === "Completed"
                            ? "completed-text"
                            : "upcoming-text"
                        }
                      >
                        {vaccine.status}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            </section>


            {/* RIGHT */}
            <aside className="next-vaccine-card">

              <div className="next-vaccine-heading">
                <span>
                  NEXT VACCINATION
                </span>

                <div className="next-vaccine-big-icon">
                  💉
                </div>
              </div>

              <h2>
                Penta-2
              </h2>

              <p>
                Second dose of Pentavalent vaccine
              </p>

              <div className="next-vaccine-date-box">

                <span>
                  DUE DATE
                </span>

                <strong>
                  20 May 2024
                </strong>

                <small>
                  Upcoming vaccination
                </small>

              </div>

              <button className="schedule-reminder-button">
                🔔 Set Reminder
              </button>

            </aside>

          </div>


          {/* PROGRESS SECTION */}
          <section className="overall-progress-card">

            <div className="overall-progress-header">

              <div>
                <span>
                  VACCINATION PROGRESS
                </span>

                <h2>
                  Overall Progress
                </h2>
              </div>

              <strong>
                60%
              </strong>

            </div>

            <div className="overall-progress-bar">

              <div
                style={{
                  width: "60%",
                }}
              ></div>

            </div>

            <div className="overall-progress-bottom">

              <span>
                3 vaccinations completed
              </span>

              <span>
                2 vaccinations remaining
              </span>

            </div>

          </section>


          {/* NOTES */}
          <section className="child-notes-card">

            <div className="notes-icon">
              ✎
            </div>

            <div>

              <span>
                IMPORTANT NOTE
              </span>

              <h3>
                Keep vaccination records updated
              </h3>

              <p>
                After receiving a vaccination, update the record
                so TikaTrack can keep the schedule accurate.
              </p>

            </div>

          </section>

        </div>

      </main>


      {/* MOBILE NAV */}
      <nav className="child-details-mobile-nav">

        <a href="/dashboard">
          <span>⌂</span>
          Dashboard
        </a>

        <a href="/children" className="active">
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

        <a href="/profile">
          <span>◉</span>
          Profile
        </a>

      </nav>

    </div>
  );
}

export default ChildDetails;