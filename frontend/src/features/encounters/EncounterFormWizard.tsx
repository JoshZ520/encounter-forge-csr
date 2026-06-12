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

interface EncounterFormWizardProps {
  initialValues?: EncounterFormValues;
  isSubmitting?: boolean;
  submitLabel: string;
  onCancel?: () => void;
  onSubmit: (values: EncounterFormValues) => Promise<void> | void;
}

type WizardStep = 0 | 1 | 2 | 3;

const stepLabels = ["Basics", "Party", "Monsters", "Review"] as const;

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
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
      <header style={{ display: "grid", gap: 8 }}>
        <h1 style={{ margin: 0 }}>Encounter Builder</h1>
        <p style={{ margin: 0, color: "#475569" }}>
          Step {step + 1} of 4: {stepLabels[step]}
        </p>
      </header>

      {formError ? (
        <div style={{ padding: 12, borderRadius: 10, background: "#fef2f2", color: "#b91c1c" }}>
          {formError}
        </div>
      ) : null}

      {step === 0 ? (
        <section style={{ display: "grid", gap: 16 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Encounter name</span>
            <input
              value={values.title}
              onChange={(event) => updateValue("title", event.target.value)}
              style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
            />
            {fieldErrors.title ? <small style={{ color: "#b91c1c" }}>{fieldErrors.title}</small> : null}
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Environment</span>
              <select
                value={values.environment}
                onChange={(event) => updateValue("environment", event.target.value as EncounterFormValues["environment"])}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
              >
                {environmentValues.map((environment) => (
                  <option key={environment} value={environment}>
                    {environment}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Difficulty</span>
              <select
                value={values.difficulty}
                onChange={(event) => updateValue("difficulty", event.target.value as EncounterFormValues["difficulty"])}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
              >
                {difficultyValues.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Notes</span>
            <textarea
              value={values.notes ?? ""}
              onChange={(event) => updateValue("notes", event.target.value)}
              rows={4}
              style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
            />
          </label>
        </section>
      ) : null}

      {step === 1 ? (
        <section style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Party size</span>
              <input
                type="number"
                min={1}
                max={10}
                value={values.partySize}
                onChange={(event) => updateValue("partySize", Number(event.target.value))}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Party level</span>
              <input
                type="number"
                min={1}
                max={20}
                value={values.partyLevel}
                onChange={(event) => updateValue("partyLevel", Number(event.target.value))}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Target CR</span>
              <select
                value={values.targetCR}
                onChange={(event) => updateValue("targetCR", event.target.value as EncounterFormValues["targetCR"])}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
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
        <section style={{ display: "grid", gap: 16 }}>
          <EncounterMonsterEditor
            environment={values.environment}
            monsters={values.monsters}
            onChange={(monsters) => updateValue("monsters", monsters)}
          />
          {fieldErrors.monsters ? <small style={{ color: "#b91c1c" }}>{fieldErrors.monsters}</small> : null}
        </section>
      ) : null}

      {step === 3 ? (
        <section style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 8, padding: 16, borderRadius: 12, background: "#f8fafc", border: "1px solid #cbd5e1" }}>
            <h2 style={{ margin: 0 }}>Review</h2>
            <p style={{ margin: 0 }}><strong>Name:</strong> {values.title || "Untitled encounter"}</p>
            <p style={{ margin: 0 }}><strong>Party:</strong> {values.partySize} characters at level {values.partyLevel}</p>
            <p style={{ margin: 0 }}><strong>Environment:</strong> {values.environment}</p>
            <p style={{ margin: 0 }}><strong>Difficulty:</strong> {values.difficulty}</p>
            <p style={{ margin: 0 }}><strong>Target CR:</strong> {values.targetCR}</p>
            <p style={{ margin: 0 }}><strong>Monsters:</strong> {values.monsters.length}</p>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <h3 style={{ margin: 0 }}>Status</h3>
            <EncounterStatusControls
              value={values.status}
              monsterCount={values.monsters.length}
              onChange={(status) => updateValue("status", status)}
              disabled={isSubmitting}
            />
          </div>
        </section>
      ) : null}

      <footer style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={previousStep}
            disabled={step === 0 || isSubmitting}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #cbd5e1", background: "white" }}
          >
            Back
          </button>
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #cbd5e1", background: "white" }}
            >
              Cancel
            </button>
          ) : null}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={isSubmitting}
              style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #0f766e", background: "#0f766e", color: "white" }}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #0f766e", background: "#0f766e", color: "white" }}
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          )}
        </div>
      </footer>
    </form>
  );
}
