
import React, { useState, useEffect } from 'react';
import { X, Cpu, Globe, Zap, Database, Save } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string;
  apiEndpoint: string;
  connectionType: 'websocket' | 'rest';
  memorySettings: {
    autoSave: boolean;
    rememberPreferences: boolean;
    longTermStorage: boolean;
  };
  onSave: (settings: {
    model: string;
    apiEndpoint: string;
    connectionType: 'websocket' | 'rest';
    memorySettings: {
      autoSave: boolean;
      rememberPreferences: boolean;
      longTermStorage: boolean;
    };
  }) => void;
  theme: 'light' | 'dark';
}

const models = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', type: 'cloud' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', type: 'cloud' },
  { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic', type: 'cloud' },
  { id: 'mistral-7b', name: 'Mistral 7B', provider: 'Local', type: 'local' },
  { id: 'llama-2-7b', name: 'Llama 2 7B', provider: 'Local', type: 'local' },
  { id: 'ollama-custom', name: 'Custom Ollama', provider: 'Ollama', type: 'local' }
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  currentModel,
  apiEndpoint,
  connectionType,
  memorySettings,
  onSave,
  theme
}) => {
  const [localModel, setLocalModel] = useState(currentModel);
  const [localApiEndpoint, setLocalApiEndpoint] = useState(apiEndpoint);
  const [localConnectionType, setLocalConnectionType] = useState<'websocket' | 'rest'>(connectionType);
  const [localMemorySettings, setLocalMemorySettings] = useState(memorySettings);

  // Update local state when props change
  useEffect(() => {
    setLocalModel(currentModel);
    setLocalApiEndpoint(apiEndpoint);
    setLocalConnectionType(connectionType);
    setLocalMemorySettings(memorySettings);
  }, [currentModel, apiEndpoint, connectionType, memorySettings]);

  const handleSave = () => {
    onSave({
      model: localModel,
      apiEndpoint: localApiEndpoint,
      connectionType: localConnectionType,
      memorySettings: localMemorySettings
    });
  };

  const handleMemorySettingChange = (key: keyof typeof localMemorySettings, value: boolean) => {
    setLocalMemorySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-md mx-4 rounded-xl border transition-colors ${
        theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Model Selection */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Cpu className="w-5 h-5 text-blue-500" />
              <h3 className="font-medium">AI Model</h3>
            </div>
            <div className="space-y-2">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setLocalModel(model.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    localModel === model.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:bg-gray-800'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{model.name}</span>
                        {model.type === 'local' && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
                          }`}>
                            Local
                          </span>
                        )}
                      </div>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {model.provider}
                      </span>
                    </div>
                    {model.type === 'cloud' ? (
                      <Globe className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Database className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Memory Settings */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-5 h-5 text-purple-500" />
              <h3 className="font-medium">Memory Settings</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-save conversations</span>
                <input
                  type="checkbox"
                  checked={localMemorySettings.autoSave}
                  onChange={(e) => handleMemorySettingChange('autoSave', e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Remember user preferences</span>
                <input
                  type="checkbox"
                  checked={localMemorySettings.rememberPreferences}
                  onChange={(e) => handleMemorySettingChange('rememberPreferences', e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Long-term memory storage</span>
                <input
                  type="checkbox"
                  checked={localMemorySettings.longTermStorage}
                  onChange={(e) => handleMemorySettingChange('longTermStorage', e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Backend Configuration */}
          <div>
            <h3 className="font-medium mb-3">Backend Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className={`block text-sm mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  API Endpoint
                </label>
                <input
                  type="text"
                  value={localApiEndpoint}
                  onChange={(e) => setLocalApiEndpoint(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${
                    theme === 'dark'
                      ? 'border-gray-700 bg-gray-800 text-gray-100'
                      : 'border-gray-300 bg-white text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Connection Type
                </label>
                <select 
                  value={localConnectionType}
                  onChange={(e) => setLocalConnectionType(e.target.value as 'websocket' | 'rest')}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${
                    theme === 'dark'
                      ? 'border-gray-700 bg-gray-800 text-gray-100'
                      : 'border-gray-300 bg-white text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                >
                  <option value="websocket">WebSocket</option>
                  <option value="rest">REST API</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
