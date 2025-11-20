import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Check } from "lucide-react";
import { useEditorStore } from "@/store/store";
import { motion, AnimatePresence } from "framer-motion";
import * as fabric from "fabric";

interface UploadedImage {
  id: string;
  url: string;
  name: string;
  size: number;
  preview: string;
}

const UploadPanel: React.FC = () => {
  const { canvas } = useEditorStore();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert file to data URL
  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle file upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    setIsLoading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert("Please upload valid image files");
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("File size must be less than 5MB");
          continue;
        }

        const preview = await fileToDataURL(file);
        const newImage: UploadedImage = {
          id: `${Date.now()}-${i}`,
          url: preview,
          name: file.name,
          size: file.size,
          preview: preview,
        };

        setUploadedImages((prev) => [newImage, ...prev]);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // Add image to canvas
  const handleAddImageToCanvas = (image: UploadedImage) => {
    if (!canvas) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const fabricImage = new fabric.Image(img);
      
      // Scale image to fit canvas
      const maxWidth = canvas.getWidth() * 0.8;
      const maxHeight = canvas.getHeight() * 0.8;
      const scale = Math.min(
        maxWidth / fabricImage.width!,
        maxHeight / fabricImage.height!
      );

      fabricImage.set({
        scaleX: scale,
        scaleY: scale,
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        originX: "center",
        originY: "center",
      });

      canvas.add(fabricImage);
      canvas.setActiveObject(fabricImage);
      canvas.renderAll();
    };
    img.src = image.preview;
  };

  // Delete uploaded image
  const handleDeleteImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-white to-gray-50">
      <div className="p-4 space-y-4">
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer ${
            isDragging
              ? "border-blue-500 bg-blue-50 scale-102"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />

          <motion.div
            className="text-center"
            animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={() => fileInputRef.current?.click()}
          >
            <motion.div
              animate={{ y: isDragging ? -5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="w-8 h-8 mx-auto text-blue-900 mb-2" />
            </motion.div>
            <h3 className="font-semibold text-gray-900 text-sm">
              Drop images here or click to upload
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              PNG, JPG, GIF (Max 5MB)
            </p>
          </motion.div>
        </motion.div>

        {/* Upload Status */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center p-3 bg-blue-50 rounded-lg"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Upload className="w-4 h-4 text-blue-900" />
              </motion.div>
              <span className="ml-2 text-sm text-blue-900 font-medium">
                Uploading...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Uploaded Images */}
        <AnimatePresence>
          {uploadedImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-gray-700" />
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Uploaded Images ({uploadedImages.length})
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <AnimatePresence mode="popLayout">
                  {uploadedImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="relative group"
                    >
                      {/* Image Preview */}
                      <motion.div
                        className="relative h-32 bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 border-gray-200 hover:border-blue-400 transition-all"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleAddImageToCanvas(image)}
                      >
                        <img
                          src={image.preview}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />

                        {/* Hover Overlay */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg"
                        >
                          <div className="text-center">
                            <Check className="w-6 h-6 text-white mx-auto mb-1" />
                            <span className="text-xs text-white font-semibold">
                              Add to canvas
                            </span>
                          </div>
                        </motion.div>
                      </motion.div>

                      {/* Image Info */}
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-2 space-y-1"
                      >
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {image.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(image.size)}
                        </p>
                      </motion.div>

                      {/* Delete Button */}
                      <motion.button
                        onClick={() => handleDeleteImage(image.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Clear All Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUploadedImages([])}
                className="w-full py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg text-sm font-medium transition-colors"
              >
                Clear All
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {uploadedImages.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6 text-gray-500"
            >
              <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-xs">No images uploaded yet</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadPanel;