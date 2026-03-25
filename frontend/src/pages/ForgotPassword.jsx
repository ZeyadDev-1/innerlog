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

    if (!email) {
      setError("Email is required.");
      return;
    }

    setLoading(true);

    try {
      await api.post("auth/password-reset/", { email });
      setDone(true);
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to send reset email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card card border-0">
          <div className="card-body p-4 p-md-5">
            <h2 className="auth-title">Check your email</h2>
            <p className="auth-subtitle">If an account exists for this email, we sent a reset link.</p>

            <Link className="auth-secondary btn btn-outline-secondary" to="/login">
              Back to login
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
          <h2 className="auth-title">Forgot password</h2>
          <p className="auth-subtitle">Enter your email and we&apos;ll send a reset link.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={submit} className="auth-form">
            <div>
              <label className="auth-label form-label" htmlFor="forgot-email">Email</label>
              <input
                id="forgot-email"
                className="auth-input form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <button className="auth-primary btn btn-primary" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
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
