import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./reminders.css";
import NotificationBell from "../../components/NotificationBell";

const API = "http://localhost:5000/api";

function Reminders() {
  const navigate = useNavigate();
  const [completingId, setCompletingId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [children, setChildren] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReminders = async () => {
      try {
        setLoading(true);
        setError("");

        const [profileResponse, childrenResponse, schedulesResponse] =
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

        if (!profileResponse.ok) {
          throw new Error("Failed to load profile");
        }

        if (!childrenResponse.ok) {
          throw new Error("Failed to load children");
        }

        if (!schedulesResponse.ok) {
          throw new Error("Failed to load reminders");
        }

        const profileData = await profileResponse.json();
        const childData = await childrenResponse.json();
        const scheduleData = await schedulesResponse.json();

        const loadedChildren = childData.children || [];
        const loadedSchedules = scheduleData.schedules || [];

        setUser(profileData.user);
        setChildren(loadedChildren);
        setReminders(loadedSchedules);

        if (loadedChildren.length > 0) {
          const linkedId = new URLSearchParams(
            window.location.search
          ).get("child");

          const linked = loadedChildren.find(
            (child) => String(child._id) === String(linkedId)
          );

          setSelectedChildId(
            linked ? linked._id : loadedChildren[0]._id
          );
        }
      } catch (err) {
        console.error("Error loading reminders:", err);
        setError("Unable to load reminders.");
      } finally {
        setLoading(false);
      }
    };

    loadReminders();
  }, []);

  const selectedChild = children.find(
    (child) => String(child._id) === String(selectedChildId)
  );

  const childReminders = selectedChild
    ? reminders.filter(
        (reminder) =>
          String(reminder.childId?._id || reminder.childId) ===
          String(selectedChild._id)
      )
    : [];

  const getReminderStatus = (reminder) => {
    if (reminder.status === "Completed") {
      return "Completed";
    }

    const vaccineDate = new Date(reminder.date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    vaccineDate.setHours(0, 0, 0, 0);

    const difference =
      (vaccineDate - today) / (1000 * 60 * 60 * 24);

    if (difference < 0) {
      return "Overdue";
    }

    if (difference <= 30) {
      return "Due Soon";
    }

    return "Upcoming";
  };

  const statusRank = {
    Overdue: 0,
    "Due Soon": 1,
    Upcoming: 2,
    Completed: 3,
  };

  const formattedReminders = childReminders
    .map((reminder) => ({
      ...reminder,
      displayStatus: getReminderStatus(reminder),
      icon:
        reminder.status === "Completed"
          ? "✓"
          : "💉",
    }))
    .sort((a, b) => {
      const rank =
        statusRank[a.displayStatus] -
        statusRank[b.displayStatus];

      if (rank !== 0) return rank;

      return new Date(a.date) - new Date(b.date);
    });

  const filteredReminders =
    filter === "All"
      ? formattedReminders
      : formattedReminders.filter(
          (reminder) => reminder.displayStatus === filter
        );

  const dueSoon = formattedReminders.filter(
    (item) => item.displayStatus === "Due Soon"
  ).length;

  const upcoming = formattedReminders.filter(
    (item) => item.displayStatus === "Upcoming"
  ).length;

  const completed = formattedReminders.filter(
    (item) => item.displayStatus === "Completed"
  ).length;

  const overdue = formattedReminders.filter(
    (item) => item.displayStatus === "Overdue"
  ).length;

  const urgentReminders = formattedReminders
    .filter(
      (item) =>
        item.displayStatus === "Overdue" ||
        item.displayStatus === "Due Soon"
    )
    .sort((a, b) => {
      // Overdue first, then the nearest due date
      const aOver = a.displayStatus === "Overdue" ? 0 : 1;
      const bOver = b.displayStatus === "Overdue" ? 0 : 1;

      if (aOver !== bOver) return aOver - bOver;

      return new Date(a.date) - new Date(b.date);
    });

  const importantReminder = urgentReminders[0];

  const goToSchedule = (childId) => {
    navigate(`/schedule?child=${childId}`);
  };

  const handleMarkDone = async (reminder) => {
    try {
      setCompletingId(reminder._id);
      setError("");

      const response = await fetch(
        `${API}/schedules/${reminder._id}/complete`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to mark as completed"
        );
      }

      setReminders((previous) =>
        previous.map((item) =>
          String(item._id) === String(reminder._id)
            ? {
                ...item,
                status: "Completed",
                completedAt: new Date().toISOString(),
              }
            : item
        )
      );
    } catch (err) {
      console.error("Error completing reminder:", err);
      setError(err.message || "Failed to mark as completed");
    } finally {
      setCompletingId(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDueLabel = (reminder) => {
    if (reminder.status === "Completed") {
      return reminder.completedAt
        ? `Given ${formatDate(reminder.completedAt)}`
        : "Given";
    }

    const days = getDaysRemaining(reminder.date);

    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    if (days === -1) return "1 day overdue";
    if (days < 0) return `${Math.abs(days)} days overdue`;

    return `In ${days} days`;
  };

  const getDaysRemaining = (date) => {
    const today = new Date();
    const vaccineDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    vaccineDate.setHours(0, 0, 0, 0);

    return Math.ceil(
      (vaccineDate - today) /
        (1000 * 60 * 60 * 24)
    );
  };

  const getAvatarLetter = () => {
    if (!user?.name) return "U";

    return user.name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="reminders-page">
        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >
          Loading reminders...
        </div>
      </div>
    );
  }

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

          <a
            href="/reminders"
            className="active"
          >
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

          <div className="reminders-top-space"></div>

          <NotificationBell className="reminders-notification" />

          <div className="reminders-user">

            <div className="reminders-user-avatar">
              {getAvatarLetter()}
            </div>

            <div className="reminders-user-info">
              <strong>
                {user?.name || "User"}
              </strong>

              <small>
                Guardian
              </small>
            </div>

        

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

          </div>


          {/* ERROR */}
          {error && (
            <div
              style={{
                padding: "15px",
                marginBottom: "20px",
                background: "#fde9e7",
                color: "#c75b52",
                borderRadius: "10px",
              }}
            >
              {error}
            </div>
          )}


          {children.length === 0 && !error && (
            <div className="reminders-empty">
              <span>👶</span>

              <h3>No children registered yet</h3>

              <p>
                Add a child to start getting vaccination
                reminders.
              </p>

              <button
                className="important-action"
                onClick={() => navigate("/children")}
              >
                Add Child
              </button>
            </div>
          )}

          {/* CHILD SELECTOR */}
          {children.length > 0 && (
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <strong>
                Child:
              </strong>

              <select
                value={selectedChildId}
                onChange={(e) => {
                  setSelectedChildId(e.target.value);
                  setFilter("All");
                }}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #dfe7e3",
                  background: "#fff",
                  minWidth: "220px",
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
            </div>
          )}


          {/* SUMMARY */}
          {children.length > 0 && (
          <section className="reminders-summary">

            <div className="reminders-summary-card">
              <div className="reminders-summary-icon alert">
                !
              </div>
              <div>
                <strong>{overdue}</strong>
                <span>Overdue</span>
              </div>
            </div>

            <div className="reminders-summary-card">
              <div className="reminders-summary-icon upcoming">
                🔔
              </div>
              <div>
                <strong>{dueSoon}</strong>
                <span>Due Soon</span>
              </div>
            </div>

            <div className="reminders-summary-card">
              <div className="reminders-summary-icon blue">
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

          </section>
          )}


          {/* IMPORTANT REMINDER */}
          {importantReminder && (

            <section className="important-reminder">

              <div className="important-reminder-icon">
                🔔
              </div>

              <div className="important-reminder-content">

                <span>
                  IMPORTANT REMINDER
                </span>

                <h2>
                  {importantReminder.name} vaccination is{" "}
                  {importantReminder.displayStatus === "Overdue"
                    ? "overdue"
                    : "due soon"}
                </h2>

                <p>
                  {selectedChild?.name}'s{" "}
                  {importantReminder.name} dose
                  {importantReminder.displayStatus === "Overdue"
                    ? " was scheduled for "
                    : " is scheduled for "}
                  {formatDate(importantReminder.date)}.
                </p>

              </div>

              <div className="important-reminder-date">

                <span>
                  {getDaysRemaining(
                    importantReminder.date
                  ) < 0
                    ? "OVERDUE BY"
                    : "DUE IN"}
                </span>

                <strong>
                  {Math.abs(
                    getDaysRemaining(
                      importantReminder.date
                    )
                  )}{" "}
                  {Math.abs(
                    getDaysRemaining(
                      importantReminder.date
                    )
                  ) === 1
                    ? "Day"
                    : "Days"}
                </strong>

              </div>

              <button
                className="important-action"
                onClick={() =>
                  goToSchedule(selectedChild._id)
                }
              >
                View Schedule
              </button>

            </section>

          )}


          {/* REMINDER LIST */}
          {children.length > 0 && (
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

              <span className="reminders-list-count">
                {filteredReminders.length}{" "}
                {filteredReminders.length === 1
                  ? "reminder"
                  : "reminders"}
              </span>

            </div>


            {/* FILTER */}
            <div className="reminders-filters">

              {[
                "All",
                "Due Soon",
                "Upcoming",
                "Completed",
                "Overdue",
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
                  {item !== "All" && (
                    <em className="filter-count">
                      {
                        formattedReminders.filter(
                          (r) => r.displayStatus === item
                        ).length
                      }
                    </em>
                  )}
                </button>

              ))}

            </div>


            {/* LIST */}
            <div className="reminders-list">

              {filteredReminders.map(
                (reminder) => {

                  const status =
                    reminder.displayStatus;

                  const statusClass =
                    status
                      .toLowerCase()
                      .replace(" ", "-");

                  return (
                    <div
                      className="reminder-item"
                      key={reminder._id}
                    >

                      <div
                        className={`reminder-icon ${statusClass}`}
                      >
                        {reminder.icon}
                      </div>


                      <div className="reminder-main-info">

                        <div className="reminder-title-row">

                          <h3>
                            {reminder.name}
                          </h3>

                          <span
                            className={`reminder-status ${statusClass}`}
                          >
                            {status}
                          </span>

                        </div>

                        <p>
                          {reminder.description}
                        </p>

                        <div className="reminder-meta">

                          <span>
                            👶{" "}
                            {selectedChild?.name ||
                              "Child"}
                          </span>

                          <span>
                            📅{" "}
                            {formatDate(
                              reminder.date
                            )}
                          </span>

                          <span>
                            ◷ {getDueLabel(reminder)}
                          </span>

                        </div>

                      </div>


                      <div className="reminder-actions">

                        {status ===
                        "Completed" ? (

                          <button className="completed-btn">
                            ✓ Done
                          </button>

                        ) : (

                          <>
                            <button
                              className="snooze-btn"
                              disabled={
                                completingId === reminder._id
                              }
                              onClick={() =>
                                handleMarkDone(reminder)
                              }
                            >
                              {completingId === reminder._id
                                ? "..."
                                : "Mark Done"}
                            </button>

                            <button
                              className="view-btn"
                              onClick={() =>
                                goToSchedule(selectedChild._id)
                              }
                            >
                              View
                            </button>
                          </>

                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>


            {/* EMPTY */}
            {filteredReminders.length === 0 && (

              <div className="reminders-empty">

                <span>
                  🔔
                </span>

                <h3>
                  No reminders found
                </h3>

                <p>
                  There are no reminders in this category.
                </p>

              </div>

            )}

          </section>
          )}

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