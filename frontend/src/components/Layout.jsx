import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children, loggedIn, onLogout, theme, onThemeToggle }) {
  return (
    <div className="app-shell d-flex flex-column min-vh-100">
      <Navbar loggedIn={loggedIn} onLogout={onLogout} theme={theme} onThemeToggle={onThemeToggle} />
      <main className="flex-grow-1 py-4">{children}</main>
      <Footer />
    </div>
  );
}
