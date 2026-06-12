import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EncounterFormWizard } from "../features/encounters/EncounterFormWizard";
import { createEncounter, fetchEncounter, updateEncounter } from "../features/encounters/encounterApi";
import { createEmptyEncounterFormValues, type EncounterFormValues } from "../features/encounters/encounterValidation";
import "./EncounterPages.css";

interface EncounterEditorPageProps {
  mode: "create" | "edit";
}

function encounterDetailToFormValues(detail: Awaited<ReturnType<typeof fetchEncounter>>): EncounterFormValues {
  return {
    title: detail.title,
    partySize: detail.partySize,
    partyLevel: detail.partyLevel,
    environment: detail.environment as EncounterFormValues["environment"],
    difficulty: detail.difficulty as EncounterFormValues["difficulty"],
    targetCR: detail.targetCR as EncounterFormValues["targetCR"],
    notes: detail.notes ?? "",
    status: detail.status as EncounterFormValues["status"],
    monsters: detail.monsters,
  };
}

export function EncounterEditorPage({ mode }: EncounterEditorPageProps) {
  const { encounterId } = useParams();
  const navigate = useNavigate();
  const isEditMode = mode === "edit";
  const [initialValues, setInitialValues] = useState<EncounterFormValues | null>(isEditMode ? null : createEmptyEncounterFormValues());
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEncounter() {
      if (!encounterId) {
        return;
      }

      try {
        const encounter = await fetchEncounter(encounterId);
        setInitialValues(encounterDetailToFormValues(encounter));
      } catch (requestError: any) {
        setError(requestError.response?.data?.message || requestError.message || "Failed to load encounter");
      } finally {
        setIsLoading(false);
      }
    }

    if (isEditMode) {
      void loadEncounter();
    }
  }, [encounterId, isEditMode]);

  async function handleSubmit(values: EncounterFormValues) {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (encounterId) {
        const encounter = await updateEncounter(encounterId, values);
        navigate(`/encounters/${encounter.id}`, { state: { flashMessage: "Encounter updated successfully." } });
        return;
      }

      const encounter = await createEncounter(values);
      navigate(`/encounters/${encounter.id}`, { state: { flashMessage: "Encounter created successfully." } });
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || requestError.message || "Failed to save encounter");
      setIsSubmitting(false);
    }
  }

  if (error && !initialValues) {
    return (
      <main className="encounter-editor-page encounter-editor-error-page">
        <div className="encounter-editor-alert-error">{error}</div>
        <button type="button" onClick={() => navigate("/encounters")} className="encounter-editor-back-button">
          Back to list
        </button>
      </main>
    );
  }

  if (isLoading || !initialValues) {
    return <main className="encounter-editor-loading">Loading encounter form...</main>;
  }

  return (
    <main className="encounter-editor-page">
      <div className="encounter-editor-header">
        <div>
          <h1 className="encounter-editor-title">{isEditMode ? "Edit Encounter" : "Create Encounter"}</h1>
          <p className="encounter-editor-subtitle">Use the guided flow to shape the battle before you save it.</p>
        </div>

        <Link to="/encounters" className="encounter-editor-link">Back to list</Link>
      </div>

      {error ? <div className="encounter-editor-alert-error">{error}</div> : null}

      <section className="encounter-editor-form-shell">
        <EncounterFormWizard
          initialValues={initialValues}
          isSubmitting={isSubmitting}
          submitLabel={isEditMode ? "Save changes" : "Create encounter"}
          onCancel={() => navigate("/encounters")}
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  );
}
