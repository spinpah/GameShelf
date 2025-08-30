const RAWG_API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

export async function searchGames(query, filters = {}) {
  if (!query && !filters.year && !filters.rating && !filters.platform) return [];

  try {
    // Build query parameters
    const params = new URLSearchParams();
    
    if (query) {
      params.append('search', query);
    }
    
    // Add filters
    if (filters.year) {
      const decadeMap = {
        '2020s': '2020-01-01,2029-12-31',
        '2010s': '2010-01-01,2019-12-31',
        '2000s': '2000-01-01,2009-12-31',
        '1990s': '1990-01-01,1999-12-31',
        '1980s': '1980-01-01,1989-12-31',
        '1970s': '1970-01-01,1979-12-31'
      };
      if (decadeMap[filters.year]) {
        params.append('dates', decadeMap[filters.year]);
      }
    }
    
    if (filters.rating) {
      params.append('metacritic', Math.floor(parseFloat(filters.rating) * 20)); // Convert 0-5 scale to 0-100
    }
    
    if (filters.platform) {
      const platformMap = {
        'pc': '4',
        'playstation': '187,18,16,15,27', // PS5, PS4, PS3, PS2, PS1
        'xbox': '1,14,80,2', // Xbox Series X/S, Xbox One, Xbox 360, Xbox
        'nintendo': '7,8,9,13,83', // Switch, Wii U, Wii, 3DS, N64
        'mobile': '3,21', // iOS, Android
        'steam': '4', // PC
        'epic': '4' // PC
      };
      if (platformMap[filters.platform]) {
        params.append('platforms', platformMap[filters.platform]);
      }
    }
    
    // Add API key and other parameters
    params.append('key', RAWG_API_KEY);
    params.append('ordering', '-rating'); // Sort by rating
    params.append('page_size', '20'); // Limit results
    
    const res = await fetch(
      `https://api.rawg.io/api/games?${params.toString()}`
    );

    if (!res.ok) throw new Error("Failed to fetch from RAWG API");

    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Error fetching games:", err);
    return [];
  }
}

// Enhanced search function for filtered results
export async function searchGamesWithFilters(filters = {}) {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    
    // Add filters
    if (filters.year) {
      const decadeMap = {
        '2020s': '2020-01-01,2029-12-31',
        '2010s': '2010-01-01,2019-12-31',
        '2000s': '2000-01-01,2009-12-31',
        '1990s': '1990-01-01,1999-12-31',
        '1980s': '1980-01-01,1989-12-31',
        '1970s': '1970-01-01,1979-12-31'
      };
      if (decadeMap[filters.year]) {
        params.append('dates', decadeMap[filters.year]);
      }
    }
    
    if (filters.rating) {
      params.append('metacritic', Math.floor(parseFloat(filters.rating) * 20)); // Convert 0-5 scale to 0-100
    }
    
    if (filters.platform) {
      const platformMap = {
        'pc': '4',
        'playstation': '187,18,16,15,27', // PS5, PS4, PS3, PS2, PS1
        'xbox': '1,14,80,2', // Xbox Series X/S, Xbox One, Xbox 360, Xbox
        'nintendo': '7,8,9,13,83', // Switch, Wii U, Wii, 3DS, N64
        'mobile': '3,21', // iOS, Android
        'steam': '4', // PC
        'epic': '4' // PC
      };
      if (platformMap[filters.platform]) {
        params.append('platforms', platformMap[filters.platform]);
      }
    }
    
    // Add API key and other parameters
    params.append('key', RAWG_API_KEY);
    params.append('ordering', '-rating'); // Sort by rating
    params.append('page_size', '20'); // Limit results
    
    const res = await fetch(
      `https://api.rawg.io/api/games?${params.toString()}`
    );

    if (!res.ok) throw new Error("Failed to fetch from RAWG API");

    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Error fetching games with filters:", err);
    return [];
  }
}
