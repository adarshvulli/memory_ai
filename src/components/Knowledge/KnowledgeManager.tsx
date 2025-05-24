
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';

const KnowledgeManager: React.FC = () => {
  const { user, updateUserProfile } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ field: 'interest', value: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingItem, setEditingItem] = useState<{ field: string; oldValue: string; newValue: string } | null>(null);

  if (!user) return null;

  const allItems = [
    ...user.interests.map(item => ({ field: 'interest', value: item })),
    ...user.skills.map(item => ({ field: 'skill', value: item })),
    ...user.topics.map(item => ({ field: 'topic', value: item })),
    ...user.personality_traits.map(item => ({ field: 'personality_trait', value: item }))
  ];

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.value.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || item.field === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const handleAddItem = async () => {
    if (!newItem.value.trim()) return;

    try {
      await apiService.addKnowledge(user.user_name, newItem.field, newItem.value.trim());
      
      // Update local state
      const updatedProfile = { ...user };
      const fieldKey = `${newItem.field}s` as keyof typeof updatedProfile;
      if (Array.isArray(updatedProfile[fieldKey])) {
        (updatedProfile[fieldKey] as string[]).push(newItem.value.trim());
      }
      updateUserProfile(updatedProfile);
      
      setNewItem({ field: 'interest', value: '' });
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add knowledge item:', error);
    }
  };

  const handleEditItem = async () => {
    if (!editingItem || !editingItem.newValue.trim()) return;

    try {
      await apiService.updateKnowledge(
        user.user_name,
        editingItem.field,
        editingItem.oldValue,
        editingItem.newValue.trim()
      );

      // Update local state
      const updatedProfile = { ...user };
      const fieldKey = `${editingItem.field}s` as keyof typeof updatedProfile;
      if (Array.isArray(updatedProfile[fieldKey])) {
        const items = updatedProfile[fieldKey] as string[];
        const index = items.indexOf(editingItem.oldValue);
        if (index !== -1) {
          items[index] = editingItem.newValue.trim();
        }
      }
      updateUserProfile(updatedProfile);
      
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to update knowledge item:', error);
    }
  };

  const handleDeleteItem = async (field: string, value: string) => {
    try {
      await apiService.deleteKnowledge(user.user_name, field, value);
      
      // Update local state
      const updatedProfile = { ...user };
      const fieldKey = `${field}s` as keyof typeof updatedProfile;
      if (Array.isArray(updatedProfile[fieldKey])) {
        const items = updatedProfile[fieldKey] as string[];
        const filtered = items.filter(item => item !== value);
        (updatedProfile[fieldKey] as string[]) = filtered;
      }
      updateUserProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to delete knowledge item:', error);
    }
  };

  const getCategoryColor = (field: string) => {
    const colors = {
      interest: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      skill: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      topic: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      personality_trait: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    };
    return colors[field as keyof typeof colors] || colors.interest;
  };

  const getCategoryLabel = (field: string) => {
    const labels = {
      interest: 'Interest',
      skill: 'Skill',
      topic: 'Topic',
      personality_trait: 'Personality'
    };
    return labels[field as keyof typeof labels] || field;
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Knowledge Manager
        </h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search knowledge..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        >
          <option value="all">All Categories</option>
          <option value="interest">Interests</option>
          <option value="skill">Skills</option>
          <option value="topic">Topics</option>
          <option value="personality_trait">Personality</option>
        </select>
        
        {/* Add Button */}
        <button
          onClick={() => setIsAdding(true)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Knowledge</span>
        </button>
      </div>

      {/* Add New Item Form */}
      {isAdding && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="space-y-3">
            <select
              value={newItem.field}
              onChange={(e) => setNewItem(prev => ({ ...prev, field: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="interest">Interest</option>
              <option value="skill">Skill</option>
              <option value="topic">Topic</option>
              <option value="personality_trait">Personality Trait</option>
            </select>
            
            <input
              type="text"
              placeholder="Enter value..."
              value={newItem.value}
              onChange={(e) => setNewItem(prev => ({ ...prev, value: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              autoFocus
            />
            
            <div className="flex space-x-2">
              <button
                onClick={handleAddItem}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 px-3 text-sm font-medium flex items-center justify-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>Add</span>
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewItem({ field: 'interest', value: '' });
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg py-2 px-3 text-sm font-medium flex items-center justify-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No knowledge items found</p>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <div
              key={`${item.field}-${item.value}-${index}`}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
            >
              {editingItem?.field === item.field && editingItem?.oldValue === item.value ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editingItem.newValue}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, newValue: e.target.value } : null)}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    autoFocus
                  />
                  <div className="flex space-x-1">
                    <button
                      onClick={handleEditItem}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded py-1 px-2 text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingItem(null)}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded py-1 px-2 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(item.field)}`}>
                      {getCategoryLabel(item.field)}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingItem({ field: item.field, oldValue: item.value, newValue: item.value })}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.field, item.value)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">{item.value}</p>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KnowledgeManager;
