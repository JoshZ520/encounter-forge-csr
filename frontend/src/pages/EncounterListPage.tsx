import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { deleteEncounter, fetchEncounters, type EncounterListItem } from "../features/encounters/encounterApi";
import "./EncounterPages.css";

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
    <main className="encounter-list-page">
      <header className="encounter-list-header">
        <div>
          <h1 className="encounter-list-title">Your Encounters</h1>
          <p className="encounter-list-subtitle">Create, review, and manage your encounter library.</p>
        </div>

        <div className="encounter-list-actions">
          <button
            type="button"
            onClick={() => navigate("/encounters/new")}
            className="encounter-button encounter-button-primary"
          >
            New encounter
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="encounter-button encounter-button-secondary"
          >
            Logout
          </button>
        </div>
      </header>

      {message ? (
        <div className="encounter-alert encounter-alert-success">{message}</div>
      ) : null}

      {error ? (
        <div className="encounter-alert encounter-alert-error">{error}</div>
      ) : null}

      {isLoading ? <p className="encounter-loading">Loading encounters...</p> : null}

      {!isLoading && items.length === 0 ? (
        <section className="encounter-empty-state">
          <h2 className="encounter-empty-title">No encounters yet</h2>
          <p className="encounter-empty-text">Create your first encounter to start planning combat sessions.</p>
          <button
            type="button"
            onClick={() => navigate("/encounters/new")}
            className="encounter-button encounter-button-primary"
          >
            Build an encounter
          </button>
        </section>
      ) : null}

      {!isLoading && items.length > 0 ? (
        <section className="encounter-list-grid">
          {items.map((item) => (
            <article key={item.id} className="encounter-card">
              <div className="encounter-card-header">
                <div className="encounter-card-title-group">
                  <h2 className="encounter-card-title">{item.title}</h2>
                  <p className="encounter-card-meta">
                    Level {item.partyLevel} party of {item.partySize} in {item.environment} · {item.difficulty} · CR {item.targetCR}
                  </p>
                </div>
                <span
                  className={
                    item.status === "ready"
                      ? "encounter-status-badge encounter-status-ready"
                      : "encounter-status-badge encounter-status-draft"
                  }
                >
                  {item.status}
                </span>
              </div>

              <div className="encounter-card-actions">
                <Link to={`/encounters/${item.id}`} className="encounter-link">View</Link>
                <Link to={`/encounters/${item.id}/edit`} className="encounter-link">Edit</Link>
                <button type="button" onClick={() => handleDelete(item.id, item.title)} className="encounter-link-delete">Delete</button>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  );
}
