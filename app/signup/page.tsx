'use client';

import React, { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      setLoading(false);
      setSuccessMsg('Signup successful! Please check your email to confirm your account.');
      // Optionally redirect to login after a delay:
      setTimeout(() => {
        router.push('/login');
      }, 4000);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '2rem' }}>
      <h1>Create a new account</h1>
      <form onSubmit={handleSignup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 16 }}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 16 }}
        />

        <button type="submit" disabled={loading} style={{ padding: 10, width: '100%' }}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      {errorMsg && <p style={{ color: 'red', marginTop: 16 }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: 'green', marginTop: 16 }}>{successMsg}</p>}
    </div>
  );
}
