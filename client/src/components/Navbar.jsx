import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">

        {/* Logo */}
        <a href="#" className="navbar-logo" onClick={closeMenu}>
          Tika<span>Track</span>
        </a>

        {/* Navigation */}
        <nav className={`nav-menu ${menuOpen ? "active" : ""}`}>
          <a href="#" onClick={closeMenu}>
            Home
          </a>

          <a href="#about" onClick={closeMenu}>
            About
          </a>

          <a href="#features" onClick={closeMenu}>
            Features
          </a>

          <a href="#how-it-works" onClick={closeMenu}>
            How It Works
          </a>

          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>

          {/* Mobile Buttons */}
          <div className="mobile-nav-buttons">
            <a href="/login" className="nav-login" onClick={closeMenu}>
              Login
            </a>

            <a href="/register" className="nav-register" onClick={closeMenu}>
              Register
            </a>
          </div>
        </nav>

        {/* Desktop Buttons */}
        <div className="desktop-nav-buttons">
          <a href="/login" className="nav-login">
            Login
          </a>

          <a href="/register" className="nav-register">
            Register
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </header>
  );
}

export default Navbar;