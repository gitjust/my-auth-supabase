'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function Dashboard() {
  const router = useRouter();

  // Define user state with the correct type User | null
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check the session and set user
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    // Subscribe to auth state changes and update user session
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user); // Ensure the user is updated correctly
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {user?.email}</h1>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push('/login');
        }}
      >
        Logout
      </button>
    </div>
  );
}
