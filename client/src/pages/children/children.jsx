import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import "./children.css";
import NotificationBell from "../../components/NotificationBell";

function Children() {
  const navigate = useNavigate();

  const [children, setChildren] = useState([]);

  // Logged-in guardian (name comes from the backend)
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Add/Edit Child form states
  const [showAddForm, setShowAddForm] = useState(false);

  const [formLoading, setFormLoading] = useState(false);

  const [formError, setFormError] = useState("");

  const [editingChild, setEditingChild] = useState(null);

  // Vaccine checklist / actions
  const [expandedId, setExpandedId] = useState(null);

  const [completingId, setCompletingId] = useState(null);

  const [menuId, setMenuId] = useState(null);

  const [actionError, setActionError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    guardian: "",
  });

  // ================= FETCH CHILDREN =================

  const fetchChildren = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/children",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load children");
        return;
      }

      setChildren(data.children || []);
    } catch (err) {
      console.error("Error fetching children:", err);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();

    const fetchUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();

          setUser(data.user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  // ================= FORM HANDLERS =================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ================= OPEN ADD FORM =================

  const openAddForm = () => {
    setFormError("");
    setEditingChild(null);

    setFormData({
      name: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      guardian: "",
    });

    setShowAddForm(true);
  };

  // ================= CLOSE FORM =================

  const closeAddForm = () => {
    if (formLoading) return;

    setShowAddForm(false);
    setFormError("");
    setEditingChild(null);
  };

  // ================= CREATE / UPDATE CHILD =================

  const handleSaveChild = async (event) => {
    event.preventDefault();

    setFormError("");

    if (
      !formData.name ||
      !formData.dateOfBirth ||
      !formData.gender ||
      !formData.guardian
    ) {
      setFormError(
        "Name, date of birth, gender and guardian are required."
      );

      return;
    }

    try {
      setFormLoading(true);

      const response = await fetch(
        editingChild
          ? `http://localhost:5000/api/children/${editingChild._id}`
          : "http://localhost:5000/api/children",
        {
          method: editingChild ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setFormError(
          data.error ||
            (editingChild
              ? "Failed to update child"
              : "Failed to add child")
        );

        return;
      }

      // Close modal
      setShowAddForm(false);

      // Clear editing state
      setEditingChild(null);

      // Reset form
      setFormData({
        name: "",
        dateOfBirth: "",
        gender: "",
        bloodGroup: "",
        guardian: "",
      });

      // Refresh children
      await fetchChildren();
    } catch (err) {
      console.error(
        editingChild
          ? "Error updating child:"
          : "Error adding child:",
        err
      );

      setFormError("Unable to connect to server");
    } finally {
      setFormLoading(false);
    }
  };

  // ================= VIEW CHILD =================

  const handleViewChild = (childId) => {
    navigate(`/child-details?id=${childId}`);
  };

  // ================= EDIT CHILD =================

  const handleEditChild = (child) => {
    setFormError("");

    setEditingChild(child);

    setFormData({
      name: child.name || "",

      dateOfBirth: child.dateOfBirth
        ? new Date(child.dateOfBirth)
            .toISOString()
            .split("T")[0]
        : "",

      gender: child.gender || "",

      bloodGroup: child.bloodGroup || "",

      guardian: child.guardian || "",
    });

    setShowAddForm(true);
  };

  // ================= MARK VACCINE COMPLETED / UNDO =================

  const handleToggleVaccine = async (vaccine) => {
    try {
      setActionError("");
      setCompletingId(vaccine._id);

      const endpoint =
        vaccine.status === "Completed" ? "undo" : "complete";

      const response = await fetch(
        `http://localhost:5000/api/schedules/${vaccine._id}/${endpoint}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setActionError(
          data.error || "Failed to update vaccination"
        );
        return;
      }

      // Reload so progress, counts and next vaccine stay accurate
      await fetchChildren(true);
    } catch (err) {
      console.error("Error updating vaccination:", err);
      setActionError("Unable to connect to server");
    } finally {
      setCompletingId(null);
    }
  };

  // ================= DELETE CHILD =================

  const handleDeleteChild = async (child) => {
    setMenuId(null);

    const confirmed = window.confirm(
      `Delete ${child.name}? All of their vaccination records will be removed too.`
    );

    if (!confirmed) return;

    try {
      setActionError("");

      const response = await fetch(
        `http://localhost:5000/api/children/${child._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setActionError(data.error || "Failed to delete child");
        return;
      }

      await fetchChildren(true);
    } catch (err) {
      console.error("Error deleting child:", err);
      setActionError("Unable to connect to server");
    }
  };

  // ================= HELPERS =================

  const getAgeStage = (dateOfBirth) => {
    if (!dateOfBirth) return "";

    const dob = new Date(dateOfBirth);
    const today = new Date();

    const months =
      (today.getFullYear() - dob.getFullYear()) * 12 +
      (today.getMonth() - dob.getMonth()) -
      (today.getDate() < dob.getDate() ? 1 : 0);

    if (months < 1) return "Newborn";
    if (months < 12) return "Infant";
    if (months < 36) return "Toddler";
    return "Child";
  };

  const formatShortDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  // Totals across all children
  const totals = children.reduce(
    (sum, child) => {
      const v = child.vaccineSummary;

      if (!v) return sum;

      sum.completed += v.completed;
      sum.upcoming += v.upcoming;
      sum.overdue += v.overdue;

      return sum;
    },
    { completed: 0, upcoming: 0, overdue: 0 }
  );

  const getInitials = (name) => {
    if (!name) return "CH";

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "Age unavailable";

    const dob = new Date(dateOfBirth);

    const today = new Date();

    let years =
      today.getFullYear() -
      dob.getFullYear();

    let months =
      today.getMonth() -
      dob.getMonth();

    if (today.getDate() < dob.getDate()) {
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

  return (
    <div className="children-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="children-sidebar">

        <div className="children-sidebar-logo">
          Tika<span>Track</span>
        </div>

        <nav className="children-sidebar-nav">

          <a
            href="/dashboard"
            className="children-sidebar-link"
          >
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

          <a
            href="/schedule"
            className="children-sidebar-link"
          >
            <span>▣</span>
            Schedule
          </a>

          <a
            href="/reminders"
            className="children-sidebar-link"
          >
            <span>♧</span>
            Reminders
          </a>

          <a
            href="/reports"
            className="children-sidebar-link"
          >
            <span>▥</span>
            Reports
          </a>

          <a
            href="/profile"
            className="children-sidebar-link"
          >
            <span>◉</span>
            Profile
          </a>

          <a
            href="/settings"
            className="children-sidebar-link"
          >
            <span>⚙</span>
            Settings
          </a>

        </nav>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="children-main">

        {/* ================= TOPBAR ================= */}

        <header className="children-topbar">

          <div className="children-topbar-spacer"></div>

          <NotificationBell className="children-notification" />

          <div className="children-user">

            <div className="children-user-avatar">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "G"}
            </div>

            <div className="children-user-info">
              <strong>
                {user?.name || "Guardian"}
              </strong>
              <small>Guardian</small>
            </div>

          

          </div>

        </header>

        {/* ================= CONTENT ================= */}

        <div className="children-content">

          {/* ================= PAGE HEADER ================= */}

          <section className="children-page-header">

            <div>

              <span className="children-label">
                FAMILY
              </span>

              <h1>
                My <span>Children</span>
              </h1>

              <p>
                Manage your children's profiles and
                vaccination information.
              </p>

            </div>

            <button
              className="children-add-button"
              onClick={openAddForm}
            >
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
                <strong>
                  {children.length}
                </strong>

                <span>
                  Registered Children
                </span>
              </div>

            </div>

            <div className="children-summary-card">

              <div className="children-summary-icon blue">
                ✓
              </div>

              <div>
                <strong>{totals.completed}</strong>

                <span>
                  Completed Vaccinations
                </span>
              </div>

            </div>

            <div className="children-summary-card">

              <div className="children-summary-icon orange">
                ♧
              </div>

              <div>
                <strong>{totals.upcoming}</strong>

                <span>
                  Upcoming Vaccinations
                </span>
              </div>

            </div>

            <div className="children-summary-card">

              <div className="children-summary-icon red">
                !
              </div>

              <div>
                <strong>{totals.overdue}</strong>

                <span>
                  Overdue Vaccinations
                </span>
              </div>

            </div>

          </section>

          {/* ================= CHILDREN LIST ================= */}

          <section className="children-list-section">

            <div className="children-list-header">

              <div>

                <span className="children-label">
                  REGISTERED
                </span>

                <h2>
                  Your Children
                </h2>

              </div>

              <span className="children-count">
                {children.length} Children
              </span>

            </div>

            {/* LOADING */}

            {loading && (
              <p>
                Loading children...
              </p>
            )}

            {/* ERROR */}

            {!loading && error && (
              <p>
                {error}
              </p>
            )}

            {/* NO CHILDREN */}

            {!loading &&
              !error &&
              children.length === 0 && (
                <p>
                  No children registered yet.
                </p>
              )}

            {actionError && (
              <p className="children-action-error">
                {actionError}
              </p>
            )}

            {/* CHILDREN CARDS */}

            {!loading &&
              !error &&
              children.length > 0 && (

                <div className="children-cards">

                  {children.map((child) => {
                    const v = child.vaccineSummary || {
                      total: 0,
                      completed: 0,
                      upcoming: 0,
                      overdue: 0,
                      percent: 0,
                      nextVaccine: null,
                      groups: [],
                    };

                    const isOpen = expandedId === child._id;

                    return (
                    <article
                      className="child-profile-card"
                      key={child._id}
                    >

                      {/* ================= CARD TOP ================= */}

                      <div className="child-card-top">

                        <div className="child-large-avatar">
                          {getInitials(child.name)}
                        </div>

                        <div className="child-main-info">

                          <h3>
                            {child.name}
                            <em className="child-stage-badge">
                              {getAgeStage(child.dateOfBirth)}
                            </em>
                          </h3>

                          <p>
                            {child.gender} ·{" "}
                            {calculateAge(child.dateOfBirth)}
                          </p>

                          <span>
                            Date of Birth:{" "}
                            {formatDate(child.dateOfBirth)}
                          </span>

                        </div>

                        <div className="child-menu-wrap">

                          <button
                            className="child-menu"
                            onClick={() =>
                              setMenuId(
                                menuId === child._id
                                  ? null
                                  : child._id
                              )
                            }
                          >
                            ⋮
                          </button>

                          {menuId === child._id && (
                            <div className="child-menu-dropdown">
                              <button
                                onClick={() =>
                                  handleDeleteChild(child)
                                }
                              >
                                Delete child
                              </button>
                            </div>
                          )}

                        </div>

                      </div>

                      {/* ================= PROGRESS ================= */}

                      <div className="child-progress-section">

                        <div className="child-progress-header">

                          <span>
                            Vaccination Progress
                          </span>

                          <strong>
                            {v.percent}%
                          </strong>

                        </div>

                        <div className="child-progress-bar">

                          <div
                            style={{
                              width: `${v.percent}%`,
                            }}
                          ></div>

                        </div>

                        <p>
                          {v.completed} of {v.total} vaccinations
                          completed
                        </p>

                        <div className="child-status-chips">
                          <span className="chip completed">
                            {v.completed} Completed
                          </span>
                          <span className="chip upcoming">
                            {v.upcoming} Upcoming
                          </span>
                          <span className="chip overdue">
                            {v.overdue} Overdue
                          </span>
                        </div>

                      </div>

                      {/* ================= NEXT VACCINE ================= */}

                      <div className="next-vaccine">

                        <div className="next-vaccine-icon">
                          💉
                        </div>

                        <div className="next-vaccine-info">

                          <span>
                            {v.nextVaccine
                              ? v.nextVaccine.status === "Overdue"
                                ? "OVERDUE VACCINATION"
                                : "NEXT VACCINATION"
                              : "NEXT VACCINATION"}
                          </span>

                          <strong>
                            {v.nextVaccine
                              ? `${v.nextVaccine.name} · ${v.nextVaccine.ageGroup}`
                              : v.total > 0
                              ? "All vaccines completed 🎉"
                              : "Not scheduled"}
                          </strong>

                        </div>

                        <div className="next-vaccine-date">

                          <strong>
                            {v.nextVaccine
                              ? formatShortDate(v.nextVaccine.date)
                              : "—"}
                          </strong>

                          {v.nextVaccine && (
                            <span
                              className={
                                v.nextVaccine.status === "Overdue"
                                  ? "status-overdue"
                                  : ""
                              }
                            >
                              {v.nextVaccine.status}
                            </span>
                          )}

                        </div>

                      </div>

                      {/* ================= VACCINE CHECKLIST (by age) ================= */}

                      {isOpen && (
                        <div className="vaccine-checklist">

                          {v.groups.map((group) => (
                            <div
                              className="vaccine-group"
                              key={group.label}
                            >

                              <div className="vaccine-group-header">
                                <strong>{group.label}</strong>
                                <span>
                                  {group.completed}/
                                  {group.items.length} done
                                </span>
                              </div>

                              {group.items.map((vaccine) => (
                                <div
                                  className={`vaccine-row ${vaccine.status.toLowerCase()}`}
                                  key={vaccine._id}
                                >

                                  <div className="vaccine-row-info">
                                    <strong>
                                      {vaccine.name}
                                      <small>
                                        {" "}
                                        · {vaccine.dose} dose
                                      </small>
                                    </strong>
                                    <span>
                                      {vaccine.description}
                                    </span>
                                    <span>
                                      {vaccine.status === "Completed" &&
                                      vaccine.completedAt
                                        ? `Given on ${formatShortDate(vaccine.completedAt)}`
                                        : `Due ${formatShortDate(vaccine.date)}`}
                                    </span>
                                  </div>

                                  <span
                                    className={`vaccine-badge ${vaccine.status.toLowerCase()}`}
                                  >
                                    {vaccine.status}
                                  </span>

                                  <button
                                    className={
                                      vaccine.status === "Completed"
                                        ? "vaccine-undo-button"
                                        : "vaccine-complete-button"
                                    }
                                    disabled={
                                      completingId === vaccine._id
                                    }
                                    onClick={() =>
                                      handleToggleVaccine(vaccine)
                                    }
                                  >
                                    {completingId === vaccine._id
                                      ? "..."
                                      : vaccine.status === "Completed"
                                      ? "Undo"
                                      : "Mark Completed"}
                                  </button>

                                </div>
                              ))}

                            </div>
                          ))}

                        </div>
                      )}

                      {/* ================= ACTIONS ================= */}

                      <div className="child-card-actions">

                        <button
                          className="view-child-button"
                          onClick={() =>
                            handleViewChild(child._id)
                          }
                        >
                          View Details
                          <span>→</span>
                        </button>

                        <button
                          className="toggle-vaccines-button"
                          onClick={() =>
                            setExpandedId(
                              isOpen ? null : child._id
                            )
                          }
                        >
                          {isOpen ? "Hide Vaccines" : "Vaccines"}
                        </button>

                        <button
                          className="edit-child-button"
                          onClick={() =>
                            handleEditChild(child)
                          }
                        >
                          Edit Profile
                        </button>

                      </div>

                    </article>
                    );
                  })}

                </div>

              )}

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
                  Add your child's information to
                  start tracking their vaccinations.
                </p>

              </div>

            </div>

            <button
              className="add-child-outline-button"
              onClick={openAddForm}
            >
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

        <a
          href="/children"
          className="active"
        >
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

      {/* ================= ADD / EDIT CHILD MODAL ================= */}

      {showAddForm && (

        <div
          className="add-child-modal-overlay"
          onClick={closeAddForm}
        >

          <div
            className="add-child-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="add-child-modal-header">

              <div>

                <span>
                  FAMILY
                </span>

                <h2>
                  {editingChild
                    ? "Edit Child Profile"
                    : "Add Child"}
                </h2>

                <p>
                  {editingChild
                    ? "Update your child's information below."
                    : "Enter your child's information below."}
                </p>

              </div>

              <button
                type="button"
                className="add-child-modal-close"
                onClick={closeAddForm}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSaveChild}>

              {/* CHILD NAME */}

              <div className="add-child-form-group">

                <label>
                  Child Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter child's name"
                />

              </div>

              {/* DOB + GENDER */}

              <div className="add-child-form-row">

                <div className="add-child-form-group">

                  <label>
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />

                </div>

                <div className="add-child-form-group">

                  <label>
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >

                    <option value="">
                      Select gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>

              {/* BLOOD GROUP + GUARDIAN */}

              <div className="add-child-form-row">

                <div className="add-child-form-group">

                  <label>
                    Blood Group
                  </label>

                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                  >

                    <option value="">
                      Select blood group
                    </option>

                    <option value="A+">
                      A+
                    </option>

                    <option value="A-">
                      A-
                    </option>

                    <option value="B+">
                      B+
                    </option>

                    <option value="B-">
                      B-
                    </option>

                    <option value="AB+">
                      AB+
                    </option>

                    <option value="AB-">
                      AB-
                    </option>

                    <option value="O+">
                      O+
                    </option>

                    <option value="O-">
                      O-
                    </option>

                  </select>

                </div>

                <div className="add-child-form-group">

                  <label>
                    Guardian
                  </label>

                  <input
                    type="text"
                    name="guardian"
                    value={formData.guardian}
                    onChange={handleInputChange}
                    placeholder="Guardian name"
                  />

                </div>

              </div>

              {/* FORM ERROR */}

              {formError && (
                <p className="add-child-form-error">
                  {formError}
                </p>
              )}

              {/* FORM BUTTONS */}

              <div className="add-child-form-actions">

                <button
                  type="button"
                  className="add-child-cancel-button"
                  onClick={closeAddForm}
                  disabled={formLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="add-child-save-button"
                  disabled={formLoading}
                >

                  {formLoading
                    ? "Saving..."
                    : editingChild
                    ? "Update Child"
                    : "Save Child"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Children;