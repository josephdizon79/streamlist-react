export default async function handler(req, res) {
  try {
    const { q = "", page = "1" } = req.query;

    const r = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&page=${page}&include_adult=false&language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await r.json();
    res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: "TMDB request failed" });
  }
}
