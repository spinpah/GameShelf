import { Header } from '../components/layout/Header';
import { RandomGame } from '../components/RandomGame';
import { useTranslation } from '../lib/translations';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function RandomPage() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const t = useTranslation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-24">
      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎲 {t.random}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.randomGameDescription}
          </p>
        </div>

        {/* Random Game Component */}
        <RandomGame />

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 {t.aboutRandomGames}
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              {t.randomGamesInfo}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
