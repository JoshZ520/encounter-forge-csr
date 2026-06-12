import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteEncounter, fetchEncounter, type EncounterDetail } from "../features/encounters/encounterApi";
import { MonsterSnapshotCard } from "../features/encounters/MonsterSnapshotCard";
import "./EncounterPages.css";

interface FlashState {
  flashMessage?: string;
}

export function EncounterDetailPage() {
  const { encounterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [encounter, setEncounter] = useState<EncounterDetail | null>(null);
  const [message] = useState<string | null>(location.state ? (location.state as FlashState).flashMessage ?? null : null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEncounter() {
      if (!encounterId) {
        setError("Encounter id is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetchEncounter(encounterId);
        setEncounter(response);
      } catch (requestError: any) {
        setError(requestError.response?.data?.message || requestError.message || "Failed to load encounter");
      } finally {
        setIsLoading(false);
      }
    }

    void loadEncounter();
  }, [encounterId]);

  async function handleDelete() {
    if (!encounterId || !encounter) {
      return;
    }

    const confirmed = window.confirm(`Delete \"${encounter.title}\"?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteEncounter(encounterId);
      navigate("/encounters", { state: { flashMessage: `Deleted \"${encounter.title}\".` } });
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || requestError.message || "Failed to delete encounter");
    }
  }

  if (isLoading) {
    return <main className="encounter-detail-loading">Loading encounter...</main>;
  }

  if (error) {
    return (
      <main className="encounter-detail-error-page">
        <div className="encounter-detail-alert-error">{error}</div>
        <Link to="/encounters" className="encounter-detail-link">Back to encounters</Link>
      </main>
    );
  }

  if (!encounter) {
    return null;
  }

  return (
    <main className="encounter-detail-page">
      <header className="encounter-detail-header">
        <div className="encounter-detail-title-group">
          <h1 className="encounter-detail-title">{encounter.title}</h1>
          <p className="encounter-detail-subtitle">
            {encounter.environment} · {encounter.difficulty} · CR {encounter.targetCR}
          </p>
        </div>

        <div className="encounter-detail-actions">
          <Link to={`/encounters/${encounter.id}/edit`} className="encounter-detail-link">Edit</Link>
          <button type="button" onClick={handleDelete} className="encounter-detail-delete-button">Delete</button>
          <Link to="/encounters" className="encounter-detail-link">Back</Link>
        </div>
      </header>

      {message ? (
        <div className="encounter-detail-alert-success">{message}</div>
      ) : null}

      <section className="encounter-detail-summary">
        <p className="encounter-detail-summary-row"><strong>Owner:</strong> {encounter.ownerUserId}</p>
        <p className="encounter-detail-summary-row"><strong>Party:</strong> {encounter.partySize} at level {encounter.partyLevel}</p>
        <p className="encounter-detail-summary-row"><strong>Status:</strong> {encounter.status}</p>
        <p className="encounter-detail-summary-row"><strong>Notes:</strong> {encounter.notes || "None"}</p>
      </section>

      <section className="encounter-detail-snapshots">
        <h2 className="encounter-detail-snapshots-title">Monster snapshots</h2>
        {encounter.monsters.length === 0 ? <p>No monsters added yet.</p> : null}
        {encounter.monsters.map((monster, index) => (
          <MonsterSnapshotCard key={`${monster.name}-${index}`} monster={monster} index={index} />
        ))}
      </section>
    </main>
  );
}
