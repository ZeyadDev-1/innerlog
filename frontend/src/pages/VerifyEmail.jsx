import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/client";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const uid = params.get("uid");
  const token = params.get("token");

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verify() {
      if (!uid || !token) {
        setStatus("error");
        setMessage("Missing uid or token in the verification link.");
        return;
      }

      try {
        const res = await api.post("auth/verify-email/", { uid, token });
        setStatus("success");
        setMessage(res.data?.detail || "Email verified successfully.");
      } catch (err) {
        setStatus("error");
        setMessage(
          err?.response?.data?.detail || "Verification failed. Link may be expired."
        );
      }
    }

    verify();
  }, [uid, token]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Email Verification</h2>

        {status === "loading" && (
          <p className="auth-subtitle">Verifying your email…</p>
        )}

        {status === "success" && (
          <>
            <p className="auth-subtitle">{message}</p>
            <Link className="auth-secondary" to="/login">
              Go to login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="auth-error">{message}</div>
            <Link className="auth-secondary" to="/signup">
              Try signing up again
            </Link>
            <Link className="auth-link" to="/login">
              Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}