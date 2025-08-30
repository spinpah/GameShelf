const RAWG_API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get a random page number (1-100) to increase randomness
    const randomPage = Math.floor(Math.random() * 100) + 1;
    
    // Fetch random games from RAWG API
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page=${randomPage}&page_size=20&ordering=-rating`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from RAWG API');
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ message: 'No games found' });
    }

    // Pick a random game from the results
    const randomIndex = Math.floor(Math.random() * data.results.length);
    const randomGame = data.results[randomIndex];

    // Format the game data
    const formattedGame = {
      id: randomGame.id,
      name: randomGame.name,
      description: randomGame.description || 'No description available',
      coverPhoto: randomGame.background_image || randomGame.background_image_additional,
      rating: randomGame.rating,
      ratingCount: randomGame.rating_count,
      released: randomGame.released,
      genres: randomGame.genres?.map(genre => genre.name) || [],
      platforms: randomGame.platforms?.map(platform => platform.platform.name) || [],
      metacritic: randomGame.metacritic,
      website: randomGame.website,
      rawgUrl: randomGame.website || `https://rawg.io/games/${randomGame.slug}`,
      screenshots: randomGame.short_screenshots?.map(screenshot => screenshot.image) || []
    };

    res.status(200).json({
      game: formattedGame,
      message: 'Random game fetched successfully'
    });

  } catch (error) {
    console.error('Error fetching random game:', error);
    res.status(500).json({ 
      message: 'Failed to fetch random game',
      error: error.message 
    });
  }
}
