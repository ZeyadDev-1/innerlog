import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("auth/register/", { username, email, password });
      setDone(true);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        "Signup failed. Please check your inputs and try again.";
      setError(msg);
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
            We sent a verification link to <strong>{email}</strong>.  
            Open the email and click the link to activate your account.
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
        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Sign up and verify your email to continue</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={submit} className="auth-form">
          <label className="auth-label">Username</label>
          <input
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            autoComplete="username"
          />

          <label className="auth-label">Email</label>
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            autoComplete="new-password"
          />

          <button className="auth-primary" disabled={loading}>
            {loading ? "Creating..." : "Sign up"}
          </button>

          <Link className="auth-link" to="/login">
            Already have an account? Login
          </Link>
        </form>
      </div>
    </div>
  );
}