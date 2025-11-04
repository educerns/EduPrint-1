import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TemplateModal from "../components/ui/templateModal";
import { groupedTemplates } from "../data/freeTemplate";

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

  const openModal = (template: Template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTemplate(null), 300);
  };

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

        {/* 🔽 Filter + Sort Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          {/* Filter */}
          <div className="flex flex-wrap gap-2">
            {["All", ...groupedTemplates.map(g => g.category)].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  filter === cat
                    ? "bg-[#2C4E86] text-white border-[#2C4E86]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          {/* <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:ring-2 focus:ring-[#2C4E86]"
          >
            <option value="A-Z">Sort: A → Z</option>
            <option value="Z-A">Sort: Z → A</option>
          </select> */}
        </div>

        {/* 📦 Templates Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10"
          >
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template._id || `${filter}-${index}`}
                layout
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                transition={{
                  layout: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
                }}
                className="flex flex-col cursor-pointer"
                onClick={() => openModal(template)}
              >
                {/* 🖼️ Template Image */}
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

                {/* 📘 Info below image */}
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
