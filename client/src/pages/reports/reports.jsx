import "./reports.css";

function Reports() {
  return (
    <div className="reports-page">

      {/* ================= SIDEBAR ================= */}
      <aside className="reports-sidebar">

        <div className="reports-logo">
          Tika<span>Track</span>
        </div>

        <nav className="reports-nav">

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

          <a href="/reports" className="active">
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

        <button className="reports-logout">
          <span>↪</span>
          Logout
        </button>

      </aside>


      {/* ================= MAIN ================= */}
      <main className="reports-main">

        {/* TOPBAR */}
        <header className="reports-topbar">

          <button className="reports-mobile-menu">
            ☰
          </button>

          <div className="reports-top-space"></div>

          <button className="reports-notification">
            ♧
            <span></span>
          </button>

          <div className="reports-user">

            <div className="reports-user-avatar">
              F
            </div>

            <div className="reports-user-info">
              <strong>Farzana Akter</strong>
              <small>Guardian</small>
            </div>

            <span className="reports-user-arrow">
              ▼
            </span>

          </div>

        </header>


        {/* ================= CONTENT ================= */}
        <div className="reports-content">

          {/* PAGE HEADER */}
          <div className="reports-page-header">

            <div>
              <span className="reports-label">
                VACCINATION REPORT
              </span>

              <h1>
                Vaccination <span>Reports</span>
              </h1>

              <p>
                View your child's vaccination progress and history.
              </p>
            </div>

            <button className="download-report-btn">
              ↓ Download Report
            </button>

          </div>


          {/* CHILD SELECTOR */}
          <section className="reports-card child-report-header">

            <div className="child-report-avatar">
              A
            </div>

            <div className="child-report-info">
              <span>CHILD</span>

              <h2>
                Ahnaf Rahman
              </h2>

              <p>
                Date of Birth: 20 January 2024
              </p>
            </div>

            <select className="child-select">
              <option>Ahnaf Rahman</option>
              <option>Another Child</option>
            </select>

          </section>


          {/* SUMMARY CARDS */}
          <div className="report-summary-grid">

            <div className="report-summary-card">

              <div className="summary-icon green">
                ✓
              </div>

              <div>
                <span>COMPLETED</span>
                <strong>8</strong>
                <p>Vaccinations completed</p>
              </div>

            </div>


            <div className="report-summary-card">

              <div className="summary-icon blue">
                ◷
              </div>

              <div>
                <span>UPCOMING</span>
                <strong>3</strong>
                <p>Vaccinations upcoming</p>
              </div>

            </div>


            <div className="report-summary-card">

              <div className="summary-icon orange">
                !
              </div>

              <div>
                <span>DUE SOON</span>
                <strong>1</strong>
                <p>Vaccination due soon</p>
              </div>

            </div>


            <div className="report-summary-card">

              <div className="summary-icon red">
                !
              </div>

              <div>
                <span>OVERDUE</span>
                <strong>0</strong>
                <p>Vaccinations overdue</p>
              </div>

            </div>

          </div>


          {/* PROGRESS */}
          <section className="reports-card progress-card">

            <div className="report-section-heading">

              <div>
                <span>OVERALL PROGRESS</span>

                <h2>
                  Vaccination Completion
                </h2>
              </div>

              <strong className="progress-percentage">
                67%
              </strong>

            </div>

            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>

            <div className="progress-details">

              <span>
                8 completed
              </span>

              <span>
                12 total vaccinations
              </span>

            </div>

          </section>


          {/* VACCINATION HISTORY */}
          <section className="reports-card">

            <div className="report-section-heading">

              <div>
                <span>VACCINATION HISTORY</span>

                <h2>
                  Dose History
                </h2>
              </div>

              <select className="report-filter">
                <option>All</option>
                <option>Completed</option>
                <option>Upcoming</option>
                <option>Due Soon</option>
              </select>

            </div>


            <div className="vaccination-table">

              {/* HEADER */}
              <div className="vaccination-row table-header">

                <span>VACCINE</span>
                <span>DOSE</span>
                <span>DATE</span>
                <span>STATUS</span>

              </div>


              {/* ROW 1 */}
              <div className="vaccination-row">

                <div className="vaccine-name">
                  <div className="vaccine-icon green">
                    ✓
                  </div>

                  <div>
                    <strong>BCG</strong>
                    <small>Tuberculosis</small>
                  </div>
                </div>

                <span>
                  Birth Dose
                </span>

                <span>
                  20 Jan 2024
                </span>

                <span className="status completed">
                  Completed
                </span>

              </div>


              {/* ROW 2 */}
              <div className="vaccination-row">

                <div className="vaccine-name">
                  <div className="vaccine-icon green">
                    ✓
                  </div>

                  <div>
                    <strong>Penta-1</strong>
                    <small>Pentavalent Vaccine</small>
                  </div>
                </div>

                <span>
                  Dose 1
                </span>

                <span>
                  20 Feb 2024
                </span>

                <span className="status completed">
                  Completed
                </span>

              </div>


              {/* ROW 3 */}
              <div className="vaccination-row">

                <div className="vaccine-name">
                  <div className="vaccine-icon green">
                    ✓
                  </div>

                  <div>
                    <strong>Penta-2</strong>
                    <small>Pentavalent Vaccine</small>
                  </div>
                </div>

                <span>
                  Dose 2
                </span>

                <span>
                  20 Mar 2024
                </span>

                <span className="status completed">
                  Completed
                </span>

              </div>


              {/* ROW 4 */}
              <div className="vaccination-row">

                <div className="vaccine-name">
                  <div className="vaccine-icon orange">
                    !
                  </div>

                  <div>
                    <strong>Penta-3</strong>
                    <small>Pentavalent Vaccine</small>
                  </div>
                </div>

                <span>
                  Dose 3
                </span>

                <span>
                  20 May 2024
                </span>

                <span className="status due">
                  Due Soon
                </span>

              </div>


              {/* ROW 5 */}
              <div className="vaccination-row">

                <div className="vaccine-name">
                  <div className="vaccine-icon blue">
                    ◷
                  </div>

                  <div>
                    <strong>MR-1</strong>
                    <small>Measles & Rubella</small>
                  </div>
                </div>

                <span>
                  Dose 1
                </span>

                <span>
                  20 Jan 2025
                </span>

                <span className="status upcoming">
                  Upcoming
                </span>

              </div>

            </div>

          </section>


          {/* LAST UPDATED */}
          <div className="report-last-updated">
            Last updated: 18 May 2024
          </div>

        </div>

      </main>


      {/* ================= MOBILE NAV ================= */}
      <nav className="reports-mobile-nav">

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

        <a
          href="/reports"
          className="active"
        >
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

    </div>
  );
}

export default Reports;