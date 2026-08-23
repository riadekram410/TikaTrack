import "./profile.css";

function Profile() {
  return (
    <div className="profile-page">

      {/* SIDEBAR */}
      <aside className="profile-sidebar">

        <div className="profile-logo">
          Tika<span>Track</span>
        </div>

        <nav className="profile-nav">

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

          <a href="/profile" className="active">
            <span>◉</span>
            Profile
          </a>

          <a href="/settings">
            <span>⚙</span>
            Settings
          </a>

        </nav>

        <button className="profile-logout">
          <span>↪</span>
          Logout
        </button>

      </aside>


      {/* MAIN */}
      <main className="profile-main">

        {/* TOPBAR */}
        <header className="profile-topbar">

          <button className="profile-mobile-menu">
            ☰
          </button>

          <div className="profile-top-space"></div>

          <button className="profile-notification">
            ♧
            <span></span>
          </button>

          <div className="profile-user">

            <div className="profile-user-avatar">
              F
            </div>

            <div className="profile-user-info">
              <strong>Farzana Akter</strong>
              <small>Guardian</small>
            </div>

            <span className="profile-user-arrow">
              ▼
            </span>

          </div>

        </header>


        {/* CONTENT */}
        <div className="profile-content">

          {/* PAGE HEADER */}
          <div className="profile-page-header">

            <div>
              <span className="profile-label">
                ACCOUNT
              </span>

              <h1>
                My <span>Profile</span>
              </h1>

              <p>
                Manage your personal information and account details.
              </p>
            </div>

            <button className="edit-profile-btn">
              ✎ Edit Profile
            </button>

          </div>


          {/* PROFILE CARD */}
          <section className="profile-card profile-hero-card">

            <div className="large-profile-avatar">
              F
            </div>

            <div className="profile-hero-info">

              <span className="guardian-badge">
                GUARDIAN
              </span>

              <h2>
                Farzana Akter
              </h2>

              <p>
                farzana@example.com
              </p>

              <div className="profile-member">
                Member since January 2024
              </div>

            </div>

            <div className="profile-account-status">

              <span>
                ACCOUNT STATUS
              </span>

              <strong>
                ● Active
              </strong>

            </div>

          </section>


          {/* PERSONAL INFORMATION */}
          <section className="profile-card">

            <div className="card-heading">

              <div>
                <span>
                  PERSONAL INFORMATION
                </span>

                <h2>
                  Personal Details
                </h2>
              </div>

              <button className="small-edit-btn">
                Edit
              </button>

            </div>


            <div className="profile-form-grid">

              <div className="profile-field">

                <label>
                  First Name
                </label>

                <input
                  type="text"
                  value="Farzana"
                  disabled
                />

              </div>


              <div className="profile-field">

                <label>
                  Last Name
                </label>

                <input
                  type="text"
                  value="Akter"
                  disabled
                />

              </div>


              <div className="profile-field">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  value="farzana@example.com"
                  disabled
                />

              </div>


              <div className="profile-field">

                <label>
                  Phone Number
                </label>

                <input
                  type="text"
                  value="+880 1712-346799"
                  disabled
                />

              </div>


              <div className="profile-field full-field">

                <label>
                  Address
                </label>

                <input
                  type="text"
                  value="Dhaka, Bangladesh"
                  disabled
                />

              </div>

            </div>

          </section>


          {/* ACCOUNT OVERVIEW */}
          <section className="profile-overview-grid">

            <div className="profile-card overview-card">

              <div className="overview-icon">
                👶
              </div>

              <div>
                <span>
                  REGISTERED CHILDREN
                </span>

                <strong>
                  2
                </strong>

                <p>
                  Children in your account
                </p>
              </div>

              <a href="/children">
                View →
              </a>

            </div>


            <div className="profile-card overview-card">

              <div className="overview-icon green">
                💉
              </div>

              <div>
                <span>
                  VACCINATIONS
                </span>

                <strong>
                  18
                </strong>

                <p>
                  Vaccinations tracked
                </p>
              </div>

              <a href="/schedule">
                View →
              </a>

            </div>


            <div className="profile-card overview-card">

              <div className="overview-icon orange">
                🔔
              </div>

              <div>
                <span>
                  REMINDERS
                </span>

                <strong>
                  4
                </strong>

                <p>
                  Upcoming reminders
                </p>
              </div>

              <a href="/reminders">
                View →
              </a>

            </div>

          </section>


          {/* SECURITY */}
          <section className="profile-card security-card">

            <div className="security-icon">
              🔒
            </div>

            <div className="security-content">

              <span>
                ACCOUNT SECURITY
              </span>

              <h2>
                Password & Security
              </h2>

              <p>
                Keep your account secure by using a strong password.
              </p>

            </div>

            <button className="security-btn">
              Change Password
            </button>

          </section>


          {/* NOTIFICATIONS */}
          <section className="profile-card notification-preference">

            <div className="notification-pref-icon">
              🔔
            </div>

            <div className="notification-pref-content">

              <span>
                NOTIFICATIONS
              </span>

              <h2>
                Vaccination Reminders
              </h2>

              <p>
                Receive reminders when your child's vaccination is due.
              </p>

            </div>

            <div className="notification-toggle active">
              <div></div>
            </div>

          </section>

        </div>

      </main>


      {/* MOBILE NAV */}
      <nav className="profile-mobile-nav">

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

        <a
          href="/profile"
          className="active"
        >
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

export default Profile;