import { useState } from "react";
import { Link } from "react-router-dom";
import "./forgotpass.css";

function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend connect করার পরে এখানে API call হবে
    setSubmitted(true);
  };

  return (
    <div className="forgot-page">

      {/* Left Side */}
      <div className="forgot-brand-section">
        <div className="forgot-brand-content">

          <Link to="/" className="forgot-logo">
            Tika<span>Track</span>
          </Link>

          <div className="forgot-brand-text">
            <h1>
              Keep Your Account
              <span> Secure & Accessible.</span>
            </h1>

            <p>
              Don't worry if you forgot your password.
              We'll help you get back into your TikaTrack account.
            </p>
          </div>

          <div className="forgot-brand-points">

            <div className="forgot-point">
              <div className="forgot-point-icon">✓</div>

              <div>
                <strong>Secure Account</strong>
                <span>Your account information stays protected.</span>
              </div>
            </div>

            <div className="forgot-point">
              <div className="forgot-point-icon">✓</div>

              <div>
                <strong>Simple Recovery</strong>
                <span>Reset your password in just a few steps.</span>
              </div>
            </div>

            <div className="forgot-point">
              <div className="forgot-point-icon">✓</div>

              <div>
                <strong>Get Back on Track</strong>
                <span>Continue managing your child's vaccinations.</span>
              </div>
            </div>

          </div>

        </div>
      </div>


      {/* Right Side */}
      <div className="forgot-form-section">

        <div className="forgot-form-container">

          {/* Mobile Logo */}
          <div className="forgot-mobile-logo">
            <Link to="/" className="forgot-logo">
              Tika<span>Track</span>
            </Link>
          </div>


          {/* Icon */}
          <div className="forgot-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
              />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </div>


          {/* Heading */}
          <div className="forgot-heading">
            <h2>Forgot Password?</h2>

            <p>
              Enter your email address and we'll send you
              instructions to reset your password.
            </p>
          </div>


          {!submitted ? (

            <form
              onSubmit={handleSubmit}
              className="forgot-form"
            >

              <div className="forgot-form-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                />

              </div>


              <button
                type="submit"
                className="forgot-submit-button"
              >
                Send Reset Link
              </button>

            </form>

          ) : (

            <div className="forgot-success">

              <div className="forgot-success-icon">
                ✓
              </div>

              <h3>
                Check Your Email
              </h3>

              <p>
                If an account exists with that email,
                you'll receive a password reset link shortly.
              </p>

              <Link
                to="/login"
                className="forgot-success-button"
              >
                Back to Login
              </Link>

            </div>

          )}


          {/* Login */}
          {!submitted && (
            <div className="forgot-login">

              <span>
                Remember your password?
              </span>

              <Link to="/login">
                Login
              </Link>

            </div>
          )}


          {/* Back Home */}
          <Link to="/" className="forgot-back-home">
            ← Back to home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;