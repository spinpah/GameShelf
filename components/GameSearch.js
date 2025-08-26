// components/GameSearch.js
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Star, Calendar, Monitor, Clock, Trophy } from 'lucide-react';
import Image from 'next/image';

const GameSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const searchGames = useCallback(async (query, pageNum = 1, append = false) => {
    if (!query.trim()) {
      setGames([]);
      setHasMore(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/games/search?query=${encodeURIComponent(query)}&page=${pageNum}&page_size=12`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }

      const data = await response.json();
      
      // Ensure results is always an array
      const results = data.results || [];
      
      if (append) {
        setGames(prev => [...(prev || []), ...results]);
      } else {
        setGames(results);
      }
      
      setHasMore(!!data.next);
    } catch (err) {
      setError('Error searching games. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm !== '') {
        setPage(1);
        searchGames(searchTerm, 1, false);
      } else {
        setGames([]);
        setHasMore(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchGames]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    searchGames(searchTerm, nextPage, true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).getFullYear();
  };

  const getPlatformNames = (platforms) => {
    if (!platforms || platforms.length === 0) return 'Multiple platforms';
    return platforms.slice(0, 3).map(p => p.name).join(', ');
  };

  const handleAddToShelf = async (game) => {
    // TODO: Implement your database logic here
    console.log('Adding to shelf:', game);
    
    // Example API call to your backend
    // try {
    //   await fetch('/api/user/games', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ gameId: game.id, gameData: game })
    //   });
    //   // Show success message
    // } catch (error) {
    //   // Show error message
    // }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">GameShelf</h1>
        <p className="text-gray-600 mb-6">Discover and rate your favorite games</p>
        
        {/* Search Input */}
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for games (e.g., The Witcher, GTA, Minecraft)..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (!games || games.length === 0) && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Searching games...</p>
        </div>
      )}

      {/* Search Results */}
      {games && games.length > 0 && (
        <>
          <div className="mb-6">
            <p className="text-gray-600">
              Found {games?.length || 0} game{(games?.length || 0) !== 1 ? 's' : ''} for <strong>{searchTerm}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {games?.map((game) => (
              <div key={game.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Game Image */}
                <div className="aspect-video bg-gray-200 overflow-hidden relative">
                  {game.background_image ? (
                    <Image
                      src={game.background_image}
                      alt={game.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Monitor size={48} />
                    </div>
                  )}
                </div>

                {/* Game Info */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 leading-tight">
                    {game.name}
                  </h3>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold text-gray-700">
                        {game.rating ? game.rating.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{formatDate(game.released)}</span>
                      </div>
                      
                      {game.playtime > 0 && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{game.playtime}h</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metacritic Score */}
                  {game.metacritic && (
                    <div className="flex items-center space-x-2 mb-3">
                      <Trophy className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Metacritic: {game.metacritic}
                      </span>
                    </div>
                  )}

                  {/* Platforms */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Platforms: </span>
                      {getPlatformNames(game.platforms)}
                    </p>
                  </div>

                  {/* Genres */}
                  {game.genres && game.genres.length > 0 && (
                    <div className="mb-5">
                      <div className="flex flex-wrap gap-1">
                        {game.genres.slice(0, 3).map((genre) => (
                          <span
                            key={genre.id}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add to GameShelf Button */}
                  <button 
                    onClick={() => handleAddToShelf(game)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add to GameShelf
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-8 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Load More Games'}
              </button>
            </div>
          )}
        </>
      )}

      {/* No Results */}
      {!loading && searchTerm && (!games || games.length === 0) && (
        <div className="text-center py-16">
          <Monitor className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-medium text-gray-900 mb-2">No games found</h3>
          <p className="text-gray-500 mb-4">No games found for {searchTerm}</p>
          <p className="text-gray-400">Try searching with different keywords or check your spelling</p>
        </div>
      )}

      {/* Initial State */}
      {!searchTerm && (!games || games.length === 0) && !loading && (
        <div className="text-center py-16">
          <Search className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-medium text-gray-900 mb-2">Discover Amazing Games</h3>
          <p className="text-gray-500 mb-2">Search through thousands of games from RAWG database</p>
          <p className="text-gray-400">Start typing to find your next favorite game</p>
        </div>
      )}
    </div>
  );
};

// Make sure this default export exists
export default GameSearch;