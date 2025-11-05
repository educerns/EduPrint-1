import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FiDownload } from "react-icons/fi";

interface Video {
  id: number;
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  price: number;
  type: string;
}

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video?: Video | null;
  onDownload: (url: string, title: string, id: number) => void;
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  video,
  onDownload,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  if (!video) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-black rounded-xl shadow-2xl overflow-hidden flex items-center justify-center"
            style={{
              maxWidth: "95vw",
              maxHeight: "95vh",
            }}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                duration: 0.4,
                type: "spring",
                stiffness: 150,
                damping: 20,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 30,
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-lg transition-all hover:scale-110"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>

            {/* Download */}
            <button
              onClick={() =>
                video && onDownload(video.videoUrl, video.title, video.id)
              }
              className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-[#2C4E86] hover:bg-[#1f3a5f] text-white px-4 py-2 rounded-lg shadow-lg transition-all hover:scale-105"
            >
              <FiDownload className="w-4 h-4" />
              <span className="text-sm font-medium">Download</span>
            </button>

            {/* Player */}
            <motion.video
              ref={videoRef}
              src={video.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
              style={{
                maxWidth: "95vw",
                maxHeight: "95vh",
              }}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;
