"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+$/;

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const nextEmail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(nextEmail) || !password) {
      setError("Invalid email or password.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: nextEmail, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Invalid email or password.");
        setPending(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Could not complete admin login.");
      setPending(false);
    }
  }

  return (
    <form className="auth-email-form" onSubmit={onSubmit} noValidate>
      <div className={`form-field${error ? " is-error" : ""}`}>
        <label htmlFor="admin-email">Email</label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={pending}
          required
        />
      </div>
      <div className={`form-field${error ? " is-error" : ""}`}>
        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={pending}
          required
        />
      </div>
      {error ? (
        <p className="auth-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="form-actions is-end">
        <button className="button is-primary" type="submit" disabled={pending}>
          <span className="button-label">{pending ? "Signing in…" : "Sign in"}</span>
          <span className="button-hover" aria-hidden="true">
            {pending ? "Signing in…" : "Sign in"}
          </span>
        </button>
      </div>
    </form>
  );
}
