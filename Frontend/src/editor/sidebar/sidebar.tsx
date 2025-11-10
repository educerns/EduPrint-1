import React, { useState, MouseEvent } from "react";
import {
  Grid,
  Type,
  Upload,
  Sparkle,
  Settings,
  ArrowLeft,
  ChevronLeft,
  Palette,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ElementsPanel from "./element";
import TextPanel from "./text";
import UploadPanel from "./upload";
import AiPanel from "./aipanel";
import SettingPanel from "./settings";

type SidebarItem = {
  id: string;
  icon: React.ElementType;
  label: string;
  panel: React.FC;
};

const Sidebar: React.FC = () => {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<string | null>(null);

  const sidebarItems: SidebarItem[] = [
    { id: "element", icon: Grid, label: "Elements", panel: ElementsPanel },
    { id: "text", icon: Type, label: "Text", panel: TextPanel },
    { id: "upload", icon: Upload, label: "Upload", panel: UploadPanel },
    // { id: "ai", icon: Sparkle, label: "AI", panel: AiPanel },
    { id: "settings", icon: Palette, label: "Background", panel: SettingPanel },
  ];

  const handleItemClick = (id: string) => {
    if (id === activeSidebar) {
      // Toggle collapse if same item clicked again
      setIsPanelCollapsed(!isPanelCollapsed);
    } else {
      setActiveSidebar(id);
      setIsPanelCollapsed(false);
    }
  };

  const closeSecondaryPanel = () => {
    setActiveSidebar(null);
  };

  const togglePanelCollapsed = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  const activeItem = sidebarItems.find((item) => item.id === activeSidebar);
  const ActivePanel = activeItem?.panel;

  return (
    <div className="flex h-full">
      {/* LEFT SIDEBAR MENU */}
      <aside className="flex flex-col bg-gray-900 text-white w-16 border-r border-gray-700">
        {sidebarItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`p-3 flex flex-col items-center cursor-pointer hover:bg-gray-800 transition-all ${
              activeSidebar === item.id
                ? "bg-gray-800 border-l-4 border-blue-500"
                : ""
            }`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-[10px]">{item.label}</span>
          </div>
        ))}
      </aside>

     {/* RIGHT SECONDARY PANEL */}
      <AnimatePresence>
{activeSidebar && (
  <motion.div
            key={activeSidebar}
            initial={{ x: 300, opacity: 0 }}
            animate={{
              x: isPanelCollapsed ? 300 : 0,
              opacity: isPanelCollapsed ? 0 : 1,
              width: isPanelCollapsed ? 0 : 320,
            }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="relative bg-white border-r border-gray-300 overflow-visible"
          >
    {/* Panel Header */}
    <div className="flex items-center justify-between px-3 py-2 border-b">
      <button
        className="flex items-center text-gray-600 hover:text-black"
        onClick={closeSecondaryPanel}
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span className="font-medium">{activeItem?.label}</span>
      </button>
    </div>

    {/* Panel Content */}
     <motion.div
              className="p-3 overflow-y-auto h-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {ActivePanel && <ActivePanel />}
            </motion.div>

    {/* Collapse Toggle Arrow (middle right) */}
  <motion.button
              onClick={togglePanelCollapsed}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-all z-[100]"
              style={{ overflow: "visible" }}
            >
  <ChevronLeft
    className={`w-5 h-5 text-gray-700 transition-transform duration-300 ${
      isPanelCollapsed ? "rotate-180" : ""
    }`}
  />
</motion.button>

  </motion.div>
)}
</AnimatePresence>
    </div>
  );
};

export default Sidebar;
