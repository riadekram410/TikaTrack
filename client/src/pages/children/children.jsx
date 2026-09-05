import { useEffect, useState } from "react";
import "./children.css";

function Children() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Child form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    guardian: "",
  });

  // ================= FETCH CHILDREN =================
  const fetchChildren = async () => {
    try {
      setLoading(true);
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
  }, []);

  // ================= FORM HANDLERS =================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setFormError("");

    setFormData({
      name: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      guardian: "",
    });

    setShowAddForm(true);
  };

  const closeAddForm = () => {
    if (formLoading) return;

    setShowAddForm(false);
    setFormError("");
  };

  // ================= CREATE CHILD =================

  const handleAddChild = async (event) => {
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
        "http://localhost:5000/api/children",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error || "Failed to add child");
        return;
      }

      // Close form
      setShowAddForm(false);

      // Reset form
      setFormData({
        name: "",
        dateOfBirth: "",
        gender: "",
        bloodGroup: "",
        guardian: "",
      });

      // Refresh children list
      await fetchChildren();
    } catch (err) {
      console.error("Error adding child:", err);
      setFormError("Unable to connect to server");
    } finally {
      setFormLoading(false);
    }
  };

  // ================= HELPERS =================

  const getInitials = (name) => {
    if (!name) return "CH";

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "Age unavailable";

    const dob = new Date(dateOfBirth);
    const today = new Date();

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();

    if (
      today.getDate() < dob.getDate()
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

        {/* TOPBAR */}
        <header className="children-topbar">

          <div className="children-topbar-spacer"></div>

          <button className="children-notification">
            ♧
            <span></span>
          </button>

          <div className="children-user">

            <div className="children-user-avatar">
              G
            </div>

            <div className="children-user-info">
              <strong>Guardian</strong>
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
                <strong>0</strong>

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
                <strong>0</strong>

                <span>
                  Upcoming Vaccinations
                </span>
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


            {/* CHILDREN CARDS */}
            {!loading &&
              !error &&
              children.length > 0 && (
                <div className="children-cards">

                  {children.map((child) => (

                    <article
                      className="child-profile-card"
                      key={child._id}
                    >

                      {/* CARD TOP */}
                      <div className="child-card-top">

                        <div className="child-large-avatar">
                          {getInitials(child.name)}
                        </div>

                        <div className="child-main-info">

                          <h3>
                            {child.name}
                          </h3>

                          <p>
                            {child.gender} ·{" "}
                            {calculateAge(
                              child.dateOfBirth
                            )}
                          </p>

                          <span>
                            Date of Birth:{" "}
                            {formatDate(
                              child.dateOfBirth
                            )}
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
                            0%
                          </strong>

                        </div>

                        <div className="child-progress-bar">

                          <div
                            style={{
                              width: "0%",
                            }}
                          ></div>

                        </div>

                        <p>
                          0 of 0 vaccinations
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
                            Not scheduled
                          </strong>

                        </div>

                        <div className="next-vaccine-date">

                          <strong>
                            —
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
                  Add your child's information to start tracking
                  their vaccinations.
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


      {/* ================= ADD CHILD MODAL ================= */}
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
                  Add Child
                </h2>

                <p>
                  Enter your child's information
                  below.
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


            <form onSubmit={handleAddChild}>

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