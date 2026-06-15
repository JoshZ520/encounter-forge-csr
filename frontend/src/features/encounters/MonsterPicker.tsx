import { useEffect, useMemo, useState } from "react";
import { environmentValues } from "./encounterValidation";
import { fetchMonsterCatalog, type MonsterCatalogItem } from "./monsterCatalogApi";
import "./EncounterComponents.css";

interface MonsterPickerProps {
  defaultEnvironment: (typeof environmentValues)[number];
  onSelect: (monster: MonsterCatalogItem) => void;
}

export function MonsterPicker({ defaultEnvironment, onSelect }: MonsterPickerProps) {
  const [environment, setEnvironment] = useState<(typeof environmentValues)[number]>(defaultEnvironment);
  const [includeAll, setIncludeAll] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [items, setItems] = useState<MonsterCatalogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [pageSize, total]);

  useEffect(() => {
    let isActive = true;

    async function loadMonsters() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchMonsterCatalog({
          environment,
          includeAll,
          q: query || undefined,
          page,
          pageSize,
        });

        if (!isActive) {
          return;
        }

        setItems(response.items);
        setTotal(response.total);
      } catch (requestError: any) {
        if (!isActive) {
          return;
        }

        setError(requestError.response?.data?.message || requestError.message || "Failed to load monster catalog");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadMonsters();

    return () => {
      isActive = false;
    };
  }, [environment, includeAll, page, pageSize, query]);

  useEffect(() => {
    setPage(1);
  }, [environment, includeAll, query]);

  return (
    <section className="monster-picker">
      <div className="monster-picker-header">
        <div>
          <strong>Monster picker</strong>
          <p className="monster-picker-subtitle">Search the shared catalog and click a result to add or increment it.</p>
        </div>
        <label className="monster-picker-toggle-label">
          <input type="checkbox" checked={includeAll} onChange={(event) => setIncludeAll(event.target.checked)} />
          Show all
        </label>
      </div>

      <div className="monster-picker-filters">
        <label className="monster-picker-field">
          <span>Area</span>
          <select value={environment} onChange={(event) => setEnvironment(event.target.value as typeof environment)} className="monster-picker-input">
            {environmentValues.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="monster-picker-field monster-picker-search-field">
          <span>Search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by monster name"
            className="monster-picker-input"
          />
        </label>
      </div>

      {error ? <div className="monster-picker-error">{error}</div> : null}

      <div className="monster-picker-list">
        {isLoading ? <p className="monster-picker-message">Loading monsters...</p> : null}
        {!isLoading && items.length === 0 ? <p className="monster-picker-message">No monsters matched the current search.</p> : null}

        {items.map((monster) => (
          <button
            key={monster.id}
            type="button"
            onClick={() => onSelect(monster)}
            className="monster-picker-item"
          >
            <strong>{monster.name}</strong>
            <span className="monster-picker-item-meta">CR {monster.cr} · {monster.environments.join(", ") || "Unspecified"}</span>
          </button>
        ))}
      </div>

      <footer className="monster-picker-footer">
        <span className="monster-picker-footer-meta">
          Page {page} of {totalPages} · {total} total
        </span>
        <div className="monster-picker-footer-actions">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1}
            className="monster-picker-page-button"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page >= totalPages}
            className="monster-picker-page-button"
          >
            Next
          </button>
        </div>
      </footer>
    </section>
  );
}
