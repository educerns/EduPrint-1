import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Download, Eye, Pencil, ArrowLeft, ArrowRight } from "lucide-react";
// 🔥 1. Add useParams here
import { useNavigate, useParams } from "react-router-dom"; 
import { useEditorStore } from "@/store/store";
import ExportModel from "./export";

interface SessionUser {
  name?: string;
  image?: string;
}

export default function Header() {
  const { isEditing, setIsEditing, name, setName, canvas } = useEditorStore();
  const [showExportModel, setShowExportModel] = useState(false);
  const navigate = useNavigate();

  // 🔥 2. Extract the ID from the URL
  // Note: If your App.js route is path="/editor/:templateId", change { id } to { templateId }
  const { id } = useParams(); 

  // Mock session object (replace this later with your real auth data)
  const session: { user?: SessionUser } = {
    user: {
      name: "Educerns",
      image: "",
    },
  };

  useEffect(() => {
    if (!canvas) return;
    canvas.selection = isEditing;
    canvas.getObjects().forEach((obj) => {
      obj.selectable = isEditing;
      obj.evented = isEditing;
    });
  }, [isEditing]);

  return (
    <header className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-950 text-white shadow-md flex items-center justify-between px-4 h-14 relative z-[10000]">
      {/* LEFT: Mode switch & download */}
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center text-white font-medium focus:outline-none">
              <span>{isEditing ? "Editing" : "Viewing"}</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="bg-white text-gray-800 rounded-md shadow-md mt-2 p-1 min-w-[130px] border border-gray-200 z-[99999]"
          >
            <DropdownMenuItem
              onClick={() => setIsEditing(true)}
              className={`flex items-center px-2 py-1.5 rounded cursor-pointer hover:bg-blue-100 ${
                isEditing ? "bg-blue-50 font-semibold text-blue-700" : ""
              }`}
            >
              <Pencil className="mr-2 h-4 w-4 text-blue-600" />
              <span>Editing</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setIsEditing(false)}
              className={`flex items-center px-2 py-1.5 rounded cursor-pointer hover:bg-blue-100 ${
                !isEditing ? "bg-blue-50 font-semibold text-blue-700" : ""
              }`}
            >
              <Eye className="mr-2 h-4 w-4 text-blue-600" />
              <span>Viewing</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Download Button */}
        <button
          onClick={() => setShowExportModel(true)}
          className="flex items-center justify-center hover:bg-white/20 px-3 py-1.5 transition-colors duration-200 rounded-md"
        >
          <Download className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* CENTER: Editable name input */}
      <div className="flex-1 flex justify-center">
        <input
          className="text-center bg-transparent border-none text-white placeholder-white/60 w-64 focus:outline-none focus:border-b focus:border-white/40 px-3 py-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Template Name - "${name || "Untitled design"}"`}
        />
      </div>

      {/* RIGHT: Back button */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate("/templates")}
          className="flex items-center bg-transparent border-none text-white font-medium px-3 py-1.5 rounded-lg shadow-sm transition-all duration-200"
        >
           <span>Back</span>
          <ArrowRight className="h-4 w-4 mr-1" />
         
        </button>
      </div>
      
      {/* 🔥 3. Pass the ID securely into the ExportModel */}
      <ExportModel 
        isOpen={showExportModel} 
        onClose={() => setShowExportModel(false)}
        templateId={id} 
      />
    </header>
  );
}