import "./children.css";


function Children() {
  const children = [
    {
      id: 1,
      initials: "AR",
      name: "Ahnaf Rahman",
      gender: "Male",
      age: "1 Year 2 Months",
      dob: "12 March 2024",
      progress: 60,
      completed: 3,
      total: 5,
      nextVaccine: "Penta-1",
      nextDate: "20 May 2025",
    },
    {
      id: 2,
      initials: "SA",
      name: "Sara Akter",
      gender: "Female",
      age: "8 Months",
      dob: "05 July 2024",
      progress: 45,
      completed: 4,
      total: 9,
      nextVaccine: "PCV-2",
      nextDate: "25 May 2025",
    },
  ];

  return (
    <div className="children-page">

      {/* ================= SIDEBAR ================= */}
      <aside className="children-sidebar">

        <div className="children-sidebar-logo">
          Tika<span>Track</span>
        </div>

        <nav className="children-sidebar-nav">

          <a href="/dashboard" className="children-sidebar-link">
            <span>⌂</span>
            Dashboard
          </a>

          <a
            href="/children"
            className="children-sidebar-link active"
          >
            <span>♙</span>
            Children
          </a>

          <a href="/schedule" className="children-sidebar-link">
            <span>▣</span>
            Schedule
          </a>

          <a href="/reminders" className="children-sidebar-link">
            <span>♧</span>
            Reminders
          </a>

          <a href="/reports" className="children-sidebar-link">
            <span>▥</span>
            Reports
          </a>

          <a href="/profile" className="children-sidebar-link">
            <span>◉</span>
            Profile
          </a>

          <a href="/settings" className="children-sidebar-link">
            <span>⚙</span>
            Settings
          </a>

        </nav>

        <button className="children-logout">
          <span>↪</span>
          Logout
        </button>

      </aside>


      {/* ================= MAIN ================= */}
      <main className="children-main">

        {/* TOPBAR */}
        <header className="children-topbar">

          <div className="children-topbar-spacer"></div>

          <button className="children-notification">
            ♧
            <span></span>
          </button>

          <div className="children-user">

            <div className="children-user-avatar">
              F
            </div>

            <div className="children-user-info">
              <strong>Farzana Akter</strong>
              <small>Guardian</small>
            </div>

            <span className="children-user-arrow">
              ▼
            </span>

          </div>

        </header>


        {/* CONTENT */}
        <div className="children-content">

          {/* PAGE HEADER */}
          <section className="children-page-header">

            <div>
              <span className="children-label">
                FAMILY
              </span>

              <h1>
                My <span>Children</span>
              </h1>

              <p>
                Manage your children's profiles and vaccination
                information.
              </p>
            </div>

            <button className="children-add-button">
              <span>+</span>
              Add Child
            </button>

          </section>


          {/* ================= SUMMARY ================= */}
          <section className="children-summary">

            <div className="children-summary-card">

              <div className="children-summary-icon green">
                ♙
              </div>

              <div>
                <strong>2</strong>
                <span>Registered Children</span>
              </div>

            </div>


            <div className="children-summary-card">

              <div className="children-summary-icon blue">
                ✓
              </div>

              <div>
                <strong>7</strong>
                <span>Completed Vaccinations</span>
              </div>

            </div>


            <div className="children-summary-card">

              <div className="children-summary-icon orange">
                ♧
              </div>

              <div>
                <strong>2</strong>
                <span>Upcoming Vaccinations</span>
              </div>

            </div>

          </section>


          {/* ================= CHILDREN LIST ================= */}
          <section className="children-list-section">

            <div className="children-section-header">

              <div>
                <span>
                  CHILD PROFILES
                </span>

                <h2>
                  Your Children
                </h2>
              </div>

              <div className="children-count">
                {children.length} Children
              </div>

            </div>


            <div className="children-cards">

              {children.map((child) => (

                <article
                  className="child-profile-card"
                  key={child.id}
                >

                  {/* CARD TOP */}
                  <div className="child-card-top">

                    <div className="child-large-avatar">
                      {child.initials}
                    </div>

                    <div className="child-main-info">

                      <h3>
                        {child.name}
                      </h3>

                      <p>
                        {child.gender} · {child.age}
                      </p>

                      <span>
                        Date of Birth: {child.dob}
                      </span>

                    </div>

                    <button className="child-menu">
                      ⋮
                    </button>

                  </div>


                  {/* PROGRESS */}
                  <div className="child-progress-section">

                    <div className="child-progress-header">

                      <span>
                        Vaccination Progress
                      </span>

                      <strong>
                        {child.progress}%
                      </strong>

                    </div>

                    <div className="child-progress-bar">

                      <div
                        style={{
                          width: `${child.progress}%`,
                        }}
                      ></div>

                    </div>

                    <p>
                      {child.completed} of {child.total} vaccinations
                      completed
                    </p>

                  </div>


                  {/* NEXT VACCINE */}
                  <div className="next-vaccine">

                    <div className="next-vaccine-icon">
                      💉
                    </div>

                    <div className="next-vaccine-info">

                      <span>
                        NEXT VACCINATION
                      </span>

                      <strong>
                        {child.nextVaccine}
                      </strong>

                    </div>

                    <div className="next-vaccine-date">

                      <strong>
                        {child.nextDate}
                      </strong>

                      <span>
                        Upcoming
                      </span>

                    </div>

                  </div>


                  {/* ACTIONS */}
                  <div className="child-card-actions">

                    <button className="view-child-button">
                      View Details
                      <span>→</span>
                    </button>

                    <button className="edit-child-button">
                      Edit Profile
                    </button>

                  </div>

                </article>

              ))}

            </div>

          </section>


          {/* ================= ADD CHILD CARD ================= */}
          <section className="add-child-section">

            <div className="add-child-content">

              <div className="add-child-icon">
                +
              </div>

              <div>

                <h3>
                  Add another child
                </h3>

                <p>
                  Add your child's information to start tracking
                  their vaccinations.
                </p>

              </div>

            </div>

            <button className="add-child-outline-button">
              Add Child
            </button>

          </section>

        </div>

      </main>


      {/* ================= MOBILE NAV ================= */}
      <nav className="children-mobile-nav">

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

export default Children;