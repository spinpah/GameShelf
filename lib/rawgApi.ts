export interface RawgGameData {
  id: number;
  name: string;
  description_raw?: string;
  description?: string;
  background_image?: string;
  rating: number; // RAWG average rating
  ratings_count: number; // Number of people who rated on RAWG
}

export async function fetchRawgGame(gameId: number): Promise<RawgGameData | null> {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games/${gameId}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`RAWG API error: ${response.status}`);
    }
    
    const gameData = await response.json();
    
    return {
      id: gameData.id,
      name: gameData.name,
      description_raw: gameData.description_raw,
      description: gameData.description,
      background_image: gameData.background_image,
      rating: gameData.rating,
      ratings_count: gameData.ratings_count,
    };
  } catch (error) {
    console.error('Error fetching RAWG game:', error);
    return null;
  }
}