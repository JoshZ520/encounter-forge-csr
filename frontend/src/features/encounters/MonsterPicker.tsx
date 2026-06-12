import { useEffect, useMemo, useState } from "react";
import { environmentValues } from "./encounterValidation";
import { fetchMonsterCatalog, type MonsterCatalogItem } from "./monsterCatalogApi";

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
    <section style={{ display: "grid", gap: 12, padding: 16, borderRadius: 14, border: "1px solid #cbd5e1", background: "#fff7ed" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <strong>Monster picker</strong>
          <p style={{ margin: "4px 0 0", color: "#7c2d12", fontSize: 13 }}>Search the shared catalog and click a result to add or increment it.</p>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={includeAll} onChange={(event) => setIncludeAll(event.target.checked)} />
          Show all
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Area</span>
          <select value={environment} onChange={(event) => setEnvironment(event.target.value as typeof environment)} style={{ padding: 10, borderRadius: 8, border: "1px solid #fdba74" }}>
            {environmentValues.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 6, gridColumn: "span 2" }}>
          <span>Search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by monster name"
            style={{ padding: 10, borderRadius: 8, border: "1px solid #fdba74" }}
          />
        </label>
      </div>

      {error ? <div style={{ padding: 12, borderRadius: 10, background: "#fef2f2", color: "#b91c1c" }}>{error}</div> : null}

      <div style={{ display: "grid", gap: 10 }}>
        {isLoading ? <p style={{ margin: 0 }}>Loading monsters...</p> : null}
        {!isLoading && items.length === 0 ? <p style={{ margin: 0 }}>No monsters matched the current search.</p> : null}

        {items.map((monster) => (
          <button
            key={monster.id}
            type="button"
            onClick={() => onSelect(monster)}
            style={{
              textAlign: "left",
              display: "grid",
              gap: 4,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #fdba74",
              background: "white",
              cursor: "pointer",
            }}
          >
            <strong>{monster.name}</strong>
            <span style={{ color: "#7c2d12", fontSize: 13 }}>CR {monster.cr} · {monster.environments.join(", ") || "Unspecified"}</span>
          </button>
        ))}
      </div>

      <footer style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ color: "#7c2d12", fontSize: 13 }}>
          Page {page} of {totalPages} · {total} total
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1}
            style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #fdba74", background: "white" }}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page >= totalPages}
            style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #fdba74", background: "white" }}
          >
            Next
          </button>
        </div>
      </footer>
    </section>
  );
}
