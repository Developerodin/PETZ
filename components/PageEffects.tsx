"use client";

import { getSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { parseDateOfBirth } from "@/lib/pet-utils";

const NAME_RE = /^[A-Za-z][A-Za-z\s\-']{1,39}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trim(val: unknown) {
  return String(val ?? "").trim();
}

function validateName(value: string, label = "Name") {
  const v = trim(value);
  if (!v) return `${label} is required.`;
  if (v.length < 2) return `${label} must be at least 2 characters.`;
  if (v.length > 40) return `${label} must be 40 characters or fewer.`;
  if (!NAME_RE.test(v)) return `${label} can only contain letters, spaces, hyphens and apostrophes.`;
  return "";
}

function validateEmail(value: string) {
  const v = trim(value).toLowerCase();
  if (!v) return "Email is required.";
  if (!EMAIL_RE.test(v)) return "Enter a valid email address.";
  return "";
}

function validateAge(value: string) {
  const n = Number(value);
  if (value === "" || Number.isNaN(n)) return "Age is required.";
  if (!Number.isInteger(n) || n < 0 || n > 30) return "Enter a whole number between 0 and 30.";
  return "";
}

function validateWeight(value: string) {
  const n = Number(value);
  if (value === "" || Number.isNaN(n)) return "Weight is required.";
  if (n < 0.5 || n > 120) return "Enter weight between 0.5 and 120 kg.";
  if (!/^\d+(\.\d)?$/.test(String(value))) return "Use up to one decimal place.";
  return "";
}

function validateOptionalWeight(value: string) {
  if (!trim(value)) return "";
  return validateWeight(value);
}

function validateTextarea(value: string, max = 500) {
  const v = trim(value);
  if (v.length > max) return `Maximum ${max} characters.`;
  return "";
}

function validateRequired(value: string, label: string) {
  if (!trim(value)) return `${label} is required.`;
  return "";
}

function showFieldError(field: Element, message: string) {
  const wrap = field.closest(".form-field");
  if (!wrap) return;
  const err = wrap.querySelector(".field-error");
  if (message) {
    field.classList.add("is-error");
    if (err) err.textContent = message;
  } else {
    field.classList.remove("is-error");
    if (err) err.textContent = "";
  }
}

function validateFields(rules: { field: Element | null; message: string }[]) {
  let firstInvalid: HTMLElement | null = null;
  let valid = true;
  for (const { field, message } of rules) {
    if (!field) continue;
    showFieldError(field, message);
    if (message) {
      valid = false;
      if (!firstInvalid) firstInvalid = field as HTMLElement;
    }
  }
  firstInvalid?.focus();
  return valid;
}

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || "Something went wrong. Please try again.");
  }
  return res.json();
}

function showFormSuccess(form: HTMLFormElement) {
  const success = form.querySelector<HTMLElement>(".form-success-panel");
  if (success) {
    form.querySelectorAll<HTMLElement>(".wizard-panel, .form-grid, .contact-form-layout").forEach((el) => {
      el.hidden = true;
    });
    const actions = form.querySelector<HTMLElement>(".form-actions");
    if (actions) actions.hidden = true;
    success.hidden = false;
  }
}

const FORM_ENDPOINTS: Record<
  string,
  { url: string; body: (form: HTMLFormElement) => Record<string, unknown> }
> = {
  waitlistForm: {
    url: "/api/waitlist",
    body: (form) => ({
      name: (form.elements.namedItem("wlName") as HTMLInputElement)?.value?.trim() || "",
      email: (form.elements.namedItem("wlEmail") as HTMLInputElement)?.value?.trim() || "",
      country: (form.elements.namedItem("wlCountry") as HTMLInputElement)?.value?.trim() || "",
    }),
  },
  partnerForm: {
    url: "/api/partners",
    body: (form) => ({
      partnerType: (form.elements.namedItem("paType") as HTMLSelectElement)?.value || "",
      organisation: (form.elements.namedItem("paOrg") as HTMLInputElement)?.value?.trim() || "",
      email: (form.elements.namedItem("paEmail") as HTMLInputElement)?.value?.trim() || "",
      city: (form.elements.namedItem("paCity") as HTMLInputElement)?.value?.trim() || "",
      message: (form.elements.namedItem("paMessage") as HTMLTextAreaElement)?.value?.trim() || "",
    }),
  },
  supportForm: {
    url: "/api/support",
    body: (form) => {
      const val = (id: string) =>
        (form.querySelector(`#${id}`) as HTMLInputElement | HTMLTextAreaElement)?.value?.trim() || "";
      return {
        firstName: val("supFirstName"),
        lastName: val("supLastName"),
        email: val("supEmail"),
        phone: val("supPhone") || undefined,
        subject: val("supSubject"),
        message: val("supMessage"),
      };
    },
  },
};

function bindSimpleForm(form: HTMLFormElement) {
  const endpoint = FORM_ENDPOINTS[form.id];
  const onSubmit = async (e: Event) => {
    e.preventDefault();
    const fields = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("[data-validate]");
    const rules = [...fields].map((field) => {
      let msg = "";
      const type = field.dataset.validate;
      if (type === "name") {
        msg = field.dataset.optional && !trim(field.value) ? "" : validateName(field.value, field.dataset.label || "Name");
      } else if (type === "email") msg = validateEmail(field.value);
      else if (type === "required") msg = validateRequired(field.value, field.dataset.label || "This field");
      else if (type === "message") msg = validateTextarea(field.value, 1000);
      return { field, message: msg };
    });
    if (!validateFields(rules)) return;

    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      if (endpoint) {
        await postJson(endpoint.url, endpoint.body(form));
      }
      showFormSuccess(form);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      const firstField = fields[0];
      if (firstField) showFieldError(firstField, message);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  };
  form.addEventListener("submit", onSubmit);
  return () => form.removeEventListener("submit", onSubmit);
}

function isWindowsClient() {
  return /Win/i.test(navigator.platform) || /Windows NT/i.test(navigator.userAgent);
}

function initSiteChrome() {
  if (isWindowsClient()) document.documentElement.setAttribute("data-force-motion", "true");
  const reduced = !isWindowsClient() && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cleanups: Array<() => void> = [];

  document.querySelectorAll(".marquee-track").forEach((track) => {
    const el = track as HTMLElement;
    if (el.dataset.cloned) return;
    el.innerHTML += el.innerHTML;
    el.dataset.cloned = "true";
  });

  document.querySelectorAll(".stagger-group").forEach((group) => {
    const children = group.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
    children.forEach((el, i) => {
      (el as HTMLElement).style.setProperty("--stagger-index", String(i));
    });
  });

  const revealSelectors = ".reveal, .reveal-left, .reveal-right, .reveal-scale";
  const revealAll = () => document.querySelectorAll(revealSelectors);
  if (!reduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "40px 0px 15% 0px" },
    );
    const observeReveals = () => {
      revealAll().forEach((el) => {
        if (!el.classList.contains("is-in")) io.observe(el);
      });
    };
    observeReveals();
    const mo = new MutationObserver(observeReveals);
    mo.observe(document.body, { childList: true, subtree: true });
    cleanups.push(() => {
      io.disconnect();
      mo.disconnect();
    });
  } else {
    const showReveals = () => revealAll().forEach((el) => el.classList.add("is-in"));
    showReveals();
    const mo = new MutationObserver(showReveals);
    mo.observe(document.body, { childList: true, subtree: true });
    cleanups.push(() => mo.disconnect());
  }

  const steps = document.querySelectorAll(".steps-slider");
  const syncSteps = () => {
    const stack = window.innerWidth <= 479;
    steps.forEach((el) => el.classList.toggle("is-stack", stack));
  };
  syncSteps();
  window.addEventListener("resize", syncSteps);
  cleanups.push(() => window.removeEventListener("resize", syncSteps));

  const bootstrap = (window as unknown as { bootstrap?: { Carousel: { getOrCreateInstance: (node: Element, opts: object) => void } } }).bootstrap;
  if (bootstrap?.Carousel) {
    document.querySelectorAll(".carousel").forEach((node) => {
      bootstrap.Carousel.getOrCreateInstance(node, {
        interval: false,
        ride: false,
        wrap: true,
        touch: true,
      });
    });
  }

  document.querySelectorAll<HTMLElement>(".category-nav .category-link[data-category]").forEach((link) => {
    const onClick = (e: Event) => {
      e.preventDefault();
      const cat = link.dataset.category;
      document.querySelectorAll(".category-nav .category-link").forEach((l) => l.classList.remove("is-current"));
      link.classList.add("is-current");
      document.querySelectorAll<HTMLElement>(".post-item[data-category]").forEach((item) => {
        const show = cat === "all" || item.dataset.category === cat;
        item.classList.toggle("is-hidden", !show);
      });
    };
    link.addEventListener("click", onClick);
    cleanups.push(() => link.removeEventListener("click", onClick));
  });

  const wrap = document.querySelector(".hero-images-wrap");
  const grid = wrap?.querySelector(".hero-images-grid") as HTMLElement | null;
  const hero = wrap?.closest(".section");
  if (wrap && grid && hero && !reduced) {
    let maxShift = 0;
    let strength = 1;
    let running = false;
    let rafId = 0;
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    const measure = () => {
      maxShift = Math.max(0, (grid.offsetWidth - (wrap as HTMLElement).offsetWidth) / 2);
      strength = parseFloat(getComputedStyle(wrap as Element).getPropertyValue("--hero-parallax-strength")) || 1;
    };
    const applyShift = (x: number) => {
      grid.style.setProperty("--hero-parallax-x", `${x}px`);
      grid.style.transform = `translate3d(${x}px, 0, 0)`;
    };
    const update = () => {
      const rect = hero.getBoundingClientRect();
      const vh = window.innerHeight;
      const range = vh + rect.height;
      const progress = clamp((vh - rect.top) / range, 0, 1);
      applyShift(-progress * maxShift * strength);
      if (running) rafId = requestAnimationFrame(update);
    };
    const start = () => {
      if (running) return;
      running = true;
      grid.classList.add("is-parallax-active");
      rafId = requestAnimationFrame(update);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
      grid.classList.remove("is-parallax-active");
      update();
    };
    const remeasure = () => {
      measure();
      if (running) update();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0 },
    );
    measure();
    applyShift(0);
    io.observe(hero);
    window.addEventListener("resize", remeasure, { passive: true });
    const roWrap = new ResizeObserver(remeasure);
    const roGrid = new ResizeObserver(remeasure);
    roWrap.observe(wrap);
    roGrid.observe(grid);
    const rect = hero.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) start();
    cleanups.push(() => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", remeasure);
      roWrap.disconnect();
      roGrid.disconnect();
    });
  }

  document.querySelectorAll<HTMLFormElement>("[data-newsletter-form]").forEach((form) => {
    const input = form.querySelector<HTMLInputElement>('input[type="email"]');
    const success = form.parentElement?.querySelector<HTMLElement>(".newsletter-success");
    if (!input) return;
    const onSubmit = async (e: Event) => {
      e.preventDefault();
      const email = input.value.trim();
      if (!email || !EMAIL_RE.test(email)) {
        input.classList.add("is-error");
        input.setAttribute("aria-invalid", "true");
        return;
      }
      input.classList.remove("is-error");
      input.removeAttribute("aria-invalid");
      const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      try {
        await postJson("/api/newsletter", { email });
        form.classList.add("is-success");
        if (success) success.hidden = false;
      } catch {
        input.classList.add("is-error");
        input.setAttribute("aria-invalid", "true");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    };
    const onInput = () => {
      input.classList.remove("is-error");
      input.removeAttribute("aria-invalid");
    };
    form.addEventListener("submit", onSubmit);
    input.addEventListener("input", onInput);
    cleanups.push(() => {
      form.removeEventListener("submit", onSubmit);
      input.removeEventListener("input", onInput);
    });
  });

  return cleanups;
}

function initAssessForm() {
  const form = document.getElementById("assessForm") as HTMLFormElement | null;
  if (!form) return () => {};

  const panels = [...form.querySelectorAll<HTMLElement>(".wizard-panel")];
  const steps = [...form.querySelectorAll(".wizard-step")];
  const speciesFields = form.querySelectorAll<HTMLElement>(".species-only");
  let current = 0;
  let species = "";
  const speciesError = form.querySelector(".species-toggle + .field-error");

  function setSpecies(val: string) {
    species = val;
    form!.querySelectorAll(".species-option").forEach((el) => {
      el.classList.toggle("is-selected", (el as HTMLElement).dataset.species === val);
    });
    speciesFields.forEach((el) => {
      const show = el.dataset.species === val || el.dataset.species === "both";
      el.hidden = !show;
    });
  }

  const optionHandlers: Array<[Element, () => void]> = [];
  form.querySelectorAll(".species-option").forEach((opt) => {
    const handler = () => {
      const radio = opt.querySelector<HTMLInputElement>('input[type="radio"]');
      if (radio) radio.checked = true;
      setSpecies((opt as HTMLElement).dataset.species || "");
    };
    opt.addEventListener("click", handler);
    optionHandlers.push([opt, handler]);
  });

  const dobUnknownInput = form.querySelector<HTMLInputElement>("#petDobUnknown");
  const dobRow = form.querySelector<HTMLElement>("#petDobRow");
  const ageWrap = form.querySelector<HTMLElement>("#petAgeWrap");
  const dobToggle = form.querySelector<HTMLButtonElement>("#petDobUnknownToggle");

  function setDobUnknown(unknown: boolean) {
    if (dobUnknownInput) dobUnknownInput.value = unknown ? "true" : "false";
    if (dobRow) dobRow.hidden = unknown;
    if (ageWrap) ageWrap.hidden = !unknown;
    if (dobToggle) dobToggle.textContent = unknown ? "Enter date" : "Don't know?";
    if (unknown) {
      (["petDobDay", "petDobMonth", "petDobYear"] as const).forEach((id) => {
        const el = form!.elements.namedItem(id) as HTMLInputElement | null;
        if (el) el.value = "";
      });
    } else {
      const age = form!.elements.namedItem("petAge") as HTMLInputElement | null;
      if (age) age.value = "";
    }
  }

  const onDobToggle = () => setDobUnknown(dobUnknownInput?.value !== "true");
  dobToggle?.addEventListener("click", onDobToggle);

  function setField(name: string, value: string) {
    const el = form!.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
    if (el) el.value = value;
  }

  type SavedAssessPet = {
    id?: string;
    name?: string;
    species?: string;
    breed?: string;
    dateOfBirth?: string | null;
    dobEstimated?: boolean;
    ageYears?: number;
    weightKg?: number | null;
    livingEnvironment?: string;
    foodType?: string;
    mealPattern?: string;
    exerciseMinsDay?: string;
    muscleTone?: string;
    energyLevel?: string;
    appetite?: string;
    sleepQuality?: string;
    behaviourMood?: string;
    weightTrend?: string;
    existingConditions?: string;
  };

  function markPetChoice(selected: Element | null) {
    form!.querySelectorAll(".assess-pet-picker .pet-select-card, .assess-pet-picker .pet-select-new").forEach((el) => {
      el.classList.toggle("is-selected", el === selected);
    });
  }

  function applySavedPet(pet: SavedAssessPet) {
    setField("petId", pet.id || "");
    const nextSpecies = pet.species === "cat" || pet.species === "dog" ? pet.species : "";
    const radio = form!.querySelector<HTMLInputElement>(`input[name="petSpecies"][value="${nextSpecies}"]`);
    if (radio) radio.checked = true;
    setSpecies(nextSpecies);
    setField("petName", pet.name || "");
    setField("petBreed", pet.breed || "");
    setField("petWeight", pet.weightKg != null ? String(pet.weightKg) : "");
    if (pet.dateOfBirth && !pet.dobEstimated) {
      const [year = "", month = "", day = ""] = pet.dateOfBirth.split("-");
      setDobUnknown(false);
      setField("petDobDay", String(Number(day) || day));
      setField("petDobMonth", String(Number(month) || month));
      setField("petDobYear", year);
    } else {
      setDobUnknown(true);
      setField("petAge", pet.ageYears != null ? String(pet.ageYears) : "");
    }
    setField("petDiet", pet.foodType || "");
    setField("petMeals", pet.mealPattern || "");
    setField("petLiving", pet.livingEnvironment || "");
    setField("petExercise", pet.exerciseMinsDay || "");
    setField("petEnergy", pet.energyLevel || "");
    setField("petMuscle", pet.muscleTone || "");
    setField("petAppetite", pet.appetite || "");
    setField("petSleep", pet.sleepQuality || "");
    setField("petBehaviour", pet.behaviourMood || "");
    setField("petWeightTrend", pet.weightTrend || "");
    setField("petConditions", pet.existingConditions || "");
  }

  function clearSavedPet() {
    setField("petId", "");
    form!.querySelectorAll<HTMLInputElement>('input[name="petSpecies"]').forEach((el) => {
      el.checked = false;
    });
    setSpecies("");
    setField("petName", "");
    setField("petBreed", "");
    setField("petWeight", "");
    setDobUnknown(false);
    setField("petDobDay", "");
    setField("petDobMonth", "");
    setField("petDobYear", "");
    setField("petAge", "");
    ["petDiet", "petMeals", "petLiving", "petExercise", "petEnergy", "petMuscle", "petAppetite", "petSleep", "petBehaviour", "petWeightTrend", "petConditions", "petMeds", "petSymptoms"].forEach((name) => setField(name, ""));
    form!.querySelectorAll<HTMLInputElement>('input[name="petBcs"]').forEach((el) => {
      el.checked = false;
    });
  }

  const petChoiceHandlers: Array<[Element, () => void]> = [];
  form.querySelectorAll<HTMLElement>("[data-assess-pet]").forEach((btn) => {
    const handler = () => {
      try {
        applySavedPet(JSON.parse(btn.dataset.assessPet || "{}") as SavedAssessPet);
        markPetChoice(btn);
      } catch {
        /* ignore malformed pet payload */
      }
    };
    btn.addEventListener("click", handler);
    petChoiceHandlers.push([btn, handler]);
  });
  form.querySelectorAll<HTMLElement>("[data-assess-pet-new]").forEach((btn) => {
    const handler = () => {
      clearSavedPet();
      markPetChoice(btn);
    };
    btn.addEventListener("click", handler);
    petChoiceHandlers.push([btn, handler]);
  });

  function goTo(index: number) {
    current = Math.max(0, Math.min(index, panels.length - 1));
    panels.forEach((p, i) => {
      p.classList.toggle("is-active", i === current);
      p.hidden = i !== current;
    });
    steps.forEach((s, i) => {
      s.classList.toggle("is-active", i === current);
      s.classList.toggle("is-done", i < current);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function named(name: string) {
    const el = form!.elements.namedItem(name);
    if (!el) return "";
    return String((el as { value?: string }).value ?? "");
  }

  function collectData() {
    const dobUnknown = named("petDobUnknown") === "true";
    const dob = parseDateOfBirth(named("petDobDay"), named("petDobMonth"), named("petDobYear"));
    const age = dobUnknown && named("petAge")
      ? `${named("petAge")} years (approx)`
      : dob
        ? dob.split("-").reverse().join("/")
        : "";
    return {
      "Your name": trim(named("ownerName")),
      Email: trim(named("ownerEmail")).toLowerCase(),
      Species: species === "dog" ? "Dog" : species === "cat" ? "Cat" : "",
      "Pet name": trim(named("petName")),
      "Date of birth": age,
      Breed: trim(named("petBreed")),
      Weight: named("petWeight") ? `${named("petWeight")} kg` : "",
      Diet: named("petDiet"),
      "Feeding pattern": named("petMeals"),
      "Living environment": named("petLiving"),
      "Daily exercise": named("petExercise"),
      Energy: named("petEnergy"),
      "Muscle tone": named("petMuscle"),
      "Body condition (1–9)": named("petBcs"),
      "Weight trend": named("petWeightTrend"),
      Behaviour: named("petBehaviour"),
      Sleep: named("petSleep"),
      Appetite: named("petAppetite"),
      "Existing conditions": trim(named("petConditions")),
      Vaccinations: named("petVaccines") || "—",
      "Vet visits (12m)": named("petVetVisits") || "—",
      Medications: trim(named("petMeds")),
      "Symptoms / changes": trim(named("petSymptoms")),
    };
  }

  function buildReview() {
    const list = form!.querySelector(".review-list");
    if (!list) return;
    const data = collectData();
    list.innerHTML = Object.entries(data)
      .filter(([, v]) => v)
      .map(([k, v]) => `<li><span>${k}</span><span>${v}</span></li>`)
      .join("");
  }

  const nextButtons = [...form.querySelectorAll("[data-wizard-next]")];
  const prevButtons = [...form.querySelectorAll("[data-wizard-prev]")];

  const onNext = () => {
    let rules: { field: Element | null; message: string }[] = [];
    if (current === 0) {
      rules = [
        { field: form.elements.namedItem("ownerName") as Element, message: validateName((form.elements.namedItem("ownerName") as HTMLInputElement).value, "Your name") },
        { field: form.elements.namedItem("ownerEmail") as Element, message: validateEmail((form.elements.namedItem("ownerEmail") as HTMLInputElement).value) },
      ];
    } else if (current === 1) {
      const dobUnknown = named("petDobUnknown") === "true";
      const dobMessage = dobUnknown
        ? validateAge(named("petAge"))
        : parseDateOfBirth(named("petDobDay"), named("petDobMonth"), named("petDobYear"))
          ? ""
          : "Enter a valid date of birth or choose Don't know.";
      rules = [
        { field: form.elements.namedItem("petName") as Element, message: validateName(named("petName"), "Pet name") },
        { field: form.elements.namedItem("petDobDay") as Element, message: dobMessage },
        { field: form.elements.namedItem("petWeight") as Element, message: validateOptionalWeight(named("petWeight")) },
      ];
      if (!species) {
        if (speciesError) speciesError.textContent = "Please select dog or cat.";
      } else if (speciesError) speciesError.textContent = "";
    } else if (current === 2) {
      rules = [
        { field: form.querySelector("#petBcsScale") || form.querySelector('[name="petBcs"]'), message: validateRequired(named("petBcs"), "Body condition score") },
        { field: form.elements.namedItem("petDiet") as Element, message: validateRequired(named("petDiet"), "Diet type") },
        { field: form.elements.namedItem("petExercise") as Element, message: validateRequired(named("petExercise"), "Daily exercise") },
        { field: form.elements.namedItem("petSymptoms") as Element, message: validateTextarea(named("petSymptoms")) },
        { field: form.elements.namedItem("petConditions") as Element, message: validateTextarea(named("petConditions")) },
      ];
    }
    if (rules.length && !validateFields(rules)) return;
    if (current === 1 && !species) return;
    if (current === 2) buildReview();
    goTo(current + 1);
  };

  nextButtons.forEach((btn) => btn.addEventListener("click", onNext));
  prevButtons.forEach((btn) => btn.addEventListener("click", () => goTo(current - 1)));

  function collectRawPayload() {
    const dobUnknown = named("petDobUnknown") === "true";
    return {
      owner: {
        name: trim(named("ownerName")),
        email: trim(named("ownerEmail")).toLowerCase(),
        marketing: (form!.elements.namedItem("marketing") as HTMLInputElement)?.checked ?? false,
      },
      pet: {
        id: named("petId"),
        species,
        name: trim(named("petName")),
        dateOfBirth: dobUnknown ? "" : parseDateOfBirth(named("petDobDay"), named("petDobMonth"), named("petDobYear")) || "",
        dobEstimated: dobUnknown,
        age: named("petAge"),
        weight: named("petWeight"),
        breed: trim(named("petBreed")),
        diet: named("petDiet"),
        meals: named("petMeals"),
        living: named("petLiving"),
        exercise: named("petExercise"),
        energy: named("petEnergy"),
        muscle: named("petMuscle"),
        bcs: named("petBcs"),
        weightTrend: named("petWeightTrend"),
        vaccines: named("petVaccines"),
        vetVisits: named("petVetVisits"),
        appetite: named("petAppetite"),
        sleep: named("petSleep"),
        behaviour: named("petBehaviour"),
        conditions: trim(named("petConditions")),
        meds: trim(named("petMeds")),
        symptoms: trim(named("petSymptoms")),
      },
      summary: collectData(),
    };
  }

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    const data = collectData();
    const payload = collectRawPayload();
    try {
      sessionStorage.setItem("petz_assess_preview", JSON.stringify(data));
      sessionStorage.setItem("petz_assess_answers", JSON.stringify(payload.pet));
    } catch {
      /* ignore */
    }
    void postJson("/api/assessments", payload).catch(() => {
      /* results still render from sessionStorage if save is unavailable */
    });
    window.location.href = "/assess/results";
  };
  form.addEventListener("submit", onSubmit);
  goTo(0);

  return () => {
    optionHandlers.forEach(([el, handler]) => el.removeEventListener("click", handler));
    petChoiceHandlers.forEach(([el, handler]) => el.removeEventListener("click", handler));
    dobToggle?.removeEventListener("click", onDobToggle);
    nextButtons.forEach((btn) => btn.removeEventListener("click", onNext));
    prevButtons.forEach((btn) => btn.removeEventListener("click", () => goTo(current - 1)));
    form.removeEventListener("submit", onSubmit);
  };
}

function initSymptomChecker() {
  const continueBtn = document.getElementById("emergencyContinue");
  const emergency = document.getElementById("emergencyScreen");
  const chat = document.getElementById("chatScreen");
  const form = document.getElementById("symptomForm") as HTMLFormElement | null;
  if (!continueBtn || !emergency || !chat || !form) return () => {};

  const onContinue = () => {
    emergency.hidden = true;
    chat.hidden = false;
  };
  const onSubmit = (e: Event) => {
    e.preventDefault();
    const input = document.getElementById("symptomInput") as HTMLTextAreaElement | null;
    if (!input) return;
    const msg = trim(input.value);
    if (!msg) return;
    const ui = document.getElementById("chatUi");
    if (!ui) return;
    ui.innerHTML += `<div class="chat-bubble is-user">${msg}</div>`;
    ui.innerHTML += `<div class="chat-bubble is-bot"><strong>Routine — book when it suits you.</strong> Based on your description, this does not sound like an emergency in our demo. Monitor at home, keep notes, and book a vet visit if symptoms worsen. PETZ does not diagnose or prescribe.</div>`;
    input.value = "";
    ui.scrollTop = ui.scrollHeight;
  };
  continueBtn.addEventListener("click", onContinue);
  form.addEventListener("submit", onSubmit);
  return () => {
    continueBtn.removeEventListener("click", onContinue);
    form.removeEventListener("submit", onSubmit);
  };
}

function initPassportForm() {
  const form = document.getElementById("passportForm");
  if (!form) return () => {};
  const panels = [...form.querySelectorAll<HTMLElement>(".wizard-panel")];
  const steps = [...form.querySelectorAll(".wizard-step")];
  let cur = 0;
  const go = (i: number) => {
    cur = i;
    panels.forEach((p, j) => {
      p.hidden = j !== cur;
      p.classList.toggle("is-active", j === cur);
    });
    steps.forEach((s, j) => {
      s.classList.toggle("is-active", j === cur);
      s.classList.toggle("is-done", j < cur);
    });
  };
  const nextButtons = [...form.querySelectorAll("[data-pp-next]")];
  const prevButtons = [...form.querySelectorAll("[data-pp-prev]")];
  const onNext = () => {
    if (cur === 0) {
      const fields = ["ppSpecies", "ppAge", "ppState"].map((id) => document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null);
      const rules = fields.map((f) => ({
        field: f,
        message: f ? validateRequired(f.value, f.getAttribute("data-label") || f.id) : "",
      }));
      if (!validateFields(rules)) return;
    }
    go(Math.min(cur + 1, panels.length - 1));
  };
  const onPrev = () => go(Math.max(cur - 1, 0));
  nextButtons.forEach((b) => b.addEventListener("click", onNext));
  prevButtons.forEach((b) => b.addEventListener("click", onPrev));
  go(0);
  return () => {
    nextButtons.forEach((b) => b.removeEventListener("click", onNext));
    prevButtons.forEach((b) => b.removeEventListener("click", onPrev));
  };
}

function fillIfEmpty(el: HTMLInputElement | null, value: string, readOnly = false) {
  if (!el || !value) return;
  if (!el.value) el.value = value;
  if (readOnly) el.readOnly = true;
}

async function fillKnownUser() {
  const session = await getSession();
  const name = session?.user?.name?.trim() || "";
  const email = session?.user?.email?.trim() || "";
  if (!name && !email) return;

  const parts = name.split(/\s+/).filter(Boolean);
  fillIfEmpty(document.getElementById("ownerName") as HTMLInputElement | null, name);
  fillIfEmpty(document.getElementById("ownerEmail") as HTMLInputElement | null, email, true);
  fillIfEmpty(document.getElementById("wlName") as HTMLInputElement | null, name);
  fillIfEmpty(document.getElementById("wlEmail") as HTMLInputElement | null, email, true);
  fillIfEmpty(document.getElementById("paEmail") as HTMLInputElement | null, email, true);
  fillIfEmpty(document.getElementById("supFirstName") as HTMLInputElement | null, parts[0] || "");
  fillIfEmpty(document.getElementById("supLastName") as HTMLInputElement | null, parts.slice(1).join(" "));
  fillIfEmpty(document.getElementById("supEmail") as HTMLInputElement | null, email, true);
  document.querySelectorAll<HTMLInputElement>("form[data-newsletter-form] input[type='email']").forEach((input) => {
    fillIfEmpty(input, email);
  });
}

export function PageEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups = initSiteChrome();
    document.querySelectorAll<HTMLFormElement>("#waitlistForm, #partnerForm, #supportForm").forEach((form) => {
      cleanups.push(bindSimpleForm(form));
    });
    cleanups.push(initAssessForm());
    const symptomCleanup = initSymptomChecker();
    if (symptomCleanup) cleanups.push(symptomCleanup);
    cleanups.push(initPassportForm());
    void fillKnownUser();

    return () => {
      cleanups.forEach((fn) => fn?.());
    };
  }, [pathname]);

  return null;
}
