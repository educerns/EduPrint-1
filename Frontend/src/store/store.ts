import { create } from "zustand";
import type { Canvas } from "fabric"; // 👈 import Fabric.js Canvas type

interface EditorStore {
  canvas: Canvas | null; // 👈 Use Fabric's Canvas, not HTMLCanvasElement
  designId: string | null;
  setCanvas: (canvas: Canvas | null) => void; // 👈 updated to match
  setDesignId: (id: string | null) => void;
  resetStore: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  canvas: null,
  designId: null,

  setCanvas: (canvas) => {
    set({ canvas });
    if (canvas) centerCanvas(canvas);
  },

  setDesignId: (id) => set({ designId: id }),

  resetStore: () => {
    set({
      canvas: null,
      designId: null,
    });
  },
}));

function centerCanvas(canvas: Canvas) {
  // ✅ You can now use Fabric.js APIs safely
  console.log("Centering Fabric.js canvas:", canvas);

  // Example centering logic:
  const { width, height } = canvas;
  const wrapper = canvas.wrapperEl;
  if (wrapper) {
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";
    wrapper.style.width = `${width}px`;
    wrapper.style.height = `${height}px`;
  }
}
