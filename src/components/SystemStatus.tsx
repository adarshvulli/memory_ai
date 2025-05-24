
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SystemStatusProps {
  isConnected: boolean;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ isConnected }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <Badge variant={isConnected ? 'default' : 'destructive'} className="text-xs">
        {isConnected ? 'Connected' : 'Disconnected'}
      </Badge>
    </div>
  );
};

export default SystemStatus;
