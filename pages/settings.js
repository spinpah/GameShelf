/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../components/layout/Header';
import RateGameButton from '../components/RateGameButton';
import { auth } from '../lib/auth';


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [averageRating, setAverageRating] = useState(4.8);

  useEffect(() => {

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  
  return (
    <div className="min-h-screen justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-24">
      <Header user={user} onLogout={handleLogout} />
      <div className='justify-center'>
      <h3>{"gta v"}</h3>
      <p>Average Rating: {averageRating?.toFixed(1) || 'Not rated'}</p>
      
      <RateGameButton 
        rawgGameId={3498}
        userId={user?.id}
        onRatingSuccess={(data) => {
          setAverageRating(data.averageRating);
        }}
      />
    </div>
    </div>
  );
}