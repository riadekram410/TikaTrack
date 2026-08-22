import Navbar from "../../components/Navbar";
import FeatureCard from "../../components/FeatureCard";
import Footer from "../../components/Footer";
import heroImage from "../../assets/hero.png";

function Landing() {
  return (
    <div className="landing-page">

      <Navbar />

      {/* HERO SECTION */}
      <section className="hero">
        <div className="container hero-container">

          <div className="hero-content">
            <span className="hero-badge">
              Child Vaccination Tracking
            </span>

            <h1>
              Track Every Dose,
              <span> Protect Every Child</span>
            </h1>

            <p className="hero-description">
              A simple and smart vaccination tracking and reminder
              system that helps parents keep their children's
              vaccination schedule on track.
            </p>

            <div className="hero-buttons">
              <a href="/register" className="btn btn-primary">
                Get Started
              </a>

              <a href="#features" className="btn btn-secondary">
                Learn More
              </a>
            </div>

            <div className="hero-trust">
              <div className="trust-item">
                <strong>Simple</strong>
                <span>Easy to use</span>
              </div>

              <div className="trust-divider"></div>

              <div className="trust-item">
                <strong>Smart</strong>
                <span>Personalized schedule</span>
              </div>

              <div className="trust-divider"></div>

              <div className="trust-item">
                <strong>Timely</strong>
                <span>Helpful reminders</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-circle"></div>

            <div className="hero-image-wrapper">
              <img
                src={heroImage}
                alt="TikaTrack vaccination"
                className="hero-image"
              />
            </div>

            <div className="floating-card floating-card-top">
              <div className="floating-icon">✓</div>

              <div>
                <strong>Vaccination</strong>
                <span>On Schedule</span>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <div className="floating-icon">🔔</div>

              <div>
                <strong>Reminder</strong>
                <span>Dose due soon</span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* FEATURES SECTION */}
      <section className="features-section" id="features">
        <div className="container">

          <div className="section-heading">
            <span className="section-label">
              FEATURES
            </span>

            <h2>
              Everything You Need to
              <span> Stay on Track</span>
            </h2>

            <p>
              TikaTrack makes it easier to manage, monitor,
              and remember every important vaccination.
            </p>
          </div>

          <div className="features-grid">

            <FeatureCard
              icon="🔔"
              title="Automatic Reminders"
              description="Receive timely reminders when your child's vaccination is due."
            />

            <FeatureCard
              icon="📅"
              title="Personalized Schedule"
              description="Get a vaccination schedule based on your child's date of birth."
            />

            <FeatureCard
              icon="📊"
              title="Vaccination Progress"
              description="See completed, upcoming, due, and overdue vaccinations at a glance."
            />

          </div>

        </div>
      </section>


      {/* ABOUT SECTION */}
      <section className="about-section" id="about">
        <div className="container about-container">

          <div className="about-content">
            <span className="section-label">
              ABOUT TIKATRACK
            </span>

            <h2>
              Making Vaccination
              <span> Easier to Manage</span>
            </h2>

            <p>
              Keeping track of multiple vaccination doses can
              be difficult for families. Paper cards can be
              misplaced, and upcoming doses can easily be forgotten.
            </p>

            <p>
              TikaTrack provides a digital way to keep a child's
              vaccination history organized and make upcoming
              vaccinations easier to remember.
            </p>

            <a href="#how-it-works" className="text-link">
              See how it works →
            </a>
          </div>

          <div className="about-card">

            <div className="about-stat">
              <div className="stat-icon">💉</div>

              <div>
                <strong>Digital Records</strong>
                <span>
                  Keep vaccination history organized
                </span>
              </div>
            </div>

            <div className="about-stat">
              <div className="stat-icon">🔔</div>

              <div>
                <strong>Timely Reminders</strong>
                <span>
                  Know when the next dose is coming
                </span>
              </div>
            </div>

            <div className="about-stat">
              <div className="stat-icon">📈</div>

              <div>
                <strong>Progress Tracking</strong>
                <span>
                  Understand vaccination progress
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works">
        <div className="container">

          <div className="section-heading">
            <span className="section-label">
              HOW IT WORKS
            </span>

            <h2>
              Get Started in
              <span> Four Simple Steps</span>
            </h2>

            <p>
              Register your child once and let TikaTrack
              help you stay organized.
            </p>
          </div>

          <div className="steps-grid">

            <div className="step-card">
              <span className="step-number">01</span>

              <div className="step-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6" />
                  <path d="M23 11h-6" />
                </svg>
              </div>

              <h3>Create Account</h3>

              <p>
                Create your TikaTrack account as a guardian.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number">02</span>

              <div className="step-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="9" cy="8" r="3.5" />
                  <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
                  <path d="M18 8v6" />
                  <path d="M15 11h6" />
                </svg>
              </div>

              <h3>Add Your Child</h3>

              <p>
                Add your child's basic information and date of birth.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number">03</span>

              <div className="step-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="17" rx="2" />
                  <path d="M16 2v4" />
                  <path d="M8 2v4" />
                  <path d="M3 10h18" />
                  <path d="M8 14h3" />
                  <path d="M8 17h6" />
                </svg>
              </div>

              <h3>Get Schedule</h3>

              <p>
                The system generates a personalized vaccination schedule.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number">04</span>

              <div className="step-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                  <path d="M10 21h4" />
                </svg>
              </div>

              <h3>Track & Remember</h3>

              <p>
                Track doses and receive reminders for upcoming vaccinations.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container cta-container">

          <div>
            <span className="section-label cta-label">
              GET STARTED
            </span>

            <h2>
              Keep Every Vaccination
              <span> on Track</span>
            </h2>

            <p>
              Start organizing your child's vaccination journey today.
            </p>
          </div>

          <a href="/register" className="btn btn-white">
            Create an Account
          </a>

        </div>
      </section>


      <Footer />

    </div>
  );
}

export default Landing;