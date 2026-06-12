import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { deleteEncounter, fetchEncounters, type EncounterListItem } from "../features/encounters/encounterApi";

interface FlashState {
  flashMessage?: string;
}

export function EncounterListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const [items, setItems] = useState<EncounterListItem[]>([]);
  const [message, setMessage] = useState<string | null>(location.state ? (location.state as FlashState).flashMessage ?? null : null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadEncounters() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchEncounters();
      setItems(response.items);
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || requestError.message || "Failed to load encounters");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadEncounters();
    // flash message only used on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  async function handleDelete(encounterId: string, title: string) {
    const confirmed = window.confirm(`Delete \"${title}\"?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteEncounter(encounterId);
      setMessage(`Deleted \"${title}\".`);
      await loadEncounters();
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || requestError.message || "Failed to delete encounter");
    }
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24, display: "grid", gap: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>Your Encounters</h1>
          <p style={{ margin: "6px 0 0", color: "#475569" }}>Create, review, and manage your encounter library.</p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => navigate("/encounters/new")}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #0f766e", background: "#0f766e", color: "white" }}
          >
            New encounter
          </button>
          <button
            type="button"
            onClick={handleLogout}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #cbd5e1", background: "white" }}
          >
            Logout
          </button>
        </div>
      </header>

      {message ? (
        <div style={{ padding: 12, borderRadius: 10, background: "#ecfeff", color: "#155e75" }}>{message}</div>
      ) : null}

      {error ? (
        <div style={{ padding: 12, borderRadius: 10, background: "#fef2f2", color: "#b91c1c" }}>{error}</div>
      ) : null}

      {isLoading ? <p>Loading encounters...</p> : null}

      {!isLoading && items.length === 0 ? (
        <section style={{ padding: 24, border: "1px dashed #cbd5e1", borderRadius: 16, background: "#f8fafc" }}>
          <h2 style={{ marginTop: 0 }}>No encounters yet</h2>
          <p style={{ color: "#475569" }}>Create your first encounter to start planning combat sessions.</p>
          <button
            type="button"
            onClick={() => navigate("/encounters/new")}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #0f766e", background: "#0f766e", color: "white" }}
          >
            Build an encounter
          </button>
        </section>
      ) : null}

      {!isLoading && items.length > 0 ? (
        <section style={{ display: "grid", gap: 16 }}>
          {items.map((item) => (
            <article key={item.id} style={{ padding: 18, borderRadius: 16, border: "1px solid #cbd5e1", background: "white", display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", flexWrap: "wrap" }}>
                <div style={{ display: "grid", gap: 6 }}>
                  <h2 style={{ margin: 0 }}>{item.title}</h2>
                  <p style={{ margin: 0, color: "#475569" }}>
                    Level {item.partyLevel} party of {item.partySize} in {item.environment} · {item.difficulty} · CR {item.targetCR}
                  </p>
                </div>
                <span style={{ padding: "6px 10px", borderRadius: 999, background: item.status === "ready" ? "#dcfce7" : "#fef3c7", color: "#334155", fontWeight: 600 }}>
                  {item.status}
                </span>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to={`/encounters/${item.id}`} style={{ color: "#0f766e" }}>View</Link>
                <Link to={`/encounters/${item.id}/edit`} style={{ color: "#0f766e" }}>Edit</Link>
                <button type="button" onClick={() => handleDelete(item.id, item.title)} style={{ border: 0, background: "transparent", color: "#b91c1c", padding: 0, cursor: "pointer" }}>Delete</button>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  );
}
