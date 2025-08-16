import Image from 'next/image';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export function GameCard({ game, onRate }) {
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 3.5) return 'warning';
    return 'default';
  };

  // Fallback image if no game image is provided
  const getGameImage = (game) => {
    if (game.background_image || game.coverPhoto) {
      return game.background_image || game.coverPhoto;
    }
    
    // Return a placeholder gaming image based on genre or default
    const genre = game.genres?.[0]?.name?.toLowerCase() || 'default';
    const placeholderImages = {
      'action': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop&crop=center',
      'rpg': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=600&fit=crop&crop=center',
      'adventure': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop&crop=center',
      'strategy': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop&crop=center',
      'sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&crop=center',
      'default': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop&crop=center'
    };
    
    return placeholderImages[genre] || placeholderImages.default;
  };

  return (
    <Card className="overflow-hidden group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Game Cover */}
      <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative">
        <Image
          src={getGameImage(game)}
          alt={game.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
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

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRate(game)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-gray-900 hover:bg-white"
          >
            Rate Game
          </Button>
        </div>
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

          {/* Platform badges */}
          {game.platforms && game.platforms.length > 0 && (
            <div className="flex space-x-1">
              {game.platforms.slice(0, 2).map((platform, index) => (
                <Badge key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {platform.platform.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
