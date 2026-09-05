import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

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

  const upcomingVaccinations = [
    {
      vaccine: "BCG",
      child: "Ahnaf Rahman",
      date: "15 May 2025",
      status: "Upcoming",
    },
    {
      vaccine: "Penta-1",
      child: "Ahnaf Rahman",
      date: "20 May 2025",
      status: "Upcoming",
    },
    {
      vaccine: "PCV-1",
      child: "Ahnaf Rahman",
      date: "20 May 2025",
      status: "Upcoming",
    },
    {
      vaccine: "MR",
      child: "Ahnaf Rahman",
      date: "15 Dec 2025",
      status: "Upcoming",
    },
  ];

  return (
    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}
      <aside className="dashboard-sidebar">

        <div className="sidebar-logo">
          Tika<span>Track</span>
        </div>

        <nav className="sidebar-nav">

          <a href="/dashboard" className="sidebar-link active">
            <span className="sidebar-icon">⌂</span>
            <span>Dashboard</span>
          </a>

          <a href="/children" className="sidebar-link">
            <span className="sidebar-icon">♙</span>
            <span>Children</span>
          </a>

          <a href="/schedule" className="sidebar-link">
            <span className="sidebar-icon">▣</span>
            <span>Schedule</span>
          </a>

          <a href="/reminders" className="sidebar-link">
            <span className="sidebar-icon">♧</span>
            <span>Reminders</span>
          </a>

          <a href="/reports" className="sidebar-link">
            <span className="sidebar-icon">▥</span>
            <span>Reports</span>
          </a>

          <a href="/profile" className="sidebar-link">
            <span className="sidebar-icon">◉</span>
            <span>Profile</span>
          </a>

          <a href="/settings" className="sidebar-link">
            <span className="sidebar-icon">⚙</span>
            <span>Settings</span>
          </a>

        </nav>

        

      </aside>


      {/* ================= MAIN CONTENT ================= */}
      <main className="dashboard-main">

        {/* TOPBAR */}
        <header className="dashboard-topbar">

          <div className="mobile-menu-button">
            ☰
          </div>

          <div className="topbar-spacer"></div>

          <button className="notification-button">
            ♧
            <span className="notification-dot"></span>
          </button>

          <div className="user-profile">

            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || "G"}
            </div>

            <div className="user-info">
              <strong>{user?.name || "Guardian"}</strong>
              <span>Guardian</span>
            </div>

            <span className="user-arrow">
              ▼
            </span>

          </div>

        </header>


        {/* CONTENT */}
        <div className="dashboard-content">

          {/* WELCOME */}
          <section className="dashboard-welcome">

            <div>
              <span className="welcome-label">
                GUARDIAN DASHBOARD
              </span>

              <h1>
                Welcome back, <span>{user?.name || "Guardian"}!</span>
              </h1>

              <p>
                Here's a quick overview of your children's
                vaccination schedule.
              </p>
            </div>

            <button className="add-child-button">
              + Add Child
            </button>

          </section>


          {/* ================= SUMMARY CARDS ================= */}
          <section className="summary-grid">

            <div className="summary-card">

              <div className="summary-card-top">
                <div className="summary-icon green">
                  ♙
                </div>

                <span className="summary-arrow">
                  →
                </span>
              </div>

              <div className="summary-number">
                2
              </div>

              <div className="summary-title">
                Children
              </div>

              <p>
                Registered children
              </p>

            </div>


            <div className="summary-card">

              <div className="summary-card-top">
                <div className="summary-icon orange">
                  ♧
                </div>

                <span className="summary-arrow">
                  →
                </span>
              </div>

              <div className="summary-number">
                5
              </div>

              <div className="summary-title">
                Upcoming Doses
              </div>

              <p>
                Vaccinations coming up
              </p>

            </div>


            <div className="summary-card">

              <div className="summary-card-top">
                <div className="summary-icon blue">
                  ✓
                </div>

                <span className="summary-arrow">
                  →
                </span>
              </div>

              <div className="summary-number">
                3
              </div>

              <div className="summary-title">
                Completed Doses
              </div>

              <p>
                Successfully completed
              </p>

            </div>


            <div className="summary-card">

              <div className="summary-card-top">
                <div className="summary-icon purple">
                  %
                </div>

                <span className="summary-arrow">
                  →
                </span>
              </div>

              <div className="summary-number">
                100%
              </div>

              <div className="summary-title">
                On Schedule
              </div>

              <p>
                Vaccinations on time
              </p>

            </div>

          </section>


          {/* ================= MAIN GRID ================= */}
          <section className="dashboard-grid">

            {/* UPCOMING VACCINATIONS */}
            <div className="dashboard-card upcoming-card">

              <div className="card-header">

                <div>
                  <span className="card-label">
                    SCHEDULE
                  </span>

                  <h2>
                    Upcoming Vaccinations
                  </h2>
                </div>

                <a href="/schedule" className="view-all">
                  View all →
                </a>

              </div>


              <div className="vaccination-list">

                {upcomingVaccinations.map((item, index) => (

                  <div
                    className="vaccination-item"
                    key={index}
                  >

                    <div className="vaccine-icon">
                      💉
                    </div>

                    <div className="vaccine-info">

                      <strong>
                        {item.vaccine}
                      </strong>

                      <span>
                        {item.child}
                      </span>

                    </div>

                    <div className="vaccine-date">

                      <strong>
                        {item.date}
                      </strong>

                      <span className="status-upcoming">
                        {item.status}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            </div>


            {/* PROGRESS CARD */}
            <div className="dashboard-card progress-card">

              <div className="card-header">

                <div>
                  <span className="card-label">
                    OVERVIEW
                  </span>

                  <h2>
                    Vaccination Progress
                  </h2>
                </div>

                <a href="/reports" className="view-all">
                  Details →
                </a>

              </div>


              <div className="progress-content">

                <div className="progress-circle">

                  <div className="progress-inner">

                    <strong>
                      60%
                    </strong>

                    <span>
                      Completed
                    </span>

                  </div>

                </div>


                <div className="progress-legend">

                  <div className="legend-item">
                    <span className="legend-dot completed"></span>
                    <span>Completed</span>
                    <strong>3</strong>
                  </div>

                  <div className="legend-item">
                    <span className="legend-dot upcoming"></span>
                    <span>Upcoming</span>
                    <strong>2</strong>
                  </div>

                  <div className="legend-item">
                    <span className="legend-dot overdue"></span>
                    <span>Overdue</span>
                    <strong>0</strong>
                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* ================= CHILDREN ================= */}
          <section className="dashboard-card children-card">

            <div className="card-header">

              <div>
                <span className="card-label">
                  MY CHILDREN
                </span>

                <h2>
                  Children Overview
                </h2>
              </div>

              <button className="small-add-button">
                + Add Child
              </button>

            </div>


            <div className="children-grid">

              <div className="child-item">

                <div className="child-avatar">
                  AR
                </div>

                <div className="child-details">

                  <h3>
                    Ahnaf Rahman
                  </h3>

                  <p>
                    Male · 1 Year 2 Months
                  </p>

                  <span>
                    Next vaccine: Penta-1
                  </span>

                </div>

                <button className="child-view-button">
                  View →
                </button>

              </div>


              <div className="child-item">

                <div className="child-avatar">
                  SA
                </div>

                <div className="child-details">

                  <h3>
                    Sara Akter
                  </h3>

                  <p>
                    Female · 8 Months
                  </p>

                  <span>
                    Next vaccine: PCV-2
                  </span>

                </div>

                <button className="child-view-button">
                  View →
                </button>

              </div>

            </div>

          </section>

        </div>

      </main>


      {/* ================= MOBILE NAVIGATION ================= */}
      <nav className="mobile-bottom-nav">

        <a href="/dashboard" className="mobile-nav-link active">
          <span>⌂</span>
          Dashboard
        </a>

        <a href="/children" className="mobile-nav-link">
          <span>♙</span>
          Children
        </a>

        <a href="/schedule" className="mobile-nav-link">
          <span>▣</span>
          Schedule
        </a>

        <a href="/reminders" className="mobile-nav-link">
          <span>♧</span>
          Reminders
        </a>

        <a href="/profile" className="mobile-nav-link">
          <span>◉</span>
          Profile
        </a>

      </nav>

    </div>
  );
}

export default Dashboard;