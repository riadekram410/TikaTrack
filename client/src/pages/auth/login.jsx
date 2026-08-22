import { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend connect করার পরে এখানে API call হবে
    console.log("Login submitted");
  };

  return (
    <div className="login-page">

      {/* Left Side */}
      <div className="login-brand-section">
        <div className="login-brand-content">

          <Link to="/" className="login-logo">
            Tika<span>Track</span>
          </Link>

          <div className="login-brand-text">
            <h1>
              Track Every Dose,
              <span> Protect Every Child.</span>
            </h1>

            <p>
              Keep your child's vaccination journey organized,
              up to date, and easy to manage.
            </p>
          </div>

          <div className="login-brand-points">

            <div className="login-point">
              <div className="login-point-icon">✓</div>

              <div>
                <strong>Easy to Manage</strong>
                <span>Keep vaccination records organized.</span>
              </div>
            </div>

            <div className="login-point">
              <div className="login-point-icon">✓</div>

              <div>
                <strong>Timely Reminders</strong>
                <span>Never forget an upcoming dose.</span>
              </div>
            </div>

            <div className="login-point">
              <div className="login-point-icon">✓</div>

              <div>
                <strong>Stay on Track</strong>
                <span>Monitor your child's progress.</span>
              </div>
            </div>

          </div>
        </div>
      </div>


      {/* Right Side */}
      <div className="login-form-section">

        <div className="login-form-container">

          <div className="login-mobile-logo">
            <Link to="/" className="login-logo">
              Tika<span>Track</span>
            </Link>
          </div>

          <div className="login-heading">
            <h2>Welcome Back!</h2>

            <p>
              Login to your TikaTrack account
            </p>
          </div>


          <form onSubmit={handleSubmit} className="login-form">

            {/* Email / Phone */}
            <div className="form-group">

              <label htmlFor="email">
                Email or Phone Number
              </label>

              <input
                type="text"
                id="email"
                name="email"
                placeholder="Enter email or phone number"
                required
              />

            </div>


            {/* Password */}
            <div className="form-group">

              <div className="password-label-row">

                <label htmlFor="password">
                  Password
                </label>

                <Link to="/forgot-password">
                  Forgot password?
                </Link>

              </div>

              <div className="password-input-wrapper">

                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* Remember Me */}
            <div className="remember-row">

              <label className="remember-label">

                <input
                  type="checkbox"
                  name="remember"
                />

                <span>Remember me</span>

              </label>

            </div>


            {/* Login Button */}
            <button
              type="submit"
              className="login-submit-button"
            >
              Login
            </button>

          </form>


          {/* Register */}
          <div className="login-register">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Register
            </Link>

          </div>


          <Link to="/" className="back-home">
            ← Back to home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;