import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GameCard } from '@/components/GameCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';

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
      // Add sample games for demo purposes
      if (page === 1) {
        setGames(getSampleGames());
      }
    } finally {
      setLoading(false);
    }
  };

  const getSampleGames = () => {
    return [
      {
        id: 1,
        name: 'Cyberpunk 2077',
        background_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop&crop=center',
        rating: 4.8,
        description: 'An open-world action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.',
        genres: [{ name: 'RPG' }],
        platforms: [{ platform: { name: 'PC' } }, { platform: { name: 'PS5' } }],
        released: '2020-12-10',
        metacritic: 87
      },
      {
        id: 2,
        name: 'The Witcher 3: Wild Hunt',
        background_image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=600&fit=crop&crop=center',
        rating: 4.9,
        description: 'A story-driven open world RPG set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.',
        genres: [{ name: 'Action RPG' }],
        platforms: [{ platform: { name: 'PC' } }, { platform: { name: 'Switch' } }],
        released: '2015-05-19',
        metacritic: 93
      },
      {
        id: 3,
        name: 'Red Dead Redemption 2',
        background_image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop&crop=center',
        rating: 4.7,
        description: 'An epic tale of life in America at the dawn of the modern age.',
        genres: [{ name: 'Western' }],
        platforms: [{ platform: { name: 'PS4' } }, { platform: { name: 'Xbox' } }],
        released: '2018-10-26',
        metacritic: 97
      },
      {
        id: 4,
        name: 'God of War',
        background_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop&crop=center',
        rating: 4.9,
        description: 'A new beginning for Kratos. Living as a man outside the shadow of the gods, he ventures into the brutal Norse wilds.',
        genres: [{ name: 'Action' }],
        platforms: [{ platform: { name: 'PS4' } }, { platform: { name: 'PS5' } }],
        released: '2018-04-20',
        metacritic: 94
      },
      {
        id: 5,
        name: 'Elden Ring',
        background_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop&crop=center',
        rating: 4.8,
        description: 'An action RPG set in a vast, dark fantasy world where players must become the Elden Lord.',
        genres: [{ name: 'Action RPG' }],
        platforms: [{ platform: { name: 'PC' } }, { platform: { name: 'PS5' } }],
        released: '2022-02-25',
        metacritic: 96
      },
      {
        id: 6,
        name: 'The Last of Us Part II',
        background_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&crop=center',
        rating: 4.6,
        description: 'Set five years after the events of the first game, Ellie embarks on a journey of revenge.',
        genres: [{ name: 'Action' }],
        platforms: [{ platform: { name: 'PS4' } }, { platform: { name: 'PS5' } }],
        released: '2020-06-19',
        metacritic: 93
      }
    ];
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
      // Add sample genres for demo
      setGenres([
        { id: 1, name: 'Action' },
        { id: 2, name: 'RPG' },
        { id: 3, name: 'Adventure' },
        { id: 4, name: 'Strategy' },
        { id: 5, name: 'Sports' },
        { id: 6, name: 'Racing' },
        { id: 7, name: 'Puzzle' },
        { id: 8, name: 'Horror' }
      ]);
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
      // Filter sample games for demo
      const filteredGames = getSampleGames().filter(game => 
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setGames(filteredGames);
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
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.username}! 🎮
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover your next favorite game from thousands of options
            </p>
          </div>
        </div>
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
          { label: 'Games Rated', value: '12', color: 'text-blue-600 dark:text-blue-400', icon: '⭐', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&crop=center' },
          { label: 'Friends', value: '8', color: 'text-green-600 dark:text-green-400', icon: '👥', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop&crop=center' },
          { label: 'Reviews Written', value: '5', color: 'text-purple-600 dark:text-purple-400', icon: '✍️', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop&crop=center' },
          { label: 'Games Discovered', value: games.length, color: 'text-indigo-600 dark:text-indigo-400', icon: '🎮', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center' }
        ].map((stat, index) => (
          <Card key={index} className="p-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <div className="relative h-20 mb-4 rounded-lg overflow-hidden">
              <Image
                src={stat.image}
                alt={stat.label}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
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

// Add getServerSideProps to prevent static generation issues
export async function getServerSideProps(context) {
  return {
    props: {}, // Will be passed to the page component as props
  }
}