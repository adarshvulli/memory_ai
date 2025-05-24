
import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, User, Bot, Sparkles } from 'lucide-react';
import { Message, MemoryData } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string, sender: 'user' | 'ai', memoryUsed?: boolean, memoryContext?: string) => void;
  currentModel: string;
  theme: 'light' | 'dark';
  memoryData: MemoryData;
  onUpdateMemory: (data: Partial<MemoryData>) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  currentModel,
  theme,
  memoryData,
  onUpdateMemory
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    onSendMessage(userMessage, 'user');
    
    // Simulate AI response with memory processing
    setIsTyping(true);
    
    setTimeout(() => {
      // Simulate memory processing
      let memoryUsed = false;
      let memoryContext = '';
      let response = '';

      // Check for name setting
      if (userMessage.toLowerCase().includes("i'm ") || userMessage.toLowerCase().includes("my name is")) {
        const nameMatch = userMessage.match(/(?:i'm|my name is)\s+(\w+)/i);
        if (nameMatch) {
          const name = nameMatch[1];
          onUpdateMemory({
            persistentMemory: {
              ...memoryData.persistentMemory,
              name
            }
          });
          memoryUsed = true;
          memoryContext = `Remembered your name: ${name}`;
          response = `Nice to meet you, ${name}! I'll remember your name for our future conversations.`;
        }
      }
      // Check for style preferences
      else if (userMessage.toLowerCase().includes('short') || userMessage.toLowerCase().includes('concise')) {
        onUpdateMemory({
          persistentMemory: {
            ...memoryData.persistentMemory,
            communicationStyle: 'concise'
          },
          sessionMemory: {
            ...memoryData.sessionMemory,
            preferences: [...memoryData.sessionMemory.preferences, 'Prefers concise responses']
          }
        });
        memoryUsed = true;
        memoryContext = 'Remembered your preference for short answers';
        response = 'Got it! I\'ll keep my responses concise from now on.';
      }
      // Use existing memory
      else if (memoryData.persistentMemory.name) {
        memoryUsed = true;
        memoryContext = `Using remembered name: ${memoryData.persistentMemory.name}`;
        response = `Hi ${memoryData.persistentMemory.name}! ${memoryData.persistentMemory.communicationStyle === 'concise' ? 'What can I help with?' : 'How can I assist you today? I remember our previous conversations and your preferences.'}`;
      }
      else {
        response = 'I\'m here to help! Feel free to tell me your name and preferences so I can personalize our conversation.';
      }

      onSendMessage(response, 'ai', memoryUsed, memoryContext);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className={`flex flex-col h-full rounded-xl border transition-colors ${
      theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
    }`}>
      {/* Model Indicator */}
      <div className={`px-4 py-3 border-b flex items-center justify-between ${
        theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {currentModel}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-blue-500" />
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Memory Mode Active
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-blue-500' 
                  : 'bg-gradient-to-r from-purple-500 to-blue-500'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-800 text-gray-100'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.text}</p>
                </div>

                {/* Memory Context */}
                {message.memoryUsed && message.memoryContext && (
                  <div className={`mt-2 px-3 py-1 rounded-lg flex items-center space-x-2 text-xs ${
                    theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    <span>{message.memoryContext}</span>
                  </div>
                )}

                <span className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className={`px-4 py-3 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Shift+Enter for new line)"
              className={`w-full resize-none rounded-lg px-4 py-3 border transition-colors ${
                theme === 'dark'
                  ? 'border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400 focus:border-blue-500'
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              rows={1}
              style={{ minHeight: '52px', maxHeight: '150px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
