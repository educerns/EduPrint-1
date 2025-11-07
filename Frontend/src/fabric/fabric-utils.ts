// src/fabric/fabric-utils.ts
import { Canvas as FabricCanvas, PencilBrush, Rect } from "fabric";

export const initializeFabric = async (
  canvasEl: HTMLCanvasElement,
  containerEl?: HTMLElement
) => {
  try {
    const containerWidth = containerEl?.clientWidth || 600;
    const containerHeight = containerEl?.clientHeight || 600;

    canvasEl.width = containerWidth;
    canvasEl.height = containerHeight;

    // 🖌️ Initialize Fabric canvas
    const fabricCanvas = new FabricCanvas(canvasEl, {
      preserveObjectStacking: true,
      isDrawingMode: false,
      renderOnAddRemove: true,
    });

    // 🟢 Set visible background color
    fabricCanvas.backgroundColor = "#ffcccc";
    fabricCanvas.renderAll();

    // ✏️ Setup a default brush
    const brush = new PencilBrush(fabricCanvas);
    brush.color = "#000000";
    brush.width = 10;
    fabricCanvas.freeDrawingBrush = brush;

    console.log(
      "✅ Fabric initialized with size:",
      fabricCanvas.width,
      fabricCanvas.height
    );

    // 🟩 Add a debug rectangle (optional)
    // const rect = new Rect({
    //   left: 50,
    //   top: 50,
    //   fill: "green",
    //   width: 100,
    //   height: 100,
    // });
    // fabricCanvas.add(rect);
    // fabricCanvas.renderAll();

    return fabricCanvas;
  } catch (e) {
    console.error("❌ Failed to initialize fabric:", e);
    return null;
  }
};

export const addTextToCanvas = async(canvas, text, option={}, withBackground =false) =>{
  if (!canvas) return null;
  try{
    const {IText} = await import ('fabric')
    const defaultProps={
      left: 100,
      top: 100,
      fontSize: 24,
      fontFamily: 'Arial',
      fill: '#000000',
      padding: withBackground?10: 0,
      textAlign: 'left',
      id: `text-${Date.now()}`
    }

    const textObj = new IText(text,{
      ...defaultProps,
      ...option,
    })

    canvas.add(textObj)
    canvas.setActiveObject(textObj)
    canvas.renderAll()

    return textObj
  }catch(e){
return null
  }
}
