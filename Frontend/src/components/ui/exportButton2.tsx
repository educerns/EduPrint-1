import React from 'react';
import { Download, Loader2 } from 'lucide-react';

interface ExportButtonProps {
  isExporting: boolean;
  onClick: () => void;
  progress?: number;
}

const ExportButton: React.FC<ExportButtonProps> = ({ isExporting, onClick, progress = 0 }) => {
  return (
    <button
      onClick={onClick}
      disabled={isExporting}
      className={`
        relative flex items-center gap-2 px-4 py-2 rounded-lg 
        font-medium transition-all overflow-hidden
        ${isExporting 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-purple-600 hover:bg-purple-700 text-white'
        }
      `}
    >
      {/* Progress bar background */}
      {isExporting && (
        <div 
          className="absolute left-0 top-0 h-full bg-purple-700 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      )}

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="hidden sm:inline">
              Exporting... {Math.round(progress)}%
            </span>
            <span className="sm:hidden">
              {Math.round(progress)}%
            </span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Video</span>
            <span className="sm:hidden">Export</span>
          </>
        )}
      </span>
    </button>
  );
};

export default ExportButton;