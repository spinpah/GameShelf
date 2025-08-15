// pages/_app.js
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}

// pages/index.js
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">🎮 GameShelf</div>
          <nav>
            {isLoggedIn ? (
              <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white">
          <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Track Your Gaming Journey
              </h1>
              <p className="text-xl mb-8 text-indigo-100">
                Rate, review, and discover amazing games. Connect with friends and 
                see what they're playing. Your personal gaming library awaits.
              </p>
              <button 
                onClick={handleGetStarted}
                className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
              </button>
            </div>
            
            <div className="flex justify-center">
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 flex items-center space-x-4 min-w-[250px]">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">🎮</div>
                  <div>
                    <div className="font-semibold">Epic Game</div>
                    <div className="text-yellow-300">⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">🕹️</div>
                  <div>
                    <div className="font-semibold">Adventure Quest</div>
                    <div className="text-yellow-300">⭐⭐⭐⭐</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Why GameShelf?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Track & Rate</h3>
                <p className="text-gray-600 leading-relaxed">
                  Keep track of all the games you've played and rate them to 
                  remember your favorites.
                </p>
              </div>
              
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Connect with Friends</h3>
                <p className="text-gray-600 leading-relaxed">
                  Add friends and see what they're playing and how they rate 
                  different games.
                </p>
              </div>
              
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Discover New Games</h3>
                <p className="text-gray-600 leading-relaxed">
                  Find your next favorite game based on ratings and 
                  recommendations from the community.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2025 GameShelf. Built for gamers, by gamers.</p>
        </div>
      </footer>
    </div>
  );
}

