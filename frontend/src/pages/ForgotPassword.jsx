import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username) {
      setError("Username is required.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("auth/password-reset/confirm/", {
        username,
        new_password: newPassword,
      });
      setDone(true);

      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err?.response?.data?.detail || "Password reset failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card card border-0">
          <div className="card-body p-4 p-md-5">
            <h2 className="auth-title">Password updated</h2>
            <p className="auth-subtitle">You can now log in with your new password.</p>

            <Link className="auth-secondary btn btn-outline-secondary" to="/login">
              Go to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card card border-0">
        <div className="card-body p-4 p-md-5">
          <h2 className="auth-title">Reset password</h2>
          <p className="auth-subtitle">Enter your username and choose a new password.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={submit} className="auth-form">
            <div>
              <label className="auth-label form-label" htmlFor="forgot-username">Username</label>
              <input
                id="forgot-username"
                className="auth-input form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="auth-label form-label" htmlFor="forgot-password">New password</label>
              <input
                id="forgot-password"
                className="auth-input form-control"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="auth-label form-label" htmlFor="forgot-confirm">Confirm new password</label>
              <input
                id="forgot-confirm"
                className="auth-input form-control"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm password"
                autoComplete="new-password"
              />
            </div>

            <button className="auth-primary btn btn-primary" disabled={loading}>
              {loading ? "Saving changes..." : "Reset password"}
            </button>

            <Link className="auth-link" to="/login">
              Back to login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
