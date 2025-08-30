import { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { LoadingSpinner } from './LoadingSpinner';
import { useTranslation } from '../lib/translations';

export function RandomGame() {
  const [randomGame, setRandomGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const t = useTranslation();

  const fetchRandomGame = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/games/random');
      
      if (!response.ok) {
        throw new Error('Failed to fetch random game');
      }
      
      const data = await response.json();
      setRandomGame(data.game);
    } catch (err) {
      console.error('Error fetching random game:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomGame();
  }, []);

  if (loading && !randomGame) {
    return (
      <Card className="p-12 text-center">
        <div className="text-6xl mb-4">🎲</div>
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-gray-600 dark:text-gray-400">{t.findingRandomGame}</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-12 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t.error}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error}
        </p>
        <Button onClick={fetchRandomGame} variant="outline">
          {t.tryAgain}
        </Button>
      </Card>
    );
  }

  if (!randomGame) {
    return null;
  }

  return (
    <Card className="p-8">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🎲</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t.randomGameOfTheDay}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t.randomGameDescription}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Game Image */}
        <div className="relative">
          {randomGame.coverPhoto ? (
            <img
              src={randomGame.coverPhoto}
              alt={randomGame.name}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 text-lg">
                {t.noImageAvailable}
              </span>
            </div>
          )}
          
          {/* Rating Badge */}
          {randomGame.rating && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-semibold">
              ⭐ {randomGame.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Game Details */}
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {randomGame.name}
            </h3>
            {randomGame.released && (
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t.released}: {new Date(randomGame.released).getFullYear()}
              </p>
            )}
          </div>

          {/* Description */}
          {randomGame.description && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {t.about}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {randomGame.description.length > 200
                  ? `${randomGame.description.substring(0, 200)}...`
                  : randomGame.description}
              </p>
            </div>
          )}

          {/* Genres */}
          {randomGame.genres && randomGame.genres.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {t.genres}
              </h4>
              <div className="flex flex-wrap gap-2">
                {randomGame.genres.slice(0, 5).map((genre, index) => (
                  <Badge key={index} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Platforms */}
          {randomGame.platforms && randomGame.platforms.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {t.platforms}
              </h4>
              <div className="flex flex-wrap gap-2">
                {randomGame.platforms.slice(0, 5).map((platform, index) => (
                  <Badge key={index} variant="outline">
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Metacritic Score */}
          {randomGame.metacritic && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-white">
                Metacritic:
              </span>
              <span className={`px-2 py-1 rounded text-sm font-semibold ${
                randomGame.metacritic >= 75 ? 'bg-green-100 text-green-800' :
                randomGame.metacritic >= 50 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {randomGame.metacritic}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={fetchRandomGame}
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t.findingRandomGame}
                </>
              ) : (
                <>
                  🎲 {t.getNewRandomGame}
                </>
              )}
            </Button>
            
            {randomGame.rawgUrl && (
              <Button
                variant="outline"
                onClick={() => window.open(randomGame.rawgUrl, '_blank')}
                className="flex-1"
              >
                🌐 {t.viewOnRawg}
              </Button>
            )}
          </div>

          {/* Note about rating */}
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 {t.randomGameNote}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
