// src/components/FabricCanvas.tsx
import React, { useEffect, useRef } from "react";
import { initializeFabric } from "@/fabric/fabric-utils";
import { useEditorStore } from "@/store/store";

const FabricCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fabricCanvasRef = useRef<any>(null);
  const initAttemptedRef = useRef(false);
  const { setCanvas } = useEditorStore();

  useEffect(() => {
    const cleanUpCanvas = () => {
      if (fabricCanvasRef.current){
        try{
            fabricCanvasRef.current.off();


        fabricCanvasRef.current.off('object:added');
        fabricCanvasRef.current.off('object:modified');
        fabricCanvasRef.current.off('object:removed');
        fabricCanvasRef.current.off('path:created');
        }catch(e){
          console.error('Error removing event listeners', e)
        }
      }

      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.dispose();
          console.log("🧹 Fabric canvas disposed");
        } catch (e) {
          console.error("Error disposing canvas:", e);
        }
      }
      fabricCanvasRef.current = null;
      setCanvas(null);
    };

    cleanUpCanvas();
    initAttemptedRef.current = false;

    const initCanvas = async () => {
      if (
        typeof window === "undefined" ||
        !canvasRef.current ||
        initAttemptedRef.current
      ) {
        return;
      }

      initAttemptedRef.current = true;

      try {
        const fabricCanvas = await initializeFabric(
          canvasRef.current, // ✅ Proper HTMLCanvasElement
          containerRef.current || undefined
        );

        if (!fabricCanvas) {
          console.error("❌ Failed to initialize Fabric.js canvas");
          return;
        }

        fabricCanvasRef.current = fabricCanvas;
        setCanvas(fabricCanvas);

        console.log("✅ Canvas initialized and stored in Zustand");

        // 🎨 Add your custom style controls (sliders, buttons, color pickers, etc.) here
        // setupCustomControls(fabricCanvas);
        const handleCanvasChange = () =>{
          console.log('CanvasObject changed || path changed');
          
        }

        fabricCanvas.on('object:added', handleCanvasChange);
        fabricCanvas.on('object:modified', handleCanvasChange);
        fabricCanvas.on('object:removed', handleCanvasChange);
        fabricCanvas.on('path:created', handleCanvasChange);



      } catch (e) {
        console.error("❌ Failed to initialize Fabric.js canvas:", e);
      }
    };

    const timer = setTimeout(initCanvas, 50);

    return () => {
      clearTimeout(timer);
      cleanUpCanvas();
    };
  }, [setCanvas]);

  return (
   <div ref={containerRef} className="relative w-full h-[600px] overflow-auto ">
  <canvas ref={canvasRef} className="" />
</div>

  );
};

export default FabricCanvas;
