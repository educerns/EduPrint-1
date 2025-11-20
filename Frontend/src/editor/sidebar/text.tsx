import React from "react";
import { Type } from "lucide-react";
import { useEditorStore } from "@/store/store";
import * as fabric from "fabric";
import { addTextToCanvas } from "@/fabric/fabric-utils";

const textPresets = [
  {
    name: "Heading",
    text: "Add a Heading",
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: "Inter, sans-serif",
  },
  {
    name: "Subheading",
    text: "Add a Subheading",
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Inter, sans-serif",
  },
  {
    name: "Body Text",
    text: "Add a little bit of text",
    fontSize: 16,
    fontWeight: "normal",
    fontFamily: "Inter, sans-serif",
  },
  {
    name: "Caption",
    text: "Add a caption",
    fontSize: 12,
    fontWeight: "normal",
    fontFamily: "Inter, sans-serif",
    fontStyle: "italic",
  },
];

const TextPanel: React.FC = () => {
  const { canvas } = useEditorStore();

  const addText = (preset) => {
    if (!canvas) return;

    const text = new fabric.Textbox(preset.text, {
      fontSize: preset.fontSize,
      fontWeight: preset.fontWeight,
      fontFamily: preset.fontFamily,
      fontStyle: preset.fontStyle || "normal",
      fill: "#000000",
      left: canvas.width / 2,
      top: canvas.height / 2,
      textAlign: "center",
      originX: "center",
      originY: "center",
      editable: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const handleAddCustomTextBox = () =>{
    if(!canvas) return

    addTextToCanvas(canvas, 'Enter text here', {fontSize: 24})
  }

  const handleAddPresetText = (currentPreset) =>{
        if(!canvas) return
  addTextToCanvas(canvas, currentPreset.text, currentPreset)
  }


  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Add Text Button */}
        <button
          onClick={handleAddCustomTextBox}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center justify-center"
        >
          <Type className="mr-2 w-5 h-5" />
          <span className="font-medium">Add a text box</span>
        </button>

        {/* Presets */}
        <div className="pt-2">
          <h4 className="text-sm font-medium text-gray-800 mb-4">
            Default Text Styles
          </h4>
          <div className="space-y-2">
            { textPresets.map((preset, index) => (
  <button
    key={index}
onClick={() => handleAddPresetText(preset)}
    className="w-full text-left p-3 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
    style={{
      fontSize: `${Math.min(preset.fontSize / 1.8, 24)}px`,
      fontWeight: preset.fontWeight,
      fontStyle: preset.fontStyle || "normal",
      fontFamily: preset.fontFamily,
    }}
  >
    {preset.text}
  </button>
)) }

          </div>
        </div>
      </div>
    </div>
  );
};

export default TextPanel;