import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EncounterFormWizard } from "../features/encounters/EncounterFormWizard";
import { createEncounter, fetchEncounter, updateEncounter } from "../features/encounters/encounterApi";
import { createEmptyEncounterFormValues, type EncounterFormValues } from "../features/encounters/encounterValidation";

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
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24, display: "grid", gap: 16 }}>
        <div style={{ padding: 12, borderRadius: 10, background: "#fef2f2", color: "#b91c1c" }}>{error}</div>
        <button type="button" onClick={() => navigate("/encounters")} style={{ width: "fit-content" }}>
          Back to list
        </button>
      </main>
    );
  }

  if (isLoading || !initialValues) {
    return <main style={{ padding: 24 }}>Loading encounter form...</main>;
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24, display: "grid", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>{isEditMode ? "Edit Encounter" : "Create Encounter"}</h1>
          <p style={{ margin: "6px 0 0", color: "#475569" }}>Use the guided flow to shape the battle before you save it.</p>
        </div>

        <Link to="/encounters" style={{ color: "#0f766e", alignSelf: "center" }}>Back to list</Link>
      </div>

      {error ? <div style={{ padding: 12, borderRadius: 10, background: "#fef2f2", color: "#b91c1c" }}>{error}</div> : null}

      <section style={{ padding: 20, borderRadius: 16, border: "1px solid #cbd5e1", background: "white" }}>
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
