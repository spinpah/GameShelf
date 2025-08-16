import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Hero Section */}
      <main className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-600/20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400/20 to-indigo-600/20 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Track Your
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Gaming Journey</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                  Discover, rate, and review thousands of games. Connect with friends and 
                  build your personal gaming library with our modern, intuitive platform.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-4">
                  {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Learn More
                </Button>
              </div>
            </div>

            {/* Visual Demo */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 transform rotate-3">
                {[
                  { emoji: '🎮', title: 'Epic Adventure', rating: '4.8', genre: 'RPG' },
                  { emoji: '🕹️', title: 'Space Shooter', rating: '4.5', genre: 'Action' },
                  { emoji: '🏆', title: 'Championship', rating: '4.9', genre: 'Sports' },
                  { emoji: '🎯', title: 'Puzzle Master', rating: '4.3', genre: 'Puzzle' }
                ].map((game, index) => (
                  <Card key={index} className="p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 transform hover:scale-105 transition-all duration-300">
                    <div className="text-3xl mb-2">{game.emoji}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{game.title}</h3>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-yellow-500">⭐ {game.rating}</span>
                      <span className="text-gray-500 dark:text-gray-400">{game.genre}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="relative py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose GameShelf?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Everything you need to manage and discover your perfect gaming experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '📊',
                  title: 'Smart Analytics',
                  description: 'Track your gaming habits with detailed statistics and personalized insights.'
                },
                {
                  icon: '🌐',
                  title: 'Vast Game Library',
                  description: 'Access thousands of games from our comprehensive database with real-time updates.'
                },
                {
                  icon: '👥',
                  title: 'Social Features',
                  description: 'Connect with friends, share reviews, and discover games through your network.'
                }
              ].map((feature, index) => (
                <Card key={index} className="p-8 text-center hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
                  <div className="text-5xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="text-2xl">🎮</div>
            <span className="text-xl font-bold">GameShelf</span>
          </div>
          <p className="text-gray-400">
            &copy; 2025 GameShelf. Built with ❤️ for gamers, by gamers.
          </p>
        </div>
      </footer>
    </div>
  );
}