import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import InnerLogLogo from "../components/InnerLogLogo";
import api from "../api/client";

const statusContent = {
  loading: {
    title: "Verifying your email",
    subtitle: "We are confirming your email address and activating your account.",
    toneClass: "auth-status auth-status-info",
  },
  success: {
    title: "Email verified",
    toneClass: "auth-status auth-status-success",
  },
  invalid: {
    title: "Verification link invalid",
    toneClass: "auth-status auth-status-error",
  },
  expired: {
    title: "Verification link expired",
    toneClass: "auth-status auth-status-warning",
  },
};

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const uid = params.get("uid");
  const token = params.get("token");
  const verificationKey = useMemo(() => `${uid || "missing"}:${token || "missing"}`, [uid, token]);

  const attemptedVerificationRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Preparing your verification request...");

  useEffect(() => {
    async function verify() {
      if (attemptedVerificationRef.current === verificationKey) {
        return;
      }
      attemptedVerificationRef.current = verificationKey;

      if (!uid || !token) {
        setStatus("invalid");
        setMessage("Your verification link is incomplete. Please open the full link from your email.");
        return;
      }

      try {
        const res = await api.post("auth/verify-email/", { uid, token });
        setStatus("success");
        setMessage(res.data?.detail || "Your email has been verified successfully. You can sign in now.");
      } catch (err) {
        const errorCode = err?.response?.data?.code;
        if (errorCode === "expired_token") {
          setStatus("expired");
        } else {
          setStatus("invalid");
        }
        setMessage(
          err?.response?.data?.detail ||
            "We could not verify this email address. Please try again with a new verification link."
        );
      }
    }

    verify();
  }, [uid, token, verificationKey]);

  const currentContent = statusContent[status];

  return (
    <div className="auth-page">
      <div className="auth-card card border-0">
        <div className="card-body p-4 p-md-5">
          <div className="auth-brand mb-3">
            <InnerLogLogo size={42} className="auth-brand-logo" />
            <span>InnerLog</span>
          </div>

          <div className={currentContent.toneClass}>
            <strong>{currentContent.title}</strong>
          </div>
          <h2 className="auth-title mt-3">{currentContent.title}</h2>

          <p className="auth-subtitle">
            {status === "loading" ? currentContent.subtitle : message}
          </p>

          {status === "loading" && (
            <div className="auth-helper-text">Please wait while we validate your link.</div>
          )}

          {status === "success" && (
            <div className="auth-actions">
              <Link className="auth-secondary btn btn-outline-secondary" to="/login">
                Continue to login
              </Link>
            </div>
          )}

          {status === "invalid" && (
            <div className="auth-actions">
              <Link className="auth-secondary btn btn-outline-secondary" to="/signup">
                Sign up again
              </Link>
              <Link className="auth-link" to="/login">
                Back to login
              </Link>
            </div>
          )}

          {status === "expired" && (
            <div className="auth-actions">
              <Link className="auth-secondary btn btn-outline-secondary" to="/signup">
                Request a new verification email
              </Link>
              <Link className="auth-link" to="/login">
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
