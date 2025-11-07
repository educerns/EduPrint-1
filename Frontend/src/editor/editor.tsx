import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/editor/sidebar/sidebar";
import Header from "./header";
import FabricCanvas from "./canvas";
import { useEditorStore } from "@/store/store";
import { staticTemplates } from "@/data/freeTemplate";
import * as  fabric  from "fabric";
import Properties from "./sidebar/properties";

// ✅ Type for Template
interface TemplateData {
  id?: number;
  _id?: string;
  title?: string;
  width?: number;
  height?: number;
  canvasData?: any;
  background?: string;
  customImage?: string;
}

// ✅ Mocked API helper
async function getUserDesignById(
  id: string | number
): Promise<{ status: number; data: TemplateData }> {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        const template = staticTemplates.find(
          (item) => item.id === Number(id) || item._id === id
        );

        if (template) {
          resolve({
            status: 200,
            data: template,
          });
        } else {
          reject({
            status: 404,
            message: `Template with id ${id} not found`,
          });
        }
      }, 300);
    } catch (error) {
      reject({
        status: 500,
        message: "Internal mock API error",
        error,
      });
    }
  });
}

const Editor: React.FC = () => {
  const { id: designId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [loadAttempted, setLoadAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { canvas, setDesignId, resetStore, setName, setShowProperties, showProperties, isEditing } = useEditorStore();

  // 🧹 Reset + set design ID when route changes
  useEffect(() => {
    resetStore();
    if (designId) {
      
      setDesignId(designId);
      console.log("🎨 Editor opened with design ID:", designId);
    }
  }, [designId, resetStore, setDesignId]);

  // 🕓 Simulate loading
  useEffect(() => {
    if (!designId) {
      setError("No template ID found in route");
      setIsLoading(false);
      return;
    }
    const timer = setTimeout(() => {
      setLoadAttempted(true);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [designId]);

  // 🧩 Canvas ready log
  useEffect(() => {
    if (canvas) console.log("✅ Canvas is now available in editor");
  }, [canvas]);

  // 🎨 Load design data once canvas + id available
const loadDesign = useCallback(async () => {
  if (!canvas || !designId || loadAttempted) return;

  try {
    setIsLoading(true);
    setLoadAttempted(true);

    const response = await getUserDesignById(designId);
    const design = response.data;

    if (!design) {
      setError("No design found");
      return;
    }

    // ✅ Move it here
    setName(design.title || "Untitled design");
    setDesignId(designId);
console.log("Setting name to:", design.title);


      // ✅ CASE 1: Fabric JSON design
      if (design.canvasData) {
        canvas.clear();

        // Optional width/height
        if (design.width && design.height) {
          canvas.setDimensions({
            width: design.width,
            height: design.height,
          });
        }

        const canvasData =
          typeof design.canvasData === "string"
            ? JSON.parse(design.canvasData)
            : design.canvasData;

        const hasObjects =
          canvasData.objects && canvasData.objects.length > 0;

        canvas.backgroundColor = canvasData.background || "#ffffff";

        if (!hasObjects) {
          canvas.renderAll();
          return;
        }

        canvas.loadFromJSON(canvasData, () => {
          canvas.renderAll();
          console.log("🖼️ Canvas JSON loaded successfully");
        });
      }

      // ✅ CASE 2: Static template image
      else if (design.customImage) {
        console.log("🖼️ Loading static template image...");
        canvas.clear();

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = design.customImage;

        img.onload = () => {
          const fabricImage = new fabric.Image(img, {
            left: 0,
            top: 0,
            selectable: false,
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height,
          });
          canvas.add(fabricImage);
          canvas.sendToBack(fabricImage);
          canvas.renderAll();
          console.log("✅ Template image loaded:", design.title);
        };

        img.onerror = () => {
          setError("Failed to load template image");
        };
      }

      // ✅ CASE 3: Fallback
      else {
        canvas.clear();
        canvas.backgroundColor = "#ffffff";
        canvas.renderAll();
      }
    } catch (e) {
      console.error("❌ Failed to load design", e);
      setError("Failed to load design");
    } finally {
      setIsLoading(false);
    }
  }, [canvas, designId, loadAttempted, setDesignId]);

  // ⏳ Run loader once both are ready
  useEffect(() => {
    if (designId && canvas && !loadAttempted) loadDesign();
    else if (!designId) navigate("/");
  }, [canvas, designId, loadAttempted, loadDesign, navigate]);

  useEffect(() => {
    if(!canvas) return;

    const handleSelectionCreated = () =>{
      const activeObject = canvas.getActiveObject();

      if(activeObject){
          setShowProperties(true)
      }
    }
    const handleSelectionCleared = () =>{
      setShowProperties(false)
    }

    canvas.on('selection:created', handleSelectionCreated)
    canvas.on('selection:updated', handleSelectionCreated)
    canvas.on('selection:cleared', handleSelectionCleared)

    return () =>{
       canvas.off('selection:created', handleSelectionCreated)
    canvas.off('selection:updated', handleSelectionCreated)
    canvas.off('selection:cleared', handleSelectionCleared)
    }


  }, [canvas])

  // 🌀 Loading UI
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-lg text-gray-700">
        Loading design...
      </div>
    );

  // ⚠️ Error UI
  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-red-100 text-red-600 text-lg">
        ⚠️ Error: {error}
      </div>
    );

  // ✅ Main Editor layout
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isEditing && <Sidebar />}
       <div className="flex-1 flex flex-col overflow-hidden relative">
         <main className="flex-1 overflow-hidden bg-[#f0f0f0] flex items-center justify-center relative">
          <FabricCanvas />
        </main>
       </div>
      </div>
      {
        showProperties && isEditing && <Properties />
      }
    </div>
  );
};

export default Editor;
