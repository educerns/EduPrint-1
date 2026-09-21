import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

import TemplateModal from "../components/ui/templateModal";
import QuarterBurstLoaderStatic from "./ui/multiArcLoader";

// 🔥 Import your existing Shadcn Pagination components
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination"; // Adjust the path if needed

export interface Template {
  _id: string;
  title: string;
  description: string;
  image: string;
  customImage: string;
  price: number;
  type: string;
  createdAt?: string;
}

const TemplateGallery: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Pagination & Filter States
  const [filter, setFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("Newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modal States
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Reset page to 1 when changing category or sort order
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sortOrder]);

  // 📡 Fetch Data from Backend
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const apiParams = {
          type: filter,
          sortOrder: sortOrder,
          page: currentPage,
          limit: 12, // Fetching 12 to fill exactly 3 rows of 4
        };

        const res = await axios.get("/eduprint/gettemplates", { params: apiParams });
        
        if (res.data.success) {
          setTemplates(res.data.data);
          setTotalPages(res.data.totalPages || 1);
        }
      } catch (err) {
        console.error("Failed to load templates:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [filter, sortOrder, currentPage]);

  const openModal = (template: Template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTemplate(null), 300);
  };

  // 🧠 Helper function to render Shadcn Pagination Items
  const renderPaginationItems = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink 
            href="#" 
            onClick={(e) => { e.preventDefault(); setCurrentPage(1); }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={currentPage === i}
            onClick={(e) => { e.preventDefault(); setCurrentPage(i); }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            href="#" 
            onClick={(e) => { e.preventDefault(); setCurrentPage(totalPages); }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  // ✨ Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren" as const,
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="px-4 py-10 bg-white overflow-x-auto min-h-screen">
      <div className={`max-w-7xl mx-auto transition-all duration-300 ${isLoading ? 'blur-sm pointer-events-none' : ''}`}>
        
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

        {/* 🗂️ Category & Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {["All", "Demo", "Registration", "Promotion", "Festival"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all ${
                  filter === tab
                    ? "bg-[#2C4E86] text-white border-[#2C4E86]"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#2C4E86]"
          >
            <option value="Newest">Newest First</option>
            <option value="A-Z">A to Z</option>
            <option value="Z-A">Z to A</option>
          </select>
        </div>

        {/* 🚨 Error State */}
        {error && !isLoading && (
          <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg">
            <p>Failed to load templates. Please check your connection and try again.</p>
          </div>
        )}

        {/* 📭 Empty State */}
        {!isLoading && !error && templates.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No templates found for this category.</p>
          </div>
        )}

        {/* 🧩 Render Templates Grid */}
        {!error && templates.length > 0 && (
          <motion.div className="mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage + filter + sortOrder}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
              >
                {templates.map((template) => (
                  <motion.div
                    key={template._id}
                    variants={cardVariants}
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col cursor-pointer group"
                    onClick={() => openModal(template)}
                  >
                    <div className="w-full aspect-square overflow-hidden rounded-lg shadow-sm border border-gray-200 bg-gray-50 relative">
                      {template.image ? (
                        <img
                         src={`${import.meta.env.VITE_API_URL}${template.image}`}
                          alt={template.title}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="mt-3 px-1">
                      <h3 className="text-base font-semibold text-gray-800 truncate">
                        {template.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-snug">
                        {template.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* 📄 Shadcn Pagination Implementation */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="mt-12 mb-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      if (currentPage > 1) setCurrentPage(currentPage - 1); 
                    }} 
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1); 
                    }} 
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

      </div>

      <TemplateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        template={selectedTemplate}
      />

      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <QuarterBurstLoaderStatic />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateGallery;