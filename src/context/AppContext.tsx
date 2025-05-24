
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, UserProfile } from '../types/chat';

interface AppState {
  user: UserProfile | null;
  messages: Message[];
  sessionId: string;
  isTyping: boolean;
  darkMode: boolean;
  isMobile: boolean;
  rightSidebarOpen: boolean;
}

interface AppContextType extends AppState {
  setUser: (user: UserProfile | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setSessionId: (sessionId: string) => void;
  setIsTyping: (isTyping: boolean) => void;
  toggleDarkMode: () => void;
  setRightSidebarOpen: (open: boolean) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    user: null,
    messages: [],
    sessionId: '',
    isTyping: false,
    darkMode: localStorage.getItem('darkMode') === 'true',
    isMobile: window.innerWidth < 768,
    rightSidebarOpen: window.innerWidth >= 1024
  });

  useEffect(() => {
    const handleResize = () => {
      setState(prev => ({
        ...prev,
        isMobile: window.innerWidth < 768,
        rightSidebarOpen: window.innerWidth >= 1024
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
    localStorage.setItem('darkMode', state.darkMode.toString());
  }, [state.darkMode]);

  const setUser = (user: UserProfile | null) => setState(prev => ({ ...prev, user }));
  const setMessages = (messages: Message[]) => setState(prev => ({ ...prev, messages }));
  const addMessage = (message: Message) => setState(prev => ({ ...prev, messages: [...prev.messages, message] }));
  const setSessionId = (sessionId: string) => setState(prev => ({ ...prev, sessionId }));
  const setIsTyping = (isTyping: boolean) => setState(prev => ({ ...prev, isTyping }));
  const toggleDarkMode = () => setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  const setRightSidebarOpen = (open: boolean) => setState(prev => ({ ...prev, rightSidebarOpen: open }));
  
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...profile } : null
    }));
  };

  return (
    <AppContext.Provider value={{
      ...state,
      setUser,
      setMessages,
      addMessage,
      setSessionId,
      setIsTyping,
      toggleDarkMode,
      setRightSidebarOpen,
      updateUserProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
