import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children, loggedIn, onLogout, theme, onThemeToggle }) {
  return (
    <div className="app-shell">
      <Navbar loggedIn={loggedIn} onLogout={onLogout} theme={theme} onThemeToggle={onThemeToggle} />
      <main className="layout-main">{children}</main>
      <Footer />
    </div>
  );
}
