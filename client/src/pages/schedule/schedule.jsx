import "./schedule.css";

function Schedule() {
  const vaccines = [
    {
      name: "BCG",
      description: "Bacillus Calmette–Guérin",
      dose: "Dose 1",
      date: "12 March 2024",
      status: "Completed",
    },
    {
      name: "OPV-0",
      description: "Oral Polio Vaccine",
      dose: "Dose 1",
      date: "12 March 2024",
      status: "Completed",
    },
    {
      name: "Penta-1",
      description: "Pentavalent Vaccine",
      dose: "Dose 1",
      date: "20 April 2024",
      status: "Completed",
    },
    {
      name: "PCV-1",
      description: "Pneumococcal Conjugate Vaccine",
      dose: "Dose 1",
      date: "20 April 2024",
      status: "Completed",
    },
    {
      name: "Penta-2",
      description: "Pentavalent Vaccine",
      dose: "Dose 2",
      date: "20 May 2024",
      status: "Upcoming",
    },
    {
      name: "PCV-2",
      description: "Pneumococcal Conjugate Vaccine",
      dose: "Dose 2",
      date: "25 May 2024",
      status: "Upcoming",
    },
    {
      name: "OPV-1",
      description: "Oral Polio Vaccine",
      dose: "Dose 2",
      date: "25 May 2024",
      status: "Upcoming",
    },
    {
      name: "Penta-3",
      description: "Pentavalent Vaccine",
      dose: "Dose 3",
      date: "20 June 2024",
      status: "Upcoming",
    },
    {
      name: "PCV-3",
      description: "Pneumococcal Conjugate Vaccine",
      dose: "Dose 3",
      date: "25 June 2024",
      status: "Upcoming",
    },
  ];

  return (
    <div className="schedule-page">

      {/* SIDEBAR */}
      <aside className="schedule-sidebar">

        <div className="schedule-logo">
          Tika<span>Track</span>
        </div>

        <nav className="schedule-nav">

          <a href="/dashboard">
            <span>⌂</span>
            Dashboard
          </a>

          <a href="/children">
            <span>♙</span>
            Children
          </a>

          <a href="/schedule" className="active">
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

        <button className="schedule-logout">
          <span>↪</span>
          Logout
        </button>

      </aside>


      {/* MAIN */}
      <main className="schedule-main">

        {/* TOPBAR */}
        <header className="schedule-topbar">

          <button className="schedule-mobile-menu">
            ☰
          </button>

          <div className="schedule-top-space"></div>

          <button className="schedule-notification">
            ♧
            <span></span>
          </button>

          <div className="schedule-user">

            <div className="schedule-user-avatar">
              F
            </div>

            <div className="schedule-user-info">
              <strong>Farzana Akter</strong>
              <small>Guardian</small>
            </div>

            <span className="schedule-user-arrow">
              ▼
            </span>

          </div>

        </header>


        {/* CONTENT */}
        <div className="schedule-content">

          {/* HEADER */}
          <div className="schedule-page-header">

            <div>
              <span className="schedule-label">
                VACCINATION PLAN
              </span>

              <h1>
                Vaccination <span>Schedule</span>
              </h1>

              <p>
                Keep track of every vaccination and upcoming dose.
              </p>
            </div>

            <button className="schedule-child-selector">

              <span>👶</span>

              <div>
                <small>CHILD</small>
                <strong>Ahnaf Rahman</strong>
              </div>

              <b>▼</b>

            </button>

          </div>


          {/* SUMMARY */}
          <section className="schedule-summary">

            <div className="schedule-summary-card">

              <div className="schedule-summary-icon total">
                💉
              </div>

              <div>
                <strong>9</strong>
                <span>Total Vaccines</span>
              </div>

            </div>


            <div className="schedule-summary-card">

              <div className="schedule-summary-icon completed">
                ✓
              </div>

              <div>
                <strong>4</strong>
                <span>Completed</span>
              </div>

            </div>


            <div className="schedule-summary-card">

              <div className="schedule-summary-icon upcoming">
                ◷
              </div>

              <div>
                <strong>5</strong>
                <span>Upcoming</span>
              </div>

            </div>


            <div className="schedule-summary-card progress">

              <div className="schedule-progress-circle">
                44%
              </div>

              <div>
                <strong>On Track</strong>
                <span>Vaccination Progress</span>
              </div>

            </div>

          </section>


          {/* NEXT VACCINE */}
          <section className="schedule-next">

            <div className="schedule-next-icon">
              💉
            </div>

            <div className="schedule-next-info">

              <span>NEXT VACCINATION</span>

              <h2>
                Penta-2
              </h2>

              <p>
                Second dose of Pentavalent Vaccine
              </p>

            </div>

            <div className="schedule-next-date">

              <span>DUE DATE</span>

              <strong>
                20 May 2024
              </strong>

              <small>
                Upcoming
              </small>

            </div>

            <button className="schedule-reminder">
              🔔 Set Reminder
            </button>

          </section>


          {/* TABLE CARD */}
          <section className="schedule-table-card">

            <div className="schedule-table-header">

              <div>

                <span>
                  ALL VACCINATIONS
                </span>

                <h2>
                  Vaccination Timeline
                </h2>

              </div>


              {/* SEARCH - STATIC */}
              <div className="schedule-search">

                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search vaccine..."
                />

              </div>

            </div>


            {/* FILTERS - STATIC */}
            <div className="schedule-filters">

              <button className="active">
                All
              </button>

              <button>
                Completed
              </button>

              <button>
                Upcoming
              </button>

              <button>
                Overdue
              </button>

            </div>


            {/* DESKTOP TABLE */}
            <div className="schedule-table-wrapper">

              <table className="schedule-table">

                <thead>

                  <tr>
                    <th>VACCINE</th>
                    <th>DOSE</th>
                    <th>DUE DATE</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>

                </thead>


                <tbody>

                  {vaccines.map((vaccine, index) => (

                    <tr key={index}>

                      <td>

                        <div className="table-vaccine">

                          <div
                            className={`table-vaccine-icon ${
                              vaccine.status === "Completed"
                                ? "green"
                                : "orange"
                            }`}
                          >
                            💉
                          </div>

                          <div>

                            <strong>
                              {vaccine.name}
                            </strong>

                            <span>
                              {vaccine.description}
                            </span>

                          </div>

                        </div>

                      </td>


                      <td>

                        <span className="dose-text">
                          {vaccine.dose}
                        </span>

                      </td>


                      <td>

                        <span className="date-text">
                          {vaccine.date}
                        </span>

                      </td>


                      <td>

                        <span
                          className={`schedule-status ${
                            vaccine.status.toLowerCase()
                          }`}
                        >

                          {vaccine.status === "Completed"
                            ? "✓ "
                            : "◷ "}

                          {vaccine.status}

                        </span>

                      </td>


                      <td>

                        <button className="table-action">
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>


            {/* MOBILE CARDS */}
            <div className="schedule-mobile-list">

              {vaccines.map((vaccine, index) => (

                <div
                  className="schedule-mobile-card"
                  key={index}
                >

                  <div className="mobile-vaccine-top">

                    <div
                      className={`table-vaccine-icon ${
                        vaccine.status === "Completed"
                          ? "green"
                          : "orange"
                      }`}
                    >
                      💉
                    </div>

                    <div>

                      <strong>
                        {vaccine.name}
                      </strong>

                      <span>
                        {vaccine.description}
                      </span>

                    </div>

                  </div>


                  <div className="mobile-vaccine-details">

                    <div>

                      <small>
                        DOSE
                      </small>

                      <strong>
                        {vaccine.dose}
                      </strong>

                    </div>


                    <div>

                      <small>
                        DUE DATE
                      </small>

                      <strong>
                        {vaccine.date}
                      </strong>

                    </div>

                  </div>


                  <span
                    className={`schedule-status ${
                      vaccine.status.toLowerCase()
                    }`}
                  >
                    {vaccine.status}
                  </span>

                </div>

              ))}

            </div>

          </section>

        </div>

      </main>


      {/* MOBILE NAV */}
      <nav className="schedule-mobile-nav">

        <a href="/dashboard">
          <span>⌂</span>
          Dashboard
        </a>

        <a href="/children">
          <span>♙</span>
          Children
        </a>

        <a href="/schedule" className="active">
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

export default Schedule;