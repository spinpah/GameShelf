import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useTheme } from '../../components/ThemeProvider';
import { useTranslation } from '../../lib/translations';
import { RatingModal } from '../../components/RatingModal';

export default function GameDetails() {
  const [game, setGame] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  
  const router = useRouter();
  const { id } = router.query;
  const { theme } = useTheme();
  const t = useTranslation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchGameDetails();
      fetchGameReviews();
    }
  }, [id]);

  const fetchGameDetails = async () => {
    try {
      setLoading(true);
      const headers = {};
      if (user?.id) {
        headers['user-id'] = user.id;
      }
      
      const response = await fetch(`/api/games/${id}`, { headers });
      
      if (response.ok) {
        const data = await response.json();
        setGame(data.game);
        
        // Check if user has already rated this game
        if (isLoggedIn && data.userRating) {
          setUserRating(data.userRating);
        }
      } else {
        console.error('Failed to fetch game details');
        router.push('/games');
      }
    } catch (error) {
      console.error('Error fetching game details:', error);
      router.push('/games');
    } finally {
      setLoading(false);
    }
  };

  const fetchGameReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await fetch(`/api/games/${id}/reviews`);
      
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleRateGame = (result) => {
    setGame(prev => ({
      ...prev,
      averageRating: result.averageRating
    }));
    setUserRating(result.userRating);
    fetchGameReviews(); // Refresh reviews after rating
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 3.5) return 'warning';
    return 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-24">
        <Header user={user} onLogout={handleLogout} />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-600 dark:text-gray-400">{t.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-24">
        <Header user={user} onLogout={handleLogout} />
        <div className="flex justify-center items-center py-20">
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t.gameNotFound}
            </h3>
            <Button onClick={() => router.push('/games')} className="mt-4">
              {t.backToGames}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-24">
      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.push('/games')}
          className="mb-6"
        >
          ← {t.backToGames}
        </Button>

        {/* Game Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Game Image */}
          <div className="lg:col-span-1">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-lg">
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
            </div>
          </div>

          {/* Game Info */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {game.name}
                </h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">⭐</span>
                    <span className="text-xl font-semibold text-gray-900 dark:text-white">
                      {game.averageRating ? game.averageRating.toFixed(1) : game.rating?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                  {game.metacritic && (
                    <Badge variant={getRatingColor(game.metacritic / 20)} className="text-sm px-3 py-1">
                      Metacritic: {game.metacritic}
                    </Badge>
                  )}
                  {game.ratings_count && (
                    <span className="text-gray-600 dark:text-gray-400">
                      ({game.ratings_count > 1000 ? `${Math.round(game.ratings_count / 1000)}k` : game.ratings_count} {t.reviews})
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {isLoggedIn && (
                  <Button
                    onClick={() => setShowRatingModal(true)}
                    className="flex items-center space-x-2"
                  >
                    <span>⭐</span>
                    <span>{userRating ? t.updateRating : t.rateGame}</span>
                  </Button>
                )}
                {!isLoggedIn && (
                  <Button onClick={() => router.push('/login')}>
                    {t.loginToRate}
                  </Button>
                )}
              </div>

              {/* Genres */}
              {game.genres && game.genres.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {t.genres}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {game.genres.map((genre) => (
                      <Badge key={genre.id} variant="outline">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Platforms */}
              {game.platforms && game.platforms.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {t.platforms}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {game.platforms.map((platform) => (
                      <Badge key={platform.platform?.id || platform.id} variant="secondary">
                        {platform.platform?.name || platform.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Game Description */}
        {game.description && (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t.about}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {game.description}
            </p>
          </Card>
        )}

        {/* Reviews Section */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.reviews} ({reviews.length})
            </h2>
            {isLoggedIn && (
              <Button
                variant="outline"
                onClick={() => setShowRatingModal(true)}
              >
                {userRating ? t.updateReview : t.writeReview}
              </Button>
            )}
          </div>

          {loadingReviews ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t.noReviewsYet}
              </p>
              {isLoggedIn && (
                <Button onClick={() => setShowRatingModal(true)}>
                  {t.beFirstToReview}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {review.user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {review.user.username}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {review.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  {review.review && (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {review.review}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Rating Modal */}
        <RatingModal
          game={game}
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          onRatingSubmit={handleRateGame}
          userId={user?.id}
        />
      </main>
    </div>
  );
}
