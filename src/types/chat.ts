
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

export interface KnowledgeItem {
  field: 'interest' | 'skill' | 'topic' | 'personality_trait';
  value: string;
}

export interface UserProfile {
  user_name: string;
  interests: string[];
  skills: string[];
  topics: string[];
  personality_traits: string[];
}

export interface ChatResponse {
  response: string;
  session_id: string;
}
