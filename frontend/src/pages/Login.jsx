import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("auth/login/", { username, password });

      // SimpleJWT response: { access, refresh }
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      onLogin?.();
      navigate("/", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        "Login failed. Check your username and password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Login to continue to InnerLog</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={submit} className="auth-form">
          <label className="auth-label">Username</label>
          <input
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            autoComplete="username"
          />

          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
          />

          <button className="auth-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Under login fields */}
          <Link className="auth-secondary" to="/signup">
            Sign up
          </Link>

          <Link className="auth-link" to="/forgot-password">
            I forgot my password
          </Link>
        </form>
      </div>
    </div>
  );
}