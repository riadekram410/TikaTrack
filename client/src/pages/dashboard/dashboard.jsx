import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const API = import.meta.env.VITE_API_URL;

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [children, setChildren] = useState([]);
  const [vaccines, setVaccines] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH DASHBOARD DATA =================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          profileResponse,
          childrenResponse,
          scheduleResponse,
        ] = await Promise.all([
          fetch(`${API}/users/profile`, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),

          fetch(`${API}/children`, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),

          fetch(`${API}/schedules`, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        // ================= PROFILE =================
        if (profileResponse.ok) {
          const profileData =
            await profileResponse.json();

          setUser(profileData.user);
        }

        // ================= CHILDREN =================
        if (childrenResponse.ok) {
          const childData =
            await childrenResponse.json();

          setChildren(
            childData.children || []
          );
        }

        // ================= SCHEDULES =================
        if (scheduleResponse.ok) {
          const scheduleData =
            await scheduleResponse.json();

          setVaccines(
            scheduleData.schedules || []
          );
        }

        // ================= AUTHENTICATION =================
        if (
          !profileResponse.ok &&
          childrenResponse.status === 401
        ) {
          navigate("/login", {
            replace: true,
          });

          return;
        }
      } catch (err) {
        console.error(
          "Failed to fetch dashboard data:",
          err
        );

        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${API}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Logout failed:",
          data.error
        );

        return;
      }

      console.log(data.message);

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

  // ================= VACCINE STATUS =================
  const getVaccineStatus = (vaccine) => {
    if (vaccine.status === "Completed") {
      return "Completed";
    }

    if (vaccine.status === "Overdue") {
      return "Overdue";
    }

    if (vaccine.status === "Upcoming") {
      return "Upcoming";
    }

    const vaccineDate =
      new Date(vaccine.date);

    const today = new Date();

    if (vaccineDate < today) {
      return "Overdue";
    }

    return "Upcoming";
  };

  // ================= COUNTS =================
  const completedVaccines =
    vaccines.filter(
      (vaccine) =>
        getVaccineStatus(vaccine) ===
        "Completed"
    );

  const upcomingVaccines =
    vaccines.filter(
      (vaccine) =>
        getVaccineStatus(vaccine) ===
        "Upcoming"
    );

  const overdueVaccines =
    vaccines.filter(
      (vaccine) =>
        getVaccineStatus(vaccine) ===
        "Overdue"
    );

  const totalVaccines =
    vaccines.length;

  const completedCount =
    completedVaccines.length;

  const upcomingCount =
    upcomingVaccines.length;

  const overdueCount =
    overdueVaccines.length;

  const progress =
    totalVaccines > 0
      ? Math.round(
          (completedCount /
            totalVaccines) *
            100
        )
      : 0;

  // ================= UPCOMING VACCINATIONS =================
  const nextVaccinations =
    [...upcomingVaccines]
      .sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      )
      .slice(0, 5);

  // ================= CHILD NAME =================
  const getChildName = (vaccine) => {
    if (
      vaccine.childId &&
      typeof vaccine.childId ===
        "object"
    ) {
      return (
        vaccine.childId.name ||
        "Child"
      );
    }

    const child = children.find(
      (item) =>
        String(item._id) ===
        String(vaccine.childId)
    );

    return (
      child?.name ||
      "Child"
    );
  };

  // ================= FORMAT DATE =================
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ================= AGE =================
  const calculateAge = (
    dateOfBirth
  ) => {
    if (!dateOfBirth) {
      return "";
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

    if (
      today.getDate() <
      dob.getDate()
    ) {
      months--;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0) {
      return `${years} Year${
        years > 1 ? "s" : ""
      } ${months} Month${
        months !== 1 ? "s" : ""
      }`;
    }

    return `${months} Month${
      months !== 1 ? "s" : ""
    }`;
  };

  // ================= NEXT VACCINE =================
  const getNextVaccine = (
    childId
  ) => {
    const childSchedules =
      vaccines.filter(
        (vaccine) =>
          String(
            vaccine.childId?._id ||
              vaccine.childId
          ) ===
          String(childId)
      );

    const upcoming =
      childSchedules
        .filter(
          (vaccine) =>
            getVaccineStatus(
              vaccine
            ) === "Upcoming"
        )
        .sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        );

    return (
      upcoming[0]?.name ||
      "No upcoming vaccine"
    );
  };

  // ================= VIEW CHILD =================
  const handleViewChild = (
    childId
  ) => {
    navigate(
      `/child-details?id=${childId}`
    );
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="dashboard-page">
        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >
          Loading dashboard...
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="dashboard-page">
        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >
          <p>{error}</p>

          <button
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}
      <aside className="dashboard-sidebar">

        <div className="sidebar-logo">
          Tika<span>Track</span>
        </div>

        <nav className="sidebar-nav">

          <a
            href="/dashboard"
            className="sidebar-link active"
          >
            <span className="sidebar-icon">
              ⌂
            </span>

            <span>
              Dashboard
            </span>
          </a>

          <a
            href="/children"
            className="sidebar-link"
          >
            <span className="sidebar-icon">
              ♙
            </span>

            <span>
              Children
            </span>
          </a>

          <a
            href="/schedule"
            className="sidebar-link"
          >
            <span className="sidebar-icon">
              ▣
            </span>

            <span>
              Schedule
            </span>
          </a>

          <a
            href="/reminders"
            className="sidebar-link"
          >
            <span className="sidebar-icon">
              ♧
            </span>

            <span>
              Reminders
            </span>
          </a>

          <a
            href="/reports"
            className="sidebar-link"
          >
            <span className="sidebar-icon">
              ▥
            </span>

            <span>
              Reports
            </span>
          </a>

          <a
            href="/profile"
            className="sidebar-link"
          >
            <span className="sidebar-icon">
              ◉
            </span>

            <span>
              Profile
            </span>
          </a>

          <a
            href="/settings"
            className="sidebar-link"
          >
            <span className="sidebar-icon">
              ⚙
            </span>

            <span>
              Settings
            </span>
          </a>

        </nav>

        {/* ================= LOGOUT ================= */}
        

      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="dashboard-main">

        {/* ================= TOPBAR ================= */}
        <header className="dashboard-topbar">

          <div className="mobile-menu-button">
            ☰
          </div>

          <div className="topbar-spacer"></div>

          {/* NOTIFICATION */}
         

          {/* SIMPLE USER INFO */}
          <div className="user-profile">

            <div className="user-avatar">
              {user?.name
                ?.charAt(0)
                .toUpperCase() ||
                "G"}
            </div>

            <div className="user-info">

              <strong>
                {user?.name ||
                  "Guardian"}
              </strong>

              <span>
                Guardian
              </span>

            </div>

           
          </div>

        </header>

        {/* ================= CONTENT ================= */}
        <div className="dashboard-content">

          {/* ================= WELCOME ================= */}
          <section className="dashboard-welcome">

            <div>

              <span className="welcome-label">
                GUARDIAN DASHBOARD
              </span>

              <h1>
                Welcome back,{" "}
                <span>
                  {user?.name ||
                    "Guardian"}
                  !
                </span>
              </h1>

              <p>
                Here's a quick overview
                of your children's
                vaccination schedule.
              </p>

            </div>

            

          </section>

          {/* ================= SUMMARY CARDS ================= */}
          <section className="summary-grid">

            {/* CHILDREN */}
            <div
              className="summary-card"
              onClick={() =>
                navigate("/children")
              }
              style={{
                cursor: "pointer",
              }}
            >

              <div className="summary-card-top">

                <div className="summary-icon green">
                  ♙
                </div>

                <span className="summary-arrow">
                  →
                </span>

              </div>

              <div className="summary-number">
                {children.length}
              </div>

              <div className="summary-title">
                Children
              </div>

              <p>
                Registered children
              </p>

            </div>

            {/* UPCOMING */}
            <div
              className="summary-card"
              onClick={() =>
                navigate("/schedule")
              }
              style={{
                cursor: "pointer",
              }}
            >

              <div className="summary-card-top">

                <div className="summary-icon orange">
                  ♧
                </div>

                <span className="summary-arrow">
                  →
                </span>

              </div>

              <div className="summary-number">
                {upcomingCount}
              </div>

              <div className="summary-title">
                Upcoming Doses
              </div>

              <p>
                Vaccinations coming up
              </p>

            </div>

            {/* COMPLETED */}
            <div
              className="summary-card"
              onClick={() =>
                navigate("/reports")
              }
              style={{
                cursor: "pointer",
              }}
            >

              <div className="summary-card-top">

                <div className="summary-icon blue">
                  ✓
                </div>

                <span className="summary-arrow">
                  →
                </span>

              </div>

              <div className="summary-number">
                {completedCount}
              </div>

              <div className="summary-title">
                Completed Doses
              </div>

              <p>
                Successfully completed
              </p>

            </div>

            {/* ON SCHEDULE */}
            <div
              className="summary-card"
              onClick={() =>
                navigate("/reports")
              }
              style={{
                cursor: "pointer",
              }}
            >

              <div className="summary-card-top">

                <div className="summary-icon purple">
                  %
                </div>

                <span className="summary-arrow">
                  →
                </span>

              </div>

              <div className="summary-number">
                {progress}%
              </div>

              <div className="summary-title">
                On Schedule
              </div>

              <p>
                Vaccinations completed
              </p>

            </div>

          </section>

          {/* ================= MAIN GRID ================= */}
          <section className="dashboard-grid">

            {/* ================= UPCOMING VACCINATIONS ================= */}
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

                <a
                  href="/schedule"
                  className="view-all"
                >
                  View all →
                </a>

              </div>

              <div className="vaccination-list">

                {nextVaccinations.length ===
                0 ? (

                  <div
                    style={{
                      padding: "20px",
                      textAlign:
                        "center",
                    }}
                  >
                    No upcoming
                    vaccinations.
                  </div>

                ) : (

                  nextVaccinations.map(
                    (item) => (

                      <div
                        className="vaccination-item"
                        key={item._id}
                      >

                        <div className="vaccine-icon">
                          💉
                        </div>

                        <div className="vaccine-info">

                          <strong>
                            {item.name}
                          </strong>

                          <span>
                            {getChildName(
                              item
                            )}
                          </span>

                        </div>

                        <div className="vaccine-date">

                          <strong>
                            {formatDate(
                              item.date
                            )}
                          </strong>

                          <span className="status-upcoming">
                            Upcoming
                          </span>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

            {/* ================= PROGRESS ================= */}
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

                <a
                  href="/reports"
                  className="view-all"
                >
                  Details →
                </a>

              </div>

              <div className="progress-content">

                <div
                  className="progress-circle"
                  style={{
                    background:
                      `conic-gradient(
                        #198754 ${progress}%,
                        #e8eeee ${progress}% 100%
                      )`,
                  }}
                >

                  <div className="progress-inner">

                    <strong>
                      {progress}%
                    </strong>

                    <span>
                      Completed
                    </span>

                  </div>

                </div>

                <div className="progress-legend">

                  <div className="legend-item">

                    <span className="legend-dot completed"></span>

                    <span>
                      Completed
                    </span>

                    <strong>
                      {completedCount}
                    </strong>

                  </div>

                  <div className="legend-item">

                    <span className="legend-dot upcoming"></span>

                    <span>
                      Upcoming
                    </span>

                    <strong>
                      {upcomingCount}
                    </strong>

                  </div>

                  <div className="legend-item">

                    <span className="legend-dot overdue"></span>

                    <span>
                      Overdue
                    </span>

                    <strong>
                      {overdueCount}
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

      {/* ================= MOBILE NAVIGATION ================= */}
      <nav className="mobile-bottom-nav">

        <a
          href="/dashboard"
          className="mobile-nav-link active"
        >
          <span>
            ⌂
          </span>

          Dashboard
        </a>

        <a
          href="/children"
          className="mobile-nav-link"
        >
          <span>
            ♙
          </span>

          Children
        </a>

        <a
          href="/schedule"
          className="mobile-nav-link"
        >
          <span>
            ▣
          </span>

          Schedule
        </a>

        <a
          href="/reminders"
          className="mobile-nav-link"
        >
          <span>
            ♧
          </span>

          Reminders
        </a>

        <a
          href="/profile"
          className="mobile-nav-link"
        >
          <span>
            ◉
          </span>

          Profile
        </a>

      </nav>

    </div>
  );
}

export default Dashboard;
