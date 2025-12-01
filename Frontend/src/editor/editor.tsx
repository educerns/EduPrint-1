import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/editor/sidebar/sidebar";
import Header from "./header";
import FabricCanvas from "./canvas";
import { useEditorStore } from "@/store/store";
import { staticTemplates } from "@/data/freeTemplate";
import * as fabric from "fabric";
import Properties from "./sidebar/properties";
import QuarterBurstLoader from "@/components/ui/multiArcLoader";
import { motion, AnimatePresence } from "framer-motion";
import QuarterBurstLoaderStatic from "@/components/ui/multiArcLoader";


const Editor: React.FC = () => {
  const { id: designId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  const {
    canvas,
    setDesignId,
    setName,
    setShowProperties,
    showProperties,
    isEditing,
  } = useEditorStore();

  // ⏱️ Simulate loading for 1-2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);


  // 🎨 Load template image when canvas is ready
  useEffect(() => {
    if (!canvas || !designId || templateLoaded) {
      return;
    }

    // console.log("✅ Canvas is ready, loading template...");

    const template = staticTemplates.find(
      (item) => item.id === Number(designId) || item._id === designId
    );

    // console.log("🔍 Template found:", template);

    if (!template) {
      setError("Template not found");
      return;
    }

    setName(template.title || "Untitled design");
    setDesignId(designId);
    // console.log("📝 Loading template:", template.title);
    // console.log("🖼️ Custom image path:", template.customImage);

    if (template.customImage) {
      canvas.clear();

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = template.customImage;

      // console.log("⏳ Starting to load image:", img.src);

      img.onload = () => {
        // console.log("✅ Image loaded:", img.width, "x", img.height);

        const container = canvas.getElement().parentElement;
        if (!container) {
          console.error("❌ Canvas container not found.");
          return;
        }

        // Create the fabric image
        const fabricImage = new fabric.Image(img, {
          selectable: false,
          evented: false,
        });

        canvas.add(fabricImage);

        // 🧠 Function to scale and center image dynamically
        const scaleAndCenterImage = () => {
          const containerW = container.clientWidth || 800;
          const containerH = container.clientHeight || 600;

          const paddingFactor = 0.95;
          const scale = Math.min(
            (containerW * paddingFactor) / img.width,
            (containerH * paddingFactor) / img.height
          );

          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;

          canvas.setDimensions({ width: containerW, height: containerH });

          fabricImage.set({
            left: (containerW - scaledWidth) / 2,
            top: (containerH - scaledHeight) / 2,
            scaleX: scale,
            scaleY: scale,
          });

          canvas.renderAll();
        };

        // ⚙️ Initial render
        scaleAndCenterImage();

        // ✅ Ensure background is at index 0
        const objects = canvas.getObjects();
        if (objects.length > 1) {
          canvas.remove(fabricImage);
          canvas.sendToBack(fabricImage);
        }

        // 🪄 Auto-recenter on resize
        const handleResize = () => {
          if (!(canvas as any).disposed) scaleAndCenterImage();
        };
        window.addEventListener("resize", handleResize);

        // 🧹 Cleanup on unmount / reload
        const cleanup = () => {
          // console.log("🧹 Cleaning up image and listeners...");
          window.removeEventListener("resize", handleResize);
          if (canvas.getObjects().includes(fabricImage)) {
            canvas.remove(fabricImage);
            canvas.renderAll();
          }
        };

        canvas.on("canvas:cleared", cleanup);
        canvas.on("object:removed", (e: any) => {
          if (e.target === fabricImage) cleanup();
        });

        // ✅ Mark template as loaded
        setTemplateLoaded(true);
        // console.log("✅ Template loaded successfully with scaling and centering");

        // 🧩 Center new or existing text boxes when editing starts
        canvas.on("text:editing:entered", (e: any) => {
          const active = e.target as fabric.IText;
          if (!active) return;

          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();
          const bounds = active.getBoundingRect();

          // Right panel offset (adjust if your sidebar width differs)
          const rightPanelOffset = 280;

          const isOffScreen =
            bounds.left + bounds.width / 2 < 0 ||
            bounds.top + bounds.height / 2 < 0 ||
            bounds.left > canvasWidth ||
            bounds.top > canvasHeight;

          if (isOffScreen || bounds.left < 100) {
            active.set({
              left:
                (canvasWidth - rightPanelOffset) / 2 -
                (active.width ?? 0) / 2,
              top: canvasHeight / 2 - (active.height ?? 0) / 2,
            });
            active.setCoords();
            canvas.renderAll();
            // console.log("📝 Text box auto-centered:", active.left, active.top);
          }
        });
      };

      img.onerror = (e) => {
        console.error("❌ Failed to load image:", template.customImage);
        console.error("❌ Error details:", e);
        setError("Failed to load template image");
      };
    } else {
      // console.log("⚠️ No custom image found");
      canvas.clear();
      canvas.backgroundColor = "#ffffff";
      canvas.renderAll();
      setTemplateLoaded(true);
    }
  }, [canvas, designId, templateLoaded, setName, setDesignId]);

  // 🎯 Selection handlers
  useEffect(() => {
    if (!canvas) return;

    const handleSelectionCreated = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        setShowProperties(true);
      }
    };

    const handleSelectionCleared = () => {
      setShowProperties(false);
    };

    canvas.on("selection:created", handleSelectionCreated);
    canvas.on("selection:updated", handleSelectionCreated);
    canvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      canvas.off("selection:created", handleSelectionCreated);
      canvas.off("selection:updated", handleSelectionCreated);
      canvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [canvas, setShowProperties]);

  // ⚠️ Error UI
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-100 text-red-600 text-lg">
        ⚠️ Error: {error}
      </div>
    );
  }

  // ✅ Main Editor
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
       {isLoading && (
    <div className="absolute inset-0 bg-white z-30"></div>
  )}
      <div className="flex flex-1 overflow-hidden">
        {isEditing && <Sidebar />}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <main className="flex-1 overflow-hidden bg-[#f0f0f0] flex items-center justify-center relative">
            <FabricCanvas />

            {/* <AnimatePresence>
              {!templateLoaded && (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[9999]"
                >
                  <QuarterBurstLoader />
                </motion.div>
              )}
            </AnimatePresence> */}
            {/* 🔄 Loader Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <QuarterBurstLoaderStatic />
          </motion.div>
        )}
      </AnimatePresence>
          </main>

        </div>
      </div>
      {showProperties && isEditing && <Properties />}
    </div>
  );
};

export default Editor;
