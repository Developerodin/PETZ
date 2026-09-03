"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const LAST_EMAIL_KEY = "petz.auth.email";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function GoogleMark() {
  return (
    <svg className="auth-google-mark" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71A5.41 5.41 0 0 1 3.69 9c0-.6.1-1.17.26-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

function EyeIcon({ off }: { off: boolean }) {
  if (off) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 3l18 18M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4M9.9 5.1A10.6 10.6 0 0 1 12 5c5 0 9.3 3.1 11 7.5a12 12 0 0 1-4.2 5.1M6.1 6.1A12 12 0 0 0 1 12.5C2.7 16.9 7 20 12 20c1.4 0 2.7-.3 3.9-.7"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M1 12.5C2.7 8.1 7 5 12 5s9.3 3.1 11 7.5C21.3 16.9 17 20 12 20S2.7 16.9 1 12.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.5" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function credentialsError(code?: string | null) {
  if (code === "google_account") {
    return "This email is registered with Google. Continue with Google.";
  }
  return "Invalid email or password.";
}

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">(searchParams.get("mode") === "signup" ? "signup" : "signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"google" | "form" | null>(null);
  const [lastUsed, setLastUsed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [forgotHint, setForgotHint] = useState(false);

  const isSignup = mode === "signup";

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LAST_EMAIL_KEY) || "";
      if (stored) {
        setEmail(stored);
        setLastUsed(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const code = searchParams.get("error");
    if (code === "Configuration" || code === "AdapterError") {
      setError("Sign-in could not finish because the live server cannot reach the database. Try again after Atlas network access is open to Vercel.");
    }
  }, [searchParams]);

  function switchMode(next: "signin" | "signup") {
    setMode(next);
    setError("");
    setBusy(null);
    setForgotHint(false);
    const params = new URLSearchParams();
    if (next === "signup") params.set("mode", "signup");
    if (callbackUrl && callbackUrl !== "/account") params.set("callbackUrl", callbackUrl);
    const query = params.toString();
    router.replace(query ? `/login?${query}` : "/login", { scroll: false });
  }

  function startGoogle() {
    setError("");
    setBusy("google");
    return signIn("google", { callbackUrl });
  }

  function rememberEmail(value: string) {
    try {
      localStorage.setItem(LAST_EMAIL_KEY, value);
    } catch {
      /* ignore */
    }
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const fullName = name.trim().replace(/\s+/g, " ");
    const emailValue = email.trim().toLowerCase();

    if (isSignup && fullName.length < 2) {
      setError("Enter your full name.");
      return;
    }
    if (!EMAIL_RE.test(emailValue)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (isSignup && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setBusy("form");

    try {
      if (isSignup) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: fullName, email: emailValue, password }),
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          setError(data.error || "Could not create account.");
          setBusy(null);
          return;
        }
      }

      const result = await signIn("credentials", {
        email: emailValue,
        password,
        callbackUrl,
        redirect: false,
      });

      if (!result || result.error) {
        setError(credentialsError(result?.code));
        setBusy(null);
        return;
      }

      rememberEmail(emailValue);
      window.location.href = result.url || callbackUrl;
    } catch {
      setError("Something went wrong. Try again.");
      setBusy(null);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-card-body">
        <p className="auth-brand">PETZ</p>
        <h1 className="auth-title">{isSignup ? "Create your account" : "Welcome back"}</h1>
        <p className="auth-lede">
          {isSignup ? "Enter your details to save pet profiles and assessments." : "Sign in to access PETZ tools"}
        </p>

        <button className="auth-google" type="button" disabled={busy !== null} onClick={() => startGoogle()}>
          <GoogleMark />
          <span className="auth-google-label">{isSignup ? "Sign up with Google" : "Continue with Google"}</span>
        </button>

        <div className="auth-or" role="separator">
          <span>or</span>
        </div>

        <form className="auth-email-form" noValidate onSubmit={submitForm}>
          {isSignup ? (
            <div className="auth-field">
              <label htmlFor="loginName">Full name</label>
              <input
                id="loginName"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
              />
            </div>
          ) : null}

          <div className="auth-field">
            <div className="auth-field-head">
              <label htmlFor="loginEmail">Email address</label>
              {lastUsed && !isSignup ? <span className="auth-last-used">Last used</span> : null}
            </div>
            <input
              id="loginEmail"
              type="email"
              autoComplete="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setLastUsed(false);
                if (error) setError("");
              }}
            />
          </div>

          <div className="auth-field">
            <div className="auth-field-head">
              <label htmlFor="loginPassword">Password</label>
              {!isSignup ? (
                <button className="auth-forgot" type="button" onClick={() => setForgotHint((open) => !open)}>
                  Forgot password?
                </button>
              ) : null}
            </div>
            <div className="auth-input-wrap">
              <input
                id="loginPassword"
                type={showPassword ? "text" : "password"}
                autoComplete={isSignup ? "new-password" : "current-password"}
                placeholder={isSignup ? "At least 8 characters" : "Enter your password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
              />
              <button
                className="auth-eye"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((value) => !value)}
              >
                <EyeIcon off={showPassword} />
              </button>
            </div>
            {forgotHint && !isSignup ? (
              <p className="auth-hint">
                Password reset isn&apos;t available yet. Try Google, or{" "}
                <Link href="/support">contact us</Link>.
              </p>
            ) : null}
          </div>

          {isSignup ? (
            <div className="auth-field">
              <label htmlFor="loginConfirm">Confirm password</label>
              <div className="auth-input-wrap">
                <input
                  id="loginConfirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    if (error) setError("");
                  }}
                />
                <button
                  className="auth-eye"
                  type="button"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirm((value) => !value)}
                >
                  <EyeIcon off={showConfirm} />
                </button>
              </div>
            </div>
          ) : null}

          {error ? <p className="auth-error">{error}</p> : null}

          <button className="auth-continue" type="submit" disabled={busy !== null}>
            <span>
              {busy === "form" ? (isSignup ? "Creating account…" : "Continuing…") : isSignup ? "Create account" : "Continue"}
            </span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>

      <div className="auth-card-foot">
        <span>{isSignup ? "Already have an account?" : "Don't have an account?"}</span>
        <button className="auth-signup" type="button" disabled={busy !== null} onClick={() => switchMode(isSignup ? "signin" : "signup")}>
          {isSignup ? "Sign in" : "Sign up"}
        </button>
      </div>
    </div>
  );
}
