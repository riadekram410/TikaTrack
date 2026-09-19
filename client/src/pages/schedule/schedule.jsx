import { useEffect, useState } from "react";
import "./schedule.css";

const API = "http://localhost:5000/api";

const navItems = [
  ["⌂", "Dashboard", "/dashboard"],
  ["♙", "Children", "/children"],
  ["▣", "Schedule", "/schedule"],
  ["♧", "Reminders", "/reminders"],
  ["▥", "Reports", "/reports"],
  ["◉", "Profile", "/profile"],
  ["⚙", "Settings", "/settings"],
];

const filters = ["All", "Completed", "Upcoming", "Overdue"];

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Not scheduled";

function Status({ status }) {
  return (
    <span className={`schedule-status ${status.toLowerCase()}`}>
      {status === "Completed" ? "✓ " : "◷ "}
      {status}
    </span>
  );
}

function VaccineIcon({ status }) {
  return (
    <div
      className={`table-vaccine-icon ${
        status === "Completed" ? "green" : "orange"
      }`}
    >
      💉
    </div>
  );
}

function VaccineInfo({ vaccine }) {
  return (
    <div className="table-vaccine">
      <VaccineIcon status={vaccine.status} />

      <div>
        <strong>{vaccine.name}</strong>
        <span>{vaccine.description}</span>
      </div>
    </div>
  );
}

function Schedule() {
  const [user, setUser] = useState(null);
  const [children, setChildren] = useState([]);
  const [vaccines, setVaccines] = useState([]);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, childrenRes, scheduleRes] =
          await Promise.all([
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

        const profile = await profileRes.json();
        const childData = await childrenRes.json();
        const scheduleData = await scheduleRes.json();

        if (!profileRes.ok)
          throw new Error(profile.error || "Failed to load profile");

        if (!childrenRes.ok)
          throw new Error(
            childData.error || "Failed to load children"
          );

        if (!scheduleRes.ok)
          throw new Error(
            scheduleData.error || "Failed to load schedules"
          );

        setUser(profile.user);
        setChildren(childData.children || []);
        setVaccines(scheduleData.schedules || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedChild = children[0];

  const childVaccines = selectedChild
    ? vaccines.filter(
        (vaccine) =>
          String(vaccine.childId?._id) ===
          String(selectedChild._id)
      )
    : [];

  const completed = childVaccines.filter(
    (v) => v.status === "Completed"
  ).length;

  const upcoming = childVaccines.filter(
    (v) => v.status === "Upcoming"
  ).length;

  const progress = childVaccines.length
    ? Math.round((completed / childVaccines.length) * 100)
    : 0;

  const nextVaccine = [...childVaccines]
    .filter((v) => v.status === "Upcoming")
    .sort(
      (a, b) =>
        new Date(a.date) - new Date(b.date)
    )[0];

  const filteredVaccines = childVaccines.filter((vaccine) => {
    const matchesFilter =
      filter === "All" || vaccine.status === filter;

    const text =
      `${vaccine.name} ${vaccine.description}`.toLowerCase();

    return (
      matchesFilter &&
      text.includes(search.toLowerCase())
    );
  });

  return (
    <div className="schedule-page">

      {/* SIDEBAR */}
      <aside className="schedule-sidebar">
        <div className="schedule-logo">
          Tika<span>Track</span>
        </div>

        <nav className="schedule-nav">
          {navItems.map(([icon, name, path]) => (
            <a
              key={path}
              href={path}
              className={path === "/schedule" ? "active" : ""}
            >
              <span>{icon}</span>
              {name}
            </a>
          ))}
        </nav>
      </aside>


      {/* MAIN */}
      <main className="schedule-main">

        {/* TOPBAR */}
        <header className="schedule-topbar">
          

          <div className="schedule-top-space" />

          <button className="schedule-notification">
            ♧
            <span />
          </button>

          <div className="schedule-user">
            <div className="schedule-user-avatar">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="schedule-user-info">
              <strong>{user?.name || "User"}</strong>
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
                <strong>
                  {selectedChild?.name || "No child added"}
                </strong>
              </div>

              <b>▼</b>
            </button>
          </div>


          {/* LOADING */}
          {loading && (
            <div className="schedule-empty">
              <h3>Loading schedules...</h3>
              <p>Please wait...</p>
            </div>
          )}


          {/* ERROR */}
          {!loading && error && (
            <div className="schedule-empty">
              <span>⚠️</span>
              <h3>Unable to load schedules</h3>
              <p>{error}</p>
            </div>
          )}


          {/* DATA */}
          {!loading && !error && (
            <>

              {/* SUMMARY */}
              <section className="schedule-summary">

                <Summary
                  icon="💉"
                  className="total"
                  value={childVaccines.length}
                  label="Total Vaccines"
                />

                <Summary
                  icon="✓"
                  className="completed"
                  value={completed}
                  label="Completed"
                />

                <Summary
                  icon="◷"
                  className="upcoming"
                  value={upcoming}
                  label="Upcoming"
                />

                <div className="schedule-summary-card progress">
                  <div className="schedule-progress-circle">
                    {progress}%
                  </div>

                  <div>
                    <strong>
                      {progress === 100
                        ? "Complete"
                        : "On Track"}
                    </strong>

                    <span>
                      Vaccination Progress
                    </span>
                  </div>
                </div>

              </section>


              {/* NEXT VACCINATION */}
              <section className="schedule-next">

                <div className="schedule-next-icon">
                  💉
                </div>

                <div className="schedule-next-info">
                  <span>NEXT VACCINATION</span>

                  <h2>
                    {nextVaccine?.name ||
                      "No upcoming vaccine"}
                  </h2>

                  <p>
                    {nextVaccine?.description ||
                      "There are no upcoming vaccinations."}
                  </p>
                </div>

                {nextVaccine && (
                  <>
                    <div className="schedule-next-date">
                      <span>DUE DATE</span>

                      <strong>
                        {formatDate(nextVaccine.date)}
                      </strong>

                      <small>
                        {nextVaccine.status}
                      </small>
                    </div>

                    <button className="schedule-reminder">
                      🔔 Set Reminder
                    </button>
                  </>
                )}

              </section>


              {/* TABLE */}
              <section className="schedule-table-card">

                <div className="schedule-table-header">

                  <div>
                    <span>ALL VACCINATIONS</span>
                    <h2>Vaccination Timeline</h2>
                  </div>

                  <div className="schedule-search">
                    <span>⌕</span>

                    <input
                      type="text"
                      placeholder="Search vaccine..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                    />
                  </div>

                </div>


                {/* FILTERS */}
                <div className="schedule-filters">
                  {filters.map((item) => (
                    <button
                      key={item}
                      className={
                        filter === item ? "active" : ""
                      }
                      onClick={() => setFilter(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>


                {/* DESKTOP */}
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
                      {filteredVaccines.map((vaccine) => (
                        <tr key={vaccine._id}>

                          <td>
                            <VaccineInfo vaccine={vaccine} />
                          </td>

                          <td>
                            <span className="dose-text">
                              {vaccine.dose}
                            </span>
                          </td>

                          <td>
                            <span className="date-text">
                              {formatDate(vaccine.date)}
                            </span>
                          </td>

                          <td>
                            <Status
                              status={vaccine.status}
                            />
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


                {/* MOBILE */}
                <div className="schedule-mobile-list">

                  {filteredVaccines.map((vaccine) => (
                    <div
                      className="schedule-mobile-card"
                      key={vaccine._id}
                    >

                      <div className="mobile-vaccine-top">
                        <VaccineInfo vaccine={vaccine} />
                      </div>

                      <div className="mobile-vaccine-details">

                        <div>
                          <small>DOSE</small>
                          <strong>
                            {vaccine.dose}
                          </strong>
                        </div>

                        <div>
                          <small>DUE DATE</small>
                          <strong>
                            {formatDate(vaccine.date)}
                          </strong>
                        </div>

                      </div>

                      <Status
                        status={vaccine.status}
                      />

                    </div>
                  ))}

                </div>


                {/* EMPTY */}
                {!filteredVaccines.length && (
                  <div className="schedule-empty">
                    <span>🔎</span>
                    <h3>No vaccines found</h3>
                    <p>
                      Try another search or filter.
                    </p>
                  </div>
                )}

              </section>

            </>
          )}

        </div>
      </main>


      {/* MOBILE NAV */}
      <nav className="schedule-mobile-nav">
        {navItems
          .filter(([, , path]) =>
            [
              "/dashboard",
              "/children",
              "/schedule",
              "/reminders",
              "/profile",
            ].includes(path)
          )
          .map(([icon, name, path]) => (
            <a
              key={path}
              href={path}
              className={
                path === "/schedule" ? "active" : ""
              }
            >
              <span>{icon}</span>
              {name}
            </a>
          ))}
      </nav>

    </div>
  );
}

function Summary({ icon, className, value, label }) {
  return (
    <div className="schedule-summary-card">
      <div
        className={`schedule-summary-icon ${className}`}
      >
        {icon}
      </div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default Schedule;