import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("auth/password-reset/", { email });
      setDone(true);
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Failed to send reset email. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2 className="auth-title">Check your email</h2>
          <p className="auth-subtitle">
            If an account exists for <strong>{email}</strong>, we sent a password
            reset link.
          </p>

          <Link className="auth-secondary" to="/login">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Forgot password</h2>
        <p className="auth-subtitle">
          Enter your email and we’ll send you a reset link.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={submit} className="auth-form">
          <label className="auth-label">Email</label>
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <button className="auth-primary" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>

          <Link className="auth-link" to="/login">
            Back to login
          </Link>
        </form>
      </div>
    </div>
  );
}