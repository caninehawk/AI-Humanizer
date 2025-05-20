import React from 'react';
import { RefreshCw } from 'lucide-react';

interface HumanizeButtonProps {
  onClick: () => void;
  isProcessing: boolean;
}

export const HumanizeButton: React.FC<HumanizeButtonProps> = ({ onClick, isProcessing }) => {
  return (
    <button
      onClick={onClick}
      disabled={isProcessing}
      className={`
        px-6 py-3 rounded-full font-medium text-white 
        transition-all duration-300 transform
        flex items-center justify-center
        ${isProcessing 
          ? 'bg-green-400 cursor-not-allowed' 
          : 'bg-green-600 hover:bg-green-700 hover:scale-105 shadow-md hover:shadow-lg'
        }
      `}
      style={{ minWidth: '140px' }}
    >
      {isProcessing ? (
        <>
          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <span>Humanize Text</span>
      )}
    </button>
  );
};