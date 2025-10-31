import React, { useEffect, useState } from "react";
// import axios from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
// import ColorfulLoader from "./ColorfulLoader";
// import Lottie from "lottie-react";
// import noDataAnimation from "../assets/no-data.json";
// import noInternet from "../assets/noInternet.json";
// import { useSidebar } from "../Context/SidebarContext";
import TemplateModal from "../components/ui/templateModal";
import {staticTemplates} from "../data/freeTemplate";

export interface Template {
   id: number;
  _id?: string;
  title: string;
  description: string;
  sampleImage: string;
  customImage: string;
  price: number;
  type: string;
}

const TemplateGallery: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [error, setError] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const { sidebarOpen } = useSidebar();

  // 🌐 Track online/offline state
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setError(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setError(true);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 📦 Load templates (simulate API)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (!navigator.onLine) {
        setError(true);
        setIsLoading(false);
        return;
      }
      setTemplates(staticTemplates as Template[]);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const openModal = (template: Template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTemplate(null), 300);
  };

  // 🎬 Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren" as const,
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <>
      {/* {isLoading && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-75">
          <ColorfulLoader />
        </div>
      )} */}

      <div
        className={`px-4 py-10 overflow-x-auto bg-white relative transition-all duration-300 `}
      >
        
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <motion.div
                className="mb-8 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4E86]">
                  Marketing Templates Gallery
                </h1>
                <p className="text-gray-500 mt-2">
                  Explore all uploaded marketing and promotional templates
                </p>
              </motion.div>

              {/* 🧩 Grid of Templates */}
              <AnimatePresence mode="wait">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12"
                >
                  {templates.map((template, index) => (
                    <motion.div
                      key={template._id || index}
                      layout
                      variants={cardVariants}
                      whileHover={{
                        scale: 1.02,
                      }}
                      transition={{
                        layout: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
                      }}
                      className="flex flex-col cursor-pointer"
                      onClick={() => openModal(template)}
                    >
                      {/* 🖼️ Template Image */}
                      <div className="w-full aspect-square  overflow-hidden">
                        {template.sampleImage ? (
                          <motion.img
                            layout
                            src={template.sampleImage}
                            alt={template.title}
                            className="w-full h-full object-fill transition-transform duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="flex items-center justify-center bg-gray-100 h-full text-gray-400 text-sm">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* 📘 Info below image */}
                      <div className="mt-2">
                        <h3 className="text-base font-medium text-gray-800 truncate">
                          {template.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-snug">
                          {template.description}
                        </p>
                        {/* 💰 Price + Type */}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-semibold text-xs">
                            ₹{template.price}
                          </span>
                          <span
                            className={`shrink-0 text-[10.5px] font-medium text-white px-2 py-0.5 rounded-full bg-gray-700 m-0.5`}
                          >
                            {template.type === "Demo1" ||
                            template.type === "Demo2" ||
                            template.type === "Demo3"
                              ? "Demo"
                              : template.type === "Registration1" ||
                                template.type === "Registration2"
                              ? "Registration"
                              : template.type === "Promotion1" ||
                                template.type === "Promotion2" ||
                                template.type === "Promotion3" ||
                                template.type === "Promotion4" ||
                                template.type === "Promotion5"
                              ? "Promotion"
                              : "Other"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          
          <TemplateModal
          isOpen={isModalOpen}
          onClose={closeModal}
          template={selectedTemplate}
        />
      </div>
    </>
  );
};

export default TemplateGallery;
