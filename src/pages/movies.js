import { useEffect, useMemo, useState } from "react";

/** localStorage helper that is safe with SSR */
function useLocalStorage(key, initialValue) {
  const isBrowser = typeof window !== "undefined";

  const [value, setValue] = useState(() => {
    if (!isBrowser) return initialValue; // avoid reading on server
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (!isBrowser) return; // no-op on server
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write errors
    }
  }, [isBrowser, key, value]);

  return [value, setValue];
}

function MoviesInner() {
  const [query, setQuery] = useLocalStorage("lastSearchQuery", "");
  const [results, setResults] = useLocalStorage("lastSearchResults", []);
  const [favorites, setFavorites] = useLocalStorage("favorites", []);
  const [events, setEvents] = useLocalStorage("eventLog", []);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // pagination
  const [page, setPage] = useLocalStorage("lastSearchPage", 1);
  const [totalResults, setTotalResults] = useState(0);
  const totalPages = useMemo(
    () => Math.min(500, Math.max(1, Math.ceil((totalResults || 0) / 20))),
    [totalResults]
  );

  function logEvent(type, payload = {}) {
    const entry = { ts: new Date().toISOString(), type, payload };
    setEvents((prev) => [entry, ...prev].slice(0, 50));
  }

  async function search(q) {
    setErrorMsg("");
    if (!q) {
      setResults([]);
      setTotalResults(0);
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(
        `/api/tmdb?q=${encodeURIComponent(q)}&page=${encodeURIComponent(String(page))}`
      );
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || `Search failed: ${r.status}`);

      setResults(Array.isArray(data.results) ? data.results : []);
      setTotalResults(typeof data.total_results === "number" ? data.total_results : 0);
      logEvent("search", { q, page });
    } catch (err) {
      setErrorMsg(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function toggleFavorite(id) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    logEvent("toggle_favorite", { id });
  }

  // restore on first load if we have a query but no results yet
  useEffect(() => {
    if (query && results.length === 0) search(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // re-run search whenever page changes
  useEffect(() => {
    if (query) search(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className="material-icons" style={{ color: "#e50914" }}>movie</span>
        Movie Search
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);      // new search starts at page 1
          search(query);
        }}
        style={{ display: "flex", gap: 8, margin: "16px 0" }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie"
          style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button type="submit" disabled={loading} style={{ padding: "10px 16px", borderRadius: 8 }}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {errorMsg && <div style={{ color: "#b00020", marginBottom: 12 }}>{errorMsg}</div>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        {results.map((m) => (
          <div key={m.id} style={{ border: "1px solid #333", borderRadius: 10, padding: 10, background: "#1f1f1f" }}>
            {m.poster_path ? (
              <img
                alt={m.title}
                src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
                style={{ width: "100%", height: 260, objectFit: "cover", borderRadius: 8 }}
              />
            ) : (
              <div
                style={{
                  height: 260,
                  background: "#2a2a2a",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 8,
                  color: "#aaa",
                }}
              >
                No image
              </div>
            )}
            <div style={{ fontWeight: 600, marginTop: 8, color: "#ddd" }}>{m.title}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{m.release_date || "No date"}</div>
            <button
              style={{ marginTop: 8, fontSize: 13 }}
              onClick={() => toggleFavorite(m.id)}
            >
              {favorites.includes(m.id) ? "Remove Favorite" : "Add Favorite"}
            </button>
          </div>
        ))}
      </div>

      {/* pagination */}
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
        <button
          type="button"
          onClick={() => {
            if (page > 1) setPage((p) => p - 1);
          }}
          disabled={loading || page <= 1}
        >
          ◀ Prev
        </button>

        <span>
          Page {page}
          {totalPages > 1 ? ` / ${totalPages}` : ""}
        </span>

        <button
          type="button"
          onClick={() => {
            if (page < totalPages) setPage((p) => p + 1);
          }}
          disabled={loading || page >= totalPages}
        >
          Next ▶
        </button>
      </div>

      <section style={{ marginTop: 24 }}>
        <h2>Recent events</h2>
        <ul style={{ fontSize: 12, color: "#bbb", marginTop: 8 }}>
          {events.slice(0, 5).map((e, i) => (
            <li key={i}>
              {e.ts} - {e.type} {e.payload?.q ? `(q="${e.payload.q}", p=${e.payload.page ?? "1"})` : ""}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default function Movies() {
  // mount gate to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return <MoviesInner />;
}
