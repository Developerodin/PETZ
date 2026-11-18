"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const ERROR_ID = "reset-form-error";

function errorFields(error: string) {
  const text = error.toLowerCase();
  if (!text) return { password: false, confirm: false };
  if (text.includes("password must")) return { password: true, confirm: false };
  if (text.includes("do not match")) return { password: true, confirm: true };
  return { password: true, confirm: true };
}

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const invalid = errorFields(error);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is invalid or has expired. Request a new one.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Could not reset your password. Try again.");
        setBusy(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Try again.");
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="auth-card">
        <div className="auth-card-body">
          <Link className="auth-brand" href="/">
            PETZ
          </Link>
          <h1 className="auth-title">Password updated</h1>
          <p className="auth-lede">You can now sign in with your new password.</p>
          <Link className="auth-continue" href="/login">
            <span>Go to sign in</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <div className="auth-card-body">
        <Link className="auth-brand" href="/">
          PETZ
        </Link>
        <h1 className="auth-title">Choose a new password</h1>
        <p className="auth-lede">Enter a new password for your account.</p>

        <form className="auth-email-form" noValidate onSubmit={submit}>
          <div className="auth-field">
            <label htmlFor="resetPassword">New password</label>
            <input
              id="resetPassword"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              aria-invalid={invalid.password ? "true" : undefined}
              aria-describedby={invalid.password ? ERROR_ID : undefined}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="resetConfirm">Confirm password</label>
            <input
              id="resetConfirm"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              aria-invalid={invalid.confirm ? "true" : undefined}
              aria-describedby={invalid.confirm ? ERROR_ID : undefined}
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                if (error) setError("");
              }}
            />
          </div>

          {error ? (
            <p className="auth-error" id={ERROR_ID} role="alert">
              {error}
            </p>
          ) : null}

          <button className="auth-continue" type="submit" disabled={busy}>
            <span>{busy ? "Updating…" : "Update password"}</span>
          </button>
        </form>
      </div>

      <div className="auth-card-foot">
        <span>Remembered it?</span>
        <Link className="auth-signup" href="/login">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
