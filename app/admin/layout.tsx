'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { checkToken } from '@/utils/lib/github-client';
import { ToastProvider } from '@/components/admin/Toast';
import Button from '@/components/common/Button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({ owner: '', repo: '' });

  // Login Form State
  const [inputToken, setInputToken] = useState('');
  const [inputOwner, setInputOwner] = useState('');
  const [inputRepo, setInputRepo] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // Check localStorage on mount
    const storedToken = localStorage.getItem('github_pat');
    const storedOwner = localStorage.getItem('github_owner');
    const storedRepo = localStorage.getItem('github_repo');

    if (storedToken && storedOwner && storedRepo) {
      setToken(storedToken);
      setConfig({ owner: storedOwner, repo: storedRepo });
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    const isValid = await checkToken(inputToken);
    if (isValid) {
      localStorage.setItem('github_pat', inputToken);
      localStorage.setItem('github_owner', inputOwner);
      localStorage.setItem('github_repo', inputRepo);
      setToken(inputToken);
      setConfig({ owner: inputOwner, repo: inputRepo });
    } else {
      setLoginError('Invalid Token');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('github_pat');
    localStorage.removeItem('github_owner');
    localStorage.removeItem('github_repo');
    setToken(null);
    setConfig({ owner: '', repo: '' });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-md dark:bg-gray-800">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Admin Login
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter your GitHub Personal Access Token (PAT) and Repo Info.
              <br />
              <span className="text-xs text-gray-500">
                Token is stored locally in your browser.
              </span>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label className="sr-only">Owner</label>
                <input
                  type="text"
                  required
                  className="relative block w-full rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  placeholder="GitHub Username (e.g. xiaohu92694)"
                  value={inputOwner}
                  onChange={(e) => setInputOwner(e.target.value)}
                />
              </div>
              <div>
                <label className="sr-only">Repo</label>
                <input
                  type="text"
                  required
                  className="relative block w-full border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  placeholder="Repository Name (e.g. mochineko)"
                  value={inputRepo}
                  onChange={(e) => setInputRepo(e.target.value)}
                />
              </div>
              <div>
                <label className="sr-only">Personal Access Token</label>
                <input
                  type="password"
                  required
                  className="relative block w-full rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  placeholder="ghp_xxxxxxxxxxxx"
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                />
              </div>
            </div>

            {loginError && <p className="text-sm text-red-500">{loginError}</p>}

            <div>
              <Button type="submit" variant="solid" className="text-sm w-full">
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md dark:bg-gray-800 flex flex-col justify-between">
        <div>
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Admin Panel
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {config.owner}/{config.repo}
            </p>
          </div>
          <nav className="mt-6">
            <Link
              href="/admin"
              className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/posts/editor"
              className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              New Post
            </Link>
          </nav>
        </div>
        <div className="p-6">
          <Button variant="solid" onClick={handleLogout} className="w-full">
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-10">
        <ToastProvider>{children}</ToastProvider>
      </div>
    </div>
  );
}
