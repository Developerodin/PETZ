import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getFormUser } from "@/lib/form-user";
import { getSavedPets } from "@/lib/saved-pets";
import { APPETITE, BEHAVIOUR, BODY_CONDITION_SCORES, ENERGY, EXERCISE, FOOD_TYPE, LIVING_ENVIRONMENT, MEAL_PATTERN, MUSCLE_TONE, SLEEP, WEIGHT_TREND } from "@/lib/pet-options";
import { formatPetAge } from "@/lib/pet-utils";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Assess My Pet — PETZ",
  description: "Complete a few simple questions about your pet and receive personalized health insights.",
};

async function getAssessSavedPets() {
  const session = await auth();
  if (!session?.user) return [];
  return getSavedPets();
}

export default async function AssessPage() {
  const user = await getFormUser();
  const savedPets = user.signedIn ? await getAssessSavedPets() : [];

  return (
    <SiteShell variant="inflow">
      <section className="section pet-screen">
            <div className="container">
              <div className="account-wrap">
              <div className="inner-container-center measure-wide reveal">
                <h1 className="display-8">Assess My Pet</h1>
                <p>
                  {user.signedIn
                    ? `Signed in as ${user.name || user.email}. We'll save this pet on your account.`
                    : "A few simple questions. PETZ turns what you know into a clearer picture of their health."}
                </p>
              </div>
              <form id="assessForm" className="form-card reveal" noValidate>
                <div className="wizard-stepper" aria-label="Progress">
                  <div className="wizard-step is-active">You</div>
                  <div className="wizard-step">Pet</div>
                  <div className="wizard-step">Health</div>
                  <div className="wizard-step">Review</div>
                </div>

                <div className="wizard-panel is-active" data-step="1">
                  <h2 className="display-5">About you</h2>
                  <div className="form-grid" style={{marginTop: "24px"}}>
                    <div className="form-field">
                      <label htmlFor="ownerName">Your name</label>
                      <input type="text" id="ownerName" name="ownerName" autoComplete="name" required defaultValue={user.name} />
                      <p className="field-error" aria-live="polite"></p>
                    </div>
                    <div className="form-field">
                      <label htmlFor="ownerEmail">Email</label>
                      <input type="email" id="ownerEmail" name="ownerEmail" autoComplete="email" required defaultValue={user.email} readOnly={user.signedIn} />
                      <p className="field-error" aria-live="polite"></p>
                    </div>
                    <div className="form-check">
                      <input type="checkbox" id="marketing" name="marketing" />
                      <label htmlFor="marketing">Send me evidence-informed pet health tips (optional)</label>
                    </div>
                  </div>
                  <div className="form-actions is-end">
                    <button type="button" className="button is-primary" data-wizard-next><span className="button-hover"></span><span className="button-label">Continue</span></button>
                  </div>
                </div>

                <div className="wizard-panel" data-step="2" hidden>
                  <h2 className="display-5">About your pet</h2>
                  <p className="pet-lede" style={{marginTop: "8px"}}>
                    {savedPets.length
                      ? "Select a saved pet to pre-fill their details, or add a new one."
                      : "Age, breed, weight, diet and lifestyle are all we need to start."}
                  </p>
                  {savedPets.length ? (
                    <ul className="pet-select-list assess-pet-picker" style={{marginTop: "24px"}}>
                      {savedPets.map((pet) => (
                        <li key={pet.id}>
                          <button
                            type="button"
                            className="pet-select-card"
                            data-assess-pet={JSON.stringify({
                              id: pet.id,
                              name: pet.name,
                              species: pet.species,
                              breed: pet.breed,
                              dateOfBirth: pet.dateOfBirth,
                              dobEstimated: pet.dobEstimated,
                              ageYears: pet.ageYears,
                              weightKg: pet.weightKg,
                              livingEnvironment: pet.livingEnvironment,
                              foodType: pet.foodType,
                              mealPattern: pet.mealPattern,
                              exerciseMinsDay: pet.exerciseMinsDay,
                              muscleTone: pet.muscleTone,
                              energyLevel: pet.energyLevel,
                              appetite: pet.appetite,
                              sleepQuality: pet.sleepQuality,
                              behaviourMood: pet.behaviourMood,
                              weightTrend: pet.weightTrend,
                              existingConditions: pet.existingConditions,
                            })}
                          >
                            <span className="pet-select-glyph" aria-hidden="true">
                              {pet.species === "dog" ? "🐕" : "🐈"}
                            </span>
                            <span>
                              <strong>{pet.name}</strong>
                              <span>
                                {pet.species === "dog" ? "Dog" : "Cat"}
                                {formatPetAge(pet) ? ` · ${formatPetAge(pet)}` : ""}
                                {pet.breed ? ` · ${pet.breed}` : ""}
                              </span>
                            </span>
                            <span className="pet-select-action">Select →</span>
                          </button>
                        </li>
                      ))}
                      <li>
                        <button type="button" className="pet-select-new" data-assess-pet-new="true">
                          <span className="pet-select-glyph" aria-hidden="true">+</span>
                          <span>
                            <strong>Add a new pet</strong>
                            <span>Enter details from scratch</span>
                          </span>
                        </button>
                      </li>
                    </ul>
                  ) : null}
                  <input type="hidden" name="petId" id="petId" value="" />
                  <div className="form-grid" style={{marginTop: savedPets.length ? "20px" : "24px"}}>
                    <div className="form-field">
                      <span className="pet-label">Type of pet *</span>
                      <div className="species-toggle" style={{marginTop: "12px"}}>
                        <label className="species-option" data-species="dog">
                          <input type="radio" name="petSpecies" id="petSpecies" value="dog" />
                          <span aria-hidden="true">🐕</span>
                          Dog
                        </label>
                        <label className="species-option" data-species="cat">
                          <input type="radio" name="petSpecies" value="cat" />
                          <span aria-hidden="true">🐈</span>
                          Cat
                        </label>
                      </div>
                      <p className="field-error" aria-live="polite"></p>
                    </div>
                    <div className="form-field">
                      <label htmlFor="petName">Pet&apos;s name *</label>
                      <input type="text" id="petName" name="petName" placeholder="e.g. Max" required />
                      <p className="field-error" aria-live="polite"></p>
                    </div>
                    <div className="form-field">
                      <div className="pet-field-head">
                        <label htmlFor="petDobDay">Date of birth *</label>
                        <button className="pet-link-btn" type="button" id="petDobUnknownToggle">Don&apos;t know?</button>
                      </div>
                      <input type="hidden" name="petDobUnknown" id="petDobUnknown" value="false" />
                      <div className="pet-dob-row" id="petDobRow">
                        <input type="text" inputMode="numeric" id="petDobDay" name="petDobDay" placeholder="Day" />
                        <input type="text" inputMode="numeric" id="petDobMonth" name="petDobMonth" placeholder="Month" />
                        <input type="text" inputMode="numeric" id="petDobYear" name="petDobYear" placeholder="Year" />
                      </div>
                      <div className="form-field" id="petAgeWrap" hidden>
                        <label htmlFor="petAge">Approximate age (years)</label>
                        <input type="number" id="petAge" name="petAge" min="0" max="30" step="1" placeholder="e.g. 3" />
                      </div>
                      <p className="field-error" id="petDobError" aria-live="polite"></p>
                    </div>
                    <div className="form-field">
                      <label htmlFor="petBreed">Breed</label>
                      <input type="text" id="petBreed" name="petBreed" placeholder="e.g. Labrador" />
                      <p className="field-hint">Helps personalize age- and breed-related health areas.</p>
                    </div>
                    <div className="form-field">
                      <label htmlFor="petWeight">Weight (kg)</label>
                      <input type="number" id="petWeight" name="petWeight" min="0.5" max="120" step="0.1" placeholder="e.g. 12.5" />
                      <p className="field-hint">Approximate is fine if you don&apos;t have an exact number.</p>
                      <p className="field-error" aria-live="polite"></p>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="button is-secondary" data-wizard-prev><span className="button-hover"></span><span className="button-label">Back</span></button>
                    <button type="button" className="button is-primary" data-wizard-next><span className="button-hover"></span><span className="button-label">Continue</span></button>
                  </div>
                </div>

                <div className="wizard-panel" data-step="3" hidden>
                  <h2 className="display-5">Health insights</h2>
                  <p className="pet-lede" style={{marginTop: "8px"}}>Simple questions. Skip anything you don&apos;t know — more detail makes the picture clearer.</p>
                  <div className="form-grid" style={{marginTop: "24px"}}>
                    <div className="assess-group">
                      <h3 className="display-4">Nutrition &amp; body health</h3>
                      <p>Diet, feeding habits, weight and body condition.</p>
                      <div className="form-field">
                        <label htmlFor="petDiet">Primary food type</label>
                        <select id="petDiet" name="petDiet" required>
                          <option value="">Select</option>
                          {FOOD_TYPE.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <p className="field-error" aria-live="polite"></p>
                      </div>
                      <div className="form-field">
                        <label htmlFor="petMeals">Feeding pattern</label>
                        <select id="petMeals" name="petMeals">
                          <option value="">Select</option>
                          {MEAL_PATTERN.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-field">
                        <span className="pet-label" id="petBcsLabel">Body condition score (1–9)</span>
                        <div className="bcs-scale" id="petBcsScale" role="radiogroup" aria-labelledby="petBcsLabel">
                          {BODY_CONDITION_SCORES.map((score) => (
                            <label key={score.value} className="bcs-option" title={`${score.value} — ${score.label}`}>
                              <input type="radio" name="petBcs" value={score.value} required={score.value === "1"} />
                              <span className="bcs-option-num">{score.value}</span>
                              <span className="bcs-option-label">{score.label}</span>
                            </label>
                          ))}
                        </div>
                        <p className="field-hint">4–5 is typically ideal. Ribs should be easy to feel with a light cover.</p>
                        <p className="field-error" aria-live="polite"></p>
                      </div>
                      <div className="form-grid-2">
                        <div className="form-field">
                          <label htmlFor="petWeightTrend">Weight in the last 12 months</label>
                          <select id="petWeightTrend" name="petWeightTrend">
                            <option value="">Select</option>
                            {WEIGHT_TREND.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-field">
                          <label htmlFor="petMuscle">Muscle tone</label>
                          <select id="petMuscle" name="petMuscle">
                            <option value="">Select</option>
                            {MUSCLE_TONE.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="assess-group">
                      <h3 className="display-4">Activity &amp; lifestyle</h3>
                      <p>Movement, energy and everyday routines.</p>
                      <div className="form-field">
                        <label htmlFor="petLiving">Living environment</label>
                        <select id="petLiving" name="petLiving">
                          <option value="">Select</option>
                          {LIVING_ENVIRONMENT.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-grid-2">
                        <div className="form-field">
                          <label htmlFor="petExercise">Daily exercise</label>
                          <select id="petExercise" name="petExercise">
                            <option value="">Select</option>
                            {EXERCISE.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                          <p className="field-error" aria-live="polite"></p>
                        </div>
                        <div className="form-field">
                          <label htmlFor="petEnergy">Typical energy</label>
                          <select id="petEnergy" name="petEnergy">
                            <option value="">Select</option>
                            {ENERGY.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="assess-group">
                      <h3 className="display-4">Behaviour &amp; wellbeing</h3>
                      <p>Mood, sleep, appetite and changes you notice at home.</p>
                      <div className="form-field">
                        <label htmlFor="petBehaviour">Behaviour at home</label>
                        <select id="petBehaviour" name="petBehaviour">
                          <option value="">Select</option>
                          {BEHAVIOUR.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-grid-2">
                        <div className="form-field">
                          <label htmlFor="petSleep">Sleep</label>
                          <select id="petSleep" name="petSleep">
                            <option value="">Select</option>
                            {SLEEP.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-field">
                          <label htmlFor="petAppetite">Appetite</label>
                          <select id="petAppetite" name="petAppetite">
                            <option value="">Select</option>
                            {APPETITE.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="assess-group">
                      <h3 className="display-4">Medical history &amp; health signals</h3>
                      <p>Previous conditions, medications, preventive care and anything you&apos;ve noticed recently.</p>
                      <div className="form-field">
                        <label htmlFor="petConditions">Existing conditions or past issues</label>
                        <textarea id="petConditions" name="petConditions" rows={2} placeholder="e.g. sensitive stomach, early joint stiffness" maxLength={500}></textarea>
                        <p className="field-error" aria-live="polite"></p>
                      </div>
                      <div className="form-field">
                        <label htmlFor="petMeds">Current medications / supplements</label>
                        <textarea id="petMeds" name="petMeds" rows={2}></textarea>
                      </div>
                      <div className="form-grid-2">
                        <div className="form-field">
                          <label htmlFor="petVaccines">Vaccinations up to date?</label>
                          <select id="petVaccines" name="petVaccines">
                            <option value="Yes">Yes</option>
                            <option value="Partially">Partially</option>
                            <option value="No">No</option>
                            <option value="Unsure">Unsure</option>
                          </select>
                        </div>
                        <div className="form-field">
                          <label htmlFor="petVetVisits">Vet visits in last 12 months</label>
                          <select id="petVetVisits" name="petVetVisits">
                            <option value="0">None</option>
                            <option value="1">Once</option>
                            <option value="2+">Two or more</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-field">
                        <label htmlFor="petSymptoms">Symptoms or changes you&apos;ve noticed</label>
                        <textarea id="petSymptoms" name="petSymptoms" rows={3} maxLength={500}></textarea>
                        <p className="field-error" aria-live="polite"></p>
                      </div>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="button is-secondary" data-wizard-prev><span className="button-hover"></span><span className="button-label">Back</span></button>
                    <button type="button" className="button is-primary" data-wizard-next><span className="button-hover"></span><span className="button-label">Review</span></button>
                  </div>
                </div>

                <div className="wizard-panel" data-step="4" hidden>
                  <h2 className="display-5">Review your answers</h2>
                  <p style={{marginTop: "12px"}}>PETZ provides health education and preventive guidance. It does not replace a veterinarian or provide a medical diagnosis.</p>
                  <ul className="review-list" style={{marginTop: "24px"}}></ul>
                  <p className="field-hint" style={{marginTop: "16px"}}>By submitting, you acknowledge this is personalized guidance based on the information you provided — not a clinical assessment.</p>
                  <div className="form-actions">
                    <button type="button" className="button is-secondary" data-wizard-prev><span className="button-hover"></span><span className="button-label">Back</span></button>
                    <button type="submit" className="button is-primary"><span className="button-hover"></span><span className="button-label">See my health insights</span></button>
                  </div>
                </div>
              </form>
              </div>
            </div>
          </section>
    </SiteShell>
  );
}
