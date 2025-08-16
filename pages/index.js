import Link from 'next/link';
import Image from 'next/image';
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

  // Sample featured games with images
  const featuredGames = [
    {
      id: 1,
      name: 'Cyberpunk 2077',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop&crop=center',
      rating: 4.8,
      genre: 'RPG'
    },
    {
      id: 2,
      name: 'The Witcher 3',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=600&fit=crop&crop=center',
      rating: 4.9,
      genre: 'Action RPG'
    },
    {
      id: 3,
      name: 'Red Dead Redemption 2',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop&crop=center',
      rating: 4.7,
      genre: 'Western'
    },
    {
      id: 4,
      name: 'God of War',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop&crop=center',
      rating: 4.9,
      genre: 'Action'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Hero Section */}
      <main className="relative">
        {/* Hero Background */}
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop&crop=center"
              alt="Gaming background"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-8 text-white">
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                    Track Your
                    <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> Gaming Journey</span>
                  </h1>
                  <p className="text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto">
                    Discover, rate, and review thousands of games. Connect with friends and 
                    build your personal gaming library with our modern, intuitive platform.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-4 bg-indigo-600 hover:bg-indigo-700">
                    {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900">
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Featured Games Grid */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4 transform rotate-3">
                  {featuredGames.map((game, index) => (
                    <Card key={game.id} className="p-4 backdrop-blur-sm bg-white/10 border-white/20 transform hover:scale-105 transition-all duration-300 overflow-hidden">
                      <div className="relative aspect-[3/4] mb-3 rounded-lg overflow-hidden">
                        <Image
                          src={game.image}
                          alt={game.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-white text-sm mb-1">{game.name}</h3>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-yellow-400">⭐ {game.rating}</span>
                        <span className="text-gray-300">{game.genre}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <div className="animate-bounce">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="relative py-20 bg-white dark:bg-gray-800">
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
                  description: 'Track your gaming habits with detailed statistics and personalized insights.',
                  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center'
                },
                {
                  icon: '🌐',
                  title: 'Vast Game Library',
                  description: 'Access thousands of games from our comprehensive database with real-time updates.',
                  image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&crop=center'
                },
                {
                  icon: '👥',
                  title: 'Social Features',
                  description: 'Connect with friends, share reviews, and discover games through your network.',
                  image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop&crop=center'
                }
              ].map((feature, index) => (
                <Card key={index} className="p-8 text-center hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 overflow-hidden group">
                  <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
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

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '10K+', label: 'Games Available', icon: '🎮' },
                { number: '50K+', label: 'Active Users', icon: '👥' },
                { number: '1M+', label: 'Reviews Posted', icon: '⭐' },
                { number: '99%', label: 'Uptime', icon: '🚀' }
              ].map((stat, index) => (
                <div key={index} className="text-white">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-indigo-100">{stat.label}</div>
                </div>
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

// Add getServerSideProps to prevent static generation issues
export async function getServerSideProps(context) {
  return {
    props: {}, // Will be passed to the page component as props
  }
}