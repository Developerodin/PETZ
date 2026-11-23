"use client";

import { useState } from "react";

const ERRORS: Record<string, string> = {
  invalid: "Invalid email or password.",
  rate: "Too many submissions. Please try again in a few minutes.",
  server: "Could not complete admin login.",
};

export function AdminLoginForm({ error }: { error?: string }) {
  const [pending, setPending] = useState(false);
  const message = error ? ERRORS[error] || ERRORS.invalid : "";

  return (
    <div className={`admin-login-form-wrap${pending ? " is-pending" : ""}`}>
      {pending ? (
        <div className="admin-login-busy" role="status" aria-live="assertive">
          <span className="admin-spinner" aria-hidden="true" />
          <p>Signing in…</p>
        </div>
      ) : null}
      <form
        className="auth-email-form"
        method="post"
        action="/api/admin/login"
        noValidate
        aria-busy={pending}
        onSubmit={() => setPending(true)}
      >
        <div className={`form-field${message ? " is-error" : ""}`}>
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            name="email"
            type="text"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
          />
        </div>
        <div className={`form-field${message ? " is-error" : ""}`}>
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        {message ? (
          <p className="auth-error" role="alert">
            {message}
          </p>
        ) : null}
        <div className="form-actions is-end">
          <button className="button is-primary" type="submit" disabled={pending}>
            <span className="button-hover"></span>
            <span className="button-label">
              {pending ? (
                <>
                  <span className="admin-spinner" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
