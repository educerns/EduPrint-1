// src/fabric/fabric-utils.ts
import { Canvas as FabricCanvas, PencilBrush } from "fabric";

export const initializeFabric = async (
  canvasEl: HTMLCanvasElement,
  containerEl?: HTMLElement
) => {
  try {
    // 🖌️ Initialize Fabric canvas
    const fabricCanvas = new FabricCanvas(canvasEl, {
      preserveObjectStacking: true,
      isDrawingMode: false,
      renderOnAddRemove: true,
    });

    // ✏️ Setup a default brush
    const brush = new PencilBrush(fabricCanvas);
    brush.color = "#000000";
    brush.width = 10;
    fabricCanvas.freeDrawingBrush = brush;

    return fabricCanvas;
  } catch (e) {
    console.error("❌ Failed to initialize fabric:", e);
    return null;
  }
};

// 🧭 Optional utility to center and resize canvas dynamically
export const centerCanvas = (canvas: FabricCanvas | null) => {
  if (!canvas || !canvas.wrapperEl) return;

  const canvasWrapper = canvas.wrapperEl;

  canvasWrapper.style.width = `${canvas.width}px`;
  canvasWrapper.style.height = `${canvas.height}px`;

  canvasWrapper.style.position = `absolute`;

  canvasWrapper.style.top = "50%";
  canvasWrapper.style.width = "50%";

   canvasWrapper.style.transform = "translate(-50%, -50% )";




  const container = canvas.getElement().parentElement;
  if (!container) return;

  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  canvas.setDimensions({
    width: containerWidth,
    height: containerHeight,
  });

  canvas.renderAll();
};