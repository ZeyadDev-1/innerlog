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
      <div className="auth-card card border-0">
        <div className="card-body p-4 p-md-5">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to continue your InnerLog journey.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={submit} className="auth-form">
            <div>
              <label className="auth-label form-label" htmlFor="login-username">Username</label>
              <input
                id="login-username"
                className="auth-input form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="auth-label form-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="auth-input form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <button className="auth-primary btn btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <Link className="auth-secondary btn btn-outline-secondary" to="/signup">
              Don&apos;t have an account? Sign up
            </Link>

            <Link className="auth-link" to="/forgot-password">
              Forgot password?
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
