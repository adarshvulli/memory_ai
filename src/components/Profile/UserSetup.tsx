
import React, { useState } from 'react';
import { User, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import DemoModeIndicator from '../DemoModeIndicator';

const UserSetup: React.FC = () => {
  const { setUser } = useApp();
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const profile = await apiService.initUser(userName.trim());
      setUser(profile);
      localStorage.setItem('userName', userName.trim());
    } catch (err) {
      setError('Failed to initialize user. Please try again.');
      console.error('User initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              {/* <User className="w-8 h-8 text-white" /> */}
              <img src="/logo.png" alt="Logo" className="w-16 h-16" /> 
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Memory AI!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Let's get started by setting up your profile. I'll learn about you as we chat!
            </p>
            <div className="flex justify-center mb-4">
              <DemoModeIndicator />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Running in demo mode - all data is stored locally in your browser
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What's your name?
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!userName.trim() || isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Start Chatting</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSetup;
