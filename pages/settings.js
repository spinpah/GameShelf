/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '@/components/layout/Header';


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-24">
      <Header user={user} onLogout={handleLogout} />

    </div>
  );
}