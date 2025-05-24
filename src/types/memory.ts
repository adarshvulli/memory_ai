
export interface UserTrait {
  id: string;
  category: string;
  value: string | number | boolean | string[];
  type: 'text' | 'number' | 'boolean' | 'tags' | 'date';
  confidence: number;
  lastUpdated: Date;
  priority: 'low' | 'medium' | 'high';
  source: 'conversation' | 'manual' | 'imported';
  usageCount: number;
  expiresAt?: Date;
}

export interface MemoryCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isCustom: boolean;
  fieldType: 'text' | 'number' | 'boolean' | 'tags' | 'date';
  isRequired: boolean;
  defaultValue?: any;
}

export interface MemoryTemplate {
  id: string;
  name: string;
  description: string;
  categories: MemoryCategory[];
  isDefault: boolean;
}

export interface MemoryProfile {
  id: string;
  name: string;
  description: string;
  traits: UserTrait[];
  categories: MemoryCategory[];
  isActive: boolean;
  createdAt: Date;
}
