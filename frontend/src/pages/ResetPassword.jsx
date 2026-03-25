import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/client";

const getErrorMessage = (data, fallback) => {
  if (!data) return fallback;
  if (typeof data.detail === "string") return data.detail;
  if (typeof data.detail === "object" && typeof data.detail?.detail === "string") return data.detail.detail;

  const firstField = Object.values(data).find((value) => Array.isArray(value) && value.length > 0);
  if (firstField) return firstField[0];

  return fallback;
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const uid = useMemo(() => searchParams.get("uid") || "", [searchParams]);
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function validateLink() {
      if (!uid || !token) {
        setError("This reset link is invalid or incomplete.");
        setValidating(false);
        return;
      }

      try {
        await api.post("auth/password-reset/validate/", { uid, token });
      } catch (err) {
        setError(getErrorMessage(err?.response?.data, "This reset link is invalid or has expired."));
      } finally {
        setValidating(false);
      }
    }

    validateLink();
  }, [token, uid]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

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
      navigate("/login?message=password_changed", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err?.response?.data, "Password reset failed. Try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card border-0">
        <div className="card-body p-4 p-md-5">
          <h2 className="auth-title">Set new password</h2>
          <p className="auth-subtitle">Choose a new password for your account.</p>

          {validating && <p className="auth-subtitle mb-3">Validating reset link...</p>}
          {error && <div className="auth-error">{error}</div>}

          {!validating && !error && (
            <form onSubmit={submit} className="auth-form">
              <div>
                <label className="auth-label form-label" htmlFor="reset-password">New password</label>
                <input
                  id="reset-password"
                  className="auth-input form-control"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="auth-label form-label" htmlFor="reset-confirm">Confirm new password</label>
                <input
                  id="reset-confirm"
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
            </form>
          )}

          <Link className="auth-link" to="/login">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
