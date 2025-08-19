export default async function handler(req, res) {
  const token = process.env.TMDB_BEARER_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "TMDB_BEARER_TOKEN is not set" });
  }

  try {
    const { q = "", page = "1" } = req.query;
    const pageNum = Math.max(1, Math.min(500, parseInt(page, 10) || 1));

    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      q
    )}&page=${encodeURIComponent(String(pageNum))}&include_adult=false&language=en-US`;

    const r = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await r.json();

    if (!r.ok) {
      return res
        .status(r.status)
        .json({ error: data?.status_message || "TMDB error", details: data });
    }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: "TMDB request failed" });
  }
}
