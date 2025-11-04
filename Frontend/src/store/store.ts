import { create } from "zustand";

interface EditorStore {
  canvas: HTMLCanvasElement | null;
  designId: string | null;
  setCanvas: (canvas: HTMLCanvasElement) => void;
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

function centerCanvas(canvas: HTMLCanvasElement) {
  // Centering logic (placeholder)
  console.log("Centering canvas:", canvas);
}
