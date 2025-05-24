
import React, { useEffect } from 'react';
import { AppProvider, useApp } from '../context/AppContext';
import Header from '../components/Layout/Header';
import ChatInterface from '../components/Chat/ChatInterface';
import ProfileDashboard from '../components/Profile/ProfileDashboard';
import KnowledgeManager from '../components/Knowledge/KnowledgeManager';
import UserSetup from '../components/Profile/UserSetup';
import { apiService } from '../services/api';

const AppContent: React.FC = () => {
  const { user, setUser, isMobile, rightSidebarOpen } = useApp();

  useEffect(() => {
    // Try to load user from localStorage
    const savedUserName = localStorage.getItem('userName');
    if (savedUserName && !user) {
      apiService.getUserProfile(savedUserName)
        .then(setUser)
        .catch(console.error);
    }
  }, [user, setUser]);

  if (!user) {
    return <UserSetup />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Profile Dashboard */}
        {!isMobile && <ProfileDashboard />}
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatInterface />
        </div>
        
        {/* Right Sidebar - Knowledge Manager */}
        {!isMobile && rightSidebarOpen && <KnowledgeManager />}
      </div>
      
      {/* Mobile Bottom Navigation - Could be added here if needed */}
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
