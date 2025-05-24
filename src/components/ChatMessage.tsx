
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Brain, User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  memoryUsed?: string[];
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600">
          <AvatarFallback className="bg-transparent">
            <Brain className="w-4 h-4 text-white" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto'
              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        
        <div className={`flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          
          {message.memoryUsed && message.memoryUsed.length > 0 && (
            <div className="flex items-center gap-1">
              <Brain className="w-3 h-3 text-blue-500" />
              <Badge variant="secondary" className="text-xs">
                {message.memoryUsed.length} memory{message.memoryUsed.length > 1 ? 's' : ''} used
              </Badge>
            </div>
          )}
        </div>
        
        {message.memoryUsed && message.memoryUsed.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.memoryUsed.map((memory, index) => (
              <div key={index} className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                💡 {memory}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {isUser && (
        <Avatar className="w-8 h-8 bg-slate-200 dark:bg-slate-700">
          <AvatarFallback>
            <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
