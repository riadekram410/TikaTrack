import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Check password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fullName,
            email,
            phone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      console.log("Registration successful:", data.user);

      // Go to login page after successful registration
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* Left Side */}
      <div className="register-brand-section">
        <div className="register-brand-content">

          <Link to="/" className="register-logo">
            Tika<span>Track</span>
          </Link>

          <div className="register-brand-text">
            <h1>
              Start Your Child's
              <span> Vaccination Journey.</span>
            </h1>

            <p>
              Create your TikaTrack account and make
              vaccination tracking simple, organized, and stress-free.
            </p>
          </div>

          <div className="register-brand-points">

            <div className="register-point">
              <div className="register-point-icon">✓</div>

              <div>
                <strong>Organized Records</strong>
                <span>Keep all vaccination information in one place.</span>
              </div>
            </div>

            <div className="register-point">
              <div className="register-point-icon">✓</div>

              <div>
                <strong>Smart Schedule</strong>
                <span>Get a clear vaccination schedule for your child.</span>
              </div>
            </div>

            <div className="register-point">
              <div className="register-point-icon">✓</div>

              <div>
                <strong>Helpful Reminders</strong>
                <span>Stay informed about upcoming vaccinations.</span>
              </div>
            </div>

          </div>

        </div>
      </div>


      {/* Right Side */}
      <div className="register-form-section">

        <div className="register-form-container">

          {/* Mobile Logo */}
          <div className="register-mobile-logo">
            <Link to="/" className="register-logo">
              Tika<span>Track</span>
            </Link>
          </div>


          {/* Heading */}
          <div className="register-heading">
            <h2>Create an Account</h2>

            <p>
              Start managing your child's vaccination journey
            </p>
          </div>


          <form
            onSubmit={handleSubmit}
            className="register-form"
          >

            {/* Full Name */}
            <div className="register-form-group">

              <label htmlFor="fullName">
                Full Name
              </label>

              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

            </div>


            {/* Email */}
            <div className="register-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>


            {/* Phone */}
            <div className="register-form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

            </div>


            {/* Password */}
            <div className="register-form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="register-password-wrapper">

                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* Confirm Password */}
            <div className="register-form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="register-password-wrapper">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* Terms */}
            <label className="register-terms">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the{" "}
                <a href="#">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#">
                  Privacy Policy
                </a>.
              </span>

            </label>


            {/* Error Message */}
            {error && (
              <div className="register-error">
                {error}
              </div>
            )}


            {/* Submit */}
            <button
              type="submit"
              className="register-submit-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>


          {/* Login */}
          <div className="register-login">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login
            </Link>

          </div>


          {/* Back Home */}
          <Link to="/" className="register-back-home">
            ← Back to home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;