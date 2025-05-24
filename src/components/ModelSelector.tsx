
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const models = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', type: 'cloud' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', type: 'cloud' },
  { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic', type: 'cloud' },
  { id: 'mistral-7b', name: 'Mistral 7B', provider: 'Local', type: 'local' },
  { id: 'llama-2-7b', name: 'Llama 2 7B', provider: 'Local', type: 'local' },
  { id: 'ollama-mistral', name: 'Ollama Mistral', provider: 'Ollama', type: 'local' },
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const currentModel = models.find(m => m.id === selectedModel);
  
  return (
    <div className="flex items-center gap-2">
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex items-center justify-between w-full">
                <span>{model.name}</span>
                <div className="flex items-center gap-1 ml-2">
                  <Badge 
                    variant={model.type === 'cloud' ? 'default' : 'secondary'} 
                    className="text-xs"
                  >
                    {model.provider}
                  </Badge>
                  {model.type === 'local' && (
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelector;
