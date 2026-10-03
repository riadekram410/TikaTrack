import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./resetPassword.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Unable to reset password."
        );
        return;
      }

      setSuccess(true);
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">

      <div className="reset-password-container">

        <Link
          to="/"
          className="reset-password-logo"
        >
          Tika<span>Track</span>
        </Link>

        {!success ? (
          <>
            <div className="reset-password-icon">
              🔒
            </div>

            <div className="reset-password-heading">
              <h1>Reset Your Password</h1>

              <p>
                Enter your new password below to
                secure your TikaTrack account.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="reset-password-form"
            >

              <div className="reset-password-group">
                <label htmlFor="password">
                  New Password
                </label>

                <input
                  type="password"
                  id="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </div>

              <div className="reset-password-group">
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                />
              </div>

              {error && (
                <p className="reset-password-error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="reset-password-button"
                disabled={loading}
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>

            </form>

            <div className="reset-password-login">
              Remember your password?

              <Link to="/login">
                Login
              </Link>
            </div>
          </>
        ) : (
          <div className="reset-password-success">

            <div className="reset-success-icon">
              ✓
            </div>

            <h2>Password Reset Successful</h2>

            <p>
              Your password has been successfully
              changed. You can now login with your
              new password.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="reset-password-button"
            >
              Go to Login
            </button>

          </div>
        )}

        <Link
          to="/"
          className="reset-password-home"
        >
          ← Back to home
        </Link>

      </div>

    </div>
  );
}

export default ResetPassword;