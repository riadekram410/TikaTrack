import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

const API = "http://localhost:5000/api/users";

const toDraft = (user) => ({
  name: user.name || "",
  email: user.email || "",
  phone: user.phone || "",
});

const emptyPasswords = () => ({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const navigation = [
  { href: "/dashboard", icon: "⌂", label: "Dashboard" },
  { href: "/children", icon: "♙", label: "Children" },
  { href: "/schedule", icon: "▣", label: "Schedule" },
  { href: "/reminders", icon: "♧", label: "Reminders" },
  { href: "/reports", icon: "▥", label: "Reports" },
  { href: "/profile", icon: "◉", label: "Profile" },
  { href: "/settings", icon: "⚙", label: "Settings" },
];

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState(null);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reload, setReload] = useState(0);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwords, setPasswords] = useState(emptyPasswords);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  // Load the logged-in user's profile.
  useEffect(() => {
    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        const response = await fetch(`${API}/profile`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });

        if (response.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load profile");
        }

        setProfile(data.user);
        setDraft(toDraft(data.user));
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Unable to connect to server");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => controller.abort();
  }, [navigate, reload]);

  const startEditing = () => {
    setDraft(toDraft(profile));
    setError("");
    setSuccess("");
    setEditing(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setDraft((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setDraft(toDraft(profile));
    setEditing(false);
    setError("");
    setSuccess("");
  };

  // Save name, email and phone.
  const handleSave = async (event) => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API}/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draft),
      });

      if (response.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save profile");
      }

      setProfile(data.user);
      setDraft(toDraft(data.user));
      setEditing(false);
      setSuccess("Your profile has been saved.");
    } catch (err) {
      setError(err.message || "Unable to connect to server");
    } finally {
      setSaving(false);
    }
  };

  const resetPasswords = () => {
    setPasswords(emptyPasswords());
    setPasswordError("");
    setShowPasswords(false);
  };

  const openPasswordForm = () => {
    resetPasswords();
    setPasswordSuccess("");
    setPasswordOpen(true);
  };

  const cancelPasswordChange = () => {
    resetPasswords();
    setPasswordOpen(false);
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswords((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Verify the current password and save a new one.
  const handlePasswordSave = async (event) => {
    event.preventDefault();

    if (passwordSaving) return;

    setPasswordError("");
    setPasswordSuccess("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    const passwordBytes = new TextEncoder().encode(
      passwords.newPassword
    ).length;

    if (passwords.newPassword.length < 8 || passwordBytes > 72) {
      setPasswordError(
        "New password must have at least 8 characters and at most 72 UTF-8 bytes"
      );
      return;
    }

    setPasswordSaving(true);

    try {
      const response = await fetch(`${API}/change-password`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwords),
      });

      if (response.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to change password");
      }

      resetPasswords();
      setPasswordOpen(false);
      setPasswordSuccess(data.message);
    } catch (err) {
      setPasswordError(
        err.message || "Unable to connect to server"
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        role="status"
        style={{ padding: "3rem", textAlign: "center" }}
      >
        Loading your profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <p role="alert">{error || "Unable to load profile"}</p>

        <button
          type="button"
          onClick={() => {
            setError("");
            setLoading(true);
            setReload((current) => current + 1);
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  const fields = editing ? draft : toDraft(profile);

  const initials =
    profile.name
      ?.trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  const navigationLinks = navigation.map((item) => (
    <a
      key={item.href}
      href={item.href}
      className={item.href === "/profile" ? "active" : ""}
    >
      <span>{item.icon}</span>
      {item.label}
    </a>
  ));

  return (
    <div className="profile-page">
      <style>{`
        .profile-feedback {
          padding: 14px 18px;
          border-radius: 10px;
          margin: 16px 0;
        }

        .profile-error {
          color: #991b1b;
          background: #fee2e2;
        }

        .profile-success {
          color: #166534;
          background: #dcfce7;
        }

        .profile-page button:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .profile-password-card {
          margin-top: 24px;
        }

        .profile-password-help {
          margin: 16px 0;
          color: #64748b;
          font-size: 14px;
        }

        .profile-password-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 16px 0;
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className="profile-sidebar">
        <div className="profile-logo">
          Tika<span>Track</span>
        </div>

        <nav className="profile-nav">
          {navigationLinks}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="profile-main">
        <header className="profile-topbar">
          <div className="profile-top-space"></div>

          <div className="profile-user">
            <div className="profile-user-avatar">
              {initials}
            </div>

            <div className="profile-user-info">
              <strong>{profile.name}</strong>
              <small>Guardian</small>
            </div>
          </div>
        </header>

        <div className="profile-content">
          {/* PAGE HEADER */}
          <div className="profile-page-header">
            <div>
              <span className="profile-label">ACCOUNT</span>

              <h1>
                My <span>Profile</span>
              </h1>

              <p>
                Manage your personal information and account details.
              </p>
            </div>

            {!editing && (
              <button
                type="button"
                className="edit-profile-btn"
                onClick={startEditing}
              >
                ✎ Edit Profile
              </button>
            )}
          </div>

          {error && (
            <p
              className="profile-feedback profile-error"
              role="alert"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              className="profile-feedback profile-success"
              role="status"
            >
              {success}
            </p>
          )}

          {/* PROFILE SUMMARY */}
          <section className="profile-card profile-hero-card">
            <div className="large-profile-avatar">
              {initials}
            </div>

            <div className="profile-hero-info">
              <span className="guardian-badge">GUARDIAN</span>

              <h2>{profile.name}</h2>
              <p>{profile.email}</p>

              <div className="profile-member">
                {memberSince
                  ? `Member since ${memberSince}`
                  : "Member"}
              </div>
            </div>

            <div className="profile-account-status">
              <span>ACCOUNT STATUS</span>
              <strong>● Active</strong>
            </div>
          </section>

          {/* PERSONAL DETAILS */}
          <section className="profile-card">
            <div className="card-heading">
              <div>
                <span>PERSONAL INFORMATION</span>
                <h2>Personal Details</h2>
              </div>

              {!editing && (
                <button
                  type="button"
                  className="small-edit-btn"
                  onClick={startEditing}
                >
                  Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSave}>
              <div className="profile-form-grid">
                <div className="profile-field full-field">
                  <label htmlFor="profile-name">
                    Full Name
                  </label>

                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    value={fields.name}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    maxLength={200}
                    required
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-email">
                    Email Address
                  </label>

                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    value={fields.email}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    maxLength={254}
                    required
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-phone">
                    Phone Number
                  </label>

                  <input
                    id="profile-phone"
                    type="tel"
                    name="phone"
                    value={fields.phone}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    maxLength={50}
                  />
                </div>
              </div>

              {editing && (
                <div className="profile-form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-profile-btn"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "✓ Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </section>

          {/* PASSWORD CHANGE */}
          <section className="profile-card profile-password-card">
            <div className="card-heading">
              <div>
                <span>ACCOUNT SECURITY</span>
                <h2>Password &amp; Security</h2>
              </div>

              {!passwordOpen && (
                <button
                  type="button"
                  className="security-btn"
                  onClick={openPasswordForm}
                >
                  Change Password
                </button>
              )}
            </div>

            <p>
              Keep your account secure by using a strong password.
            </p>

            {passwordError && (
              <p
                className="profile-feedback profile-error"
                role="alert"
              >
                {passwordError}
              </p>
            )}

            {passwordSuccess && (
              <p
                className="profile-feedback profile-success"
                role="status"
              >
                {passwordSuccess}
              </p>
            )}

            {passwordOpen && (
              <form onSubmit={handlePasswordSave}>
                <p className="profile-password-help">
                  Use at least 8 characters for your new password
                  (maximum 72 UTF-8 bytes).
                </p>

                <div className="profile-form-grid">
                  <div className="profile-field full-field">
                    <label htmlFor="current-password">
                      Current Password
                    </label>

                    <input
                      id="current-password"
                      name="currentPassword"
                      type={showPasswords ? "text" : "password"}
                      autoComplete="current-password"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      disabled={passwordSaving}
                      required
                    />
                  </div>

                  <div className="profile-field full-field">
                    <label htmlFor="new-password">
                      New Password
                    </label>

                    <input
                      id="new-password"
                      name="newPassword"
                      type={showPasswords ? "text" : "password"}
                      autoComplete="new-password"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      disabled={passwordSaving}
                      minLength={8}
                      required
                    />
                  </div>

                  <div className="profile-field full-field">
                    <label htmlFor="confirm-password">
                      Confirm New Password
                    </label>

                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type={showPasswords ? "text" : "password"}
                      autoComplete="new-password"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      disabled={passwordSaving}
                      minLength={8}
                      required
                    />
                  </div>
                </div>

                <label className="profile-password-toggle">
                  <input
                    type="checkbox"
                    checked={showPasswords}
                    onChange={(event) =>
                      setShowPasswords(event.target.checked)
                    }
                    disabled={passwordSaving}
                  />
                  Show passwords
                </label>

                <div className="profile-form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={cancelPasswordChange}
                    disabled={passwordSaving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-profile-btn"
                    disabled={passwordSaving}
                  >
                    {passwordSaving
                      ? "Updating..."
                      : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>

      {/* MOBILE NAVIGATION */}
      <nav className="profile-mobile-nav">
        {navigationLinks}
      </nav>
    </div>
  );
}

export default Profile;