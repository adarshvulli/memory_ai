import React from 'react';
import { Brain, Menu, X, Moon, Sun, Settings, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Header: React.FC = () => {
  const { user, darkMode, toggleDarkMode, rightSidebarOpen, setRightSidebarOpen, isMobile, setUser, setMessages, setSessionId } = useApp();

  const handleLogout = () => {
    // Clear user data
    setUser(null);
    setMessages([]);
    setSessionId('');
    
    // Clear localStorage
    localStorage.removeItem('userName');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('knowledgeItems');
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div >
         <img src="/logo.png" alt="Logo" className="w-16 h-16" /> 
          {/* <Brain className="w-6 h-6 text-white" /> */}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Memory AI</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user ? `Welcome back, ${user.user_name}` : 'Personalized AI Chat'}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        {!isMobile && (
          <button
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}

        {user && (
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-600 hover:text-red-700"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;