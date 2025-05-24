
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, Edit, Save, Trash, Plus, Settings, Search } from 'lucide-react';
import { UserTrait, MemoryCategory } from '@/types/memory';
import MemoryConfigModal from './MemoryConfigModal';
import MemorySearch from './MemorySearch';

interface MemoryPanelProps {
  userTraits: UserTrait[];
  onUpdateTrait: (id: string, value: string) => void;
  onDeleteTrait: (id: string) => void;
  onAddTrait: (trait: Omit<UserTrait, 'id'>) => void;
  onClose: () => void;
}

const MemoryPanel: React.FC<MemoryPanelProps> = ({ 
  userTraits, 
  onUpdateTrait, 
  onDeleteTrait,
  onAddTrait,
  onClose 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [filteredTraits, setFilteredTraits] = useState<UserTrait[]>(userTraits);
  const [categories, setCategories] = useState<MemoryCategory[]>([
    { id: 'name', name: 'Name', description: 'User\'s name', color: 'blue', icon: 'User', isCustom: false, fieldType: 'text', isRequired: true },
    { id: 'response_style', name: 'Response Style', description: 'Preferred response length and tone', color: 'orange', icon: 'Settings', isCustom: false, fieldType: 'text', isRequired: false },
    { id: 'interests', name: 'Interests', description: 'Topics of interest', color: 'red', icon: 'Heart', isCustom: false, fieldType: 'text', isRequired: false }
  ]);

  React.useEffect(() => {
    setFilteredTraits(userTraits);
  }, [userTraits]);

  const startEditing = (trait: UserTrait) => {
    setEditingId(trait.id);
    setEditValue(trait.value.toString());
  };

  const saveEdit = () => {
    if (editingId) {
      onUpdateTrait(editingId, editValue);
      setEditingId(null);
      setEditValue('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const deleteTrait = (traitId: string) => {
    onDeleteTrait(traitId);
  };

  const addNewTrait = () => {
    const newTrait: Omit<UserTrait, 'id'> = {
      category: 'Custom',
      value: 'New trait',
      type: 'text',
      confidence: 0.5,
      lastUpdated: new Date(),
      priority: 'medium',
      source: 'manual',
      usageCount: 0
    };
    onAddTrait(newTrait);
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || 'gray';
  };

  const traitsToDisplay = showSearch ? filteredTraits : userTraits;

  return (
    <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Memory Profile</h2>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowSearch(!showSearch)}
            className={`text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 ${showSearch ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowConfigModal(true)}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showSearch && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <MemorySearch
              traits={userTraits}
              categories={categories}
              onFilteredResults={setFilteredTraits}
            />
          </div>
        )}

        {/* Session Memory */}
        <Card className="m-4 border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-700 dark:text-blue-300">Session Memory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Active conversation context and recent interactions
            </div>
            <Badge variant="outline" className="text-xs border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300">
              3 messages in context
            </Badge>
          </CardContent>
        </Card>

        {/* Persistent Memory */}
        <Card className="m-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-purple-600 dark:text-purple-400 flex items-center justify-between">
              Persistent Memory
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={addNewTrait}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {traitsToDisplay.map((trait) => (
              <div key={trait.id} className="space-y-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs bg-${getCategoryColor(trait.category)}-100 dark:bg-${getCategoryColor(trait.category)}-900/30 border-${getCategoryColor(trait.category)}-300 dark:border-${getCategoryColor(trait.category)}-600 text-${getCategoryColor(trait.category)}-700 dark:text-${getCategoryColor(trait.category)}-300`}
                    >
                      {trait.category}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {trait.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400">
                      {trait.source}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {editingId === trait.id ? (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={saveEdit}
                          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                        >
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={cancelEdit}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => startEditing(trait)}
                          className="text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteTrait(trait.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <Trash className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {editingId === trait.id ? (
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="text-xs bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                  />
                ) : (
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                    {Array.isArray(trait.value) ? trait.value.join(', ') : trait.value.toString()}
                  </p>
                )}
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Confidence</span>
                    <span className="text-slate-700 dark:text-slate-200 font-medium">
                      {Math.round(trait.confidence * 100)}%
                    </span>
                  </div>
                  <Progress value={trait.confidence * 100} className="h-1" />
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Updated {trait.lastUpdated.toLocaleDateString()}</span>
                  <span>Used {trait.usageCount} times</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Memory Stats */}
        <Card className="m-4 bg-green-50/50 dark:bg-green-950/30 border-green-200 dark:border-green-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-700 dark:text-green-300">Memory Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">Total Traits</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{userTraits.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">High Confidence</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {userTraits.filter(t => t.confidence > 0.8).length}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">Categories</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{categories.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">Manual Entries</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {userTraits.filter(t => t.source === 'manual').length}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">Last Update</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">Today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <MemoryConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        categories={categories}
        onUpdateCategories={setCategories}
      />
    </div>
  );
};

export default MemoryPanel;
