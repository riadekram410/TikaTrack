import { useEffect, useState } from "react";
import "./reports.css";

const API = "http://localhost:5000/api";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not available";

const getVaccineStatus = (vaccine) => {
  if (vaccine.status === "Completed") {
    return "Completed";
  }

  const today = new Date();
  const dueDate = new Date(vaccine.date);

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate < today) {
    return "Overdue";
  }

  return "Upcoming";
};

const isDueSoon = (vaccine) => {
  if (getVaccineStatus(vaccine) !== "Upcoming") {
    return false;
  }

  const today = new Date();
  const dueDate = new Date(vaccine.date);

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const difference =
    (dueDate - today) / (1000 * 60 * 60 * 24);

  return difference >= 0 && difference <= 30;
};

function Reports() {
  const [user, setUser] = useState(null);
  const [children, setChildren] = useState([]);
  const [vaccines, setVaccines] = useState([]);

  const [selectedChildId, setSelectedChildId] = useState("");
  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          profileRes,
          childrenRes,
          scheduleRes,
        ] = await Promise.all([
          fetch(`${API}/users/profile`, {
            credentials: "include",
          }),

          fetch(`${API}/children`, {
            credentials: "include",
          }),

          fetch(`${API}/schedules`, {
            credentials: "include",
          }),
        ]);

        const profileData = await profileRes.json();
        const childrenData = await childrenRes.json();
        const scheduleData = await scheduleRes.json();

        if (!profileRes.ok) {
          throw new Error(
            profileData.error || "Failed to load profile"
          );
        }

        if (!childrenRes.ok) {
          throw new Error(
            childrenData.error || "Failed to load children"
          );
        }

        if (!scheduleRes.ok) {
          throw new Error(
            scheduleData.error || "Failed to load schedules"
          );
        }

        const loadedChildren =
          childrenData.children || [];

        setUser(profileData.user);
        setChildren(loadedChildren);
        setVaccines(scheduleData.schedules || []);

        if (loadedChildren.length > 0) {
          setSelectedChildId(loadedChildren[0]._id);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedChild = children.find(
    (child) =>
      String(child._id) === String(selectedChildId)
  );

  const childVaccines = selectedChild
    ? vaccines.filter(
        (vaccine) =>
          String(vaccine.childId?._id) ===
          String(selectedChild._id)
      )
    : [];

  const completedVaccines = childVaccines.filter(
    (vaccine) =>
      getVaccineStatus(vaccine) === "Completed"
  );

  const upcomingVaccines = childVaccines.filter(
    (vaccine) =>
      getVaccineStatus(vaccine) === "Upcoming"
  );

  const overdueVaccines = childVaccines.filter(
    (vaccine) =>
      getVaccineStatus(vaccine) === "Overdue"
  );

  const dueSoonVaccines = upcomingVaccines.filter(
    (vaccine) => isDueSoon(vaccine)
  );

  const completed = completedVaccines.length;
  const upcoming = upcomingVaccines.length;
  const overdue = overdueVaccines.length;
  const dueSoon = dueSoonVaccines.length;
  const total = childVaccines.length;

  const progress = total
    ? Math.round((completed / total) * 100)
    : 0;

  const filteredVaccines = childVaccines.filter(
    (vaccine) => {
      const status = getVaccineStatus(vaccine);

      if (filter === "All") {
        return true;
      }

      if (filter === "Due Soon") {
        return isDueSoon(vaccine);
      }

      return status === filter;
    }
  );

  return (
    <div className="reports-page">

      {/* SIDEBAR */}
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

      </aside>

      {/* MAIN */}
      <main className="reports-main">

        {/* TOPBAR */}
        <header className="reports-topbar">

          <div className="reports-top-space"></div>

          <button className="reports-notification">
            ♧
            <span></span>
          </button>

          <div className="reports-user">

            <div className="reports-user-avatar">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="reports-user-info">
              <strong>
                {user?.name || "User"}
              </strong>

              <small>Guardian</small>
            </div>

            <span className="reports-user-arrow">
              ▼
            </span>

          </div>

        </header>

        {/* CONTENT */}
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

            <button
              className="download-report-btn"
              onClick={() => window.print()}
            >
              ↓ Download Report
            </button>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="reports-card">
              <h2>Loading report...</h2>
              <p>Please wait...</p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="reports-card">
              <h2>Unable to load report</h2>
              <p>{error}</p>
            </div>
          )}

          {/* NO CHILD */}
          {!loading &&
            !error &&
            !selectedChild && (
              <div className="reports-card">
                <h2>No child added</h2>
                <p>
                  Add a child first to generate a vaccination report.
                </p>
              </div>
            )}

          {/* REPORT */}
          {!loading &&
            !error &&
            selectedChild && (
              <>

                {/* CHILD SELECTOR */}
                <section className="reports-card child-report-header">

                  <div className="child-report-avatar">
                    {selectedChild.name
                      ?.charAt(0)
                      .toUpperCase() || "C"}
                  </div>

                  <div className="child-report-info">

                    <span>CHILD</span>

                    <h2>
                      {selectedChild.name}
                    </h2>

                    <p>
                      Date of Birth:{" "}
                      {formatDate(
                        selectedChild.dateOfBirth
                      )}
                    </p>

                  </div>

                  <select
                    className="child-select"
                    value={selectedChildId}
                    onChange={(e) => {
                      setSelectedChildId(
                        e.target.value
                      );
                      setFilter("All");
                    }}
                  >
                    {children.map((child) => (
                      <option
                        key={child._id}
                        value={child._id}
                      >
                        {child.name}
                      </option>
                    ))}
                  </select>

                </section>

                {/* SUMMARY */}
                <div className="report-summary-grid">

                  <div className="report-summary-card">

                    <div className="summary-icon green">
                      ✓
                    </div>

                    <div>
                      <span>COMPLETED</span>

                      <strong>
                        {completed}
                      </strong>

                      <p>
                        Vaccinations completed
                      </p>
                    </div>

                  </div>

                  <div className="report-summary-card">

                    <div className="summary-icon blue">
                      ◷
                    </div>

                    <div>
                      <span>UPCOMING</span>

                      <strong>
                        {upcoming}
                      </strong>

                      <p>
                        Vaccinations upcoming
                      </p>
                    </div>

                  </div>

                  <div className="report-summary-card">

                    <div className="summary-icon orange">
                      !
                    </div>

                    <div>
                      <span>DUE SOON</span>

                      <strong>
                        {dueSoon}
                      </strong>

                      <p>
                        Vaccination due soon
                      </p>
                    </div>

                  </div>

                  <div className="report-summary-card">

                    <div className="summary-icon red">
                      !
                    </div>

                    <div>
                      <span>OVERDUE</span>

                      <strong>
                        {overdue}
                      </strong>

                      <p>
                        Vaccinations overdue
                      </p>
                    </div>

                  </div>

                </div>

                {/* PROGRESS */}
                <section className="reports-card progress-card">

                  <div className="report-section-heading">

                    <div>
                      <span>
                        OVERALL PROGRESS
                      </span>

                      <h2>
                        Vaccination Completion
                      </h2>
                    </div>

                    <strong className="progress-percentage">
                      {progress}%
                    </strong>

                  </div>

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>

                  <div className="progress-details">

                    <span>
                      {completed} completed
                    </span>

                    <span>
                      {total} total vaccinations
                    </span>

                  </div>

                </section>

                {/* VACCINATION HISTORY */}
                <section className="reports-card">

                  <div className="report-section-heading">

                    <div>
                      <span>
                        VACCINATION HISTORY
                      </span>

                      <h2>
                        Dose History
                      </h2>
                    </div>

                    <select
                      className="report-filter"
                      value={filter}
                      onChange={(e) =>
                        setFilter(e.target.value)
                      }
                    >
                      <option value="All">
                        All
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Upcoming">
                        Upcoming
                      </option>

                      <option value="Due Soon">
                        Due Soon
                      </option>

                      <option value="Overdue">
                        Overdue
                      </option>

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

                    {/* ROWS */}
                    {filteredVaccines.map(
                      (vaccine) => {
                        const status =
                          getVaccineStatus(vaccine);

                        return (
                          <div
                            className="vaccination-row"
                            key={vaccine._id}
                          >

                            <div className="vaccine-name">

                              <div
                                className={`vaccine-icon ${
                                  status ===
                                  "Completed"
                                    ? "green"
                                    : status ===
                                      "Overdue"
                                    ? "red"
                                    : "blue"
                                }`}
                              >
                                {status ===
                                "Completed"
                                  ? "✓"
                                  : status ===
                                    "Overdue"
                                  ? "!"
                                  : "◷"}
                              </div>

                              <div>
                                <strong>
                                  {vaccine.name}
                                </strong>

                                <small>
                                  {vaccine.description}
                                </small>
                              </div>

                            </div>

                            <span>
                              {vaccine.dose}
                            </span>

                            <span>
                              {formatDate(
                                vaccine.date
                              )}
                            </span>

                            <span
                              className={`status ${
                                status ===
                                "Completed"
                                  ? "completed"
                                  : status ===
                                    "Overdue"
                                  ? "overdue"
                                  : "upcoming"
                              }`}
                            >
                              {isDueSoon(vaccine) &&
                              status ===
                                "Upcoming"
                                ? "Due Soon"
                                : status}
                            </span>

                          </div>
                        );
                      }
                    )}

                  </div>

                  {!filteredVaccines.length && (
                    <div className="report-last-updated">
                      No vaccinations found for this filter.
                    </div>
                  )}

                </section>

                {/* LAST UPDATED */}
                <div className="report-last-updated">
                  Report generated from current vaccination data
                </div>

              </>
            )}

        </div>

      </main>

      {/* MOBILE NAV */}
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