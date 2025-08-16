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
    <Card className="overflow-hidden group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Game Cover */}
      <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative">
        {game.background_image || game.coverPhoto ? (
          <img
            src={game.background_image || game.coverPhoto}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400 dark:text-gray-500">
          🎮
        </div>
        
        {/* Overlay with rating */}
        <div className="absolute top-3 right-3">
          <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <span className="text-yellow-400">⭐</span>
            <span>{game.rating || game.averageRating || 'N/A'}</span>
          </div>
        </div>

        {/* Genre badges */}
        {game.genres && game.genres.length > 0 && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-indigo-600/90 backdrop-blur-sm text-white border-0">
              {game.genres[0].name}
            </Badge>
          </div>
        )}
      </div>

      {/* Game Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 text-lg">
            {game.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {game.description || 'No description available.'}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          {/* Additional info */}
          <div className="flex items-center space-x-3">
            {game.metacritic && (
              <Badge variant={getRatingColor(game.metacritic / 20)} className="text-xs">
                {game.metacritic}
              </Badge>
            )}
            {game.released && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(game.released).getFullYear()}
              </span>
            )}
          </div>

          {/* Rate Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRate(game)}
            className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
          >
            Rate
          </Button>
        </div>
      </div>
    </Card>
  );
}
