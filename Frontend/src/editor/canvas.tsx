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
    ("🔧 FabricCanvas component mounted");

    const cleanUpCanvas = () => {
      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.off();
          fabricCanvasRef.current.off('object:added');
          fabricCanvasRef.current.off('object:modified');
          fabricCanvasRef.current.off('object:removed');
          fabricCanvasRef.current.off('path:created');
        } catch (e) {
          console.error('Error removing event listeners', e);
        }
      }

      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.dispose();
          // console.log("🧹 Fabric canvas disposed");
        } catch (e) {
          console.error("Error disposing canvas:", e);
        }
      }
      fabricCanvasRef.current = null;
      setCanvas(null);
    };

    const initCanvas = async () => {
      // console.log("🔧 Starting canvas initialization...");

      if (
        typeof window === "undefined" ||
        !canvasRef.current ||
        initAttemptedRef.current
     )
       {
      //   console.log("🔧 Skipping init:", {
      //     window: typeof window !== "undefined",
      //     canvasRef: !!canvasRef.current,
      //     initAttempted: initAttemptedRef.current
      //   });
        return;
      }

      initAttemptedRef.current = true;

      try {
        const fabricCanvas = await initializeFabric(
          canvasRef.current,
          containerRef.current || undefined
        );

        if (!fabricCanvas) {
          console.error("❌ Failed to initialize Fabric.js canvas");
          return;
        }

        fabricCanvasRef.current = fabricCanvas;
        setCanvas(fabricCanvas);

        // console.log("✅ Canvas initialized and setCanvas called!");

        const handleCanvasChange = () => {
          // console.log('CanvasObject changed || path changed');
        };

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
  <div
    ref={containerRef}
    className="
      relative 
      flex justify-center items-center
      h-screen overflow-auto
      w-full md:w-10/12 lg:w-7/12 xl:w-8/12
      mx-auto
     
    "
  >      <canvas
      ref={canvasRef}
      className="max-w-full max-h-full object-contain"
    />
    </div>
  );
};

export default FabricCanvas;