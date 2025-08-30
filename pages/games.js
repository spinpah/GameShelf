/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../components/layout/Header';
import { GameCard } from '../components/GameCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Badge } from '../components/ui/Badge';
import { useTheme } from '../components/ThemeProvider';
import { searchGames, searchGamesWithFilters } from './api/games/Search';
import { useTranslation } from '../lib/translations'; 

// Simple GameGrid Component
function GameGrid({ games, onRate, loggedin = false, userId }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
      {games.map((game, index) => (
        <GameCard
          key={game.id || index}
          game={game}
          onRate={onRate}
          loggedin={loggedin}
          userId={userId}
        />
      ))}
    </div>
  );
}

// Filter Dropdown Component
function FilterDropdown({ label, value, onChange, options, placeholder }) {
  return (
    <div className="relative">
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2 pr-8 
               bg-white dark:bg-gray-700 
               border border-gray-300 dark:border-gray-600 
               rounded-md shadow-sm 
               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
               text-sm text-gray-900 dark:text-white 
               appearance-none"
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
  {/* custom arrow */}
  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
    <svg
      className="h-4 w-4 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [activeTab, setActiveTab] = useState('popular');
  const [genres, setGenres] = useState([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    year: '',
    rating: '',
    platform: ''
  });
  
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const t = useTranslation();

  // Filter options
  const yearOptions = [
    { value: '2020s', label: '2020s' },
    { value: '2010s', label: '2010s' },
    { value: '2000s', label: '2000s' },
    { value: '1990s', label: '1990s' },
    { value: '1980s', label: '1980s' },
    { value: '1970s', label: '1970s' }
  ];

  const ratingOptions = [
    { value: '5', label: '5 Stars' },
    { value: '4.5', label: '4.5+ Stars' },
    { value: '4', label: '4+ Stars' },
    { value: '3.5', label: '3.5+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '2.5', label: '2.5+ Stars' },
    { value: '2', label: '2+ Stars' },
    { value: '1.5', label: '1.5+ Stars' },
    { value: '1', label: '1+ Stars' },
    { value: '0.5', label: '0.5+ Stars' }
  ];

  const platformOptions = [
    { value: 'pc', label: 'PC' },
    { value: 'playstation', label: 'PlayStation' },
    { value: 'xbox', label: 'Xbox' },
    { value: 'nintendo', label: 'Nintendo' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'steam', label: 'Steam' },
    { value: 'epic', label: 'Epic Games' }
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }

    fetchPopularGames();
    fetchGenres();
  }, [router]);

  // Apply filters when they change
  useEffect(() => {
    const applyCurrentFilters = async () => {
      if (Object.values(filters).some(filter => filter !== '')) {
        setSearchLoading(true);
        setActiveTab('search');
        
        try {
          const filteredResults = await searchGamesWithFilters(filters);
          setGames(filteredResults);
        } catch (error) {
          console.error('Error applying filters:', error);
          setGames([]);
        } finally {
          setSearchLoading(false);
        }
      }
    };

    applyCurrentFilters();
  }, [filters]);

  const fetchPopularGames = async (page = 1) => {
    try {
      setLoading(page === 1);
      const response = await fetch(`/api/games/popular?page=${page}`, {});
      
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
      const response = await fetch('/api/games/genres', {});
      
      if (response.ok) {
        const data = await response.json();
        setGenres(data.genres.slice(0, 15)); // Show top 15 genres
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
      // Apply both search query and active filters
      const searchResults = await searchGames(searchQuery.trim(), filters);
      setGames(searchResults);
    } catch (error) {
      console.error('Error searching games:', error);
      setGames([]); // Set empty array on error
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (activeTab === 'popular') {
      fetchPopularGames(currentPage + 1);
    }
  };

  const handleRateGame = (game, result) => {
    // Update the game's rating in the local state
    setGames(prevGames => 
      prevGames.map(g => 
        g.id === game.id 
          ? { ...g, rating: result.averageRating }
          : g
      )
    );
    console.log('Game rated:', game.name, 'New average rating:', result.averageRating);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'popular') {
      fetchPopularGames();
    }
  };

  const handleGenreClick = (genreName) => {
    setSearchQuery(genreName);
    // Automatically search for the genre with current filters
    setActiveTab('search');
    setSearchLoading(true);
    
    searchGames(genreName, filters)
      .then(results => {
        setGames(results);
      })
      .catch(error => {
        console.error('Error searching by genre:', error);
        setGames([]);
      })
      .finally(() => {
        setSearchLoading(false);
      });
  };

  // Handle filter changes
  const handleFilterChange = async (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    
    setFilters(newFilters);
    
    // Apply filters immediately
    if (value || Object.values(newFilters).some(filter => filter !== '')) {
      setSearchLoading(true);
      setActiveTab('search');
      
      try {
        const filteredResults = await searchGamesWithFilters(newFilters);
        setGames(filteredResults);
      } catch (error) {
        console.error('Error applying filters:', error);
        setGames([]);
      } finally {
        setSearchLoading(false);
      }
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      year: '',
      rating: '',
      platform: ''
    });
    
    // Reset to default view (popular games)
    setActiveTab('popular');
    setSearchQuery('');
    fetchPopularGames();
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-24">
      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Browse By Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end gap-3">
            {/* Browse By Title */}
            <div className="lg:w-1/4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white ">
                {t.browseBy}
              </h2>
            </div>

            {/* Filter Dropdowns */}
            <div className="lg:flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                <FilterDropdown
                  
                  value={filters.year}
                  onChange={(value) => handleFilterChange('year', value)}
                  options={yearOptions}
                  placeholder={t.selectDecade}
                />
                
                <FilterDropdown
                  
                  value={filters.rating}
                  onChange={(value) => handleFilterChange('rating', value)}
                  options={ratingOptions}
                  placeholder={t.minimumRating}
                />
                
                <FilterDropdown
                 
                  value={filters.platform}
                  onChange={(value) => handleFilterChange('platform', value)}
                  options={platformOptions}
                  placeholder={t.selectPlatform}
                />
              </div>

              
            </div>

            {/* Search Bar */}
            <div className="lg:w-1/3 ">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={searchLoading || !searchQuery.trim()}
                  size="md"
                >
                  {searchLoading ? <LoadingSpinner size="sm" /> : t.search}
                </Button>
              </form>
            </div>
          </div>
        </div>
        
              {/* Popular Genres */}
        {genres.length > 0 && (
          <div className='mb-8'>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t.popularGenres}
            </h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge
                  key={genre.id}
                  className="cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:scale-105 transition-all duration-200"
                  onClick={() => handleGenreClick(genre.name)}
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Random Game Discovery */}
        <div className='mb-8'>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              🎲 {t.discoverRandomGame}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/random')}
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {t.viewAllRandom}
            </Button>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-100 dark:border-indigo-800">
            <div className="text-center">
              <div className="text-4xl mb-3">🎮</div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t.randomGameTitle}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                {t.randomGameSubtitle}
              </p>
              <Button
                onClick={() => router.push('/random')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                🎲 {t.getRandomGame}
              </Button>
            </div>
          </div>
        </div>



        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-200 dark:bg-gray-700 rounded-lg">
          {[
            { id: 'popular', label: t.allGames },
            { id: 'search', label: t.searchResults }
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

        
        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.activeFilters}
              </h4>
              {searchLoading && (
                <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400">
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t.filterResults}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.year && (
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {t.year}: {filters.year}
                </Badge>
              )}
              {filters.rating && (
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {t.rating}: {filters.rating}+ Stars
                </Badge>
              )}
              {filters.platform && (
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {t.platform}: {platformOptions.find(p => p.value === filters.platform)?.label}
                </Badge>
              )}

              <Button
                onClick={clearFilters}
                variant="secondary"
                size="sm"
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                {t.clearFilters}
              </Button>
            </div>
          </div>
        )}
        

        {/* Loading State */}
        {(loading || searchLoading) ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {searchLoading ? t.filterResults : t.loadingAmazingGames}
              </p>
            </div>
          </div>
        ) : !games || games.length === 0 ? (
          /* No Games Found */
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {hasActiveFilters ? t.noFilterResults : t.noGamesFound}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {hasActiveFilters 
                ? t.tryAdjustingFilters
                : activeTab === 'search' 
                  ? t.trySearchingElse 
                  : t.unableToLoadGames}
            </p>
            {(activeTab === 'search' || hasActiveFilters) && (
              <Button 
                onClick={() => handleTabChange('popular')}
                variant="outline"
                className="mt-4"
              >
                {t.viewPopularGames}
              </Button>
            )}
          </Card>
        ) : (
          /* Games Grid */
          <>
            <GameGrid
              games={games}
              onRate={handleRateGame}
              loggedin={isLoggedIn}
              userId={user?.id}
            />

            {/* Load More Button */}
            {hasNextPage && activeTab === 'popular' && (
              <div className="text-center">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  size="lg"
                  disabled={loading}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  {loading ? <LoadingSpinner size="sm" /> : t.loadMoreGames}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}