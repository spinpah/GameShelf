const RAWG_API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

export class GamesAPI {
  static async fetchPopularGames(page = 1, pageSize = 20) {
    try {
      const response = await fetch(
        `${BASE_URL}/games?key=${RAWG_API_KEY}&page=${page}&page_size=${pageSize}&ordering=-rating&metacritic=75,100`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      
      const data = await response.json();
      return {
        games: data.results.map(this.transformGame),
        totalCount: data.count,
        hasNext: !!data.next
      };
    } catch (error) {
      console.error('Error fetching popular games:', error);
      return { games: [], totalCount: 0, hasNext: false };
    }
  }

  static async searchGames(query, page = 1, pageSize = 20) {
    try {
      const response = await fetch(
        `${BASE_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search games');
      }
      
      const data = await response.json();
      return {
        games: data.results.map(this.transformGame),
        totalCount: data.count,
        hasNext: !!data.next
      };
    } catch (error) {
      console.error('Error searching games:', error);
      return { games: [], totalCount: 0, hasNext: false };
    }
  }

  static async getGameDetails(gameId) {
    try {
      const response = await fetch(`${BASE_URL}/games/${gameId}?key=${RAWG_API_KEY}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch game details');
      }
      
      const data = await response.json();
      return this.transformGame(data);
    } catch (error) {
      console.error('Error fetching game details:', error);
      return null;
    }
  }

  static async getGamesByGenre(genreId, page = 1, pageSize = 20) {
    try {
      const response = await fetch(
        `${BASE_URL}/games?key=${RAWG_API_KEY}&genres=${genreId}&page=${page}&page_size=${pageSize}&ordering=-rating`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch games by genre');
      }
      
      const data = await response.json();
      return {
        games: data.results.map(this.transformGame),
        totalCount: data.count,
        hasNext: !!data.next
      };
    } catch (error) {
      console.error('Error fetching games by genre:', error);
      return { games: [], totalCount: 0, hasNext: false };
    }
  }

  static async getGenres() {
    try {
      const response = await fetch(`${BASE_URL}/genres?key=${RAWG_API_KEY}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch genres');
      }
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching genres:', error);
      return [];
    }
  }

  static transformGame(rawGame) {
    return {
      id: rawGame.id,
      name: rawGame.name,
      description: rawGame.description_raw || rawGame.description || '',
      background_image: rawGame.background_image,
      rating: rawGame.rating,
      rating_top: rawGame.rating_top,
      ratings_count: rawGame.ratings_count,
      metacritic: rawGame.metacritic,
      genres: rawGame.genres || [],
      platforms: rawGame.platforms || [],
      released: rawGame.released,
      website: rawGame.website,
      tags: rawGame.tags || [],
      screenshots: rawGame.screenshots || [],
      rawg_id: rawGame.id // Store RAWG ID for reference
    };
  }
}