
import React, { useState } from 'react';
import { Brain, Clock, Heart, Edit3, Trash2, Plus } from 'lucide-react';
import { MemoryData } from '../types';

interface MemoryPanelProps {
  memoryData: MemoryData;
  onUpdateMemory: (data: Partial<MemoryData>) => void;
  theme: 'light' | 'dark';
}

const MemoryPanel: React.FC<MemoryPanelProps> = ({ memoryData, onUpdateMemory, theme }) => {
  const [activeTab, setActiveTab] = useState<'session' | 'persistent'>('session');
  const [editingTrait, setEditingTrait] = useState<string | null>(null);
  const [newTrait, setNewTrait] = useState('');

  const addTrait = () => {
    if (!newTrait.trim()) return;

    if (activeTab === 'session') {
      onUpdateMemory({
        sessionMemory: {
          ...memoryData.sessionMemory,
          traits: [...memoryData.sessionMemory.traits, newTrait.trim()]
        }
      });
    } else {
      onUpdateMemory({
        persistentMemory: {
          ...memoryData.persistentMemory,
          longTermTraits: [...memoryData.persistentMemory.longTermTraits, newTrait.trim()]
        }
      });
    }
    setNewTrait('');
  };

  const removeTrait = (trait: string, type: 'session' | 'persistent') => {
    if (type === 'session') {
      onUpdateMemory({
        sessionMemory: {
          ...memoryData.sessionMemory,
          traits: memoryData.sessionMemory.traits.filter(t => t !== trait)
        }
      });
    } else {
      onUpdateMemory({
        persistentMemory: {
          ...memoryData.persistentMemory,
          longTermTraits: memoryData.persistentMemory.longTermTraits.filter(t => t !== trait)
        }
      });
    }
  };

  return (
    <div className={`h-full rounded-xl border transition-colors ${
      theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-5 h-5 text-purple-500" />
          <h2 className="font-semibold">Memory Center</h2>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1">
          {[
            { id: 'session', label: 'Session', icon: Clock },
            { id: 'persistent', label: 'Long-term', icon: Heart }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'session' | 'persistent')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white'
                  : theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        {activeTab === 'session' ? (
          <>
            {/* Session Memory */}
            <div>
              <h3 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Current Session Traits
              </h3>
              <div className="space-y-2">
                {memoryData.sessionMemory.traits.map((trait, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border group ${
                      theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{trait}</span>
                      <button
                        onClick={() => removeTrait(trait, 'session')}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h3 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Preferences
              </h3>
              <div className="space-y-2">
                {memoryData.sessionMemory.preferences.map((pref, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      theme === 'dark' ? 'border-blue-800 bg-blue-900/20' : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <span className="text-sm text-blue-600 dark:text-blue-400">{pref}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Topics */}
            <div>
              <h3 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Recent Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {memoryData.sessionMemory.recentTopics.map((topic, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs ${
                      theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Persistent Memory */}
            <div>
              <h3 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                User Profile
              </h3>
              <div className={`p-3 rounded-lg border ${
                theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-500">Name:</span>
                    <p className="text-sm font-medium">
                      {memoryData.persistentMemory.name || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Communication Style:</span>
                    <p className="text-sm font-medium capitalize">
                      {memoryData.persistentMemory.communicationStyle}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Long-term Traits */}
            <div>
              <h3 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Long-term Traits
              </h3>
              <div className="space-y-2">
                {memoryData.persistentMemory.longTermTraits.map((trait, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border group ${
                      theme === 'dark' ? 'border-green-800 bg-green-900/20' : 'border-green-200 bg-green-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 dark:text-green-400">{trait}</span>
                      <button
                        onClick={() => removeTrait(trait, 'persistent')}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <h3 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {memoryData.persistentMemory.interests.map((interest, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs ${
                      theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Add New Trait */}
        <div className={`p-3 border-2 border-dashed rounded-lg ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
        }`}>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTrait}
              onChange={(e) => setNewTrait(e.target.value)}
              placeholder={`Add ${activeTab} trait...`}
              className={`flex-1 text-sm border-none outline-none bg-transparent ${
                theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'
              }`}
              onKeyPress={(e) => e.key === 'Enter' && addTrait()}
            />
            <button
              onClick={addTrait}
              disabled={!newTrait.trim()}
              className="p-1 text-blue-500 disabled:opacity-50 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryPanel;
