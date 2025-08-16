import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GameCard } from '@/components/GameCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [activeTab, setActiveTab] = useState('popular');
  const [genres, setGenres] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchPopularGames();
    fetchGenres();
  }, [router]);

  const fetchPopularGames = async (page = 1) => {
    try {
      setLoading(page === 1);
      const response = await fetch(`/api/games/popular?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (page === 1) {
          setGames(data.games);
        } else {
          setGames(prev => [...prev, ...data.games]);
        }
        setHasNextPage(data.hasNext);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching popular games:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch('/api/games/genres', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGenres(data.genres.slice(0, 10)); // Show top 10 genres
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setActiveTab('search');
    
    try {
      const response = await fetch(`/api/games/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGames(data.games);
        setHasNextPage(data.hasNext);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error searching games:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (activeTab === 'popular') {
      fetchPopularGames(currentPage + 1);
    }
  };

  const handleRateGame = (game) => {
    // TODO: Implement rating functionality
    console.log('Rate game:', game);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'popular') {
      fetchPopularGames();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.username}! 🎮
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover your next favorite game from thousands of options
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-6 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search for games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-lg"
            />
          </div>
          <Button 
            type="submit" 
            disabled={searchLoading || !searchQuery.trim()}
            size="lg"
          >
            {searchLoading ? <LoadingSpinner size="sm" /> : 'Search'}
          </Button>
        </form>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Games Rated', value: '0', color: 'text-blue-600 dark:text-blue-400', icon: '⭐' },
          { label: 'Friends', value: '0', color: 'text-green-600 dark:text-green-400', icon: '👥' },
          { label: 'Reviews Written', value: '0', color: 'text-purple-600 dark:text-purple-400', icon: '✍️' },
          { label: 'Games Discovered', value: games.length, color: 'text-indigo-600 dark:text-indigo-400', icon: '🎮' }
        ].map((stat, index) => (
          <Card key={index} className="p-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`text-3xl font-bold ${stat.color} mb-2`}>
              {stat.value}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              {stat.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
        {[
          { id: 'popular', label: 'Popular Games' },
          { id: 'search', label: 'Search Results' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading amazing games...</p>
          </div>
        </div>
      ) : games.length === 0 ? (
        <Card className="p-12 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No games found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {activeTab === 'search' 
              ? 'Try searching for something else' 
              : 'Unable to load games at the moment'}
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onRate={handleRateGame}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasNextPage && activeTab === 'popular' && (
            <div className="text-center">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                size="lg"
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Load More Games'}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Popular Genres */}
      {genres.length > 0 && (
        <Card className="p-6 mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Popular Genres
          </h3>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Badge
                key={genre.id}
                className="cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
              >
                {genre.name}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}