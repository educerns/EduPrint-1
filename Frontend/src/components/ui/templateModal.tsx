import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FiDownload, FiEdit3 } from "react-icons/fi";
import Swal from "sweetalert2";
import PosterCustomizer from "./posterCustomizerProps";
import {
  FaUserAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";


// ✅ Define prop & data types
interface Template {
  id: number;
  _id?: string;
  title: string;
  description: string;
  sampleImage: string;
  customImage: string;
  price: number;
  type: string;
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template?: Template | null;
}

interface FormData {
  centerName: string;
  email: string;
  mobile: string;
  address: string;
  dateTime?: string;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  template,
}) => {
  const [isCustomize, setIsCustomize] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    centerName: "",
    email: "",
    mobile: "",
    address: "",
    dateTime: "",
  });
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
      const navigate = useNavigate();
  

  useEffect(() => {
    if (!isOpen || !template) {
      setIsCustomize(false);
      setFormData({
        centerName: "",
        email: "",
        mobile: "",
        address: "",
        dateTime: "",
      });
    }
  }, [isOpen, template]);

  if (!template) return null;

  // ✅ Clear canvas function
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // ✅ Reset Customization + Clear Poster
  const handleBack = () => {
    setIsCustomize(false);
    setFormData({
      centerName: "",
      email: "",
      mobile: "",
      address: "",
      dateTime: "",
    });
    setGeneratedUrl(null);
    clearCanvas();
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDownload = () => {
    if (!generatedUrl) {
      Swal.fire({
        icon: "warning",
        title: "No Poster Generated!",
        text: "Please generate your poster first before downloading.",
        confirmButtonColor: "#2C4E86",
      });
      return;
    }

    const link = document.createElement("a");
    link.href = generatedUrl;
    link.download = `${formData.centerName || "Customized"}_Poster.png`;
    link.click();

    Swal.fire({
      icon: "success",
      title: "Download Started!",
      text: "Your poster is being downloaded successfully.",
      confirmButtonColor: "#2C4E86",
    });
  };
  const handleCustomize = () => {
    // console.log("🎨 Customizing template:", template);
    
    // Use either _id (from database) or id (from local data)
    const templateId = template._id || template.id;
    
    if (templateId) {
      // console.log("✅ Navigating to:", `/editor/${templateId}`);
      onClose(); // Close modal first
      navigate(`/editor/${templateId}`); // Then navigate
    } else {
      console.warn("⚠️ Template has no id or _id!");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onClick={onClose} // ✅ Added here
        >
          <motion.div
            className="bg-white rounded-lg sm:rounded-2xl shadow-2xl w-[95vw] md:w-[90vw] lg:w-[80vw] max-w-5xl flex flex-col md:flex-row overflow-hidden my-4"
            style={{
              perspective: "2000px",
              transformStyle: "preserve-3d",
              minHeight: "60vh",
              maxHeight: "85vh",
            }}
            initial={{ opacity: 0, rotateX: -45, rotateY: 10, scale: 0.8, y: 80 }}
            animate={{
              opacity: 1,
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              y: 0,
              transition: {
                duration: 0.9,
                type: "spring",
                stiffness: 120,
                damping: 15,
              },
            }}
            exit={{
              opacity: 0,
              rotateX: 25,
              rotateY: -10,
              scale: 0.9,
              y: 60,
              transition: { duration: 0.5 },
            }}
            onClick={(e) => e.stopPropagation()} // ✅ Prevent close when clicking inside
          >


            {/* Left: Image Preview */}
            <div className="relative md:w-1/2 w-full bg-gray-100 flex items-center justify-center overflow-hidden p-3">
              <AnimatePresence mode="wait">
                <motion.img
                  key={
                    generatedUrl
                      ? "generated"
                      : isCustomize
                        ? "customize"
                        : "sample"
                  }
                  src={
                    generatedUrl
                      ? generatedUrl
                      : isCustomize
                        ? template.customImage
                        : template.sampleImage
                  }
                  alt={template.title}
                  className="object-contain w-full h-auto max-h-[70vh] rounded-lg"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                />
              </AnimatePresence>
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Right: Info + Customize */}
            <motion.div
              className="relative md:w-1/2 w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex flex-col justify-start bg-white h-full overflow-y-auto"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            >
              <button
                onClick={() => {
                  handleBack();
                  onClose();
                }}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow hover:bg-white transition z-[999]" // ✅ ensure z-index is high
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>


              <div className="mt-8 sm:mt-10 mb-3 sm:mb-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2C4E86] mb-1 sm:mb-2">
                  {template.title}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-2 sm:mb-3">
                  {template.description}
                </p>
                <p className="text-[#2C4E86] font-semibold text-xl sm:text-2xl">
                  ₹{template.price}
                </p>
              </div>

              {/* Show form only when customizing */}
              <AnimatePresence mode="wait">
                  <motion.div
                    key="preview"
                    className="flex flex-col items-center mt-4 sm:mt-6 gap-4 sm:gap-7"
                    initial={{ opacity: 0, y: 30, rotateX: -10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, rotateX: 10 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.33, 1, 0.68, 1],
                    }}
                  >
                    <motion.button
                      // onClick={() => setIsCustomize(true)}
                       onClick={handleCustomize}
                      className="flex items-center gap-2 bg-[#2C4E86] text-white px-6 py-2 rounded-md hover:bg-[#1f3a5f] transition text-sm md:text-base"
                      whileHover={{ scale: 1.05, rotateY: 5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 150, damping: 12 }}
                    >
                      <FiEdit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                      Customize Template
                    </motion.button>

                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2  gap-2 sm:gap-3 w-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {[
                        { icon: "📊", label: "Promote GST & Taxation Courses" },
                        { icon: "📢", label: "Engage Students Effectively" },
                        { icon: "💼", label: "Professional Marketing Design" },
                        { icon: "⚡", label: "Easy to Customize Templates" },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          className="border border-[#2C4E86] border-dashed rounded-lg py-2 sm:py-3 text-center text-xs sm:text-sm text-gray-600 hover:shadow-md transition"
                          whileHover={{
                            scale: 1.08,
                            rotateY: 8,
                            rotateX: 3,
                            boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                          }}
                          transition={{ type: "spring", stiffness: 120 }}
                        >
                          <div className="text-base sm:text-lg">{item.icon}</div>
                          <div className="px-1">{item.label}</div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TemplateModal;