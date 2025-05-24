
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, User, Settings, Heart, Briefcase, BookOpen } from 'lucide-react';
import { MemoryCategory, MemoryTemplate } from '@/types/memory';

interface MemoryConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: MemoryCategory[];
  onUpdateCategories: (categories: MemoryCategory[]) => void;
}

const defaultTemplates: MemoryTemplate[] = [
  {
    id: 'personal',
    name: 'Personal Profile',
    description: 'Basic personal information and preferences',
    isDefault: true,
    categories: [
      { id: 'name', name: 'Name', description: 'User\'s name', color: 'blue', icon: 'User', isCustom: false, fieldType: 'text', isRequired: true },
      { id: 'age', name: 'Age', description: 'User\'s age', color: 'green', icon: 'User', isCustom: false, fieldType: 'number', isRequired: false },
      { id: 'location', name: 'Location', description: 'User\'s location', color: 'purple', icon: 'User', isCustom: false, fieldType: 'text', isRequired: false }
    ]
  },
  {
    id: 'preferences',
    name: 'Communication Style',
    description: 'How the user prefers to communicate',
    isDefault: true,
    categories: [
      { id: 'response_style', name: 'Response Style', description: 'Preferred response length and tone', color: 'orange', icon: 'Settings', isCustom: false, fieldType: 'text', isRequired: false },
      { id: 'formality', name: 'Formality Level', description: 'Formal or casual communication', color: 'pink', icon: 'Settings', isCustom: false, fieldType: 'text', isRequired: false }
    ]
  },
  {
    id: 'interests',
    name: 'Interests & Hobbies',
    description: 'Topics the user is interested in',
    isDefault: true,
    categories: [
      { id: 'topics', name: 'Favorite Topics', description: 'Topics of interest', color: 'red', icon: 'Heart', isCustom: false, fieldType: 'tags', isRequired: false },
      { id: 'hobbies', name: 'Hobbies', description: 'User\'s hobbies and activities', color: 'yellow', icon: 'Heart', isCustom: false, fieldType: 'tags', isRequired: false }
    ]
  },
  {
    id: 'work',
    name: 'Work Context',
    description: 'Professional information and preferences',
    isDefault: true,
    categories: [
      { id: 'job_title', name: 'Job Title', description: 'User\'s job or role', color: 'indigo', icon: 'Briefcase', isCustom: false, fieldType: 'text', isRequired: false },
      { id: 'industry', name: 'Industry', description: 'Industry or field of work', color: 'teal', icon: 'Briefcase', isCustom: false, fieldType: 'text', isRequired: false }
    ]
  }
];

const MemoryConfigModal: React.FC<MemoryConfigModalProps> = ({
  isOpen,
  onClose,
  categories,
  onUpdateCategories
}) => {
  const [newCategory, setNewCategory] = useState<Partial<MemoryCategory>>({
    name: '',
    description: '',
    color: 'blue',
    icon: 'User',
    fieldType: 'text',
    isRequired: false,
    isCustom: true
  });

  const addCategory = () => {
    if (newCategory.name && newCategory.description) {
      const category: MemoryCategory = {
        id: Date.now().toString(),
        name: newCategory.name,
        description: newCategory.description,
        color: newCategory.color || 'blue',
        icon: newCategory.icon || 'User',
        fieldType: newCategory.fieldType || 'text',
        isRequired: newCategory.isRequired || false,
        isCustom: true
      };
      onUpdateCategories([...categories, category]);
      setNewCategory({
        name: '',
        description: '',
        color: 'blue',
        icon: 'User',
        fieldType: 'text',
        isRequired: false,
        isCustom: true
      });
    }
  };

  const removeCategory = (categoryId: string) => {
    onUpdateCategories(categories.filter(cat => cat.id !== categoryId));
  };

  const applyTemplate = (template: MemoryTemplate) => {
    const newCategories = template.categories.filter(
      templateCat => !categories.some(existingCat => existingCat.id === templateCat.id)
    );
    onUpdateCategories([...categories, ...newCategories]);
  };

  const colorOptions = ['blue', 'green', 'purple', 'orange', 'pink', 'red', 'yellow', 'indigo', 'teal'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Memory Configuration</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Current Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Badge variant="outline" className={`bg-${category.color}-100`}>
                            {category.name}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {category.fieldType}
                          </Badge>
                        </CardTitle>
                        {category.isCustom && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCategory(category.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Add New Category</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category-name">Name</Label>
                    <Input
                      id="category-name"
                      value={newCategory.name || ''}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="Category name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category-type">Field Type</Label>
                    <Select
                      value={newCategory.fieldType}
                      onValueChange={(value) => setNewCategory({ ...newCategory, fieldType: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="tags">Tags</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="category-desc">Description</Label>
                    <Input
                      id="category-desc"
                      value={newCategory.description || ''}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Category description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category-color">Color</Label>
                    <Select
                      value={newCategory.color}
                      onValueChange={(value) => setNewCategory({ ...newCategory, color: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map(color => (
                          <SelectItem key={color} value={color}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full bg-${color}-500`}></div>
                              {color}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={addCategory} className="mt-4" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Memory Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {defaultTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        {template.name}
                        <Badge variant="outline" className="text-xs">
                          {template.categories.length} categories
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.categories.map((cat) => (
                          <Badge key={cat.id} variant="secondary" className="text-xs">
                            {cat.name}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        onClick={() => applyTemplate(template)}
                        size="sm"
                        className="w-full"
                      >
                        Apply Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MemoryConfigModal;
