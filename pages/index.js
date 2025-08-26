/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [user , setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const hoverSound = typeof Audio !== "undefined" ? new Audio("/sounds/hover.mp3") : null;

  const playHoverSound = () => {
       if (hoverSound) {
        hoverSound.currentTime = 0; 
        hoverSound.volume = 0.2;
        hoverSound.play();
      }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      setIsLoggedIn(true);
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const handleLearnMore = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <Header user={user} onLogout={handleLogout} />

      {/* Hero Section */}
      <main className="relative">
        {/* Background decoration */}

        <div className="relative  px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-900">
          <div className="absolute inset-0 bg-noise opacity-15 pointer-events-none" />
          <div className="grid max-w-7xl mx-auto justify-center gap-12 items-center">
            {/* Content */}
            
              <div className="space-y-4">
                <h1 className="text-5xl mt-16 lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Track Your
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Gaming Journey</span>
                </h1>
                <p className="text-xl text-center text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                  Discover, rate, and review thousands of games. Connect with friends and 
                  build your personal gaming library with our modern, intuitive platform.
                </p>
              </div>
              
              
           

            {/* Visual Demo */}
            {/* Full-width Cards (bleed out of the centered container) */}
            <div className="relative left-1/2 right-1/2 -ml-[45vw] -mr-[45vw] w-[90vw] mt-8">
                 {/* re-add page padding so cards don't touch edges */}
                  <div className="px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-4 gap-4 animate-tilt">
                      {[
                          { emoji: 'LoL', title: 'League of legends', rating: '4.8', genre: 'Moba' },
                          { emoji: 'gtav', title: 'Grand Theft Auto V', rating: '4.5', genre: 'Open World' },
                          { emoji: 'valorant', title: 'Valorant', rating: '4.9', genre: 'FPS' },
                          { emoji: 'cs2', title: 'Counter Strike 2', rating: '4.3', genre: 'FPS' },
                          { emoji: 'ow2', title: 'Overwatch 2', rating: '4.8', genre: 'FPS' },
                          { emoji: 'fortnite', title: 'Fortnite', rating: '4.5', genre: 'Battle Royale' },
                          { emoji: 'rl', title: 'Rocket League', rating: '4.9', genre: 'Sports' },
                          { emoji: 'tft', title: 'TFT', rating: '4.3', genre: 'Strategy' }
                        ].map((game, index) => (
                          <Card
                            key={index}
                            className="p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 transform hover:scale-105 transition-all duration-300"
                            onMouseEnter={playHoverSound}
                          >
                            <div className="text-3xl mb-2"><Image src={`/images/${game.emoji}.png`} alt={game.title} width={100} height={100} className="w-10 h-10 object-cover rounded-md" /></div>
                            <h3 className="font-regular text-gray-900 dark:text-white text-sm mb-1">
                              {game.title}
                            </h3>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-yellow-500">⭐ {game.rating}</span>
                              <span className="text-gray-500 dark:text-gray-400">{game.genre}</span>
                            </div>
                          </Card>
                        ))}
                      </div>
                  </div>
                </div>

            <div className="justify-center flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-4">
                  {isLoggedIn ? 'Find Games' : 'Get Started'}
                </Button>
                <Button variant="outline" size="lg" onClick={handleLearnMore} className="text-lg px-8 py-4">
                  Learn More
                </Button>
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
                <Card key={index} className="p-8 text-center hover:shadow-2xl transition-all duration-200 bg-white dark:bg-gray-800">
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

      {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 text-center max-w-lg mx-4  relative">
              
                <Image 
                    src={theme === 'light' ? "/images/logo-vertical.png" : "/images/logo-vertical-dark.png"}
                    alt="Logo" 
                    width={150}  
                    height={150} 
                    className='justify-center mb-4'
                />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to GameShelf
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                This project is part of my <span className="font-semibold">portfolio</span>.  
                It’s designed for gamers to <span className="text-indigo-600 font-semibold">discover</span>,  
                <span className="text-purple-600 font-semibold"> rate</span>, and  
                <span className="text-pink-600 font-semibold"> review</span> their favorite games.  
                Think of it as your personal gaming shelf — where every title you’ve played  
                or plan to play has a place. 🚀
              </p>
              <Button onClick={handleCloseModal} className="mt-4 px-6 py-3 text-lg">
                Close
              </Button>
            </div>
          </div>
          )}

      {/* Footer */}
      <footer className="relative bg-blue-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image 
            src={theme === 'light' ? "/images/logo-vertical.png" : "/images/logo-vertical-dark.png"} 
            alt="Logo" 
            width={250} 
            height={250} 
            className="w-full max-w-[300px] h-auto"
        />
          </div>
          <p className="text-gray-400">
            &copy; 2025 GameShelf. Built with ❤️ for gamers, by gamers.
          </p>
        </div>
      </footer>
    </div>
  );
}