import { create } from "zustand";
import type { Canvas } from "fabric";

interface EditorStore {
  canvas: Canvas | null;
  designId: string | null;
  isEditing: boolean;
  name: string;
  showProperties: boolean;
  setCanvas: (canvas: Canvas | null) => void;
  setDesignId: (id: string | null) => void;
  setIsEditing: (flag: boolean) => void;
  setName: (value: string) => void;
  setShowProperties: (flag: boolean) => void;
  resetStore: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  canvas: null,
  designId: null,
  isEditing: true,
  name: "untitled design", // ✅ initial value
  showProperties: false,

  setCanvas: (canvas) => {
    set({ canvas });
    if (canvas) centerCanvas(canvas);
  },

  setDesignId: (id) => set({ designId: id }),
  setIsEditing: (flag) => set({ isEditing: flag }),
  setName: (value) => set({ name: value }),
  setShowProperties: (flag) => set({ showProperties: flag }),


  resetStore: () => {
    set({
      canvas: null,
      designId: null,
      isEditing: true,
      name: "untitled design",
      showProperties: false, 
    });
  },
}));

// ✅ Export it so others can use it
export function centerCanvas(canvas: Canvas) {
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

