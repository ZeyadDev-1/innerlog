import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import InnerLogLogo from "./InnerLogLogo";

export default function Navbar({ loggedIn, onLogout, theme, onThemeToggle }) {
  const [expanded, setExpanded] = useState(false);

  const closeMenu = () => setExpanded(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light layout-navbar border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-semibold" to="/" onClick={closeMenu}>
          <InnerLogLogo />
          <span>InnerLog</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${expanded ? "show" : ""}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={closeMenu}>
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about" onClick={closeMenu}>
                About Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact" onClick={closeMenu}>
                Contact Us
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 navbar-actions">
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={onThemeToggle}>
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>

            {!loggedIn ? (
              <>
                <NavLink className="btn btn-sm btn-outline-secondary" to="/login" onClick={closeMenu}>
                  Login
                </NavLink>
                <NavLink className="btn btn-sm btn-primary" to="/signup" onClick={closeMenu}>
                  Signup
                </NavLink>
              </>
            ) : (
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={onLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
