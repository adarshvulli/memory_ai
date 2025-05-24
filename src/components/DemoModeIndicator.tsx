
import React from 'react';
import { MonitorPlay, Wifi } from 'lucide-react';

const DemoModeIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-blue-800">
      <MonitorPlay className="w-4 h-4" />
      <span className="text-sm font-medium">Demo Mode</span>
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-xs">Local Storage</span>
      </div>
    </div>
  );
};

export default DemoModeIndicator;
