'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { login, isAuthenticated } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(email, password);

    if (result.success && result.user) {
      router.push('/');
      router.refresh();
    } else {
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="bg-[#181818] rounded-xl border border-[#2a2a2a] p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/nativepath-logo.svg"
                alt="NativePath"
                width={200}
                height={41}
                className="h-10 w-auto"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Promotions Tracker
            </h1>
            <p className="text-[#b3b3b3]">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[#e22134] bg-opacity-20 border border-[#e22134] border-opacity-30 text-[#e22134] px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-np-blue-500 focus:border-np-blue-500"
                placeholder="you@nativepath.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-np-blue-500 focus:border-np-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-[#1db954] text-black rounded-full hover:bg-[#1ed760] hover:scale-[1.02] transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#2a2a2a]">
            <p className="text-sm text-[#b3b3b3] text-center mb-3">
              Demo Accounts:
            </p>
            <div className="space-y-2 text-xs text-[#6b6b6b]">
              <div>
                <strong className="text-[#b3b3b3]">Admin:</strong> admin@nativepath.com / admin123
              </div>
              <div>
                <strong className="text-[#b3b3b3]">User:</strong> user@nativepath.com / user123
              </div>
              <div>
                <strong className="text-[#b3b3b3]">Viewer:</strong> viewer@nativepath.com / viewer123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

