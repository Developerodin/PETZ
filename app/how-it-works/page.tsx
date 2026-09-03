import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "How It Works — PETZ",
  description: "Tell PETZ about your pet. Our AI analyzes the information. You get a personalized picture of what may matter most.",
};

export default function HowItWorksPage() {
  return (
    <SiteShell variant="overlay">
      <section className="section">
            <div className="section-frame pd-top">
              <div className="section-stack">
                <div className="section-card hero-top-pd hero-flush">
                  <div className="container">
                    <div className="page-hero-inner">
                      <h1 className="display-9">Your pet's health, understood in a few simple steps.</h1>
                      <p>No complicated medical terminology. No endless searching. Tell PETZ about your pet. Our AI analyzes the information. You get a personalized picture of what may matter most — and what you can do next.</p>
                      <div className="button-row is-center-aligned">
                        <a className="button is-primary" href="/assess"><span className="button-hover"></span><span className="button-label">Assess My Pet</span></a>
                        <a className="button is-secondary" href="/science"><span className="button-hover"></span><span className="button-label">The science</span></a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="section-card">
                  <div className="container">
                    <h2 className="display-8" style={{maxWidth: "36rem"}}>Four steps to a clearer picture.</h2>
                    <div id="hiwSteps" className="carousel slide steps-slider" data-bs-ride="false" data-bs-interval="false">
                    <div className="carousel-inner">
                      <div className="carousel-item active">
                        <div className="steps-layout">
                          <div className="steps_card">
                            <div className="step-num display-10">01</div>
                            <h3 className="display-4">Tell us about your pet.</h3>
                            <p>Age. Breed. Weight. Diet. Activity. Medical history. Behaviour. Lifestyle. And the things you've noticed.</p>
                            <p className="mt-3 text-dark" style={{fontWeight: 500}}>Takes only a few minutes.</p>
                          </div>
                          <figure className="image-wrapper">
                            <img src="/assets/images/puppy-grass.jpg" alt="Puppy in grass" width="1200" height="800" decoding="async" loading="lazy" />
                          </figure>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <div className="steps-layout">
                          <div className="steps_card">
                            <div className="step-num display-10">02</div>
                            <h3 className="display-4">PETZ connects the dots.</h3>
                            <p>Our AI analyzes the information you've provided against evidence-informed health patterns, preventive guidelines and factors relevant to your pet's individual profile.</p>
                          </div>
                          <figure className="image-wrapper">
                            <img src="/assets/images/labrador.jpg" alt="Labrador" width="1200" height="800" decoding="async" loading="lazy" />
                          </figure>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <div className="steps-layout">
                          <div className="steps_card">
                            <div className="step-num display-10">03</div>
                            <h3 className="display-4">Understand what matters.</h3>
                            <p>Your assessment highlights the areas that appear healthy, areas worth improving and potential concerns that may deserve professional attention.</p>
                          </div>
                          <figure className="image-wrapper">
                            <img src="/assets/images/grey-cat.jpg" alt="Cat" width="1200" height="826" decoding="async" loading="lazy" />
                          </figure>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <div className="steps-layout">
                          <div className="steps_card">
                            <div className="step-num display-10">04</div>
                            <h3 className="display-4">Get your personalized action plan.</h3>
                            <p>Instead of giving you a pile of information, PETZ prioritizes what you can actually do.</p>
                            <ul className="mt-3" style={{paddingLeft: "1.1rem"}}>
                              <li>What to focus on.</li>
                              <li>Why it matters.</li>
                              <li>What you can do next.</li>
                            </ul>
                          </div>
                          <figure className="image-wrapper">
                            <img src="/assets/images/two-dogs.jpg" alt="Two dogs" width="1200" height="801" decoding="async" loading="lazy" />
                          </figure>
                        </div>
                      </div>
                    </div>
                    <div className="slider-controls">
                      <button className="slider-arrow" type="button" data-bs-target="#hiwSteps" data-bs-slide="prev" aria-label="Previous step">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      <button className="slider-arrow" type="button" data-bs-target="#hiwSteps" data-bs-slide="next" aria-label="Next step">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </section>

          <section className="section">
            <div className="container">
              <div className="white-card" style={{padding: "40px"}}>
                <div className="future-step-card">
                  <div className="step-num display-10" style={{color: "var(--color-600)"}}>05</div>
                  <div>
                    <p className="eyebrow">Future</p>
                    <h2 className="display-8">Keep building your pet's health profile.</h2>
                    <p>Over time, PETZ can become more than a one-time assessment. Future layers can incorporate diagnostics, biomarkers and longitudinal health data to create an increasingly complete picture of your pet's health.</p>
                    <p className="mt-3" style={{fontWeight: 500, color: "var(--color-100)"}}>This is a later phase — not part of the launch assessment.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
    </SiteShell>
  );
}
