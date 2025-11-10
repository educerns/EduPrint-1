import React, { useEffect, useRef, useState } from "react";
import type * as FabricNamespace from "fabric";
import { shapeDefinitions } from "@/fabric/shapes/shape-defination";
import { useEditorStore } from "@/store/store";
import { addShapeToCanvas } from "@/fabric/fabric-utils";

function ElementsPanel() {
  const { canvas } = useEditorStore();

  // ✅ Properly typed refs
  const miniCanvasRef = useRef<Record<string, FabricNamespace.StaticCanvas>>({});
  const canvasElementRef = useRef<Record<string, HTMLCanvasElement | null>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  const shapeTypes = Object.keys(shapeDefinitions);

  useEffect(() => {
    if (isInitialized) return;

    const timer = setTimeout(async () => {
      try {
        // ✅ Safely load the fabric library (handles default + named export cases)
        const fabricModule: any = await import("fabric");
        const fabric: typeof FabricNamespace =
          fabricModule.fabric || fabricModule.default || fabricModule;

        for (const shapeType of shapeTypes) {
          const canvasElement = canvasElementRef.current[shapeType];
          if (!canvasElement) continue;

          const canvasId = `mini-canvas-${shapeType}-${Date.now()}`;
          canvasElement.id = canvasId;

          const definition = shapeDefinitions[shapeType];

          const miniCanvas = new fabric.StaticCanvas(canvasId, {
            width: 100,
            height: 100,
            backgroundColor: "transparent",
            renderOnAddRemove: true,
          });

          miniCanvasRef.current[shapeType] = miniCanvas;
          definition.thumbnail(fabric, miniCanvas);
          miniCanvas.renderAll();
        }

        setIsInitialized(true);
      } catch (err) {
        console.error("Error initializing mini canvases:", err);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isInitialized, shapeTypes]);

  // 🧹 Cleanup
  useEffect(() => {
    return () => {
      Object.values(miniCanvasRef.current).forEach((miniCanvas) => {
        try {
          miniCanvas?.dispose?.();
        } catch (e) {
          console.error("Error disposing canvas:", e);
        }
      });
      miniCanvasRef.current = {};
      setIsInitialized(false);
    };
  }, []);

  // ✅ Set canvas reference
  const setCanvasRef = (element: HTMLCanvasElement | null, shapeType: string) => {
    if (element) canvasElementRef.current[shapeType] = element;
  };

  const handleShapeClick = (type) =>{
    addShapeToCanvas(canvas, type);
  }

return (
  <div className="h-full overflow-y-auto bg-white">
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4">
        {shapeTypes.map((shapeType) => (
          <div
            key={shapeType}
            onClick={() => handleShapeClick(shapeType)}
            className="cursor-pointer flex flex-col items-center justify-center p-3  transition"
          >
            <canvas
              width={100}
              height={100}
              ref={(el) => setCanvasRef(el, shapeType)}
              className=""
            />
            <p className="text-xs mt-2 text-gray-700 font-medium text-center">
              {shapeDefinitions[shapeType].label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

}

export default ElementsPanel;
