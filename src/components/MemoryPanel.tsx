
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, Edit, Save, Trash, Plus } from 'lucide-react';

interface UserTrait {
  id: string;
  category: string;
  value: string;
  confidence: number;
  lastUpdated: Date;
}

interface MemoryPanelProps {
  userTraits: UserTrait[];
  onUpdateTrait: (id: string, value: string) => void;
  onClose: () => void;
}

const MemoryPanel: React.FC<MemoryPanelProps> = ({ userTraits, onUpdateTrait, onClose }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEditing = (trait: UserTrait) => {
    setEditingId(trait.id);
    setEditValue(trait.value);
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

  return (
    <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Memory Profile</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Session Memory */}
        <Card className="m-4 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-600 dark:text-blue-400">Session Memory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Active conversation context and recent interactions
            </div>
            <Badge variant="outline" className="text-xs">
              3 messages in context
            </Badge>
          </CardContent>
        </Card>

        {/* Persistent Memory */}
        <Card className="m-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-purple-600 dark:text-purple-400 flex items-center justify-between">
              Persistent Memory
              <Button variant="ghost" size="sm">
                <Plus className="w-3 h-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userTraits.map((trait) => (
              <div key={trait.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {trait.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {editingId === trait.id ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={saveEdit}>
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => startEditing(trait)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {editingId === trait.id ? (
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="text-xs"
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                  />
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-400">{trait.value}</p>
                )}
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Confidence</span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {Math.round(trait.confidence * 100)}%
                    </span>
                  </div>
                  <Progress value={trait.confidence * 100} className="h-1" />
                </div>
                
                <div className="text-xs text-slate-400">
                  Updated {trait.lastUpdated.toLocaleDateString()}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Memory Stats */}
        <Card className="m-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-600 dark:text-green-400">Memory Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Total Traits</span>
              <span className="font-medium">{userTraits.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">High Confidence</span>
              <span className="font-medium">
                {userTraits.filter(t => t.confidence > 0.8).length}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Last Update</span>
              <span className="font-medium">Today</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemoryPanel;
