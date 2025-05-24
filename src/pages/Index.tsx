import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Settings, User, MessageCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ChatMessage from '@/components/ChatMessage';
import MemoryPanel from '@/components/MemoryPanel';
import ModelSelector from '@/components/ModelSelector';
import SystemStatus from '@/components/SystemStatus';
import { useToast } from '@/hooks/use-toast';
import { UserTrait } from '@/types/memory';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  memoryUsed?: string[];
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMemoryMode, setIsMemoryMode] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMemoryPanel, setShowMemoryPanel] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [isConnected, setIsConnected] = useState(true);
  const [userTraits, setUserTraits] = useState<UserTrait[]>([
    { 
      id: '1', 
      category: 'Name', 
      value: 'Rachit', 
      type: 'text',
      confidence: 0.95, 
      lastUpdated: new Date(),
      priority: 'high',
      source: 'conversation',
      usageCount: 5
    },
    { 
      id: '2', 
      category: 'Response Style', 
      value: 'Concise answers', 
      type: 'text',
      confidence: 0.88, 
      lastUpdated: new Date(),
      priority: 'medium',
      source: 'conversation',
      usageCount: 3
    },
    { 
      id: '3', 
      category: 'Interests', 
      value: 'AI, Technology, Productivity', 
      type: 'text',
      confidence: 0.82, 
      lastUpdated: new Date(),
      priority: 'medium',
      source: 'manual',
      usageCount: 2
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response with memory usage
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Hi Rachit! I understand you prefer concise responses. Here's a brief answer to your question.`,
        sender: 'assistant',
        timestamp: new Date(),
        memoryUsed: ['Name: Rachit', 'Preference: Concise responses']
      };
      setMessages(prev => [...prev, aiMessage]);
      
      if (aiMessage.memoryUsed) {
        toast({
          title: "Memory Active",
          description: `Used ${aiMessage.memoryUsed.length} stored preferences`,
        });
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleUpdateTrait = (id: string, value: string) => {
    setUserTraits(prev => prev.map(trait => 
      trait.id === id 
        ? { 
            ...trait, 
            value, 
            lastUpdated: new Date(),
            usageCount: trait.usageCount + 1
          } 
        : trait
    ));
  };

  const handleDeleteTrait = (id: string) => {
    setUserTraits(prev => prev.filter(trait => trait.id !== id));
  };

  const handleAddTrait = (newTrait: Omit<UserTrait, 'id'>) => {
    const trait: UserTrait = {
      ...newTrait,
      id: Date.now().toString()
    };
    setUserTraits(prev => [...prev, trait]);
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Memory AI Assistant</h1>
                <div className="flex items-center gap-2">
                  <Badge variant={isMemoryMode ? "default" : "secondary"} className="text-xs">
                    {isMemoryMode ? "Memory Mode Active" : "Default Mode"}
                  </Badge>
                  <SystemStatus isConnected={isConnected} />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
              
              <div className="flex items-center gap-2">
                <Switch checked={isMemoryMode} onCheckedChange={setIsMemoryMode} />
                <span className="text-sm text-slate-600 dark:text-slate-400">Memory</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMemoryPanel(!showMemoryPanel)}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Profile
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Welcome to Memory AI Assistant
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    I remember your preferences and adapt to your communication style. 
                    Try introducing yourself to see how I learn about you!
                  </p>
                </div>
              )}
              
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
              <div className="flex gap-2 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                    className="w-full px-4 py-3 pr-12 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[48px] max-h-32"
                    rows={1}
                  />
                  {isMemoryMode && (
                    <div className="absolute right-3 top-3">
                      <Zap className="w-4 h-4 text-blue-500" />
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Memory Panel */}
          {showMemoryPanel && (
            <MemoryPanel
              userTraits={userTraits}
              onUpdateTrait={handleUpdateTrait}
              onDeleteTrait={handleDeleteTrait}
              onAddTrait={handleAddTrait}
              onClose={() => setShowMemoryPanel(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
