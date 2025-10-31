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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl flex flex-col md:flex-row overflow-hidden"
            style={{
              perspective: "2000px",
              transformStyle: "preserve-3d",
              minHeight: "750px",
              maxHeight: "90vh",
            }}
            initial={{
              opacity: 0,
              rotateX: -45,
              rotateY: 10,
              scale: 0.8,
              y: 80,
            }}
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
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            exit={{
              opacity: 0,
              rotateX: 25,
              rotateY: -10,
              scale: 0.9,
              y: 60,
              transition: {
                duration: 0.5,
                ease: [0.55, 0.06, 0.68, 0.19],
              },
            }}
            whileHover={{
              rotateY: 3,
              scale: 1.02,
              transition: { type: "spring", stiffness: 100 },
            }}
          >
            {/* Left: Image Preview */}
            <div className="relative md:w-1/2 bg-gray-100 flex flex-col items-center justify-center overflow-hidden p-4">
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
                  className="object-contain w-full h-full max-h-[700px] rounded-xl"
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
              className="relative md:w-1/2 w-full px-8 py-6 flex flex-col justify-start bg-white h-full"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            >
              <button
                onClick={() => {
                  handleBack();
                  onClose();
                }}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow hover:bg-white transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <div className="mt-10 mb-4">
                <h2 className="text-4xl font-bold text-[#2C4E86] mb-2">
                  {template.title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-3">
                  {template.description}
                </p>
                <p className="text-[#2C4E86] font-semibold text-2xl">
                  ₹{template.price}
                </p>
              </div>

              {/* Show form only when customizing */}
              <AnimatePresence mode="wait">
                {!isCustomize ? (
                  <motion.div
                    key="preview"
                    className="flex flex-col items-center mt-6 gap-7"
                    initial={{ opacity: 0, y: 30, rotateX: -10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, rotateX: 10 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.33, 1, 0.68, 1],
                    }}
                  >
                    <motion.button
                      onClick={() => setIsCustomize(true)}
                      className="flex items-center gap-2 bg-[#2C4E86] text-white px-6 py-2 rounded-md hover:bg-[#1f3a5f] transition text-sm md:text-base"
                      whileHover={{ scale: 1.05, rotateY: 5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 150, damping: 12 }}
                    >
                      <FiEdit3 className="w-5 h-5" />
                      Customize Template
                    </motion.button>

                    <motion.div
                      className="grid grid-cols-1 gap-3 w-full"
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
                          className="border border-[#2C4E86] border-dashed rounded-lg py-3 text-center text-sm text-gray-600 hover:shadow-md transition"
                          whileHover={{
                            scale: 1.08,
                            rotateY: 8,
                            rotateX: 3,
                            boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                          }}
                          transition={{ type: "spring", stiffness: 120 }}
                        >
                          <div className="text-lg">{item.icon}</div>
                          <div>{item.label}</div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    className="-top-4 flex flex-col justify-start"
                    initial={{ opacity: 0, y: 30, rotateX: -10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, rotateX: 10 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.33, 1, 0.68, 1],
                    }}
                  >
                    <motion.button
                      onClick={handleBack}
                      className="flex items-center gap-2 text-[#2C4E86] mb-3 hover:underline"
                      whileHover={{ x: -3 }}
                      transition={{ type: "spring", stiffness: 120 }}
                    >
                      <span className="text-lg">←</span>
                      Back to Template
                    </motion.button>

                    <motion.div
                      className="space-y-5 mb-4"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-[#2C4E86]">
                        <FaUserAlt className="text-gray-500 mr-3" />
                        <input
                          type="text"
                          name="centerName"
                          placeholder="Center Name"
                          value={formData.centerName}
                          onChange={handleChange}
                          className="w-full text-base focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-[#2C4E86]">
                        <FaEnvelope className="text-gray-500 mr-3" />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full text-base focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-[#2C4E86]">
                        <FaPhoneAlt className="text-gray-500 mr-3" />
                        <input
                          type="text"
                          name="mobile"
                          placeholder="Mobile Number"
                          value={formData.mobile}
                          onChange={handleChange}
                          className="w-full text-base focus:outline-none"
                        />
                      </div>

                      {(template.type === "Demo1" ||
                        template.type === "Demo2" ||
                        template.type === "Announcement") && (
                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-[#2C4E86]">
                          <FaCalendarAlt className="text-gray-500 mr-3" />
                          <input
                            type="text"
                            name="dateTime"
                            placeholder="Date / Time or Message"
                            value={formData.dateTime || ""}
                            onChange={handleChange}
                            className="w-full text-base focus:outline-none"
                          />
                        </div>
                      )}

                      <div className="flex items-start border border-gray-300 rounded-md px-3 py-2 focus-within:border-[#2C4E86]">
                        <FaMapMarkerAlt className="text-gray-500 mt-1 mr-3" />
                        <textarea
                          name="address"
                          placeholder="Address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full text-base focus:outline-none resize-none"
                        />
                      </div>
                    </motion.div>

                    <PosterCustomizer
                      template={template}
                      formData={formData}
                      setGeneratedUrl={setGeneratedUrl}
                      canvasRef={canvasRef}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TemplateModal;
