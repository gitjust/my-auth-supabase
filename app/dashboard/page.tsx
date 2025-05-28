'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function Dashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user); // Set the user once session is fetched
      } else {
        router.push('/login'); // Redirect to login if no session
      }
      setLoading(false);
    });

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center mb-6">Welcome to Your Dashboard</h1>
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-700">User Info</h2>
          <p className="text-gray-500">Email: {user?.email}</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
            }}
            className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
