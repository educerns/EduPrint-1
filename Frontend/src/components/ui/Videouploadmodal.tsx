import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Replace } from "lucide-react";

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
onUploadSuccess: (videoUrl: string, videoTitle: string, showWatermark?: boolean) => void;
  showWatermark?: boolean;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  showWatermark,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file.");
      return;
    }
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size should not exceed 100MB.");
      return;
    }
    setSelectedFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  // ✅ CLEAN: No count logic here. Just pass the video up.
  // Count is incremented in VideoEditor when user actually starts editing.
  const handleNext = () => {
    if (!selectedFile || !videoPreview) return;
    const videoTitle = selectedFile.name.replace(/\.[^/.]+$/, "");
      onUploadSuccess(videoPreview, videoTitle, showWatermark); // ✅ pass it forward
    handleClose();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setVideoPreview(null);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-800">Upload a video</h2>
                <p className="text-red-500 font-semibold text-sm mt-1">
                  Customize your own videos — upload any 2 videos for free.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!videoPreview ? (
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                    isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div onClick={() => fileInputRef.current?.click()}>
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Drag your videos here to upload.
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      (Only MP4 are supported up to a max file size of 5GB)
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-base hover:underline"
                    >
                      Select a video from your computer
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                    <video src={videoPreview} controls className="w-full h-full object-contain">
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-800 mb-1">Selected File:</p>
                    <p className="text-sm text-gray-600 truncate">{selectedFile?.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setVideoPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-[#2C4E86] hover:text-blue-900 font-semibold text-sm hover:underline flex"
                  >
                    <Replace className="w-5 h-5" />
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleClose}
                className="px-2 py-1 text-gray-700 border text-sm rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedFile}
                className={`px-2 py-1 text-sm rounded-lg transition-colors ${
                  selectedFile
                    ? "bg-[#2C4E86] text-white hover:bg-blue-900"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next step
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoUploadModal;