
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, Edit, Save, Trash, Plus, Settings, Search, Template, Customize } from 'lucide-react';
import { UserTrait, MemoryCategory } from '@/types/memory';
import MemoryConfigModal from './MemoryConfigModal';
import MemorySearch from './MemorySearch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

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

  const addFromTemplate = (templateType: string) => {
    const templates = {
      personal: { category: 'Personal', value: 'Add personal information', confidence: 0.5 },
      work: { category: 'Work', value: 'Add work context', confidence: 0.5 },
      preferences: { category: 'Preferences', value: 'Add communication preferences', confidence: 0.5 },
      interests: { category: 'Interests', value: 'Add topics of interest', confidence: 0.5 }
    };

    const template = templates[templateType as keyof typeof templates];
    if (template) {
      const newTrait: Omit<UserTrait, 'id'> = {
        ...template,
        type: 'text',
        lastUpdated: new Date(),
        priority: 'medium',
        source: 'manual',
        usageCount: 0
      };
      onAddTrait(newTrait);
    }
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || 'gray';
  };

  const traitsToDisplay = showSearch ? filteredTraits : userTraits;

  return (
    <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex flex-col">
      {/* Header */}
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
              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                    >
                      <Template className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => addFromTemplate('personal')}>
                      <span className="text-xs">Personal Info</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addFromTemplate('work')}>
                      <span className="text-xs">Work Context</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addFromTemplate('preferences')}>
                      <span className="text-xs">Communication Style</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addFromTemplate('interests')}>
                      <span className="text-xs">Interests & Hobbies</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowConfigModal(true)}>
                      <Customize className="w-3 h-3 mr-2" />
                      <span className="text-xs">Customize Categories</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={addNewTrait}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {traitsToDisplay.map((trait) => (
              <div key={trait.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50">
                {/* Header with category and actions */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-wrap items-center gap-2 flex-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs bg-${getCategoryColor(trait.category)}-100 dark:bg-${getCategoryColor(trait.category)}-900/30 border-${getCategoryColor(trait.category)}-300 dark:border-${getCategoryColor(trait.category)}-600 text-${getCategoryColor(trait.category)}-700 dark:text-${getCategoryColor(trait.category)}-300`}
                    >
                      {trait.category}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200">
                      {trait.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-300">
                      {trait.source}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {editingId === trait.id ? (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={saveEdit}
                          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 h-8 w-8 p-0"
                        >
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={cancelEdit}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 h-8 w-8 p-0"
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
                          className="text-slate-600 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-200 h-8 w-8 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteTrait(trait.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 h-8 w-8 p-0"
                        >
                          <Trash className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Content */}
                <div className="mb-3">
                  {editingId === trait.id ? (
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="text-sm bg-white dark:bg-slate-600 border-slate-300 dark:border-slate-500 text-slate-900 dark:text-slate-100"
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                    />
                  ) : (
                    <p className="text-sm text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                      {Array.isArray(trait.value) ? trait.value.join(', ') : trait.value.toString()}
                    </p>
                  )}
                </div>
                
                {/* Confidence section */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Confidence</span>
                    <span className="text-xs text-slate-700 dark:text-slate-200 font-semibold">
                      {Math.round(trait.confidence * 100)}%
                    </span>
                  </div>
                  <Progress value={trait.confidence * 100} className="h-2" />
                </div>
                
                {/* Footer info */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-600">
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
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{userTraits.length}</div>
                <div className="text-xs text-slate-600 dark:text-slate-300">Total Traits</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {userTraits.filter(t => t.confidence > 0.8).length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">High Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{categories.length}</div>
                <div className="text-xs text-slate-600 dark:text-slate-300">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {userTraits.filter(t => t.source === 'manual').length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">Manual</div>
              </div>
            </div>
            <div className="pt-2 border-t border-green-200 dark:border-green-700">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">Last Update</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">Today</span>
              </div>
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
