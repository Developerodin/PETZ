"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PetFormWizard } from "@/components/PetFormWizard";
import { getInitials } from "@/lib/user-display";
import { formatPetAge, type PetRecord } from "@/lib/pet-utils";

type Step = "emergency" | "pick" | "basics" | "profile" | "chat";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function PawIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12 13.2c-2.6 0-5.2 1.5-5.2 3.6 0 1.7 1.6 2.7 5.2 2.7s5.2-1 5.2-2.7c0-2.1-2.6-3.6-5.2-3.6Zm-3.9-3.3c0 1.2-1 2.1-2.2 2.1S3.7 11.1 3.7 10 4.7 7.8 5.9 7.8s2.2 1 2.2 2.1Zm11.8 2.1c-1.2 0-2.2-.9-2.2-2.1s1-2.1 2.2-2.1 2.2 1 2.2 2.1-1 2.1-2.2 2.1ZM8.7 7.4c-1.2 0-2.2-.9-2.2-2.1S7.5 3.2 8.7 3.2s2.2 1 2.2 2.1-1 2.1-2.2 2.1Zm6.6 0c-1.2 0-2.2-.9-2.2-2.1s1-2.1 2.2-2.1 2.2 1 2.2 2.1-1 2.1-2.2 2.1Z" />
    </svg>
  );
}

function MessageBody({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return (
    <>
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const isList = lines.length > 1 && lines.every((line) => /^[-*•]/.test(line));
        if (isList) {
          return (
            <ul key={blockIndex}>
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>
                  <InlineText text={line.replace(/^[-*•]\s*/, "")} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={blockIndex}>
            {lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {lineIndex > 0 ? <br /> : null}
                <InlineText text={line} />
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={index}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

export function SymptomCheckerFlow({
  signedIn,
  initialPets = [],
  petsPreloaded = false,
}: {
  signedIn: boolean;
  initialPets?: PetRecord[];
  petsPreloaded?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const preselectedPetId = searchParams.get("petId");
  const startInChat = searchParams.get("chat") === "1";
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const preselectedPet =
    preselectedPetId && initialPets.length > 0
      ? initialPets.find((pet) => pet.id === preselectedPetId) ?? null
      : null;
  const chatGreeting = preselectedPet
    ? `Hi — I'm PETZ's AI health assistant for ${preselectedPet.name}. Ask about their health profile, routines, or anything you've noticed.\n\nI don't diagnose or replace a veterinarian. If this is an emergency, go to the nearest open clinic now.`
    : undefined;

  const [step, setStep] = useState<Step>(() => {
    if (signedIn && startInChat && preselectedPet) return "chat";
    if (signedIn && startInChat) return "pick";
    return "emergency";
  });
  const [pets, setPets] = useState<PetRecord[]>(initialPets);
  const [selectedPet, setSelectedPet] = useState<PetRecord | null>(() =>
    signedIn && startInChat && preselectedPet ? preselectedPet : null,
  );
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    signedIn && startInChat && preselectedPet && chatGreeting
      ? [{ role: "assistant", content: chatGreeting }]
      : [],
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingPets, setLoadingPets] = useState(false);
  const [emergencyNotice, setEmergencyNotice] = useState(false);
  const petsLoadedRef = useRef(petsPreloaded || initialPets.length > 0);
  const preselectHandledRef = useRef(Boolean(signedIn && startInChat && preselectedPet));

  useEffect(() => {
    if (!signedIn || petsLoadedRef.current) return;

    let cancelled = false;
    setLoadingPets(true);

    const timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      setLoadingPets(false);
      setError("Saved pets are taking longer than usual. You can add a pet manually below.");
    }, 12000);

    fetch("/api/pets")
      .then((res) => res.json())
      .then((data: { pets?: PetRecord[] }) => {
        if (cancelled) return;
        setPets(data.pets ?? []);
        petsLoadedRef.current = true;
        setError("");
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load your saved pets. You can add a pet manually below.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          window.clearTimeout(timeoutId);
          setLoadingPets(false);
        }
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [signedIn]);

  useEffect(() => {
    if (!preselectedPetId || preselectHandledRef.current || pets.length === 0) return;

    const match = pets.find((pet) => pet.id === preselectedPetId);
    if (!match) return;

    preselectHandledRef.current = true;

    if (startInChat) {
      setSelectedPet(match);
      setEmergencyNotice(false);
      setMessages([
        {
          role: "assistant",
          content:
            chatGreeting ||
            `Hi — I'm PETZ's AI health assistant for ${match.name}. Ask about their health profile, routines, or anything you've noticed.\n\nI don't diagnose or replace a veterinarian. If this is an emergency, go to the nearest open clinic now.`,
        },
      ]);
      setStep("chat");
      return;
    }

    setSelectedPet(match);
    setStep("profile");
  }, [pets, preselectedPetId, startInChat, chatGreeting]);

  useEffect(() => {
    const node = threadRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, busy, step]);

  useEffect(() => {
    const field = inputRef.current;
    if (!field || step !== "chat") return;
    field.style.height = "auto";
    const nextHeight = Math.min(field.scrollHeight, 120);
    field.style.height = `${Math.max(nextHeight, 24)}px`;
  }, [input, step]);

  useEffect(() => {
    if (step !== "chat") return;
    document.body.classList.add("sc-chat-active");
    return () => document.body.classList.remove("sc-chat-active");
  }, [step]);

  function continueFromEmergency() {
    if (!signedIn) {
      router.push("/login?callbackUrl=/symptom-checker");
      return;
    }
    setStep("pick");
  }

  function startChat(pet: PetRecord, greeting?: string) {
    setSelectedPet(pet);
    setEmergencyNotice(false);
    setMessages([
      {
        role: "assistant",
        content:
          greeting ||
          `Hi — I'm PETZ's AI health assistant. I can help you understand how urgent this might be for ${pet.name}.\n\nI don't diagnose, prescribe, or replace a veterinarian. If this is an emergency, go to the nearest open clinic now.\n\nWhat's going on with ${pet.name}?`,
      },
    ]);
    setStep("chat");
  }

  function startOver() {
    setSelectedPet(null);
    setSessionId(null);
    setMessages([]);
    setInput("");
    setError("");
    setBusy(false);
    setEmergencyNotice(false);
    setStep("emergency");
    router.replace("/symptom-checker");
  }

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || !selectedPet || busy) return;

    setBusy(true);
    setError("");
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petId: selectedPet.id, sessionId, message: text }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        reply?: string;
        sessionId?: string;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error || "Could not send message.");
        setBusy(false);
        return;
      }
      if (data.sessionId) setSessionId(data.sessionId);
      if (data.reply) setMessages((prev) => [...prev, { role: "assistant", content: data.reply! }]);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (step === "emergency") {
    return (
      <div className="account-wrap">
        <div className="form-card reveal">
          <h1 className="display-6">Before we continue — emergency signs</h1>
          <p style={{ marginTop: "12px" }}>
            If your pet shows any of these, go to an open veterinary clinic immediately. Do not use this tool.
          </p>
          <div className="emergency-list">
            <ul>
              <li>Collapsed or unconscious</li>
              <li>Difficulty breathing or blue/pale gums</li>
              <li>Seizure lasting more than 5 minutes</li>
              <li>Bloated, hard tummy</li>
              <li>Cannot pass urine (especially male cats)</li>
              <li>Uncontrolled bleeding or possible poisoning</li>
              <li>Sudden loss of back-leg function or heatstroke</li>
            </ul>
          </div>
          <button type="button" className="button is-primary pet-continue" onClick={continueFromEmergency}>
            <span className="button-hover"></span>
            <span className="button-label">None of these — continue</span>
          </button>
        </div>
      </div>
    );
  }

  if (step === "pick") {
    return (
      <div className="account-wrap">
        <div className="form-card reveal">
          <p className="auth-emergency">If your pet may be having an emergency, contact the nearest open veterinary clinic now.</p>
          <h1 className="display-6">Which pet is this for?</h1>
          <p className="pet-lede">Select a saved pet to pre-fill their details, or add a new one.</p>

          {loadingPets ? (
            <div className="pet-select-loading-inline" role="status" aria-live="polite">
              <span className="pet-select-spinner" aria-hidden="true" />
              <span>Loading your saved pets…</span>
            </div>
          ) : null}

          {error ? <p className="auth-error">{error}</p> : null}

          <ul className="pet-select-list">
            {loadingPets && pets.length === 0
              ? [0, 1].map((index) => (
                  <li key={`skeleton-${index}`} aria-hidden="true">
                    <div className="pet-select-skeleton" />
                  </li>
                ))
              : pets.map((pet) => (
                  <li key={pet.id}>
                    <button
                      type="button"
                      className="pet-select-card"
                      onClick={() => {
                        setSelectedPet(pet);
                        setStep("profile");
                      }}
                    >
                      <span className="pet-select-glyph" aria-hidden="true">
                        {pet.species === "dog" ? "🐕" : "🐈"}
                      </span>
                      <span className="pet-select-copy">
                        <strong>{pet.name}</strong>
                        <span>
                          {pet.species === "dog" ? "Dog" : "Cat"}
                          {formatPetAge(pet) ? ` · ${formatPetAge(pet)}` : ""}
                        </span>
                      </span>
                      <span className="pet-select-action">Select →</span>
                    </button>
                  </li>
                ))}
            <li>
              <button type="button" className="pet-select-new" onClick={() => setStep("basics")}>
                <span className="pet-select-glyph" aria-hidden="true">
                  +
                </span>
                <span className="pet-select-copy">
                  <strong>Different pet</strong>
                  <span>Enter details manually</span>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (step === "basics") {
    return (
      <div className="account-wrap">
        <div className="pet-card">
          <PetFormWizard
            mode="create"
            cancelHref="/symptom-checker"
            submitBasicsLabel="Continue"
            submitLifestyleLabel={`Continue to chat`}
            onSaved={(pet) => {
              setSelectedPet(pet);
              startChat(pet);
            }}
          />
        </div>
      </div>
    );
  }

  if (step === "profile" && selectedPet) {
    return (
      <div className="account-wrap">
        <div className="pet-card">
          <button type="button" className="pet-link-btn" style={{ marginBottom: "12px" }} onClick={() => startChat(selectedPet)}>
            Skip to chat →
          </button>
          <PetFormWizard
            mode="edit"
            petId={selectedPet.id}
            initialPet={selectedPet}
            cancelHref="/symptom-checker"
            startStep="lifestyle"
            submitBasicsLabel="Continue"
            submitLifestyleLabel={`Continue to chat with ${selectedPet.name}'s details on file →`}
            onSaved={(pet) => startChat(pet)}
          />
        </div>
      </div>
    );
  }

  if (step === "chat" && selectedPet) {
    const petName = selectedPet.name;
    const initials = getInitials(session?.user?.name, session?.user?.email);

    return (
      <div className="sc-app">
        <header className="sc-toolbar">
          <div className="sc-toolbar-copy">
            <p className="eyebrow">PETZ</p>
            <h1 className="display-5">Symptom Checker</h1>
            <p className="sc-status">
              <span className="sc-dot" aria-hidden="true" />
              Checking {petName}
            </p>
            <button type="button" className="sc-change" onClick={() => setStep("emergency")}>
              You said none of the emergency signs apply. <span>Change</span>
            </button>
          </div>
          <div className="sc-toolbar-actions">
            <button type="button" className="sc-start-over" onClick={startOver}>
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
                <path d="M3 3v4h4M13 13V9H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M4.2 10.8A5 5 0 0 0 12 11M11.8 5.2A5 5 0 0 0 4 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Start over
            </button>
            <div className="sc-pills">
              <button type="button" className="sc-pill is-emergency" onClick={() => setEmergencyNotice(true)}>
                I think this is an emergency
              </button>
              <Link className="sc-pill" href="/">
                Home
              </Link>
              <Link className="sc-pill is-accent" href={`/account/pets/${selectedPet.id}`}>
                Health profile
              </Link>
              <span className="sc-pill is-disabled">Online vet — coming soon</span>
            </div>
          </div>
        </header>

        <div className="sc-disclaimer">
          <p>
            Symptom checker only — not veterinary medical advice. PETZ does not diagnose, prescribe, or replace a
            veterinarian.
          </p>
          <p className="sc-disclaimer-alert">
            If you believe your pet is having an emergency, do not wait — go to the nearest open veterinary clinic now.
          </p>
          <p className="sc-disclaimer-fine">AI-generated guidance for education and urgency awareness.</p>
        </div>

        {emergencyNotice ? (
          <div className="sc-emergency-banner" role="alert">
            <div>
              <strong>Go to an open veterinary clinic now.</strong>
              <p>This tool cannot help in an emergency. Take {petName} to the nearest open clinic.</p>
            </div>
            <button type="button" className="sc-change" onClick={() => setEmergencyNotice(false)}>
              Dismiss
            </button>
          </div>
        ) : null}

        <div className="sc-thread" ref={threadRef} aria-live="polite">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`sc-msg${message.role === "user" ? " is-user" : ""}`}>
              <span className={`sc-avatar${message.role === "user" ? " is-user" : ""}`} aria-hidden="true">
                {message.role === "user" ? initials : <PawIcon />}
              </span>
              <div className={`sc-bubble${message.role === "user" ? " is-user" : " is-bot"}`}>
                <MessageBody text={message.content} />
              </div>
            </div>
          ))}
          {busy ? (
            <div className="sc-msg">
              <span className="sc-avatar" aria-hidden="true">
                <PawIcon />
              </span>
              <div className="sc-bubble is-bot sc-typing" aria-label="Assistant is typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          ) : null}
        </div>

        <div className="sc-composer-wrap">
          {error ? <p className="auth-error">{error}</p> : null}
          <form className="sc-composer" onSubmit={sendMessage}>
            <button
              type="button"
              className="sc-icon-btn sc-attach-btn"
              disabled
              title="Photo attach coming soon"
              aria-label="Attach a photo (coming soon)"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h2.1l.8-1.3A1.5 1.5 0 0 1 10.7 3h2.6a1.5 1.5 0 0 1 1.3.7L15.4 5h2.1A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12.2" r="3.2" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
            <div className="sc-composer-input">
              <label className="visually-hidden" htmlFor="symptomInput">
                Message about {petName}
              </label>
              <textarea
                ref={inputRef}
                id="symptomInput"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder={`Ask about ${petName}…`}
                aria-label={`Message about ${petName}`}
                required
              />
            </div>
            <button type="submit" className="sc-send" disabled={busy || !input.trim()} aria-label={busy ? "Sending" : "Send"}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M3.4 11.2 20.2 3.6c.8-.4 1.6.4 1.2 1.2l-7.6 16.8c-.4.9-1.7.8-2-.2l-2.2-7.3-7.3-2.2c-1-.3-1.1-1.6-.2-2Z" />
              </svg>
            </button>
          </form>
          <p className="sc-composer-legal">General wellness guidance only — not a veterinary diagnosis.</p>
        </div>
      </div>
    );
  }

  return null;
}
