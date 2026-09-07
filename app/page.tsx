import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getFormUser } from "@/lib/form-user";

export const metadata: Metadata = {
  title: "PETZ — Know your pet's health before the symptoms",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's current health, identify potential risk areas, and create a personalized plan.",
};

export default async function HomePage() {
  const user = await getFormUser();

  return (
    <SiteShell variant="overlay">
      <section className="section">
            <div className="section-frame pd-top">
              <div className="section-card hero-top-pd hero-flush">
                <div className="container">
                  <div className="inner-container-center measure-center hero-copy">
                    <p className="eyebrow">Better health starts before symptoms.</p>
                    <h1 className="display-9">Know earlier. Live healthier.</h1>
                    <p>PETZ uses AI and veterinary-informed health science to understand your pet's current health, identify potential risk areas, and create a personalized plan for a healthier, longer life.</p>
                    <div className="button-row is-center-aligned">
                      <a className="button is-primary" href="/assess"><span className="button-hover"></span><span className="button-label">Assess My Pet</span></a>
                      <a className="button is-secondary" href="/how-it-works"><span className="button-hover"></span><span className="button-label">How PETZ Works</span></a>
                    </div>
                    <p className="reassurance">Personalized · Preventive · Data-driven</p>
                  </div>
                </div>
                <div className="hero-images-wrap">
                  <div className="hero-images-grid">
                    <div className="cell cell-l1 reveal"><img src="/assets/images/puppy-grass.jpg" alt="Puppy in grass" width="1200" height="800" decoding="async" /></div>
                    <div className="cell cell-l2 reveal"><img src="/assets/images/husky.jpg" alt="Husky outdoors" width="1200" height="1600" decoding="async" /></div>
                    <div className="cell cell-a reveal"><img src="/assets/images/golden-retriever.jpg" alt="Golden retriever looking at the camera" width="1200" height="1924" decoding="async" loading="eager" fetchPriority="high" /></div>
                    <div className="cell cell-b">
                      <div className="metric-card">
                        <div className="metric-label">Nutrition</div>
                        <div className="metric-value">Good</div>
                        <div className="metric-bar"><span style={{width: "78%"}}></span></div>
                      </div>
                    </div>
                    <div className="cell cell-c reveal"><img src="/assets/images/grey-cat.jpg" alt="Grey cat sitting upright" width="1200" height="826" decoding="async" loading="eager" /></div>
                    <div className="cell cell-d">
                      <div className="metric-card">
                        <div className="metric-label">Activity</div>
                        <div className="metric-value">Watch</div>
                        <div className="metric-bar"><span style={{width: "54%"}}></span></div>
                      </div>
                    </div>
                    <div className="cell cell-e reveal"><img src="/assets/images/dog-running.jpg" alt="Dog running outdoors" width="1200" height="800" decoding="async" loading="eager" /></div>
                    <div className="cell cell-f reveal"><img src="/assets/images/fluffy-white-dog.jpg" alt="Fluffy white dog" width="1200" height="802" decoding="async" loading="eager" /></div>
                    <div className="cell cell-g reveal"><img src="/assets/images/tabby-cat.jpg" alt="Tabby cat portrait" width="1200" height="1200" decoding="async" loading="eager" /></div>
                    <div className="cell cell-r2 reveal"><img src="/assets/images/corgi.jpg" alt="Corgi portrait" width="1200" height="1811" decoding="async" /></div>
                    <div className="cell cell-r1 reveal"><img src="/assets/images/orange-cat.jpg" alt="Orange cat sitting" width="1200" height="1680" decoding="async" /></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section marquee-section">
            <div className="container">
              <div className="inner-container-center">
                <p className="display-2 text-dark" style={{fontWeight: 600}}>Built around evidence, not guesswork.</p>
              </div>
            </div>
            <div className="marquee-wrapper" aria-hidden="true">
              <div className="marquee-track">
                <div className="marquee-item">Veterinary science<span className="marquee-dot"></span></div>
                <div className="marquee-item">Preventive health<span className="marquee-dot"></span></div>
                <div className="marquee-item">Pet-specific data<span className="marquee-dot"></span></div>
                <div className="marquee-item">AI-assisted analysis<span className="marquee-dot"></span></div>
                <div className="marquee-item">Evidence-informed recommendations<span className="marquee-dot"></span></div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <div className="grid-3 layout-two-images">
                <div className="inner-container copy-col">
                  <p className="eyebrow">Pet health, defined by data</p>
                  <h2 className="display-8">Your pet, defined by more.</h2>
                  <div className="paragraph-grid">
                    <p>Most pet health decisions begin when something feels wrong. PETZ takes a different approach.</p>
                    <p>We bring together your pet's age, breed, weight, nutrition, activity, behaviour and medical history to create a clearer picture of their health.</p>
                    <p>The result is a personalized view of your pet — not a generic checklist.</p>
                  </div>
                  <a className="text-link" href="/how-it-works">See How It Works
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                </div>
                <figure className="image-wrapper reveal">
                  <img src="/assets/images/two-dogs.jpg" alt="Two dogs outdoors" width="1200" height="801" decoding="async" loading="lazy" />
                </figure>
                <figure className="image-wrapper reveal">
                  <img src="/assets/images/cat-looking.jpg" alt="Cat looking toward the camera" width="1200" height="800" decoding="async" loading="lazy" />
                </figure>
              </div>
            </div>
          </section>

          <section className="section" id="how-petz-works">
            <div className="section-frame">
              <div className="section-card">
                <div className="container">
                  <div className="section-top-content-wrapper">
                    <div className="section-top-copy" style={{maxWidth: "40rem"}}>
                      <h2 className="display-8">From information to action.</h2>
                      <p>A few simple inputs can reveal a lot about your pet's health. PETZ turns those inputs into clear, personalized next steps.</p>
                    </div>
                    <a className="button is-secondary-dark" href="/assess"><span className="button-hover"></span><span className="button-label">Assess My Pet</span></a>
                  </div>
                  <div id="stepsCarousel" className="carousel slide steps-slider" data-bs-ride="false" data-bs-interval="false">
                    <div className="carousel-inner">
                      <div className="carousel-item active">
                        <div className="steps-layout">
                          <div className="steps_card">
                            <div className="step-num display-10">01</div>
                            <h3 className="display-4">Tell us about your pet</h3>
                            <p>Share the basics — age, breed, weight, diet, activity, lifestyle and medical history.</p>
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
                            <h3 className="display-4">PETZ connects the dots</h3>
                            <p>PETZ analyzes your information against health patterns and risk factors relevant to your pet.</p>
                          </div>
                          <figure className="image-wrapper">
                            <img src="/assets/images/labrador.jpg" alt="Labrador close-up" width="1200" height="800" decoding="async" loading="lazy" />
                          </figure>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <div className="steps-layout">
                          <div className="steps_card">
                            <div className="step-num display-10">03</div>
                            <h3 className="display-4">Understand what matters</h3>
                            <p>PETZ highlights healthy areas, potential concerns and where your pet may need attention.</p>
                          </div>
                          <figure className="image-wrapper">
                            <img src="/assets/images/orange-cat.jpg" alt="Orange cat" width="1200" height="1680" decoding="async" loading="lazy" />
                          </figure>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <div className="steps-layout">
                          <div className="steps_card">
                            <div className="step-num display-10">04</div>
                            <h3 className="display-4">Track over time</h3>
                            <p>Keep your pet's health profile updated as things change and new information becomes available.</p>
                          </div>
                          <figure className="image-wrapper">
                            <img src="/assets/images/husky.jpg" alt="Husky outdoors" width="1200" height="1600" decoding="async" loading="lazy" />
                          </figure>
                        </div>
                      </div>
                    </div>
                    <div className="slider-controls">
                      <button className="slider-arrow" type="button" data-bs-target="#stepsCarousel" data-bs-slide="prev" aria-label="Previous step">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      <button className="slider-arrow" type="button" data-bs-target="#stepsCarousel" data-bs-slide="next" aria-label="Next step">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <div className="section-top-content-wrapper">
                <div style={{maxWidth: "40rem"}}>
                  <h2 className="display-8">A complete picture starts with the basics.</h2>
                  <p>You don't need laboratory tests to start understanding your pet's health. PETZ begins with what you already know and turns it into meaningful insights.</p>
                </div>
                <a className="button is-primary" href="/assess"><span className="button-hover"></span><span className="button-label">Assess My Pet</span></a>
              </div>
              <div className="grid-3 cols-1-tablet">
                <article className="feature-tile reveal">
                  <div className="image-wrapper is-border-radius-medium">
                    <img src="/assets/images/fluffy-white-dog.jpg" alt="Dog waiting near a bowl" width="1200" height="802" decoding="async" loading="lazy" />
                  </div>
                  <h3 className="display-4">Nutrition &amp; Body</h3>
                  <p>Understand how diet, weight and feeding habits support long-term health.</p>
                </article>
                <article className="feature-tile reveal">
                  <div className="image-wrapper is-border-radius-medium">
                    <img src="/assets/images/dog-running.jpg" alt="Dog on a walk" width="1200" height="800" decoding="async" loading="lazy" />
                  </div>
                  <h3 className="display-4">Activity &amp; Lifestyle</h3>
                  <p>Understand how movement, exercise and daily routines influence health and wellbeing.</p>
                </article>
                <article className="feature-tile reveal">
                  <div className="image-wrapper is-border-radius-medium">
                    <img src="/assets/images/tabby-cat.jpg" alt="Cat at rest" width="1200" height="1200" decoding="async" loading="lazy" />
                  </div>
                  <h3 className="display-4">Health History</h3>
                  <p>Bring together past conditions, medications, symptoms and other important health information.</p>
                </article>
              </div>
              <p className="future-line">And this is only the beginning. As PETZ evolves, additional layers of health data — including advanced diagnostics and biomarkers — can be incorporated into your pet's health profile.</p>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <div className="section-top-content-wrapper is-stack" style={{maxWidth: "42rem"}}>
                <div>
                  <p className="eyebrow">Health signals</p>
                  <h2 className="display-8">Small changes can tell a bigger story.</h2>
                  <p>Your pet can't tell you when something feels different. Changes in appetite, weight, energy, behaviour or routine can be easy to overlook.</p>
                  <p>PETZ helps you organize these everyday signals and understand what they may mean for your pet's health.</p>
                </div>
              </div>
              <div className="signals-grid stagger-group">
                <article className="icon-top-card reveal">
                  <div className="icon-bubble" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 13c4-8 12-8 16 0" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="16" r="2" fill="currentColor" /></svg>
                  </div>
                  <h3 className="display-4">Nutrition</h3>
                  <p>What your pet eats, how much they eat and how consistently they eat.</p>
                </article>
                <article className="icon-top-card reveal">
                  <div className="icon-bubble" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="4" height="10" rx="1" fill="currentColor" /><rect x="10" y="6" width="4" height="14" rx="1" fill="currentColor" /><rect x="16" y="3" width="4" height="17" rx="1" fill="currentColor" /></svg>
                  </div>
                  <h3 className="display-4">Body condition</h3>
                  <p>Weight, body condition and changes over time.</p>
                </article>
                <article className="icon-top-card reveal">
                  <div className="icon-bubble" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 16c2-6 6-9 8-9s6 3 8 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M8 12h.01M16 12h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
                  </div>
                  <h3 className="display-4">Activity</h3>
                  <p>Movement, exercise, energy and daily routines.</p>
                </article>
                <article className="icon-top-card reveal">
                  <div className="icon-bubble" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10Z" stroke="currentColor" strokeWidth="1.6" /></svg>
                  </div>
                  <h3 className="display-4">Behaviour</h3>
                  <p>Mood, habits, sleep, appetite and changes you notice at home.</p>
                </article>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-frame">
              <div className="section-card">
                <div className="container">
                  <h2 className="display-8" style={{maxWidth: "36rem"}}>Better health isn't one-size-fits-all.</h2>
                  <p style={{maxWidth: "40rem"}}>Every pet is different. PETZ looks at your pet's individual profile to identify the areas that matter most.</p>
                  <div className="grid-4 cards-layout stagger-group">
                    <div className="bento-image-col reveal-scale">
                      <img src="/assets/images/puppy-grass.jpg" alt="Puppy in a garden" width="1200" height="800" decoding="async" loading="lazy" />
                    </div>
                    <div className="bento-cards-col">
                      <article className="icon-top-card reveal">
                        <div className="icon-bubble">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 13c4-8 12-8 16 0" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="16" r="2" fill="currentColor" /></svg>
                        </div>
                        <h3 className="display-4">Nutrition</h3>
                        <p>Build healthier feeding habits around your pet's age, lifestyle and needs.</p>
                      </article>
                      <article className="icon-top-card reveal">
                        <div className="icon-bubble">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" /><path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                        </div>
                        <h3 className="display-4">Weight &amp; Metabolic Health</h3>
                        <p>Keep your pet at a healthier body condition and identify areas worth monitoring.</p>
                      </article>
                      <div className="grid-2" style={{gap: "24px"}}>
                        <article className="icon-top-card reveal">
                          <div className="icon-bubble">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 16c3-8 13-8 16 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                          </div>
                          <h3 className="display-4">Movement &amp; Mobility</h3>
                          <p>Support appropriate activity, strength, mobility and everyday movement.</p>
                        </article>
                        <article className="icon-top-card reveal">
                          <div className="icon-bubble">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" /><path d="M5 19c1.2-3 3.8-4.5 7-4.5S17.8 16 19 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                          </div>
                          <h3 className="display-4">Mind &amp; Behaviour</h3>
                          <p>Support mental stimulation, routine, enrichment and behavioural wellbeing.</p>
                        </article>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <div className="inner-container-center measure-wide">
                <h2 className="display-8">Your pet's health. At a glance.</h2>
                <p>PETZ brings your pet's health information together in one simple profile — showing what's going well, what needs attention and what to do next.</p>
              </div>
              <div className="dashboard-mock reveal">
                <div className="dashboard-mock__top">
                  <div className="dashboard-pet">
                    <img src="/assets/images/golden-retriever.jpg" alt="" width="1200" height="1924" decoding="async" loading="lazy" />
                    <div>
                      <div className="display-4">Sample profile</div>
                      <p>Illustrative health profile preview</p>
                    </div>
                  </div>
                  <div style={{textAlign: "center"}}>
                    <div className="score-ring" aria-hidden="true"><span>82</span></div>
                    <p className="mt-2" style={{fontWeight: 600, color: "var(--color-100)"}}>Overall Health Score</p>
                  </div>
                </div>
                <div className="dash-rows">
                  <div className="dash-row"><span className="label">Nutrition</span><div className="bar"><span className="is-accent" style={{width: "86%"}}></span></div><span className="val">Strong</span></div>
                  <div className="dash-row"><span className="label">Body Condition</span><div className="bar"><span style={{width: "70%"}}></span></div><span className="val">Monitor</span></div>
                  <div className="dash-row"><span className="label">Activity</span><div className="bar"><span style={{width: "64%"}}></span></div><span className="val">Monitor</span></div>
                  <div className="dash-row"><span className="label">Preventive Care</span><div className="bar"><span className="is-accent" style={{width: "90%"}}></span></div><span className="val">On track</span></div>
                  <div className="dash-row"><span className="label">Behaviour &amp; Wellbeing</span><div className="bar"><span style={{width: "78%"}}></span></div><span className="val">Good</span></div>
                  <div className="dash-row"><span className="label">Health History</span><div className="bar"><span style={{width: "60%"}}></span></div><span className="val">Review</span></div>
                </div>
              </div>
              <div className="button-row is-center-aligned">
                <a className="button is-secondary-dark" href="/sample-assessment"><span className="button-hover"></span><span className="button-label">View a Sample Assessment</span></a>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-frame">
              <div className="section-card">
                <div className="container">
                  <div className="inner-container-center measure-wide">
                    <h2 className="display-8">Every pet has a different starting point.</h2>
                    <p>Every pet starts from a different place. Some need preventive support, some need closer attention, and others need a better plan for ageing. PETZ adapts to where your pet is today.</p>
                  </div>
                  <div id="journeysCarousel" className="carousel slide journeys-slider" data-bs-ride="false" data-bs-interval="false">
                    <div className="carousel-inner">
                      <div className="carousel-item active">
                        <div className="journey-slide">
                          <span className="example-chip">Illustrative example</span>
                          <blockquote>“Everything seemed fine. PETZ helped us understand what we could do now to keep it that way.”</blockquote>
                          <p className="display-4">The healthy pet</p>
                          <p className="focus-tags">Focus: Preventive health · Nutrition · Activity</p>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <div className="journey-slide">
                          <span className="example-chip">Illustrative example</span>
                          <blockquote>“We knew something wasn't quite right. PETZ helped us organize what we'd noticed and understand what deserved attention.”</blockquote>
                          <p className="display-4">The persistent issue</p>
                          <p className="focus-tags">Focus: Symptoms · Health history · Next steps</p>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <div className="journey-slide">
                          <span className="example-chip">Illustrative example</span>
                          <blockquote>“Getting older doesn't have to mean simply accepting decline. We wanted a better plan.”</blockquote>
                          <p className="display-4">The ageing pet</p>
                          <p className="focus-tags">Focus: Senior health · Mobility · Nutrition · Preventive care</p>
                        </div>
                      </div>
                    </div>
                    <div className="slider-controls" style={{justifyContent: "center"}}>
                      <button className="slider-arrow" type="button" data-bs-target="#journeysCarousel" data-bs-slide="prev" aria-label="Previous journey">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      <button className="slider-arrow" type="button" data-bs-target="#journeysCarousel" data-bs-slide="next" aria-label="Next journey">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <div className="section-top-content-wrapper">
                <div style={{maxWidth: "36rem"}}>
                  <h2 className="display-8">Better informed pet parents make better decisions.</h2>
                  <p>Evidence-informed guides on pet health, nutrition, prevention, ageing and everything that helps your pet live a healthier life.</p>
                </div>
                <a className="text-link" href="/blog">Browse all articles
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </div>
              <div className="grid-3 section-posts-3-items">
                <a className="post-item reveal" href="/blog/5-things-your-pet-cant-tell-you">
                  <div className="image-wrapper is-border-radius-medium"><img src="/assets/images/cat-guide.jpg" alt="" width="1200" height="800" decoding="async" loading="lazy" /></div>
                  <div className="post-meta"><span>Guide</span></div>
                  <h3 className="display-4">5 Things Your Pet Can't Tell You About Their Health</h3>
                </a>
                <a className="post-item reveal" href="/blog/is-your-dog-at-healthy-weight">
                  <div className="image-wrapper is-border-radius-medium"><img src="/assets/images/labrador.jpg" alt="" width="1200" height="800" decoding="async" loading="lazy" /></div>
                  <div className="post-meta"><span>Guide</span></div>
                  <h3 className="display-4">Is Your Dog Actually at a Healthy Weight?</h3>
                </a>
                <a className="post-item reveal" href="/blog/common-pet-health-problems">
                  <div className="image-wrapper is-border-radius-medium"><img src="/assets/images/grey-cat.jpg" alt="" width="1200" height="826" decoding="async" loading="lazy" /></div>
                  <div className="post-meta"><span>Guide</span></div>
                  <h3 className="display-4">The Most Common Pet Health Problems We Catch Too Late</h3>
                </a>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-frame">
              <div className="section-card">
                <div className="container">
                  <div className="final-cta-card inner-container-center measure-wide">
                    <h2 className="display-8">Give your pet's health a head start.</h2>
                    <p>You know your pet better than anyone. PETZ turns what you know into a clearer picture of their health — and what to do next.</p>
                    <div className="button-row is-center-aligned">
                      <a className="button is-primary" href="/assess"><span className="button-hover"></span><span className="button-label">Assess My Pet</span></a>
                    </div>
                    <p className="reassurance">It starts with a few simple questions.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-frame">
              <div className="section-card cta-background newsletter-cta reveal">
                <div className="container">
                  <div className="newsletter-cta-row">
                    <div>
                      <h2 className="display-8">Subscribe to our weekly newsletter</h2>
                      <p className="newsletter-cta-dek">Receive pet health tips, guides, and updates from PETZ.</p>
                    </div>
                    <div>
                      <form className="newsletter-form small-input-single" data-newsletter-form noValidate>
                        <input type="email" name="email" placeholder="Enter your email" autoComplete="email" required aria-label="Email address" defaultValue={user.email} />
                        <button type="submit" className="newsletter-submit" aria-label="Subscribe">
                          <svg viewBox="0 0 16 16" fill="none" width="16" height="16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                      </form>
                      <p className="newsletter-success" hidden>Thanks for subscribing! We'll be in touch soon.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
    </SiteShell>
  );
}
