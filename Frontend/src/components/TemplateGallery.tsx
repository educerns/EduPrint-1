import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TemplateModal from "../components/ui/templateModal";
import { groupedTemplates } from "../data/freeTemplate";
import { useNavigate } from "react-router-dom";

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
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();


  const openModal = (template: Template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTemplate(null), 300);
  };

  // ✨ Motion Variants
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
const handleTemplateClick = (template: Template) => {
  // console.log("🖱 Template clicked:", template);

  // Use either _id (from database) or id (from local data)
  const templateId = template._id || template.id;

  if (templateId) {
    // console.log("✅ Navigating to:", `/editor/${templateId}`);
    navigate(`/editor/${templateId}`);
  } else {
    console.warn("⚠️ Template has no id or _id!");
  }
};



  return (
    <div className="px-4 py-10 bg-white overflow-x-auto">
      <div className="max-w-7xl mx-auto">
        {/* 🏷️ Header */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4E86]">
            Marketing Templates Gallery
          </h1>
          <p className="text-gray-500 mt-2">
            Explore categorized marketing and promotional templates
          </p>
        </motion.div>

        {/* 🧩 Grouped Templates by Category */}
        {groupedTemplates.map((group, idx) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.2 }}
            className="mb-16"
          >
            {/* 🏁 Category Heading */}
            <h2 className="text-xl font-bold text-[#2C4E86] mb-6 border-l-4 border-[#2C4E86] pl-3">
              {group.category} Templates
            </h2>

            {/* 📦 Templates Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-10"
              >
                {group.templates.map((template, index) => (
                  <motion.div
                    key={template._id || `${group.category}-${index}`}
                    layout
                    variants={cardVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{
                      layout: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
                    }}
                    className="flex flex-col cursor-pointer"
                     onClick={() => openModal(template)}
                    // onClick={() => handleTemplateClick(template)}
                  >
                   {/* 🖼️ Template Image */}
                    <div className="w-full aspect-square overflow-hidden"> 
                    {template.sampleImage ?
                     ( 
                     <motion.img
                      layout src={template.sampleImage} 
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
                    <div className="mt-3">
                      <h3 className="text-base font-semibold text-gray-800 truncate">
                        {template.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-snug">
                        {template.description}
                      </p>
                      {/* <div className="mt-2 flex items-center justify-between">
                        <span className="font-semibold text-xs">
                          ₹{template.price}
                        </span>
                        <span className="shrink-0 text-[10.5px] font-medium text-white px-2 py-0.5 rounded-full bg-gray-700 m-0.5">
                          {group.category}
                        </span>
                      </div> */}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* 🪟 Modal */}
      <TemplateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        template={selectedTemplate}
      />
    </div>
  );
};

export default TemplateGallery;