
import React from 'react';
import { Wifi, WifiOff, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { BackendHealth } from '../types';

interface BackendStatusProps {
  health: BackendHealth;
  theme: 'light' | 'dark';
}

const BackendStatus: React.FC<BackendStatusProps> = ({ health, theme }) => {
  const isConnected = health.status === 'connected';

  return (
    <div className="flex items-center space-x-2">
      {/* Main Connection Status */}
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
        isConnected 
          ? theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
          : theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
      }`}>
        {isConnected ? (
          <Wifi className="w-3 h-3" />
        ) : (
          <WifiOff className="w-3 h-3" />
        )}
        <span className="text-xs font-medium">
          {isConnected ? 'Connected' : 'Offline'}
        </span>
      </div>

      {/* Database Status Indicators */}
      {isConnected && (
        <div className="flex items-center space-x-1">
          {/* Faiss DB */}
          <div
            className={`p-1 rounded ${
              health.faissConnected
                ? 'text-green-500'
                : 'text-red-500'
            }`}
            title={`Vector DB (Faiss): ${health.faissConnected ? 'Connected' : 'Disconnected'}`}
          >
            <Database className="w-3 h-3" />
          </div>

          {/* Graph DB */}
          <div
            className={`p-1 rounded ${
              health.graphDbConnected
                ? 'text-green-500'
                : 'text-red-500'
            }`}
            title={`Graph DB: ${health.graphDbConnected ? 'Connected' : 'Disconnected'}`}
          >
            {health.graphDbConnected ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <AlertCircle className="w-3 h-3" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BackendStatus;
