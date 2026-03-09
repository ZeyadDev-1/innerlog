import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import InnerLogLogo from "./InnerLogLogo";

export default function Navbar({ loggedIn, onLogout, theme, onThemeToggle }) {
  const [expanded, setExpanded] = useState(false);

  const closeMenu = () => setExpanded(false);

  return (
    <nav className="layout-navbar">
      <div className="layout-navbar-inner">
        <Link className="layout-brand" to="/" onClick={closeMenu}>
          <InnerLogLogo />
          <span>InnerLog</span>
        </Link>

        <button
          className="layout-menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
        >
          ☰
        </button>

        <div className={`layout-menu ${expanded ? "open" : ""}`}>
          <div className="layout-links">
            <NavLink className="layout-link" to="/" onClick={closeMenu}>
              Dashboard
            </NavLink>
            <NavLink className="layout-link" to="/about" onClick={closeMenu}>
              About Us
            </NavLink>
            <NavLink className="layout-link" to="/contact" onClick={closeMenu}>
              Contact Us
            </NavLink>
          </div>

          <div className="layout-actions">
            <button type="button" className="layout-btn layout-btn-secondary" onClick={onThemeToggle}>
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>

            {!loggedIn ? (
              <>
                <NavLink className="layout-btn layout-btn-secondary" to="/login" onClick={closeMenu}>
                  Login
                </NavLink>
                <NavLink className="layout-btn layout-btn-primary" to="/signup" onClick={closeMenu}>
                  Signup
                </NavLink>
              </>
            ) : (
              <button type="button" className="layout-btn layout-btn-danger" onClick={onLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
