'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    updateTheme(shouldBeDark);
  }, []);

  const updateTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  };

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    updateTheme(newMode);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create account');
      }

      router.push('/login?message=Account created successfully');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50'
    }`}>
      
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-2xl transition-all duration-300 hover:scale-110 z-50 ${
          isDark 
            ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border border-yellow-500/30' 
            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 border border-indigo-200'
        } shadow-lg backdrop-blur-sm`}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
      
      {/* Dynamic background elements */}
      {!isDark && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-pink-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      )}

      {isDark && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-twinkle"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-purple-300 rounded-full animate-twinkle delay-500"></div>
          <div className="absolute bottom-40 left-1/3 w-1 h-1 bg-blue-300 rounded-full animate-twinkle delay-1000"></div>
          <div className="absolute bottom-20 right-20 w-1 h-1 bg-pink-300 rounded-full animate-twinkle delay-1500"></div>
        </div>
      )}

      <div className={`max-w-lg w-full relative z-10 transition-all duration-500 ${
        isDark 
          ? 'bg-slate-800/90 border border-purple-500/20 shadow-2xl shadow-purple-500/10' 
          : 'bg-white/90 border border-orange-200/50 shadow-2xl shadow-orange-500/10'
      } backdrop-blur-xl rounded-3xl p-8 overflow-hidden`}>
        
        {/* Decorative gradient */}
        <div className={`absolute top-0 left-0 right-0 h-2 ${
          isDark 
            ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500' 
            : 'bg-gradient-to-r from-orange-400 via-pink-500 to-red-500'
        }`} />

        {/* Header */}
        <div className="text-center mb-8">
          <div className={`mx-auto h-20 w-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl transition-all duration-500 ${
            isDark 
              ? 'bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 shadow-purple-500/30' 
              : 'bg-gradient-to-br from-orange-400 via-pink-500 to-red-500 shadow-orange-500/30'
          }`}>
            <span className="text-3xl">🚀</span>
          </div>
          
          <h2 className={`text-3xl font-bold mb-3 transition-colors duration-500 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Join SecureVault
          </h2>
          <p className={`transition-colors duration-500 ${
            isDark ? 'text-purple-200' : 'text-orange-600'
          }`}>
            Create your secure password manager account
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-2xl transition-all duration-300 ${
            isDark 
              ? 'bg-red-900/30 border border-red-500/30 text-red-300' 
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            <div className="flex items-center">
              <span className="text-xl mr-3">⚠️</span>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className={`block text-sm font-bold mb-3 transition-colors duration-500 ${
              isDark ? 'text-purple-200' : 'text-orange-700'
            } flex items-center space-x-2`}>
              <span>📧</span>
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className={`w-full px-5 py-4 rounded-2xl transition-all duration-300 focus:scale-[1.02] ${
                isDark 
                  ? 'bg-slate-700/50 border-2 border-purple-500/30 focus:border-purple-400 text-white placeholder-purple-300' 
                  : 'bg-white/70 border-2 border-orange-300/50 focus:border-orange-400 text-gray-900 placeholder-orange-400'
              } focus:outline-none focus:ring-0 shadow-lg`}
              autoComplete="email"
              autoFocus
            />
          </div>

          {/* Password Field */}
          <div>
            <label className={`block text-sm font-bold mb-3 transition-colors duration-500 ${
              isDark ? 'text-purple-200' : 'text-orange-700'
            } flex items-center space-x-2`}>
              <span>🔑</span>
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Create a strong password"
              className={`w-full px-5 py-4 rounded-2xl transition-all duration-300 focus:scale-[1.02] ${
                isDark 
                  ? 'bg-slate-700/50 border-2 border-purple-500/30 focus:border-purple-400 text-white placeholder-purple-300' 
                  : 'bg-white/70 border-2 border-orange-300/50 focus:border-orange-400 text-gray-900 placeholder-orange-400'
              } focus:outline-none focus:ring-0 shadow-lg`}
              autoComplete="new-password"
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className={`block text-sm font-bold mb-3 transition-colors duration-500 ${
              isDark ? 'text-purple-200' : 'text-orange-700'
            } flex items-center space-x-2`}>
              <span>🔒</span>
              <span>Confirm Password</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Confirm your password"
              className={`w-full px-5 py-4 rounded-2xl transition-all duration-300 focus:scale-[1.02] ${
                isDark 
                  ? 'bg-slate-700/50 border-2 border-purple-500/30 focus:border-purple-400 text-white placeholder-purple-300' 
                  : 'bg-white/70 border-2 border-orange-300/50 focus:border-orange-400 text-gray-900 placeholder-orange-400'
              } focus:outline-none focus:ring-0 shadow-lg`}
              autoComplete="new-password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark 
                ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white shadow-purple-500/30' 
                : 'bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:from-orange-400 hover:via-pink-400 hover:to-red-400 text-white shadow-orange-500/30'
            } flex items-center justify-center space-x-3`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className={`w-full h-px ${
            isDark 
              ? 'bg-gradient-to-r from-transparent via-purple-500/50 to-transparent' 
              : 'bg-gradient-to-r from-transparent via-orange-400/50 to-transparent'
          } mb-6`} />
          
          <p className={`transition-colors duration-500 ${
            isDark ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Already have an account?{' '}
            <Link 
              href="/login" 
              className={`font-bold transition-colors duration-300 ${
                isDark 
                  ? 'text-purple-300 hover:text-purple-200' 
                  : 'text-orange-600 hover:text-orange-700'
              } hover:underline`}
            >
              Sign in here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
