import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-gray-400 w-full h-full min-h-[300px] animate-fade-in">
      <Loader2 size={40} className="animate-spin text-[#005595] mb-4" />
      <p className="text-sm font-medium animate-pulse">Laddar...</p>
    </div>
  );
};

export default Loading;