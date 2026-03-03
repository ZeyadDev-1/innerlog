import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const uid = params.get("uid");
  const token = params.get("token");

  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!uid || !token) {
      setError("Missing uid or token. Please use the link from your email.");
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
        uid,
        token,
        new_password: newPassword,
      });
      setDone(true);

      // optional: auto redirect after short delay
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Reset failed. Link may be expired. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2 className="auth-title">Password updated</h2>
          <p className="auth-subtitle">You can now log in with your new password.</p>

          <Link className="auth-secondary" to="/login">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Reset password</h2>
        <p className="auth-subtitle">Set a new password for your account.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={submit} className="auth-form">
          <label className="auth-label">New password</label>
          <input
            className="auth-input"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            autoComplete="new-password"
          />

          <label className="auth-label">Confirm new password</label>
          <input
            className="auth-input"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
            autoComplete="new-password"
          />

          <button className="auth-primary" disabled={loading}>
            {loading ? "Saving..." : "Reset password"}
          </button>

          <Link className="auth-link" to="/login">
            Back to login
          </Link>
        </form>
      </div>
    </div>
  );
}