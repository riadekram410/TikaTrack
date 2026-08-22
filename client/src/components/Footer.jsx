function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">

        <div className="footer-main">

          {/* Brand */}
          <div className="footer-brand">
            <a href="#" className="footer-logo">
              Tika<span>Track</span>
            </a>

            <p>
              A simple and smart vaccination tracking
              system for families in Bangladesh.
            </p>
          </div>

          {/* Product */}
          <div className="footer-column">
            <h4>Product</h4>

            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </div>

          {/* Company */}
          <div className="footer-column">
            <h4>Company</h4>

            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>

          {/* Support */}
          <div className="footer-column">
            <h4>Support</h4>

            <a href="#">Help Center</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
          </div>

        </div>

        <div className="footer-bottom">
          <p>
            © 2026 TikaTrack. All rights reserved.
          </p>

          <p>
            Built for better vaccination tracking.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;