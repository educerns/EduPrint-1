import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

interface ExportProgressLoaderProps {
  progress: number; // 0-100
}

const ExportProgressLoader: React.FC<ExportProgressLoaderProps> = ({ progress }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      {/* Animated Icon */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-[#2C4E86] to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
          <Download className="w-10 h-10 text-white" />
        </div>
        
        {/* Spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-transparent border-t-[#2C4E86] border-r-indigo-400 rounded-full"
        />
      </motion.div>

      {/* Title */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Exporting Video
        </h3>
        <p className="text-gray-600 text-sm">
          Please wait while we process your video...
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="w-80 max-w-full">
        {/* Percentage Display */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-lg font-bold text-[#2C4E86]">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          {/* Animated fill */}
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-800 via-indigo-500 to-[#2C4E86] rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{
                x: ["-100%", "200%"]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        </div>

        {/* Status Text */}
        <div className="mt-3 text-center">
          <motion.p
            className="text-xs text-gray-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {progress < 30 && "🎬 Processing video frames..."}
            {progress >= 30 && progress < 60 && "🎨 Applying text overlays..."}
            {progress >= 60 && progress < 90 && "🔊 Merging audio track..."}
            {progress >= 90 && "✨ Finalizing export..."}
          </motion.p>
        </div>
      </div>

      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-[#2C4E86]S rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ExportProgressLoader;