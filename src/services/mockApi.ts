
import { UserProfile, KnowledgeItem, ChatResponse, Message } from '../types/chat';

const STORAGE_KEYS = {
  USER_PROFILE: 'ai_assistant_user_profile',
  CHAT_SESSIONS: 'ai_assistant_chat_sessions',
  KNOWLEDGE_ITEMS: 'ai_assistant_knowledge_items'
};

// Sample AI responses for demonstration
const AI_RESPONSES = [
  "That's really interesting! I can see you're passionate about {topic}. Based on your interests in {interests}, I think you might also enjoy exploring related areas.",
  "I've noted that in your profile, {name}. Your skills in {skills} could really complement this discussion.",
  "Given your personality traits like {traits}, I think this approach would work well for you.",
  "That reminds me of something we discussed earlier about {topic}. Your perspective on this has evolved!",
  "I'm learning so much about your interests in {interests}. This will help me provide better recommendations.",
  "Your expertise in {skills} really shows in this conversation, {name}!",
  "That's a great point! I'll remember this preference for our future conversations.",
  "Based on what you've told me about your interests, you might find this perspective valuable.",
  "I can see how your background in {skills} influences your thinking on this topic.",
  "This adds another dimension to your profile. I'm getting a better understanding of who you are!"
];

class MockApiService {
  private delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getStorageData<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setStorageData<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  private generateAIResponse(userName: string, userInput: string, profile: UserProfile): string {
    const template = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
    const interests = profile.interests.length > 0 ? profile.interests.slice(0, 2).join(' and ') : 'learning';
    const skills = profile.skills.length > 0 ? profile.skills.slice(0, 2).join(' and ') : 'problem-solving';
    const traits = profile.personality_traits.length > 0 ? profile.personality_traits.slice(0, 2).join(' and ') : 'being curious';
    
    return template
      .replace(/{name}/g, userName)
      .replace(/{topic}/g, this.extractTopicFromInput(userInput))
      .replace(/{interests}/g, interests)
      .replace(/{skills}/g, skills)
      .replace(/{traits}/g, traits);
  }

  private extractTopicFromInput(input: string): string {
    const topics = ['technology', 'learning', 'creativity', 'problem-solving', 'communication', 'innovation', 'growth'];
    const words = input.toLowerCase().split(' ');
    for (const topic of topics) {
      if (words.some(word => topic.includes(word) || word.includes(topic))) {
        return topic;
      }
    }
    return 'this topic';
  }

  private extractKnowledgeFromInput(input: string, profile: UserProfile): void {
    const lowerInput = input.toLowerCase();
    
    // Extract interests
    const interestKeywords = ['love', 'enjoy', 'interested in', 'passionate about', 'like'];
    interestKeywords.forEach(keyword => {
      if (lowerInput.includes(keyword)) {
        const words = input.split(' ');
        const keywordIndex = words.findIndex(word => word.toLowerCase().includes(keyword.split(' ')[0]));
        if (keywordIndex !== -1 && keywordIndex < words.length - 1) {
          const interest = words.slice(keywordIndex + 1, keywordIndex + 3).join(' ');
          if (interest && !profile.interests.includes(interest)) {
            profile.interests.push(interest);
          }
        }
      }
    });

    // Extract skills
    const skillKeywords = ['good at', 'skilled in', 'expert in', 'experienced with'];
    skillKeywords.forEach(keyword => {
      if (lowerInput.includes(keyword)) {
        const words = input.split(' ');
        const keywordIndex = words.findIndex(word => word.toLowerCase().includes(keyword.split(' ')[0]));
        if (keywordIndex !== -1 && keywordIndex < words.length - 1) {
          const skill = words.slice(keywordIndex + keyword.split(' ').length, keywordIndex + keyword.split(' ').length + 2).join(' ');
          if (skill && !profile.skills.includes(skill)) {
            profile.skills.push(skill);
          }
        }
      }
    });

    // Extract personality traits
    const personalityKeywords = ['i am', "i'm", 'i tend to be', 'i consider myself'];
    personalityKeywords.forEach(keyword => {
      if (lowerInput.includes(keyword)) {
        const words = input.split(' ');
        const keywordIndex = words.findIndex(word => word.toLowerCase().includes(keyword.split(' ')[0]));
        if (keywordIndex !== -1 && keywordIndex < words.length - 1) {
          const trait = words.slice(keywordIndex + keyword.split(' ').length, keywordIndex + keyword.split(' ').length + 2).join(' ');
          if (trait && !profile.personality_traits.includes(trait)) {
            profile.personality_traits.push(trait);
          }
        }
      }
    });

    this.setStorageData(STORAGE_KEYS.USER_PROFILE, profile);
  }

  async initUser(userName: string): Promise<UserProfile> {
    await this.delay(800);
    
    const profile: UserProfile = {
      user_name: userName,
      interests: [],
      skills: [],
      topics: [],
      personality_traits: []
    };
    
    this.setStorageData(STORAGE_KEYS.USER_PROFILE, profile);
    return profile;
  }

  async sendMessage(sessionId: string, userName: string, userInput: string): Promise<ChatResponse> {
    await this.delay(1500);
    
    const profile = this.getStorageData<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
    if (profile) {
      this.extractKnowledgeFromInput(userInput, profile);
    }
    
    const response = profile 
      ? this.generateAIResponse(userName, userInput, profile)
      : "Hello! I'm your AI assistant. I'm here to learn about you and help with whatever you need.";
    
    return {
      response,
      session_id: sessionId || `session_${Date.now()}`
    };
  }

  async getUserProfile(userName: string): Promise<UserProfile> {
    await this.delay(500);
    
    const profile = this.getStorageData<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
    if (!profile) {
      throw new Error('User profile not found');
    }
    return profile;
  }

  async addKnowledge(userName: string, field: string, value: string): Promise<void> {
    await this.delay(600);
    
    const profile = this.getStorageData<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
    if (!profile) {
      throw new Error('User profile not found');
    }

    switch (field) {
      case 'interest':
        if (!profile.interests.includes(value)) {
          profile.interests.push(value);
        }
        break;
      case 'skill':
        if (!profile.skills.includes(value)) {
          profile.skills.push(value);
        }
        break;
      case 'topic':
        if (!profile.topics.includes(value)) {
          profile.topics.push(value);
        }
        break;
      case 'personality_trait':
        if (!profile.personality_traits.includes(value)) {
          profile.personality_traits.push(value);
        }
        break;
    }

    this.setStorageData(STORAGE_KEYS.USER_PROFILE, profile);
  }

  async updateKnowledge(userName: string, field: string, oldValue: string, newValue: string): Promise<void> {
    await this.delay(600);
    
    const profile = this.getStorageData<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
    if (!profile) {
      throw new Error('User profile not found');
    }

    switch (field) {
      case 'interest':
        const interestIndex = profile.interests.indexOf(oldValue);
        if (interestIndex !== -1) {
          profile.interests[interestIndex] = newValue;
        }
        break;
      case 'skill':
        const skillIndex = profile.skills.indexOf(oldValue);
        if (skillIndex !== -1) {
          profile.skills[skillIndex] = newValue;
        }
        break;
      case 'topic':
        const topicIndex = profile.topics.indexOf(oldValue);
        if (topicIndex !== -1) {
          profile.topics[topicIndex] = newValue;
        }
        break;
      case 'personality_trait':
        const traitIndex = profile.personality_traits.indexOf(oldValue);
        if (traitIndex !== -1) {
          profile.personality_traits[traitIndex] = newValue;
        }
        break;
    }

    this.setStorageData(STORAGE_KEYS.USER_PROFILE, profile);
  }

  async deleteKnowledge(userName: string, field: string, value: string): Promise<void> {
    await this.delay(600);
    
    const profile = this.getStorageData<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
    if (!profile) {
      throw new Error('User profile not found');
    }

    switch (field) {
      case 'interest':
        profile.interests = profile.interests.filter(item => item !== value);
        break;
      case 'skill':
        profile.skills = profile.skills.filter(item => item !== value);
        break;
      case 'topic':
        profile.topics = profile.topics.filter(item => item !== value);
        break;
      case 'personality_trait':
        profile.personality_traits = profile.personality_traits.filter(item => item !== value);
        break;
    }

    this.setStorageData(STORAGE_KEYS.USER_PROFILE, profile);
  }
}

export const mockApiService = new MockApiService();
