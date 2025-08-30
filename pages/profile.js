/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../components/layout/Header';
import { auth } from '../lib/auth';
import { useTranslation } from '../lib/translations';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const t = useTranslation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      fetchUserReviews(userObj.id);
    } else {
      router.push('/login');
    }
  }, [router]);

  const fetchUserReviews = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-24">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-6">
            <img
              src={user.avatar || '/images/pfp.jpg'}
              alt={user.username}
              className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.username}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {user.email}
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                {t.memberSince} {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {reviews.length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{t.reviews}</p>
          </Card>
          <Card className="p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {reviews.length > 0 ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1) : '0'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{t.averageRatingGiven}</p>
          </Card>
          <Card className="p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {new Date().getFullYear() - new Date(user.createdAt).getFullYear()}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{t.yearsActive}</p>
          </Card>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t.myReviews}
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">{t.loading}</p>
            </div>
          ) : reviews.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {t.noReviewsYet}
              </p>
              <button
                onClick={() => router.push('/games')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t.startReviewingGames}
              </button>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {review.game.name}
                        </h3>
                        <Badge variant="secondary">
                          {review.rating}/5
                        </Badge>
                      </div>
                      {review.review && (
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          {review.review}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {t.reviewedOn} {formatDate(review.createdAt)}
                      </p>
                    </div>
                                         <button
                       onClick={() => router.push(`/games/${review.game.rawgId || review.game.id}`)}
                       className="px-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                     >
                       {t.viewGame}
                     </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
