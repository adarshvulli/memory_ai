
import { UserProfile, KnowledgeItem, ChatResponse, Message } from '../types/chat';
import { mockApiService } from './mockApi';

// Configuration flag to switch between mock and real API
const USE_MOCK_API = true; // Set to false when backend is available

const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  async initUser(userName: string): Promise<UserProfile> {
    if (USE_MOCK_API) {
      return mockApiService.initUser(userName);
    }
    
    const response = await fetch(`${API_BASE_URL}/kg/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name: userName })
    });
    if (!response.ok) throw new Error('Failed to initialize user');
    return response.json();
  }

  async sendMessage(sessionId: string, userName: string, userInput: string): Promise<ChatResponse> {
    if (USE_MOCK_API) {
      return mockApiService.sendMessage(sessionId, userName, userInput);
    }
    
    const response = await fetch(`${API_BASE_URL}/kg/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        user_name: userName,
        user_input: userInput
      })
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  }

  async getUserProfile(userName: string): Promise<UserProfile> {
    if (USE_MOCK_API) {
      return mockApiService.getUserProfile(userName);
    }
    
    const response = await fetch(`${API_BASE_URL}/kg/view/${userName}`);
    if (!response.ok) throw new Error('Failed to get user profile');
    const data = await response.json();
    return { user_name: userName, ...data };
  }

  async addKnowledge(userName: string, field: string, value: string): Promise<void> {
    if (USE_MOCK_API) {
      return mockApiService.addKnowledge(userName, field, value);
    }
    
    const response = await fetch(`${API_BASE_URL}/kg/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_name: userName,
        field,
        value
      })
    });
    if (!response.ok) throw new Error('Failed to add knowledge');
  }

  async updateKnowledge(userName: string, field: string, oldValue: string, newValue: string): Promise<void> {
    if (USE_MOCK_API) {
      return mockApiService.updateKnowledge(userName, field, oldValue, newValue);
    }
    
    const response = await fetch(`${API_BASE_URL}/kg/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_name: userName,
        field,
        old_value: oldValue,
        new_value: newValue
      })
    });
    if (!response.ok) throw new Error('Failed to update knowledge');
  }

  async deleteKnowledge(userName: string, field: string, value: string): Promise<void> {
    if (USE_MOCK_API) {
      return mockApiService.deleteKnowledge(userName, field, value);
    }
    
    const response = await fetch(`${API_BASE_URL}/kg/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_name: userName,
        field,
        value
      })
    });
    if (!response.ok) throw new Error('Failed to delete knowledge');
  }
}

export const apiService = new ApiService();
