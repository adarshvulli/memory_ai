
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  memoryUsed?: boolean;
  memoryContext?: string;
}

export interface SessionMemory {
  traits: string[];
  preferences: string[];
  recentTopics: string[];
}

export interface PersistentMemory {
  name: string;
  communicationStyle: 'concise' | 'detailed' | 'balanced';
  interests: string[];
  longTermTraits: string[];
}

export interface MemoryData {
  sessionMemory: SessionMemory;
  persistentMemory: PersistentMemory;
}

export interface BackendHealth {
  status: 'connected' | 'disconnected' | 'error';
  faissConnected: boolean;
  graphDbConnected: boolean;
  lastPing: Date;
}
