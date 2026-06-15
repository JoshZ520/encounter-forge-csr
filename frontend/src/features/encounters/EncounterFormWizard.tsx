import { useEffect, useMemo, useState } from "react";
import { EncounterStatusControls } from "./EncounterStatusControls";
import { EncounterMonsterEditor } from "./EncounterMonsterEditor";
import {
  challengeRatingValues,
  createEmptyEncounterFormValues,
  difficultyValues,
  encounterUpsertSchema,
  environmentValues,
  mapZodErrors,
  type EncounterFormValues,
} from "./encounterValidation";
import "./EncounterComponents.css";

interface EncounterFormWizardProps {
  initialValues?: EncounterFormValues;
  isSubmitting?: boolean;
  submitLabel: string;
  onCancel?: () => void;
  onSubmit: (values: EncounterFormValues) => Promise<void> | void;
}

type WizardStep = 0 | 1 | 2 | 3;

const stepLabels = ["Basics", "Party", "Monster lineup", "Review"] as const;

export function EncounterFormWizard({
  initialValues,
  isSubmitting,
  submitLabel,
  onCancel,
  onSubmit,
}: EncounterFormWizardProps) {
  const [step, setStep] = useState<WizardStep>(0);
  const [values, setValues] = useState<EncounterFormValues>(
    initialValues ?? createEmptyEncounterFormValues()
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
    }
  }, [initialValues]);

  const stepSchema = useMemo(() => {
    if (step === 0) {
      return encounterUpsertSchema.pick({
        title: true,
        environment: true,
        difficulty: true,
        notes: true,
      });
    }

    if (step === 1) {
      return encounterUpsertSchema.pick({
        partySize: true,
        partyLevel: true,
        targetCR: true,
      });
    }

    if (step === 2) {
      return encounterUpsertSchema.pick({ monsters: true });
    }

    return encounterUpsertSchema;
  }, [step]);

  function updateValue<K extends keyof EncounterFormValues>(key: K, nextValue: EncounterFormValues[K]) {
    setValues((current) => ({ ...current, [key]: nextValue }));
  }

  function validateCurrentStep() {
    const result = stepSchema.safeParse(values);

    if (!result.success) {
      setFieldErrors(mapZodErrors(result.error));
      setFormError("Fix the highlighted fields before continuing.");
      return false;
    }

    if (step === 3 && values.status === "ready" && values.monsters.length < 1) {
      setFieldErrors({ monsters: "Ready encounters must include at least one monster" });
      setFormError("Add at least one monster before saving a ready encounter.");
      return false;
    }

    setFieldErrors({});
    setFormError(null);
    return true;
  }

  function nextStep() {
    if (!validateCurrentStep()) {
      return;
    }

    setStep((current) => (Math.min(current + 1, 3) as WizardStep));
  }

  function previousStep() {
    setFormError(null);
    setFieldErrors({});
    setStep((current) => (Math.max(current - 1, 0) as WizardStep));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    await onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="encounter-form-wizard">
      <header className="encounter-form-wizard-header">
        <h1 className="encounter-form-wizard-title">Encounter Forge</h1>
        <p className="encounter-form-wizard-subtitle">
          Step {step + 1} of 4: {stepLabels[step]}.
        </p>
        <p className="encounter-form-wizard-description">
          Move through the sections in order. Draft encounters can stay empty until you are ready.
        </p>
      </header>

      {formError ? (
        <div className="encounter-form-wizard-error-banner">
          {formError}
        </div>
      ) : null}

      {step === 0 ? (
        <section className="encounter-form-wizard-section">
          <label className="encounter-form-wizard-field">
            <span>Encounter name</span>
            <input
              value={values.title}
              onChange={(event) => updateValue("title", event.target.value)}
              className="encounter-form-wizard-input"
            />
            {fieldErrors.title ? <small className="encounter-form-wizard-field-error">{fieldErrors.title}</small> : null}
          </label>

          <div className="encounter-form-wizard-grid">
            <label className="encounter-form-wizard-field">
              <span>Environment</span>
              <select
                value={values.environment}
                onChange={(event) => updateValue("environment", event.target.value as EncounterFormValues["environment"])}
                className="encounter-form-wizard-input"
              >
                {environmentValues.map((environment) => (
                  <option key={environment} value={environment}>
                    {environment}
                  </option>
                ))}
              </select>
            </label>

            <label className="encounter-form-wizard-field">
              <span>Difficulty</span>
              <select
                value={values.difficulty}
                onChange={(event) => updateValue("difficulty", event.target.value as EncounterFormValues["difficulty"])}
                className="encounter-form-wizard-input"
              >
                {difficultyValues.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="encounter-form-wizard-field">
            <span>Notes</span>
            <textarea
              value={values.notes ?? ""}
              onChange={(event) => updateValue("notes", event.target.value)}
              rows={4}
              className="encounter-form-wizard-input"
            />
          </label>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="encounter-form-wizard-section">
          <div className="encounter-form-wizard-grid">
            <label className="encounter-form-wizard-field">
              <span>Party size</span>
              <input
                type="number"
                min={1}
                max={10}
                value={values.partySize}
                onChange={(event) => updateValue("partySize", Number(event.target.value))}
                className="encounter-form-wizard-input"
              />
            </label>

            <label className="encounter-form-wizard-field">
              <span>Party level</span>
              <input
                type="number"
                min={1}
                max={20}
                value={values.partyLevel}
                onChange={(event) => updateValue("partyLevel", Number(event.target.value))}
                className="encounter-form-wizard-input"
              />
            </label>

            <label className="encounter-form-wizard-field">
              <span>Target CR</span>
              <select
                value={values.targetCR}
                onChange={(event) => updateValue("targetCR", event.target.value as EncounterFormValues["targetCR"])}
                className="encounter-form-wizard-input"
              >
                {challengeRatingValues.map((challengeRating) => (
                  <option key={challengeRating} value={challengeRating}>
                    {challengeRating}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="encounter-form-wizard-section">
          <EncounterMonsterEditor
            environment={values.environment}
            monsters={values.monsters}
            onChange={(monsters) => updateValue("monsters", monsters)}
          />
          {fieldErrors.monsters ? <small className="encounter-form-wizard-field-error">{fieldErrors.monsters}</small> : null}
        </section>
      ) : null}

      {step === 3 ? (
        <section className="encounter-form-wizard-section">
          <div className="encounter-form-wizard-review-card">
            <h2 className="encounter-form-wizard-review-heading">Final review</h2>
            <p className="encounter-form-wizard-review-line"><strong>Name:</strong> {values.title || "Untitled encounter"}</p>
            <p className="encounter-form-wizard-review-line"><strong>Party:</strong> {values.partySize} characters at level {values.partyLevel}</p>
            <p className="encounter-form-wizard-review-line"><strong>Environment:</strong> {values.environment}</p>
            <p className="encounter-form-wizard-review-line"><strong>Difficulty:</strong> {values.difficulty}</p>
            <p className="encounter-form-wizard-review-line"><strong>Target CR:</strong> {values.targetCR}</p>
            <p className="encounter-form-wizard-review-line"><strong>Monsters:</strong> {values.monsters.length}</p>
          </div>

          <div className="encounter-form-wizard-status-block">
            <h3 className="encounter-form-wizard-status-heading">Save status</h3>
            <EncounterStatusControls
              value={values.status}
              monsterCount={values.monsters.length}
              onChange={(status) => updateValue("status", status)}
              disabled={isSubmitting}
            />
          </div>
        </section>
      ) : null}

      <footer className="encounter-form-wizard-footer">
        <div className="encounter-form-wizard-footer-actions">
          <button
            type="button"
            onClick={previousStep}
            disabled={step === 0 || isSubmitting}
            className="encounter-form-wizard-button encounter-form-wizard-button-secondary"
          >
            Back
          </button>
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="encounter-form-wizard-button encounter-form-wizard-button-secondary"
            >
              Cancel
            </button>
          ) : null}
        </div>

        <div className="encounter-form-wizard-footer-actions">
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={isSubmitting}
              className="encounter-form-wizard-button encounter-form-wizard-button-primary"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="encounter-form-wizard-button encounter-form-wizard-button-primary"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          )}
        </div>
      </footer>
    </form>
  );
}
