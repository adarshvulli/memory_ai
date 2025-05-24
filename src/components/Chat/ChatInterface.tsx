
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Brain, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { Message } from '../../types/chat';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import DemoModeIndicator from '../DemoModeIndicator';

const ChatInterface: React.FC = () => {
  const { user, messages, addMessage, sessionId, setSessionId, isTyping, setIsTyping, setUser } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInputValue('');
    setIsSending(true);
    setIsTyping(true);

    try {
      const response = await apiService.sendMessage(
        sessionId || 'new-session',
        user.user_name,
        userMessage.text
      );
      console.log('AI response:', response);

      if (!sessionId) {
        setSessionId(response.session_id);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'ai',
        timestamp: new Date()
      };

      addMessage(aiMessage);

          apiService.updateKnowledgeFromMessagePair(
      user.user_name,
      userMessage.text,
      response.response
    ).catch(err => {
      console.warn("KG update failed (non-blocking):", err);
    });
      
      // Refresh user profile to get updated knowledge
      try {
        const updatedProfile = await apiService.getUserProfile(user.user_name);
        setUser(updatedProfile);
      } catch (error) {
        console.log('Could not refresh profile, continuing with current data');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      addMessage(errorMessage);
    } finally {
      setIsSending(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Welcome to AI Knowledge Assistant
          </h2>
          <p className="text-gray-500 dark:text-gray-500 mb-4">
            Please set up your profile to start chatting
          </p>
          <DemoModeIndicator />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Demo Mode Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <DemoModeIndicator />
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>AI is learning about you</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 max-w-md mx-auto">
              <Brain className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Hi {user.user_name}! 👋
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                I'm your personalized AI assistant. I'll learn about your interests and preferences as we chat. How can I help you today?
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                <strong>Try saying:</strong><br />
                "I'm interested in technology and programming"<br />
                "I'm good at problem-solving"<br />
                "I tend to be creative and analytical"
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Tell me about your interests, skills, or ask me anything..."
              className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 pr-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isSending}
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg p-3 transition-colors"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
