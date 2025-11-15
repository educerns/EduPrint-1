import React, { useState, useEffect, useRef } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';
// Component to handle the Export button state and animation
interface ExportButtonProps {
  isExporting: boolean;
  onClick: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ isExporting, onClick }) => {
  // Define motion variants for the spinner for clean rotation
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      },
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={isExporting}
      className={`
        flex items-center justify-center gap-2 px-3 sm:px-4 py-2 
        rounded-lg transition-all duration-300 text-sm 
        ${isExporting
          ? 'bg-purple-800 text-white cursor-not-allowed w-32 sm:w-auto'
          : 'bg-purple-600 hover:bg-purple-700 text-white w-32 sm:w-auto'
        }
      `}
      style={{ minWidth: '8rem' }} // Ensure consistent width
    >
      <AnimatePresence mode="wait">
        {isExporting ? (
          <motion.div
            key="exporting-spinner"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center gap-2"
          >
            <motion.div
  animate={{ rotate: 360 }}
  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
  className="w-4 h-4 border-2 border-t-2 border-t-white border-purple-300 rounded-full"
/>

            <span className="text-white">Exporting...</span>
          </motion.div>
        ) : (
          <motion.div
            key="export-icon"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden xs:inline">Export</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default ExportButton;