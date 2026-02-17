import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TemplateModal from "../components/ui/templateModal";
import { groupedTemplates } from "../data/freeTemplate";
import { useNavigate } from "react-router-dom";
import QuarterBurstLoaderStatic from "./ui/multiArcLoader";
import { Variants } from "framer-motion";

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
  const [filter, setFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("A-Z");

  // 🧩 Flatten all templates for "All" view
  const allTemplates = useMemo(
    () => groupedTemplates.flatMap(group => group.templates),
    []
  );

  // 🔍 Filter templates based on category
  const filteredTemplates = useMemo(() => {
    let templates =
      filter === "All"
        ? allTemplates
        : groupedTemplates.find(g => g.category === filter)?.templates || [];

    // 🔤 Sort templates
    if (sortOrder === "A-Z") {
      templates = [...templates].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "Z-A") {
      templates = [...templates].sort((a, b) => b.title.localeCompare(a.title));
    }

    return templates;
  }, [filter, sortOrder, allTemplates]);
    const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ⏱️ Simulate loading for 1-2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds

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

  // const cardVariants = {
  //   hidden: { opacity: 0, y: 40, scale: 0.95 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     scale: 1,
  //     transition: {
  //       duration: 0.6,
  //     },
  //   },
  // };
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotateX: -12,
    scale: 0.92,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    rotateX: 12,
    scale: 0.9,
    filter: "blur(6px)",
    transition: {
      duration: 0.4,
      ease: "easeInOut",
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
      <div className={`max-w-7xl mx-auto transition-all duration-300 ${isLoading ? 'blur-sm' : ''}`}>

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
          {/* 🗂️ Category Tabs */}
<div className="flex gap-3 mb-8">
  {["All", "Demo", "Registration", "Promotion"].map((tab) => (
    <button
      key={tab}
      onClick={() => setFilter(tab)}
      className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all
        ${
          filter === tab
            ? "bg-[#2C4E86] text-white border-[#2C4E86]"
            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
        }`}
    >
      {tab}
    </button>
  ))}
</div>


          {/* 🧩 Grouped Templates by Category */}
         <motion.div className="mb-16">
  <AnimatePresence mode="wait">
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      layout
       style={{ perspective: 1200 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10"
    >
      {filteredTemplates.map((template, index) => (
        <motion.div
          key={template._id || index}
          layout
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          transition={{
            layout: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
          }}
          className="flex flex-col cursor-pointer"
          onClick={() => openModal(template)}
        >
          {/* 🖼️ Image */}
          <div className="w-full aspect-square overflow-hidden">
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

          {/* 📘 Info */}
          <div className="mt-3">
            <h3 className="text-base font-semibold text-gray-800 truncate">
              {template.title}
            </h3>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-snug">
              {template.description}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </AnimatePresence>
</motion.div>

        </div>
      </div>

      {/* 🪟 Modal */}
      <TemplateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        template={selectedTemplate}
      />

      {/* 🔄 Loader Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <QuarterBurstLoaderStatic />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateGallery;