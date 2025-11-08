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

import ElementsPanel from "./panel";
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
    // { id: "elements", icon: Grid, label: "Elements", panel: ElementsPanel },
    { id: "text", icon: Type, label: "Text", panel: TextPanel },
    // { id: "upload", icon: Upload, label: "Upload", panel: UploadPanel },
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
{activeSidebar && (
  <div
    className={`relative bg-white border-r border-gray-300 transition-all duration-300 ${
      isPanelCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-80 opacity-100"
    }`}
  >
    {/* Panel Header */}
    <div className="flex items-center justify-between bg-gray-100 px-3 py-2 border-b">
      <button
        className="flex items-center text-gray-600 hover:text-black"
        onClick={closeSecondaryPanel}
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span className="font-medium">{activeItem?.label}</span>
      </button>
    </div>

    {/* Panel Content */}
    <div className="p-3 overflow-y-auto h-full">
      {ActivePanel && <ActivePanel />}
    </div>

    {/* Collapse Toggle Arrow (middle right) */}
   <button
  onClick={togglePanelCollapsed}
  className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-all z-[9999]"
  style={{ overflow: "visible" }}
>
  <ChevronLeft
    className={`w-5 h-5 text-gray-700 transition-transform duration-300 ${
      isPanelCollapsed ? "rotate-180" : ""
    }`}
  />
</button>

  </div>
)}

    </div>
  );
};

export default Sidebar;
