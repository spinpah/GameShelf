/* eslint-disable @next/next/no-img-element */
import { useTheme } from '../ThemeProvider';
import { Button } from '../ui/Button';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export function Header({ user, onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="absolute top-0 left-0 w-full z-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between max-w-4xl mx-auto items-center">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <Image
              src="/images/logo-vertical-dark.png"
              alt="Logo"
              width={250}
              height={250}
              className="w-full max-w-[300px] h-auto"
            />
          </div>
          
          {/* Desktop Navigation */}
          <div className="flex justify-between space-x-6 items-center">

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </Button>

            <p
              className="text-lg font-regular text-gray-900 cursor-pointer dark:text-white"
              onClick={() => router.push('/games')}
            >
              RANDOM
            </p>
            <p
              className="text-lg font-regular text-gray-900 cursor-pointer dark:text-white"
              onClick={() => router.push('/games')}
            >
              GAMES
            </p>

            {user ? (
              <div className="relative group">
                {/* Avatar + Username */}
                <div className="flex items-center cursor-pointer space-x-2">
                  <img
                    src={user.avatar ? user.avatar : '/images/pfp.jpg'}
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.username}
                  </p>
                </div>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 invisible group-hover:visible">
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:rounded-lg"
                    onClick={() => router.push('/settings')}
                  >
                    Settings
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-700 dark:hover:rounded-lg"
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Button onClick={() => router.push('/login')}>Login</Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </Button>
              {user && (
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
