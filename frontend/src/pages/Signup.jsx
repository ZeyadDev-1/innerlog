import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import InnerLogLogo from "../components/InnerLogLogo";

const resendFallbackMessage =
  "If an inactive account matches that email, we have sent a new verification email.";

const getErrorMessage = (data, fallback) => {
  if (!data) return fallback;
  if (typeof data.detail === "string") return data.detail;
  if (typeof data.detail === "object" && typeof data.detail?.detail === "string") return data.detail.detail;

  const firstField = Object.values(data).find((value) => Array.isArray(value) && value.length > 0);
  if (firstField) return firstField[0];

  return fallback;
};

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("auth/register/", { username, email, password });
      setResendMessage("");
      setDone(true);
    } catch (err) {
      setError(
        getErrorMessage(
          err?.response?.data,
          "Signup failed. Please check your inputs and try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    setResendMessage("");
    setResending(true);

    try {
      const response = await api.post("auth/resend-verification-email/", { email });
      setResendMessage(response?.data?.detail || resendFallbackMessage);
    } catch {
      setResendMessage(resendFallbackMessage);
    } finally {
      setResending(false);
    }
  };

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card card border-0">
          <div className="card-body p-4 p-md-5">
            <div className="auth-brand mb-3">
              <InnerLogLogo size={42} className="auth-brand-logo" />
              <span>InnerLog</span>
            </div>
            <h2 className="auth-title">Check your email</h2>
            <p className="auth-subtitle">
              We sent a verification link to <strong>{email}</strong>. Open the email and
              click the link to activate your account.
            </p>

            {resendMessage && <div className="auth-helper-text mb-3">{resendMessage}</div>}

            <div className="auth-actions">
              <button
                type="button"
                className="auth-secondary btn btn-outline-secondary"
                onClick={resendVerificationEmail}
                disabled={resending}
              >
                {resending ? "Sending..." : "Resend verification email"}
              </button>
              <Link className="auth-link" to="/login">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card card border-0">
        <div className="card-body p-4 p-md-5">
          <div className="auth-brand mb-3">
            <InnerLogLogo size={42} className="auth-brand-logo" />
            <span>InnerLog</span>
          </div>
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
