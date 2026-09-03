"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  computeAssessment,
  type AssessmentAnswers,
  type AssessmentResult,
} from "@/lib/assessment-score";
import { ASSISTANT_NAME } from "@/lib/assistant";

function readAnswers(): AssessmentAnswers {
  try {
    const raw = sessionStorage.getItem("petz_assess_answers");
    if (raw) return JSON.parse(raw) as AssessmentAnswers;
  } catch {
    /* ignore */
  }
  try {
    const preview = JSON.parse(sessionStorage.getItem("petz_assess_preview") || "{}") as Record<string, string>;
    return {
      name: preview["Pet name"],
      species: preview.Species?.toLowerCase(),
      breed: preview.Breed,
      age: preview["Date of birth"] || preview.Age,
      diet: preview.Diet,
      bcs: preview["Body condition (1–9)"],
    };
  } catch {
    return {};
  }
}

export function AssessResultsView({ signedIn }: { signedIn: boolean }) {
  const [answers, setAnswers] = useState<AssessmentAnswers | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    const next = readAnswers();
    setAnswers(next);
    setResult(computeAssessment(next));
  }, []);

  if (!result || !answers) {
    return (
      <div className="inner-container-center measure-wide">
        <p>Loading your health insights…</p>
      </div>
    );
  }

  const name = answers.name?.trim() || "Your pet";
  const ageBit =
    answers.age && answers.age.length < 12
      ? `${answers.age} years`
      : answers.dateOfBirth
        ? answers.dateOfBirth.split("-").reverse().join("/")
        : answers.age || "";
  const meta = [answers.species === "cat" ? "Cat" : answers.species === "dog" ? "Dog" : "", answers.breed, ageBit]
    .filter(Boolean)
    .join(" · ");
  const avatar = answers.species === "cat" ? "/assets/images/grey-cat.jpg" : "/assets/images/labrador.jpg";
  const chatHref = signedIn
    ? answers.id
      ? `/symptom-checker?petId=${encodeURIComponent(answers.id)}&chat=1`
      : "/symptom-checker"
    : `/login?callbackUrl=${encodeURIComponent("/symptom-checker")}`;

  return (
    <>
      <div className="inner-container-center measure-wide">
        <span className="example-chip">Personalized guidance — not a veterinary diagnosis</span>
        <h1 className="display-8">{`${name}'s health profile`}</h1>
        <p>
          Based on the information you provided. PETZ highlights what appears healthy, what is worth improving, and
          potential concerns that may deserve professional attention.
        </p>
      </div>

      <div className="dashboard-mock">
        <div className="dashboard-mock__top">
          <div className="dashboard-pet">
            <img src={avatar} alt="" width="1200" height="800" decoding="async" />
            <div>
              <div className="display-4">{name}</div>
              <p>{meta || "Health profile"}</p>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              className="score-ring"
              style={{ background: `conic-gradient(var(--color-accent) 0 ${result.overall}%, var(--color-600) 0)` }}
              aria-hidden="true"
            >
              <span>{result.overall}</span>
            </div>
            <p className="mt-2" style={{ fontWeight: 600, color: "var(--color-100)" }}>
              PETZ Health Score
            </p>
            <p className="display-4" style={{ color: "var(--color-accent)", marginTop: "8px" }}>
              {result.band}
            </p>
          </div>
        </div>
        <div className="dash-rows">
          {result.dimensions.map((dim) => (
            <div className="dash-row" key={dim.key}>
              <span className="label">{dim.label}</span>
              <div className="bar">
                <span className={dim.status === "healthy" ? "is-accent" : undefined} style={{ width: `${dim.score}%` }} />
              </div>
              <span className="val">{dim.statusLabel}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="insight-grid">
        <div className="insight-card">
          <h2 className="display-5">Appears healthy</h2>
          {result.healthy.length ? (
            <ul>
              {result.healthy.map((dim) => (
                <li key={dim.key}>{dim.label}</li>
              ))}
            </ul>
          ) : (
            <p>No area is clearly on track yet — adding a little more detail next time will help.</p>
          )}
        </div>
        <div className="insight-card">
          <h2 className="display-5">Worth improving</h2>
          {result.improve.length ? (
            <ul>
              {result.improve.map((dim) => (
                <li key={dim.key}>{dim.label}</li>
              ))}
            </ul>
          ) : (
            <p>Nothing in the middle range from this snapshot.</p>
          )}
        </div>
        <div className="insight-card">
          <h2 className="display-5">May deserve attention</h2>
          {result.concerns.length ? (
            <ul>
              {result.concerns.map((dim) => (
                <li key={dim.key}>{dim.label}</li>
              ))}
            </ul>
          ) : (
            <p>No potential concerns stood out from the information you shared.</p>
          )}
        </div>
      </div>

      <div className="white-card plan-card">
        <h2 className="display-5">Personalized next steps</h2>
        <p className="pet-lede">What to focus on, why it matters, and what you can do next.</p>
        <ol className="plan-list">
          {result.plan.map((item) => (
            <li key={item.focus}>
              <p className="plan-focus">{item.focus}</p>
              <p>
                <strong>Why it matters.</strong> {item.why}
              </p>
              <p>
                <strong>What you can do next.</strong> {item.next}
              </p>
            </li>
          ))}
        </ol>
        <p className="field-hint" style={{ marginTop: 16 }}>
          If your pet is sick, deteriorating, or experiencing an emergency, a licensed veterinarian should always be
          your first point of care.
        </p>
      </div>

      <div className="button-row is-center-aligned" style={{ marginTop: 32 }}>
        <Link className="button is-primary" href={chatHref}>
          <span className="button-hover"></span>
          <span className="button-label">Chat with {ASSISTANT_NAME}</span>
        </Link>
        {signedIn ? (
          <a className="button is-secondary" href="/account">
            <span className="button-hover"></span>
            <span className="button-label">View pet profile</span>
          </a>
        ) : (
          <Link className="button is-secondary" href="/login?callbackUrl=/account">
            <span className="button-hover"></span>
            <span className="button-label">Sign in to save</span>
          </Link>
        )}
        <Link className="button is-secondary" href="/science">
          <span className="button-hover"></span>
          <span className="button-label">The Science</span>
        </Link>
        <Link className="button is-secondary" href="/assess">
          <span className="button-hover"></span>
          <span className="button-label">Start over</span>
        </Link>
      </div>
    </>
  );
}
