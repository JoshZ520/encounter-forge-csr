import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteEncounter, fetchEncounter, type EncounterDetail } from "../features/encounters/encounterApi";
import { MonsterSnapshotCard } from "../features/encounters/MonsterSnapshotCard";

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
    return <main style={{ padding: 24 }}>Loading encounter...</main>;
  }

  if (error) {
    return (
      <main style={{ maxWidth: 900, margin: "0 auto", padding: 24, display: "grid", gap: 16 }}>
        <div style={{ padding: 12, borderRadius: 10, background: "#fef2f2", color: "#b91c1c" }}>{error}</div>
        <Link to="/encounters" style={{ color: "#0f766e" }}>Back to encounters</Link>
      </main>
    );
  }

  if (!encounter) {
    return null;
  }

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24, display: "grid", gap: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 6 }}>
          <h1 style={{ margin: 0 }}>{encounter.title}</h1>
          <p style={{ margin: 0, color: "#475569" }}>
            {encounter.environment} · {encounter.difficulty} · CR {encounter.targetCR}
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to={`/encounters/${encounter.id}/edit`} style={{ color: "#0f766e" }}>Edit</Link>
          <button type="button" onClick={handleDelete} style={{ border: 0, background: "transparent", color: "#b91c1c", padding: 0, cursor: "pointer" }}>Delete</button>
          <Link to="/encounters" style={{ color: "#0f766e" }}>Back</Link>
        </div>
      </header>

      {message ? (
        <div style={{ padding: 12, borderRadius: 10, background: "#ecfeff", color: "#155e75" }}>{message}</div>
      ) : null}

      <section style={{ display: "grid", gap: 12, padding: 18, borderRadius: 16, border: "1px solid #cbd5e1", background: "white" }}>
        <p style={{ margin: 0 }}><strong>Owner:</strong> {encounter.ownerUserId}</p>
        <p style={{ margin: 0 }}><strong>Party:</strong> {encounter.partySize} at level {encounter.partyLevel}</p>
        <p style={{ margin: 0 }}><strong>Status:</strong> {encounter.status}</p>
        <p style={{ margin: 0 }}><strong>Notes:</strong> {encounter.notes || "None"}</p>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Monster snapshots</h2>
        {encounter.monsters.length === 0 ? <p>No monsters added yet.</p> : null}
        {encounter.monsters.map((monster, index) => (
          <MonsterSnapshotCard key={`${monster.name}-${index}`} monster={monster} index={index} />
        ))}
      </section>
    </main>
  );
}
