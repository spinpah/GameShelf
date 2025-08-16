import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export function GameCard({ game, onRate }) {
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 3.5) return 'warning';
    return 'default';
  };

  return (
    <Card hover className="overflow-hidden group">
      {/* Game Cover */}
      <div className="aspect-[3/4] overflow-hidden bg-gray-200 dark:bg-gray-700">
        {game.background_image || game.coverPhoto ? (
          <img
            src={game.background_image || game.coverPhoto}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400 dark:text-gray-500">
          🎮
        </div>
      </div>

      {/* Game Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
            {game.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {game.description || 'No description available.'}
          </p>
        </div>

        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {game.rating || game.averageRating || 'N/A'}
              </span>
            </div>
            {game.metacritic && (
              <Badge variant={getRatingColor(game.metacritic / 20)}>
                {game.metacritic}
              </Badge>
            )}
          </div>

          {/* Rate Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRate(game)}
            className="text-indigo-600 dark:text-indigo-400"
          >
            Rate
          </Button>
        </div>
      </div>
    </Card>
  );
}
