/* eslint-disable @next/next/no-img-element */

import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export function GameCard({ game, onRate, loggedin = false }) {
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 3.5) return 'warning';
    return 'default';
  };


  

  return (
    <div className="cursor-pointer group">
      {/* Game Image - Rectangle with sharp corners */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={game.background_image || game.coverPhoto}
          alt={game.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400 dark:text-gray-500">
          🎮
        </div>

        {/* Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300"></div>

        

        {/* Content Overlay - Visible on Hover */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          {/* Top Section */}
          <div className="space-y-2">
            
            {/* Rating and Metacritic */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400 text-sm">⭐</span>
                <span className="text-sm font-medium text-white">
                  {(game.rating || game.averageRating || 0).toString().slice(0, 3)}
                </span>
              </div>
              {game.metacritic && (
                <Badge variant={getRatingColor(game.metacritic / 20)} className="text-xs px-2 py-1">
                  {game.metacritic}
                </Badge>
              )}
            </div>
          </div>

         

          {/* Bottom Section */}
          <div className="space-y-3">
            {/* Genres */}
            {game.genres && game.genres.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {game.genres.slice(0, 2).map((genre) => (
                  <Badge key={genre.id || genre.name} variant="outline" className="text-xs px-2 py-1 bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Platforms */}
            {game.platforms && game.platforms.length > 0 && (
              <div className=" space-x-1">
                {game.platforms.slice(0, 5).map((platform) => (
                  <span 
                    key={platform.platform?.id || platform.id} 
                    className="text-sm text-white"
                    title={platform.platform?.name || platform.name}
                  >
                     {platform.platform?.name || platform.name} - 
                  </span>
                ))}
              </div>
            )}

            {/* Stats Row */}
            <div className="flex justify-between text-xs text-gray-300">
              
              {game.ratings_count && (
                <span>
                  {game.ratings_count > 1000 ? `${Math.round(game.ratings_count / 1000)}k` : game.ratings_count} reviews
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                className="flex-1 text-xs py-2"
                onClick={(e) => e.stopPropagation()}
              >
                Details
              </Button>
              {loggedin && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs py-2 px-3 bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRate(game);
                  }}
                >
                  ⭐ Rate
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Game Name Below Image */}
      <div className="mt-2">
        <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 leading-tight">
          {game.id}
        </h3>
      </div>
    </div>
  );
}