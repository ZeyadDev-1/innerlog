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
        <div className="auth-card card border-0">
          <div className="card-body p-4 p-md-5">
            <h2 className="auth-title">Check your email</h2>
            <p className="auth-subtitle">
              We sent a verification link to <strong>{email}</strong>. Open the email and
              click the link to activate your account.
            </p>

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
          <h2 className="auth-title">Create account</h2>
          <p className="auth-subtitle">Begin your journaling journey with InnerLog.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={submit} className="auth-form">
            <div>
              <label className="auth-label form-label" htmlFor="signup-username">Username</label>
              <input
                id="signup-username"
                className="auth-input form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="auth-label form-label" htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                className="auth-input form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="auth-label form-label" htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                className="auth-input form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                autoComplete="new-password"
              />
            </div>

            <button className="auth-primary btn btn-primary" disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
            </button>

            <Link className="auth-link" to="/login">
              Already have an account? Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
