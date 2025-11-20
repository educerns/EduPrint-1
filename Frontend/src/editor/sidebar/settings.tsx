import React, { useState } from "react";
import { Check, Palette } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useEditorStore, centerCanvas} from "@/store/store";

const colorPresets = [
   "#ffffff",
  "#f8f9fa",
  "#e9ecef",
  "#dee2e6",
  "#adb5bd",
  "#495057",
  "#212529",
  "#0d6efd",
  "#6610f2",
  "#6f42c1",
  "#d63384",
  "#dc3545",
  "#fd7e14",
  "#ffc107",
  "#198754",
  "#20c997",
  "#0dcaf0",
  "#f4f1ee",
  "#e9e4e0",
  "#dcd3cb",

  // ☁️ Cool pastels
  "#d0ebff", // baby blue
  "#cfe7e1", // mint gray
  "#d6e2f0", // soft blue-gray
  "#cddaf2", // lavender blue
  "#e5eaf6", // periwinkle tint

  // 🌸 Warm pastels / nudes
  "#fde2e4", // blush pink
  "#f9dcc4", // cream peach
  "#ffedd8", // vanilla
  "#e8dff5", // lilac mist
  "#fce1e4", // rose tint
  "#f8ebe7", // nude beige

  // 🌿 Muted earthy tones
  "#e3d5ca", // taupe
  "#d6ccc2", // clay
  "#f5ebe0", // light sand
  "#d5bdaf", // mocha cream
];

const SettingPanel: React.FC = () => {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
 const {canvas} = useEditorStore(); 


  const handleColorChange =(event)=>{
 setBackgroundColor(event.target.value)
  }

  const handlePesetColorApply =(getCurrentColor)=>{
setBackgroundColor(getCurrentColor)
  }

  const handleChangeApply =()=>{
    if(!canvas) return;
    canvas.set("backgroundColor", backgroundColor);
    canvas.renderAll();

    centerCanvas(canvas);
  }

  return (
    <div className="p-4 space-y-6">
      {/* HEADER */}
      <div className="flex items-center space-x-2 mb-4">
        <Palette className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Choose Background Color</h3>
      </div>

      {/* COLOR GRID */}
      <div className="grid grid-cols-6 gap-2 mb-3">
        <TooltipProvider>
          {colorPresets.map((color) => (
            <Tooltip key={color}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handlePesetColorApply(color)}
                  style={{ backgroundColor: color }}
                  
                  className={`w-8 h-8 rounded-md border transition-transform hover:scale-110 ${
                    color === backgroundColor
                      ? "ring-2 ring-offset-2 ring-purple-500"
                      : ""
                  }`}
                >
                  {color === backgroundColor && (
                    <Check className="w-4 h-4 text-white mx-auto drop-shadow-md" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <span>{color}</span>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      <div className="mt-3 flex space-x-2">
          <div className="relative">
<input 
type="color"
value={backgroundColor}
onChange={handleColorChange}
className={`w-12 h-10 p-1 cursor-pointer`}
/>
<input 
type="text"
value={backgroundColor}
onChange={handleColorChange}
className={`flex-1`}
placeholder="#FFFFFF"
/>
          </div>
      </div>
      <Separator className="my-4  "/>
      <button className="w-1/2 flex ml-12 rounded-md py-2 justify-center bg-blue-900 hover:bg-blue-950 text-white" onClick={handleChangeApply}>
        Apply Changes
      </button>
    </div>
  );
};

export default SettingPanel;