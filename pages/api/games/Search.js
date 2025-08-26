const RAWG_API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

export async function searchGames(query) {
  if (!query) return [];

  try {
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(query)}`
    );

    if (!res.ok) throw new Error("Failed to fetch from RAWG API");

    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Error fetching games:", err);
    return [];
  }
}
