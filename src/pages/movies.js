import { useEffect, useState } from "react";

// localStorage helper that is safe with SSR
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
    } catch {}
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

  function logEvent(type, payload = {}) {
    const entry = { ts: new Date().toISOString(), type, payload };
    setEvents(prev => [entry, ...prev].slice(0, 50));
  }

  async function search(q) {
    setErrorMsg("");
    if (!q) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/tmdb?q=${encodeURIComponent(q)}`);
      if (!r.ok) throw new Error(`Search failed: ${r.status}`);
      const data = await r.json();
      setResults(Array.isArray(data.results) ? data.results : []);
      logEvent("search", { q });
    } catch (err) {
      setErrorMsg(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function toggleFavorite(id) {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    logEvent("toggle_favorite", { id });
  }

  // restore on first load if we have a query but no results yet
  useEffect(() => {
    if (query && results.length === 0) search(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className="material-icons" style={{ color: "#e50914" }}>movie</span>
        Movie Search
      </h1>

      <form
        onSubmit={e => { e.preventDefault(); search(query); }}
        style={{ display: "flex", gap: 8, margin: "16px 0" }}
      >
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a movie"
          style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button type="submit" disabled={loading} style={{ padding: "10px 16px", borderRadius: 8 }}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {errorMsg && <div style={{ color: "#b00020", marginBottom: 12 }}>{errorMsg}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
        {results.map(m => (
          <div key={m.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 10 }}>
            {m.poster_path
              ? <img
                  alt={m.title}
                  src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
                  style={{ width: "100%", height: 260, objectFit: "cover", borderRadius: 8 }}
                />
              : <div style={{ height: 260, background: "#f5f5f5", display: "grid", placeItems: "center", borderRadius: 8 }}>
                  No image
                </div>}
            <div style={{ fontWeight: 600, marginTop: 8 }}>{m.title}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{m.release_date || "No date"}</div>
            <button style={{ marginTop: 8, fontSize: 13 }} onClick={() => toggleFavorite(m.id)}>
              {favorites.includes(m.id) ? "Remove Favorite" : "Add Favorite"}
            </button>
          </div>
        ))}
      </div>

      <section style={{ marginTop: 24 }}>
        <h2>Recent events</h2>
        <ul style={{ fontSize: 12, color: "#555", marginTop: 8 }}>
          {events.slice(0, 5).map((e, i) => (
            <li key={i}>{e.ts} - {e.type}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default function Movies() {
  // mount gate to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <MoviesInner />;
}
